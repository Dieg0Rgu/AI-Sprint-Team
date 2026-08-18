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

const formData = ref({
  name: '',
  email: '',
  channelType: 'YouTube Studio API',
  message: ''
})

const isSubmitted = ref(false)

const handleSubmit = () => {
  if (!formData.value.name || !formData.value.email) return
  isSubmitted.value = true
  setTimeout(() => {
    formData.value = {
      name: '',
      email: '',
      channelType: 'YouTube Studio API',
      message: ''
    }
    isSubmitted.value = false
  }, 3000)
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
            <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">Nombre de Operador / Creador</label>
            <input 
              v-model="formData.name"
              type="text" 
              required
              placeholder="Ej. Ana Rodríguez"
              :class="[
                isDark 
                  ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
                'w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none'
              ]"
            />
          </div>
          <div>
            <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">Correo Electrónico</label>
            <input 
              v-model="formData.email"
              type="email" 
              required
              placeholder="creador@estudio.com"
              :class="[
                isDark 
                  ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
                'w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none'
              ]"
            />
          </div>
        </div>

        <div>
          <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">Canal o Integración Principal</label>
          <select 
            v-model="formData.channelType"
            :class="[
              isDark 
                ? 'bg-[#0f0f0f] border-[#303030] text-white focus:border-[#ff0000]' 
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#ff0000]',
              'w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none'
            ]"
          >
            <option value="YouTube Studio API">YouTube Studio / Shorts Hub</option>
            <option value="Twitter/X Thread Webhook">Twitter/X API Automation</option>
            <option value="Medium/Substack Engine">Medium & Substack Direct Feed</option>
            <option value="Spotify Podcasters RSS">Spotify / Apple Podcasts RSS</option>
          </select>
        </div>

        <div>
          <label :class="isDark ? 'text-neutral-300' : 'text-neutral-700'" class="block text-xs font-semibold mb-1">Requerimiento o Mensaje</label>
          <textarea
            v-model="formData.message"
            rows="4"
            placeholder="Describe qué formatos adicionales necesitas programar..."
            :class="[
              isDark 
                ? 'bg-[#0f0f0f] border-[#303030] text-white placeholder-neutral-500 focus:border-[#ff0000]' 
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#ff0000]',
              'w-full border rounded-xl p-4 text-xs focus:outline-none resize-none'
            ]"
          ></textarea>
        </div>

        <div class="flex items-center justify-between pt-2">
          <p v-if="isSubmitted" class="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
            <span>✓</span> Solicitud enviada correctamente al equipo de ingeniería.
          </p>
          <div v-else></div>

          <button 
            type="submit"
            class="bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-colors cursor-pointer shadow-md"
          >
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
</template>