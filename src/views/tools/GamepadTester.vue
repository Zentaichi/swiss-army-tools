<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gamepad = ref(null)
const connected = ref(false)
const animationId = ref(null)
const lastTimestamp = ref(0)

// Gamepad state
const buttons = ref([])
const axes = ref([])

// Button mapping for standard gamepad
const buttonNames = [
  'A', 'B', 'X', 'Y',
  'LB', 'RB', 'LT', 'RT',
  'Select', 'Start',
  'L-Stick', 'R-Stick',
  'D-Up', 'D-Down', 'D-Left', 'D-Right',
  'Home'
]

const axesNames = [
  'L-Stick X', 'L-Stick Y',
  'R-Stick X', 'R-Stick Y'
]

const connectHandler = (e) => {
  console.log('Gamepad connected:', e.gamepad.id)
  gamepad.value = e.gamepad
  connected.value = true
  startPolling()
}

const disconnectHandler = (e) => {
  console.log('Gamepad disconnected')
  gamepad.value = null
  connected.value = false
  stopPolling()
}

const pollGamepad = (timestamp) => {
  // Throttle updates to ~60fps
  if (timestamp - lastTimestamp.value < 16) {
    animationId.value = requestAnimationFrame(pollGamepad)
    return
  }
  lastTimestamp.value = timestamp

  const gamepads = navigator.getGamepads()
  const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3]

  if (gp) {
    gamepad.value = gp
    
    // Update buttons
    buttons.value = gp.buttons.map((btn, idx) => ({
      index: idx,
      name: buttonNames[idx] || `Button ${idx}`,
      pressed: btn.pressed,
      value: btn.value.toFixed(2)
    }))

    // Update axes
    axes.value = gp.axes.map((axis, idx) => ({
      index: idx,
      name: axesNames[idx] || `Axis ${idx}`,
      value: axis.toFixed(2)
    }))
  }

  animationId.value = requestAnimationFrame(pollGamepad)
}

const startPolling = () => {
  if (!animationId.value) {
    animationId.value = requestAnimationFrame(pollGamepad)
  }
}

const stopPolling = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

const checkForGamepad = () => {
  const gamepads = navigator.getGamepads()
  const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3]
  
  if (gp) {
    gamepad.value = gp
    connected.value = true
    startPolling()
  }
}

onMounted(() => {
  if ('getGamepads' in navigator) {
    window.addEventListener('gamepadconnected', connectHandler)
    window.addEventListener('gamepaddisconnected', disconnectHandler)
    
    // Check if gamepad is already connected
    checkForGamepad()
  } else {
    console.error('Gamepad API not supported')
  }
})

onUnmounted(() => {
  window.removeEventListener('gamepadconnected', connectHandler)
  window.removeEventListener('gamepaddisconnected', disconnectHandler)
  stopPolling()
})

const goBack = () => {
  router.push('/')
}

const getStickPosition = (xAxis, yAxis) => {
  const x = ((xAxis + 1) / 2) * 100
  const y = ((yAxis + 1) / 2) * 100
  return { x, y }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gamepad Tester</h1>
            <p class="text-sm text-gray-600">Test your gamepad buttons and analog sticks</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Connection Status -->
      <div class="tool-container mb-6">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-3 h-3 rounded-full transition-colors duration-300',
              connected ? 'bg-green-500' : 'bg-red-500'
            ]"
          ></div>
          <div>
            <p class="font-medium text-gray-900">
              {{ connected ? 'Gamepad Connected' : 'No Gamepad Connected' }}
            </p>
            <p v-if="connected && gamepad" class="text-sm text-gray-600 mt-1">
              {{ gamepad.id }}
            </p>
            <p v-else class="text-sm text-gray-600 mt-1">
              Press any button on your gamepad to connect
            </p>
          </div>
        </div>
      </div>

      <div v-if="connected" class="space-y-6 animate-fade-in">
        <!-- Buttons Section -->
        <div class="tool-container">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Buttons</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div
              v-for="button in buttons"
              :key="button.index"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-100 text-center',
                button.pressed
                  ? 'bg-primary-500 border-primary-600 text-white scale-95'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              ]"
            >
              <div class="font-semibold">{{ button.name }}</div>
              <div class="text-xs mt-1 opacity-75">{{ button.value }}</div>
            </div>
          </div>
        </div>

        <!-- Analog Sticks Section -->
        <div class="tool-container">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Analog Sticks</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Stick -->
            <div class="space-y-3">
              <h3 class="font-medium text-gray-700">Left Stick</h3>
              <div class="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-gray-300">
                <!-- Crosshair -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-full h-px bg-gray-300"></div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-px h-full bg-gray-300"></div>
                </div>
                <!-- Stick indicator -->
                <div
                  v-if="axes.length >= 2"
                  class="absolute w-8 h-8 bg-primary-500 rounded-full border-2 border-primary-700 transition-all duration-75"
                  :style="{
                    left: `calc(${getStickPosition(parseFloat(axes[0].value), 0).x}% - 1rem)`,
                    top: `calc(${getStickPosition(0, parseFloat(axes[1].value)).y}% - 1rem)`
                  }"
                ></div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-gray-50 p-2 rounded">
                  <span class="text-gray-600">X:</span>
                  <span class="font-mono ml-2">{{ axes[0]?.value || '0.00' }}</span>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <span class="text-gray-600">Y:</span>
                  <span class="font-mono ml-2">{{ axes[1]?.value || '0.00' }}</span>
                </div>
              </div>
            </div>

            <!-- Right Stick -->
            <div class="space-y-3">
              <h3 class="font-medium text-gray-700">Right Stick</h3>
              <div class="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-gray-300">
                <!-- Crosshair -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-full h-px bg-gray-300"></div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-px h-full bg-gray-300"></div>
                </div>
                <!-- Stick indicator -->
                <div
                  v-if="axes.length >= 4"
                  class="absolute w-8 h-8 bg-primary-500 rounded-full border-2 border-primary-700 transition-all duration-75"
                  :style="{
                    left: `calc(${getStickPosition(parseFloat(axes[2].value), 0).x}% - 1rem)`,
                    top: `calc(${getStickPosition(0, parseFloat(axes[3].value)).y}% - 1rem)`
                  }"
                ></div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-gray-50 p-2 rounded">
                  <span class="text-gray-600">X:</span>
                  <span class="font-mono ml-2">{{ axes[2]?.value || '0.00' }}</span>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <span class="text-gray-600">Y:</span>
                  <span class="font-mono ml-2">{{ axes[3]?.value || '0.00' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Raw Axes Data (for additional axes if any) -->
        <div v-if="axes.length > 4" class="tool-container">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Additional Axes</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="axis in axes.slice(4)"
              :key="axis.index"
              class="bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <div class="text-sm font-medium text-gray-700">{{ axis.name }}</div>
              <div class="font-mono text-lg mt-1">{{ axis.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions when not connected -->
      <div v-else class="tool-container text-center py-12 animate-fade-in">
        <div class="text-6xl mb-4">🎮</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Connect Your Gamepad</h3>
        <p class="text-gray-600 max-w-md mx-auto">
          Connect a gamepad to your computer and press any button to begin testing.
          This tool supports standard gamepads like Xbox, PlayStation, and most PC controllers.
        </p>
      </div>
    </main>
  </div>
</template>