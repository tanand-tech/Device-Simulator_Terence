<template>
    <div class="container">
        <div class="donut">
            <font-awesome-icon icon="fa-solid fa-circle-arrow-left fa-4x" size="2x" @click="buttonPrev()" style="cursor: pointer;"/>
            <pie-chart id="humidity-real-time-donut" :data = "dataHumidity" :title = "graphType" :colors="colorData" donut="true" legend="false" suffix="%" width="250px" height="250px"></pie-chart>
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
    name: 'Donut_pie_Humidity',
    data()
    {
        return {
            word: String,
            graphType: String,
            dataHumidity: {},
            colorData: [],
        }
    },
    mounted(){
        this.getData(1);
    },
    methods:{
        buttonPrev(){
            count--;
            if(count < 1){
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
        
            let defaultHum = 90;
            let currentDevice = count - 1;
            console.log(currentDevice);

            try {
                const res = await axios.get('http://localhost:3002/Data')
                const dataHum = res.data.humidity;
                if(currentDevice == 0){
                    this.graphType = "Humidity - " + "dummy-temp-1"
                    this.colorData = ['blue', 'white'];
                    const Humi1 = dataHum[currentDevice].pop();
                    console.log(Humi1);

                    let leftHumi = (defaultHum - Humi1).toFixed(2);
                    let obj = {'current humidity': Humi1, 'rest of the humidity': leftHumi}
                    this.dataHumidity = obj;
                    this.word = Humi1 + " % ";
                    this.getSingleData(currentDevice + 1);
                }
                if(currentDevice == 1){
                    this.graphType = "Humidity - " + "dummy-temp-2"
                    this.colorData = ['red', 'white'];
                    const Humi2 = dataHum[currentDevice].pop();

                    const leftHumi = (defaultHum - Humi2).toFixed(2);
                    const obj = {'current humidity': Humi2, 'rest of the humidity': leftHumi}
                    this.dataHumidity = obj;
                    this.word = Humi2 + " % ";
                    this.getSingleData(currentDevice + 1);
                }
                if(currentDevice == 2){
                    this.graphType = "Humidity - " + "dummy-temp-3"
                    this.colorData = ['orange', 'white'];
                    const Humi3 = dataHum[currentDevice].pop();

                    const leftHumi = (defaultHum - Humi3).toFixed(2);
                    const obj = {'current humidity': Humi3, 'rest of the humidity': leftHumi}
                    this.dataHumidity = obj;
                    this.word = Humi3 + " % ";
                    this.getSingleData(currentDevice + 1);
                }

            } catch (error) {
                console.log(error)
            }
        },
        getSingleData(deviceid){
            let defaultHum = 90;
            socket_client.on('singleData_Humidity', (res) => {
                let device = "dummy-temp-" + deviceid
                if(device == res.deviceId){
                    console.log(res.deviceId);
                    const currentHumi = res.humidity; 
                    const leftHumi = (defaultHum - res.humidity).toFixed(2);
                    const obj = {'current humidity': currentHumi, 'rest of the humidity': leftHumi}
                    this.dataHumidity = obj;
                    this.word = res.humidity.toString() + " % ";
                    console.log("able to recognize")
                    console.log(currentHumi);
                    console.log("the rest of pie in white color")
                    console.log(leftHumi);
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