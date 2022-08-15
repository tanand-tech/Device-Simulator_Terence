"use strict";
exports.__esModule = true;
require('dotenv').config();
var InfluxCD = require('@influxdata/influxdb-client').InfluxDB;
var express = require("express");
var cors = require("cors");
var port = 3002;
var tokenCD = 'eM85tdvGxI560wXu40kWAvnc4KmtoYkZlD2Wg7McJUqEVpB0gi9kiCTrqg7Lp-NrdULCU2ajCtAng0iXyYLe7A==';
var orgCD = 'T Organization';
var clientCD = new InfluxCD({ url: 'http://localhost:8086', token: tokenCD });
var query = "from(bucket: \"IOT Project 1\")\n|> range(start: -2m)\n|> filter(fn: (r) => r[\"_field\"] == \"humidity\" or r[\"_field\"] == \"temperature\")\n|> filter(fn: (r) => r[\"deviceId\"] == \"dummy-temp-1\" or r[\"deviceId\"] == \"dummy-temp-2\" or r[\"deviceId\"] == \"dummy-temp-3\")\n|> group()\n|> sort(columns: [\"timestamp\"], desc: true,)\n|> limit(n: 42)";
var queryApi = clientCD.getQueryApi(orgCD);
var app = express();
app.use(cors());
var humidityCD = [[], [], []];
var TemperatureCD = [[], [], []];
var TimeCD = [[], [], []];
function convert_Timestamp(x) {
    var milliseconds = x * 1000;
    var tm_F = new Date(milliseconds).toLocaleString("en-US");
    return tm_F;
}
app.get("/Data", function (req, res, next) {
    queryApi.queryRows(query, {
        next: function (row, tableMeta) {
            var o = tableMeta.toObject(row);
            if ("".concat(o.deviceId) == "dummy-temp-1") {
                if ("".concat(o._field) == "humidity") {
                    humidityCD[0].push("".concat(o._value));
                }
                if ("".concat(o._field) == "temperature") {
                    TemperatureCD[0].push("".concat(o._value));
                }
                if ("".concat(o.timestamp)) {
                    var tm_F = convert_Timestamp("".concat(o.timestamp));
                    if (!TimeCD[0].includes(tm_F)) {
                        TimeCD[0].push(tm_F);
                    }
                }
            }
            if ("".concat(o.deviceId) == "dummy-temp-2") {
                if ("".concat(o._field) == "humidity") {
                    humidityCD[1].push("".concat(o._value));
                }
                if ("".concat(o._field) == "temperature") {
                    TemperatureCD[1].push("".concat(o._value));
                }
                if ("".concat(o.timestamp)) {
                    var tm_F_1 = convert_Timestamp("".concat(o.timestamp));
                    if (!TimeCD[1].includes(tm_F_1)) {
                        TimeCD[1].push(tm_F_1);
                        ;
                    }
                }
            }
            if ("".concat(o.deviceId) == "dummy-temp-3") {
                if ("".concat(o._field) == "humidity") {
                    humidityCD[2].push("".concat(o._value));
                }
                if ("".concat(o._field) == "temperature") {
                    TemperatureCD[2].push("".concat(o._value));
                }
                if ("".concat(o.timestamp)) {
                    var tm_F_2 = convert_Timestamp("".concat(o.timestamp));
                    if (!TimeCD[2].includes(tm_F_2)) {
                        TimeCD[2].push(tm_F_2);
                        ;
                    }
                }
            }
        },
        error: function (error) {
            console.error(error);
            console.log('Finished ERROR');
        },
        complete: function () {
            console.log('Finished SUCCESS');
            humidityCD[0].reverse();
            humidityCD[1].reverse();
            humidityCD[2].reverse();
            TemperatureCD[0].reverse();
            TemperatureCD[1].reverse();
            TemperatureCD[2].reverse();
            TimeCD[0].reverse();
            TimeCD[1].reverse();
            TimeCD[2].reverse();
            var data = {
                'humidity': humidityCD,
                'temperature': TemperatureCD,
                'timestamp': TimeCD
            };
            res.json({
                humidity: humidityCD,
                temperature: TemperatureCD,
                timestamp: TimeCD
            });
            console.log(data);
            humidityCD[0].length = 0;
            humidityCD[1].length = 0;
            humidityCD[2].length = 0;
            TemperatureCD[0].length = 0;
            TemperatureCD[1].length = 0;
            TemperatureCD[2].length = 0;
            TimeCD[0].length = 0;
            TimeCD[1].length = 0;
            TimeCD[2].length = 0;
            // resetData();
        }
    });
});
app.listen(port, function () {
    console.log("Listening on port ".concat(port, " with humidity"));
});
exports["default"] = app;
