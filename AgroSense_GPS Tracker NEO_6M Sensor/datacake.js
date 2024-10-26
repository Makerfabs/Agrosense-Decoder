function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1];
    var batteryLevel = input.bytes[2] / 10.0;
    var gSensorState = input.bytes[3];
    var gpsStatus = input.bytes[4];
    var gsensor_onoff = input.bytes[22];
    var gsensor_sensitivity = input.bytes[23];

    var year, month, date, hour, minute, second, latitude, nsHemi, longitude, ewHemi;

    if (gpsStatus != 0) {
        year = input.bytes[5] * 256 + input.bytes[6];
        month = input.bytes[7];
        date = input.bytes[8];
        hour = input.bytes[9];
        minute = input.bytes[10];
        second = input.bytes[11];

        latitude = (input.bytes[12] * 16777216 + input.bytes[13] * 65536 + input.bytes[14] * 256 + input.bytes[15]) / 100000;
        nsHemi = input.bytes[16] === 0 ? 'N' : 'S';

        longitude = (input.bytes[17] * 16777216 + input.bytes[18] * 65536 + input.bytes[19] * 256 + input.bytes[20]) / 100000;
        ewHemi = input.bytes[21] === 0 ? 'E' : 'W';
    } else {
        year = 0;
        month = 0;
        date = 0;
        hour = 0;
        minute = 0;
        second = 0;

        latitude = 0;
        nsHemi = 'N';

        longitude = 0;
        ewHemi = 'E';
    }

    // Correct hemisphere values based on actual GPS data
    nsHemi = latitude < 0 ? 'S' : 'N';
    ewHemi = longitude < 0 ? 'W' : 'E';

    // Convert latitude and longitude to positive values if necessary
    latitude = Math.abs(latitude);
    longitude = Math.abs(longitude);

    var decoded = {
        batteryLevel: batteryLevel,
        gSensorState: gSensorState,
        latitude: latitude,
        longitude: longitude,
        gsensor_onoff: gsensor_onoff,
        gsensor_sensitivity: gsensor_sensitivity
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
        { field: "batteryLevel", value: decoded.batteryLevel },
        { field: "gSensorState", value: decoded.gSensorState },
        { field: "latitude", value: decoded.latitude },
        { field: "longitude", value: decoded.longitude },
        { field: "gsensor_onoff", value: decoded.gsensor_onoff },
        { field: "gsensor_sensitivity", value: decoded.gsensor_sensitivity },
        { field: "lora_rssi", value: decoded.lora_rssi },
        { field: "lora_snr", value: decoded.lora_snr },
        { field: "lora_datarate", value: decoded.lora_datarate }
    ];
}
