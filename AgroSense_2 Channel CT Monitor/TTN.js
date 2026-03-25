// This file contains the uplink and downlink for ttn

// Uplink

function decodeUplink(input) {
  var bytes = input.bytes;

  var num = bytes[0] * 256 + bytes[1];
  var ADC_1 = (bytes[2] * 256 + bytes[3]) / 10.0;
  var ADC_2 = (bytes[4] * 256 + bytes[5]) / 10.0;
  var CT1_ADC = (bytes[6] * 256 + bytes[7]) / 1000.0;//This voltage needs to be combined with the sensor's ratio;
  var CT2_ADC = (bytes[8] * 256 + bytes[9]) / 1000.0;//This voltage needs to be combined with the sensor's ratio;
  
  var CT1 = CT1_ADC*100 //if the sensor is 60A/1V, multiply by 60; if it's 100A/1V, multiply by 100; if it's 300A/1V, multiply by 300.
  var CT2 = CT2_ADC*100 //if the sensor is 60A/1V, multiply by 60; if it's 100A/1V, multiply by 100; if it's 300A/1V, multiply by 300.
  
  var humidity = (bytes[10] * 256 + bytes[11]) / 10.0;
  var temperature = bytes[12] * 256 + bytes[13];
  if (temperature >= 0x8000) {
    temperature -= 0x10000;
  }
  temperature = temperature / 10.0;

  var interval = (bytes[14] * 16777216 +bytes[15] * 65536 + bytes[16] * 256 +bytes[17] ) / 1000;
  
  // No timestamp by default
  var time = null;
  var timeStr = null;

  // Check if there is a timestamp
  if (bytes.length >= 22) {

      time = (bytes[18] * 16777216 + bytes[19] * 65536 + bytes[20] * 256 + bytes[21]);

      var d = new Date(time * 1000);

      timeStr =
          d.getUTCFullYear() + "-" +
          String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
          String(d.getUTCDate()).padStart(2, "0") + " " +
          String(d.getUTCHours()).padStart(2, "0") + ":" +
          String(d.getUTCMinutes()).padStart(2, "0") + ":" +
          String(d.getUTCSeconds()).padStart(2, "0");
  }

  /*
  Note:
  The last byte (the 22 bytes for firmware with a timestamp, and the 18 bytes for firmware without a timestamp)
  is the system local data upload flag; when received by the platform, it is always set to 0 (and can be ignored).
  */

  return {
    data: {
      ADC_1: ADC_1,//0-5V ADC
      ADC_2: ADC_2,//0-5V ADC
      CT1: CT1,//A
      CT2: CT2,//A
      temperature: temperature,
      humidity: humidity,
      interval: interval,
      device_time: timeStr,
      device_time_unix: time
    },
    warnings: [],
    errors: []
  };
}
