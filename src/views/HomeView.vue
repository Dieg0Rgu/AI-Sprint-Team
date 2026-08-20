<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export type ContentFormat = 'Hilos' | 'Artículos' | 'Boletines' | 'Videos' | 'Audios'

export interface VariantItem {
  id: string
  format: ContentFormat
  title: string
  content: string
  isApproved: boolean
  durationOrLength: string
  tag: string
}

// 1. Asignar las props a una constante para poder leer searchQuery
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

// URLs de los Webhooks en n8n Cloud
const N8N_GENERATE_URL = 'https://devaidiego.app.n8n.cloud/webhook/39fb0e03-e85d-4fc2-8fd4-1b2bf00d18b2'
const N8N_SCHEDULE_URL = 'https://devaidiego.app.n8n.cloud/webhook/schedule-approved'

const STORAGE_KEY = 'omnistudio_variants_cache'

const inputPrompt = ref('')
const selectedFilter = ref<'Todos' | ContentFormat>('Todos')
const isGenerating = ref(false)
const errorMessage = ref('')

// Estado para el tercer flujo (Sincronización con Supabase y Calendar)
const isSyncing = ref(false)
const syncSuccessMessage = ref('')
const syncErrorMessage = ref('')

// Variantes base cargadas por defecto si no hay nada guardado
const defaultVariants: VariantItem[] = [
  {
    id: '1',
    format: 'Hilos',
    title: '1/7 Por qué el 90% de los creadores se estancan en la etapa de preproducción 🧵',
    content: `1/7 Crear contenido diario es insostenible si redactas todo de cero.\n\n2/7 El secreto está en la atomización: una idea central se convierte en 5 piezas estructuradas.\n\n3/7 Hoy liberamos nuestro motor que transforma una simple frase en guiones listos para publicar.`,
    isApproved: false,
    durationOrLength: '7 Tweets',
    tag: 'X / Twitter'
  },
  {
    id: '2',
    format: 'Artículos',
    title: 'La Guía Definitiva: Cómo Escalar tu Distribución Omnicanal con IA',
    content: `La fatiga de creación es el mayor cuello de botella para marcas y agencias. Implementar un pipeline asistido permite reducir el tiempo de redacción de 6 horas a 20 minutos, priorizando el criterio editorial y la curaduría sobre el bloqueo de la página en blanco.`,
    isApproved: true,
    durationOrLength: '1,200 palabras',
    tag: 'Blog / Medium'
  },
  {
    id: '3',
    format: 'Boletines',
    title: 'Edición #42: De 0 a 100k impresiones sin grabar 10 horas semanales',
    content: `Hola creador,\n\nEsta semana analizamos la metodología de contenido modular. Descubre la plantilla exacta para convertir una tesis en hilos, reels y podcasts sin perder autenticidad.`,
    isApproved: false,
    durationOrLength: 'Lectura de 3 min',
    tag: 'Substack'
  },
  {
    id: '4',
    format: 'Videos',
    title: 'Guión para YouTube Shorts / Reels: El Hack de Contenido que Nadie te Cuenta',
    content: `[00:00 - GANCHO] (Mostrar pantalla de notas vacía) "Deja de perder 4 horas pensando qué publicar hoy."\n[00:05 - PROBLEMA] Todos intentan crear contenido nuevo todos los días.\n[00:15 - SOLUCIÓN] Mira cómo transformo este párrafo en 5 formatos con un solo clic.\n[00:30 - CTA] Comenta ESTUDIO y te paso el acceso.`,
    isApproved: false,
    durationOrLength: '0:45 min',
    tag: 'YouTube Shorts'
  },
  {
    id: '5',
    format: 'Audios',
    title: 'Estructura Episodio Podcast: Automatización Creativa y el Futuro de la Atención',
    content: `[INTRODUCCIÓN CON MÚSICA LIGERA]\n"Bienvenidos a Frecuencia Creadora. Hoy conversamos sobre por qué la distribución omnicanal ya no es opcional si quieres construir una audiencia sólida..."\n[SEGMENTO 1: LA CRISIS DEL TIEMPO CREATIVO]\n[SEGMENTO 2: DEMOSTRACIÓN DEL WORKFLOW EN VIVO]`,
    isApproved: false,
    durationOrLength: '8:30 min',
    tag: 'Podcast / Spotify'
  }
]

// Función para inicializar datos desde localStorage
const loadSavedVariants = (): VariantItem[] => {
  if (typeof window === 'undefined') return defaultVariants
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return defaultVariants
    }
  }
  return defaultVariants
}

const variants = ref<VariantItem[]>(loadSavedVariants())

// Guardar reactivamente cada cambio, edición o generación en el navegador
watch(
  variants,
  (newVariants) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVariants))
    } catch (e) {
      console.error('Error al guardar en localStorage:', e)
    }
  },
  { deep: true }
)

// ESTADO PARA EL MODAL DE EDICIÓN
const editingVariant = ref<VariantItem | null>(null)
const tempEditTitle = ref('')
const tempEditContent = ref('')

const openEditModal = (variant: VariantItem) => {
  editingVariant.value = variant
  tempEditTitle.value = variant.title
  tempEditContent.value = variant.content
}

const closeEditModal = () => {
  editingVariant.value = null
  tempEditTitle.value = ''
  tempEditContent.value = ''
}

const saveEdit = () => {
  if (editingVariant.value) {
    editingVariant.value.title = tempEditTitle.value
    editingVariant.value.content = tempEditContent.value
  }
  closeEditModal()
}

// Estadísticas en vivo del modal
const editWordsCount = computed(() => {
  return tempEditContent.value.trim() ? tempEditContent.value.trim().split(/\s+/).length : 0
})

const editCharCount = computed(() => {
  return tempEditContent.value.length
})

// Opciones para la barra de filtros
const filterOptions: Array<'Todos' | ContentFormat> = [
  'Todos',
  'Hilos',
  'Artículos',
  'Boletines',
  'Videos',
  'Audios'
]

// 2. Filtrar simultáneamente por Categoría (Pills) y por Búsqueda de Texto
const filteredVariants = computed(() => {
  const query = (props.searchQuery || '').toLowerCase().trim()

  return variants.value.filter(v => {
    const matchesCategory = selectedFilter.value === 'Todos' || v.format === selectedFilter.value
    const matchesSearch = !query || 
      v.title.toLowerCase().includes(query) ||
      v.content.toLowerCase().includes(query) ||
      v.tag.toLowerCase().includes(query) ||
      v.format.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })
})

const approvedCount = computed(() => variants.value.filter(v => v.isApproved).length)

const toggleApproval = (id: string) => {
  const item = variants.value.find(v => v.id === id)
  if (item) {
    item.isApproved = !item.isApproved
  }
}

// Generación con n8n (Flujo 1)
const generateVariants = async () => {
  if (!inputPrompt.value.trim() || isGenerating.value) return
  isGenerating.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(N8N_GENERATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: inputPrompt.value.trim()
      })
    })

    if (!response.ok) {
      throw new Error(`Error en el servidor n8n: ${response.status}`)
    }

    const data = await response.json()

    let receivedVariants: any[] = []
    if (Array.isArray(data)) {
      receivedVariants = data[0]?.variants || data
    } else if (data && Array.isArray(data.variants)) {
      receivedVariants = data.variants
    }

    if (receivedVariants.length > 0) {
      variants.value = receivedVariants.map((v: Partial<VariantItem>, index: number) => ({
        id: String(v.id || `${Date.now()}-${index}`),
        format: (v.format as ContentFormat) || 'Hilos',
        title: String(v.title || 'Variante Generada'),
        content: String(v.content || ''),
        isApproved: Boolean(v.isApproved ?? false),
        durationOrLength: String(v.durationOrLength || 'N/A'),
        tag: String(v.tag || 'OmniStudio')
      }))
    }
  } catch (error: any) {
    console.error('Error al generar con n8n:', error)
    errorMessage.value = 'No se pudo conectar con el flujo de generación en n8n.'
  } finally {
    isGenerating.value = false
  }
}

// Programación Omnicanal de Aprobados (Flujo 3: Supabase + Google Calendar)
const scheduleApproved = async () => {
  const approvedList = variants.value.filter(v => v.isApproved)
  if (!approvedList.length || isSyncing.value) return

  isSyncing.value = true
  syncSuccessMessage.value = ''
  syncErrorMessage.value = ''

  try {
    const res = await fetch(N8N_SCHEDULE_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ approvedVariants: approvedList })
    })

    if (!res.ok) throw new Error(`Error en n8n: ${res.status}`)

    syncSuccessMessage.value = `¡${approvedList.length} piezas agendadas en Calendar y guardadas en Supabase!`
    setTimeout(() => {
      syncSuccessMessage.value = ''
    }, 4500)
  } catch (err: any) {
    console.error('Error al sincronizar con n8n:', err)
    syncErrorMessage.value = 'Error al conectar con el flujo de agendamiento.'
    setTimeout(() => {
      syncErrorMessage.value = ''
    }, 4500)
  } finally {
    isSyncing.value = false
  }
}

// Estilos de Insignias por formato
const getFormatBadgeStyle = (format: ContentFormat) => {
  switch (format) {
    case 'Hilos':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
    case 'Artículos':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    case 'Boletines':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    case 'Videos':
      return 'bg-red-500/10 text-red-400 border border-red-500/20'
    case 'Audios':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    default:
      return 'bg-neutral-800 text-neutral-300'
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    
    <!-- SECCIÓN 1: PANEL DE ENTRADA Y CONTROL -->
    <div 
      :class="[
        isDark ? 'bg-[#181818] border-[#272727]' : 'bg-white border-neutral-200 shadow-sm',
        'border rounded-2xl p-6 transition-all relative overflow-hidden'
      ]"
    >
      <div class="flex items-center justify-between pb-4 mb-4 border-b" :class="isDark ? 'border-[#272727]' : 'border-neutral-200'">
        <div class="flex items-center gap-2.5">
          <span class="w-3.5 h-3.5 bg-[#ff0000] rounded-sm shadow-sm"></span>
          <div>
            <h1 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-xl font-bold tracking-tight">
              Central de Inteligencia de Contenido
            </h1>
            <p :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs">
              Ingresa tu premisa y genera instantáneamente variantes para 5 canales mediante n8n.
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- BOTÓN DISPARADOR DE FLUJO 3 (PROGRAMACIÓN OMNICANAL) -->
          <button
            v-if="approvedCount > 0"
            @click="scheduleApproved"
            :disabled="isSyncing"
            class="bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <svg v-if="isSyncing" class="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span v-else>📅</span>
            <span>{{ isSyncing ? 'Sincronizando...' : `Programar ${approvedCount} Aprobados` }}</span>
          </button>

          <!-- Contador de Aprobados -->
          <div :class="isDark ? 'bg-[#222222] border-[#303030]' : 'bg-neutral-100 border-neutral-200'" class="border px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span :class="isDark ? 'text-neutral-300' : 'text-neutral-700'">{{ approvedCount }} / {{ variants.length }} Aprobados</span>
          </div>
        </div>
      </div>

      <!-- Notificaciones de estado de la sincronización -->
      <div v-if="syncSuccessMessage" class="mb-3 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
        <span>✓</span> {{ syncSuccessMessage }}
      </div>
      <div v-if="syncErrorMessage" class="mb-3 px-3.5 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
        <span>⚠️</span> {{ syncErrorMessage }}
      </div>

      <div class="space-y-3">
        <textarea
          v-model="inputPrompt"
          rows="3"
          placeholder="Escribe aquí tu premisa o noticia (ej. Lanzamiento de un motor de IA que automatiza guiones y posts)..."
          :class="[
            isDark 
              ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
              : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
            'w-full border rounded-xl p-4 text-xs focus:outline-none resize-none transition-colors'
          ]"
        ></textarea>

        <div class="flex items-center justify-between pt-1">
          <span :class="isDark ? 'text-neutral-500' : 'text-neutral-400'" class="text-[11px]">
            Filtra en tiempo real o presiona <strong>Generar Variantes</strong>.
          </span>

          <button
            @click="generateVariants"
            :disabled="isGenerating || !inputPrompt.trim()"
            class="bg-[#ff0000] hover:bg-[#cc0000] disabled:bg-neutral-600 text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer disabled:cursor-not-allowed"
          >
            <svg v-if="isGenerating" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span v-else>⚡</span>
            <span>{{ isGenerating ? 'Procesando en n8n...' : 'Generar Variantes Omnicanal' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SECCIÓN 2: BARRA DE FILTROS -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        v-for="filter in filterOptions"
        :key="filter"
        @click="selectedFilter = filter"
        :class="[
          selectedFilter === filter
            ? (isDark ? 'bg-white text-black font-semibold shadow' : 'bg-neutral-900 text-white font-semibold')
            : (isDark ? 'bg-[#1e1e1e] text-neutral-300 hover:bg-[#2a2a2a] border border-[#2d2d2d]' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'),
          'px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap'
        ]"
      >
        {{ filter }}
      </button>
    </div>

    <!-- SECCIÓN 3: REJILLA DE TARJETAS DE CONTENIDO -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="variant in filteredVariants"
        :key="variant.id"
        :class="[
          isDark ? 'bg-[#181818] border-[#272727] hover:border-[#383838]' : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm',
          'border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 relative group'
        ]"
      >
        <div class="space-y-3">
          <!-- Cabecera de la Tarjeta -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span :class="[getFormatBadgeStyle(variant.format), 'px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase']">
                {{ variant.format }}
              </span>
              <span :class="isDark ? 'text-neutral-500' : 'text-neutral-400'" class="text-[11px]">
                {{ variant.durationOrLength }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span 
                v-if="variant.isApproved"
                class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1"
              >
                ✓ Aprobado
              </span>
              <span :class="isDark ? 'text-neutral-500' : 'text-neutral-400'" class="text-[11px] font-medium">
                {{ variant.tag }}
              </span>
            </div>
          </div>

          <!-- Título -->
          <h3 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-sm font-semibold leading-snug">
            {{ variant.title }}
          </h3>

          <!-- Vista previa del contenido -->
          <p :class="isDark ? 'text-neutral-300' : 'text-neutral-600'" class="text-xs leading-relaxed line-clamp-4 whitespace-pre-line font-sans">
            {{ variant.content }}
          </p>
        </div>

        <!-- Acciones Inferiores -->
        <div class="flex items-center justify-between pt-4 mt-4 border-t" :class="isDark ? 'border-[#222222]' : 'border-neutral-100'">
          <button
            @click="openEditModal(variant)"
            :class="[
              isDark ? 'bg-[#222222] text-neutral-300 hover:bg-[#2e2e2e] hover:text-white border-[#303030]' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-200',
              'border px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer'
            ]"
          >
            <span>✏️</span>
            <span>Editar</span>
          </button>

          <button
            @click="toggleApproval(variant.id)"
            :class="[
              variant.isApproved
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                : (isDark ? 'bg-[#222222] text-neutral-300 hover:bg-[#2c2c2c] border border-[#303030]' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'),
              'px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer'
            ]"
          >
            {{ variant.isApproved ? 'Desaprobar' : 'Aprobar para Publicar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- SECCIÓN 4: ESTADO VACÍO -->
    <div 
      v-if="filteredVariants.length === 0" 
      :class="isDark ? 'text-neutral-500 border-[#222222]' : 'text-neutral-400 border-neutral-200'"
      class="text-center py-16 border rounded-2xl"
    >
      <p class="text-sm font-semibold">No se encontraron variantes coincidentes</p>
      <p class="text-xs mt-1">Selecciona la categoría "Todos" para visualizarlas.</p>
    </div>

    <!-- MODAL DE EDICIÓN FLUIDO Y ANIMADO -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="editingVariant"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="closeEditModal"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out transform"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in transform"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            :class="[
              isDark ? 'bg-[#181818] border-[#2d2d2d]' : 'bg-white border-neutral-200 shadow-2xl',
              'border rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]'
            ]"
          >
            <!-- Cabecera del Modal -->
            <div class="px-6 py-4 border-b flex items-center justify-between" :class="isDark ? 'border-[#272727]' : 'border-neutral-200'">
              <div class="flex items-center gap-2">
                <span :class="[getFormatBadgeStyle(editingVariant.format), 'px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase']">
                  {{ editingVariant.format }}
                </span>
                <span :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-sm font-bold">
                  Editor de Pieza Omnicanal
                </span>
              </div>
              <button 
                @click="closeEditModal"
                :class="isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'"
                class="p-1 rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- Cuerpo del Editor -->
            <div class="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="block text-xs font-semibold mb-1">
                  Título / Gancho Principal
                </label>
                <input 
                  v-model="tempEditTitle"
                  type="text"
                  :class="[
                    isDark 
                      ? 'bg-[#0f0f0f] border-[#303030] text-white focus:border-[#ff0000]' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#ff0000]',
                    'w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors'
                  ]"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs font-semibold">
                    Cuerpo del Contenido / Guion
                  </label>
                  <span :class="isDark ? 'text-neutral-500' : 'text-neutral-400'" class="text-[11px]">
                    {{ editWordsCount }} palabras · {{ editCharCount }} caracteres
                  </span>
                </div>
                <textarea
                  v-model="tempEditContent"
                  rows="9"
                  :class="[
                    isDark 
                      ? 'bg-[#0f0f0f] border-[#303030] text-white focus:border-[#ff0000]' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#ff0000]',
                    'w-full border rounded-xl p-4 text-xs leading-relaxed focus:outline-none font-sans transition-colors'
                  ]"
                ></textarea>
              </div>
            </div>

            <!-- Pie del Modal -->
            <div class="px-6 py-4 border-t flex items-center justify-end gap-3" :class="isDark ? 'border-[#272727] bg-[#141414]' : 'border-neutral-200 bg-neutral-50'">
              <button
                @click="closeEditModal"
                :class="[
                  isDark ? 'bg-[#222222] text-neutral-300 hover:bg-[#2c2c2c] border-[#303030]' : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300',
                  'border px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer'
                ]"
              >
                Descartar Cambios
              </button>

              <button
                @click="saveEdit"
                class="bg-[#ff0000] hover:bg-[#cc0000] text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-md"
              >
                Guardar Edición
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>