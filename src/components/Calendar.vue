<script setup lang="ts">
import { computed, ref } from 'vue'
import { START_DATE, dayNo, isDstObserved, showCalendar, now as stateNow } from '~/state'
import { t } from '~/i18n'

const playingDate = computed(() => new Date(+START_DATE + dayNo.value * 86400000))
const currentMonth = ref(new Date(playingDate.value.getFullYear(), playingDate.value.getMonth(), 1))

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function monthIndex(date: Date) {
  return date.getFullYear() * 12 + date.getMonth()
}

const minMonthStart = computed(() => {
  const firstPlayableDate = new Date(+START_DATE + 86400000) // d=1
  return getMonthStart(firstPlayableDate)
})

const maxMonthStart = computed(() => getMonthStart(stateNow.value))

const currentMonthStart = computed(() => getMonthStart(currentMonth.value))

const canPrevMonth = computed(() => monthIndex(currentMonthStart.value) > monthIndex(minMonthStart.value))
const canNextMonth = computed(() => monthIndex(currentMonthStart.value) < monthIndex(maxMonthStart.value))

function clampMonthStart(date: Date) {
  const idx = monthIndex(date)
  const minIdx = monthIndex(minMonthStart.value)
  const maxIdx = monthIndex(maxMonthStart.value)
  if (idx < minIdx)
    return minMonthStart.value
  if (idx > maxIdx)
    return maxMonthStart.value
  return date
}

function calculateDayNo(date: Date): number {
  const adjustedDate = isDstObserved(date) ? new Date(+date + 3600000) : date
  return Math.floor((+adjustedDate - +START_DATE) / 86400000)
}

const todayDayNo = computed(() => calculateDayNo(stateNow.value))

const monthInfo = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay() // 0 = Sunday

  return {
    year,
    month,
    daysInMonth,
    startDayOfWeek,
    date: firstDay,
  }
})

const days = computed(() => {
  const { daysInMonth, startDayOfWeek } = monthInfo.value
  const grid: (number | null)[] = []

  for (let i = 0; i < startDayOfWeek; i++)
    grid.push(null)

  for (let i = 1; i <= daysInMonth; i++)
    grid.push(i)

  return grid
})

function dateToDayNo(day: number): number {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const date = new Date(year, month, day)
  return calculateDayNo(date)
}

function isPlayable(day: number): boolean {
  const tgtDayNo = dateToDayNo(day)

  if (tgtDayNo <= 0)
    return false

  if (tgtDayNo > todayDayNo.value)
    return false

  return true
}

function isToday(day: number | null): boolean {
  if (day === null)
    return false

  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const date = new Date(year, month, day)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
  )
}

function isCurrentDay(day: number | null): boolean {
  if (day === null)
    return false

  const tgtDayNo = dateToDayNo(day)
  return tgtDayNo === dayNo.value
}

function selectDay(day: number | null) {
  if (day === null)
    return
  if (!isPlayable(day))
    return

  const tgtDayNo = dateToDayNo(day)
  const url = new URL(window.location.href)
  url.searchParams.set('d', String(tgtDayNo))
  window.location.href = url.toString()
  showCalendar.value = false
}

function prevMonth() {
  if (!canPrevMonth.value)
    return
  currentMonth.value = clampMonthStart(new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1,
  ))
}

function nextMonth() {
  if (!canNextMonth.value)
    return
  currentMonth.value = clampMonthStart(new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1,
  ))
}

function prevYear() {
  if (!canPrevMonth.value)
    return
  currentMonth.value = clampMonthStart(new Date(
    currentMonth.value.getFullYear() - 1,
    currentMonth.value.getMonth(),
    1,
  ))
}

function nextYear() {
  if (!canNextMonth.value)
    return
  currentMonth.value = clampMonthStart(new Date(
    currentMonth.value.getFullYear() + 1,
    currentMonth.value.getMonth(),
    1,
  ))
}

const monthText = computed(() => {
  const year = monthInfo.value.year
  const month = monthInfo.value.month + 1
  return t('calendar-month-format', year, month)
})

const weekDays = computed(() => [
  t('calendar-weekday-sun'),
  t('calendar-weekday-mon'),
  t('calendar-weekday-tue'),
  t('calendar-weekday-wed'),
  t('calendar-weekday-thu'),
  t('calendar-weekday-fri'),
  t('calendar-weekday-sat'),
])
</script>

<template>
  <div p="x4 md:x6 y6" max-w-xs md:max-w-sm mx-auto flex="~ col center">
    <div grid="~ cols-[1fr_auto_1fr]" items-center w-full mb4 px2>
      <div flex="~ center" justify-start gap-1>
        <button v-if="canPrevMonth" icon-btn @click="prevYear">
          <div i-tabler-chevrons-left />
        </button>
        <button v-if="canPrevMonth" icon-btn @click="prevMonth">
          <div i-tabler-chevron-left />
        </button>
      </div>
      <div font-serif text-lg font-semibold whitespace-nowrap text-center>
        {{ monthText }}
      </div>
      <div flex="~ center" justify-end gap-1>
        <button v-if="canNextMonth" icon-btn @click="nextMonth">
          <div i-tabler-chevron-right />
        </button>
        <button v-if="canNextMonth" icon-btn @click="nextYear">
          <div i-tabler-chevrons-right />
        </button>
      </div>
    </div>

    <div grid="~ cols-7 gap-0.5" w-full mb2>
      <div
        v-for="wd of weekDays"
        :key="wd"
        text-center text-xs op60 h-7 flex="~ center"
      >
        {{ wd }}
      </div>
    </div>

    <div grid="~ cols-7 gap-0.5" w-full>
      <button
        v-for="(day, idx) of days"
        :key="`${monthInfo.month}-${idx}`"
        :disabled="day === null || (day !== null && !isPlayable(day))"
        h-9 md:h-10 rounded cursor-pointer transition-all text-sm md:text-base
        :class="{
          'bg-primary text-white dark:bg-primary-deep dark:text-white font-semibold hover:bg-base hover:border border-primary hover:text-primary-deep dark:hover:text-primary': isCurrentDay(day),
          'text-orange-600 dark:text-orange-400 font-semibold': isToday(day) && !isCurrentDay(day),
          'op50 cursor-not-allowed': day === null,
          'op40 cursor-not-allowed line-through': day !== null && !isPlayable(day),
          'hover:bg-base hover:border border-primary op60': day !== null && isPlayable(day) && !isCurrentDay(day),
        }"
        @click="selectDay(day)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>
