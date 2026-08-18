<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
    title: 'La Guía Definitiva: Cómo Escalar tu Distribución Omnicanal con IA',
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

const generateVariants = () => {
  if (!inputPrompt.value.trim()) return
  isGenerating.value = true
  
  setTimeout(() => {
    const raw = inputPrompt.value.trim()
    const summary = raw.length > 50 ? raw.slice(0, 50) + '...' : raw

    variants.value = [
      {
        id: Date.now().toString() + '-1',
        format: 'Hilos',
        title: `🧵 Hilo Estratégico: ${summary}`,
        content: `1/6 Analicemos la tesis: "${raw}"\n\n2/6 Primer paso crítico: Define tu ángulo y audiencia objetivo antes de distribuir.\n\n3/6 Conclusión: La consistencia omnicanal multiplica por 4 el alcance orgánico.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '6 Tweets',
        tag: 'X / Twitter'
      },
      {
        id: Date.now().toString() + '-2',
        format: 'Artículos',
        title: `Análisis Editorial: Impacto Práctico de "${summary}"`,
        content: `En este artículo desglosamos las implicaciones de "${raw}". La clave no radica únicamente en producir más, sino en estructurar ideas modulares que resuenen en múltiples plataformas de forma nativa.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '950 palabras',
        tag: 'Blog / Medium'
      },
      {
        id: Date.now().toString() + '-3',
        format: 'Boletines',
        title: `Newsletter VIP: Claves y Lecciones sobre ${summary}`,
        content: `Hola suscriptor,\n\nHoy desglosamos: "${raw}".\n\nAquí tienes 3 aprendizajes accionables para aplicar en tu workflow creativo desde hoy.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: 'Lectura de 2 min',
        tag: 'Substack'
      },
      {
        id: Date.now().toString() + '-4',
        format: 'Videos',
        title: `Guión Audiovisual: ${summary}`,
        content: `[00:00 - GANCHO DIRECTO] "¿Sabías esto sobre ${summary}?"\n[00:10 - DESARROLLO] 3 Pasos rápidos que debes ejecutar.\n[00:40 - CIERRE Y CTA] Dale like y suscríbete para más tácticas.`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '0:50 min',
        tag: 'YouTube Shorts'
      },
      {
        id: Date.now().toString() + '-5',
        format: 'Audios',
        title: `Pauta Micro-Podcast: ${summary}`,
        content: `[Voz en off serena]\n"Bienvenidos al micro-episodio de hoy. Reflexionamos sobre ${raw} y cómo optimizar la toma de decisiones creativas..."`,
        isApproved: false,
        isEditing: false,
        durationOrLength: '4:30 min',
        tag: 'Audiograma'
      }
    ]
    isGenerating.value = false
  }, 600)
}

const filteredVariants = computed(() => {
  return variants.value.filter(v => {
    const matchesFormat = selectedFilter.value === 'Todos' || v.format === selectedFilter.value
    const query = props.searchQuery ? props.searchQuery.toLowerCase().trim() : ''
    if (!query) return matchesFormat

    return (
      matchesFormat &&
      (v.title.toLowerCase().includes(query) ||
        v.content.toLowerCase().includes(query) ||
        v.tag.toLowerCase().includes(query) ||
        v.format.toLowerCase().includes(query))
    )
  })
})

const toggleApproval = (variant: VariantItem) => {
  variant.isApproved = !variant.isApproved
}

const toggleEdit = (variant: VariantItem) => {
  variant.isEditing = !variant.isEditing
}

onMounted(() => {
  window.addEventListener('omni-trigger-generate', generateVariants)
})

onUnmounted(() => {
  window.removeEventListener('omni-trigger-generate', generateVariants)
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Generator Box -->
    <section 
      :class="[
        isDark ? 'bg-[#181818] border-[#272727]' : 'bg-white border-neutral-200 shadow-sm',
        'border rounded-2xl p-6 relative overflow-hidden transition-colors'
      ]"
    >
      <div class="absolute -right-10 -top-10 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-xl font-bold flex items-center gap-2">
            <span class="w-3 h-3 bg-[#ff0000] rounded-sm"></span>
            Central de Inteligencia de Contenido
          </h1>
          <p :class="isDark ? 'text-neutral-400' : 'text-neutral-500'" class="text-xs mt-1">
            Ingresa tu premisa y genera instantáneamente variantes para 5 canales optimizados.
          </p>
        </div>
        <span 
          :class="isDark ? 'bg-[#272727] text-neutral-300' : 'bg-neutral-100 text-neutral-700'"
          class="text-xs px-3 py-1 rounded-full w-fit font-medium"
        >
          5 Canales Sincronizados
        </span>
      </div>

      <div class="space-y-4">
        <textarea
          v-model="inputPrompt"
          rows="3"
          placeholder="Escribe aquí tu tesis, noticia, lanzamiento o premisa creativa..."
          :class="[
            isDark 
              ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500' 
              : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400',
            'w-full border focus:border-[#ff0000] rounded-xl p-4 text-sm focus:outline-none transition-all resize-none shadow-inner'
          ]"
        ></textarea>

        <div class="flex items-center justify-between flex-wrap gap-3">
          <div :class="isDark ? 'text-neutral-400' : 'text-neutral-500'" class="text-xs">
            Filtra en tiempo real o presiona <strong :class="isDark ? 'text-white' : 'text-neutral-900'">Generar Variantes</strong>.
          </div>
          <button
            @click="generateVariants"
            :disabled="isGenerating"
            class="bg-[#ff0000] hover:bg-[#cc0000] disabled:bg-neutral-400 text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
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

    <!-- Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        v-for="filter in filterOptions"
        :key="filter"
        @click="selectedFilter = filter"
        class="px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border cursor-pointer"
        :class="[
          selectedFilter === filter
            ? (isDark ? 'bg-white text-black border-white' : 'bg-neutral-900 text-white border-neutral-900')
            : (isDark ? 'bg-[#272727] text-neutral-300 border-transparent hover:bg-[#3f3f3f]' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100')
        ]"
      >
        {{ filter }}
      </button>

      <span v-if="searchQuery" class="text-xs text-neutral-500 ml-auto">
        Buscando: <strong class="text-[#ff0000]">"{{ searchQuery }}"</strong>
      </span>
    </div>

    <!-- Output Grid -->
    <div v-if="filteredVariants.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <article
        v-for="variant in filteredVariants"
        :key="variant.id"
        :class="[
          isDark ? 'bg-[#181818] border-[#272727]' : 'bg-white border-neutral-200 shadow-sm',
          variant.isApproved ? (isDark ? 'ring-1 ring-emerald-500/50 bg-[#141b17]' : 'ring-1 ring-emerald-500 bg-emerald-50/40') : '',
          'border rounded-xl overflow-hidden flex flex-col justify-between transition-all'
        ]"
      >
        <!-- Card Header -->
        <div 
          :class="isDark ? 'bg-[#121212] border-[#272727]' : 'bg-neutral-50 border-neutral-200'"
          class="p-4 border-b flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span 
              class="text-xs font-bold px-2.5 py-1 rounded-md"
              :class="{
                'bg-sky-500/10 text-sky-500 border border-sky-500/30': variant.format === 'Hilos',
                'bg-amber-500/10 text-amber-500 border border-amber-500/30': variant.format === 'Artículos',
                'bg-purple-500/10 text-purple-500 border border-purple-500/30': variant.format === 'Boletines',
                'bg-red-500/10 text-red-500 border border-red-500/30': variant.format === 'Videos',
                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30': variant.format === 'Audios',
              }"
            >
              {{ variant.format }}
            </span>
            <span class="text-xs text-neutral-500 font-mono">{{ variant.durationOrLength }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span 
              v-if="variant.isApproved" 
              class="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1"
            >
              ✓ Aprobado
            </span>
            <span 
              :class="isDark ? 'bg-[#1c1c1c] text-neutral-400' : 'bg-neutral-200 text-neutral-700'"
              class="text-xs px-2 py-0.5 rounded"
            >
              {{ variant.tag }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 space-y-3">
          <div v-if="!variant.isEditing">
            <h2 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-sm font-bold mb-2 leading-snug">{{ variant.title }}</h2>
            <p :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="text-xs whitespace-pre-line leading-relaxed">{{ variant.content }}</p>
          </div>

          <div v-else class="space-y-2">
            <label class="text-[11px] text-neutral-500">Título / Asunto</label>
            <input 
              v-model="variant.title" 
              :class="isDark ? 'bg-[#0f0f0f] border-[#3f3f3f] text-white' : 'bg-neutral-50 border-neutral-300 text-neutral-900'"
              class="w-full border rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#ff0000]"
            />
            <label class="text-[11px] text-neutral-500">Cuerpo del Contenido</label>
            <textarea
              v-model="variant.content"
              rows="6"
              :class="isDark ? 'bg-[#0f0f0f] border-[#3f3f3f] text-neutral-200' : 'bg-neutral-50 border-neutral-300 text-neutral-800'"
              class="w-full border rounded p-3 text-xs focus:outline-none focus:border-[#ff0000] resize-none font-mono"
            ></textarea>
          </div>
        </div>

        <!-- Card Footer -->
        <div 
          :class="isDark ? 'bg-[#121212] border-[#272727]' : 'bg-neutral-50 border-neutral-200'"
          class="p-3 border-t flex items-center justify-between gap-2"
        >
          <button
            @click="toggleEdit(variant)"
            :class="isDark ? 'border-[#303030] hover:bg-[#272727] text-neutral-300' : 'border-neutral-300 hover:bg-neutral-200 text-neutral-700'"
            class="text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {{ variant.isEditing ? 'Guardar Cambios' : 'Editar' }}
          </button>

          <button
            @click="toggleApproval(variant)"
            class="text-xs px-4 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            :class="[
              variant.isApproved
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : (isDark ? 'bg-[#272727] hover:bg-[#383838] text-white' : 'bg-neutral-800 hover:bg-neutral-900 text-white')
            ]"
          >
            {{ variant.isApproved ? 'Desaprobar' : 'Aprobar para Publicar' }}
          </button>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div 
      v-else 
      :class="isDark ? 'bg-[#181818] border-[#272727]' : 'bg-white border-neutral-200'"
      class="text-center py-16 border rounded-xl"
    >
      <p :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="text-sm font-semibold">No se encontraron variantes coincidentes</p>
      <p class="text-xs text-neutral-500 mt-1">Intenta con otra palabra clave o selecciona la categoría "Todos".</p>
    </div>
  </div>
</template>