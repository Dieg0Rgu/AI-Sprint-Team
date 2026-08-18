<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-[#272727] bg-[#0f0f0f] py-6 px-8 text-neutral-500 text-xs mt-auto">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#ff0000]"></span>
        <span class="text-neutral-300 font-medium">OmniStudio Content Intelligence</span>
        <span>&copy; {{ currentYear }}</span>
      </div>

      <div class="flex items-center gap-6">
        <RouterLink to="/" class="hover:text-neutral-300 transition-colors">Estudio</RouterLink>
        <RouterLink to="/services" class="hover:text-neutral-300 transition-colors">Formatos</RouterLink>
        <RouterLink to="/contact" class="hover:text-neutral-300 transition-colors">Contacto</RouterLink>
        <span class="text-[#272727]">|</span>
        <span class="text-neutral-400">Ambiente de Producción</span>
      </div>
    </div>
  </footer>
</template>