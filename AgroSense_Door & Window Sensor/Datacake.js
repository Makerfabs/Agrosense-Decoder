function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2] / 10.0
    var Door_open_flag = input.bytes[3]
    var Door_open_cnt = input.bytes[4] * 256 + input.bytes[5]
    var Door_open_last_time =  input.bytes[6] * 16777216 + input.bytes[7] * 65536 + input.bytes[8] * 256 + input.bytes[9]       //s
    var Door_open_all_time =  input.bytes[10] * 16777216 + input.bytes[11] * 65536 + input.bytes[12] * 256 + input.bytes[13]    //s
    var interval = (input.bytes[14] * 16777216 + input.bytes[15] * 65536 + input.bytes[16] * 256 + input.bytes[17]) / 1000      //s
    var time = (input.bytes[18]*16777216 + input.bytes[19]*65536 + input.bytes[20]*256 + input.bytes[21])
    
    var decoded = 
    {
        NUM:num,
        BAT:bat,
        DOOR_OPEN_FLAG:Door_open_flag,
        DOOR_OPEN_CNT:Door_open_cnt,
        DOOR_OPEN_LAST_TIME:Door_open_last_time,
        DOOR_OPEN_ALL_TIME:Door_open_all_time,  
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
        { field: "DOOR_OPEN_FLAG", value: decoded.DOOR_OPEN_FLAG, timestamp: time },
        { field: "DOOR_OPEN_CNT", value: decoded.DOOR_OPEN_CNT, timestamp: time },
        { field: "DOOR_OPEN_LAST_TIME", value: decoded.DOOR_OPEN_LAST_TIME, timestamp: time },
        { field: "DOOR_OPEN_ALL_TIME", value: decoded.DOOR_OPEN_ALL_TIME, timestamp: time },
        { field: "INTERVAL", value: decoded.INTERVAL, timestamp: time },
        { field: "LORA_RSSI", value: decoded.LORA_RSSI, timestamp: time },
        { field: "LORA_SNR", value: decoded.LORA_SNR, timestamp: time },
        { field: "LORA_DATARATE", value: decoded.LORA_DATARATE, timestamp: time }
    ];
}
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