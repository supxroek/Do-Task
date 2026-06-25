<script setup lang="ts">
import bcrypt from 'bcrypt'
import { useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Use the layout for the auth pages
definePageMeta({
    layout: "auth-default",
});

const formSchema = z.object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(3, { message: 'Password must be at least 3 characters' }),
})

const form = useForm({
    defaultValues: {
        email: '',
        password: '',
    },
    validators: {
        onSubmit: formSchema,
    },
    onSubmit: async ({ value }: { value: z.infer<typeof formSchema> }) => {
        toast('You submitted the following values:', {
            description: h(
                'pre',
                {
                    class:
                        'bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4',
                },
                h('code', JSON.stringify(value, null, 2)),
            ),
            position: 'bottom-right',
            class: 'flex flex-col gap-2',
            style: {
                '--border-radius': 'calc(var(--radius)  + 4px)',
            },
        })

        // Fetch the login API endpoint and handle the response
        const loginData = {
            email: value.email,
            password: value.password,
        }

        await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    // Handle successful login, e.g., redirect to dashboard
                    console.log('Login successful:', data)

                    // Redirect to dashboard or another page
                    useRouter().push('/dashboard')
                } else {
                    // Handle login error, e.g., show error message
                    console.error('Login failed:', data)
                }
            })
            .catch((error) => {
                console.error('Error during login:', error)
            })
    },
})

function isInvalid(field: any) {
    return field.state.meta.isTouched && !field.state.meta.isValid
}


</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-[#F5E9D8] p-4">
        <Card class="w-full max-w-sm shadow-lg shadow-black/20">
            <CardHeader>
                <div class="w-auto h-20 overflow-hidden flex justify-center items-center">
                    <img src="/DoTask-Logo.png" alt="Logo" class="mx-auto mb-4 w-auto h-40 object-cover" />
                </div>
                <CardTitle class="text-lg font-bold flex justify-center">Login to your account</CardTitle>
                <CardDescription class="flex justify-center text-center">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-tanstack-login" @submit.prevent="form.handleSubmit">
                    <div class="grid w-full items-center gap-4">
                        <FieldGroup>
                            <form.Field name="email">
                                <template #default="{ field }">
                                    <Field :data-invalid="isInvalid(field)">
                                        <FieldLabel :for="field.name">
                                            Email
                                        </FieldLabel>
                                        <Input :id="field.name" :name="field.name" :model-value="field.state.value"
                                            :aria-invalid="isInvalid(field)" placeholder="you@example.com"
                                            autocomplete="off" @blur="field.handleBlur"
                                            @input="field.handleChange($event.target.value)" />
                                        <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
                                    </Field>
                                </template>
                            </form.Field>
                            <form.Field name="password">
                                <template #default="{ field }">
                                    <Field :data-invalid="isInvalid(field)">
                                        <FieldLabel :for="field.name">
                                            Password
                                        </FieldLabel>
                                        <Input :id="field.name" :name="field.name" type="password"
                                            :model-value="field.state.value" :aria-invalid="isInvalid(field)"
                                            placeholder="********" autocomplete="off" @blur="field.handleBlur"
                                            @input="field.handleChange($event.target.value)" />
                                        <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
                                    </Field>
                                    <div class="flex justify-end">
                                        <NuxtLink href="/auth/forgot-password" class="text-sm underline">
                                            Forgot your password?
                                        </NuxtLink>
                                    </div>
                                </template>
                            </form.Field>
                        </FieldGroup>
                    </div>
                </form>
            </CardContent>
            <CardFooter class="flex flex-col gap-2">
                <Button type="submit" form="form-tanstack-login" class="w-full cursor-pointer" variant="default">
                    Login
                </Button>
                <div class="flex justify-center mt-2">
                    <NuxtLink href="/auth/register" class="text-sm underline">
                        Don't have an account? Register
                    </NuxtLink>
                </div>
            </CardFooter>
        </Card>
    </div>
</template>
