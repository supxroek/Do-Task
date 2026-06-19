<script setup lang="ts">
import { BadgeCheck } from '@lucide/vue';

</script>

<template>
  <div class="card-base">
    <h1 class="heading-1">Tasks</h1>
    <div class="mt-4 flex flex-col gap-3">
      <div
        class="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <input
          type="checkbox"
          id="task1"
          class="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
        <label
          for="task1"
          class="cursor-pointer text-slate-700 w-full select-none text-base"
          >Create Basic Layout</label
        >
      </div>
      <div
        class="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <input
          type="checkbox"
          id="task2"
          class="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
        <label
          for="task2"
          class="cursor-pointer text-slate-700 w-full select-none text-base"
          >Setup Database</label
        >
      </div>
      <div
        class="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <input
          type="checkbox"
          id="task3"
          class="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
        <label
          for="task3"
          class="cursor-pointer text-slate-700 w-full select-none text-base"
          >Add Authentication</label
        >
      </div>
    </div>
  </div>
</template>
