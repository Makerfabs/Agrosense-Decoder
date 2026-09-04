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

    var pwr =  (bytes[8] * 256 + bytes[9])/100;

    var interval = (
        bytes[10] * 16777216 +
        bytes[11] * 65536 +
        bytes[12] * 256 +
        bytes[13]
    ) / 1000;

    var time = (input.bytes[14]* 16777216 + input.bytes[15]* 65536 + input.bytes[16] * 256 + input.bytes[17]); //interval when valve is open

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
            pwr: pwr,
            device_time: timeStr,//时间
            device_time_unix: time
        },
        warnings: [],
        errors: []
  };
}