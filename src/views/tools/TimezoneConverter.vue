<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'

const sourceTime = ref(new Date().toISOString().slice(0, 16))
const sourceTimezone = ref('America/New_York')

// Common timezones
const timezones = [
  { value: 'Pacific/Honolulu', label: 'Hawaii (HST)', offset: -10 },
  { value: 'America/Anchorage', label: 'Alaska (AKST)', offset: -9 },
  { value: 'America/Los_Angeles', label: 'Pacific (PST)', offset: -8 },
  { value: 'America/Denver', label: 'Mountain (MST)', offset: -7 },
  { value: 'America/Chicago', label: 'Central (CST)', offset: -6 },
  { value: 'America/New_York', label: 'Eastern (EST)', offset: -5 },
  { value: 'America/Halifax', label: 'Atlantic (AST)', offset: -4 },
  { value: 'America/Sao_Paulo', label: 'São Paulo', offset: -3 },
  { value: 'Atlantic/Azores', label: 'Azores', offset: -1 },
  { value: 'UTC', label: 'UTC', offset: 0 },
  { value: 'Europe/London', label: 'London (GMT)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (CET)', offset: 1 },
  { value: 'Europe/Athens', label: 'Athens (EET)', offset: 2 },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: 3 },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
  { value: 'Asia/Karachi', label: 'Karachi (PKT)', offset: 5 },
  { value: 'Asia/Dhaka', label: 'Dhaka (BST)', offset: 6 },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', offset: 7 },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)', offset: 10 },
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT)', offset: 12 }
]

// Favorite timezones (user can select)
const favorites = ref(['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'])

const convertedTimes = computed(() => {
  const sourceDate = new Date(sourceTime.value)
  
  return favorites.value.map(tz => {
    const tzInfo = timezones.find(t => t.value === tz)
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    return {
      timezone: tz,
      label: tzInfo?.label || tz,
      time: formatter.format(sourceDate),
      offset: tzInfo?.offset || 0
    }
  })
})

const setNow = () => {
  sourceTime.value = new Date().toISOString().slice(0, 16)
}

const addToFavorites = (tz) => {
  if (!favorites.value.includes(tz)) {
    favorites.value.push(tz)
  }
}

const removeFromFavorites = (tz) => {
  favorites.value = favorites.value.filter(f => f !== tz)
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Get current time in different zones
const worldClocks = computed(() => {
  const now = new Date()
  const majorTimezones = [
    'America/New_York',
    'America/Chicago', 
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Dubai',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]
  
  return majorTimezones.map(tz => {
    const tzInfo = timezones.find(t => t.value === tz)
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    
    return {
      timezone: tz,
      label: tzInfo?.label || tz,
      time: formatter.format(now)
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <ToolHeader 
      title="Timezone Converter"
      description="Convert times between timezones" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Converter -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Source Time -->
          <div class="tool-container animate-fade-in">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Source Time</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                <input
                  v-model="sourceTime"
                  type="datetime-local"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  v-model="sourceTimezone"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                >
                  <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                    {{ tz.label }}
                  </option>
                </select>
              </div>
            </div>

            <button
              @click="setNow"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Set to Now
            </button>
          </div>

          <!-- Converted Times -->
          <div class="tool-container stagger-item">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Converted Times</h2>
            
            <div v-if="convertedTimes.length === 0" class="text-center py-8 text-gray-500">
              No favorite timezones selected. Add some from the sidebar.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="converted in convertedTimes"
                :key="converted.timezone"
                class="bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">{{ converted.label }}</div>
                    <div class="text-2xl font-mono text-gray-900 mt-2">{{ converted.time }}</div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="copyToClipboard(converted.time)"
                      class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Copy
                    </button>
                    <button
                      @click="removeFromFavorites(converted.timezone)"
                      class="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- World Clocks -->
          <div class="tool-container stagger-item" style="animation-delay: 0.05s">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">World Clocks (Current Time)</h2>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="clock in worldClocks"
                :key="clock.timezone"
                class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center"
              >
                <div class="text-sm text-gray-600 mb-2">{{ clock.label }}</div>
                <div class="text-xl font-mono font-bold text-gray-900">{{ clock.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: All Timezones -->
        <div class="space-y-8">
          <div class="tool-container animate-fade-in sticky top-8" style="animation-delay: 0.1s">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">All Timezones</h2>
            
            <div class="space-y-2 max-h-[600px] overflow-y-auto">
              <button
                v-for="tz in timezones"
                :key="tz.value"
                @click="addToFavorites(tz.value)"
                :disabled="favorites.includes(tz.value)"
                class="w-full px-4 py-3 rounded-xl text-left transition-all duration-200 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-sm">{{ tz.label }}</div>
                    <div class="text-xs text-gray-500 mt-1">
                      UTC{{ tz.offset >= 0 ? '+' : '' }}{{ tz.offset }}
                    </div>
                  </div>
                  <span v-if="favorites.includes(tz.value)" class="text-yellow-500">★</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>