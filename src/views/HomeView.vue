<script setup lang="ts">
import { ref, computed } from 'vue'

export type ContentFormat = 'Hilos' | 'Artículos' | 'Boletines' | 'Videos' | 'Audios'

export interface VariantItem {
  id: string
  format: ContentFormat
  title: string
  content: string
  isApproved: boolean
  isEditing: boolean
  durationOrLength: string
  tag: string
}

const inputPrompt = ref('Lanzamiento de una herramienta de inteligencia artificial para creadores que automatiza guiones y posts')
const isGenerating = ref(false)
const selectedFilter = ref<ContentFormat | 'Todos'>('Todos')

const variants = ref<VariantItem[]>([
  {
    id: '1',
    format: 'Hilos',
    title: '1/7 Por qué el 90% de los creadores se estancan en la etapa de preproducción 🧵',
    content: '1/7 Crear contenido diario es insostenible si redactas todo de cero.\n\n2/7 El secreto está en la atomización: una idea central se convierte en 5 piezas estructuradas.\n\n3/7 Hoy liberamos nuestro motor que transforma una simple frase en guiones listos para publicar.',
    isApproved: false,
    isEditing: false,
    durationOrLength: '7 Tweets',
    tag: 'X / Twitter'
  },
  {
    id: '2',
    format: 'Artículos',
    title: 'La Guía Definitiva: Cómo Escalar tu Distribución Omnicanal con IA en 2026',
    content: 'La fatiga de creación es el mayor cuello de botella para marcas y agencias. Implementar un pipeline asistido permite reducir el tiempo de redacción de 6 horas a 20 minutos, priorizando el criterio editorial y la curaduría sobre el bloqueo de la página en blanco.',
    isApproved: true,
    isEditing: false,
    durationOrLength: '1,200 palabras',
    tag: 'Blog / Medium'
  },
  {
    id: '3',
    format: 'Boletines',
    title: 'Edición #42: De 0 a 100k impresiones sin grabar 10 horas semanales',
    content: 'Hola creador,\n\nEsta semana analizamos la metodología de contenido modular. Descubre la plantilla exacta para convertir una tesis en hilos, reels y podcasts sin perder autenticidad.',
    isApproved: false,
    isEditing: false,
    durationOrLength: 'Lectura de 3 min',
    tag: 'Substack'
  },
  {
    id: '4',
    format: 'Videos',
    title: 'Guión para YouTube Shorts / Reels: El Hack de Contenido que Nadie te Cuenta',
    content: '[00:00 - GANCHO] (Mostrar pantalla de notas vacía) "Deja de perder 4 horas pensando qué publicar hoy."\n[00:05 - PROBLEMA] Todos intentan crear contenido nuevo todos los días.\n[00:15 - SOLUCIÓN] Mira cómo transformo este párrafo en 5 formatos con un solo clic.\n[00:30 - CTA] Comenta ESTUDIO y te paso el acceso.',
    isApproved: false,
    isEditing: false,
    durationOrLength: '0:45 min',
    tag: 'YouTube Shorts'
  },
  {
    id: '5',
    format: 'Audios',
    title: 'Estructura Episodio Podcast: Automatización Creativa y el Futuro de la Atención',
    content: '[INTRODUCCIÓN CON MÚSICA LIGERA]\n"Bienvenidos a Frecuencia Creadora. Hoy conversamos sobre por qué la distribución omnicanal ya no es opcional si quieres construir una audiencia sólida..."\n[SEGMENTO 1: LA CRISIS DEL TIEMPO CREATIVO]\n[SEGMENTO 2: DEMOSTRACIÓN DEL WORKFLOW EN VIVO]',
    isApproved: false,
    isEditing: false,
    durationOrLength: '8:30 min',
    tag: 'Podcast / Spotify'
  }
])

const filterOptions: (ContentFormat | 'Todos')[] = ['Todos', 'Hilos', 'Artículos', 'Boletines', 'Videos', 'Audios']

const filteredVariants = computed(() => {
  if (selectedFilter.value === 'Todos') return variants.value
  return variants.value.filter(v => v.format === selectedFilter.value)
})

const generateVariants = () => {
  if (!inputPrompt.value.trim()) return
  isGenerating.value = true
  
  setTimeout(() => {
    variants.value = [
      {
        id: '1',
        format: 'Hilos',
        title: `🧵 Hilo Estratégico: ${inputPrompt.value.slice(0, 45)}...`,
        content: `1/5 Analicemos a fondo: "${inputPrompt.value}"\n\n2/5 Paso fundamental: Define el público objetivo antes de redactar.\n\n3/5 Conclusión clave: La velocidad de iteración supera a la perfección inicial.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '5 Tweets',
        tag: 'X / Twitter'
      },
      {
        id: '2',
        format: 'Artículos',
        title: `Análisis Editorial: Impacto de "${inputPrompt.value.slice(0, 40)}"`,
        content: `En este ensayo profundizamos en las implicaciones prácticas de "${inputPrompt.value}". La clave radica en una ejecución ágil y en mantener una voz consistente a través de todos los canales.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '850 palabras',
        tag: 'Blog / Medium'
      },
      {
        id: '3',
        format: 'Boletines',
        title: `Newsletter Exclusivo: Claves sobre ${inputPrompt.value.slice(0, 35)}`,
        content: `Estimada comunidad,\n\nHoy desglosamos las lecciones aprendidas sobre "${inputPrompt.value}". No te pierdas los pasos accionables que preparamos para ti.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: 'Lectura de 2 min',
        tag: 'Substack'
      },
      {
        id: '4',
        format: 'Videos',
        title: `Guión Audiovisual: ${inputPrompt.value.slice(0, 38)}`,
        content: `[00:00 - GANCHO DIRECTO] "¿Sabías esto sobre ${inputPrompt.value.slice(0, 25)}?"\n[00:10 - DESARROLLO RÁPIDO] 3 Puntos clave que debes ejecutar ya.\n[00:40 - CIERRE Y CTA] Dale like y suscríbete para más.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '0:50 min',
        tag: 'Shorts / Reels'
      },
      {
        id: '5',
        format: 'Audios',
        title: `Pauta Micro-Podcast: ${inputPrompt.value.slice(0, 35)}`,
        content: `[Voz en off serena]\n"Hola a todos. Hoy reflexionamos brevemente sobre ${inputPrompt.value} y su impacto en la productividad moderna..."`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '4:15 min',
        tag: 'Audiograma'
      }
    ]
    isGenerating.value = false
  }, 600)
}

const toggleApproval = (variant: VariantItem) => {
  variant.isApproved = !variant.isApproved
}

const toggleEdit = (variant: VariantItem) => {
  variant.isEditing = !variant.isEditing
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Hero / Studio Generator Input Box -->
    <section class="bg-[#181818] border border-[#272727] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -top-10 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 bg-[#ff0000] rounded-sm"></span>
            Central de Inteligencia de Contenido
          </h1>
          <p class="text-xs text-neutral-400 mt-1">
            Ingresa tu premisa y genera instantáneamente variantes para 5 canales optimizados.
          </p>
        </div>
        <span class="text-xs px-3 py-1 bg-[#272727] text-neutral-300 rounded-full w-fit">
          5 Canales Sincronizados
        </span>
      </div>

      <div class="space-y-4">
        <div class="relative">
          <textarea
            v-model="inputPrompt"
            rows="3"
            placeholder="Escribe aquí tu tesis, noticia, lanzamiento o premisa creativa..."
            class="w-full bg-[#0f0f0f] border border-[#303030] focus:border-[#ff0000] rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all resize-none shadow-inner"
          ></textarea>
        </div>

        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="text-xs text-neutral-500">
            Presiona <strong class="text-neutral-300">Generar Variantes</strong> para poblar Hilos, Artículos, Boletines, Videos y Audios.
          </div>
          <button
            @click="generateVariants"
            :disabled="isGenerating"
            class="bg-[#ff0000] hover:bg-[#cc0000] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
          >
            <svg v-if="isGenerating" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{{ isGenerating ? 'Optimizando...' : 'Generar Variantes Omnicanal' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Filters Row (YouTube-style Pills) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        v-for="filter in filterOptions"
        :key="filter"
        @click="selectedFilter = filter"
        class="px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border"
        :class="[
          selectedFilter === filter
            ? 'bg-white text-black border-white'
            : 'bg-[#272727] text-neutral-300 border-transparent hover:bg-[#3f3f3f]'
        ]"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Output Grid of Formats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <article
        v-for="variant in filteredVariants"
        :key="variant.id"
        class="bg-[#181818] border border-[#272727] rounded-xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#383838]"
        :class="{ 'ring-1 ring-emerald-500/50 bg-[#141b17]/40': variant.isApproved }"
      >
        <!-- Card Top Bar -->
        <div class="p-4 border-b border-[#272727] flex items-center justify-between bg-[#121212]">
          <div class="flex items-center gap-2">
            <span 
              class="text-xs font-bold px-2.5 py-1 rounded-md"
              :class="{
                'bg-sky-950 text-sky-400 border border-sky-800': variant.format === 'Hilos',
                'bg-amber-950 text-amber-400 border border-amber-800': variant.format === 'Artículos',
                'bg-purple-950 text-purple-400 border border-purple-800': variant.format === 'Boletines',
                'bg-red-950 text-red-400 border border-red-800': variant.format === 'Videos',
                'bg-emerald-950 text-emerald-400 border border-emerald-800': variant.format === 'Audios',
              }"
            >
              {{ variant.format }}
            </span>
            <span class="text-xs text-neutral-400 font-mono">{{ variant.durationOrLength }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span 
              v-if="variant.isApproved" 
              class="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Aprobado
            </span>
            <span class="text-xs text-neutral-500 bg-[#1c1c1c] px-2 py-0.5 rounded">{{ variant.tag }}</span>
          </div>
        </div>

        <!-- Card Content / Editor Body -->
        <div class="p-5 flex-1 space-y-3">
          <div v-if="!variant.isEditing">
            <h2 class="text-sm font-bold text-white mb-2 leading-snug">{{ variant.title }}</h2>
            <p class="text-xs text-neutral-300 whitespace-pre-line leading-relaxed">{{ variant.content }}</p>
          </div>

          <div v-else class="space-y-2">
            <label class="text-[11px] text-neutral-400">Título / Asunto</label>
            <input 
              v-model="variant.title" 
              class="w-full bg-[#0f0f0f] border border-[#3f3f3f] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff0000]"
            />
            <label class="text-[11px] text-neutral-400">Cuerpo del Contenido</label>
            <textarea
              v-model="variant.content"
              rows="6"
              class="w-full bg-[#0f0f0f] border border-[#3f3f3f] rounded p-3 text-xs text-neutral-200 focus:outline-none focus:border-[#ff0000] resize-none font-mono"
            ></textarea>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="p-3 bg-[#121212] border-t border-[#272727] flex items-center justify-between gap-2">
          <button
            @click="toggleEdit(variant)"
            class="text-xs px-3 py-1.5 rounded-lg border border-[#303030] hover:bg-[#272727] text-neutral-300 transition-colors flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>{{ variant.isEditing ? 'Guardar Cambios' : 'Editar' }}</span>
          </button>

          <div class="flex items-center gap-2">
            <button
              @click="toggleApproval(variant)"
              class="text-xs px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5"
              :class="[
                variant.isApproved
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-[#272727] hover:bg-[#383838] text-white'
              ]"
            >
              <span>{{ variant.isApproved ? 'Desaprobar' : 'Aprobar para Publicar' }}</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>