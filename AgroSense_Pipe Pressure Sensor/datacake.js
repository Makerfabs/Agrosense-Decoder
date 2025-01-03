// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    // var num = input.bytes[0] * 256 + input.bytes[1];
    var bat = input.bytes[2] / 10.0;
     var Volt_Pressure = (input.bytes[3] * 256 + input.bytes[4]) / 1000.0
    var Pipe_Pressure = (Volt_Pressure-0.483)*250  //KPa
        Pipe_Pressure = Math.round(Pipe_Pressure * 1000) / 1000;  // keep three decimal places
    var time_interval = (input.bytes[13] * 16777216 + input.bytes[14] * 65536 + input.bytes[15] * 256 + input.bytes[16]) / 1000.0//S

    var decoded = {
        bat: bat,
       Pipe_Pressure: Pipe_Pressure,
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
        { field: " Pipe_Pressure", value: decoded. Pipe_Pressure },
        { field: "lora_rssi", value: decoded.lora_rssi },
        { field: "lora_snr", value: decoded.lora_snr },
        { field: "lora_datarate", value: decoded.lora_datarate }
    ];
}


// .................................................................................................
// .................................................................................................
// .................................................................................................

/*
Downlink

The downlink has two functions: 
the first is the modification interval for Fport1,
the second is the amount of uploaded local latest log data for Fport5;
*/

// Encoder function for Fport 1
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


