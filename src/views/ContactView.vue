<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    searchQuery?: string
    isDark?: boolean
  }>(),
  {
    searchQuery: '',
    isDark: true
  }
)

// URL del Webhook en n8n Cloud para contacto
const N8N_CONTACT_URL = 'https://devaidiego.app.n8n.cloud/webhook-test/contactrequest'

const formData = ref({
  name: '',
  email: '',
  channelType: 'YouTube Studio API',
  message: ''
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!formData.value.name.trim() || !formData.value.email.trim() || isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(N8N_CONTACT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.value.name.trim(),
        email: formData.value.email.trim(),
        channelType: formData.value.channelType,
        message: formData.value.message.trim()
      })
    })

    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.status}`)
    }

    isSubmitted.value = true
    formData.value = {
      name: '',
      email: '',
      channelType: 'YouTube Studio API',
      message: ''
    }

    setTimeout(() => {
      isSubmitted.value = false
    }, 4500)
  } catch (error) {
    console.error('Error enviando formulario a n8n:', error)
    errorMessage.value = 'No se pudo conectar con el servidor de automatización.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <div :class="isDark ? 'border-[#272727]' : 'border-neutral-200'" class="border-b pb-4">
      <h1 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-2xl font-bold flex items-center gap-2">
        <span class="w-3 h-3 bg-[#ff0000] rounded-sm"></span>
        Soporte de Inteligencia & API
      </h1>
      <p :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs mt-1">
        Configura asistencia personalizada para conectar tus canales de publicación omnicanal.
      </p>
    </div>

    <div 
      :class="[
        isDark ? 'bg-[#181818] border-[#272727]' : 'bg-white border-neutral-200 shadow-sm',
        'border rounded-2xl p-6 transition-colors'
      ]"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">
              Nombre de Operador / Creador
            </label>
            <input 
              v-model="formData.name"
              type="text" 
              required
              placeholder="Ej. Ana Rodríguez"
              :class="[
                isDark 
                  ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
                'w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors'
              ]"
            />
          </div>
          <div>
            <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">
              Correo Electrónico
            </label>
            <input 
              v-model="formData.email"
              type="email" 
              required
              placeholder="creador@estudio.com"
              :class="[
                isDark 
                  ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
                'w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors'
              ]"
            />
          </div>
        </div>

        <div>
          <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">
            Canal o Integración Principal
          </label>
          <select 
            v-model="formData.channelType"
            :class="[
              isDark 
                ? 'bg-[#0f0f0f] border-[#303030] text-white focus:border-[#ff0000]' 
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#ff0000]',
              'w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors'
            ]"
          >
            <option value="YouTube Studio / Shorts Hub">YouTube Studio / Shorts Hub</option>
            <option value="Twitter/X API Automation">Twitter/X API Automation</option>
            <option value="Medium & Substack Direct Feed">Medium & Substack Direct Feed</option>
            <option value="Spotify / Apple Podcasts RSS">Spotify / Apple Podcasts RSS</option>
          </select>
        </div>

        <div>
          <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">
            Requerimiento o Mensaje
          </label>
          <textarea
            v-model="formData.message"
            rows="4"
            required
            placeholder="Describe qué formatos adicionales necesitas programar..."
            :class="[
              isDark 
                ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
              'w-full border rounded-xl p-4 text-xs focus:outline-none resize-none transition-colors'
            ]"
          ></textarea>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div>
            <p v-if="isSubmitted" class="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
              <span>✓</span> Solicitud enviada correctamente a Discord, Telegram y Correo.
            </p>
            <p v-if="errorMessage" class="text-xs text-red-500 font-medium">
              {{ errorMessage }}
            </p>
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="bg-[#ff0000] hover:bg-[#cc0000] disabled:bg-neutral-500 text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-colors cursor-pointer shadow-md flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Despachando...' : 'Enviar Solicitud' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>