// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    // var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0;
    var CO2 = input.bytes[3] * 256 + input.bytes[4];
    var interval = (input.bytes[7] * 16777216 + input.bytes[8] * 65536 + input.bytes[9] * 256 + input.bytes[10]) / 1000;

    // No timestamp by default
    var time = null;

    // Check if there is a timestamp
    if (input.bytes.length >= 15) {
        time = (input.bytes[11] * 16777216 +
                input.bytes[12] * 65536 +
                input.bytes[13] * 256 +
                input.bytes[14]);
    }

    /*
    Note:
    The last byte (the 13 bytes for firmware with a timestamp, and the 9 bytes for firmware without a timestamp)
    is the system local data upload flag; when received by the platform, it is always set to 0 (and can be ignored).
    */
   
    var decoded = {
        bat: bat,
        CO2: CO2,
        interval: interval,
    };
    
    // Test for LoRa properties in normalizedPayload
    try {
        console.log('normalizedPayload:', normalizedPayload);  // Log to check normalizedPayload structure

        decoded.lora_rssi = 
            (normalizedPayload.gateways && Array.isArray(normalizedPayload.gateways) && normalizedPayload.gateways.length > 0 && normalizedPayload.gateways[0].rssi) || 0;
        decoded.lora_snr = 
            (normalizedPayload.gateways && Array.isArray(normalizedPayload.gateways) && normalizedPayload.gateways.length > 0 && normalizedPayload.gateways[0].snr) || 0;
        decoded.lora_datarate = normalizedPayload.data_rate || 'not retrievable';
    } catch (error) {
        console.log('Error occurred while decoding LoRa properties: ' + error);
    }

    if(time != null){
        return [
            { field: "bat", value: decoded.bat, timestamp: time },
            { field: "CO2", value: decoded.CO2, timestamp: time },
            { field: "interval", value: decoded.interval, timestamp: time },
            { field: "lora_rssi", value: decoded.lora_rssi },
            { field: "lora_snr", value: decoded.lora_snr },
            { field: "lora_datarate", value: decoded.lora_datarate }
        ];
    }
    else{
        return [
            { field: "bat", value: decoded.bat },
            { field: "CO2", value: decoded.CO2 },
            { field: "interval", value: decoded.interval },
            { field: "lora_rssi", value: decoded.lora_rssi },
            { field: "lora_snr", value: decoded.lora_snr },
            { field: "lora_datarate", value: decoded.lora_datarate }
        ];
    }
    
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

// fPort 3   Adjust CO2 Preheating Time (1-5mins)
function Encoder(measurements, port) {

    var preheat = measurements["CO2_PREHEAT_TIME"].value * 60;

    // limit range 1–5 minutes
    if (preheat < 60) {
        preheat = 60;
    }

    if (preheat > 300) {
        preheat = 300;
    }

    // convert to 2 bytes
    var high = (preheat >> 8) & 0xFF;
    var low  = preheat & 0xFF;

    return [high, low];
}