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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'

// Use the layout for the auth pages
definePageMeta({
    layout: "auth-default",
});

// Register form state
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const birthday = ref('')
const gender = ref('')

const handleRegister = async () => {
    // Fetch the register API endpoint and handle the response

    const registerData = {
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        name: name.value,
        birthday: birthday.value,
        gender: gender.value,
    }

    await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 200) {
                // Handle successful registration, e.g., redirect to login page
                console.log('Registration successful:', data)

                // Redirect to login page or another page
                useRouter().push('/auth/login')
            } else {
                // Handle registration error, e.g., show error message
                console.error('Registration failed:', data.message)
            }
        })
        .catch((error) => {
            console.error('Error during registration:', error)
        })

}

</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-background">
        <Card class="w-full max-w-sm">
            <CardHeader>
                <CardTitle class="text-lg font-bold flex justify-center">Register for an account</CardTitle>
                <CardDescription class="flex justify-center">
                    Enter your details below to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleRegister">
                    <div class="grid w-full items-center gap-4">
                        <div class="flex flex-col space-y-1.5">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="email" type="email" placeholder="m@example.com" />
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <Label for="password">Password</Label>
                            <Input id="password" v-model="password" type="password" />
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <Label for="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" v-model="confirmPassword" type="password" />
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <Label for="name">Name</Label>
                            <Input id="name" v-model="name" type="text" placeholder="John Doe" />
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <Label for="birthday">Birthday</Label>
                            <Input id="birthday" v-model="birthday" type="date" />
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <Label for="gender">Gender</Label>
                            <Select v-model="gender" class="">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Select a gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Genders</SelectLabel>
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
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter class="flex flex-col gap-2">
                <Button class="w-full" @click="handleRegister">
                    Register
                </Button>
                <div class="flex justify-center mt-2">
                    <NuxtLink href="/auth/login" class="text-sm underline">
                        Already have an account? Login
                    </NuxtLink>
                </div>
            </CardFooter>
        </Card>
    </div>
</template>
