<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div class="p-6 text-slate-900 border-b border-slate-200">
        <h2 class="m-0 text-2xl font-bold">Do-Task</h2>
      </div>
      <nav class="flex flex-col py-4">
        <NuxtLink
          to="/tasks"
          class="px-6 py-3 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors border-r-4 border-transparent"
          active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >📋 Tasks</NuxtLink
        >
        <NuxtLink
          to="/note"
          class="px-6 py-3 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors border-r-4 border-transparent"
          active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >📝 Note</NuxtLink
        >
        <NuxtLink
          to="/setting"
          class="px-6 py-3 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors border-r-4 border-transparent"
          active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >⚙️ Setting</NuxtLink
        >
        <NuxtLink
          to="/support"
          class="px-6 py-3 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors border-r-4 border-transparent"
          active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >❓ Support</NuxtLink
        >
        <NuxtLink
          to="/account"
          class="px-6 py-3 text-slate-600 no-underline text-base flex items-center gap-2 hover:bg-slate-100 transition-colors border-r-4 border-transparent"
          active-class="!bg-blue-50 !text-blue-600 font-semibold !border-blue-600"
          >👤 Account</NuxtLink
        >
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <header
        class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6"
      >
        <div class="text-lg font-medium text-slate-900">👋 Welcome, User</div>
        <div class="flex items-center gap-4">
          <input type="text" placeholder="Search..." class="input-field w-48" />
          <button
            class="bg-transparent border-none text-xl cursor-pointer p-1 transition-transform hover:scale-110"
          >
            🔔
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 p-6 overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
