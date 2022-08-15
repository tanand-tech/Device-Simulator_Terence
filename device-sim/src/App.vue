<template>
  <div>

    <Title_item />

    <div style="display: flex;">
      <HumidityGraph style="flex-grow: 3; margin: 0px 10px;"/>
      <Donut_pie_Humidity style="flex-grow: 1; margin-top: auto; margin-bottom: auto;"/>
    </div>

    <div style="display: flex;">
      <TemperatureGraph style="flex-grow: 3; margin: 10px 10px 0px 10px;" />
      <Donut_pie_Temperature style="flex-grow: 1; margin-top: auto; margin-bottom: auto;"/>
    </div>

  </div>
</template>

<script>
import Title_item from './components/Header_Component.vue'
import HumidityGraph from './components/HumidityGraph.vue'
import TemperatureGraph from './components/TemperatureGraph.vue'
import Donut_pie_Humidity from './components/Donut_Humidity.vue'
import Donut_pie_Temperature from './components/Donut_Temperature.vue'

export default {
  name: 'App',
  components: {
    Title_item,
    HumidityGraph,
    TemperatureGraph,
    Donut_pie_Humidity,
    Donut_pie_Temperature
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
