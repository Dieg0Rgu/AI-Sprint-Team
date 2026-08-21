<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../../composables/useLanguage'
import { useHistory } from '../../composables/useHistory'

const props = withDefaults(
  defineProps<{ 
    isDark: boolean
    searchQuery?: string
  }>(),
  {
    searchQuery: ''
  }
)

const { t } = useLanguage()
const { historyList, activeSessionId, deleteSession } = useHistory()

// Filtrado reactivo del historial en tiempo real al escribir en el buscador
const filteredHistory = computed(() => {
  const query = (props.searchQuery || '').toLowerCase().trim()
  if (!query) return historyList.value

  return historyList.value.filter(item => {
    const matchPrompt = (item.prompt || '').toLowerCase().includes(query)
    const matchVariants = (item.variants || []).some(v => 
      (v.title || '').toLowerCase().includes(query) || 
      (v.content || '').toLowerCase().includes(query) ||
      (v.format || '').toLowerCase().includes(query)
    )
    return matchPrompt || matchVariants
  })
})
</script>

<template>
  <aside 
    :class="isDark ? 'bg-[#121215] border-[#26262f] text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800 shadow-sm'"
    class="w-64 border-r p-4 flex-col justify-between hidden md:flex shrink-0 transition-colors z-20"
  >
    <div class="space-y-4">
      <!-- Navegación Primaria -->
      <nav class="space-y-1 text-xs font-semibold">
        <RouterLink
          to="/"
          class="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
          :class="isDark ? 'text-neutral-300 hover:bg-[#1c1c24]' : 'text-neutral-700 hover:bg-neutral-100'"
          active-class="!bg-[#ff0000]/15 !text-[#ff2b2b] font-bold border border-[#ff0000]/30 shadow-sm"
        >
          <span>🎨</span>
          <span>{{ t.navStudio }}</span>
        </RouterLink>

        <RouterLink
          to="/engines"
          class="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
          :class="isDark ? 'text-neutral-300 hover:bg-[#1c1c24]' : 'text-neutral-700 hover:bg-neutral-100'"
          active-class="!bg-[#ff0000]/15 !text-[#ff2b2b] font-bold border border-[#ff0000]/30 shadow-sm"
        >
          <span>⚙️</span>
          <span>{{ t.navEngines }}</span>
        </RouterLink>

        <RouterLink
          to="/contact"
          class="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
          :class="isDark ? 'text-neutral-300 hover:bg-[#1c1c24]' : 'text-neutral-700 hover:bg-neutral-100'"
          active-class="!bg-[#ff0000]/15 !text-[#ff2b2b] font-bold border border-[#ff0000]/30 shadow-sm"
        >
          <span>💬</span>
          <span>{{ t.navSupport }}</span>
        </RouterLink>
      </nav>

      <!-- Historial de Premisas reactivo y traducido -->
      <div class="pt-3 border-t" :class="isDark ? 'border-[#26262f]' : 'border-neutral-200'">
        <div class="flex items-center justify-between px-1 mb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider opacity-60">
            {{ t.historyTitle }}
          </span>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono">
            {{ filteredHistory.length }}
          </span>
        </div>

        <div class="space-y-1 max-h-[44vh] overflow-y-auto pr-1 scrollbar-thin">
          <div 
            v-if="filteredHistory.length === 0" 
            class="text-[11px] opacity-40 px-2 py-4 text-center italic"
          >
            {{ t.historyEmpty }}
          </div>

          <div
            v-for="item in filteredHistory"
            :key="item.id"
            @click="activeSessionId = item.id"
            :class="[
              activeSessionId === item.id 
                ? (isDark ? 'bg-[#1c1c24] border-[#383848] text-white' : 'bg-neutral-100 border-neutral-300 text-black font-semibold')
                : (isDark ? 'text-neutral-400 hover:bg-[#18181f] hover:text-white border-transparent' : 'text-neutral-600 hover:bg-neutral-50 border-transparent'),
              'group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer border transition-all'
            ]"
          >
            <div class="truncate flex items-center gap-2">
              <span class="text-[10px] opacity-60">💬</span>
              <span class="truncate">{{ item.prompt }}</span>
            </div>

            <button 
              @click.stop="deleteSession(item.id)" 
              class="opacity-0 group-hover:opacity-100 hover:text-red-400 text-[10px] p-0.5 transition-opacity cursor-pointer"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicador de Versión -->
    <div 
      :class="isDark ? 'bg-[#17171c] border-[#292936] text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-700'"
      class="p-3 rounded-xl border text-[11px] shadow-sm"
    >
      <div class="font-bold flex items-center justify-between">
        <span>{{ t.pipelineVersion }}</span>
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      <div class="text-[10px] text-emerald-400 font-medium mt-1">{{ t.pipelineStatus }}</div>
    </div>
  </aside>
</template>