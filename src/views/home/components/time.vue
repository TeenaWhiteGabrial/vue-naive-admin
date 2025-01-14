<template>
  <div>
    <div class="flex items-center">
      <div class="ml-20 flex-col">
        <span class="clock-class text-14 opacity-80">
          {{ currentTime.time }}
        </span>
        <span class="text-16 font-bold opacity-80">
          {{ currentTime.date }}-{{ currentTime.week }}
        </span>
        <span class="mt-2 text-14 opacity-80">
          {{ currentTime.chineseCalendarDate }}
        </span>

        <span class="mt-2 text-14 opacity-80">
          {{ holidayInfo }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTime } from '@/composables'

const currentTime = reactive({
  week: '', // 星期
  time: '', // 具体时间
  date: '', // 公历日期
  chineseCalendarDate: '', // 农历日期
})

const { getCurrentTime, getDate, getWeek, getLunarDate, getNextHoliday } = useTime()

const holidayInfo = ref('只想好好的摆烂~~~')
getNextHoliday()
  .then((res) => {
    holidayInfo.value = res
  })

function updateCurrentTime() {
  currentTime.week = getWeek()
  currentTime.time = getCurrentTime()
  currentTime.date = getDate()
  currentTime.chineseCalendarDate = getLunarDate()
}

onMounted(() => {
  setInterval(updateCurrentTime, 1000)
})
</script>

<style lang="css" scoped>
  .clock-class {
    font-family: "Bungee Spice", sans-serif;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(45deg, #4a69bd, #96c93d);
    font-size: 3em;
  }
</style>
