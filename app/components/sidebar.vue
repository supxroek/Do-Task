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
import { Headset, ListTodo, LogOut, Settings, User2Icon } from '@lucide/vue';
import { useAuth } from '~/composables/useAuth';
import { appNavigation } from '~/lib/navigation';
import Popover from './ui/popover/Popover.vue';
import PopoverContent from './ui/popover/PopoverContent.vue';
import PopoverTrigger from './ui/popover/PopoverTrigger.vue';

const auth = useAuth();
const route = useRoute();

function isActive(path: string) {
    return route.path === path || route.path.startsWith(`${path}/`);
}

const currentPageTitle = computed(() => {
    const activeItem = appNavigation.find((item) => isActive(item.path));

    if (activeItem) {
        return activeItem.title;
    }

    return route.path
        .split('/')
        .filter(Boolean)
        .pop()
        ?.replaceAll('-', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? 'Dashboard';
});

const userName = computed(() => auth.user.value?.name || 'Account');
const userEmail = computed(() => auth.user.value?.email || 'Manage your workspace');

const userInitials = computed(() => {
    return userName.value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0]?.toUpperCase())
        .join('') || 'DT';
});
</script>

<template>
    <SidebarProvider>
        <Sidebar collapsible="icon">
            <SidebarHeader class="border-b border-sidebar-border/70">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" class="cursor-default gap-3">
                            <div
                                class="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                                <ListTodo class="size-4" />
                            </div>
                            <div class="grid min-w-0 flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">DoTask</span>
                                <span class="truncate text-xs text-sidebar-foreground/60">Workspace</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup class="px-2 py-3">
                    <SidebarGroupLabel class="px-2 text-[0.7rem] uppercase tracking-wide">
                        Pages
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem v-for="item in appNavigation" :key="item.path">
                                <SidebarMenuButton
                                    as-child
                                    :is-active="isActive(item.path)"
                                    :tooltip="item.title"
                                    class="h-9 text-sidebar-foreground/60 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-foreground"
                                >
                                    <NuxtLink
                                        :to="item.path"
                                        class="gap-3 text-sidebar-foreground/60 transition-colors data-[active=true]:text-sidebar-foreground data-[active=true]:font-semibold"
                                    >
                                        <component :is="item.icon" class="text-current" />
                                        <span>{{ item.title }}</span>
                                    </NuxtLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter class="border-t border-sidebar-border/70 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            as-child
                            :is-active="isActive('/support')"
                            tooltip="Support"
                            class="h-9 text-sidebar-foreground/60 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-foreground"
                        >
                            <NuxtLink
                                to="/support"
                                class="gap-3 text-sidebar-foreground/60 transition-colors data-[active=true]:text-sidebar-foreground data-[active=true]:font-semibold"
                            >
                                <Headset class="size-4 text-current" />
                                <span>Support</span>
                            </NuxtLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>

        <SidebarInset>
            <header
                class="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div class="flex min-w-0 items-center gap-2">
                    <SidebarTrigger class="-ml-1 cursor-pointer" />
                    <div class="h-4 w-px bg-border" />
                    <span class="truncate text-sm font-medium text-muted-foreground">
                        {{ currentPageTitle }}
                    </span>
                </div>

                <div class="flex min-w-0 items-center gap-2">
                    <Popover>
                        <PopoverTrigger as-child>
                            <button
                                type="button"
                                class="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div
                                    class="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                                    {{ userInitials }}
                                </div>
                                <div class="hidden min-w-0 text-sm leading-tight sm:grid">
                                    <span class="truncate font-semibold">{{ userName }}</span>
                                    <span class="truncate text-xs text-muted-foreground">{{ userEmail }}</span>
                                </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" align="end" class="w-56 p-1.5">
                            <div class="px-2 py-2">
                                <p class="truncate text-sm font-medium">{{ userName }}</p>
                                <p class="truncate text-xs text-muted-foreground">{{ userEmail }}</p>
                            </div>
                            <div class="my-1 h-px w-full bg-border" />
                            <SidebarMenu>
                                <SidebarMenuItem class="space-y-1">
                                    <SidebarMenuButton
                                        as-child
                                        :is-active="isActive('/profile')"
                                        tooltip="Profile"
                                        class="h-9 text-sidebar-foreground/60 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-foreground"
                                    >
                                        <NuxtLink
                                            to="/profile"
                                            class="gap-3 text-sidebar-foreground/60 transition-colors data-[active=true]:text-sidebar-foreground data-[active=true]:font-semibold"
                                        >
                                            <User2Icon class="size-4 text-current" />
                                            <span>Profile</span>
                                        </NuxtLink>
                                    </SidebarMenuButton>

                                    <SidebarMenuButton
                                        as-child
                                        :is-active="isActive('/settings')"
                                        tooltip="Settings"
                                        class="h-9 text-sidebar-foreground/60 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-foreground"
                                    >
                                        <NuxtLink
                                            to="/settings"
                                            class="gap-3 text-sidebar-foreground/60 transition-colors data-[active=true]:text-sidebar-foreground data-[active=true]:font-semibold"
                                        >
                                            <Settings class="size-4 text-current" />
                                            <span>Settings</span>
                                        </NuxtLink>
                                    </SidebarMenuButton>

                                    <div class="my-1 h-px w-full bg-border" />

                                    <SidebarMenuButton
                                        tooltip="Logout"
                                        class="h-9 cursor-pointer font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                                        @click="auth.logout()"
                                    >
                                        <LogOut class="size-4 text-current" />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>
            <main class="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <slot />
            </main>
        </SidebarInset>
    </SidebarProvider>
</template>
