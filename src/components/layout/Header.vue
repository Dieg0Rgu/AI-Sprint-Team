<script setup lang="ts">
import { useLanguage } from '../../composables/useLanguage'

defineProps<{
  isDark: boolean
  searchQuery: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'toggleTheme'): void
}>()

const { t } = useLanguage()
</script>

<template>
  <header 
    :class="isDark ? 'bg-[#0f0f0f]/90 border-[#222222]' : 'bg-white/90 border-neutral-200'"
    class="h-14 border-b flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md transition-colors"
  >
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 bg-[#ff0000] rounded-lg flex items-center justify-center text-white shadow-sm font-black text-xs">
        ▶
      </div>
      <span :class="isDark ? 'text-white' : 'text-neutral-900'" class="font-bold text-sm tracking-tight flex items-center gap-1.5">
        Omni<span class="text-xs font-normal opacity-60">studio</span>
      </span>
    </div>

    <div class="w-full max-w-md mx-4">
      <input
        :value="searchQuery"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="t.searchPlaceholder"
        :class="[
          isDark 
            ? 'bg-[#181818] border-[#2b2b2b] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
            : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
          'w-full px-4 py-1.5 text-xs rounded-full border focus:outline-none transition-all'
        ]"
      />
    </div>

    <div class="flex items-center gap-2">
      <button 
        @click="emit('toggleTheme')" 
        :class="isDark ? 'bg-[#1e1e1e] text-amber-400 hover:bg-[#282828] border-[#303030]' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-200'"
        class="border p-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center"
        title="Toggle Theme"
      >
        <span>{{ isDark ? '☀️' : '🌙' }}</span>
      </button>
    </div>
  </header>
</template>