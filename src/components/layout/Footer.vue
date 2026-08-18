<script setup lang="ts">
defineProps<{
  isDark: boolean
}>()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer 
    :class="[
      isDark ? 'bg-[#0f0f0f] border-[#272727] text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600',
      'border-t py-6 px-8 text-xs mt-auto transition-colors duration-200'
    ]"
  >
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#ff0000]"></span>
        <span :class="isDark ? 'text-neutral-200 font-medium' : 'text-neutral-800 font-medium'">OmniStudio Content Intelligence</span>
        <span>&copy; {{ currentYear }}</span>
      </div>

      <div class="flex items-center gap-6">
        <RouterLink to="/" :class="isDark ? 'hover:text-white' : 'hover:text-black'" class="transition-colors">Estudio</RouterLink>
        <RouterLink to="/services" :class="isDark ? 'hover:text-white' : 'hover:text-black'" class="transition-colors">Formatos</RouterLink>
        <RouterLink to="/contact" :class="isDark ? 'hover:text-white' : 'hover:text-black'" class="transition-colors">Contacto</RouterLink>
        <span :class="isDark ? 'text-[#272727]' : 'text-neutral-300'">|</span>
        <span class="text-neutral-500">Modo Reactivo</span>
      </div>
    </div>
  </footer>
</template>