<script setup lang="ts">
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp'
import { Input } from '@/components/ui/input'
import { Stepper } from '@/components/ui/stepper'
import { Spinner } from '~/components/ui/spinner'

definePageMeta({
    layout: 'auth-default',
})

const isLoading = ref(false)
const isNextLoading = ref(false)
const stepIndex = ref(1)

const emailSchema = [
    z.object({
        email: z.string({ required_error: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    }),
    z.object({
        confirmationCode: z.string().min(6, 'Confirmation code must be 6 characters'),
    }),
    z.object({
        newPassword: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    }).refine((values) => values.newPassword === values.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    }),
]

const steps = [
    { step: 1, title: 'Your email', description: 'Enter your email address' },
    { step: 2, title: 'Confirmation Code', description: 'Enter the code sent to your email' },
    { step: 3, title: 'Reset your password', description: 'Set a new password' },
]

async function handleNext(validate: () => Promise<any>, values: any) {
    isNextLoading.value = true

    try {
        const result = await validate()
        const valid = result && typeof result === 'object' ? result.valid : !!result

        if (!valid) return

        switch (stepIndex.value) {
            case 1:
                await sendConfirmationCode({
                    email: values.email,
                })
                break

            case 2:
                await verifyConfirmationCode({
                    email: values.email,
                    confirmationCode: values.confirmationCode,
                })
                break
        }
    } finally {
        isNextLoading.value = false
    }
}

async function sendConfirmationCode(values: any) {
    isLoading.value = true
    try {
        await $fetch('/api/auth/forgot-password/send-code', {
            method: 'POST',
            body: values,
        })
        toast.success('Confirmation code sent successfully')
        stepIndex.value = 2 // Move to the next step after sending the confirmation code
    } catch (error: any) {
        toast.error(error?.data?.message || 'An error occurred while sending the confirmation code')

        // testing
        // stepIndex.value = 2
    } finally {
        setTimeout(() => {
            isLoading.value = false
        }, 500) // Add a delay of 500ms before setting isLoading to false
    }
}

async function verifyConfirmationCode(values: any) {
    isLoading.value = true
    try {
        await $fetch('/api/auth/forgot-password/verify-code', {
            method: 'POST',
            body: values,
        })
        toast.success('Confirmation code verified successfully')
        stepIndex.value = 3 // Move to the next step after verifying the confirmation code
    } catch (error: any) {
        toast.error(error?.data?.message || 'An error occurred while verifying the confirmation code')

        // testing
        // stepIndex.value = 3
    } finally {
        setTimeout(() => {
            isLoading.value = false
        }, 500)
    }
}

async function handleSubmit(values: any) {
    isLoading.value = true
    try {
        await $fetch('/api/auth/forgot-password', {
            method: 'POST',
            body: values,
        })
        toast.success('Reset password email sent successfully')
        // stepIndex.value = 3 // Move to the next step after successful submission
    } catch (error: any) {
        toast.error(error?.data?.message || 'An error occurred while sending the reset password email')
    } finally {
        setTimeout(() => {
            isLoading.value = false
        }, 500)
    }
}
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#F5E9D8] p-4">
        <Card class="w-full max-w-lg min-w-0 overflow-hidden gap-0 shadow-lg shadow-black/20">
            <CardHeader>
                <div class="flex h-20 items-center justify-center overflow-hidden">
                    <img src="/DoTask-Logo.png" alt="Logo" class="mx-auto h-40 w-auto object-cover" />
                </div>
                <CardTitle class="flex justify-center text-lg font-bold">
                    Forgot Password
                </CardTitle>
                <CardDescription class="flex justify-center text-center">
                    Enter your email to reset your password
                </CardDescription>
            </CardHeader>

            <CardContent class="min-w-0">
                <Form v-slot="{ meta, values, validate }" as="" keep-values
                    :validation-schema="toTypedSchema(emailSchema[stepIndex - 1]!)">
                    <Stepper v-model="stepIndex" class="block w-full min-w-0 overflow-x-hidden">
                        <form @submit.prevent="async () => {
                            const result = await validate()
                            const valid = result && typeof result === 'object' ? result.valid : !!result
                            if (stepIndex === steps.length && valid && meta.valid) {
                                handleSubmit(values)
                            }
                        }">
                            <div class="mt-6 flex min-w-0 flex-col gap-4">
                                <template v-if="stepIndex === 1">
                                    <FormField name="email" v-slot="{ componentField }">
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input v-bind="componentField" placeholder="Enter your email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                </template>

                                <template v-else-if="stepIndex === 2">
                                    <FormField name="confirmationCode" v-slot="{ componentField }">
                                        <div class="flex flex-col items-center gap-2">
                                            <FormItem>
                                                <FormLabel>Confirmation Code</FormLabel>
                                                <FormControl>
                                                    <InputOTP :maxlength="6" v-bind="componentField">
                                                        <InputOTPGroup class="flex w-full items-center justify-center">
                                                            <InputOTPSlot :index="0" />
                                                            <InputOTPSlot :index="1" />
                                                            <InputOTPSlot :index="2" />
                                                        </InputOTPGroup>

                                                        <InputOTPSeparator />

                                                        <InputOTPGroup class="flex w-full items-center justify-center">
                                                            <InputOTPSlot :index="3" />
                                                            <InputOTPSlot :index="4" />
                                                            <InputOTPSlot :index="5" />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                    </FormField>
                                </template>

                                <template v-else>
                                    <FormField name="newPassword" v-slot="{ componentField }">
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" v-bind="componentField"
                                                    placeholder="Enter your new password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>

                                    <FormField name="confirmPassword" v-slot="{ componentField }">
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" v-bind="componentField"
                                                    placeholder="Confirm your new password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                </template>
                            </div>

                            <div class="mt-4 flex items-center justify-end gap-3">
                                <Button v-if="stepIndex !== 3" type="button" size="sm" class="cursor-pointer"
                                    :disabled="isNextLoading || isLoading" @click="handleNext(validate, values)">
                                    <Spinner v-if="isNextLoading" class="mr-2 h-4 w-4 animate-spin" />
                                    {{ stepIndex === 1 ? 'Send Code' : 'Verify Code' }}
                                </Button>

                                <Button v-else size="sm" type="submit" class="cursor-pointer" :disabled="isLoading">
                                    <Spinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Stepper>
                </Form>
            </CardContent>
        </Card>
    </div>
</template>