<script setup lang="ts">
import { ref } from 'vue'

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
    <div class="border-b border-[#272727] pb-4">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span class="w-3 h-3 bg-[#ff0000] rounded-sm"></span>
        Soporte de Inteligencia & API
      </h1>
      <p class="text-xs text-neutral-400 mt-1">
        Configura asistencia personalizada para conectar tus canales de publicación omnicanal.
      </p>
    </div>

    <div class="bg-[#181818] border border-[#272727] rounded-2xl p-6 shadow-lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-neutral-300 mb-1">Nombre de Operador / Creador</label>
            <input 
              v-model="formData.name"
              type="text" 
              required
              placeholder="Ej. Ana Rodríguez"
              class="w-full bg-[#0f0f0f] border border-[#303030] focus:border-[#ff0000] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-300 mb-1">Correo Electrónico</label>
            <input 
              v-model="formData.email"
              type="email" 
              required
              placeholder="creador@estudio.com"
              class="w-full bg-[#0f0f0f] border border-[#303030] focus:border-[#ff0000] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-neutral-300 mb-1">Canal o Integración Principal</label>
          <select 
            v-model="formData.channelType"
            class="w-full bg-[#0f0f0f] border border-[#303030] focus:border-[#ff0000] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
          >
            <option value="YouTube Studio API">YouTube Studio / Shorts Hub</option>
            <option value="Twitter/X Thread Webhook">Twitter/X API Automation</option>
            <option value="Medium/Substack Engine">Medium & Substack Direct Feed</option>
            <option value="Spotify Podcasters RSS">Spotify / Apple Podcasts RSS</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-neutral-300 mb-1">Requerimiento o Mensaje</label>
          <textarea
            v-model="formData.message"
            rows="4"
            placeholder="Describe qué formatos adicionales necesitas programar..."
            class="w-full bg-[#0f0f0f] border border-[#303030] focus:border-[#ff0000] rounded-xl p-4 text-xs text-white focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="flex items-center justify-between pt-2">
          <p v-if="isSubmitted" class="text-xs text-emerald-400 flex items-center gap-1.5">
            <span>✓</span> Solicitud enviada correctamente al equipo de ingeniería.
          </p>
          <div v-else></div>

          <button 
            type="submit"
            class="bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-colors"
          >
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
</template>