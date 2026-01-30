<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  }
})

const sizeClass = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}
</script>

<template>
  <svg :class="[sizeClass[size], 'text-gray-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <!-- Regex Icon -->
    <path v-if="name === 'regex'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    
    <!-- Date/Calendar Icon -->
    <path v-else-if="name === 'calendar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    
    <!-- Microphone Icon -->
    <path v-else-if="name === 'microphone'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    
    <!-- Color/Palette Icon -->
    <path v-else-if="name === 'palette'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    
    <!-- JSON/Code Icon -->
    <path v-else-if="name === 'code'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    
    <!-- Timezone/Globe Icon -->
    <path v-else-if="name === 'globe'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    
    <!-- Unit/Ruler Icon -->
    <path v-else-if="name === 'ruler'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    
    <!-- Interest/Calculator Icon -->
    <path v-else-if="name === 'calculator'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    
    <!-- Gamepad Icon -->
    <path v-else-if="name === 'gamepad'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    
    <!-- Keyboard Icon -->
    <path v-else-if="name === 'keyboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    
    <!-- Text/Document Icon -->
    <path v-else-if="name === 'document'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    
    <!-- Default Icon -->
    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
</template>
