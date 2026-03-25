// This file contains the uplink and downlink for ttn

// Uplink
function decodeUplink(input) {
    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var Volt_Pressure = (input.bytes[3] * 256 + input.bytes[4]) / 1000.0
    var Pipe_Pressure = (Volt_Pressure-0.483)*400  //KPa---(If the pressure sensor is replaced, the user has to modify the conversion formula.)
        Pipe_Pressure = Math.round(Pipe_Pressure * 1000) / 1000;  // keep three decimal places
    var time_interval = (input.bytes[13] * 16777216 + input.bytes[14] * 65536 + input.bytes[15] * 256 + input.bytes[16]) / 1000.0//S

    var time = null;
    var timeStr = null;
    
    if (input.bytes.length >= 21) {

        time = (input.bytes[17]*16777216 + input.bytes[18]*65536 + input.bytes[19]*256 + input.bytes[20]);

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
    The last bit (the 21 bytes for firmware with a timestamp, and the 17 bytes for firmware without a timestamp)
    is the system local data upload flag; when received by the platform, it is always set to 0 (and can be ignored).
    */

    return {
        data: {
            field1: bat,
            field2: Volt_Pressure,
            field3: Pipe_Pressure,
            field4: time_interval,
            device_time: timeStr,
            device_time_unix: time
        },
    };
}

// .................................................................................................
// .................................................................................................
// .................................................................................................

/* 
Downlink:

The downlink has two functions: 
the first is the modification interval for Fport1; 
the second is the amount of uploaded local latest log data for Fport5;
*/

// Encoder function to be used in the TTN console for downlink payload（Fport 1）
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
