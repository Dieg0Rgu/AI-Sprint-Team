<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const searchQuery = ref('')
</script>

<template>
  <header class="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-[#0f0f0f]/95 backdrop-blur border-b border-[#272727]">
    <!-- Left: Hamburger & YouTube-style Studio Logo -->
    <div class="flex items-center gap-4">
      <button 
        @click="emit('toggle-sidebar')"
        class="p-2 rounded-full hover:bg-[#272727] text-white transition-colors"
        title="Alternar menú"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <RouterLink to="/" class="flex items-center gap-1.5 focus:outline-none">
        <div class="w-8 h-6 bg-[#ff0000] rounded-lg flex items-center justify-center shadow-lg shadow-red-900/30">
          <svg class="w-3.5 h-3.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div class="flex items-baseline">
          <span class="text-lg font-bold tracking-tighter text-white">Omni</span>
          <span class="text-xs font-semibold ml-1 px-1.5 py-0.5 rounded bg-[#272727] text-neutral-300">Studio</span>
        </div>
      </RouterLink>
    </div>

    <!-- Center: Search input bar -->
    <div class="hidden md:flex items-center w-full max-w-xl mx-4">
      <div class="flex w-full items-center">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar campañas, variantes o formatos..." 
          class="w-full bg-[#121212] border border-[#303030] focus:border-[#065fd4] rounded-l-full py-2 px-4 text-sm text-white focus:outline-none placeholder-neutral-500"
        />
        <button class="bg-[#222222] border border-l-0 border-[#303030] hover:bg-[#272727] px-5 py-2 rounded-r-full text-neutral-400 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Right: Studio Actions -->
    <div class="flex items-center gap-3">
      <RouterLink 
        to="/" 
        class="flex items-center gap-1.5 bg-[#272727] hover:bg-[#3f3f3f] text-white text-xs font-medium px-3.5 py-2 rounded-full transition-colors border border-[#383838]"
      >
        <span class="w-2 h-2 rounded-full bg-[#ff0000] animate-pulse"></span>
        <span>+ Generar</span>
      </RouterLink>

      <div class="w-8 h-8 rounded-full bg-linear-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
        AI
      </div>
    </div>
  </header>
</template>