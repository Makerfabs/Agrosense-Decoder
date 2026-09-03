function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1];
    var Relay_1 = input.bytes[2];
    var Relay_2 = input.bytes[3];
    var Relay_3 = input.bytes[4];
    var Relay_4 = input.bytes[5];
    
    var temperature = input.bytes[6] * 256 + input.bytes[7];
    if (temperature >= 0x8000) {
        temperature -= 0x10000;
    }
    temperature = temperature / 100.0;
    var interval = (
        input.bytes[8] * 16777216 +
        input.bytes[9] * 65536 +
        input.bytes[10] * 256 +
        input.bytes[11]
    ) / 1000;

    var time = (input.bytes[12]* 16777216 + input.bytes[13]* 65536 + input.bytes[14] * 256 + input.bytes[15]); //interval when valve is open

    var decoded = 
    {
        NUM:num,
        Relay_1:Relay_1,
        Relay_2:Relay_2,
        Relay_3:Relay_3,
        Relay_4:Relay_4,
        temperature:temperature,
        interval:interval,
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
        { field: "Relay_1", value: decoded.Relay_1, timestamp: time },
        { field: "Relay_2", value: decoded.Relay_2, timestamp: time },
        { field: "Relay_3", value: decoded.Relay_3, timestamp: time },
        { field: "Relay_4", value: decoded.Relay_4, timestamp: time },
        { field: "temperature", value: decoded.temperature, timestamp: time },
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