require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = Infinity;
var mqtt = require('mqtt');
var InfluxDB = require('@influxdata/influxdb-client').InfluxDB;
var Point = require('@influxdata/influxdb-client').Point;
var Server = require("socket.io").Server;
// Details of influxDB
var token = 'eM85tdvGxI560wXu40kWAvnc4KmtoYkZlD2Wg7McJUqEVpB0gi9kiCTrqg7Lp-NrdULCU2ajCtAng0iXyYLe7A==';
var org = 'T Organization';
var bucket = 'IOT Project 1';
// connect to the db created
var clientDB = new InfluxDB({ url: 'http://localhost:8086', token: token });
var deviceId;
// Get start of socket.io
var io = new Server(3003, {
    cors: {
        origin: '*'
    }
});
// When website started to load, socket will turn on the connection
io.on('connection', function (socket) {
    // Client will connect to the mqtt
    var client = mqtt.connect("mqtt://localhost");
    // Subscribe 
    var count = 3;
    for (var i = 1; i <= count; i += 1) {
        deviceId = "dummy-temp-".concat(i);
        var topicName = "site-a/data/".concat(deviceId, "/ambient");
        client.subscribe(topicName, function (err) {
        });
    }
    // Getting data once simulator start to work
    client.on('message', function (topic, Message) {
        var temp = JSON.parse(Message);
        // Write data into database
        var writeApi = clientDB.getWriteApi(org, bucket);
        writeApi.useDefaultTags({ host: 'host1' });
        var point = new Point(topic)
            .tag('timestamp', temp.timestamp)
            .tag('deviceId', temp.deviceId)
            .floatField('temperature', temp.temperature)
            .floatField('humidity', temp.humidity);
        writeApi.writePoint(point);
        // After write into database
        writeApi
            .close()
            .then(function () {
            // Socket emit data - Real-time data
            socket.emit('data', {
                'timestamp': convert_Timestamp(temp.timestamp),
                'deviceId': temp.deviceId,
                'temperature': temp.temperature,
                'humidity': temp.humidity
            });
            socket.emit('singleData_Humidity', {
                'deviceId': temp.deviceId,
                'humidity': temp.humidity
            });
            socket.emit('singleData_Temperature', {
                'deviceId': temp.deviceId,
                'temperature': temp.temperature
            });
            console.log(temp.deviceId + " - " + temp.temperature + " - " + convert_Timestamp(temp.timestamp));
        })["catch"](function (e) {
            console.error(e);
        });
    });
    socket.on("disconnect", function () {
        client.end();
        console.log("disconnected.");
    });
});
function convert_Timestamp(x) {
    var milliseconds = x * 1000;
    var tm_F = new Date(milliseconds).toLocaleString("en-US");
    return tm_F;
}
