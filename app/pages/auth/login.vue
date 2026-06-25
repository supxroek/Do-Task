<script setup lang="ts">
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
import { Label } from '@/components/ui/label'

// Use the layout for the auth pages
definePageMeta({
    layout: "auth-default",
});


// Login form state
const email = ref('')
const password = ref('')

const handleLogin = async () => {
    // Fetch the login API endpoint and handle the response

    const loginData = {
        email: email.value,
        password: password.value,
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
                console.error('Login failed:', data.message)
            }
        })
        .catch((error) => {
            console.error('Error during login:', error)
        })

}

</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-background">
        <Card class="w-full max-w-sm">
            <CardHeader>
                <CardTitle class="text-lg font-bold flex justify-center">Login to your account</CardTitle>
                <CardDescription class="flex justify-center">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleLogin">
                    <div class="grid w-full items-center gap-4">
                        <div class="flex flex-col space-y-1.5">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="email" type="email" placeholder="m@example.com" />
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <div class="flex items-center">
                                <Label for="password">Password</Label>
                            </div>
                            <Input id="password" v-model="password" type="password" />
                            <NuxtLink href="#" class="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </NuxtLink>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter class="flex flex-col gap-2">
                <Button class="w-full" @click="handleLogin">
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
