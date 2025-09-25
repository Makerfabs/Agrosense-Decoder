
// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var Num = input.bytes[0] * 256 + input.bytes[1]
    var Bat = input.bytes[2] / 10.0 //V
    var Soil_temp = (input.bytes[3] * 256 + input.bytes[4]) / 100.0 //°C
    var Soil_RH = input.bytes[5] * 256 + input.bytes[6] //ADC value
    var Soil_EC = (input.bytes[7] * 256 + input.bytes[8]) / 100.0 //µS/cm
    var Air_temp = (input.bytes[9] * 256 + input.bytes[10]) / 10.0 //°C
    var Air_humi = (input.bytes[11] * 256 + input.bytes[12]) / 10.0 //%
    var interval = (input.bytes[13] * 16777216 + input.bytes[14] * 65536 + input.bytes[15] * 256 + input.bytes[16]) / 1000.0 //S

    var decoded = 
    {
        NUM:Num
        BAT:Bat        
        SOIL_TEMP:Soil_temp
        SOIL_RH:Soil_RH
        SOIL_EC:Soil_EC
        AIR_TEMP:Air_temp
        AIR_HUMI:Air_humi
        INTERVAL:interval
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

return decoded;
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

