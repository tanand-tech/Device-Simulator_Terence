"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humidity = void 0;
require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');
// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'eM85tdvGxI560wXu40kWAvnc4KmtoYkZlD2Wg7McJUqEVpB0gi9kiCTrqg7Lp-NrdULCU2ajCtAng0iXyYLe7A==';
const org = 'T Organization';
const bucket = 'IOT Project 1';
const clientDB = new InfluxDB({ url: 'http://localhost:8086', token: token });
const mqtt = require('mqtt');
let deviceId;
const client = mqtt.connect(`mqtt://localhost`);
const count = 3;
for (let i = 1; i <= count; i += 1) {
    deviceId = `dummy-temp-${i}`;
    // subscriber.js 
    const topicName = `site-a/data/${deviceId}/ambient`;
    client.on('connect', () => {
        console.log('MQTT Connected');
        client.subscribe(topicName, function (err) {
            // if (err) {
            //   console.log('Unsuccessful to subscribe');
            // } else {
            //   console.log('Successful to subcribe')
            // }
        });
    });
}
client.on('message', (topic, Message) => {
    var temp = JSON.parse(Message);
    // Payload is Buffer
    // console.log(`Topic: ${topic}, Message: ${Message}`)
    const { Point } = require('@influxdata/influxdb-client');
    const writeApi = clientDB.getWriteApi(org, bucket);
    writeApi.useDefaultTags({ host: 'host1' });
    const point = new Point(topic)
        .floatField('timestamp', temp.timestamp)
        .tag('deviceId', temp.deviceId)
        .floatField('temperature', temp.temperature)
        .floatField('humidity', temp.humidity);
    writeApi.writePoint(point);
    writeApi
        .close()
        .then(() => {
        // console.log('FINISHED')
    })
        .catch(e => {
        console.error(e);
        // console.log('Finished ERROR')
    });
});
const queryApi = clientDB.getQueryApi(org);
const query = `from(bucket: "IOT Project 1")
|> range(start: -1h)
|> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature")
|> filter(fn: (r) => r["deviceId"] == "dummy-temp-1")`;
exports.humidity = [];
queryApi.queryRows(query, {
    next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        // var tempData = JSON.parse(o);
        exports.humidity.push(`${o._value}`);
        console.log(`${o._field}=${o._value}`);
    },
    error(error) {
        console.error(error);
        console.log('Finished ERROR');
    },
    complete() {
        console.log('Finished SUCCESS');
        console.log(exports.humidity);
    },
});
//# sourceMappingURL=main.js.map