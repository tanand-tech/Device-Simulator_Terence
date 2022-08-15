<template>
    <div class="container">
        <div class="donut">
            <font-awesome-icon icon="fa-solid fa-circle-arrow-left fa-4x" size="2x" @click="buttonPrev()" style="cursor: pointer;"/>
            <pie-chart id="temperature-real-time-donut" :data = "dataTemperature" :title = "graphType" :colors="colorData" donut="true" legend="false" suffix="°C" width="250px" height="250px"></pie-chart>
            <font-awesome-icon icon="fa-solid fa-circle-arrow-right fa-4x" size="2x" @click="buttonNext()" style="cursor: pointer;"/>
        </div>
        <p class="real-time-data">{{word}}</p>
    </div>
</template>

<script>
import axios from 'axios';
import { socket_client } from "../services/socket.js";

let count = 1;

export default {
    name: 'Donut_pie_Temperature',
    data()
    {
        return {
            word: String,
            graphType: String,
            dataTemperature: {},
            colorData: [],
        }
    },
    mounted(){
        this.getData(1);
    },
    methods:{
        buttonPrev(){
            count--;
            if(count < 1 ){
                count = 3;
            }
            socket_client.removeAllListeners("singleData");
            this.getData(count);
        },
        buttonNext(){
            count++;
            if(count > 3){
                count = 1;
            }
            socket_client.removeAllListeners("singleData");
            this.getData(count);
        },
        async getData(count){
        
            let defaultTemp = 30;
            let currentDevice = count - 1;
            console.log(currentDevice);

            try {
                const res = await axios.get('http://localhost:3002/Data')
                const dataTemp = res.data.temperature;
                if(currentDevice == 0){
                    this.graphType = "Temperature - " + "dummy-temp-1"
                    this.colorData = ['blue', 'white'];
                    const Temp1 = dataTemp[currentDevice].pop();
                    console.log(Temp1);

                    let leftTemp = (defaultTemp - Temp1).toFixed(2);
                    let obj = {'current temperature': Temp1, 'rest of the temperature': leftTemp}
                    this.dataTemperature = obj;
                    this.word = Temp1 + " °C ";
                    this.getSingleData(currentDevice + 1);
                }
                if(currentDevice == 1){
                    this.graphType = "Temperature - " + "dummy-temp-2"
                    this.colorData = ['red', 'white'];
                    const Temp2 = dataTemp[currentDevice].pop();

                    const leftTemp = (defaultTemp - Temp2).toFixed(2);
                    const obj = {'current temperature': Temp2, 'rest of the temperature': leftTemp}
                    this.dataTemperature = obj;
                    this.word = Temp2 + " °C ";
                    this.getSingleData(currentDevice + 1);
                }
                if(currentDevice == 2){
                    this.graphType = "Temperature - " + "dummy-temp-3"
                    this.colorData = ['orange', 'white'];
                    const Temp3 = dataTemp[currentDevice].pop();

                    const leftTemp = (defaultTemp - Temp3).toFixed(2);
                    const obj = {'current temperature': Temp3, 'rest of the temperature': leftTemp}
                    this.dataTemperature = obj;
                    this.word = Temp3 + " °C ";
                    this.getSingleData(currentDevice + 1);
                }

            } catch (error) {
                console.log(error)
            }
        },
        getSingleData(deviceid){
            let defaultTemp = 30;
            socket_client.on('singleData_Temperature', (res) => {
                let device = "dummy-temp-" + deviceid
                if(device == res.deviceId){
                    console.log(res.deviceId);
                    const currentTemp = res.temperature; 
                    const leftTemp = (defaultTemp - res.temperature).toFixed(2);
                    const obj = {'current temperature': currentTemp, 'rest of the temperature': leftTemp}
                    this.dataTemperature = obj;
                    this.word = res.temperature.toString()  + " °C ";
                    console.log("able to recognize")
                    console.log(currentTemp);
                    console.log("the rest of pie in white color")
                    console.log(leftTemp);
                } 
            });
        },
    },
}
</script>

<style scoped>
    .container{
        height: max-content;
        width: max-content;
        margin: 0%;
        border: 2px solid black; 
        padding: 5px; 
    }

    .donut{
        width: 438px;
        height: 300px;
        display: flex; 
        justify-content: space-between; 
        align-items: center;
    }

    .real-time-data{
        margin-left: auto; 
        margin-right: auto;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 21px;
    }
</style>