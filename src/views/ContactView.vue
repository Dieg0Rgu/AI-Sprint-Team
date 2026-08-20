<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { useLanguage } from '../composables/useLanguage'

const props = withDefaults(
  defineProps<{
    isDark?: boolean
  }>(),
  {
    isDark: true
  }
)

const { currentLang, t } = useLanguage()

const N8N_CONTACT_URL = 'https://devaidiego.app.n8n.cloud/webhook/contactrequest'

const form = ref({
  name: '',
  email: '',
  channel: 'YouTube Studio / Shorts Hub',
  message: ''
})

const isSending = ref(false)

const submitForm = async () => {
  if (!form.value.name || !form.value.message || isSending.value) return
  isSending.value = true

  try {
    const res = await fetch(N8N_CONTACT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (!res.ok) throw new Error('Error al despachar')

    // Alerta de éxito con SweetAlert2
    await Swal.fire({
      title: currentLang.value === 'es' ? '¡Notificación Enviada!' : 'Notification Sent!',
      text: currentLang.value === 'es'
        ? 'Tu solicitud ha sido distribuida por los canales automatizados de OmniStudio.'
        : 'Your notification has been dispatched across all configured channels.',
      icon: 'success',
      background: props.isDark ? '#141414' : '#ffffff',
      color: props.isDark ? '#ffffff' : '#111827',
      confirmButtonColor: '#ff0000',
      customClass: {
        popup: 'rounded-2xl border border-neutral-800 shadow-2xl',
        confirmButton: 'rounded-xl text-xs font-semibold px-5 py-2.5 shadow-md'
      }
    })

    form.value.message = ''
  } catch (err) {
    console.error(err)
    Swal.fire({
      title: 'Error',
      text: currentLang.value === 'es'
        ? 'No se pudo conectar con el webhook de n8n.'
        : 'Failed to send notification. Verify n8n webhook.',
      icon: 'error',
      background: props.isDark ? '#141414' : '#ffffff',
      color: props.isDark ? '#ffffff' : '#111827',
      confirmButtonColor: '#ff0000'
    })
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="px-6 py-6 md:px-10 max-w-4xl mx-auto space-y-6">
    <div 
      :class="isDark ? 'bg-[#141414] border-[#222222]' : 'bg-white border-neutral-200 shadow-sm'"
      class="border rounded-2xl p-6 transition-colors"
    >
      <div class="flex items-center gap-2.5 mb-2">
        <span class="w-3 h-3 bg-[#ff0000] rounded-sm"></span>
        <h1 :class="isDark ? 'text-white' : 'text-neutral-900'" class="text-lg font-bold tracking-tight">
          {{ t.contactTitle }}
        </h1>
      </div>
      <p :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="text-xs">
        {{ t.contactSubtitle }}
      </p>
    </div>

    <div 
      :class="isDark ? 'bg-[#141414] border-[#222222]' : 'bg-white border-neutral-200 shadow-sm'"
      class="border rounded-2xl p-6 space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="block text-xs font-medium mb-1">
            {{ t.formName }}
          </label>
          <input
            v-model="form.name"
            type="text"
            :class="[
              isDark ? 'bg-[#0a0a0a] border-[#292929] text-white focus:border-[#ff0000]' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#ff0000]',
              'w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors'
            ]"
          />
        </div>

        <div>
          <label :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="block text-xs font-medium mb-1">
            {{ t.formEmail }}
          </label>
          <input
            v-model="form.email"
            type="email"
            :class="[
              isDark ? 'bg-[#0a0a0a] border-[#292929] text-white focus:border-[#ff0000]' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#ff0000]',
              'w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors'
            ]"
          />
        </div>
      </div>

      <div>
        <label :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="block text-xs font-medium mb-1">
          {{ t.formChannel }}
        </label>
        <select
          v-model="form.channel"
          :class="[
            isDark ? 'bg-[#0a0a0a] border-[#292929] text-neutral-200' : 'bg-neutral-50 border-neutral-300 text-neutral-800',
            'w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors'
          ]"
        >
          <option value="YouTube Studio / Shorts Hub">YouTube Studio / Shorts Hub</option>
          <option value="Twitter/X API Automation">Twitter/X API Automation</option>
          <option value="Medium & Substack Direct Feed">Medium & Substack Direct Feed</option>
          <option value="Spotify / Apple Podcasts RSS">Spotify / Apple Podcasts RSS</option>
        </select>
      </div>

      <div>
        <label :class="isDark ? 'text-neutral-400' : 'text-neutral-600'" class="block text-xs font-medium mb-1">
          {{ t.formMessage }}
        </label>
        <textarea
          v-model="form.message"
          rows="4"
          :class="[
            isDark ? 'bg-[#0a0a0a] border-[#292929] text-white focus:border-[#ff0000]' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#ff0000]',
            'w-full border rounded-xl p-3.5 text-xs focus:outline-none transition-colors'
          ]"
        ></textarea>
      </div>

      <div class="flex justify-end pt-2">
        <button
          @click="submitForm"
          :disabled="isSending || !form.name || !form.message"
          class="bg-[#ff0000] hover:bg-[#cc0000] disabled:bg-neutral-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <svg v-if="isSending" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-else>🚀</span>
          <span>{{ isSending ? t.formSending : t.formSubmit }}</span>
        </button>
      </div>
    </div>
  </div>
</template>