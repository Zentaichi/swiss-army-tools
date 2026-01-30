<script setup>
import { ref, computed, watch } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

const hexInput = ref('#3B82F6')
const rgbR = ref(59)
const rgbG = ref(130)
const rgbB = ref(246)
const hslH = ref(217)
const hslS = ref(91)
const hslL = ref(60)

const isUpdating = ref(false)

// Convert RGB to Hex
const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

// Convert Hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Convert RGB to HSL
const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// Convert HSL to RGB
const hslToRgb = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

// Update all formats from hex
const updateFromHex = () => {
  if (isUpdating.value) return
  isUpdating.value = true

  const rgb = hexToRgb(hexInput.value)
  if (rgb) {
    rgbR.value = rgb.r
    rgbG.value = rgb.g
    rgbB.value = rgb.b

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    hslH.value = hsl.h
    hslS.value = hsl.s
    hslL.value = hsl.l
  }

  isUpdating.value = false
}

// Update all formats from RGB
const updateFromRgb = () => {
  if (isUpdating.value) return
  isUpdating.value = true

  hexInput.value = rgbToHex(rgbR.value, rgbG.value, rgbB.value)

  const hsl = rgbToHsl(rgbR.value, rgbG.value, rgbB.value)
  hslH.value = hsl.h
  hslS.value = hsl.s
  hslL.value = hsl.l

  isUpdating.value = false
}

// Update all formats from HSL
const updateFromHsl = () => {
  if (isUpdating.value) return
  isUpdating.value = true

  const rgb = hslToRgb(hslH.value, hslS.value, hslL.value)
  rgbR.value = rgb.r
  rgbG.value = rgb.g
  rgbB.value = rgb.b

  hexInput.value = rgbToHex(rgb.r, rgb.g, rgb.b)

  isUpdating.value = false
}

const currentColor = computed(() => hexInput.value)

const cssFormats = computed(() => ({
  hex: hexInput.value.toUpperCase(),
  rgb: `rgb(${rgbR.value}, ${rgbG.value}, ${rgbB.value})`,
  rgba: `rgba(${rgbR.value}, ${rgbG.value}, ${rgbB.value}, 1)`,
  hsl: `hsl(${hslH.value}, ${hslS.value}%, ${hslL.value}%)`,
  hsla: `hsla(${hslH.value}, ${hslS.value}%, ${hslL.value}%, 1)`
}))

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Color presets
const presetColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894',
  '#2D3436', '#636E72', '#B2BEC3', '#DFE6E9', '#FFFFFF'
]

const loadPreset = (color) => {
  hexInput.value = color
  updateFromHex()
}

watch(hexInput, updateFromHex)
watch([rgbR, rgbG, rgbB], updateFromRgb)
watch([hslH, hslS, hslL], updateFromHsl)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Color Converter"
      description="Convert between HEX, RGB, and HSL color formats" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content (Left) -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Color Preview -->
          <ToolCard title="Color Preview" :collapsible="false" full-width>
            <div 
              class="w-full h-64 rounded-lg border-2 border-gray-200 shadow-sm transition-colors duration-200"
              :style="{ backgroundColor: currentColor }"
            ></div>
          </ToolCard>

          <!-- Color Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- HEX Input -->
            <ToolCard title="HEX" :collapsible="false">
              <div class="space-y-3">
                <input
                  v-model="hexInput"
                  type="text"
                  placeholder="#000000"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white font-mono text-base"
                />
                <button
                  @click="copyToClipboard(hexInput)"
                  class="w-full px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Copy
                </button>
              </div>
            </ToolCard>

            <!-- RGB Input -->
            <ToolCard title="RGB" :collapsible="false">
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Red</label>
                  <input
                    v-model.number="rgbR"
                    type="number"
                    min="0"
                    max="255"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Green</label>
                  <input
                    v-model.number="rgbG"
                    type="number"
                    min="0"
                    max="255"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Blue</label>
                  <input
                    v-model.number="rgbB"
                    type="number"
                    min="0"
                    max="255"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-sm"
                  />
                </div>
              </div>
            </ToolCard>

            <!-- HSL Input -->
            <ToolCard title="HSL" :collapsible="false">
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Hue (0-360)</label>
                  <input
                    v-model.number="hslH"
                    type="number"
                    min="0"
                    max="360"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Saturation (0-100)</label>
                  <input
                    v-model.number="hslS"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Lightness (0-100)</label>
                  <input
                    v-model.number="hslL"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white text-sm"
                  />
                </div>
              </div>
            </ToolCard>
          </div>
        </div>

        <!-- Sidebar (Right) -->
        <div class="xl:col-span-1 space-y-6">
          <!-- CSS Formats -->
          <ToolCard title="CSS Formats" :default-collapsed="false">
            <div class="space-y-3">
              <div
                v-for="(value, format) in cssFormats"
                :key="format"
                class="bg-gray-50 border border-gray-100 rounded-lg p-3 group hover:border-gray-200 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ format }}</span>
                  <button
                    @click="copyToClipboard(value)"
                    class="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-100 font-medium"
                  >
                    Copy
                  </button>
                </div>
                <div class="font-mono text-sm text-gray-900 break-all">{{ value }}</div>
              </div>
            </div>
          </ToolCard>

          <!-- Color Presets -->
          <ToolCard title="Color Presets" :default-collapsed="false">
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="color in presetColors"
                :key="color"
                @click="loadPreset(color)"
                class="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-gray-900 transition-all hover:scale-110"
                :style="{ backgroundColor: color }"
                :title="color"
              ></button>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>