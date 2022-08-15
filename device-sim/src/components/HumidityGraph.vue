<template>
    <div class="graph">
        <line-chart style="margin: auto; background-color: aliceblue;" id="humidity-chart" :data="Humidity" title = "Humidity Graph" min="nil"  max="85" :download="{background: '#fff'}" discrete="true" width="1400px" height="380px" xtitle = "Timestamp" ytitle = "Humidity (%)" legend = "bottom"></line-chart>
    </div>
</template>

<script>
import axios from 'axios'
import chartkick from 'chartkick';
import { socket_client } from "../services/socket.js"

export default {
    name: 'HumidityGraph',
    data()
    {
        return {
            Humidity:new Array(),
        }
    },
    // To run this method before it loaded finished webpage and showing out
    // Else the data will mess up as it run all the code in the same time
    mounted(){
        this.getData();
    },
    methods:{
        async getData(){
       
            try {
                const res = await axios.get('http://localhost:3002/Data')
                console.log(res);
                const arr = new Array();          
                const dataHum = res.data.humidity;
                const Humi1 = dataHum[0];
                const Humi2 = dataHum[1];
                const Humi3 = dataHum[2];
    
                const dataTime = res.data.timestamp;
                const Time1 = dataTime[0];
                const Time2 = dataTime[1];
                const Time3 = dataTime[2];
    
                const Humidity1 = {}
                const Humidity2 = {}
                const Humidity3 = {}
    
                Time1.forEach((element, index) => {
                    Humidity1[element] = Humi1[index];
                })
                Time2.forEach((element, index) => {
                    Humidity2[element] = Humi2[index];
                })
                Time3.forEach((element, index) => {
                    Humidity3[element] = Humi3[index];
                })

                arr.push({name: 'dummy-temp-1', data: Humidity1})
                arr.push({name: 'dummy-temp-2', data: Humidity2})
                arr.push({name: 'dummy-temp-3', data: Humidity3})

                this.Humidity = arr;
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
            var chart = chartkick.charts["humidity-chart"];
            socket_client.on('data', (res) => {
                
                if(res.deviceId == `dummy-temp-1`){
                    num+=1;
                    const temp = this.Humidity[0].data;
                    if(Object.keys(temp).length != 7 ){
                        temp[res.timestamp] = res.humidity.toString();
                        tryD = temp;
                        console.log(tryD);
                    } else{
                        console.log("device-1")
                        const tempToArray = Object.entries(temp);
                        const afterDelete = deleteFirstRow(tempToArray);
                        const mapArray = new Map(afterDelete);
                        const arrToObj = Object.fromEntries(mapArray);
                        arrToObj[res.timestamp] = res.humidity.toString();
                        tryD = arrToObj;
                        console.log(tryD);
                    }
                }
                if(res.deviceId == `dummy-temp-2`){
                    num+=1;
                    const temp = this.Humidity[1].data;
                    if(Object.keys(temp).length != 7 ){
                        temp[res.timestamp] = res.humidity.toString();
                        tryD2 = temp;
                        console.log(tryD2);
                    } else {
                        const tempToArray = Object.entries(temp);
                        console.log("device-2")
                        const afterDelete = deleteFirstRow(tempToArray);
                        const mapArray = new Map(afterDelete);
                        const arrToObj = Object.fromEntries(mapArray);
                        arrToObj[res.timestamp] = res.humidity.toString();
                        tryD2 = arrToObj;
                        console.log(tryD2);
                    }
                }
                if(res.deviceId == `dummy-temp-3`){
                    num+=1;
                    const temp = this.Humidity[2].data;
                    if(Object.keys(temp).length != 7 ){
                        temp[res.timestamp] = res.humidity.toString();
                        tryD3 = temp;
                        console.log(tryD3);
                    } else{
                        const tempToArray = Object.entries(temp);
                        console.log("device-3");
                        const afterDelete = deleteFirstRow(tempToArray);
                        const mapArray = new Map(afterDelete);
                        const arrToObj = Object.fromEntries(mapArray);
                        arrToObj[res.timestamp] = res.humidity.toString();
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
                    this.Humidity = arr;
                }        
            })
        },
    }
}
</script>

<style scoped>
    .graph{
        width: 1400px;
        height: 400px;
        border: 2px solid black; 
        padding: 5px; 
        margin-bottom: 20px;
    }
</style>