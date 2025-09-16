import { useEventListener } from "@vueuse/core";

export type InputState = {
  mouse: {
    x: number;
    y: number;
    isDown: boolean;
  };
  keyboard: {
    keys: Set<string>;
  };
};

export const useInput = () => {
  const state = reactive<InputState>({
    mouse: {
      x: 0,
      y: 0,
      isDown: false,
    },
    keyboard: {
      keys: new Set<string>(),
    },
  });

  useEventListener("mousemove", (event) => {
    state.mouse.x = event.clientX;
    state.mouse.y = event.clientY;
  });

  useEventListener("mousedown", () => {
    state.mouse.isDown = true;
  });

  useEventListener("mouseup", () => {
    state.mouse.isDown = false;
  });

  useEventListener("keydown", (event) => {
    state.keyboard.keys.add(event.key);
  });

  useEventListener("keyup", (event) => {
    state.keyboard.keys.delete(event.key);
  });

  return {
    state,
  };
};
