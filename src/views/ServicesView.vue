<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    searchQuery?: string
    isDark?: boolean
  }>(),
  {
    searchQuery: '',
    isDark: true
  }
)

const engines = [
  {
    format: 'Hilos (X / Threads)',
    badge: 'Microrredacción',
    description: 'Estructuración por ganchos (hooks), viñetas de alta retención y llamada a la acción sintetizada en cascada.',
    specs: ['Límite por bloque de 280 caracteres', 'Sintaxis de numeración progresiva', 'Optimización de cliffhangers']
  },
  {
    format: 'Artículos (Blog & Medium)',
    badge: 'Long-form SEO',
    description: 'Desarrollo de premisas en ensayos de fondo con jerarquía H2/H3, tono periodístico e introducción contextual.',
    specs: ['Densidad de palabras clave', 'Bloques citables', 'Estructura escaneable']
  },
  {
    format: 'Boletines (Newsletters)',
    badge: 'Conversión Directa',
    description: 'Voz cercana y personalizada para audiencias cautivas con enfoque en valor accionable y lectura fluida.',
    specs: ['Líneas de asunto de alto open-rate', 'Segmentación por intereses', 'Llamados directos a respuesta']
  },
  {
    format: 'Videos (YouTube & Shorts)',
    badge: 'Audiovisual',
    description: 'Pautas de ritmo segundo a segundo con marcas de gancho inicial, cambios de plano y guiones hablados.',
    specs: ['Estructura de retención 0-3 segundos', 'Anotaciones visuales (B-roll)', 'CTAs de suscripción orgánicos']
  },
  {
    format: 'Audios (Podcasts)',
    badge: 'Audio First',
    description: 'Guiones con pausas narrativas naturales, introducción de cortinillas y división en bloques temáticos.',
    specs: ['Pistas de modulación de voz', 'Tiempos estimados de locución', 'Puntos de debate abierto']
  }
]

const filteredEngines = computed(() => {
  const query = props.searchQuery ? props.searchQuery.toLowerCase().trim() : ''
  if (!query) return engines
  return engines.filter(e => 
    e.format.toLowerCase().includes(query) ||
    e.description.toLowerCase().includes(query) ||
    e.badge.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <div :class="isDark ? 'border-[#272727]' : 'border-neutral-200'" class="border-b pb-4">
      <h1 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-2xl font-bold flex items-center gap-2">
        <span class="w-3 h-3 bg-[#ff0000] rounded-sm"></span>
        Motores de Formato y Adaptación
      </h1>
      <p :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs mt-1">
        Especificaciones técnicas de transformación aplicadas a cada uno de los 5 canales omnicanal.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="engine in filteredEngines" 
        :key="engine.format"
        :class="[
          isDark ? 'bg-[#181818] border-[#272727]' : 'bg-white border-neutral-200 shadow-sm',
          'border rounded-xl p-5 transition-all flex flex-col justify-between'
        ]"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 :class="isDark ? 'text-white' : 'text-neutral-900'" class="font-bold text-sm">{{ engine.format }}</h2>
            <span 
              :class="isDark ? 'bg-[#272727] text-neutral-300' : 'bg-neutral-100 text-neutral-700'"
              class="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold"
            >
              {{ engine.badge }}
            </span>
          </div>
          <p :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs leading-relaxed mb-4">
            {{ engine.description }}
          </p>
        </div>

        <div :class="isDark ? 'border-[#272727]' : 'border-neutral-200'" class="border-t pt-3">
          <h3 :class="isDark ? 'text-neutral-300' : 'text-neutral-800'" class="text-[11px] font-bold mb-2">Parámetros Clave:</h3>
          <ul class="space-y-1">
            <li 
              v-for="spec in engine.specs" 
              :key="spec"
              :class="isDark ? 'text-neutral-400' : 'text-neutral-600'"
              class="text-[11px] flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-[#ff0000]"></span>
              <span>{{ spec }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>