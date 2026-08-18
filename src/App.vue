<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/layout/Header.vue'
import SideBar from './components/layout/SideBar.vue'
import Footer from './components/layout/Footer.vue'

const router = useRouter()
const isSidebarCollapsed = ref(false)
const searchQuery = ref('')
const isDark = ref(true)

const applyTheme = (dark: boolean) => {
  isDark.value = dark
  if (dark) {
    document.documentElement.classList.add('dark')
    document.body.style.backgroundColor = '#0f0f0f'
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.style.backgroundColor = '#f9f9f9'
    localStorage.setItem('theme', 'light')
  }
}

const toggleTheme = () => {
  applyTheme(!isDark.value)
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const triggerGenerateFromHeader = () => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      window.dispatchEvent(new CustomEvent('omni-trigger-generate'))
    })
  } else {
    window.dispatchEvent(new CustomEvent('omni-trigger-generate'))
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    applyTheme(savedTheme === 'dark')
  } else {
    applyTheme(true)
  }
})
</script>

<template>
  <div 
    :class="[
      isDark ? 'dark bg-[#0f0f0f] text-[#f1f1f1]' : 'bg-[#f9f9f9] text-[#0f0f0f]',
      'min-h-screen flex flex-col transition-colors duration-200 selection:bg-[#ff0000] selection:text-white'
    ]"
  >
    <Header 
      :is-dark="isDark"
      :search-query="searchQuery"
      @update:search-query="val => searchQuery = val"
      @toggle-sidebar="toggleSidebar"
      @toggle-theme="toggleTheme"
      @trigger-generate="triggerGenerateFromHeader"
    />
    
    <div class="flex flex-1 relative">
      <SideBar 
        :is-collapsed="isSidebarCollapsed" 
        :is-dark="isDark"
      />
      
      <main 
        :class="[
          'flex-1 flex flex-col transition-all duration-200 min-w-0 pb-8',
          isSidebarCollapsed ? 'ml-16' : 'ml-60'
        ]"
      >
        <div class="flex-1">
          <RouterView 
            :search-query="searchQuery" 
            :is-dark="isDark" 
          />
        </div>
        <Footer :is-dark="isDark" />
      </main>
    </div>
  </div>
</template>