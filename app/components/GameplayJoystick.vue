<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useInputStore } from '~/stores/input'

const joystickContainer = ref<HTMLElement>()
const joystickBase = ref<HTMLElement>()
const joystickKnob = ref<HTMLElement>()
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const angle = ref(0)
const distance = ref(0)
const joystickPosition = ref({ x: 0, y: 0 })
const initialPosition = ref({ x: 0, y: 0 })

const inputStore = useInputStore()

const emit = defineEmits<{
  joystickMove: [{ x: number, y: number, angle: number, distance: number }]
}>()

const getPointerPosition = (event: TouchEvent | MouseEvent) => {
  if (event instanceof TouchEvent) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY }
  } else {
    return { x: event.clientX, y: event.clientY }
  }
}

const teleportJoystick = (clientX: number, clientY: number) => {
  if (!joystickBase.value) return

  const joystickRadius = 60
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const x = Math.max(joystickRadius, Math.min(viewportWidth - joystickRadius, clientX))
  const y = Math.max(joystickRadius, Math.min(viewportHeight - joystickRadius, clientY))

  joystickPosition.value = { x, y }

  joystickBase.value.style.left = `${x - joystickRadius}px`
  joystickBase.value.style.top = `${y - joystickRadius}px`
}

const handleScreenTouch = (event: TouchEvent | MouseEvent) => {
  if (isDragging.value) return

  const { x, y } = getPointerPosition(event)
  teleportJoystick(x, y)

  isDragging.value = true

  // Add dragging class for visual effect
  if (joystickBase.value) {
    joystickBase.value.classList.add('is-dragging')
  }

  if (event instanceof TouchEvent) {
    event.preventDefault()
  }
}

const handleMove = (event: TouchEvent | MouseEvent) => {
  if (!isDragging.value || !joystickBase.value || !joystickKnob.value) return

  const { x: clientX, y: clientY } = getPointerPosition(event)

  // Center of the joystick base
  const centerX = joystickPosition.value.x
  const centerY = joystickPosition.value.y

  // Calculate distance from center
  const deltaX = clientX - centerX
  const deltaY = clientY - centerY
  const maxDistance = 45 // Maximum distance knob can move from center

  const currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // If within bounds, knob follows finger exactly
  // If outside bounds, constrain to edge
  let knobX, knobY
  if (currentDistance <= maxDistance) {
    knobX = deltaX
    knobY = deltaY
  } else {
    const currentAngle = Math.atan2(deltaY, deltaX)
    knobX = Math.cos(currentAngle) * maxDistance
    knobY = Math.sin(currentAngle) * maxDistance
  }

  const limitedDistance = Math.min(currentDistance, maxDistance)
  const currentAngle = Math.atan2(knobY, knobX)

  position.value.x = knobX
  position.value.y = knobY
  angle.value = currentAngle * (180 / Math.PI)
  distance.value = limitedDistance / maxDistance

  // Apply transform relative to center (50%, 50%)
  joystickKnob.value.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`

  const joystickData = {
    x: knobX / maxDistance,
    y: knobY / maxDistance,
    angle: angle.value,
    distance: distance.value
  }

  inputStore.updateJoystick(joystickData)
  emit('joystickMove', joystickData)
}

const resetToInitialPosition = () => {
  if (!joystickBase.value || !joystickContainer.value) return

  joystickPosition.value = { ...initialPosition.value }

  joystickBase.value.style.left = `${initialPosition.value.x - 60}px`
  joystickBase.value.style.top = `${initialPosition.value.y - 60}px`
}

const handleEnd = () => {
  isDragging.value = false
  position.value = { x: 0, y: 0 }
  angle.value = 0
  distance.value = 0

  // Remove dragging class
  if (joystickBase.value) {
    joystickBase.value.classList.remove('is-dragging')
  }

  if (joystickKnob.value) {
    joystickKnob.value.style.transform = 'translate(-50%, -50%)'
  }

  resetToInitialPosition()

  const resetData = { x: 0, y: 0, angle: 0, distance: 0 }
  inputStore.updateJoystick(resetData)
  emit('joystickMove', resetData)
}

const initializeJoystick = () => {
  if (!joystickBase.value) return

  const centerX = window.innerWidth / 2
  const bottomY = window.innerHeight - 100

  initialPosition.value = { x: centerX, y: bottomY }
  joystickPosition.value = { x: centerX, y: bottomY }

  joystickBase.value.style.left = `${centerX - 60}px`
  joystickBase.value.style.top = `${bottomY - 60}px`
}

useEventListener(document, 'mousemove', handleMove)
useEventListener(document, 'mouseup', handleEnd)
useEventListener(document, 'touchmove', handleMove, { passive: false })
useEventListener(document, 'touchend', handleEnd)
useEventListener(window, 'resize', initializeJoystick)

onUnmounted(() => {
  // Reset joystick state when component unmounts
  if (joystickBase.value) {
    joystickBase.value.classList.remove('is-dragging')
  }
  inputStore.updateJoystick({ x: 0, y: 0, angle: 0, distance: 0 })
})
</script>

<template>
  <div
    ref="joystickContainer"
    class="joystick-container"
    @mousedown="handleScreenTouch"
    @touchstart="handleScreenTouch"
    @vue:mounted="initializeJoystick"
  >
    <div
      ref="joystickBase"
      class="joystick-base"
    >
      <div
        ref="joystickKnob"
        class="joystick-knob"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.joystick-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  pointer-events: all;
  opacity: 0.6;
}

.joystick-base {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: absolute;
  cursor: pointer;
  transition: all 0.2s ease;
}

.joystick-base:active {
  transform: scale(0.95);
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.joystick-knob {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border: 2px solid rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: all 0.1s ease;
}

.joystick-knob:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
}

.joystick-base::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(0, 150, 255, 0.3), rgba(255, 100, 200, 0.3));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.joystick-base.is-dragging::before {
  opacity: 1;
}

@media (max-width: 480px) {
  .joystick-container {
    bottom: 20px;
    left: 20px;
  }

  .joystick-base {
    width: 100px;
    height: 100px;
  }

  .joystick-knob {
    width: 35px;
    height: 35px;
  }
}
</style>
