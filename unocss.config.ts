import type { Theme } from '@unocss/preset-mini'
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'btn': 'px-4 py-1 rounded-[var(--radius-md)] inline-block bg-primary text-white cursor-pointer tracking-wide op90 hover:op100 disabled:cursor-default disabled:bg-[var(--c-bg-disabled)] disabled:!op50 disabled:pointer-events-none transition-opacity transition-colors duration-[var(--duration-fast)] ease-[var(--ease-in-out)]',
      'icon-btn': 'text-1.2em cursor-pointer select-none opacity-75 transition-opacity transition-colors duration-[var(--duration-fast)] ease-[var(--ease-in-out)] hover:opacity-100 hover:text-primary disabled:pointer-events-none',
      'square-btn': 'flex flex-gap-2 items-center border border-base px2 py1 relative !outline-none',
      'square-btn-mark': 'absolute h-2 w-2 bg-primary -right-0.2rem -top-0.2rem',

      'bg-base': 'bg-[var(--c-bg-base)] dark:bg-[var(--c-bg-base-dark)]',
      'bg-overlay': 'bg-[var(--c-bg-overlay)] dark:bg-[var(--c-bg-overlay-dark)]',
      'bg-header': 'bg-[var(--c-bg-header)]',
      'bg-active': 'bg-[var(--c-bg-active)]',
      'bg-hover': 'bg-[var(--c-bg-hover)]',
      'border-base': 'border-[var(--c-border-base)]',

      'tab-button': 'font-light op50 hover:op80 h-full px-4',
      'tab-button-active': 'op100 bg-active',
    },
    [/^(flex|grid)-center/g, () => 'justify-center items-center'],
    [/^(flex|grid)-x-center/g, () => 'justify-center'],
    [/^(flex|grid)-y-center/g, () => 'items-center'],
  ],
  rules: [
    ['max-h-screen', { 'max-height': 'calc(var(--vh, 1vh) * 100)' }],
    ['h-screen', { height: 'calc(var(--vh, 1vh) * 100)' }],
  ],
  theme: <Theme>{
    colors: {
      'ok': 'var(--c-ok)',
      'primary': 'var(--c-primary)',
      'primary-deep': 'var(--c-primary-deep)',
      'mis': 'var(--c-mis)',
    },
    fontFamily: {
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
      mono: 'var(--font-mono)',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
  ],
})
