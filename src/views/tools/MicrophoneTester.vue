<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'

const isSupported = ref(true)
const hasPermission = ref(false)
const isRecording = ref(false)
const audioLevel = ref(0)
const peakLevel = ref(0)
const devices = ref([])
const selectedDevice = ref('')
const error = ref('')

let audioContext = null
let analyser = null
let microphone = null
let animationId = null
let mediaStream = null

const checkSupport = () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    isSupported.value = false
    error.value = 'Your browser does not support microphone access'
  }
}

const getDevices = async () => {
  try {
    const deviceList = await navigator.mediaDevices.enumerateDevices()
    devices.value = deviceList.filter(device => device.kind === 'audioinput')
    if (devices.value.length > 0 && !selectedDevice.value) {
      selectedDevice.value = devices.value[0].deviceId
    }
  } catch (err) {
    error.value = 'Failed to enumerate devices: ' + err.message
  }
}

const requestPermission = async () => {
  try {
    error.value = ''
    const constraints = {
      audio: selectedDevice.value ? { deviceId: selectedDevice.value } : true
    }
    
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    hasPermission.value = true
    
    // Get updated device list with labels
    await getDevices()
    
    startAnalysis(mediaStream)
  } catch (err) {
    error.value = 'Microphone access denied: ' + err.message
    hasPermission.value = false
  }
}

const startAnalysis = (stream) => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioContext.createAnalyser()
  microphone = audioContext.createMediaStreamSource(stream)
  
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.8
  
  microphone.connect(analyser)
  isRecording.value = true
  
  updateLevel()
}

const updateLevel = () => {
  if (!analyser || !isRecording.value) return
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(dataArray)
  
  // Calculate average level
  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i]
  }
  const average = sum / dataArray.length
  
  // Normalize to 0-100
  audioLevel.value = Math.min(100, (average / 255) * 100 * 2)
  
  // Update peak
  if (audioLevel.value > peakLevel.value) {
    peakLevel.value = audioLevel.value
  }
  
  animationId = requestAnimationFrame(updateLevel)
}

const stop = () => {
  isRecording.value = false
  
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  
  if (microphone) {
    microphone.disconnect()
    microphone = null
  }
  
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  
  audioLevel.value = 0
}

const resetPeak = () => {
  peakLevel.value = 0
}

const changeDevice = async () => {
  if (isRecording.value) {
    stop()
  }
  hasPermission.value = false
  await requestPermission()
}

onMounted(() => {
  checkSupport()
  if (isSupported.value) {
    getDevices()
  }
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <ToolHeader 
      title="Microphone Tester"
      description="Test and visualize microphone input" 
    />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Not Supported Warning -->
      <div v-if="!isSupported" class="tool-container animate-fade-in">
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🚫</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Not Supported</h3>
          <p class="text-gray-600">{{ error }}</p>
        </div>
      </div>

      <!-- Main Interface -->
      <div v-else class="space-y-8">
        <!-- Device Selection -->
        <div class="tool-container animate-fade-in">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Microphone Device</h2>
          <select
            v-model="selectedDevice"
            @change="changeDevice"
            :disabled="isRecording"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50 disabled:opacity-50"
          >
            <option value="">Default Device</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
              {{ device.label || `Microphone ${device.deviceId.substring(0, 8)}` }}
            </option>
          </select>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="tool-container animate-fade-in bg-red-50 border-red-200">
          <div class="flex items-center gap-3 text-red-700">
            <span class="text-2xl">⚠️</span>
            <p class="text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Permission Request -->
        <div v-if="!hasPermission" class="tool-container animate-fade-in text-center py-12">
          <div class="text-6xl mb-4">🎤</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Microphone Access Required</h3>
          <p class="text-gray-600 mb-6">Click the button below to allow microphone access</p>
          <button
            @click="requestPermission"
            class="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            Grant Access
          </button>
        </div>

        <!-- Audio Visualizer -->
        <div v-if="hasPermission" class="space-y-8">
          <!-- Level Meter -->
          <div class="tool-container stagger-item">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Audio Level</h2>
              <div class="flex gap-2">
                <button
                  v-if="isRecording"
                  @click="stop"
                  class="px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                >
                  Stop
                </button>
                <button
                  v-else
                  @click="requestPermission"
                  class="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
                >
                  Start
                </button>
              </div>
            </div>

            <!-- Circular Level Indicator -->
            <div class="flex items-center justify-center py-12">
              <div class="relative w-64 h-64">
                <!-- Background circle -->
                <svg class="w-64 h-64 transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="currentColor"
                    stroke-width="20"
                    fill="none"
                    class="text-gray-200"
                  />
                  <!-- Level circle -->
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="currentColor"
                    :stroke-width="20"
                    fill="none"
                    :class="[
                      audioLevel > 80 ? 'text-red-500' :
                      audioLevel > 60 ? 'text-yellow-500' :
                      'text-green-500'
                    ]"
                    :stroke-dasharray="691.15"
                    :stroke-dashoffset="691.15 - (691.15 * audioLevel / 100)"
                    class="transition-all duration-100"
                  />
                </svg>
                
                <!-- Center text -->
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <div class="text-5xl font-bold text-gray-900">{{ Math.round(audioLevel) }}</div>
                  <div class="text-sm text-gray-500 uppercase tracking-wider mt-2">dB Level</div>
                </div>
              </div>
            </div>

            <!-- Bar Visualization -->
            <div class="mt-8">
              <div class="h-12 bg-gray-100 rounded-xl overflow-hidden relative">
                <div
                  class="h-full transition-all duration-100"
                  :style="{ width: audioLevel + '%' }"
                  :class="[
                    audioLevel > 80 ? 'bg-red-500' :
                    audioLevel > 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  ]"
                ></div>
                
                <!-- Threshold markers -->
                <div class="absolute inset-0 flex items-center">
                  <div class="absolute left-[60%] h-full w-0.5 bg-gray-300"></div>
                  <div class="absolute left-[80%] h-full w-0.5 bg-gray-400"></div>
                </div>
              </div>
              
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>Quiet</span>
                <span>Normal</span>
                <span>Loud</span>
                <span>Too Loud</span>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="tool-container stagger-item" style="animation-delay: 0.05s">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Statistics</h2>
              <button
                @click="resetPeak"
                class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Reset Peak
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ Math.round(audioLevel) }} dB</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Current Level</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ Math.round(peakLevel) }} dB</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Peak Level</div>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="tool-container stagger-item" style="animation-delay: 0.1s">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-start gap-3">
                <span class="text-lg">🎤</span>
                <p><strong>Test your microphone:</strong> Speak into your microphone and watch the level indicator respond to your voice.</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-lg">📊</span>
                <p><strong>Monitor levels:</strong> The green zone is good, yellow is getting loud, and red indicates the audio is too loud.</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-lg">🔧</span>
                <p><strong>Adjust settings:</strong> If levels are too low or high, adjust your system microphone settings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>