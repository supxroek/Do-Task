<script setup lang="ts">
import { Folder, LayoutDashboard, SearchIcon, SquareCheckBig } from '@lucide/vue'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { useRouter } from "vue-router"
import { toast } from 'vue-sonner'
import { ref, watch } from "vue"
import { appNavigation } from '~/lib/navigation';

const router = useRouter()
const query = ref("")
const results = ref<string[]>([])
const showSuggestions = ref(false)

// debounce 1–2 วินาที
let timer: NodeJS.Timeout
watch(query, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        const q = val.trim().toLowerCase()
        if (!q) {
            results.value = appNavigation.map(item => item.title)
            return
        }
        const matched = appNavigation.filter(item => item.title.toLowerCase().includes(q))
        results.value = matched.length ? matched.map(item => item.title) : []
    }, 1000) // 1 วินาที
})
</script>

<template>
    <div class="flex h-screen w-screen bg-[#0B0909] flex-col items-center justify-center gap-4 text-white">
        <Empty>
            <EmptyHeader>
                <EmptyTitle>404 - Not Found</EmptyTitle>
                <EmptyDescription>
                    The page you're looking for doesn't exist. Try searching for what you
                    need below.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <InputGroup class="sm:w-3/4">
                    <InputGroupInput v-model="query" placeholder="Try searching for pages..."
                        @focus="() => { showSuggestions = true; results = appNavigation.map(item => item.title) }" />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <Kbd>/</Kbd>
                    </InputGroupAddon>
                </InputGroup>

                <!-- Suggestion list -->
                <div v-if="showSuggestions"
                    class="w-full sm:w-3/4 bg-transparent border border-white rounded-lg p-1.5 max-h-48 overflow-y-auto scrollbar-none">
                    <div v-if="results.length">
                        <div v-for="r in results" :key="r"
                            class="flex cursor-pointer px-2 py-1.5 hover:bg-muted-foreground/50 rounded"
                            @click="router.push(appNavigation.find(item => item.title === r)?.path!)">
                            <component :is="appNavigation.find(item => item.title === r)?.icon" class="size-4 mr-2" />
                            {{ r }}
                        </div>
                    </div>
                    <div v-else class="text-gray-400 px-2 py-1">No results found</div>
                </div>

                <EmptyDescription>
                    Need help? <a class="text-amber-600 hover:text-amber-700!" href="/support">Contact support</a>
                </EmptyDescription>
            </EmptyContent>
        </Empty>
    </div>
</template>
