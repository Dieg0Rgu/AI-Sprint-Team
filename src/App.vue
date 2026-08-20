<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
import SideBar from './components/layout/SideBar.vue'
import Footer from './components/layout/Footer.vue'

const isDark = ref(true)
const searchQuery = ref('')
</script>

<template>
  <div :class="isDark ? 'bg-[#09090b] text-white' : 'bg-neutral-100 text-neutral-900'" class="min-h-screen flex flex-col font-sans transition-colors">
    <Header 
      :isDark="isDark" 
      :searchQuery="searchQuery" 
      @update:searchQuery="searchQuery = $event"
      @toggleTheme="isDark = !isDark" 
    />

    <div class="flex flex-1 overflow-hidden">
      <SideBar :isDark="isDark" />

      <div class="flex-1 flex flex-col justify-between overflow-y-auto bg-transparent">
        <main class="flex-1 w-full">
          <RouterView :searchQuery="searchQuery" :isDark="isDark" />
        </main>
        
        <Footer :isDark="isDark" />
      </div>
    </div>
  </div>
</template>