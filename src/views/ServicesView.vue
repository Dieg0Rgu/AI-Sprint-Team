<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

withDefaults(
  defineProps<{
    isDark?: boolean
  }>(),
  {
    isDark: true
  }
)

const { t } = useLanguage()

const services = computed(() => [
  {
    id: 'threads',
    icon: '🧵',
    name: t.value?.formats?.threads || 'Hilos',
    badge: 'X / Twitter',
    desc: t.value?.threadsDesc || 'Ganchos optimizados, atomización en hilos y remates de alto impacto para X.'
  },
  {
    id: 'articles',
    icon: '📰',
    name: t.value?.formats?.articles || 'Artículos',
    badge: 'Medium / Substack',
    desc: t.value?.articlesDesc || 'Artículos editoriales profundos listos para su distribución en Blogs y Medium.'
  },
  {
    id: 'newsletters',
    icon: '📬',
    name: t.value?.formats?.newsletters || 'Boletines',
    badge: 'Email Dispatch',
    desc: t.value?.newslettersDesc || 'Estructuras informativas de alta conversión diseñadas para Substack y Beehiiv.'
  },
  {
    id: 'videos',
    icon: '🎬',
    name: t.value?.formats?.videos || 'Videos',
    badge: 'Shorts / TikTok',
    desc: t.value?.videosDesc || 'Guiones audiovisuales con marcas de tiempo para Shorts, Reels y TikTok.'
  },
  {
    id: 'audios',
    icon: '🎙️',
    name: t.value?.formats?.audios || 'Audios',
    badge: 'Spotify / Apple',
    desc: t.value?.audiosDesc || 'Estructuras de episodios de podcast diseñadas para maximizar la retención auditiva.'
  }
])
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Encabezado -->
    <div 
      :class="isDark ? 'bg-[#181818] border-[#272727]' : 'bg-white border-neutral-200 shadow-sm'"
      class="border rounded-2xl p-6 transition-colors"
    >
      <div class="flex items-center gap-2.5 mb-2">
        <span class="w-3.5 h-3.5 bg-[#ff0000] rounded-sm shadow-sm"></span>
        <h1 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-xl font-bold tracking-tight">
          {{ t?.servicesTitle || 'Motores y Formatos Omnicanal' }}
        </h1>
      </div>
      <p :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs">
        {{ t?.servicesSubtitle || 'Conoce las capacidades técnicas y canales de salida procesados por nuestro clúster n8n.' }}
      </p>
    </div>

    <!-- Rejilla de Formatos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="service in services"
        :key="service.id"
        :class="isDark ? 'bg-[#181818] border-[#272727] hover:border-[#383838]' : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'"
        class="border rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-2xl">{{ service.icon }}</span>
            <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {{ service.badge }}
            </span>
          </div>
          <h3 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-sm font-semibold">
            {{ service.name }}
          </h3>
          <p :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs leading-relaxed">
            {{ service.desc }}
          </p>
        </div>

        <div class="pt-3 border-t flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium" :class="isDark ? 'border-[#252525]' : 'border-neutral-100'">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{{ t?.activeBadge || 'Pipeline Activo' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>