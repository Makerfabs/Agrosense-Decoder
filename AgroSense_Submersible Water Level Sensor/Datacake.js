function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var water_bat = input.bytes[3] * 256 + input.bytes[4]   //mv
    var current_mA = water_bat / 150.0;  //res：150Ω
    var Water_depth = ((current_mA - 4.0) / 16.0) * 5.0;    //4~20mA -> 0~5m

    if (Water_depth < 0) {
        Water_depth = 0;
    }

    if (Water_depth > 5) {
        Water_depth = 5;
    }

    var Water_pressure = 1000 * 9.8 * Water_depth;  // p = ρgh, ρ = 1000kg/m³, g = 9.8m/s²

    var interval = (input.bytes[5] * 16777216 + input.bytes[6] * 65536 + input.bytes[7] * 256 + input.bytes[8]) / 1000      //s
    var time = (input.bytes[9]*16777216 + input.bytes[10]*65536 + input.bytes[11]*256 + input.bytes[12])
    
    var decoded = 
    {
        NUM:num,
        BAT:bat,
        WATER_DEPTH:Water_depth,
        WATER_PRESSURE:Water_pressure, 
        INTERVAL:interval,
        time: time
    };

    // Test for LoRa properties in normalizedPayload
    try {
    if (normalizedPayload.gateways && normalizedPayload.gateways.length > 0) {
        decoded.LORA_RSSI = normalizedPayload.gateways[0].rssi || 0;
        decoded.LORA_SNR = normalizedPayload.gateways[0].snr || 0;
    } else {
        decoded.LORA_RSSI = 0;
        decoded.LORA_SNR = 0;
    }

    decoded.LORA_DATARATE = normalizedPayload.spreading_factor 
                        || normalizedPayload.data_rate 
                        || (normalizedPayload.networks && normalizedPayload.networks.lora && normalizedPayload.networks.lora.dr)
                        || "unknown";
    
    } catch (error) {
    console.log('LoRa property parsing error:', error);
    decoded.LORA_RSSI = 0;
    decoded.LORA_SNR = 0;
    decoded.LORA_DATARATE = "unknown";
    }

    return [
        { field: "BAT", value: decoded.BAT, timestamp: time },
        { field: "WATER_DEPTH", value: decoded.WATER_DEPTH, timestamp: time },
        { field: "WATER_PRESSURE", value: decoded.WATER_PRESSURE, timestamp: time },
        { field: "INTERVAL", value: decoded.INTERVAL, timestamp: time },
        { field: "LORA_RSSI", value: decoded.LORA_RSSI, timestamp: time },
        { field: "LORA_SNR", value: decoded.LORA_SNR, timestamp: time },
        { field: "LORA_DATARATE", value: decoded.LORA_DATARATE, timestamp: time }
    ];
}
/*
If the user needs to calibrate, we recommended calibration procedure:

1. Zero Calibration
   Measure the current when water depth = 0m.

   Example:
       zero_mA = 4.12mA

2. Span Calibration
   Measure the current at a known water depth.

   Example:
       depth = 5m
       span_mA = 19.85mA

3. Use the calibrated formula:

depth =
    ((current_mA - zero_mA) /
    (span_mA - zero_mA)) * max_depth

Example:

var zero_mA   = 4.12;
var span_mA   = 19.85;
var max_depth = 5.0;

var Water_depth =
    ((current_mA - zero_mA) /
    (span_mA - zero_mA)) * max_depth;

This calibration can significantly reduce:
- ADC error
- resistor error
- sensor zero drift
- full-scale deviation
*/




// .................................................................................................
// .................................................................................................
// .................................................................................................
// Downlink.........................................................................................
// .................................................................................................
// .................................................................................................
// .................................................................................................
// Encoder function to be used in the Datacake console for downlink payload

// fPort 1   modification interval
// Encoder function for port 1
/**
 * String.prototype.repeat() polyfill
 */
if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        if (this == null) throw new TypeError("can't convert " + this + " to object");
        var str = '' + this;
        count = +count;
        if (count < 0 || count === Infinity) throw new RangeError("repeat count must be non-negative and finite");
        if (count === 0) return '';
        var result = '';
        while (count-- > 0) {
            result += str;
        }
        return result;
    };
}

/**
 * String.prototype.padStart() polyfill
 */
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(padString || ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

function Encoder(measurements, port) {
    var interval = measurements["SENDING_TIME_INTERVAL"].value * 60;

    return interval
        .toString(16)
        .padStart(8, '0')
        .match(/.{2}/g)
        .map(function(f) {
            return parseInt(f, 16);
        });
}