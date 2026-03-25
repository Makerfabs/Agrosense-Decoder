// This file contains the uplink and downlink for ttn

// Uplink

function decodeUplink(input) {

    // var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[4] / 10.0
    var adc = input.bytes[2] * 256 + input.bytes[3]
    var interval = (input.bytes[5]* 16777216 + input.bytes[6]* 65536 + input.bytes[7] * 256 + input.bytes[8]) / 1000; //interval when valve is open

    var time = null;
    var timeStr = null;
    
    if (input.bytes.length >= 13) {
        time = (input.bytes[9]* 16777216 + input.bytes[10]* 65536 + input.bytes[11] * 256 + input.bytes[12]); //interval when valve is open

        var d = new Date(time * 1000);

        // 格式化为 "YYYY-MM-DD HH:mm:ss"（UTC）
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
    The last byte (the 13 bytes for firmware with a timestamp, and the 9 bytes for firmware without a timestamp)
    is the system local data upload flag; when received by the platform, it is always set to 0 (and can be ignored).
    */

    return {
        data: {
            field1: bat,
            field2: adc,
            field3: interval,
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