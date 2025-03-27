<template>
  <button
    class="dom-button"
    :class="[
      `dom-button--${type}`,
      `dom-button--${size}`,
    ]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type ButtonType = 'primary' | 'success' | 'warning' | 'danger'
type ButtonSize = 'small' | 'medium' | 'large'

export default defineComponent({
  name: 'DomButton',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary',
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'medium',
    },
  },
  emits: ['click'],
  setup(_props: { type: ButtonType; size: ButtonSize }, { emit }) {
    const handleClick = (event: MouseEvent): void => {
      emit('click', event)
    }

    return {
      handleClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.dom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &--primary {
    background-color: #18a058;
    color: white;

    &:hover {
      background-color: #0c7a43;
    }
  }

  &--success {
    background-color: #18a058;
    color: white;

    &:hover {
      background-color: #0c7a43;
    }
  }

  &--warning {
    background-color: #f0a020;
    color: white;

    &:hover {
      background-color: #c88a0f;
    }
  }

  &--danger {
    background-color: #d03050;
    color: white;

    &:hover {
      background-color: #ab1f3f;
    }
  }

  &--small {
    padding: 4px 12px;
    font-size: 14px;
  }

  &--medium {
    padding: 6px 16px;
    font-size: 16px;
  }

  &--large {
    padding: 8px 20px;
    font-size: 18px;
  }
}
</style> 