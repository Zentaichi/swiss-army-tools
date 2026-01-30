<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'

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
  <div class="min-h-screen bg-white">
    <ToolHeader 
      title="Date Calculator" 
      description="Calculate dates and time differences" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Date Difference Calculator -->
        <div class="space-y-6">
          <div class="tool-container animate-fade-in">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Date Difference</h2>
            
            <!-- Start Date -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <div class="flex gap-2">
                <input
                  v-model="startDate"
                  type="date"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                />
                <button
                  @click="setToday('start')"
                  class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Today
                </button>
              </div>
            </div>

            <!-- End Date -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <div class="flex gap-2">
                <input
                  v-model="endDate"
                  type="date"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                />
                <button
                  @click="setToday('end')"
                  class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Today
                </button>
              </div>
            </div>

            <button
              @click="swapDates"
              class="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              ⇅ Swap Dates
            </button>

            <!-- Results -->
            <div v-if="dateDifference" class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Difference</h3>
              
              <!-- Exact Difference -->
              <div class="bg-gray-900 text-white p-4 rounded-xl mb-4">
                <div class="text-2xl font-bold">
                  {{ dateDifference.exact.years }} years, 
                  {{ dateDifference.exact.months }} months, 
                  {{ dateDifference.exact.days }} days
                </div>
              </div>

              <!-- Alternative Units -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-xl font-bold text-gray-900">{{ dateDifference.days.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Total Days</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-xl font-bold text-gray-900">{{ dateDifference.weeks.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Weeks</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-xl font-bold text-gray-900">{{ dateDifference.businessDays.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Business Days</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-xl font-bold text-gray-900">{{ dateDifference.hours.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Hours</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-xl font-bold text-gray-900">{{ dateDifference.minutes.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Minutes</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-xl font-bold text-gray-900">{{ dateDifference.seconds.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add/Subtract Calculator -->
        <div class="space-y-6">
          <div class="tool-container animate-fade-in" style="animation-delay: 0.05s">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Add / Subtract</h2>
            
            <!-- Base Date -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Base Date</label>
              <div class="flex gap-2">
                <input
                  v-model="baseDate"
                  type="date"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                />
                <button
                  @click="setToday('base')"
                  class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Today
                </button>
              </div>
            </div>

            <!-- Operation -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Operation</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="operation = 'add'"
                  :class="[
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    operation === 'add' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  ]"
                >
                  ➕ Add
                </button>
                <button
                  @click="operation = 'subtract'"
                  :class="[
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    operation === 'subtract' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  ]"
                >
                  ➖ Subtract
                </button>
              </div>
            </div>

            <!-- Time Units -->
            <div class="space-y-3 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Years</label>
                <input
                  v-model.number="years"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Months</label>
                <input
                  v-model.number="months"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Days</label>
                <input
                  v-model.number="days"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                />
              </div>
            </div>

            <!-- Quick Presets -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  @click="applyPreset('1week')"
                  class="px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  1 Week
                </button>
                <button
                  @click="applyPreset('1month')"
                  class="px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  1 Month
                </button>
                <button
                  @click="applyPreset('3months')"
                  class="px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  3 Months
                </button>
                <button
                  @click="applyPreset('6months')"
                  class="px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  6 Months
                </button>
                <button
                  @click="applyPreset('1year')"
                  class="px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  1 Year
                </button>
              </div>
            </div>

            <!-- Result -->
            <div v-if="resultDate" class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Result</h3>
              
              <div class="bg-gray-900 text-white p-4 rounded-xl mb-4">
                <div class="text-sm text-gray-400 mb-1">{{ operation === 'add' ? 'After adding' : 'After subtracting' }}</div>
                <div class="text-xl font-bold">{{ formatDateDisplay(resultDate) }}</div>
                <div class="text-sm text-gray-400 mt-2">{{ resultDate.toISOString().split('T')[0] }}</div>
              </div>

              <!-- Additional Info -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-lg font-bold text-gray-900">Day {{ dayOfYear }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Of Year</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div class="text-lg font-bold text-gray-900">Week {{ weekNumber }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wider">Of Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>