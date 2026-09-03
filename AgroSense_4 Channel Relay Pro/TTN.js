function decodeUplink(input) {
    var bytes = input.bytes;

    var num = bytes[0] * 256 + bytes[1];
    var Relay_1 = bytes[2];
    var Relay_2 = bytes[3];
    var Relay_3 = bytes[4];
    var Relay_4 = bytes[5];
    
    var temperature = bytes[6] * 256 + bytes[7];
    if (temperature >= 0x8000) {
        temperature -= 0x10000;
    }
    temperature = temperature / 100.0;
    var interval = (
        bytes[8] * 16777216 +
        bytes[9] * 65536 +
        bytes[10] * 256 +
        bytes[11]
    ) / 1000;

    var time = (input.bytes[12]* 16777216 + input.bytes[13]* 65536 + input.bytes[14] * 256 + input.bytes[15]); //interval when valve is open

    var d = new Date(time * 1000);

    // 格式化为 "YYYY-MM-DD HH:mm:ss"（UTC）
    var timeStr =
        d.getUTCFullYear() + "-" +
        String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
        String(d.getUTCDate()).padStart(2, "0") + " " +
        String(d.getUTCHours()).padStart(2, "0") + ":" +
        String(d.getUTCMinutes()).padStart(2, "0") + ":" +
        String(d.getUTCSeconds()).padStart(2, "0");

    return {
        data: {
            field1: Relay_1,//RELAY1   :0-OFF; 1-ON
            field2: Relay_2,//RELAY2   :0-OFF; 1-ON
            field3: Relay_3,//RELAY3   :0-OFF; 1-ON
            field4: Relay_4,//RELAY4   :0-OFF; 1-ON
            field5: temperature,
            field6: interval,
            device_time: timeStr,//时间
            device_time_unix: time
        },
        warnings: [],
        errors: []
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