<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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

const goBack = () => {
  router.push('/')
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
  <div class="min-h-screen bg-white">
    <!-- Minimalistic Header -->
    <header class="border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center gap-6 animate-fade-in">
          <button
            @click="goBack"
            class="text-gray-400 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
          >
            ← Back
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Keyboard Tester</h1>
            <p class="text-gray-500 mt-1">Press any key to test your keyboard</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Keyboard Visualization -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Main Keyboard -->
          <div class="tool-container animate-fade-in">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Keyboard</h2>
            <div class="space-y-2">
              <div v-for="(row, idx) in keyboardLayout" :key="idx" class="flex gap-2">
                <button
                  v-for="keyObj in row"
                  :key="keyObj.key"
                  :class="[
                    keyObj.width,
                    'h-12 rounded-lg border-2 transition-all duration-100 text-xs font-medium flex items-center justify-center',
                    isKeyPressed(keyObj.key)
                      ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                      : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  tabindex="-1"
                >
                  {{ keyObj.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Arrow and Special Keys -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Special Keys -->
            <div class="tool-container stagger-item">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Special Keys</h3>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="keyObj in specialKeys"
                  :key="keyObj.key"
                  :class="[
                    keyObj.width,
                    'h-12 rounded-lg border-2 transition-all duration-100 text-xs font-medium',
                    isKeyPressed(keyObj.key)
                      ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                      : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  tabindex="-1"
                >
                  {{ keyObj.label }}
                </button>
              </div>
            </div>

            <!-- Arrow Keys -->
            <div class="tool-container stagger-item" style="animation-delay: 0.05s">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Arrow Keys</h3>
              <div class="flex flex-col items-center gap-2">
                <!-- Up arrow -->
                <button
                  :class="[
                    'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-medium',
                    isKeyPressed('ArrowUp')
                      ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                      : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:border-gray-300'
                  ]"
                  tabindex="-1"
                >
                  ↑
                </button>
                <!-- Left, Down, Right -->
                <div class="flex gap-2">
                  <button
                    :class="[
                      'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-medium',
                      isKeyPressed('ArrowLeft')
                        ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                        : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:border-gray-300'
                    ]"
                    tabindex="-1"
                  >
                    ←
                  </button>
                  <button
                    :class="[
                      'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-medium',
                      isKeyPressed('ArrowDown')
                        ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                        : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:border-gray-300'
                    ]"
                    tabindex="-1"
                  >
                    ↓
                  </button>
                  <button
                    :class="[
                      'w-12 h-12 rounded-lg border-2 transition-all duration-100 text-lg font-medium',
                      isKeyPressed('ArrowRight')
                        ? 'bg-gray-900 border-gray-900 text-white scale-95 shadow-lg shadow-gray-900/20'
                        : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:border-gray-300'
                    ]"
                    tabindex="-1"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key History -->
        <div class="xl:col-span-1">
          <div class="tool-container animate-fade-in sticky top-8" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Key History</h2>
              <button
                v-if="keyHistory.length > 0"
                @click="clearHistory"
                class="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                Clear
              </button>
            </div>

            <div v-if="keyHistory.length === 0" class="text-center py-12">
              <div class="text-5xl mb-4">⌨️</div>
              <p class="text-gray-500 text-sm">Press any key to start</p>
            </div>

            <div v-else class="space-y-2 max-h-[600px] overflow-y-auto">
              <div
                v-for="item in keyHistory"
                :key="item.id"
                class="bg-gray-50 p-3 rounded-xl border border-gray-200 animate-fade-in"
              >
                <div class="flex items-center justify-between">
                  <div class="font-mono text-sm font-semibold text-gray-900">
                    {{ item.key }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ item.timestamp }}
                  </div>
                </div>
                <div class="text-xs text-gray-400 mt-1 font-mono">
                  {{ item.code }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="tool-container mt-8 stagger-item" style="animation-delay: 0.15s">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <div class="font-semibold text-gray-900 mb-2">🎯 Test Keys</div>
            <p>Click anywhere on the page and start pressing keys. They will light up on the keyboard diagram.</p>
          </div>
          <div>
            <div class="font-semibold text-gray-900 mb-2">📋 View History</div>
            <p>All key presses are logged in the history panel with timestamps and key codes.</p>
          </div>
          <div>
            <div class="font-semibold text-gray-900 mb-2">🔄 Multiple Keys</div>
            <p>You can press multiple keys simultaneously to test key combinations.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>