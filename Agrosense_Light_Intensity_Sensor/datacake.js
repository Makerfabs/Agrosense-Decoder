function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0;
    var light = (input.bytes[3] * 16777216 + input.bytes[4] * 65536 + input.bytes[5] * 256 + input.bytes[6]) / 100.0;

    // 检查并处理NaN值
    if (isNaN(num)) num = 0;
    if (isNaN(bat)) bat = 0;
    if (isNaN(light)) light = 0;

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
            field: "light",
            value: light
        }

    ];
}