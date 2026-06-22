<script lang="ts" setup>
// use definePageMeta to set the layout for this page
definePageMeta({
    layout: "auth-default",
});

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import Button from "~/components/ui/button/Button.vue";
import Input from "~/components/ui/input/Input.vue";

interface LoginForm {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
}

const form = ref<LoginForm>({
    email: "",
    password: "",
});

const handleLogin = async () => {
    // Handle login logic here
    if (!form.value.email || !form.value.password) {
        alert("Please fill in both email and password.");
        return;
    }

    const result = await $fetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: {
            email: form.value.email,
            password: form.value.password,
        },
    });

    // const response: LoginResponse = result as LoginResponse;

    if (!result.success) {
        alert("Login failed: " + result.message);
    } else {
        alert("Login successful!");
        // Store the token in localStorage or a cookie
        localStorage.setItem("token", result.token);
        // Redirect to the dashboard or another protected route
        useRouter().push("/tasks");
    }
};

</script>

<template>
    <div class="w-full h-screen flex items-center justify-center p-2 md:p-4 bg-gray-100/50">
        <div class="w-full max-w-md flex flex-col p-8 gap-4 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
            <FormField name="email">
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input v-model="form.email" type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField name="password">
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input v-model="form.password" type="password" placeholder="Enter your password" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button class="w-full hover:bg-black/85 cursor-pointer" variant="default" @click="handleLogin">
                Login
            </Button>
        </div>
    </div>
</template>
