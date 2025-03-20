<template>
  <div>
    <div class="flex items-center">
      <div class="mx-auto flex-col">
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
    const { holiday, days } = res
    if (days === 0) {
      holidayInfo.value = `今天是【${holiday}】假期,假期愉快~`
    }
    else if (days === 1) {
      holidayInfo.value = `加油！明天就是【${holiday}】了！`
    }
    else if (days === 2) {
      holidayInfo.value = `再坚持一下！后天就是【${holiday}】了！`
    }
    else {
      holidayInfo.value = `【${holiday}】假期倒计时：${days}天`
    }
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
