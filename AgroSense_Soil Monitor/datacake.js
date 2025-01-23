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
   var ce = (input.bytes[8] * 256 + input.bytes[9]) / 10.0
    var ph = (input.bytes[10] * 256 + input.bytes[11]) / 10.0
    var interval = (input.bytes[12] * 16777216 + input.bytes[13] * 65536 + input.bytes[14] * 256 + input.bytes[15]) / 1000

    var decoded = {
        bat: bat,
        Significant: Significant,
        humi: humi,
        temp: temp,
        ce: ce,
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
	    { field: "ce", value: decoded.ce },
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
function Encoder(measurements, port) {
    var interval = measurements["SENDING_TIME_INTERVAL"].value * 60;
    if (interval < 300) {
        interval = 300;
        console.log("Interval < 300 Seconds / 5 Minutes not allowed!");
    }
    // Convert to hexadecimal only from interval
    return interval.toString(16).padStart(4, '0').match(/.{2}/g).map(function(f) {return parseInt(f, 16)});
}
/**
 * String.prototype.padStart() polyfill
 * https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 */
if (!String.prototype.padStart) {
	String.prototype.padStart = function padStart(targetLength,padString) {
		targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
		padString = String((typeof padString !== 'undefined' ? padString : ' '));
		if (this.length > targetLength) {
			return String(this);
		}
		else {
			targetLength = targetLength-this.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
			}
			return padString.slice(0,targetLength) + String(this);
		}
	};
}