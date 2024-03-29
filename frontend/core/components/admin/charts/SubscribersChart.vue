<script setup lang="ts">
import { ApexOptions } from 'apexcharts'
const options: ApexOptions = {
  chart: {
    type: 'bar',
    height: 350,

  },
  colors: [
    '#22C55E'
  ],
  plotOptions: {
    bar: {
      borderRadius: 8,
      horizontal: false,
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
    categories: ['July 2023', 'August 2023', 'Sept 2023', 'Oct 2023'
    ],
  }
};


const series: ApexOptions['series'] = [{
  data: [400, 430, 690, 470, 540],
}]
</script>
<template>
  <apexchart width="100%" type="bar" :options="options" :series="series"></apexchart>
</template>
