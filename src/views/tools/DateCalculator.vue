<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

const currentDate = new Date()

// Date Difference Calculator
const startDate = ref(formatDateForInput(currentDate))
const endDate = ref(formatDateForInput(new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)))

// Add/Subtract Calculator
const baseDate = ref(formatDateForInput(currentDate))
const operation = ref('add')
const years = ref(0)
const months = ref(0)
const days = ref(7)

function formatDateForInput(date) {
  return date.toISOString().split('T')[0]
}

function formatDateDisplay(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Calculate difference between two dates
const dateDifference = computed(() => {
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return null
  }

  const diffTime = Math.abs(end - start)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30.44) // Average days in month
  const diffYears = Math.floor(diffDays / 365.25) // Account for leap years

  // Calculate exact years, months, days
  let yearDiff = end.getFullYear() - start.getFullYear()
  let monthDiff = end.getMonth() - start.getMonth()
  let dayDiff = end.getDate() - start.getDate()

  if (dayDiff < 0) {
    monthDiff--
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    dayDiff += prevMonth.getDate()
  }

  if (monthDiff < 0) {
    yearDiff--
    monthDiff += 12
  }

  const totalHours = Math.floor(diffTime / (1000 * 60 * 60))
  const totalMinutes = Math.floor(diffTime / (1000 * 60))
  const totalSeconds = Math.floor(diffTime / 1000)

  return {
    days: diffDays,
    weeks: diffWeeks,
    months: diffMonths,
    years: diffYears,
    exact: { years: yearDiff, months: monthDiff, days: dayDiff },
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
    businessDays: calculateBusinessDays(start, end)
  }
})

// Calculate business days (excluding weekends)
function calculateBusinessDays(startDate, endDate) {
  let count = 0
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  
  return count
}

// Calculate result date from add/subtract
const resultDate = computed(() => {
  const base = new Date(baseDate.value)
  
  if (isNaN(base.getTime())) {
    return null
  }

  const result = new Date(base)
  const multiplier = operation.value === 'add' ? 1 : -1

  result.setFullYear(result.getFullYear() + (years.value * multiplier))
  result.setMonth(result.getMonth() + (months.value * multiplier))
  result.setDate(result.getDate() + (days.value * multiplier))

  return result
})

// Day of the year calculator
const dayOfYear = computed(() => {
  if (!resultDate.value) return null
  
  const start = new Date(resultDate.value.getFullYear(), 0, 0)
  const diff = resultDate.value - start
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
})

// Week number calculator
const weekNumber = computed(() => {
  if (!resultDate.value) return null
  
  const date = new Date(resultDate.value)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 4 - (date.getDay() || 7))
  const yearStart = new Date(date.getFullYear(), 0, 1)
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
})

const setToday = (target) => {
  const today = formatDateForInput(new Date())
  if (target === 'start') startDate.value = today
  else if (target === 'end') endDate.value = today
  else baseDate.value = today
}

const swapDates = () => {
  const temp = startDate.value
  startDate.value = endDate.value
  endDate.value = temp
}

// Quick presets for add/subtract
const applyPreset = (preset) => {
  years.value = 0
  months.value = 0
  days.value = 0
  
  switch(preset) {
    case '1week':
      days.value = 7
      break
    case '1month':
      months.value = 1
      break
    case '3months':
      months.value = 3
      break
    case '6months':
      months.value = 6
      break
    case '1year':
      years.value = 1
      break
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Date Calculator" 
      description="Calculate dates and time differences" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Date Difference Calculator -->
        <div class="space-y-6">
          <ToolCard title="Date Difference" :collapsible="false">
            <!-- Start Date -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <div class="flex gap-2">
                <input
                  v-model="startDate"
                  type="date"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
                <button
                  @click="setToday('start')"
                  class="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium whitespace-nowrap"
                >
                  Today
                </button>
              </div>
            </div>

            <!-- End Date -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <div class="flex gap-2">
                <input
                  v-model="endDate"
                  type="date"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
                <button
                  @click="setToday('end')"
                  class="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium whitespace-nowrap"
                >
                  Today
                </button>
              </div>
            </div>

            <button
              @click="swapDates"
              class="w-full px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Swap Dates
            </button>
          </ToolCard>

          <!-- Results -->
          <ToolCard v-if="dateDifference" title="Difference" :default-collapsed="false">
            <!-- Exact Difference -->
            <div class="bg-gray-900 text-white p-4 rounded-lg mb-4">
              <div class="text-xl font-bold">
                {{ dateDifference.exact.years }} years, 
                {{ dateDifference.exact.months }} months, 
                {{ dateDifference.exact.days }} days
              </div>
            </div>

            <!-- Alternative Units -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">{{ dateDifference.days.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Days</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">{{ dateDifference.weeks.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Weeks</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">{{ dateDifference.businessDays.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Business Days</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">{{ dateDifference.hours.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Hours</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">{{ dateDifference.minutes.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Minutes</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">{{ dateDifference.seconds.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Seconds</div>
              </div>
            </div>
          </ToolCard>
        </div>

        <!-- Add/Subtract Calculator -->
        <div class="space-y-6">
          <ToolCard title="Add / Subtract" :collapsible="false">
            <!-- Base Date -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Base Date</label>
              <div class="flex gap-2">
                <input
                  v-model="baseDate"
                  type="date"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
                <button
                  @click="setToday('base')"
                  class="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium whitespace-nowrap"
                >
                  Today
                </button>
              </div>
            </div>

            <!-- Operation -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Operation</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="operation = 'add'"
                  :class="[
                    'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    operation === 'add' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  ]"
                >
                  <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
                <button
                  @click="operation = 'subtract'"
                  :class="[
                    'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    operation === 'subtract' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  ]"
                >
                  <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                  Subtract
                </button>
              </div>
            </div>

            <!-- Time Units -->
            <div class="space-y-3 mb-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Years</label>
                <input
                  v-model.number="years"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Months</label>
                <input
                  v-model.number="months"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Days</label>
                <input
                  v-model.number="days"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                />
              </div>
            </div>

            <!-- Quick Presets -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Quick Presets</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  @click="applyPreset('1week')"
                  class="px-3 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  1 Week
                </button>
                <button
                  @click="applyPreset('1month')"
                  class="px-3 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  1 Month
                </button>
                <button
                  @click="applyPreset('3months')"
                  class="px-3 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  3 Months
                </button>
                <button
                  @click="applyPreset('6months')"
                  class="px-3 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  6 Months
                </button>
                <button
                  @click="applyPreset('1year')"
                  class="px-3 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  1 Year
                </button>
              </div>
            </div>
          </ToolCard>

          <!-- Result -->
          <ToolCard v-if="resultDate" title="Result" :default-collapsed="false">
            <div class="bg-gray-900 text-white p-4 rounded-lg mb-4">
              <div class="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">
                {{ operation === 'add' ? 'After adding' : 'After subtracting' }}
              </div>
              <div class="text-lg font-bold">{{ formatDateDisplay(resultDate) }}</div>
              <div class="text-sm text-gray-400 mt-2 font-mono">{{ resultDate.toISOString().split('T')[0] }}</div>
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">Day {{ dayOfYear }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Of Year</div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="text-lg font-bold text-gray-900">Week {{ weekNumber }}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Of Year</div>
              </div>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>