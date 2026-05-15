function decodeUplink(input) {

    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var Door_open_flag = input.bytes[3]
    var Door_open_cnt = input.bytes[4] * 256 + input.bytes[5]
    var Door_open_last_time =  input.bytes[6] * 16777216 + input.bytes[7] * 65536 + input.bytes[8] * 256 + input.bytes[9]       //s
    var Door_open_all_time =  input.bytes[10] * 16777216 + input.bytes[11] * 65536 + input.bytes[12] * 256 + input.bytes[13]    //s
    var interval = (input.bytes[14] * 16777216 + input.bytes[15] * 65536 + input.bytes[16] * 256 + input.bytes[17]) / 1000      //s
    var time = (input.bytes[18]*16777216 + input.bytes[19]*65536 + input.bytes[20]*256 + input.bytes[21])

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
            field2: Door_open_flag, //Normal is 0,Door_open is 1.
            field3: Door_open_cnt,
            field4: Door_open_last_time,
            field5: Door_open_all_time,
            field6: interval,
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

