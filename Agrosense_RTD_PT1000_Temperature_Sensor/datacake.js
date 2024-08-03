function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0;
    var temp = input.bytes[3] * 256 + input.bytes[4];

    // 检查并处理NaN值
    if (isNaN(num)) num = 0;
    if (isNaN(bat)) bat = 0;
    if (isNaN(temp)) temp = 0;

    if (temp >= 0x8000) {
        temp -= 0x10000;
    }
    temp = temp / 10.0;
    
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
            field: "temp",
            value: temp
        }

    ];
}