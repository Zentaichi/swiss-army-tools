<script setup>
import { ref, computed, watch } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

const category = ref('length')
const fromValue = ref(1)
const fromUnit = ref('meter')
const toUnit = ref('foot')

const categories = {
  length: {
    name: 'Length',
    icon: '📏',
    units: {
      meter: { name: 'Meter', toBase: 1 },
      kilometer: { name: 'Kilometer', toBase: 1000 },
      centimeter: { name: 'Centimeter', toBase: 0.01 },
      millimeter: { name: 'Millimeter', toBase: 0.001 },
      mile: { name: 'Mile', toBase: 1609.34 },
      yard: { name: 'Yard', toBase: 0.9144 },
      foot: { name: 'Foot', toBase: 0.3048 },
      inch: { name: 'Inch', toBase: 0.0254 }
    }
  },
  weight: {
    name: 'Weight',
    icon: '⚖️',
    units: {
      kilogram: { name: 'Kilogram', toBase: 1 },
      gram: { name: 'Gram', toBase: 0.001 },
      milligram: { name: 'Milligram', toBase: 0.000001 },
      ton: { name: 'Metric Ton', toBase: 1000 },
      pound: { name: 'Pound', toBase: 0.453592 },
      ounce: { name: 'Ounce', toBase: 0.0283495 }
    }
  },
  temperature: {
    name: 'Temperature',
    icon: '🌡️',
    units: {
      celsius: { name: 'Celsius' },
      fahrenheit: { name: 'Fahrenheit' },
      kelvin: { name: 'Kelvin' }
    }
  },
  volume: {
    name: 'Volume',
    icon: '🧪',
    units: {
      liter: { name: 'Liter', toBase: 1 },
      milliliter: { name: 'Milliliter', toBase: 0.001 },
      gallon: { name: 'Gallon (US)', toBase: 3.78541 },
      quart: { name: 'Quart (US)', toBase: 0.946353 },
      pint: { name: 'Pint (US)', toBase: 0.473176 },
      cup: { name: 'Cup (US)', toBase: 0.236588 },
      fluid_ounce: { name: 'Fluid Ounce (US)', toBase: 0.0295735 },
      cubic_meter: { name: 'Cubic Meter', toBase: 1000 }
    }
  },
  area: {
    name: 'Area',
    icon: '📐',
    units: {
      square_meter: { name: 'Square Meter', toBase: 1 },
      square_kilometer: { name: 'Square Kilometer', toBase: 1000000 },
      square_centimeter: { name: 'Square Centimeter', toBase: 0.0001 },
      square_mile: { name: 'Square Mile', toBase: 2589988 },
      square_yard: { name: 'Square Yard', toBase: 0.836127 },
      square_foot: { name: 'Square Foot', toBase: 0.092903 },
      acre: { name: 'Acre', toBase: 4046.86 },
      hectare: { name: 'Hectare', toBase: 10000 }
    }
  },
  speed: {
    name: 'Speed',
    icon: '🚀',
    units: {
      meter_per_second: { name: 'Meter/Second', toBase: 1 },
      kilometer_per_hour: { name: 'Kilometer/Hour', toBase: 0.277778 },
      mile_per_hour: { name: 'Mile/Hour', toBase: 0.44704 },
      knot: { name: 'Knot', toBase: 0.514444 }
    }
  },
  time: {
    name: 'Time',
    icon: '⏱️',
    units: {
      second: { name: 'Second', toBase: 1 },
      minute: { name: 'Minute', toBase: 60 },
      hour: { name: 'Hour', toBase: 3600 },
      day: { name: 'Day', toBase: 86400 },
      week: { name: 'Week', toBase: 604800 },
      month: { name: 'Month (30 days)', toBase: 2592000 },
      year: { name: 'Year (365 days)', toBase: 31536000 }
    }
  }
}

const currentUnits = computed(() => {
  return categories[category.value].units
})

const convertedValue = computed(() => {
  const value = parseFloat(fromValue.value)
  if (isNaN(value)) return 0

  // Special handling for temperature
  if (category.value === 'temperature') {
    return convertTemperature(value, fromUnit.value, toUnit.value)
  }

  // For other units, convert to base then to target
  const fromUnitData = currentUnits.value[fromUnit.value]
  const toUnitData = currentUnits.value[toUnit.value]

  const baseValue = value * fromUnitData.toBase
  return baseValue / toUnitData.toBase
})

const convertTemperature = (value, from, to) => {
  // Convert to Celsius first
  let celsius
  switch (from) {
    case 'celsius':
      celsius = value
      break
    case 'fahrenheit':
      celsius = (value - 32) * 5/9
      break
    case 'kelvin':
      celsius = value - 273.15
      break
  }

  // Convert from Celsius to target
  switch (to) {
    case 'celsius':
      return celsius
    case 'fahrenheit':
      return celsius * 9/5 + 32
    case 'kelvin':
      return celsius + 273.15
  }
}

const swapUnits = () => {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
}

// When category changes, reset units to first two available
watch(category, () => {
  const units = Object.keys(currentUnits.value)
  fromUnit.value = units[0]
  toUnit.value = units[1] || units[0]
  fromValue.value = 1
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Unit Converter" 
      description="Convert between different units of measurement" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content (Left) -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Category Selection -->
          <ToolCard title="Category" :collapsible="false" full-width>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <button
                v-for="(cat, key) in categories"
                :key="key"
                @click="category = key"
                :class="[
                  'px-3 py-3 rounded-lg text-center transition-all flex flex-col items-center gap-2',
                  category === key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                ]"
              >
                <span class="text-xl">{{ cat.icon }}</span>
                <span class="font-medium text-[10px]">{{ cat.name }}</span>
              </button>
            </div>
          </ToolCard>

          <!-- Converter -->
          <ToolCard title="Convert" :collapsible="false" full-width>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- From -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">From</label>
                <input
                  v-model="fromValue"
                  type="number"
                  step="any"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-lg font-semibold mb-3"
                />
                <select
                  v-model="fromUnit"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                >
                  <option v-for="(unit, key) in currentUnits" :key="key" :value="key">
                    {{ unit.name }}
                  </option>
                </select>
              </div>

              <!-- To -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">To</label>
                <div class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-lg font-bold mb-3 text-gray-900">
                  {{ convertedValue.toFixed(6).replace(/\.?0+$/, '') }}
                </div>
                <select
                  v-model="toUnit"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white"
                >
                  <option v-for="(unit, key) in currentUnits" :key="key" :value="key">
                    {{ unit.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center mt-4">
              <button
                @click="swapUnits"
                class="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2"
                title="Swap units"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span class="text-sm font-medium">Swap</span>
              </button>
            </div>
          </ToolCard>

          <!-- Result Display -->
          <ToolCard title="Result" :collapsible="false" full-width>
            <div class="bg-gray-900 text-white p-6 rounded-lg">
              <div class="text-center">
                <div class="text-sm text-gray-400 mb-2">
                  {{ fromValue }} {{ currentUnits[fromUnit].name }} =
                </div>
                <div class="text-4xl font-bold">
                  {{ convertedValue.toFixed(6).replace(/\.?0+$/, '') }}
                </div>
                <div class="text-sm text-gray-400 mt-2">
                  {{ currentUnits[toUnit].name }}
                </div>
              </div>
            </div>
          </ToolCard>
        </div>

        <!-- Sidebar (Right) -->
        <div class="xl:col-span-1">
          <!-- Common Conversions -->
          <ToolCard :title="`Common ${categories[category].name} Conversions`" :default-collapsed="false">
            <div class="space-y-3">
              <div
                v-for="(unit, key) in Object.keys(currentUnits).slice(0, 6)"
                :key="key"
                class="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm"
              >
                <div class="text-gray-500 text-xs mb-1">
                  1 {{ currentUnits[fromUnit].name }} =
                </div>
                <div class="font-bold text-gray-900 text-base">
                  {{ 
                    category === 'temperature' 
                      ? convertTemperature(1, fromUnit, unit).toFixed(4).replace(/\.?0+$/, '') 
                      : ((currentUnits[fromUnit].toBase / currentUnits[unit].toBase)).toFixed(6).replace(/\.?0+$/, '')
                  }}
                </div>
                <div class="text-gray-600 text-xs mt-1">
                  {{ currentUnits[unit].name }}
                </div>
              </div>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>