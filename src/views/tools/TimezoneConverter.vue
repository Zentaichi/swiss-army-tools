<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

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
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Timezone Converter"
      description="Convert times between timezones" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content (Left) -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Source Time -->
          <ToolCard title="Source Time" :collapsible="false" full-width>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
                <input
                  v-model="sourceTime"
                  type="datetime-local"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                <select
                  v-model="sourceTimezone"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                >
                  <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                    {{ tz.label }}
                  </option>
                </select>
              </div>
            </div>

            <button
              @click="setNow"
              class="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Set to Now
            </button>
          </ToolCard>

          <!-- Converted Times -->
          <ToolCard title="Converted Times" :default-collapsed="false">
            <div v-if="convertedTimes.length === 0" class="text-center py-12 text-gray-400 text-sm">
              No favorite timezones selected.<br>Add some from the sidebar.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="converted in convertedTimes"
                :key="converted.timezone"
                class="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900 text-sm">{{ converted.label }}</div>
                    <div class="text-xl font-mono text-gray-900 mt-2">{{ converted.time }}</div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="copyToClipboard(converted.time)"
                      class="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-100 font-medium"
                    >
                      Copy
                    </button>
                    <button
                      @click="removeFromFavorites(converted.timezone)"
                      class="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ToolCard>

          <!-- World Clocks -->
          <ToolCard title="World Clocks (Current Time)" :default-collapsed="false">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="clock in worldClocks"
                :key="clock.timezone"
                class="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center hover:border-gray-200 transition-colors"
              >
                <div class="text-xs text-gray-500 mb-2 font-medium">{{ clock.label }}</div>
                <div class="text-lg font-mono font-bold text-gray-900">{{ clock.time }}</div>
              </div>
            </div>
          </ToolCard>
        </div>

        <!-- Sidebar (Right) -->
        <div class="xl:col-span-1">
          <ToolCard title="All Timezones" :default-collapsed="false">
            <div class="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              <button
                v-for="tz in timezones"
                :key="tz.value"
                @click="addToFavorites(tz.value)"
                :disabled="favorites.includes(tz.value)"
                class="w-full px-3 py-2.5 rounded-lg text-left transition-all bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-xs">{{ tz.label }}</div>
                    <div class="text-[10px] text-gray-500 mt-0.5">
                      UTC{{ tz.offset >= 0 ? '+' : '' }}{{ tz.offset }}
                    </div>
                  </div>
                  <span v-if="favorites.includes(tz.value)" class="text-yellow-500 text-sm">★</span>
                </div>
              </button>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>