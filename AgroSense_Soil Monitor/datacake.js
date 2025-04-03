// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    // var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0
    var Significant = input.bytes[3]
    var humi = (input.bytes[4] * 256 + input.bytes[5]) / 10.0

    var temp = input.bytes[6] * 256 + input.bytes[7]
    if (temp >= 0x8000) {
        temp -= 0x10000;
    }
    temp = temp / 10.0
   var ec = (input.bytes[8] * 256 + input.bytes[9])
    var ph = (input.bytes[10] * 256 + input.bytes[11]) / 10.0
    var interval = (input.bytes[12] * 16777216 + input.bytes[13] * 65536 + input.bytes[14] * 256 + input.bytes[15]) / 1000

    var decoded = {
        bat: bat,
        Significant: Significant,
        humi: humi,
        temp: temp,
        ec: ec,
	ph: ph,
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

    if (Significant) {
        return [
            { field: "bat", value: decoded.bat },
            { field: "humi", value: decoded.humi },
            { field: "temp", value: decoded.temp },
	    { field: "ec", value: decoded.ec },
	    { field: "ph", value: decoded.ph },
            { field: "interval", value: decoded.interval },
            { field: "lora_rssi", value: decoded.lora_rssi },
            { field: "lora_snr", value: decoded.lora_snr },
            { field: "lora_datarate", value: decoded.lora_datarate }
        ];
    }

    else {
        return [
            { field: "Significant", value: "data invalid" },
        ];
    }     
}


// .................................................................................................
// .................................................................................................
// .................................................................................................

// Downlink

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