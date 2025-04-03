// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    // var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0;
    var ADC1 = (input.bytes[3] * 256 + input.bytes[4]) / 1000.0 //V
    var ADC2 = (input.bytes[5] * 256 + input.bytes[6]) / 1000.0 //V
    var ADC3 = (input.bytes[7] * 256 + input.bytes[8]) / 1000.0 //V
    var ADC4 = (input.bytes[9] * 256 + input.bytes[10]) / 1000.0 //V
    var Differentialbits = (input.bytes[11] * 256 + input.bytes[12]) / 1000.0 //V
    var time_interval = (input.bytes[13] * 16777216 + input.bytes[14] * 65536 + input.bytes[15] * 256 + input.bytes[16]) / 1000.0//S

    var decoded = {
        bat: bat,
        ADC1: ADC1
        ADC2: ADC2
        ADC3: ADC3
        ADC4: ADC4
        Differentialbits: Differentialbits
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

    return [
        { field: "bat", value: decoded.bat },
        { field: "ADC1", value: decoded.ADC1 },
        { field: "ADC2", value: decoded.ADC2 },
        { field: "ADC3", value: decoded.ADC3 },
        { field: "ADC4", value: decoded.ADC4 },
        { field: " Differentialbits", value: decoded. Differentialbits },
        { field: "lora_rssi", value: decoded.lora_rssi },
        { field: "lora_snr", value: decoded.lora_snr },
        { field: "lora_datarate", value: decoded.lora_datarate }
    ];
}


// .................................................................................................
// .................................................................................................
// .................................................................................................

/* 
Downlink:

The downlink has four functions: 
the first is the modification interval for Fport1; 
the second is the amount of uploaded local latest log data for Fport5;
the third is to turn on or off the corresponding ADC channel for Fport6 (the default is all on); 
the fourth is to set the third and fourth channels as differential inputs for Fport7;

Fport6 sets the truth table：
------------------------------------------------------
|    Differentialbits	ADC4	ADC3	ADC2	ADC1 |  
|           0            0       0       0       1   |  0x01 =enable the ADC1 channel
|           0            0       0       1       0   |  0x02 =enable the ADC2 channel
|           0            0       1       0       0   |  0x04 =enable the ADC3 channel
|           0            1       0       0       0   |  0x08 =enable the ADC4 channel
|           1            0       0       0       0   |  0x10 =enable the Differentialbits  channel，At this point, FPort7 must be set to 1
|           0            0       0       0       0   |  0x00 =Turn off all channels
|           1            1       1       1       1   |  0x1F =enable all channels
------------------------------------------------------
*/

// Encoder function for Fport 1
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


