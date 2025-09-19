<!--
GAMEPLAYJOYSTICK.VUE - COMPONENTE REFATORADO

=== ARQUITETURA ===
Componente modular organizado em seções:
- CONSTANTS: Valores fixos (MAX_KNOB_DISTANCE, MOBILE_BREAKPOINT)
- REFS: Estado mínimo (joystickBase, joystickKnob, isDragging, joystickPosition)
- UTILITY FUNCTIONS: Funções puras e testáveis
- STYLE MANAGEMENT: Gestão centralizada de estilos
- EVENT HANDLERS: Handlers específicos e nomeados claramente

=== REGRAS DE NEGÓCIO ===
1. VISIBILIDADE:
   - Só aparece em mobile (≤768px OU portrait) via CSS
   - Escondido no desktop

2. POSICIONAMENTO:
   - CSS padrão: centralizado horizontalmente
   - Desktop: bottom: 100px | Mobile: 120px | iOS: 160px
   - Teleporte: aparece onde clicou, respeitando viewport

3. INTERAÇÃO:
   - Teleporte instantâneo ao tocar
   - Knob limitado a 45px do centro
   - Dados normalizados (-1 a 1) enviados em tempo real
   - Reset automático ao soltar

4. RESPONSIVIDADE:
   - Raio dinâmico: 50px mobile, 60px desktop
   - Detecção unificada via isMobile()
   - Resize preserva funcionalidade

=== FUNÇÕES TESTÁVEIS ===
✅ PURAS (sem side effects):
- isMobile() - detecção de dispositivo
- getJoystickRadius() - raio baseado em dispositivo
- getPointerPosition() - extrai coordenadas de eventos
- constrainToViewport() - limita posição à tela
- calculateKnobPosition() - cálculos matemáticos do knob
- createJoystickData() - normaliza dados de saída

✅ GESTÃO DE ESTILOS:
- resetJoystickStyles() - limpa estilos inline
- setJoystickPosition() - posiciona joystick
- setKnobPosition() - posiciona knob

✅ EVENT HANDLERS:
- startDragging() - inicia interação
- updateKnobPosition() - atualiza posição durante movimento
- stopDragging() - finaliza interação
-->

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useInputStore } from '~/stores/input'

// === CONSTANTS ===
const MAX_KNOB_DISTANCE = 45
const MOBILE_BREAKPOINT = 768

// === REFS ===
const joystickBase = ref<HTMLElement>()
const joystickKnob = ref<HTMLElement>()
const isDragging = ref(false)
const joystickPosition = ref({ x: 0, y: 0 })

// === COMPOSABLES ===
const inputStore = useInputStore()

// === UTILITY FUNCTIONS ===
const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT || window.innerHeight > window.innerWidth

const getJoystickRadius = () => isMobile() ? 50 : 60

const getPointerPosition = (event: TouchEvent | MouseEvent) => {
  return event instanceof TouchEvent
    ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
    : { x: event.clientX, y: event.clientY }
}

const constrainToViewport = (x: number, y: number, radius: number) => {
  return {
    x: Math.max(radius, Math.min(window.innerWidth - radius, x)),
    y: Math.max(radius, Math.min(window.innerHeight - radius, y))
  }
}

const calculateKnobPosition = (clientX: number, clientY: number, centerX: number, centerY: number) => {
  const deltaX = clientX - centerX
  const deltaY = clientY - centerY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  if (distance <= MAX_KNOB_DISTANCE) {
    return { x: deltaX, y: deltaY, distance }
  }

  const angle = Math.atan2(deltaY, deltaX)
  return {
    x: Math.cos(angle) * MAX_KNOB_DISTANCE,
    y: Math.sin(angle) * MAX_KNOB_DISTANCE,
    distance: MAX_KNOB_DISTANCE
  }
}

const createJoystickData = (knobX: number, knobY: number, distance: number) => ({
  x: knobX / MAX_KNOB_DISTANCE,
  y: knobY / MAX_KNOB_DISTANCE,
  angle: Math.atan2(knobY, knobX) * (180 / Math.PI),
  distance: distance / MAX_KNOB_DISTANCE
})

// === STYLE MANAGEMENT ===
const resetJoystickStyles = () => {
  if (!joystickBase.value) return

  joystickBase.value.style.position = ''
  joystickBase.value.style.left = ''
  joystickBase.value.style.top = ''
  joystickBase.value.style.transform = ''
}

const setJoystickPosition = (x: number, y: number) => {
  if (!joystickBase.value) return

  const radius = getJoystickRadius()
  joystickBase.value.style.position = 'fixed'
  joystickBase.value.style.left = `${x - radius}px`
  joystickBase.value.style.top = `${y - radius}px`
  joystickBase.value.style.transform = 'none'
}

const setKnobPosition = (x: number, y: number) => {
  if (!joystickKnob.value) return

  joystickKnob.value.style.transform = x === 0 && y === 0
    ? 'translate(-50%, -50%)'
    : `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
}

const updateJoystickPosition = () => {
  if (!joystickBase.value) return

  // Aguarda mais tempo para CSS media queries serem aplicadas
  setTimeout(() => {
    if (!joystickBase.value) return
    const rect = joystickBase.value.getBoundingClientRect()
    joystickPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }, 100) // 100ms é suficiente para media queries
}

// === EVENT HANDLERS ===
const teleportJoystick = (clientX: number, clientY: number) => {
  const radius = getJoystickRadius()
  const position = constrainToViewport(clientX, clientY, radius)

  joystickPosition.value = position
  setJoystickPosition(position.x, position.y)
}

const startDragging = (event: TouchEvent | MouseEvent) => {
  if (isDragging.value) return

  const { x, y } = getPointerPosition(event)
  teleportJoystick(x, y)

  isDragging.value = true
  joystickBase.value?.classList.add('is-dragging')

  if (event instanceof TouchEvent) {
    event.preventDefault()
  }
}

const updateKnobPosition = (event: TouchEvent | MouseEvent) => {
  if (!isDragging.value || !joystickBase.value || !joystickKnob.value) return

  const { x: clientX, y: clientY } = getPointerPosition(event)
  const { x: centerX, y: centerY } = joystickPosition.value

  const { x: knobX, y: knobY, distance } = calculateKnobPosition(clientX, clientY, centerX, centerY)

  setKnobPosition(knobX, knobY)

  const joystickData = createJoystickData(knobX, knobY, distance)
  inputStore.updateJoystick(joystickData)
}

const stopDragging = () => {
  if (!isDragging.value) return

  isDragging.value = false
  joystickBase.value?.classList.remove('is-dragging')

  setKnobPosition(0, 0)
  resetJoystickStyles()
  updateJoystickPosition()

  const resetData = { x: 0, y: 0, angle: 0, distance: 0 }
  inputStore.updateJoystick(resetData)
}

const handleResize = () => {
  if (!isDragging.value) {
    resetJoystickStyles()

    // Força reflow para garantir que media queries sejam aplicadas
    if (joystickBase.value) {
      joystickBase.value.offsetHeight // força reflow
    }

    updateJoystickPosition()
  }
}

const initializeJoystick = () => {
  resetJoystickStyles()
  updateJoystickPosition()
}

// === EVENT LISTENERS ===
useEventListener(document, 'mousemove', updateKnobPosition)
useEventListener(document, 'mouseup', stopDragging)
useEventListener(document, 'touchmove', updateKnobPosition, { passive: false })
useEventListener(document, 'touchend', stopDragging)
useEventListener(window, 'resize', handleResize)

// === CLEANUP ===
onUnmounted(() => {
  joystickBase.value?.classList.remove('is-dragging')
  inputStore.updateJoystick({ x: 0, y: 0, angle: 0, distance: 0 })
})
</script>

<template>
  <div
    class="joystick-container"
    @mousedown="startDragging"
    @touchstart="startDragging"
    @vue:mounted="initializeJoystick"
  >
    <div ref="joystickBase" class="joystick-base">
      <div ref="joystickKnob" class="joystick-knob" />
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
  display: none;
}

@media (max-width: 768px), (orientation: portrait) {
  .joystick-container {
    display: block;
  }
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
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

.joystick-base:active {
  transform: translateX(-50%) scale(0.95);
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
  background: linear-gradient(
    45deg,
    color-mix(in srgb, var(--ui-primary) 30%,transparent),
    color-mix(in srgb, var(--ui-secondary) 30%, transparent)
  );
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.joystick-base.is-dragging::before {
  opacity: 1;
}

@media (max-width: 768px), (orientation: portrait) {
  .joystick-base {
    width: 100px;
    height: 100px;
    bottom: 120px;
  }

  .joystick-knob {
    width: 35px;
    height: 35px;
  }
}

/* Specific fix for iOS Safari */
@supports (-webkit-touch-callout: none) {
  .joystick-base {
    bottom: 140px;
  }

  @media (max-width: 768px), (orientation: portrait) {
    .joystick-base {
      bottom: 160px;
    }
  }
}
</style>
