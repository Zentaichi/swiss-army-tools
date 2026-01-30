<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

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
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Interest Calculator" 
      description="Calculate compound and simple interest" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content (Left) -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Calculator Type -->
          <ToolCard title="Calculator Type" :collapsible="false" full-width>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="calculatorType = 'compound'"
                :class="[
                  'px-6 py-4 rounded-lg text-left transition-all',
                  calculatorType === 'compound'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                ]"
              >
                <div class="font-semibold mb-1">Compound Interest</div>
                <div class="text-xs opacity-75">Interest on interest</div>
              </button>
              <button
                @click="calculatorType = 'simple'"
                :class="[
                  'px-6 py-4 rounded-lg text-left transition-all',
                  calculatorType === 'simple'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                ]"
              >
                <div class="font-semibold mb-1">Simple Interest</div>
                <div class="text-xs opacity-75">Linear interest</div>
              </button>
            </div>
          </ToolCard>

          <!-- Input Fields -->
          <ToolCard title="Parameters" :collapsible="false" full-width>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Principal -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Principal Amount ($)
                </label>
                <input
                  v-model.number="principal"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-lg font-semibold"
                />
              </div>

              <!-- Interest Rate -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  v-model.number="rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-lg font-semibold"
                />
              </div>

              <!-- Time Period -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Time Period (Years)
                </label>
                <input
                  v-model.number="time"
                  type="number"
                  min="0"
                  step="0.5"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-lg font-semibold"
                />
              </div>

              <!-- Compound Frequency -->
              <div v-if="calculatorType === 'compound'">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Compound Frequency
                </label>
                <select
                  v-model.number="compoundFrequency"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                >
                  <option v-for="freq in frequencies" :key="freq.value" :value="freq.value">
                    {{ freq.label }}
                  </option>
                </select>
              </div>
            </div>
          </ToolCard>

          <!-- Yearly Breakdown -->
          <ToolCard title="Yearly Breakdown" :default-collapsed="false">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-2 font-semibold text-gray-700 text-xs uppercase">Year</th>
                    <th class="text-right py-3 px-2 font-semibold text-gray-700 text-xs uppercase">Total</th>
                    <th class="text-right py-3 px-2 font-semibold text-gray-700 text-xs uppercase">Interest</th>
                    <th class="text-right py-3 px-2 font-semibold text-gray-700 text-xs uppercase">Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in yearlyBreakdown"
                    :key="item.year"
                    class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td class="py-3 px-2 font-medium">{{ item.year }}</td>
                    <td class="py-3 px-2 text-right font-mono text-sm">{{ formatCurrency(item.amount) }}</td>
                    <td class="py-3 px-2 text-right font-mono text-sm text-green-600">{{ formatCurrency(item.interest) }}</td>
                    <td class="py-3 px-2 text-right font-mono text-sm text-blue-600">{{ formatCurrency(item.yearlyInterest) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ToolCard>
        </div>

        <!-- Sidebar (Right) -->
        <div class="xl:col-span-1 space-y-6">
          <ToolCard v-if="result" title="Results" :default-collapsed="false">
            <!-- Total Amount -->
            <div class="bg-gray-900 text-white p-6 rounded-lg mb-4">
              <div class="text-sm text-gray-400 mb-2">Total Amount</div>
              <div class="text-3xl font-bold">{{ formatCurrency(result.totalAmount) }}</div>
            </div>

            <!-- Breakdown -->
            <div class="space-y-3">
              <div class="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Principal</div>
                <div class="text-xl font-bold text-gray-900">{{ formatCurrency(result.principal) }}</div>
              </div>

              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="text-xs text-green-700 uppercase tracking-wider mb-1 font-semibold">Total Interest</div>
                <div class="text-xl font-bold text-green-700">{{ formatCurrency(result.totalInterest) }}</div>
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="text-xs text-blue-700 uppercase tracking-wider mb-1 font-semibold">ROI</div>
                <div class="text-xl font-bold text-blue-700">
                  {{ ((result.totalInterest / result.principal) * 100).toFixed(2) }}%
                </div>
              </div>
            </div>
          </ToolCard>

          <!-- Formula -->
          <ToolCard title="Formula" :default-collapsed="false">
            <div class="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-700">
              <div v-if="calculatorType === 'compound'">
                A = P(1 + r/n)^(nt)<br>
                <span class="text-gray-500 text-xs mt-2 block">
                  P = Principal, r = Rate<br>
                  n = Frequency, t = Time
                </span>
              </div>
              <div v-else>
                A = P(1 + rt)<br>
                <span class="text-gray-500 text-xs mt-2 block">
                  P = Principal<br>
                  r = Rate, t = Time
                </span>
              </div>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>