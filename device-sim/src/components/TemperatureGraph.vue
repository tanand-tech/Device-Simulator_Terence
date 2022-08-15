<template>
    <div class="graph">
        <line-chart style="margin: auto; background-color: aliceblue;" id="temperature-chart" :data="Temperature" title = "Temperature Graph" download = "true" min="15"  max="30" discrete="true" width="1400px" height="380px" xtitle = "Timestamp" ytitle = "Temperature (°C)" legend = "bottom" ></line-chart>
    </div>
</template>

<script>
import axios from 'axios'
import chartkick from 'chartkick';
import { socket_client } from "../services/socket.js"

export default {
    name: 'TemperatureGraph',
    data()
    {
        return {
            Temperature: new Array(),
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        async getData(){
       
            try {
                const res = await axios.get('http://localhost:3002/Data')
                console.log(res);
                const arr = new Array();          
                const dataTemp = res.data.temperature;
                const Temp1 = dataTemp[0];
                const Temp2 = dataTemp[1];
                const Temp3 = dataTemp[2];
    
                const dataTime = res.data.timestamp;
                const Time1 = dataTime[0];
                const Time2 = dataTime[1];
                const Time3 = dataTime[2];
    
                const Temperature1 = {}
                const Temperature2 = {}
                const Temperature3 = {}
    
                Time1.forEach((element, index) => {
                    Temperature1[element] = Temp1[index];
                })
                Time2.forEach((element, index) => {
                    Temperature2[element] = Temp2[index];
                })
                Time3.forEach((element, index) => {
                    Temperature3[element] = Temp3[index];
                })

                arr.push({name: 'dummy-temp-1', data: Temperature1})
                arr.push({name: 'dummy-temp-2', data: Temperature2})
                arr.push({name: 'dummy-temp-3', data: Temperature3})

                this.Temperature = arr;
                console.log(arr);
            } catch (error) {
                console.log(error)
            }
            this.refresh();
        },
        refresh()
        {
            function deleteFirstRow(arr){
                arr = arr.slice(0);
                arr.splice(0, 1);
                return arr;
            }
            var num = 0;
            var tryD = {};
            var tryD2 = {};
            var tryD3 = {};
            var chart = chartkick.charts["temperature-chart"];
            socket_client.on('data', (res) => {
                
                if(res.deviceId == `dummy-temp-1`){
                    num+=1;
                    const temp = this.Temperature[0].data;
                    console.log("device-1")
                    if(Object.keys(temp).length != 7 ){
                        temp[res.timestamp] = res.temperature.toString();
                        tryD = temp;
                        console.log(tryD);
                    } else{
                        const tempToArray = Object.entries(temp);
                        console.log("Object to Array");
                        console.log(tempToArray);
                        console.log("Length of the array" + tempToArray.length);
                        const afterDelete = deleteFirstRow(tempToArray);
                        const mapArray = new Map(afterDelete);
                        const arrToObj = Object.fromEntries(mapArray);
                        arrToObj[res.timestamp] = res.temperature.toString();
                        tryD = arrToObj;
                        console.log(tryD);
                    }
                }
                if(res.deviceId == `dummy-temp-2`){
                    num+=1;
                    const temp = this.Temperature[1].data;
                    if(Object.keys(temp).length != 7 ){
                        temp[res.timestamp] = res.temperature.toString();
                        tryD2 = temp;
                        console.log(tryD2);
                    } else{
                        const tempToArray = Object.entries(temp);
                        console.log("device-2")
                        const afterDelete = deleteFirstRow(tempToArray);
                        const mapArray = new Map(afterDelete);
                        const arrToObj = Object.fromEntries(mapArray);
                        arrToObj[res.timestamp] = res.temperature.toString();
                        tryD2 = arrToObj;
                        console.log(tryD2);
                    }
                }
                if(res.deviceId == `dummy-temp-3`){
                    num+=1;
                    const temp = this.Temperature[2].data;
                    if(Object.keys(temp).length != 7 ){
                        temp[res.timestamp] = res.temperature.toString();
                        tryD3 = temp;
                        console.log(tryD3);
                    } else{
                        const tempToArray = Object.entries(temp);
                        console.log("device-3");
                        const afterDelete = deleteFirstRow(tempToArray);
                        const mapArray = new Map(afterDelete);
                        const arrToObj = Object.fromEntries(mapArray);
                        arrToObj[res.timestamp] = res.temperature.toString();
                        tryD3 = arrToObj;
                        console.log(tryD3);
                    }
                }

                if(num == 3){
                    num = 0;
                    console.log("success load 3 times")
                    const arr = [];
                    arr.push({name: 'dummy-temp-1', data: tryD})
                    arr.push({name: 'dummy-temp-2', data: tryD2})
                    arr.push({name: 'dummy-temp-3', data: tryD3})
                    console.log(arr);
                    chart.updateData(arr); 
                    this.Temperature = arr;
                }        
            })
        }
    }
}
</script>

<style scoped>
    .graph{
        width: 1400px;
        height: 400px;
        border: 2px solid black; 
        padding: 5px; 
        margin-top: 10px;
        margin-bottom: 20px;
    }
</style>