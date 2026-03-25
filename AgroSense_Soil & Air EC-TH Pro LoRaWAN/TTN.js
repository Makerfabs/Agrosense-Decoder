// This file contains the uplink and downlink for ttn

// Uplink
function decodeUplink(input) {
    //var Num = input.bytes[0] * 256 + input.bytes[1]
    var Bat = input.bytes[2] / 10.0 //V
    
    var Soil_temp = (input.bytes[3] * 256 + input.bytes[4])
    
    if (Soil_temp >= 0x8000) {
    Soil_temp -= 0x10000;
    }
    Soil_temp= Soil_temp/100 //°C

    var Soil_RH = input.bytes[5] * 256 + input.bytes[6] //ADC value

    // 1270 corresponds to the ADC value in air, and 815 corresponds to the ADC value in water. 
    // Based on this, the ADC can be converted into a percentage. 
    // Since water quality varies from place to place, customers need to modify these values themselves.
    var Soil_RH_Percentage=(1270-Soil_RH)*100/(1270-815) //%

    var Soil_EC = (input.bytes[7] * 16777216 + input.bytes[8] * 65536 + input.bytes[9] * 256 + input.bytes[10]) / 100.0 //µS/cm
    var Air_temp = (input.bytes[11] * 256 + input.bytes[12])
    
    if (Air_temp >= 0x8000) {
    Air_temp -= 0x10000;
    }
    Air_temp = Air_temp / 10.0 //°C

    var Air_humi = (input.bytes[13] * 256 + input.bytes[14]) / 10.0 //%
    var interval = (input.bytes[15] * 16777216 + input.bytes[16] * 65536 + input.bytes[17] * 256 + input.bytes[18]) / 1000.0 //S

    var time = null;
    var timeStr = null;
    
    if (input.bytes.length >= 23) {
        time = (input.bytes[19]*16777216 + input.bytes[20]*65536 + input.bytes[21]*256 + input.bytes[22]);

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
    The last bit (the 23 bytes for firmware with a timestamp, and the 19 bytes for firmware without a timestamp)
    is the system local data upload flag; when received by the platform, it is always set to 0 (and can be ignored).
    */

    return {
        data: {
            //field1: Num,
            field1: Bat,
            field2: Soil_temp,
            //field3: Soil_RH,
            field3: Soil_RH_Percentage,
            field4: Soil_EC,
            field5: Air_temp,
            field6: Air_humi,
            field7: interval,
            device_time: timeStr,
            device_time_unix: time
        },
  };
}

// .................................................................................................
// .................................................................................................
// .................................................................................................
// Downlink.........................................................................................
// .................................................................................................
// .................................................................................................
// .................................................................................................
// Encoder function to be used in the TTN console for downlink payload

// fPort 1   modification interval
// Encoder function for port 1
function Encoder(input) {
    var minutes = input.minutes;

    // Converting minutes to seconds
    var seconds = minutes * 60;

    // If the number of seconds is less than 300 seconds, set it to 300 seconds
    if (seconds < 300) {
        seconds = 300;
    }

    var payload = [
        (seconds >> 24) & 0xFF,
        (seconds >> 16) & 0xFF,
        (seconds >> 8) & 0xFF,
         seconds & 0xFF
    ];

    return payload;
}
