require('dotenv').config();
import { addAbortSignal } from "stream";

const { InfluxDB: InfluxCD } = require('@influxdata/influxdb-client')
const express = require("express");
const cors = require("cors");
const port = 3002;

const tokenCD = 'eM85tdvGxI560wXu40kWAvnc4KmtoYkZlD2Wg7McJUqEVpB0gi9kiCTrqg7Lp-NrdULCU2ajCtAng0iXyYLe7A=='
const orgCD = 'T Organization'

const clientCD = new InfluxCD({ url: 'http://localhost:8086', token: tokenCD })

const query = `from(bucket: "IOT Project 1")
|> range(start: -2m)
|> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature")
|> filter(fn: (r) => r["deviceId"] == "dummy-temp-1" or r["deviceId"] == "dummy-temp-2" or r["deviceId"] == "dummy-temp-3")
|> group()
|> sort(columns: ["timestamp"], desc: true,)
|> limit(n: 42)`;

const queryApi = clientCD.getQueryApi(orgCD)

const app = express();
app.use(cors());

const humidityCD: string[][] = [[], [], []];
const TemperatureCD: string[][] = [[], [], []];
const TimeCD: string[][] = [[], [], []];

function convert_Timestamp(x) {
  const milliseconds = x * 1000
  var tm_F = new Date(milliseconds).toLocaleString("en-US")
  return tm_F;
}

app.get("/Data", (req, res, next) => {
  queryApi.queryRows(query, {
    next(row, tableMeta) {

      const o = tableMeta.toObject(row)
      if (`${o.deviceId}` == `dummy-temp-1`) {
        if (`${o._field}` == `humidity`) {
          humidityCD[0].push(`${o._value}`);
        }
        if (`${o._field}` == `temperature`) {
          TemperatureCD[0].push(`${o._value}`);
        }
        if (`${o.timestamp}`) {
          var tm_F = convert_Timestamp(`${o.timestamp}`);
          if (!TimeCD[0].includes(tm_F)) {
            TimeCD[0].push(tm_F);
          }
        }
      }

      if (`${o.deviceId}` == `dummy-temp-2`) {
        if (`${o._field}` == `humidity`) {
          humidityCD[1].push(`${o._value}`);
        }
        if (`${o._field}` == `temperature`) {
          TemperatureCD[1].push(`${o._value}`);
        }
        if (`${o.timestamp}`) {
          var tm_F_1 = convert_Timestamp(`${o.timestamp}`);
          if (!TimeCD[1].includes(tm_F_1)) {
            TimeCD[1].push(tm_F_1);;
          }
        }
      }

      if (`${o.deviceId}` == `dummy-temp-3`) {
        if (`${o._field}` == `humidity`) {
          humidityCD[2].push(`${o._value}`);
        }
        if (`${o._field}` == `temperature`) {
          TemperatureCD[2].push(`${o._value}`);
        }
        if (`${o.timestamp}`) {
          var tm_F_2 = convert_Timestamp(`${o.timestamp}`);
          if (!TimeCD[2].includes(tm_F_2)) {
            TimeCD[2].push(tm_F_2);;
          }
        }
      }
    },
    error(error) {
      console.error(error)
      console.log('Finished ERROR')
    },
    complete() {
      console.log('Finished SUCCESS')
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
        timestamp: TimeCD,
      });
      console.log(data)
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
    },
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port} with humidity`);
})

export default app;





