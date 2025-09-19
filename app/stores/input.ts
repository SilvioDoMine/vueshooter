import { defineStore } from 'pinia'
import { useEventListener } from '@vueuse/core'

export interface InputState {
  mouse: {
    x: number
    y: number
    isDown: boolean
  }
  keyboard: {
    keys: Set<string>
  }
  joystick: {
    x: number
    y: number
    angle: number
    distance: number
    isActive: boolean
  }
}

export const useInputStore = defineStore('input', () => {
  const state = reactive<InputState>({
    mouse: {
      x: 0,
      y: 0,
      isDown: false,
    },
    keyboard: {
      keys: new Set<string>(),
    },
    joystick: {
      x: 0,
      y: 0,
      angle: 0,
      distance: 0,
      isActive: false,
    },
  })

  const updateJoystick = (data: { x: number; y: number; angle: number; distance: number }) => {
    state.joystick.x = data.x
    state.joystick.y = data.y
    state.joystick.angle = data.angle
    state.joystick.distance = data.distance
    state.joystick.isActive = data.distance > 0

    // Debug log
    if (data.distance > 0) {
      console.log('Joystick update:', { x: data.x, y: data.y, distance: data.distance, isActive: state.joystick.isActive })
    }
  }

  // Event listeners setup
  const setupEventListeners = () => {
    useEventListener('mousemove', (event) => {
      state.mouse.x = event.clientX
      state.mouse.y = event.clientY
    })

    useEventListener('mousedown', () => {
      state.mouse.isDown = true
    })

    useEventListener('mouseup', () => {
      state.mouse.isDown = false
    })

    useEventListener('keydown', (event) => {
      state.keyboard.keys.add(event.key)
    })

    useEventListener('keyup', (event) => {
      state.keyboard.keys.delete(event.key)
    })

    useEventListener('touchstart', () => {
      state.mouse.isDown = true
    })

    useEventListener('touchend', () => {
      state.mouse.isDown = false
    })
  }

  return {
    state,
    updateJoystick,
    setupEventListeners,
  }
})