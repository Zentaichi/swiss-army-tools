<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

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
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Microphone Tester"
      description="Test and visualize microphone input" 
    />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Not Supported Warning -->
      <ToolCard v-if="!isSupported" title="Not Supported" :collapsible="false">
        <div class="text-center py-8">
          <svg class="w-20 h-20 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Browser Not Supported</h3>
          <p class="text-gray-600 text-sm">{{ error }}</p>
        </div>
      </ToolCard>

      <!-- Main Interface -->
      <div v-else class="space-y-6">
        <!-- Device Selection -->
        <ToolCard title="Microphone Device" :collapsible="false">
          <select
            v-model="selectedDevice"
            @change="changeDevice"
            :disabled="isRecording"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Default Device</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
              {{ device.label || `Microphone ${device.deviceId.substring(0, 8)}` }}
            </option>
          </select>
        </ToolCard>

        <!-- Error Message -->
        <ToolCard v-if="error" title="Error" :collapsible="false">
          <div class="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-lg border border-red-100">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-sm font-medium">{{ error }}</p>
          </div>
        </ToolCard>

        <!-- Permission Request -->
        <ToolCard v-if="!hasPermission" title="Microphone Access Required" :collapsible="false">
          <div class="text-center py-8">
            <svg class="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Grant Microphone Access</h3>
            <p class="text-gray-600 mb-6 text-sm">Click the button below to allow microphone access</p>
            <button
              @click="requestPermission"
              class="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
            >
              Grant Access
            </button>
          </div>
        </ToolCard>

        <!-- Audio Visualizer -->
        <div v-if="hasPermission" class="space-y-6">
          <!-- Level Meter -->
          <ToolCard title="Audio Level" :collapsible="false">
            <template v-slot:title>
              <div class="flex items-center justify-between w-full">
                <h3 class="text-base font-semibold text-gray-900">Audio Level</h3>
                <div class="flex gap-2">
                  <button
                    v-if="isRecording"
                    @click="stop"
                    class="px-4 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-all font-medium"
                  >
                    Stop
                  </button>
                  <button
                    v-else
                    @click="requestPermission"
                    class="px-4 py-2 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-all font-medium"
                  >
                    Start
                  </button>
                </div>
              </div>
            </template>

            <!-- Circular Level Indicator -->
            <div class="flex items-center justify-center py-8">
              <div class="relative w-56 h-56">
                <!-- Background circle -->
                <svg class="w-56 h-56 transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    stroke="currentColor"
                    stroke-width="16"
                    fill="none"
                    class="text-gray-100"
                  />
                  <!-- Level circle -->
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    stroke="currentColor"
                    :stroke-width="16"
                    fill="none"
                    :class="[
                      audioLevel > 80 ? 'text-red-500' :
                      audioLevel > 60 ? 'text-yellow-500' :
                      'text-green-500'
                    ]"
                    :stroke-dasharray="603.19"
                    :stroke-dashoffset="603.19 - (603.19 * audioLevel / 100)"
                    class="transition-all duration-100"
                  />
                </svg>
                
                <!-- Center text -->
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <div class="text-4xl font-bold text-gray-900">{{ Math.round(audioLevel) }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">dB Level</div>
                </div>
              </div>
            </div>

            <!-- Bar Visualization -->
            <div class="mt-6">
              <div class="h-10 bg-gray-100 rounded-lg overflow-hidden relative">
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
              
              <div class="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>Quiet</span>
                <span>Normal</span>
                <span>Loud</span>
                <span>Too Loud</span>
              </div>
            </div>
          </ToolCard>

          <!-- Statistics -->
          <ToolCard title="Statistics" :collapsible="false">
            <template v-slot:title>
              <div class="flex items-center justify-between w-full">
                <h3 class="text-base font-semibold text-gray-900">Statistics</h3>
                <button
                  @click="resetPeak"
                  class="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
                >
                  Reset Peak
                </button>
              </div>
            </template>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div class="text-2xl font-bold text-gray-900">{{ Math.round(audioLevel) }} dB</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Current Level</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div class="text-2xl font-bold text-gray-900">{{ Math.round(peakLevel) }} dB</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Peak Level</div>
              </div>
            </div>
          </ToolCard>

          <!-- Instructions -->
          <ToolCard title="Instructions" :default-collapsed="true">
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <p><strong class="text-gray-900">Test your microphone:</strong> Speak into your microphone and watch the level indicator respond to your voice.</p>
              </div>
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p><strong class="text-gray-900">Monitor levels:</strong> The green zone is good, yellow is getting loud, and red indicates the audio is too loud.</p>
              </div>
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p><strong class="text-gray-900">Adjust settings:</strong> If levels are too low or high, adjust your system microphone settings.</p>
              </div>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>