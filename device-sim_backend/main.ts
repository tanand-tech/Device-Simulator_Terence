require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = Infinity;
const mqtt = require('mqtt');
const { InfluxDB } = require('@influxdata/influxdb-client')
const { Point } = require('@influxdata/influxdb-client')
const { Server } = require("socket.io");

// Details of influxDB
const token = 'eM85tdvGxI560wXu40kWAvnc4KmtoYkZlD2Wg7McJUqEVpB0gi9kiCTrqg7Lp-NrdULCU2ajCtAng0iXyYLe7A=='
const org = 'T Organization'
const bucket = 'IOT Project 1'

// connect to the db created
const clientDB = new InfluxDB({ url: 'http://localhost:8086', token: token })

let deviceId;

// Get start of socket.io
const io = new Server(3003, {
  cors: {
    origin: '*',
  }
});

// When website started to load, socket will turn on the connection
io.on('connection', (socket) => {
  // Client will connect to the mqtt
  const client = mqtt.connect(`mqtt://localhost`);
  // Subscribe 
  const count = 3;
  for (let i = 1; i <= count; i += 1) {
    deviceId = `dummy-temp-${i}`; 
    const topicName = `site-a/data/${deviceId}/ambient`;
    client.subscribe(topicName, function (err) {
    })
  }

  // Getting data once simulator start to work
  client.on('message', (topic, Message) => {
    var temp = JSON.parse(Message);

    // Write data into database
    const writeApi = clientDB.getWriteApi(org, bucket)
    writeApi.useDefaultTags({ host: 'host1' })

    const point = new Point(topic)
      .tag('timestamp', temp.timestamp)
      .tag('deviceId', temp.deviceId)
      .floatField('temperature', temp.temperature)
      .floatField('humidity', temp.humidity)

    writeApi.writePoint(point)

    // After write into database
    writeApi
      .close()
      .then(() => {
        // Socket emit data - Real-time data
        socket.emit('data',
          {
            'timestamp': convert_Timestamp(temp.timestamp),
            'deviceId': temp.deviceId,
            'temperature': temp.temperature,
            'humidity': temp.humidity
          });
        socket.emit('singleData_Humidity',
          {
            'deviceId': temp.deviceId,
            'humidity': temp.humidity
          });
        socket.emit('singleData_Temperature',
          {
            'deviceId': temp.deviceId,
            'temperature': temp.temperature,
          });
        console.log(temp.deviceId + " - " + temp.temperature + " - " + convert_Timestamp(temp.timestamp));
      })
      .catch(e => {
        console.error(e)
      })
  })

  socket.on("disconnect", () => {
    client.end();
    console.log("disconnected.")
  });
});

function convert_Timestamp(x) {
  const milliseconds = x * 1000
  var tm_F = new Date(milliseconds).toLocaleString("en-US")
  return tm_F;
}
