<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/layout/Header.vue'
import SideBar from './components/layout/SideBar.vue'
import Footer from './components/layout/Footer.vue'

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#0f0f0f] text-neutral-100 selection:bg-[#ff0000] selection:text-white">
    <Header @toggle-sidebar="toggleSidebar" />
    
    <div class="flex flex-1 relative">
      <SideBar :is-collapsed="isSidebarCollapsed" />
      
      <main 
        :class="[
          'flex-1 flex flex-col transition-all duration-200 min-w-0 pb-8',
          isSidebarCollapsed ? 'ml-16' : 'ml-60'
        ]"
      >
        <div class="flex-1">
          <RouterView />
        </div>
        <Footer />
      </main>
    </div>
  </div>
</template>