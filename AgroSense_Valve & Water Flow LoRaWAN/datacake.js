
// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1]
    var bat = input.bytes[2]/10
    var valve = input.bytes[3] //Valve state   :0--OFF; 1--ON
    var flow_pulse_1s_diff = input.bytes[4] * 256 + input.bytes[5] //Pulse changes within 1 second
    var flow_velocity = flow_pulse_1s_diff*60/450;  // L/min
    var flow_rate = flow_pulse_1s_diff/450; //L
    var Valve_on_all_time =  input.bytes[6]* 16777216 + input.bytes[7]* 65536 + input.bytes[8] * 256 + input.bytes[9] //Time from opening to closing of the latest valve
    var interval = (input.bytes[10]* 16777216 + input.bytes[11]* 65536 + input.bytes[12] * 256 + input.bytes[13]) / 1000 //interval when valve is open

    var decoded = 
    {
        NUM:num
        BAT:bat        
        VALVE:valve
        //FLOW_PULSE_1S_DIFF:flow_pulse_1s_diff
        FLOW_VELOCITY:flow_velocity
        FLOW_RATE:flow_rate
        VALVE_ON_ALL_TIME:Valve_on_all_time
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

// fPort 6   Valve control   : 0-OFF; 1-ON
// Encoder function for port 6
function Encoder(measurements, port) {

var payload = [];
  
  var valveStatus = measurements["VALVE_ON_OFF"].value;
  payload.push(valveStatus);

  return payload;
}
