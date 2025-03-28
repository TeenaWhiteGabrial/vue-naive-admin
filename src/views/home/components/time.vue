<template>
  <div>
    <div class="flex items-center">
      <div class="mx-auto flex-col">
        <div class="clock-container">
          <span class="clock-hour">{{ currentTime.hours }}</span>
          <span class="clock-separator">:</span>
          <span class="clock-minute">{{ currentTime.minutes }}</span>
          <span class="clock-separator">:</span>
          <span class="clock-second">{{ currentTime.seconds }}</span>
        </div>
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
  hours: '', // 小时
  minutes: '', // 分钟
  seconds: '', // 秒
  week: '', // 星期
  date: '', // 公历日期
  chineseCalendarDate: '', // 农历日期
})

const { getDate, getWeek, getLunarDate, getNextHoliday } = useTime()

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
  const now = new Date()
  currentTime.hours = String(now.getHours()).padStart(2, '0')
  currentTime.minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.week = getWeek()
  currentTime.date = getDate()
  currentTime.chineseCalendarDate = getLunarDate()
}

onMounted(() => {
  setInterval(updateCurrentTime, 1000)
})
</script>

<style lang="css" scoped>
  .clock-container {
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  .clock-hour,
  .clock-minute,
  .clock-second {
    font-family: "Bungee Spice", monospace;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(45deg, #4a69bd, #96c93d);
    font-size: 3em;
    width: 70px;
    /* 固定宽度 */
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .clock-separator {
    font-family: "Bungee Spice", monospace;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(45deg, #4a69bd, #96c93d);
    font-size: 3em;
    padding: 0 5px;
  }
</style>
