<script setup lang="ts">
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { useLanguage } from '../composables/useLanguage'
import { useHistory } from '../composables/useHistory'

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

const { currentLang, toggleLang, t } = useLanguage()
const { historyList, activeSessionId, saveSession, updateCurrentSession } = useHistory()

const N8N_GENERATE_URL = 'https://devaidiego.app.n8n.cloud/webhook/39fb0e03-e85d-4fc2-8fd4-1b2bf00d18b2'
const N8N_SCHEDULE_URL = 'https://devaidiego.app.n8n.cloud/webhook/schedule-approved'

const inputPrompt = ref('')
const followUpPrompt = ref('')
const selectedTone = ref('Directo & Viral')
const selectedAudience = ref('Creadores & Emprendedores')
const selectedLanguage = ref<'Español' | 'Inglés'>('Español')
const showExportDropdown = ref(false)
const isGenerating = ref(false)
const regeneratingId = ref<string | null>(null)
const isSyncing = ref(false)

// Editor Modal para variantes
const activeEditingVariant = ref<VariantItem | null>(null)
const tempEditTitle = ref('')
const tempEditContent = ref('')

// Modal estándar con tema oscuro/claro
const notify = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') => {
  return Swal.fire({
    title,
    text,
    icon,
    background: props.isDark ? '#141418' : '#ffffff',
    color: props.isDark ? '#ffffff' : '#111827',
    confirmButtonColor: '#ff0000',
    customClass: {
      popup: 'rounded-2xl border border-neutral-700 shadow-2xl',
      confirmButton: 'rounded-xl text-xs font-semibold px-5 py-2.5'
    }
  })
}

// Notificación Toast rápida para acciones menores (ej. copiar)
const notifyToast = (title: string, icon: 'success' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: props.isDark ? '#141418' : '#ffffff',
    color: props.isDark ? '#ffffff' : '#111827',
    customClass: {
      popup: 'rounded-xl border border-neutral-700 shadow-lg text-xs'
    }
  })
  Toast.fire({ icon, title })
}

const toneOptions = computed(() => [
  { value: 'Directo & Viral', label: t.value?.tones?.viral || 'Directo & Viral' },
  { value: 'Corporativo B2B', label: t.value?.tones?.b2b || 'Corporativo B2B' },
  { value: 'Storytelling Emocional', label: t.value?.tones?.story || 'Storytelling Emocional' },
  { value: 'Técnico & Analítico', label: t.value?.tones?.tech || 'Técnico & Analítico' }
])

const audienceOptions = computed(() => [
  { value: 'Creadores & Emprendedores', label: t.value?.audiences?.creators || 'Creadores & Emprendedores' },
  { value: 'Desarrolladores & Tech', label: t.value?.audiences?.devs || 'Desarrolladores & Tech' },
  { value: 'Ejecutivos B2B', label: t.value?.audiences?.execs || 'Ejecutivos B2B' },
  { value: 'Audiencia General', label: t.value?.audiences?.general || 'Audiencia General' }
])

// Sesión activa seleccionada desde el sidebar
const activeSession = computed(() => {
  return historyList.value.find(s => s.id === activeSessionId.value) || null
})

const startNewChat = () => {
  activeSessionId.value = null
  inputPrompt.value = ''
  followUpPrompt.value = ''
}

const approvedCount = computed(() => {
  if (!activeSession.value?.variants) return 0
  return activeSession.value.variants.filter(v => v.isApproved).length
})

const toggleApproval = (variantId: string) => {
  if (!activeSession.value) return
  const item = activeSession.value.variants.find(v => v.id === variantId)
  if (item) {
    item.isApproved = !item.isApproved
    notifyToast(
      item.isApproved 
        ? (currentLang.value === 'es' ? 'Pieza marcada como aprobada' : 'Piece approved')
        : (currentLang.value === 'es' ? 'Pieza desaprobada' : 'Piece disapproved'),
      'info'
    )
  }
}

const openEditModal = (variant: VariantItem) => {
  activeEditingVariant.value = variant
  tempEditTitle.value = variant.title
  tempEditContent.value = variant.content
}

const saveEdit = () => {
  if (activeEditingVariant.value) {
    activeEditingVariant.value.title = tempEditTitle.value
    activeEditingVariant.value.content = tempEditContent.value
    notifyToast(currentLang.value === 'es' ? 'Cambios guardados' : 'Changes saved', 'success')
  }
  activeEditingVariant.value = null
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  notifyToast(
    currentLang.value === 'es' ? 'Texto copiado al portapapeles' : 'Copied to clipboard',
    'success'
  )
}

// Mapeo seguro protegido contra undefined
const getTranslatedFormatName = (fmt?: string | ContentFormat) => {
  if (!fmt) return 'CONTENIDO'
  
  const formats = t.value?.formats
  let translated = String(fmt)

  switch (fmt) {
    case 'Hilos':
    case 'Threads':
      translated = formats?.threads || 'Hilos'
      break
    case 'Artículos':
    case 'Articles':
      translated = formats?.articles || 'Artículos'
      break
    case 'Boletines':
    case 'Newsletters':
      translated = formats?.newsletters || 'Boletines'
      break
    case 'Videos':
      translated = formats?.videos || 'Videos'
      break
    case 'Audios':
      translated = formats?.audios || 'Audios'
      break
    default:
      translated = String(fmt)
  }

  return (translated || 'CONTENIDO').toUpperCase()
}

const getFormatBadgeStyle = (format: ContentFormat) => {
  switch (format) {
    case 'Hilos': return 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
    case 'Artículos': return 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
    case 'Boletines': return 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
    case 'Videos': return 'bg-red-500/20 text-red-300 border border-red-500/40'
    case 'Audios': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
    default: return 'bg-neutral-800 text-neutral-300'
  }
}

// Exportación
const exportContent = (fileFormat: 'md' | 'json' | 'txt') => {
  showExportDropdown.value = false
  const targetVariants = activeSession.value?.variants || []

  if (!targetVariants.length) {
    notify('Aviso', currentLang.value === 'es' ? 'No hay variantes que exportar.' : 'No variants to export.', 'info')
    return
  }

  let contentData = ''
  let mimeType = 'text/plain'
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `omnistudio-conversation-${dateStr}.${fileFormat}`

  if (fileFormat === 'json') {
    contentData = JSON.stringify(targetVariants, null, 2)
    mimeType = 'application/json'
  } else if (fileFormat === 'md') {
    mimeType = 'text/markdown'
    contentData = targetVariants.map(v => (
      `# [${getTranslatedFormatName(v?.format)}] ${v?.title || ''}\n\n` +
      `> **Platform:** ${v?.tag || ''} | **Length:** ${v?.durationOrLength || ''} | **Approved:** ${v?.isApproved ? 'Yes' : 'No'}\n\n` +
      `${v?.content || ''}\n\n---\n`
    )).join('\n')
  } else {
    contentData = targetVariants.map(v => (
      `==============================\n` +
      `FORMAT: ${getTranslatedFormatName(v?.format)} (${v?.tag || ''})\n` +
      `TITLE: ${v?.title || ''}\n` +
      `==============================\n\n${v?.content || ''}\n\n\n`
    )).join('\n')
  }

  const blob = new Blob([contentData], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  notifyToast(
    currentLang.value === 'es' ? `Archivo ${fileFormat.toUpperCase()} descargado` : `File ${fileFormat.toUpperCase()} exported`,
    'success'
  )
}

// Generación inicial o continuación dentro del mismo chat
const handleGenerate = async (isFollowUp = false) => {
  const promptToSend = isFollowUp ? followUpPrompt.value.trim() : inputPrompt.value.trim()
  if (!promptToSend || isGenerating.value) return
  isGenerating.value = true

  try {
    const response = await fetch(N8N_GENERATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        prompt: promptToSend,
        contextPrompt: isFollowUp ? activeSession.value?.prompt : '',
        tone: selectedTone.value,
        audience: selectedAudience.value,
        language: selectedLanguage.value
      })
    })

    if (!response.ok) throw new Error(`Error: ${response.status}`)
    const data = await response.json()

    let receivedVariants: any[] = []
    if (Array.isArray(data)) {
      receivedVariants = data[0]?.variants || data
    } else if (data && Array.isArray(data.variants)) {
      receivedVariants = data.variants
    }

    if (receivedVariants.length > 0) {
      const parsedVariants: VariantItem[] = receivedVariants.map((v: Partial<VariantItem>, index: number) => ({
        id: String(v.id || `${Date.now()}-${index}`),
        format: (v.format as ContentFormat) || 'Hilos',
        title: String(v.title || 'Variant Generated'),
        content: String(v.content || ''),
        isApproved: Boolean(v.isApproved ?? true),
        durationOrLength: String(v.durationOrLength || 'N/A'),
        tag: String(v.tag || 'OmniStudio')
      }))

      if (isFollowUp && activeSession.value) {
        updateCurrentSession(parsedVariants)
        followUpPrompt.value = ''
        notify(
          currentLang.value === 'es' ? '¡Conversación Actualizada!' : 'Thread Updated!',
          currentLang.value === 'es'
            ? 'Se han refinado y regenerado las variantes de esta sesión con éxito.'
            : 'The variants in this session have been refined successfully.',
          'success'
        )
      } else {
        saveSession(promptToSend, parsedVariants)
        inputPrompt.value = ''
        notify(
          currentLang.value === 'es' ? '¡Variantes Generadas!' : 'Variants Generated!',
          currentLang.value === 'es'
            ? 'Las 5 piezas omnicanal fueron procesadas exitosamente por n8n.'
            : 'All 5 omnichannel pieces have been processed successfully by n8n.',
          'success'
        )
      }
    }
  } catch (error) {
    console.error('Error:', error)
    notify('Error', currentLang.value === 'es' ? 'Fallo de conexión con n8n.' : 'Connection failure with n8n.', 'error')
  } finally {
    isGenerating.value = false
  }
}

// Regeneración individual
const regenerateSingleVariant = async (variant: VariantItem) => {
  if (regeneratingId.value || !activeSession.value) return
  regeneratingId.value = variant.id

  try {
    const response = await fetch(N8N_GENERATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        prompt: activeSession.value.prompt || variant.title,
        targetFormat: variant.format,
        tone: selectedTone.value,
        audience: selectedAudience.value,
        language: selectedLanguage.value
      })
    })

    if (!response.ok) throw new Error(`Error: ${response.status}`)
    const data = await response.json()

    let newPiece: Partial<VariantItem> | null = null
    if (Array.isArray(data)) {
      const list = data[0]?.variants || data
      newPiece = list.find((item: any) => item.format === variant.format) || list[0]
    } else if (data && Array.isArray(data.variants)) {
      newPiece = data.variants.find((item: any) => item.format === variant.format) || data.variants[0]
    } else if (data && data.title && data.content) {
      newPiece = data
    }

    if (newPiece) {
      const index = activeSession.value.variants.findIndex(v => v.id === variant.id)
      if (index !== -1) {
        activeSession.value.variants[index] = {
          ...activeSession.value.variants[index],
          title: newPiece.title || activeSession.value.variants[index].title,
          content: newPiece.content || activeSession.value.variants[index].content,
          durationOrLength: newPiece.durationOrLength || activeSession.value.variants[index].durationOrLength,
          tag: newPiece.tag || activeSession.value.variants[index].tag
        }

        notify(
          currentLang.value === 'es' ? '¡Pieza Regenerada!' : 'Piece Regenerated!',
          currentLang.value === 'es'
            ? `Se ha generado un nuevo enfoque para [${getTranslatedFormatName(variant.format)}].`
            : `A new take was generated for [${getTranslatedFormatName(variant.format)}].`,
          'success'
        )
      }
    }
  } catch (err) {
    console.error('Error al regenerar:', err)
    notify(
      'Error',
      currentLang.value === 'es' ? 'No se pudo regenerar esta variante.' : 'Failed to regenerate this variant.',
      'error'
    )
  } finally {
    regeneratingId.value = null
  }
}

// Programar variantes
const scheduleApproved = async () => {
  const approvedList = activeSession.value?.variants.filter(v => v.isApproved) || []
  if (!approvedList.length || isSyncing.value) return
  isSyncing.value = true

  try {
    const res = await fetch(N8N_SCHEDULE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ approvedVariants: approvedList })
    })

    if (!res.ok) throw new Error(`Error: ${res.status}`)

    notify(
      currentLang.value === 'es' ? '¡Programación Exitosa!' : 'Sync Complete!',
      currentLang.value === 'es'
        ? `Se agendaron ${approvedList.length} piezas en Google Calendar y Supabase.`
        : `${approvedList.length} pieces scheduled in Google Calendar and Supabase.`,
      'success'
    )
  } catch (err) {
    console.error(err)
    notify('Error', currentLang.value === 'es' ? 'Error al agendar.' : 'Failed to schedule.', 'error')
  } finally {
    isSyncing.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-3.5rem-2.75rem)] max-w-5xl mx-auto w-full px-4 md:px-8">
    
    <!-- ESTADO 1: PANTALLA INICIAL (NUEVO CHAT) -->
    <div v-if="!activeSession" class="flex-1 flex flex-col justify-center items-center py-8">
      <div 
        :class="[
          isDark ? 'bg-[#141418] border-[#292936] shadow-2xl' : 'bg-white border-neutral-200 shadow-xl',
          'border rounded-3xl p-6 md:p-8 w-full max-w-4xl transition-all'
        ]"
      >
        <div class="flex items-center justify-between pb-4 mb-4 border-b" :class="isDark ? 'border-[#262633]' : 'border-neutral-200'">
          <div class="flex items-center gap-3">
            <span class="w-3.5 h-3.5 bg-[#ff0000] rounded-sm shadow-sm"></span>
            <h1 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-base font-bold tracking-tight">
              {{ t?.headerTitle || 'Content Intelligence Hub' }}
            </h1>
          </div>
          
          <button
            @click="toggleLang"
            :class="[
              isDark ? 'bg-[#1e1e26] border-[#333342] text-neutral-200 hover:bg-[#282833]' : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200',
              'border px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer'
            ]"
          >
            <span>🌐</span>
            <span>{{ currentLang === 'es' ? 'ES' : 'EN' }}</span>
          </button>
        </div>

        <!-- Selectores de Configuración -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 items-end">
          <div>
            <label :class="isDark ? 'text-neutral-300 font-semibold' : 'text-neutral-700 font-semibold'" class="block text-xs mb-1">
              {{ t?.toneLabel || 'Tono Editorial' }}
            </label>
            <select 
              v-model="selectedTone"
              :class="[
                isDark ? 'bg-[#0e0e12] border-[#2c2c3a] text-neutral-100' : 'bg-neutral-50 border-neutral-300 text-neutral-900',
                'w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#ff0000] h-10'
              ]"
            >
              <option v-for="item in toneOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </div>

          <div>
            <label :class="isDark ? 'text-neutral-300 font-semibold' : 'text-neutral-700 font-semibold'" class="block text-xs mb-1">
              {{ t?.audienceLabel || 'Audiencia Objetivo' }}
            </label>
            <select 
              v-model="selectedAudience"
              :class="[
                isDark ? 'bg-[#0e0e12] border-[#2c2c3a] text-neutral-100' : 'bg-neutral-50 border-neutral-300 text-neutral-900',
                'w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#ff0000] h-10'
              ]"
            >
              <option v-for="item in audienceOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </div>

          <!-- Sliding Segmented Toggle -->
          <div>
            <label :class="isDark ? 'text-neutral-300 font-semibold' : 'text-neutral-700 font-semibold'" class="block text-xs mb-1">
              {{ t?.languageLabel || 'Idioma de Salida' }}
            </label>
            <div 
              :class="isDark ? 'bg-[#0e0e12] border-[#2c2c3a]' : 'bg-neutral-100 border-neutral-300'"
              class="border rounded-xl p-0.5 flex items-center relative h-10 cursor-pointer select-none"
            >
              <div 
                class="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-[#ff0000] rounded-lg shadow-md transition-all duration-300 ease-out"
                :class="selectedLanguage === 'Español' ? 'left-0.5' : 'left-[calc(50%+1px)]'"
              ></div>

              <button
                type="button"
                @click="selectedLanguage = 'Español'"
                class="flex-1 text-center text-xs font-bold relative z-10 transition-colors py-1.5 cursor-pointer"
                :class="selectedLanguage === 'Español' ? 'text-white' : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600')"
              >
                {{ currentLang === 'es' ? 'Español' : 'Spanish' }}
              </button>

              <button
                type="button"
                @click="selectedLanguage = 'Inglés'"
                class="flex-1 text-center text-xs font-bold relative z-10 transition-colors py-1.5 cursor-pointer"
                :class="selectedLanguage === 'Inglés' ? 'text-white' : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600')"
              >
                {{ currentLang === 'es' ? 'Inglés' : 'English' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Input de Premisa -->
        <div class="space-y-4">
          <textarea
            v-model="inputPrompt"
            rows="4"
            :placeholder="t?.placeholder || 'Write your core premise...'"
            :class="[
              isDark 
                ? 'bg-[#0e0e12] border-[#2c2c3a] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
              'w-full border rounded-2xl p-4 text-xs focus:outline-none resize-none transition-colors leading-relaxed font-sans'
            ]"
          ></textarea>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span :class="isDark ? 'text-neutral-400' : 'text-neutral-500'" class="text-xs">
              {{ t?.helperText || 'Genera 5 variantes simultáneas o regenera tarjetas individualmente.' }}
            </span>

            <button
              @click="() => handleGenerate(false)"
              :disabled="isGenerating || !inputPrompt.trim()"
              class="bg-[#ff0000] hover:bg-[#d90000] disabled:bg-neutral-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:cursor-not-allowed"
            >
              <svg v-if="isGenerating" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span v-else>⚡</span>
              <span>{{ isGenerating ? (t?.generatingBtn || 'Procesando...') : (t?.generateBtn || 'Generar Variantes') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ESTADO 2: HILO DE CONVERSACIÓN TIPO CHATBOT -->
    <div v-else class="flex-1 flex flex-col justify-between py-4 overflow-hidden">
      
      <!-- Barra Superior del Chat Activo -->
      <div 
        :class="isDark ? 'bg-[#141418] border-[#262633]' : 'bg-white border-neutral-200 shadow-sm'"
        class="border rounded-2xl p-3 px-5 mb-4 flex items-center justify-between shrink-0"
      >
        <div class="flex items-center gap-3">
          <button
            @click="startNewChat"
            :class="isDark ? 'bg-[#1f1f28] hover:bg-[#282836] text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-neutral-700/30"
          >
            <span>➕</span>
            <span>{{ currentLang === 'es' ? 'Nuevo Chat' : 'New Chat' }}</span>
          </button>
          <span class="text-xs opacity-50 font-mono">{{ activeSession.timestamp }}</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Exportar -->
          <div class="relative">
            <button
              @click="showExportDropdown = !showExportDropdown"
              :class="isDark ? 'bg-[#1e1e26] border-[#333342] text-neutral-200' : 'bg-neutral-100 border-neutral-300 text-neutral-800'"
              class="border px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>📥</span>
              <span>{{ t?.exportBtn || 'Exportar' }}</span>
              <span class="text-[9px] opacity-60">▼</span>
            </button>

            <div 
              v-if="showExportDropdown"
              :class="isDark ? 'bg-[#1e1e26] border-[#38384a] text-neutral-200 shadow-2xl' : 'bg-white border-neutral-200 text-neutral-800 shadow-xl'"
              class="absolute right-0 mt-1.5 w-40 border rounded-xl p-1 z-40 space-y-0.5"
            >
              <button @click="exportContent('md')" :class="isDark ? 'hover:bg-[#2a2a38]' : 'hover:bg-neutral-100'" class="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 cursor-pointer">
                <span>📝</span> Markdown (.md)
              </button>
              <button @click="exportContent('json')" :class="isDark ? 'hover:bg-[#2a2a38]' : 'hover:bg-neutral-100'" class="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 cursor-pointer">
                <span>📦</span> JSON (.json)
              </button>
              <button @click="exportContent('txt')" :class="isDark ? 'hover:bg-[#2a2a38]' : 'hover:bg-neutral-100'" class="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 cursor-pointer">
                <span>📄</span> Text (.txt)
              </button>
            </div>
          </div>

          <!-- Botón Programar Aprobados -->
          <button
            v-if="approvedCount > 0"
            @click="scheduleApproved"
            :disabled="isSyncing"
            class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>📅</span>
            <span>{{ isSyncing ? (t?.schedulingBtn || 'Sincronizando...') : `${t?.scheduleBtn || 'Programar'} (${approvedCount})` }}</span>
          </button>
        </div>
      </div>

      <!-- Área de Respuestas Conversacionales -->
      <div class="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin">
        
        <!-- Mensaje del Usuario (Burbuja completa y expandible) -->
        <div class="flex justify-end items-start gap-3 w-full">
          <div 
            :class="isDark ? 'bg-[#1f1f28] text-white border-[#313142]' : 'bg-neutral-900 text-white border-neutral-800'"
            class="w-full max-w-full md:max-w-3xl border p-4.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed shadow-md font-sans whitespace-pre-wrap wrap-break-word "
          >
            <div class="text-[10px] font-bold text-[#ff2b2b] uppercase mb-1 tracking-wider">
              {{ currentLang === 'es' ? 'PREMISA / PROMPT' : 'PREMISE / PROMPT' }}
            </div>
            {{ activeSession.prompt }}
          </div>
          <div class="w-7 h-7 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs shrink-0 font-bold shadow">
            👤
          </div>
        </div>

        <!-- Respuesta del Asistente OmniStudio -->
        <div class="flex items-start gap-3.5">
          <div class="w-7 h-7 rounded-full bg-[#ff0000] text-white flex items-center justify-center text-xs shrink-0 font-bold shadow-md">
            ▶
          </div>

          <div class="flex-1 space-y-4">
            <div 
              v-for="variant in activeSession.variants"
              :key="variant.id"
              :class="[
                isDark ? 'bg-[#141418] border-[#262633] shadow-md' : 'bg-white border-neutral-200 shadow-sm',
                'border rounded-2xl p-4 md:p-5 space-y-3 transition-all'
              ]"
            >
              <!-- Cabecera de la respuesta -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span :class="[getFormatBadgeStyle(variant.format), 'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider']">
                    {{ getTranslatedFormatName(variant.format) }}
                  </span>
                  <span :class="isDark ? 'text-neutral-400' : 'text-neutral-500'" class="text-[11px]">
                    {{ variant.durationOrLength }}
                  </span>
                  <span :class="isDark ? 'text-neutral-400' : 'text-neutral-500'" class="text-[11px] font-medium">
                    · {{ variant.tag }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5">
                  <!-- Botón Regenerar individual -->
                  <button 
                    @click="regenerateSingleVariant(variant)" 
                    :disabled="regeneratingId === variant.id"
                    :title="t?.regenerateTitle || 'Regenerar'"
                    :class="[
                      isDark ? 'bg-[#1e1e26] hover:bg-[#282833] text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
                      'px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50'
                    ]"
                  >
                    <svg 
                      class="w-3 h-3" 
                      :class="{ 'animate-spin': regeneratingId === variant.id }" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>{{ regeneratingId === variant.id ? (currentLang === 'es' ? 'Regenerando...' : 'Regenerating...') : (currentLang === 'es' ? 'Regenerar' : 'Regenerate') }}</span>
                  </button>

                  <button 
                    @click="copyToClipboard(variant.content)" 
                    :class="isDark ? 'bg-[#1e1e26] hover:bg-[#282833] text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'"
                    class="px-2 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    📋 {{ currentLang === 'es' ? 'Copiar' : 'Copy' }}
                  </button>
                  <button 
                    @click="openEditModal(variant)" 
                    :class="isDark ? 'bg-[#1e1e26] hover:bg-[#282833] text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'"
                    class="px-2 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    ✏️ {{ t?.editBtn || 'Editar' }}
                  </button>
                  <button 
                    @click="toggleApproval(variant.id)" 
                    :class="variant.isApproved ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/40 font-bold' : (isDark ? 'bg-[#1e1e26] text-neutral-400' : 'bg-neutral-100 text-neutral-700')"
                    class="px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    {{ variant.isApproved ? (currentLang === 'es' ? '✓ Aprobado' : '✓ Approved') : (currentLang === 'es' ? 'Aprobar' : 'Approve') }}
                  </button>
                </div>
              </div>

              <!-- Título & Contenido de la Respuesta -->
              <h3 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-sm font-bold leading-snug">
                {{ variant.title }}
              </h3>

              <div 
                :class="isDark ? 'bg-[#0e0e12] border-[#22222d] text-neutral-200' : 'bg-neutral-50 border-neutral-200 text-neutral-800'"
                class="border rounded-xl p-3.5 text-xs leading-relaxed whitespace-pre-line font-sans"
              >
                {{ variant.content }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de Input Flotante Inferior -->
      <div 
        :class="isDark ? 'bg-[#141418] border-[#292936] shadow-2xl' : 'bg-white border-neutral-200 shadow-xl'"
        class="border rounded-2xl p-2.5 px-3.5 flex items-center gap-3 shrink-0"
      >
        <textarea
          v-model="followUpPrompt"
          rows="1"
          @keydown.enter.exact.prevent="() => handleGenerate(true)"
          :placeholder="currentLang === 'es' ? 'Escribe otra premisa o instrucción para reescribir variantes...' : 'Type another premise or refinement instruction...'"
          :class="[
            isDark ? 'bg-transparent text-white placeholder-neutral-500' : 'bg-transparent text-neutral-900 placeholder-neutral-400',
            'w-full text-xs focus:outline-none resize-none'
          ]"
        ></textarea>

        <button
          @click="() => handleGenerate(true)"
          :disabled="isGenerating || !followUpPrompt.trim()"
          class="bg-[#ff0000] hover:bg-[#d90000] disabled:bg-neutral-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 disabled:cursor-not-allowed"
        >
          <svg v-if="isGenerating" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-else>⚡</span>
          <span>{{ isGenerating ? (currentLang === 'es' ? 'Generando...' : 'Generating...') : (currentLang === 'es' ? 'Enviar' : 'Send') }}</span>
        </button>
      </div>
    </div>

    <!-- MODAL DE EDICIÓN FLUIDO -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="activeEditingVariant"
        class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="activeEditingVariant = null"
      >
        <div :class="isDark ? 'bg-[#18181f] border-[#383848] text-white' : 'bg-white border-neutral-300 text-neutral-900'" class="border rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl">
          <h3 class="text-sm font-bold flex items-center gap-2">
            <span>✏️</span> {{ t?.modalTitle || 'Editor' }}
          </h3>

          <div>
            <label class="block text-xs font-medium mb-1 opacity-75">{{ t?.inputTitleLabel || 'Título' }}</label>
            <input v-model="tempEditTitle" type="text" :class="isDark ? 'bg-[#0f0f13] border-[#2c2c3a] text-white' : 'bg-neutral-50 border-neutral-300 text-black'" class="w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#ff0000]" />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1 opacity-75">{{ t?.inputContentLabel || 'Contenido' }}</label>
            <textarea v-model="tempEditContent" rows="7" :class="isDark ? 'bg-[#0f0f13] border-[#2c2c3a] text-white' : 'bg-neutral-50 border-neutral-300 text-black'" class="w-full border rounded-xl p-3 text-xs leading-relaxed focus:outline-none font-sans"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button @click="activeEditingVariant = null" :class="isDark ? 'bg-[#22222a] text-neutral-300' : 'bg-neutral-100 text-neutral-700'" class="px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer">
              {{ t?.discardBtn || 'Descartar' }}
            </button>
            <button @click="saveEdit" class="bg-[#ff0000] hover:bg-[#d90000] text-white px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer">
              {{ t?.saveBtn || 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>