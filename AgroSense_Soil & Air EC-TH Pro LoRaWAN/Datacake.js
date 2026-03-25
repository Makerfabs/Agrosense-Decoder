
// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var Num = input.bytes[0] * 256 + input.bytes[1]
    var Bat = input.bytes[2] / 10.0 //V

    var Soil_temp = (input.bytes[3] * 256 + input.bytes[4])
    
    if (Soil_temp >= 0x8000) {
    Soil_temp -= 0x10000;
    }
    Soil_temp= Soil_temp/100 //°C

    var Soil_RH = input.bytes[5] * 256 + input.bytes[6] //ADC value

    // 1270 corresponds to the ADC value in air, and 815 corresponds to the ADC value in water. 
    // Based on this, the ADC can be converted into a percentage. 
    // Since water quality varies from place to place, customers need to modify these values themselves.
    var Soil_RH_Percentage=(1270-Soil_RH)*100/(1270-815) //%

    var Soil_EC = (input.bytes[7] * 16777216 + input.bytes[8] * 65536 + input.bytes[9] * 256 + input.bytes[10]) / 100.0 //µS/cm
    var Air_temp = (input.bytes[11] * 256 + input.bytes[12])

    if (Air_temp >= 0x8000) {
    Air_temp -= 0x10000;
    }
    Air_temp = Air_temp / 10.0 //°C
    
    var Air_humi = (input.bytes[13] * 256 + input.bytes[14]) / 10.0 //%
    var interval = (input.bytes[15] * 16777216 + input.bytes[16] * 65536 + input.bytes[17] * 256 + input.bytes[18]) / 1000.0 //S

    var time = null;

    if(input.bytes.length >= 23){
        time = (input.bytes[19] * 16777216 +
                input.bytes[20] * 65536 +
                input.bytes[21] * 256 +
                input.bytes[22]);
    }

    /*
    Note:
    The last bit (the 23 bytes for firmware with a timestamp, and the 19 bytes for firmware without a timestamp)
    is the system local data upload flag; when received by the platform, it is always set to 0 (and can be ignored).
    */
   
    var decoded = 
    {
        //NUM:Num,
        BAT:Bat,        
        SOIL_TEMP:Soil_temp,
        //SOIL_RH:Soil_RH,
        SOIL_RH_PERCENTAGE:Soil_RH_Percentage,
        SOIL_EC:Soil_EC,
        AIR_TEMP:Air_temp,
        AIR_HUMI:Air_humi,  
        INTERVAL:interval,
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

    if(time !== null){
        return [
            { field: "BAT", value: decoded.bat, timestamp: time },
            { field: "SOIL_TEMP", value: decoded.Soil_temp, timestamp: time },
            { field: "SOIL_RH_PERCENTAGE", value: decoded.Soil_RH_Percentage, timestamp: time },
            { field: "SOIL_EC", value: decoded.Soil_EC, timestamp: time },
            { field: "AIR_TEMP", value: decoded.Air_temp, timestamp: time },
            { field: "AIR_HUMI", value: decoded.Air_humi, timestamp: time },
            { field: "LORA_RSSI", value: decoded.lora_rssi },
            { field: "LORA_SNR", value: decoded.lora_snr },
            { field: "LORA_DATARATE", value: decoded.lora_datarate }
        ];
    }
    else{
        return [
            { field: "BAT", value: decoded.bat },
            { field: "SOIL_TEMP", value: decoded.Soil_temp },
            { field: "SOIL_RH_PERCENTAGE", value: decoded.Soil_RH_Percentage },
            { field: "SOIL_EC", value: decoded.Soil_EC },
            { field: "AIR_TEMP", value: decoded.Air_temp },
            { field: "AIR_HUMI", value: decoded.Air_humi },
            { field: "LORA_RSSI", value: decoded.lora_rssi },
            { field: "LORA_SNR", value: decoded.lora_snr },
            { field: "LORA_DATARATE", value: decoded.lora_datarate }
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

