<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = ref([
  {
    name: 'Gamepad Tester',
    description: 'Test gamepad buttons, analog sticks, and triggers',
    route: 'gamepad',
    icon: '🎮',
    category: 'Device Testers'
  },
  {
    name: 'Keyboard Tester',
    description: 'Test keyboard keys and key combinations',
    route: 'keyboard',
    icon: '⌨️',
    category: 'Device Testers'
  },
  {
    name: 'Microphone Tester',
    description: 'Test microphone input and audio levels',
    route: 'microphone',
    icon: '🎤',
    category: 'Device Testers'
  },
  {
    name: 'Interest Calculator',
    description: 'Calculate simple and compound interest',
    route: 'interest',
    icon: '💰',
    category: 'Calculators'
  },
  {
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    route: 'converter',
    icon: '📏',
    category: 'Calculators'
  },
  {
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, and HSL color formats',
    route: 'color',
    icon: '🎨',
    category: 'Utilities'
  },
  {
    name: 'Text Tools',
    description: 'Word counter, case converter, and more',
    route: 'text',
    icon: '📝',
    category: 'Utilities'
  },
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON',
    route: 'json',
    icon: '{ }',
    category: 'Utilities'
  },
  {
    name: 'Timezone Converter',
    description: 'Convert times between different timezones',
    route: 'timezone',
    icon: '🌍',
    category: 'Utilities'
  },
  {
    name: 'Date Calculator',
    description: 'Calculate days between dates',
    route: 'date',
    icon: '📅',
    category: 'Utilities'
  },
  {
    name: 'Regex Tester',
    description: 'Test regular expressions with live matching',
    route: 'regex',
    icon: '🔍',
    category: 'Utilities'
  }
])

const categories = ref(['All', 'Device Testers', 'Calculators', 'Utilities'])
const activeCategory = ref('All')

const filteredTools = ref(tools.value)

const filterByCategory = (category) => {
  activeCategory.value = category
  if (category === 'All') {
    filteredTools.value = tools.value
  } else {
    filteredTools.value = tools.value.filter(tool => tool.category === category)
  }
}

const navigateToTool = (route) => {
  router.push({ name: route })
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Minimalistic Header -->
    <header class="border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="animate-fade-in">
          <h1 class="text-4xl font-bold text-gray-900 tracking-tight">Swiss Army Tools</h1>
          <p class="mt-3 text-gray-500 text-lg">Minimalistic utilities for everyday tasks</p>
        </div>
      </div>
    </header>

    <!-- Sleek Category Filter -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-wrap gap-3 animate-scale-in">
        <button
          v-for="category in categories"
          :key="category"
          @click="filterByCategory(category)"
          :class="[
            'px-5 py-2.5 rounded-xl font-medium transition-all duration-200',
            activeCategory === category
              ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Clean Tools Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tool in filteredTools"
          :key="tool.route"
          @click="navigateToTool(tool.route)"
          class="tool-card group stagger-item"
        >
          <div class="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">{{ tool.icon }}</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2.5 group-hover:text-gray-600 transition-colors duration-200">
            {{ tool.name }}
          </h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ tool.description }}</p>
          <div class="mt-5 pt-4 border-t border-gray-100">
            <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {{ tool.category }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Empty state when filtered -->
      <div v-if="filteredTools.length === 0" class="text-center py-16 animate-fade-in">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
        <p class="text-gray-500">Try selecting a different category</p>
      </div>
    </main>
  </div>
</template>