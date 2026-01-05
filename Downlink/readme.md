## Downlink

AgroSense devices support adjusting the time interval using downlink. Here's a guide to using downlink at TTN and Datacake.

|Parameter|Unit|Fport|Time interval range|
|-|-|-|-|
|Data transmission interval|**seconds**|**1**|5mins to 24 hours|

Our devices can only accept downlink payloads in **hexadecimal format**. If the IoT platform you are using directly supports hexadecimal input, you only need to enter the hexadecimal value of the time interval. Please note that the unit must be **seconds**.

For example: TTN Bytes Mode

```
 300 s → 012C 

 600 s → 0258 

3600 s → 0E10
```

If the IoT platform you are using does not support sending hexadecimal data directly, an appropriate payload encoding (parser/encoder) must be implemented on that platform to convert user-defined parameters into the required hexadecimal format before transmission.

For example: TTN JSON Mode

If your JSON data is defined in minutes, such as:

```
{
  "minutes": 5
}
```

So what your encoder needs to do is convert minutes into seconds and then convert those into the corresponding hexadecimal values.

```
function Encoder(input) {
    var minutes = input.minutes;

    // Convert minutes to seconds
    var seconds = minutes * 60;

    // Enforce minimum interval: 300 seconds(5mins)
    if (seconds < 300) {
        seconds = 300;
    }

    // Convert seconds into the corresponding hexadecimal values
    var payload = [
        (seconds >> 24) & 0xFF,
        (seconds >> 16) & 0xFF,
        (seconds >> 8) & 0xFF,
        seconds & 0xFF
    ];

    return payload;
}

```



### TTN

The steps for TTN are as follows:

- Click “Payload formatters-->Downlink” and follow the steps.

Formatter code you can find in [Github](https://github.com/Makerfabs/Agrosense-Decoder/blob/main/Downlink/TTN.js).

![ttn downlink.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_05_06_0.png)

- Click “Save changes”.

![10、click save changes.jpg](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_11_40_0.jpg)

- Click “Messaging-->Schedule downlink”.

- Select **FPort 1**.

**Note**: If you select **JSON**, you must use this format:

```
{
  "minutes": 5
}
```

![downlink1.png](https://www.makerfabs.com/image/wiki_image/2025-10-15_09_55_28_0.png)

**Note**: If you select **Bytes**, you need to enter the hexadecimal value of the time interval, for example:

```
 300 s → 012C 

 600 s → 0258 

3600 s → 0E10
```

![downlink.png](https://www.makerfabs.com/image/wiki_image/2025-10-15_10_04_20_0.png)

- The modified interval will be updated after the next data upload.



### Datacake

The steps for Datacake are as follows:

- Click “Configuration-->Fields-->+Add Field”.

![Sending Time Interval.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_17_58_36_0.png)

- Click ”Downlink-->Add Downlink”.
![downlink.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_17_59_11_0.png)

Enter name、description、fields used and payload encoder respectively.

Name: Set User-Defined Sending Time Interval.

Description: Set the user-defined report transmission interval and store it in the configuration variable.(5Min-1440Min).

Payload Encoder: copy in [Github](https://github.com/Makerfabs/Agrosense-Decoder/tree/main/Downlink/datacake.js).

![downlink set.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_00_33_0.png)

- Click “Dashboard-->switch-->+ Add Widget”.

![15、add widget.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_10_36_0.png)

- Select “Downlink” and setting as follow image.

![downlink basic.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_01_13_0.png)

![downlink data.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_01_20_0.png)

- Click the switch to save, and you can click to change your time Interval.

![time.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_01_44_0.png)

![time set.png](https://www.makerfabs.com/image/wiki_image/2024-10-14_18_02_01_0.png)