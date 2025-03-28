<template>
  <AppPage show-footer>
    <div class="flex">
      <n-card class="min-w-200 w-30%">
        <n-time />
      </n-card>
      <n-card class="ml-12 w-70%">
        <n-user />
      </n-card>
    </div>
    <div class="mt-12 flex">
      <n-task />
    </div>
  </AppPage>
</template>

<script setup>
import * as echarts from 'echarts/core'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import nTime from './components/time.vue'
import nUser from './components/user.vue'
import nTask from './components/task.vue'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])
</script>
