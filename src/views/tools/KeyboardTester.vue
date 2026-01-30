<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

const pressedKeys = ref(new Set())
const keyHistory = ref([])
const maxHistory = 50

// Keyboard layout - standard QWERTY
const keyboardLayout = [
  // Row 1 - Function keys
  [
    { key: 'Escape', label: 'Esc', width: 'w-12' },
    { key: 'F1', label: 'F1', width: 'w-12' },
    { key: 'F2', label: 'F2', width: 'w-12' },
    { key: 'F3', label: 'F3', width: 'w-12' },
    { key: 'F4', label: 'F4', width: 'w-12' },
    { key: 'F5', label: 'F5', width: 'w-12' },
    { key: 'F6', label: 'F6', width: 'w-12' },
    { key: 'F7', label: 'F7', width: 'w-12' },
    { key: 'F8', label: 'F8', width: 'w-12' },
    { key: 'F9', label: 'F9', width: 'w-12' },
    { key: 'F10', label: 'F10', width: 'w-12' },
    { key: 'F11', label: 'F11', width: 'w-12' },
    { key: 'F12', label: 'F12', width: 'w-12' }
  ],
  // Row 2 - Number row
  [
    { key: '`', label: '`', width: 'w-12' },
    { key: '1', label: '1', width: 'w-12' },
    { key: '2', label: '2', width: 'w-12' },
    { key: '3', label: '3', width: 'w-12' },
    { key: '4', label: '4', width: 'w-12' },
    { key: '5', label: '5', width: 'w-12' },
    { key: '6', label: '6', width: 'w-12' },
    { key: '7', label: '7', width: 'w-12' },
    { key: '8', label: '8', width: 'w-12' },
    { key: '9', label: '9', width: 'w-12' },
    { key: '0', label: '0', width: 'w-12' },
    { key: '-', label: '-', width: 'w-12' },
    { key: '=', label: '=', width: 'w-12' },
    { key: 'Backspace', label: 'Back', width: 'w-20' }
  ],
  // Row 3 - QWERTY
  [
    { key: 'Tab', label: 'Tab', width: 'w-16' },
    { key: 'q', label: 'Q', width: 'w-12' },
    { key: 'w', label: 'W', width: 'w-12' },
    { key: 'e', label: 'E', width: 'w-12' },
    { key: 'r', label: 'R', width: 'w-12' },
    { key: 't', label: 'T', width: 'w-12' },
    { key: 'y', label: 'Y', width: 'w-12' },
    { key: 'u', label: 'U', width: 'w-12' },
    { key: 'i', label: 'I', width: 'w-12' },
    { key: 'o', label: 'O', width: 'w-12' },
    { key: 'p', label: 'P', width: 'w-12' },
    { key: '[', label: '[', width: 'w-12' },
    { key: ']', label: ']', width: 'w-12' },
    { key: '\\', label: '\\', width: 'w-16' }
  ],
  // Row 4 - ASDF
  [
    { key: 'CapsLock', label: 'Caps', width: 'w-20' },
    { key: 'a', label: 'A', width: 'w-12' },
    { key: 's', label: 'S', width: 'w-12' },
    { key: 'd', label: 'D', width: 'w-12' },
    { key: 'f', label: 'F', width: 'w-12' },
    { key: 'g', label: 'G', width: 'w-12' },
    { key: 'h', label: 'H', width: 'w-12' },
    { key: 'j', label: 'J', width: 'w-12' },
    { key: 'k', label: 'K', width: 'w-12' },
    { key: 'l', label: 'L', width: 'w-12' },
    { key: ';', label: ';', width: 'w-12' },
    { key: '\'', label: '\'', width: 'w-12' },
    { key: 'Enter', label: 'Enter', width: 'w-24' }
  ],
  // Row 5 - ZXCV
  [
    { key: 'ShiftLeft', label: 'Shift', width: 'w-28' },
    { key: 'z', label: 'Z', width: 'w-12' },
    { key: 'x', label: 'X', width: 'w-12' },
    { key: 'c', label: 'C', width: 'w-12' },
    { key: 'v', label: 'V', width: 'w-12' },
    { key: 'b', label: 'B', width: 'w-12' },
    { key: 'n', label: 'N', width: 'w-12' },
    { key: 'm', label: 'M', width: 'w-12' },
    { key: ',', label: ',', width: 'w-12' },
    { key: '.', label: '.', width: 'w-12' },
    { key: '/', label: '/', width: 'w-12' },
    { key: 'ShiftRight', label: 'Shift', width: 'w-28' }
  ],
  // Row 6 - Bottom row
  [
    { key: 'ControlLeft', label: 'Ctrl', width: 'w-16' },
    { key: 'MetaLeft', label: 'Win', width: 'w-16' },
    { key: 'AltLeft', label: 'Alt', width: 'w-16' },
    { key: ' ', label: 'Space', width: 'flex-1' },
    { key: 'AltRight', label: 'Alt', width: 'w-16' },
    { key: 'MetaRight', label: 'Win', width: 'w-16' },
    { key: 'ContextMenu', label: 'Menu', width: 'w-16' },
    { key: 'ControlRight', label: 'Ctrl', width: 'w-16' }
  ]
]

// Arrow keys and special keys
const arrowKeys = [
  { key: 'ArrowUp', label: '↑', width: 'w-12' },
  { key: 'ArrowLeft', label: '←', width: 'w-12' },
  { key: 'ArrowDown', label: '↓', width: 'w-12' },
  { key: 'ArrowRight', label: '→', width: 'w-12' }
]

const specialKeys = [
  { key: 'Insert', label: 'Ins', width: 'w-12' },
  { key: 'Home', label: 'Home', width: 'w-12' },
  { key: 'PageUp', label: 'PgUp', width: 'w-12' },
  { key: 'Delete', label: 'Del', width: 'w-12' },
  { key: 'End', label: 'End', width: 'w-12' },
  { key: 'PageDown', label: 'PgDn', width: 'w-12' }
]

const handleKeyDown = (e) => {
  e.preventDefault()
  
  const keyCode = e.code
  const key = e.key
  
  // Add to pressed keys
  pressedKeys.value.add(keyCode)
  
  // Add to history
  const timestamp = new Date().toLocaleTimeString()
  keyHistory.value.unshift({
    key: key === ' ' ? 'Space' : key,
    code: keyCode,
    timestamp,
    id: Date.now()
  })
  
  // Limit history
  if (keyHistory.value.length > maxHistory) {
    keyHistory.value = keyHistory.value.slice(0, maxHistory)
  }
}

const handleKeyUp = (e) => {
  e.preventDefault()
  const keyCode = e.code
  pressedKeys.value.delete(keyCode)
}

const isKeyPressed = (keyCode) => {
  // Handle letter keys (they come as lowercase from event)
  if (keyCode.length === 1 && keyCode.match(/[a-z]/i)) {
    return pressedKeys.value.has(`Key${keyCode.toUpperCase()}`)
  }
  
  // Handle number keys
  if (keyCode.match(/^[0-9]$/)) {
    return pressedKeys.value.has(`Digit${keyCode}`)
  }
  
  // Handle special characters
  const specialMap = {
    '`': 'Backquote',
    '-': 'Minus',
    '=': 'Equal',
    '[': 'BracketLeft',
    ']': 'BracketRight',
    '\\': 'Backslash',
    ';': 'Semicolon',
    '\'': 'Quote',
    ',': 'Comma',
    '.': 'Period',
    '/': 'Slash',
    ' ': 'Space'
  }
  
  if (specialMap[keyCode]) {
    return pressedKeys.value.has(specialMap[keyCode])
  }
  
  return pressedKeys.value.has(keyCode)
}

const clearHistory = () => {
  keyHistory.value = []
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Keyboard Tester" 
      description="Press any key to test your keyboard" 
    />

    <main class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Keyboard Visualization -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Main Keyboard -->
          <ToolCard title="Keyboard" :collapsible="false">
            <div class="space-y-2">
              <div v-for="(row, idx) in keyboardLayout" :key="idx" class="flex gap-2">
                <button
                  v-for="keyObj in row"
                  :key="keyObj.key"
                  :class="[
                    keyObj.width,
                    'h-12 rounded-lg border-2 transition-all duration-100 text-xs font-semibold flex items-center justify-center',
                    isKeyPressed(keyObj.key)
                      ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  tabindex="-1"
                >
                  {{ keyObj.label }}
                </button>
              </div>
            </div>
          </ToolCard>

          <!-- Arrow and Special Keys -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Special Keys -->
            <ToolCard title="Special Keys">
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="keyObj in specialKeys"
                  :key="keyObj.key"
                  :class="[
                    keyObj.width,
                    'h-12 rounded-lg border-2 transition-all duration-100 text-xs font-semibold',
                    isKeyPressed(keyObj.key)
                      ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  tabindex="-1"
                >
                  {{ keyObj.label }}
                </button>
              </div>
            </ToolCard>

            <!-- Arrow Keys -->
            <ToolCard title="Arrow Keys">
              <div class="flex flex-col items-center gap-2">
                <!-- Up arrow -->
                <button
                  :class="[
                    'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-semibold',
                    isKeyPressed('ArrowUp')
                      ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  tabindex="-1"
                >
                  ↑
                </button>
                <!-- Left, Down, Right -->
                <div class="flex gap-2">
                  <button
                    :class="[
                      'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-semibold',
                      isKeyPressed('ArrowLeft')
                        ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    ]"
                    tabindex="-1"
                  >
                    ←
                  </button>
                  <button
                    :class="[
                      'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-semibold',
                      isKeyPressed('ArrowDown')
                        ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    ]"
                    tabindex="-1"
                  >
                    ↓
                  </button>
                  <button
                    :class="[
                      'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-semibold',
                      isKeyPressed('ArrowRight')
                        ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    ]"
                    tabindex="-1"
                  >
                    →
                  </button>
                </div>
              </div>
            </ToolCard>
          </div>

          <!-- Instructions -->
          <ToolCard title="Instructions" :default-collapsed="true">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <div class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Test Keys
                </div>
                <p>Click anywhere on the page and start pressing keys. They will light up on the keyboard diagram.</p>
              </div>
              <div>
                <div class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View History
                </div>
                <p>All key presses are logged in the history panel with timestamps and key codes.</p>
              </div>
              <div>
                <div class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Multiple Keys
                </div>
                <p>You can press multiple keys simultaneously to test key combinations.</p>
              </div>
            </div>
          </ToolCard>
        </div>

        <!-- Key History -->
        <div class="xl:col-span-1">
          <ToolCard title="Key History" :collapsible="false">
            <template v-slot:title>
              <div class="flex items-center justify-between w-full">
                <h3 class="text-base font-semibold text-gray-900">Key History</h3>
                <button
                  v-if="keyHistory.length > 0"
                  @click="clearHistory"
                  class="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </template>

            <div v-if="keyHistory.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <p class="text-gray-400 text-sm font-medium">Press any key to start</p>
            </div>

            <div v-else class="space-y-2 max-h-[600px] overflow-y-auto">
              <div
                v-for="item in keyHistory"
                :key="item.id"
                class="bg-gray-50 p-3 rounded-lg border border-gray-100"
              >
                <div class="flex items-center justify-between">
                  <div class="font-mono text-sm font-semibold text-gray-900">
                    {{ item.key }}
                  </div>
                  <div class="text-xs text-gray-500 font-medium">
                    {{ item.timestamp }}
                  </div>
                </div>
                <div class="text-xs text-gray-400 mt-1 font-mono">
                  {{ item.code }}
                </div>
              </div>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>