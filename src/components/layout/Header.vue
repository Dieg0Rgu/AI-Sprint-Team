<script setup lang="ts">
defineProps<{
  searchQuery: string
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'toggle-theme'): void
  (e: 'update:searchQuery', value: string): void
  (e: 'trigger-generate'): void
}>()
</script>

<template>
  <header 
    :class="[
      isDark ? 'bg-[#0f0f0f] border-[#272727]' : 'bg-white border-neutral-200 shadow-sm',
      'sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b transition-colors duration-200'
    ]"
  >
    <!-- Left: Menú y Logo -->
    <div class="flex items-center gap-3">
      <button 
        @click="emit('toggle-sidebar')"
        type="button"
        :class="isDark ? 'hover:bg-[#272727] text-white' : 'hover:bg-neutral-100 text-neutral-800'"
        class="p-2 rounded-full transition-colors"
        title="Alternar menú"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <RouterLink to="/" class="flex items-center gap-1.5 focus:outline-none">
        <div class="w-8 h-6 bg-[#ff0000] rounded-lg flex items-center justify-center shadow-md shadow-red-600/30">
          <svg class="w-3.5 h-3.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div class="flex items-baseline">
          <span :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-lg font-bold tracking-tighter">Omni</span>
          <span :class="isDark ? 'bg-[#272727] text-neutral-300' : 'bg-neutral-200 text-neutral-800'" class="text-xs font-semibold ml-1 px-1.5 py-0.5 rounded">Studio</span>
        </div>
      </RouterLink>
    </div>

    <!-- Center: Buscador -->
    <div class="flex items-center w-full max-w-xs sm:max-w-md md:max-w-lg mx-2 sm:mx-4">
      <div class="flex w-full items-center">
        <input 
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Buscar por palabras clave en variantes..." 
          :class="[
            isDark 
              ? 'bg-[#121212] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
              : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-[#ff0000]',
            'w-full border rounded-l-full py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm focus:outline-none transition-colors'
          ]"
        />
        <button 
          type="button" 
          :class="[
            isDark 
              ? 'bg-[#222222] border-[#303030] text-neutral-400 hover:text-white hover:bg-[#272727]' 
              : 'bg-neutral-200 border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-300',
            'border border-l-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-r-full transition-colors'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Right: Theme switcher y botón Generar -->
    <div class="flex items-center gap-2 sm:gap-3">
      <button 
        type="button"
        @click="emit('toggle-theme')"
        :class="isDark ? 'border-[#303030] bg-[#1f1f1f] hover:bg-[#2e2e2e]' : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200'"
        class="p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center"
        :title="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
      >
        <svg v-if="isDark" class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-4 h-4 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <button 
        type="button"
        @click="emit('trigger-generate')"
        class="flex items-center gap-1.5 bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-colors shadow cursor-pointer"
      >
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span class="hidden sm:inline">+ Generar</span>
      </button>
    </div>
  </header>
</template>