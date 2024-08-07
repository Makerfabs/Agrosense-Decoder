function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0;
    var humi = ( input.bytes[3] * 256 + input.bytes[4] ) / 10.0;
    var temp = ( input.bytes[5] * 256 + input.bytes[6] ) / 10.0;

    // 检查并处理NaN值
    if (isNaN(num)) num = 0;
    if (isNaN(bat)) bat = 0;
    if (isNaN(humi)) humi = 0;
    if (isNaN(temp)) temp = 0;

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
            field: "humi",
            value: humi
        },
        {
            field: "temp",
            value: temp
        }
    ];
}
