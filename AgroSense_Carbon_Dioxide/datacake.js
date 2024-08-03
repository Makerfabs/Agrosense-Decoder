function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0;
    var co2 = input.bytes[3] * 256 + input.bytes[4];

    // 检查并处理NaN值
    if (isNaN(num)) num = 0;
    if (isNaN(bat)) bat = 0;
    if (isNaN(co2)) co2 = 0;
    
    return [
        {
            field: "num",
            value: num
        },
        {
            field: "bat",
            value: bat
        },
        {
            field: "co2",
            value: co2
        }

    ];
}