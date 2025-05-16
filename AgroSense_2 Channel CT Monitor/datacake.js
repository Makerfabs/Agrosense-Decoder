
// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1]
    var ADC_1 =  (bytes[2] * 256 + bytes[3]) / 10.0
    var ADC_2 =  (bytes[4] * 256 + bytes[5]) / 10.0
    var CT1_ADC = (bytes[6] * 256 + bytes[7]) / 1000.0   //This voltage needs to be combined with the sensor's ratio
    var CT2_ADC = (bytes[8] * 256 + bytes[9]) / 1000.0   //This voltage needs to be combined with the sensor's ratio
  
  var CT1 = CT1_ADC*100 //if the sensor is 60A/1V, multiply by 60; if it's 100A/1V, multiply by 100; if it's 300A/1V, multiply by 300.
  var CT2 = CT2_ADC*100 //if the sensor is 60A/1V, multiply by 60; if it's 100A/1V, multiply by 100; if it's 300A/1V, multiply by 300.

  var humidity = (bytes[10] * 256 + bytes[11]) / 10.0;
  var temperature = bytes[12] * 256 + bytes[13];
  if (temperature >= 0x8000) {
    temperature -= 0x10000;
  }
  temperature = temperature / 10.0;
    
    
    var interval = (input.bytes[14]* 16777216 + input.bytes[15]* 65536 + input.bytes[16] * 256 + input.bytes[17]) / 1000

    var decoded = 
    {
        ADC_1:ADC_1,
        ADC_2:ADC_2,
        CT1:CT1,
        CT2:CT2,
	    temperature:temperature,
	    humidity:humidity,
	    interval:interval,
    };

    // Test for LoRa properties in normalizedPayload
 try {

  if (normalizedPayload.gateways && normalizedPayload.gateways.length > 0) {
    decoded.lora_rssi = normalizedPayload.gateways[0].rssi || 0;
    decoded.lora_snr = normalizedPayload.gateways[0].snr || 0;
  } else {
    decoded.lora_rssi = 0;
    decoded.lora_snr = 0;
  }


  decoded.lora_datarate = normalizedPayload.spreading_factor 
                       || normalizedPayload.data_rate 
                       || (normalizedPayload.networks && normalizedPayload.networks.lora && normalizedPayload.networks.lora.dr)
                       || "unknown";
  
} catch (error) {
  console.log('LoRa property parsing error:', error);
  decoded.lora_rssi = 0;
  decoded.lora_snr = 0;
  decoded.lora_datarate = "unknown";
}

return [
  { field: "ADC_1", value: decoded.ADC_1 },
  { field: "ADC_2", value: decoded.ADC_2 },
  { field: "CT1", value: decoded.CT1 },
  { field: "CT2", value: decoded.CT2 },
  { field: "humidity", value: decoded.humidity },
  { field: "temperature", value: decoded.temperature },
  { field: "interval", value: decoded.interval },
  { field: "lora_rssi", value: decoded.lora_rssi },
  { field: "lora_snr", value: decoded.lora_snr },
  { field: "lora_datarate", value: decoded.lora_datarate },
];
}

