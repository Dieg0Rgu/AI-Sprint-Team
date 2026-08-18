<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  isCollapsed: boolean
  isDark: boolean
}>()

const route = useRoute()

const navItems = [
  {
    name: 'Estudio Creativo',
    path: '/',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  {
    name: 'Motores & Formatos',
    path: '/services',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    name: 'Soporte & API',
    path: '/contact',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  }
]
</script>

<template>
  <aside 
    :class="[
      isDark ? 'bg-[#0f0f0f] border-[#272727]' : 'bg-white border-neutral-200',
      isCollapsed ? 'w-16' : 'w-60',
      'fixed left-0 top-14 bottom-0 border-r transition-all duration-200 z-30 flex flex-col justify-between'
    ]"
  >
    <div class="py-3 space-y-1">
      <RouterLink 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-4 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-colors"
        :class="[
          route.path === item.path
            ? (isDark ? 'bg-[#272727] text-white font-semibold' : 'bg-neutral-200 text-neutral-900 font-semibold')
            : (isDark ? 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900')
        ]"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="item.icon" />
        </svg>
        <span v-if="!isCollapsed" class="truncate">{{ item.name }}</span>
      </RouterLink>
    </div>

    <!-- Mini stats card -->
    <div 
      v-if="!isCollapsed" 
      :class="[
        isDark ? 'bg-[#181818] border-[#272727]' : 'bg-neutral-50 border-neutral-200',
        'p-4 m-2 rounded-xl border text-xs transition-colors'
      ]"
    >
      <p :class="isDark ? 'text-neutral-300 font-semibold' : 'text-neutral-800 font-semibold'">Omni Pipeline v2.4</p>
      <p class="text-neutral-500 mt-1">5 variantes configuradas</p>
      <div class="mt-2.5 flex items-center gap-1.5 text-emerald-500 font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Motor Activo</span>
      </div>
    </div>
  </aside>
</template>