<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'

const calculatorType = ref('compound')
const principal = ref(10000)
const rate = ref(5)
const time = ref(10)
const compoundFrequency = ref(12)

const frequencies = [
  { value: 1, label: 'Annually' },
  { value: 2, label: 'Semi-Annually' },
  { value: 4, label: 'Quarterly' },
  { value: 12, label: 'Monthly' },
  { value: 52, label: 'Weekly' },
  { value: 365, label: 'Daily' }
]

// Compound Interest: A = P(1 + r/n)^(nt)
const compoundInterest = computed(() => {
  const p = parseFloat(principal.value)
  const r = parseFloat(rate.value) / 100
  const t = parseFloat(time.value)
  const n = parseFloat(compoundFrequency.value)

  if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) return null

  const amount = p * Math.pow(1 + r / n, n * t)
  const interest = amount - p

  return {
    totalAmount: amount,
    totalInterest: interest,
    principal: p
  }
})

// Simple Interest: I = P × r × t
const simpleInterest = computed(() => {
  const p = parseFloat(principal.value)
  const r = parseFloat(rate.value) / 100
  const t = parseFloat(time.value)

  if (isNaN(p) || isNaN(r) || isNaN(t)) return null

  const interest = p * r * t
  const amount = p + interest

  return {
    totalAmount: amount,
    totalInterest: interest,
    principal: p
  }
})

const result = computed(() => {
  return calculatorType.value === 'compound' ? compoundInterest.value : simpleInterest.value
})

// Yearly breakdown
const yearlyBreakdown = computed(() => {
  if (!result.value) return []

  const breakdown = []
  const p = parseFloat(principal.value)
  const r = parseFloat(rate.value) / 100
  const years = Math.ceil(parseFloat(time.value))

  for (let year = 1; year <= years; year++) {
    let amount, interest
    
    if (calculatorType.value === 'compound') {
      const n = parseFloat(compoundFrequency.value)
      amount = p * Math.pow(1 + r / n, n * year)
      interest = amount - p
    } else {
      interest = p * r * year
      amount = p + interest
    }

    breakdown.push({
      year,
      amount,
      interest,
      yearlyInterest: year === 1 ? interest : interest - breakdown[year - 2].interest
    })
  }

  return breakdown
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <ToolHeader 
      title="Interest Calculator" 
      description="Calculate compound and simple interest" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Calculator Inputs -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Calculator Type -->
          <div class="tool-container animate-fade-in">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Calculator Type</h2>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="calculatorType = 'compound'"
                :class="[
                  'px-6 py-4 rounded-xl text-left transition-all duration-200',
                  calculatorType === 'compound'
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                ]"
              >
                <div class="font-semibold mb-1">Compound Interest</div>
                <div class="text-xs opacity-75">Interest on interest</div>
              </button>
              <button
                @click="calculatorType = 'simple'"
                :class="[
                  'px-6 py-4 rounded-xl text-left transition-all duration-200',
                  calculatorType === 'simple'
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                ]"
              >
                <div class="font-semibold mb-1">Simple Interest</div>
                <div class="text-xs opacity-75">Linear interest</div>
              </button>
            </div>
          </div>

          <!-- Input Fields -->
          <div class="tool-container stagger-item">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Parameters</h2>
            
            <div class="space-y-6">
              <!-- Principal -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Principal Amount ($)
                </label>
                <input
                  v-model.number="principal"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50 text-lg font-semibold"
                />
              </div>

              <!-- Interest Rate -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  v-model.number="rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50 text-lg font-semibold"
                />
              </div>

              <!-- Time Period -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Time Period (Years)
                </label>
                <input
                  v-model.number="time"
                  type="number"
                  min="0"
                  step="0.5"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50 text-lg font-semibold"
                />
              </div>

              <!-- Compound Frequency -->
              <div v-if="calculatorType === 'compound'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Compound Frequency
                </label>
                <select
                  v-model.number="compoundFrequency"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50"
                >
                  <option v-for="freq in frequencies" :key="freq.value" :value="freq.value">
                    {{ freq.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Yearly Breakdown -->
          <div class="tool-container stagger-item" style="animation-delay: 0.05s">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Yearly Breakdown</h2>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                    <th class="text-right py-3 px-2 font-semibold text-gray-700">Total Amount</th>
                    <th class="text-right py-3 px-2 font-semibold text-gray-700">Total Interest</th>
                    <th class="text-right py-3 px-2 font-semibold text-gray-700">Yearly Interest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in yearlyBreakdown"
                    :key="item.year"
                    class="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td class="py-3 px-2 font-medium">{{ item.year }}</td>
                    <td class="py-3 px-2 text-right font-mono">{{ formatCurrency(item.amount) }}</td>
                    <td class="py-3 px-2 text-right font-mono text-green-600">{{ formatCurrency(item.interest) }}</td>
                    <td class="py-3 px-2 text-right font-mono text-blue-600">{{ formatCurrency(item.yearlyInterest) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Results Sidebar -->
        <div class="space-y-8">
          <div v-if="result" class="tool-container animate-fade-in sticky top-8" style="animation-delay: 0.1s">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Results</h2>
            
            <!-- Total Amount -->
            <div class="bg-gray-900 text-white p-6 rounded-xl mb-4">
              <div class="text-sm text-gray-400 mb-2">Total Amount</div>
              <div class="text-3xl font-bold">{{ formatCurrency(result.totalAmount) }}</div>
            </div>

            <!-- Breakdown -->
            <div class="space-y-3">
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Principal</div>
                <div class="text-xl font-bold text-gray-900">{{ formatCurrency(result.principal) }}</div>
              </div>

              <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                <div class="text-xs text-green-700 uppercase tracking-wider mb-1">Total Interest Earned</div>
                <div class="text-xl font-bold text-green-700">{{ formatCurrency(result.totalInterest) }}</div>
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div class="text-xs text-blue-700 uppercase tracking-wider mb-1">Return on Investment</div>
                <div class="text-xl font-bold text-blue-700">
                  {{ ((result.totalInterest / result.principal) * 100).toFixed(2) }}%
                </div>
              </div>
            </div>

            <!-- Formula -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Formula</h3>
              <div class="bg-gray-50 p-3 rounded-lg font-mono text-xs text-gray-700 overflow-x-auto">
                <div v-if="calculatorType === 'compound'">
                  A = P(1 + r/n)^(nt)<br>
                  <span class="text-gray-500 text-[10px]">
                    P = Principal, r = Rate, n = Frequency, t = Time
                  </span>
                </div>
                <div v-else>
                  A = P(1 + rt)<br>
                  <span class="text-gray-500 text-[10px]">
                    P = Principal, r = Rate, t = Time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>