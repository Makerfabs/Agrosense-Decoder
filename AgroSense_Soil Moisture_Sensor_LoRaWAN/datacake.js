function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1];
    var adc = input.bytes[2] * 256 + input.bytes[3];
    var bat = input.bytes[4] / 10.0;

    // 检查并处理NaN值
    if (isNaN(num)) num = 0;
    if (isNaN(adc)) adc = 0;
    if (isNaN(bat)) bat = 0;

    return [
        {
            field: "num",
            value: num
        },
        {
            field: "adc",
            value: adc
        },
        {
            field: "bat",
            value: bat
        }
    ];
}