<script setup lang="ts">
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
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <div class="border-b border-[#272727] pb-4">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span class="w-3 h-3 bg-[#ff0000] rounded-sm"></span>
        Motores de Formato y Adaptación
      </h1>
      <p class="text-xs text-neutral-400 mt-1">
        Especificaciones técnicas de transformación aplicadas a cada uno de los 5 canales omnicanal.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="engine in engines" 
        :key="engine.format"
        class="bg-[#181818] border border-[#272727] rounded-xl p-5 hover:border-[#383838] transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-bold text-sm text-white">{{ engine.format }}</h2>
            <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#272727] text-neutral-300">
              {{ engine.badge }}
            </span>
          </div>
          <p class="text-xs text-neutral-400 leading-relaxed mb-4">
            {{ engine.description }}
          </p>
        </div>

        <div class="border-t border-[#272727] pt-3">
          <h3 class="text-[11px] font-semibold text-neutral-300 mb-2">Parámetros Clave:</h3>
          <ul class="space-y-1">
            <li 
              v-for="spec in engine.specs" 
              :key="spec"
              class="text-[11px] text-neutral-400 flex items-center gap-2"
            >
              <span class="w-1 h-1 rounded-full bg-[#ff0000]"></span>
              <span>{{ spec }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>