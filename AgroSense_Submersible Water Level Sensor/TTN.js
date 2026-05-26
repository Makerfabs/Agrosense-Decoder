function decodeUplink(input) {

    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var water_bat = input.bytes[3] * 256 + input.bytes[4]   //mv
    var current_mA = water_bat / 150.0;  //res：150Ω
    var Water_depth = ((current_mA - 4.0) / 16.0) * 5.0;    //4~20mA -> 0~5m

    if (Water_depth < 0) {
        Water_depth = 0;
    }

    if (Water_depth > 5) {
        Water_depth = 5;
    }
    
    var Water_pressure = 1000 * 9.8 * Water_depth;  // p = ρgh, ρ = 1000kg/m³, g = 9.8m/s²

    Water_depth = Number(Water_depth.toFixed(2));
    Water_pressure = Number(Water_pressure.toFixed(2));

    var interval = (input.bytes[5] * 16777216 + input.bytes[6] * 65536 + input.bytes[7] * 256 + input.bytes[8]) / 1000      //s
    var time = (input.bytes[9]*16777216 + input.bytes[10]*65536 + input.bytes[11]*256 + input.bytes[12])

    var timeStr = null;

    var d = new Date(time * 1000)
    
    timeStr =
            d.getUTCFullYear() + "-" +
            String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
            String(d.getUTCDate()).padStart(2, "0") + " " +
            String(d.getUTCHours()).padStart(2, "0") + ":" +
            String(d.getUTCMinutes()).padStart(2, "0") + ":" +
            String(d.getUTCSeconds()).padStart(2, "0");

    return {
        data: {
            field0: num,
            field1: bat,
            field2: Water_depth, //unit: m
            field3: Water_pressure, //unit: Pa
            field4: interval,
            device_time: timeStr,
            device_time_unix: time
        },
    };
}
/*
If the user needs to calibrate, we recommended calibration procedure:

1. Zero Calibration
   Measure the current when water depth = 0m.

   Example:
       zero_mA = 4.12mA

2. Span Calibration
   Measure the current at a known water depth.

   Example:
       depth = 5m
       span_mA = 19.85mA

3. Use the calibrated formula:

depth =
    ((current_mA - zero_mA) /
    (span_mA - zero_mA)) * max_depth

Example:

var zero_mA   = 4.12;
var span_mA   = 19.85;
var max_depth = 5.0;

var Water_depth =
    ((current_mA - zero_mA) /
    (span_mA - zero_mA)) * max_depth;

This calibration can significantly reduce:
- ADC error
- resistor error
- sensor zero drift
- full-scale deviation
*/




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

