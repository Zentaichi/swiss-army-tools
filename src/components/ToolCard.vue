<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  collapsible: {
    type: Boolean,
    default: true
  },
  defaultCollapsed: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const isCollapsed = ref(props.defaultCollapsed)

const toggleCollapse = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}

const cardClass = computed(() => {
  return props.fullWidth ? 'col-span-full' : ''
})
</script>

<template>
  <div :class="['bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-300', cardClass]">
    <div 
      class="px-6 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50 transition-colors"
      @click="toggleCollapse"
    >
      <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <button
          v-if="collapsible"
          class="text-gray-400 hover:text-gray-600 transition-all duration-200"
          :class="{ 'rotate-180': isCollapsed }"
          @click.stop="toggleCollapse"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="!isCollapsed" class="px-6 py-5">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
