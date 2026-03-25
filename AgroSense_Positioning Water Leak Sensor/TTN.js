function decodeUplink(input) {

    //var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var water_leak_flag = input.bytes[3]
    var water_leak_cnt = input.bytes[4] * 256 + input.bytes[5]
    var water_leak_time =  input.bytes[6] * 16777216 + input.bytes[7] * 65536 + input.bytes[8] * 256 + input.bytes[9]

    var time = null;
    var timeStr = null;
    
    if (input.bytes.length >= 14) {

        time = (input.bytes[10]*16777216 + input.bytes[11]*65536 + input.bytes[12]*256 + input.bytes[13]);

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
    The last bit (the 14 bytes for firmware with a timestamp, and the 10 bytes for firmware without a timestamp)
    is the system local data upload flag; when received by the platform, it is always set to 0 (and can be ignored).
    */

    return {
        data: {
            field1: bat,
            field2: water_leak_flag, //Normal is 0,leakage is 1.
            field3: water_leak_cnt,
            field4: water_leak_time,
            device_time: timeStr,
            device_time_unix: time
        },

    };
}