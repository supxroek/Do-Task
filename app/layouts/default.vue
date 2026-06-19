<script setup>
import {
  BadgeCheck,
  Bell,
  Headset,
  NotepadText,
  Settings,
  UserRound,
} from "@lucide/vue";
</script>

<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div class="px-4 py-4 flex items-center h-16 gap-2">
        <h2 class="m-0 text-2xl font-bold">Do-Task</h2>
        <img
          src="/favicon.ico"
          alt="Logo"
          width="36"
          height="36"
          class="rounded-full"
        />
      </div>

      <!-- Navigation Links -->
      <div class="flex flex-col justify-between w-full h-full">
        <nav class="flex flex-col pt-12 pb-4 gap-1 px-4 h-full bg-white/50">
          <NuxtLink
            to="/tasks"
            class="px-2 py-2 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors rounded-md border-transparent"
            active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >
            <badge-check /> Tasks
          </NuxtLink>

          <NuxtLink
            to="/note"
            class="px-2 py-2 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors rounded-md border-transparent"
            active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >
            <notepad-text /> Note
          </NuxtLink>
        </nav>

        <nav class="flex flex-col pt-4 pb-4 gap-1 px-4">
          <NuxtLink
            to="/setting"
            class="px-2 py-2 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors rounded-md border-transparent"
            active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >
            <settings /> Setting
          </NuxtLink>

          <NuxtLink
            to="/support"
            class="px-2 py-2 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors rounded-md border-transparent"
            active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >
            <headset /> Support
          </NuxtLink>

          <div class="border-t border-slate-200 mt-4 pt-4">
            <NuxtLink
              to="/account"
              class="px-2 py-2 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors rounded-md border-transparent"
              active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
            >
              <user-round /> My Account
            </NuxtLink>
          </div>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <header
        class="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-4"
      >
        <div class="text-lg font-medium text-slate-900">👋 Welcome, User</div>
        <div class="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            class="input-field w-48 h-8"
          />
          <button
            class="bg-transparent border-none text-xl cursor-pointer p-1 transition-transform hover:scale-110"
          >
            <bell class="h-5 w-5" />
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 p-4 overflow-y-auto bg-white/60">
        <slot />
      </div>
    </main>
  </div>
</template>
