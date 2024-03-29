<script setup lang="ts">
import { ApexOptions } from 'apexcharts'
const options: ApexOptions = {
  chart: {
    type: 'bar',
    height: 350,

  },
  colors: [
    '#2F99E7',
    '#22C55E',
    '#F25C1B',
    '#000000',
    '#3D39ED',
    '#818093',
    '#F2351B',
    '#686552',
  ],
  plotOptions: {
    bar: {
      borderRadius: 8,
      horizontal: true,
      distributed: true,
      barHeight: 15,
      borderRadiusApplication: 'end',
    }
  },
  dataLabels: {
    enabled: false,
    distributed: true
  },
  grid: {
    show: false,

  },
  xaxis: {
    categories: ['Recipients', 'Delivered', 'Failed', 'Open', 'Click', 'Bounce  ', 'Report',
      'Unsubscribe'
    ],
  }
};


const series: ApexOptions['series'] = [{
  data: [400, 430, 690, 470, 540, 580, 1100, 448,],
}]
</script>
<template>
  <apexchart width="100%" type="bar" :options="options" :series="series"></apexchart>
</template>
