<script setup lang="ts">
import { Check, Circle, Dot } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { h, ref } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper'
import { Spinner } from '~/components/ui/spinner'

// Use the layout for the auth pages
definePageMeta({
    layout: "auth-default",
});

const isLoading = ref(false)
const isNextLoading = ref(false)
const isBackLoading = ref(false)

const formSchema = [
    z.object({
        fullName: z.string({ required_error: 'Full name is required' }).min(2).max(50),
        email: z.string({ required_error: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    }),
    z.object({
        password: z.string({ required_error: 'Password is required' }).min(2).max(50),
        confirmPassword: z.string({ required_error: 'Please confirm your password' }),
    }).refine(
        (values) => {
            return values.password === values.confirmPassword
        },
        {
            message: 'Passwords must match!',
            path: ['confirmPassword'],
        },
    ),
    z.object({
        birthday: z.string({ required_error: 'Birthday is required' }),
        gender: z.union([z.literal('male'), z.literal('female'), z.literal('other')], { required_error: 'Gender is required' }),
    }),
]

const stepIndex = ref(1)
const steps = [
    {
        step: 1,
        title: 'Your details',
        description: 'Provide your name and email',
    },
    {
        step: 2,
        title: 'Your password',
        description: 'Choose a password',
    },
    {
        step: 3,
        title: 'Your Information',
        description: 'Provide your birthday and gender',
    },
]

function onSubmit(values: any) {
    isLoading.value = true
    const registrationData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        birthday: values.birthday,
        gender: values.gender,
    }

    // Fetch the registration API endpoint and handle the response
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 201) {
                // Handle successful registration, e.g., redirect to login page
                console.log('Registration successful:', data)
                toast.success('Registration successful! Please log in.')

                // Redirect to login page
                setTimeout(() => {
                    useRouter().push('/auth/login')
                }, 3000)
            } else {
                // Handle registration error, e.g., show error message
                console.error('Registration failed:', data)
                toast.error('Registration failed: ' + data.message)
            }
        })
        .catch((error) => {
            console.error('Error during registration:', error)
            toast.error('An error occurred during registration.')
        })
        .finally(() => {
            setTimeout(() => {
                isLoading.value = false
            }, 500)
            isNextLoading.value = false
            isBackLoading.value = false
        })
}

function handleNext(nextStep: () => void) {
    isNextLoading.value = true
    setTimeout(() => {
        nextStep()
        isNextLoading.value = false
    }, 1000)
}

function handleBack(prevStep: () => void) {
    isBackLoading.value = true
    if (stepIndex.value === 1) {
        return navigateTo('/auth/login', { replace: true })
    }
    setTimeout(() => {
        prevStep()
        isBackLoading.value = false
    }, 1000)
}
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#F5E9D8] p-4">
        <Card class="w-full max-w-lg min-w-0 overflow-hidden shadow-lg shadow-black/20 gap-0">
            <CardHeader>
                <div class="flex h-20 items-center justify-center overflow-hidden">
                    <img src="/DoTask-Logo.png" alt="Logo" class="mx-auto h-40 w-auto object-cover" />
                </div>
                <CardTitle class="hidden sm:flex justify-center text-lg font-bold">
                    Create your account
                </CardTitle>
                <CardDescription class="hidden sm:flex justify-center text-center">
                    Fill in your details to get started
                </CardDescription>
            </CardHeader>
            <CardContent class="min-w-0">
                <Form v-slot="{ meta, values, validate }" as="" keep-values
                    :validation-schema="toTypedSchema(formSchema[stepIndex - 1]!)">
                    <Stepper v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep, modelValue }"
                        v-model="stepIndex" class="block w-full min-w-0 overflow-x-hidden">
                        <form @submit="(e) => {
                            e.preventDefault()
                            validate()
                            if (stepIndex === steps.length && meta.valid) {
                                onSubmit(values)
                            }
                        }">
                            <h2 class="text-lg font-semibold text-center sm:hidden">{{ steps[stepIndex - 1]?.title }}
                            </h2>
                            <p class="text-sm text-center text-muted-foreground mb-2 sm:hidden">{{ steps[stepIndex -
                                1]?.description }}</p>
                            <div class="flex w-full min-w-0 gap-1 overflow-x-hidden sm:gap-2 sm:p-2">
                                <StepperItem v-for="(step, index) in steps" :key="step.step" v-slot="{ state }"
                                    class="relative flex min-w-0 w-full flex-col p-2 items-center justify-baseline text-center"
                                    :step="step.step">
                                    <div>
                                        <StepperSeparator v-if="index !== steps.length - 1"
                                            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-6 h-0.5 rounded-full bg-black group-data-[state=completed]:bg-primary" />
                                        <StepperTrigger as-child>
                                            <Button
                                                :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                                                size="icon" class="z-10 shrink-0 rounded-full"
                                                :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                                                :disabled="state !== 'completed' && (index >= (modelValue || 0) && !meta.valid)">
                                                <Check v-if="state === 'completed'" class="size-5" />
                                                <Circle v-if="state === 'active'" />
                                                <Dot v-if="state === 'inactive'" />
                                            </Button>
                                        </StepperTrigger>
                                    </div>
                                    <div class="hidden mt-5 sm:block flex-col items-center text-center">
                                        <StepperTitle :class="[state === 'active' && 'text-primary']"
                                            class="max-w-20 whitespace-normal wrap-break-word text-sm font-semibold leading-tight transition sm:max-w-none sm:whitespace-nowrap lg:text-sm">
                                            {{ step.title }}
                                        </StepperTitle>
                                        <StepperDescription :class="[state === 'active' && 'text-primary']"
                                            class="hidden text-xs text-muted-foreground transition sm:block lg:text-xs">
                                            {{ step.description }}
                                        </StepperDescription>
                                    </div>
                                </StepperItem>
                            </div>

                            <div class="mt-4 flex min-w-0 flex-col gap-4">
                                <!-- Step 1: Full Name and Email -->
                                <template v-if="stepIndex === 1">
                                    <FormField v-slot="{ componentField }" name="fullName">
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" v-bind="componentField" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                    <FormField v-slot="{ componentField }" name="email">
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" v-bind="componentField" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                </template>

                                <!-- Step 2: Password and Confirm Password -->
                                <template v-if="stepIndex === 2">
                                    <FormField v-slot="{ componentField }" name="password">
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" v-bind="componentField" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                    <FormField v-slot="{ componentField }" name="confirmPassword">
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" v-bind="componentField" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                </template>

                                <!-- Step 3: Birthday and Gender -->
                                <template v-if="stepIndex === 3">
                                    <FormField v-slot="{ componentField }" name="birthday">
                                        <FormItem>
                                            <FormLabel>Birthday</FormLabel>
                                            <FormControl>
                                                <Input type="date" v-bind="componentField" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                    <FormField v-slot="{ componentField }" name="gender">
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select v-bind="componentField">
                                                <FormControl>
                                                    <SelectTrigger class="w-full!">
                                                        <SelectValue placeholder="Select a gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="male">
                                                            Male
                                                        </SelectItem>
                                                        <SelectItem value="female">
                                                            Female
                                                        </SelectItem>
                                                        <SelectItem value="other">
                                                            Other
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </FormField>
                                </template>
                            </div>
                            <div class="mt-4 flex items-center justify-between gap-3">
                                <Button variant="outline" size="sm" class="cursor-pointer"
                                    @click="handleBack(prevStep)">
                                    <Spinner v-if="isBackLoading" class="mr-2 h-4 w-4 animate-spin" />
                                    Back
                                </Button>
                                <div class="flex items-center gap-3">
                                    <Button v-if="stepIndex !== 3" :type="meta.valid ? 'button' : 'submit'"
                                        :disabled="isNextDisabled" size="sm" class="cursor-pointer"
                                        @click="meta.valid && handleNext(nextStep)">
                                        <Spinner v-if="isNextLoading" class="mr-2 h-4 w-4 animate-spin" />
                                        Next
                                    </Button>
                                    <Button v-if="stepIndex === 3" size="sm" type="submit" class="cursor-pointer">
                                        <Spinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Stepper>
                </Form>
            </CardContent>
        </Card>
    </div>
</template>
