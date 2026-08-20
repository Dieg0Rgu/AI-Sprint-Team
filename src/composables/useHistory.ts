import { ref, watch } from 'vue'
import type { VariantItem } from '../views/HomeView.vue'

export interface SessionHistoryItem {
  id: string
  prompt: string
  timestamp: string
  variants: VariantItem[]
}

const STORAGE_HISTORY_KEY = 'omnistudio_chat_history'

const loadHistory = (): SessionHistoryItem[] => {
  const saved = localStorage.getItem(STORAGE_HISTORY_KEY)
  if (saved) {
    try { return JSON.parse(saved) } catch { return [] }
  }
  return []
}

const historyList = ref<SessionHistoryItem[]>(loadHistory())
const activeSessionId = ref<string | null>(historyList.value[0]?.id || null)

export const useHistory = () => {
  watch(historyList, (newVal) => {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(newVal))
  }, { deep: true })

  const saveSession = (prompt: string, variants: VariantItem[]) => {
    const newItem: SessionHistoryItem = {
      id: `${Date.now()}`,
      prompt: prompt, // Guarda la premisa completa sin truncar
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      variants
    }
    historyList.value.unshift(newItem)
    activeSessionId.value = newItem.id
  }

  const updateCurrentSession = (variants: VariantItem[]) => {
    const index = historyList.value.findIndex(item => item.id === activeSessionId.value)
    if (index !== -1) {
      historyList.value[index].variants = variants
    }
  }

  const deleteSession = (id: string) => {
    historyList.value = historyList.value.filter(item => item.id !== id)
    if (activeSessionId.value === id) {
      activeSessionId.value = historyList.value[0]?.id || null
    }
  }

  return {
    historyList,
    activeSessionId,
    saveSession,
    updateCurrentSession,
    deleteSession
  }
}