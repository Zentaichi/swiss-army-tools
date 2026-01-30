<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ToolIcon from '@/components/ToolIcon.vue'

const router = useRouter()

const tools = ref([
  {
    name: 'Gamepad Tester',
    description: 'Test gamepad buttons, analog sticks, and triggers',
    route: 'gamepad',
    icon: 'gamepad',
    category: 'Device Testers'
  },
  {
    name: 'Keyboard Tester',
    description: 'Test keyboard keys and key combinations',
    route: 'keyboard',
    icon: 'keyboard',
    category: 'Device Testers'
  },
  {
    name: 'Microphone Tester',
    description: 'Test microphone input and audio levels',
    route: 'microphone',
    icon: 'microphone',
    category: 'Device Testers'
  },
  {
    name: 'Interest Calculator',
    description: 'Calculate simple and compound interest',
    route: 'interest',
    icon: 'calculator',
    category: 'Calculators'
  },
  {
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    route: 'converter',
    icon: 'ruler',
    category: 'Calculators'
  },
  {
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, and HSL color formats',
    route: 'color',
    icon: 'palette',
    category: 'Utilities'
  },
  {
    name: 'Text Tools',
    description: 'Word counter, case converter, and more',
    route: 'text',
    icon: 'document',
    category: 'Utilities'
  },
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON',
    route: 'json',
    icon: 'code',
    category: 'Utilities'
  },
  {
    name: 'Timezone Converter',
    description: 'Convert times between different timezones',
    route: 'timezone',
    icon: 'globe',
    category: 'Utilities'
  },
  {
    name: 'Date Calculator',
    description: 'Calculate days between dates',
    route: 'date',
    icon: 'calendar',
    category: 'Utilities'
  },
  {
    name: 'Regex Tester',
    description: 'Test regular expressions with live matching',
    route: 'regex',
    icon: 'regex',
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
  <div class="min-h-screen bg-gray-50">
    <!-- Minimalistic Header -->
    <header class="bg-white border-b border-gray-200">
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
              : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
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
          class="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 group stagger-item"
        >
          <div class="mb-4 text-gray-600 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110">
            <ToolIcon :name="tool.icon" size="xl" />
          </div>
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
        <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
        <p class="text-gray-500">Try selecting a different category</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-500">
            Built with <span class="text-gray-700">Vue</span> & <span class="text-gray-700">Tailwind CSS</span>
          </p>
          <div class="flex items-center gap-6">
            <a href="https://github.com/Zentaichi" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
            <!-- <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a> -->
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>