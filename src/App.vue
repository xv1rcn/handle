<script setup lang="ts">
import '~/init'
import { answer, dayNo, daySince } from '~/state'
import { colorblind } from '~/storage'

const { height } = useWindowSize()

watchEffect(() => {
  document.documentElement.style.setProperty('--vh', `${height.value / 100}px`)
})
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-300" select-none :class="{ colorblind }">
    <NotTodayBanner v-if="dayNo > 0 && dayNo < daySince" />
    <Navbar />
    <div p="4">
      <NoPastPlay v-if="dayNo <= 0" />
      <NoQuizToday v-else-if="!answer.word" />
      <NoFuturePlay v-else-if="dayNo > daySince" />
      <Play v-else />
    </div>
    <ModalsLayer />
    <Confetti />
  </main>
</template>
