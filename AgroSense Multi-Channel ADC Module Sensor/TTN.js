// This file contains the uplink and downlink for ttn

// Uplink
function decodeUplink(input) {
    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var ADC1 = (input.bytes[3] * 256 + input.bytes[4]) / 1000.0 //V
    var ADC2 = (input.bytes[5] * 256 + input.bytes[6]) / 1000.0 //V
    var ADC3 = (input.bytes[7] * 256 + input.bytes[8]) / 1000.0 //V
    var ADC4 = (input.bytes[9] * 256 + input.bytes[10]) / 1000.0 //V
    var Differentialbits = (input.bytes[11] * 256 + input.bytes[12]) / 1000.0 //V
    var time_interval = (input.bytes[13] * 16777216 + input.bytes[14] * 65536 + input.bytes[15] * 256 + input.bytes[16]) / 1000.0//S

    return {
        data: {
            field1: bat,
            field2: ADC1,
            field3: ADC2,
            field4: ADC3,
            field5: ADC4,
            field6: Differentialbits,
            field7: time_interval,
        },
  };
}

// .................................................................................................
// .................................................................................................
// .................................................................................................

// Downlink

// Encoder function to be used in the TTN console for downlink payload
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
