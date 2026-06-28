<script setup lang="ts">
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { Car, Headset, ListTodo, LogOut, Settings, User2Icon } from '@lucide/vue';
import { useAuth } from '~/composables/useAuth';
import { appNavigation } from '~/lib/navigation';
import Popover from './ui/popover/Popover.vue';
import PopoverTrigger from './ui/popover/PopoverTrigger.vue';
import PopoverContent from './ui/popover/PopoverContent.vue';

const auth = useAuth();
const route = useRoute();

function isActive(path: string) {
    return route.path === path || route.path.startsWith(`${path}/`);
}
</script>

<template>
    <SidebarProvider>
        <Sidebar>

            <!-- Header Section -->
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div
                                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <ListTodo class="size-4" />
                            </div>
                            <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">DoTask</span>
                                <span class="truncate text-xs">Workspace</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <!-- Content Section -->
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem v-for="item in appNavigation" :key="item.path">
                                <SidebarMenuButton as-child :is-active="isActive(item.path)" :tooltip="item.title"
                                    class="text-gray-600 font-semibold cursor-pointer">
                                    <NuxtLink :to="item.path">
                                        <component :is="item.icon"
                                            :class="isActive(item.path) ? 'text-black' : 'hover:bg-muted'" />
                                        <span>{{ item.title }}</span>
                                    </NuxtLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <!-- Footer Section -->
            <SidebarFooter class="flex flex-col gap-8">

                <SidebarMenu>
                    <SidebarMenuItem class="flex flex-col gap-1">
                        <!-- <SidebarMenuButton as-child :is-active="isActive('/settings')" tooltip="Settings"
                            class="text-gray-600 font-semibold cursor-pointer">
                            <NuxtLink to="/settings" class="flex w-full items-center gap-2">
                                <Settings class="size-4" />
                                <span>Settings</span>
                            </NuxtLink>
                        </SidebarMenuButton> -->

                        <SidebarMenuButton as-child :is-active="isActive('/support')" tooltip="Support"
                            class="text-gray-600 font-semibold cursor-pointer">
                            <NuxtLink to="/support" class="flex w-full items-center gap-2">
                                <Headset class="size-4" />
                                <span>Support</span>
                            </NuxtLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>


        <!-- Display Section -->
        <SidebarInset>
            <header
                class="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div class="flex items-center gap-2 px-4">
                    <SidebarTrigger class="-ml-1 cursor-pointer" />
                    <div class="h-4 w-px bg-border" />
                    <span class="text-sm font-medium text-muted-foreground cursor-default">
                        {{appNavigation.find((item) => isActive(item.path))?.title ??
                            route.path.split('/').filter(Boolean).pop()?.replace('-', ' ').replace(/\b\w/g, l =>
                                l.toUpperCase())}}
                    </span>
                </div>

                <div class="flex items-center gap-2 px-4">
                    <Popover>
                        <PopoverTrigger as-child>
                            <div class="flex items-center gap-2">
                                <div
                                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors cursor-pointer">
                                    <Car class="size-4" />
                                </div>
                                <div class="grid flex-1 text-left text-sm leading-tight">
                                    <span class="truncate font-semibold">{{ auth?.user?.value?.name }}</span>
                                    <span class="truncate text-xs">{{ auth?.user?.value?.email }}</span>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" align="end" class="w-48 p-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton as-child :is-active="isActive('/profile')" tooltip="Profile"
                                        class="text-gray-600 font-semibold cursor-pointer" @click="">
                                        <NuxtLink to="/profile" class="flex w-full items-center gap-2">
                                            <User2Icon class="size-4" />
                                            <span>Profile</span>
                                        </NuxtLink>
                                    </SidebarMenuButton>

                                    <SidebarMenuButton as-child :is-active="isActive('/settings')" tooltip="Settings"
                                        class="text-gray-600 font-semibold cursor-pointer">
                                        <NuxtLink to="/settings" class="flex w-full items-center gap-2">
                                            <Settings class="size-4" />
                                            <span>Settings</span>
                                        </NuxtLink>
                                    </SidebarMenuButton>

                                    <div class="h-px w-full bg-border my-2" />

                                    <SidebarMenuButton tooltip="Logout"
                                        class="text-gray-600 font-semibold cursor-pointer" @click="auth.logout()">
                                        <LogOut />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>
            <main class="flex flex-1 flex-col gap-4 p-4">
                <slot />
            </main>
        </SidebarInset>
    </SidebarProvider>
</template>
