function decodeUplink(input) {

    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var water_leak_flag = input.bytes[3]
    var water_leak_cnt = input.bytes[4] * 256 + input.bytes[5]
    var water_leak_time =  input.bytes[6] * 16777216 + input.bytes[7] * 65536 + input.bytes[8] * 256 + input.bytes[9]

    return {
        data: {
            field1: num,
            field2: bat,
            field3: water_leak_flag,
            field4: water_leak_cnt,
            field5: water_leak_time,
        },

    };
}