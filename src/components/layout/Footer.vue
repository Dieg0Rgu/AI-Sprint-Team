<script setup lang="ts">
import { useLanguage } from '../../composables/useLanguage'

defineProps<{
  isDark: boolean
}>()

const { t } = useLanguage()
</script>

<template>
  <footer 
    :class="isDark ? 'bg-[#0f0f0f] border-[#222222] text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600'"
    class="border-t py-3 px-6 md:px-10 text-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 transition-colors"
  >
    <div class="font-normal">{{ t.footerCopyright }}</div>
    
    <div class="flex items-center gap-2 text-emerald-500 font-medium">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      {{ t.footerStatus }}
    </div>
  </footer>
</template>