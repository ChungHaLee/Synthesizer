/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/haptic.js":
/*!**************************!*\
  !*** ./src/js/haptic.js ***!
  \**************************/
/***/ (() => {

eval("\n// Create an instance\nlet sending_delay = 0.5;\nconst delay_value = 0.12;\n\nlet last_time = 0;\nvar intervaltester;\nlet current_timer = 0;\nlet timeCheckerTerm = 7;\nlet pre_resultcheck = 0.0;\n\nconst beatAmp = 50;\nconst beatFreq = 225;\n\n\nlet freq = 200;\nlet amp = 30;\nlet attack = 0.4;\nlet decay = 0.33;\nlet sustain = 7;\n\nlet _IntensityArray = new Int16Array([100, 0]);\nlet intensityArrayIndex = 0\nlet max_index = 16;\nconst Frequency_Field_size = 256;\n\nconst mappingType = [\"Melody\", \"Beat\"];\nlet current_type = 0;\nlet envelopTimer = 100;\nlet user_num = 16;\nlet current_mode = 0;\n\nlet haptic_recode_activate = false;\n\nlet freq_slider = document.querySelector('[data-action=\"update_frequency\"]');\nfreq_slider.addEventListener('input', event => {\n    freq = parseInt(Number(freq_slider.value) * 1.5 + 150);\n    console.log(\"Control frequency : \" + freq + \" Hz\");\n    //console.log(\"mono_freq : \" + mono_freq);\n});\n\nlet amp_slider = document.querySelector('[data-action=\"update_amplitude\"]');\namp_slider.addEventListener('input', event => {\n    amp = parseInt(Number(amp_slider.value) * 0.5);\n    console.log(\"Control amplitude : \" + amp * 2 + \" A\");\n    //console.log(\"mono_amp : \" + mono_amp);\n    _IntensityArray[0] = amp\n});\n\nlet attack_slider = document.querySelector('[data-action=\"update_attack\"]');\nattack_slider.addEventListener('input', event => {\n    attack = Number(attack_slider.value) * 0.009 + 0.1;\n    console.log(\"Control attack : \" + attack );\n    //console.log(\"mono_freq : \" + mono_freq);\n    //_IntensityArray = Envelop_Maker(attack, decay, sustain);\n});\n\nlet decay_slider = document.querySelector('[data-action=\"update_decay\"]');\ndecay_slider.addEventListener('input', event => {\n    decay = Number(decay_slider.value)  * 0.01;\n    console.log(\"Control decay : \" + decay );\n    //_IntensityArray = Envelop_Maker(attack, decay, sustain);\n});\nlet sustain_slider = document.querySelector('[data-action=\"update_sustain\"]');\nsustain_slider.addEventListener('input', event => {\n    sustain = parseInt(Number(sustain_slider.value) * 0.1);\n    console.log(\"Control sustain\" + sustain );\n    //_IntensityArray = Envelop_Maker(attack, decay, sustain);\n});\n\nwindow.onbeforeunload = DisconnectAllDevices\nfunction DisconnectAllDevices(){\n    haptic_devices.clear();\n}\n\nclass HapticArray{              //통신용 블루투스 array 구현 코드\n    constructor() {\n        this.devices = []\n      }\n    \n    add(hapticdevice){\n        this.devices.push(hapticdevice);\n    }\n    clear(){\n        this.devices.forEach(device => {\n            device.disconnect(haptic_listener);\n        });\n        console.log(\"All Device is Disconnected\");\n    }\n    del(id){\n        let index = this.find_index(id)\n        if (index != -1){\n            this.devices[index].disconnect(haptic_listener)\n            this.devices.splice(index, 1);\n            console.log(\"device successfully disconneted\" );\n        }\n    }\n    send(data){\n        this.devices.forEach(device => {\n            device.write(data);\n        });\n    }\n    find_index(id){\n        let fin = -1;\n        let index = 0;\n        this.devices.forEach(device => {\n            if (device.device.id == id){\n                console.log(\"found the device\", index);\n                fin = index\n            }\n            index = index + 1;\n        });\n        if (fin == -1){\n            console.log(\"there is no device in the list\");\n        }\n        return fin;\n    }\n}\nlet haptic_devices = new HapticArray();\n\nclass HapticDevice {\n\n    constructor() {\n      this.device = null;\n      this.onDisconnected = this.onDisconnected.bind(this);\n    }\n    \n    async request() {\n      let options = {\n        \"filters\": [{\n          \"namePrefix\": \"Haptic\"\n        }],\n        \"optionalServices\": [\"6e400001-b5a3-f393-e0a9-e50e24dcca9e\"],\n        \"acceptAllDevices\": false\n      };\n      this.device = await navigator.bluetooth.requestDevice(options);\n      if (!this.device) {\n        throw \"No device selected\";\n      }\n      this.device.addEventListener('gattserverdisconnected', this.onDisconnected);\n    }\n    \n    async connect() {\n      if (!this.device) {\n          Promise.reject('Device is not connected.');\n        return 0\n      }\n      await this.device.gatt.connect();\n      return 1\n    }\n    \n    // write(data) {\n    //   // RX Characteristic (6E400002-B5A3-F393-E0A9-E50E24DCCA9E)\n    //   // Write or Write Without Response\n    //   // Write data to the RX Characteristic to send it on to the UART interface.\n    //   return this.device.gatt.getPrimaryService(\"6e400001-b5a3-f393-e0a9-e50e24dcca9e\")\n    //   .then(service => service.getCharacteristic(\"6e400002-b5a3-f393-e0a9-e50e24dcca9e\"))\n    //   .then(characteristic => characteristic.writeValue(data))\n    //   .catch(error => {\n    //     console.log('Argh! ' + error);\n    //     sending_delay = 1.2;\n    //   });\n    // }\n    write(data) {\n        // RX Characteristic (6E400002-B5A3-F393-E0A9-E50E24DCCA9E)\n        // Write or Write Without Response\n        // Write data to the RX Characteristic to send it on to the UART interface.\n  \n        this.device.gatt.getPrimaryService(\"6e400001-b5a3-f393-e0a9-e50e24dcca9e\")\n        .then(service => service.getCharacteristic(\"6e400003-b5a3-f393-e0a9-e50e24dcca9e\"))\n        .then(characteristic => {\n          //console.log('---!---');\n          //console.log(\"Bluetooth Notify Chracteristic Value : \", characteristic.value);\n          //console.log(characteristic.oncharacteristicvaluechanged);\n          //console.log('---?---');\n        });\n  \n        return this.device.gatt.getPrimaryService(\"6e400001-b5a3-f393-e0a9-e50e24dcca9e\")\n        .then(service => service.getCharacteristic(\"6e400002-b5a3-f393-e0a9-e50e24dcca9e\"))\n        .then(characteristic => {characteristic.writeValue(data)\n          //console.log(\"Bluetooth Write Chracteristic Value : \",characteristic.value);\n        })\n        .catch(error => {\n          console.log('Argh! ' + error);\n          SendHapticData(0,0);\n        });\n    }\n    async startNotifications(listener) {\n      // TX Characteristic (6E400003-B5A3-F393-E0A9-E50E24DCCA9E)\n      // Notify\n      // Enable notifications for the TX Characteristic to receive data from the application. The application transmits all data that is received over UART as notifications.\n      const service = await this.device.gatt.getPrimaryService(\"6e400001-b5a3-f393-e0a9-e50e24dcca9e\");\n      const characteristic = await service.getCharacteristic(\"6e400003-b5a3-f393-e0a9-e50e24dcca9e\");\n      await characteristic.startNotifications();\n      characteristic.addEventListener('characteristicvaluechanged', listener);\n    }\n  \n    async stopNotifications(listener) {\n        const service = await this.device.gatt.getPrimaryService(\"6e400001-b5a3-f393-e0a9-e50e24dcca9e\");\n        const characteristic = await service.getCharacteristic(\"6e400003-b5a3-f393-e0a9-e50e24dcca9e\");\n        await characteristic.stopNotifications();\n        characteristic.removeEventListener('characteristicvaluechanged', listener);\n    }\n  \n    async disconnect(listener) {\n      if (!this.device) {\n        return Promise.reject('Device is not connected.');\n      }\n      await this.stopNotifications(listener);\n      this.device.gatt.disconnect();\n\n    }\n  \n    onDisconnected() {\n      console.log('Device is disconnected.');\n      console.log('> Name:             ' + this.device.name);\n      console.log('> Id:               ' + this.device.id);\n      console.log('> Connected:        ' + this.device.gatt.connected);\n    }\n}\nfunction onebyte_to_twobyte_int(high, low){     // 통신 데이터가 byte 단위로 가능하기 때문에 이를 변환해주는 코드들(수정할 필요는 없음)\n    let tmp = (((high & 0xff) << 8) | (low & 0xff));\n    return tmp;\n}\nfunction twobyte_int_to_onebyte(origin){    \n    let high = ((origin >> 8) & 0xff);\n    let low = origin & 0xff;\n    return [high, low];\n}\nfunction onebyte_to_fourbyte_float(origin){\n    let buf = new ArrayBuffer(4);\n    let view = new DataView(buf);\n    origin.forEach(function (b, i) {\n        view.setInt8(i, b);\n    });\n    return view.getFloat32(0);\n}\nfunction fourbyte_float_to_onebyte(origin){\n    let high = ((origin >> 8) & 0xff);\n    let low = origin & 0xff;\n    return high, low;\n}\n// function haptic_pattern_gen(){  // haptic code\n//     let fftsize = wavesurfer.backend.analyser.frequencyBinCount;\n//     let _freq = 1;\n//     let _index = 0;\n//     let ampArray = new Float32Array(fftsize);\n//     let dataArray = [0, 0];\n//     wavesurfer.backend.analyser.getFloatTimeDomainData(ampArray);\n//     for (let i = 0;i < fftsize; i++){\n//         if (ampArray[i] > 0.01) {\n//             dataArray.push(ampArray[i]);\n//         }\n//     }\n//     let resultcheck = Math.abs(dataArray.reduce(function add(sum, currvalure){ return sum + Math.max(currvalure,0);}, 0));\n    \n//     if(current_type == 1){\n//         if(resultcheck > pre_resultcheck * 1.4){\n//             pre_resultcheck = 0.0 + resultcheck;\n//             envelopTimer = 0;\n//             return Envelope_Haptic(envelopTimer);\n//         }\n//         else{\n//             pre_resultcheck = 0.0 + resultcheck;\n//             envelopTimer += 1;\n//             return Envelope_Haptic(envelopTimer);\n//         }\n//     }\n    \n//     else{\n//         dataArray = new Float32Array(dataArray);\n//         _index = dataArray.findIndex(function (item) {return item == Math.max(...ampArray)});\n//         console.log(\"index Check\" + _index);\n//         _freq  = parseInt(_index/dataArray.length * _HzIndex.length);\n//         let _amp = parseInt(resultcheck / Frequency_Field_size * amp * 4) * 2;\n//         if (_amp  >= 100){ _amp = 100; }\n//         if (_freq == NaN || _freq < 0){ _freq = 0; }\n//         return [_HzIndex[_freq], _amp]\n//     }\n// }\n\n\nfunction Envelop_Maker(attack_parameter, decay_parameter, sustain_parameter){\n\n    let TMP_intensityArray = new Int16Array(3 + parseInt(sustain_parameter));\n    let sustainIntensity = parseInt((50 - 45 * attack_parameter) * beatAmp / 50);\n    let decayIndex = parseInt((1 - decay_parameter) * sustain_parameter);\n    TMP_intensityArray[0] = beatAmp * 2;\n    for(let i = 1; i < decayIndex+1; i++){\n        TMP_intensityArray[i] = parseInt((50  - 45 * attack_parameter * i / (decayIndex+1)) * beatAmp / 50) * 2;\n    }\n    for(let i = decayIndex+1; i<= sustain_parameter; i++){\n        TMP_intensityArray[i] = sustainIntensity * 2;\n    }\n    TMP_intensityArray[1 + parseInt(sustain_parameter)] = 0;\n    TMP_intensityArray[2 + parseInt(sustain_parameter)] = 0;\n    console.log(TMP_intensityArray)\n    return TMP_intensityArray;\n}\nfunction Envelope_Haptic(index){\n    if(index < intensityArrayIndex){\n        return [beatFreq, _IntensityArray[index]]\n    }\n    else{\n        return[0, 0]\n    }\n}\n\nfunction SimpleMapping(){\n    current_timer += timeCheckerTerm;\n    if(current_timer >= delay_value * 1000){\n        if(intensityArrayIndex >= _IntensityArray.length){\n            StopMapping()\n        }\n        else{\n            SendHapticData(freq,_IntensityArray[intensityArrayIndex]);\n            intensityArrayIndex += 1;\n            current_timer = 0;\n        }\n    }\n}\n\nfunction StopMapping(){\n    SendHapticData(0, 0);\n    clearInterval(intervaltester);\n}\n\nfunction Haptic_paly(){\n    current_timer = 0;\n    intensityArrayIndex = 0;\n    clearInterval(intervaltester);\n    intervaltester = setInterval(SimpleMapping, timeCheckerTerm);\n}\n\n\nfunction SendHapticData(frequency, amplitude){ // mono_amp : max = 0~1 mono_freq : 0 ~ 500hz  //햅틱 정보를 주는 코드\n    console.log(\"haptic input\", frequency, amplitude);\n    let data_buffer = new ArrayBuffer(19);\n    let view = new Int8Array(data_buffer);\n    view[0] = 36; // STX 0x24\n    view[1] = 2;  // TYPE 0x02\n    \n    let tmp = twobyte_int_to_onebyte(frequency);\n    view[2] = tmp[0];\n    view[3] = tmp[1];\n    tmp = twobyte_int_to_onebyte(amplitude);\n    view[4] = tmp[0];\n    view[5] = tmp[1];\n    view[17] = 13; // ETX 0x0D\n    view[18] = 10; // ETX 0x0A\n\n    //console.log(view);        // OUTPUT data check log\n    //console.log(haptic_devices)\n    haptic_devices.send(view);\n}\nfunction SendCurrentTime(){ // 디바이스에 시계가 추가될 예정이라서 시간 정보를 전달해주는 코드\n    console.log(\"Current Time send check\");\n    let today = new Date();\n    let data_buffer = new ArrayBuffer(19);\n    let view = new Int8Array(data_buffer);\n\n    view[0] = 36; // STX 0x24\n    view[1] = 5; // TYPE 0x05\n\n    view[2] = (today.getFullYear()-2000) & 0xff; // Year 0xEA\n    view[3] = (today.getMonth()+1) & 0xff; // Month\n    view[4] = today.getDate() & 0xff; // Day\n    view[5] = today.getHours() & 0xff; // Hour\n    view[6] = today.getMinutes() & 0xff; // Minute\n    view[7] = today.getSeconds() & 0xff; // Second\n    \n    view[17] = 13; // ETX 0x0D\n    view[18] = 10; // ETX 0x0A\n\n    //console.log(view);\n    haptic_devices.send(view);\n} \n\nfunction haptic_listener(event){    //Haptic 디바이스가  보내는 정보를 Log로 확인용 코드\n    let data_buffer = new ArrayBuffer(19);\n    let view = new Uint8Array(data_buffer);\n    //console.log('Log Check 3');\n    for (let i = 0; i<19;i++){\n        view[i] = event.currentTarget.value.getInt8(i);\n    }\n    console.log(view);\n    console.log(data_buffer);\n    // 0xF1 : battery info\n    // 4byte float\n    if (view[1]==-15){\n        console.log(\"current battery\" + onebyte_to_fourbyte_float([view[2],view[3],view[4],view[5]])/4.2);\n    }\n    // 0xF2 : echo [mono_freq] [mono_amp]\n    // 2byte, 2byte\n    if (view[1]==-14){\n        console.log(\"echo data\");\n    }\n    // 0xF3 : Device info [BLE Connection Interval MIN] [BLE Connection Interval MAX] [Freq MIN] [Freq MAX]\n    // 2byte, 2byte, 2byte, 2byte\n    if (view[1]==-13){\n        console.log(\"Device info\");\n        console.log(\"BLE Connection Interval MIN from\" + onebyte_to_twobyte_int(view[2],view[3]));\n        console.log(\"BLE Connection Interval MAX from\" + onebyte_to_twobyte_int(0,view[4],view[5]));\n        console.log(\"Freq MIN\" + onebyte_to_twobyte_int(view[6],view[7]));\n        console.log(\"Freq MAX\" + onebyte_to_twobyte_int(view[8],view[9]));\n    }\n    // 0xF4 : Device info2 [firmware version] [hardmware version] [MAC Address]\n    // 2byte, 2byte, 6byte\n    if (view[1]==-12){\n        console.log(\"Device info2\");\n    }\n    // 0xF5 : echo [year] [month] [day] [hour] [min] [sec]\n    // 2byte, 2byte, 2byte, 2byte, 2byte, 2byte\n    if (view[1]==-11){\n        console.log(\"echo time\");\n    }\n}\n\n\n// 파일 접근 및 웹 코드\n// Init & load audio file\n// document.addEventListener('DOMContentLoaded', function() {\n//     // Init\n//     wavesurfer = WaveSurfer.create({\n//         container: document.querySelector('#waveform'),\n//         waveColor: '#A8DBA8',\n//         progressColor: '#3B8686',\n//         normalize: true\n//     });\n//     document.getElementById(\"fileinput\").addEventListener('change', function(e){\n//         let file = this.files[0];\n//         if (file) {\n//             let reader = new FileReader();\n//             music_name = file.name.split(\".\")[0];\n//             console.log(\"music Name : \" + music_name);\n//             if(music_name.substring(0, 4) == 'meta'){\n//                 timbreType = music_name.substring(5);\n//                 console.log(\"meta Setting : \" + timbreType);\n//             }\n//             const h3 = document.getElementsByTagName('h5');\n//             h3[0].innerText= music_name;\n//             reader.onload = function (evt) {\n//                 // Create a Blob providing as first argument a typed array with the file buffer\n//                 let blob = new window.Blob([new Uint8Array(evt.target.result)]);\n//                 // Load the blob into Wavesurfer\n//                 wavesurfer.loadBlob(blob);\n//             };\n\n//             reader.onerror = function (evt) {\n//                 console.error(\"An error ocurred reading the file: \", evt);\n//             };\n\n//             // Read File as an ArrayBuffer\n//             reader.readAsArrayBuffer(file);\n//         }\n//     }, false);\n\n//     // Load audio from URL\n//     wavesurfer.load(\"./assets/metaSound/\" + music_name +\".mp3\");\n\n//     // Log errors\n//     wavesurfer.on('error', function(msg) {\n//         console.log(msg);\n//     });\n\n//     wavesurfer.on('audioprocess', function() {\n//         let current_time = wavesurfer.getCurrentTime()\n//         let difference_time = current_time - last_time\n//         if (difference_time > delay_value || difference_time < 0){\n//             let freq_amp = haptic_pattern_gen();\n//             SendHapticData(freq_amp[0], freq_amp[1]);\n//             if(haptic_recode_activate){\n//                 haptic_freq_data.push(freq_amp[0])\n//                 haptic_amp_data.push(freq_amp[1])\n//             }\n//             console.log(\"freq : \" + freq_amp[0] + \"  amp : \" + freq_amp[1]);\n//             last_time = current_time;\n//         }\n//     });\n// });\n\n    // function SetFileList(files){\n    //     console.log(\"setting file Number : \" + files.length);\n    //     InitializeFilterSetting();\n    //     for(let i = 0; i< files.length; i++){\n    //         SetFileTimbreToFilter(files[i])\n    //     }\n    // }\n    \n    // document\n    // .querySelector('[data-action=\"DisconnectHapticDevice\"]')\n    // .addEventListener('click', async event => {\n    //     SendHapticData(0, 0);\n    //     let device = new HapticDevice();\n    //     await device.request();\n    //     haptic_devices.del(device.device.id);\n    // });\n\n    document\n    .querySelector('[data-action=\"SearchHapticDevice\"]')\n    .addEventListener('click', async event => {\n        let device = new HapticDevice();\n        await device.request();\n        let flag = await device.connect();\n        if (flag){\n            await device.startNotifications(haptic_listener);\n            let tmp = haptic_devices.find_index(device.device.id)\n            if (tmp==-1){\n                haptic_devices.add(device);\n            }else{\n                console.log('the device is already connected')\n            }\n        }\n        console.log('> Name:             ' + device.device.name);\n        console.log('> Id:               ' + device.device.id);\n        console.log('> Connected:        ' + device.device.gatt.connected);\n        setTimeout(function() { SendCurrentTime(); }, 1000);\n    });\n    \n    document\n    .querySelector('[data-action=\"Melody\"]')\n    .addEventListener('click', event => {\n        //console.log(event);\n        current_type = 0;\n        console.log(\"Melody type\");\n        }\n    );\n\n    document\n    .querySelector('[data-action=\"Beat\"]')\n    .addEventListener('click', event => {\n        //console.log(event);\n        current_type = 1;\n        console.log(\"Beat Type\");\n        }\n    );\n    document\n    .querySelector('[data-action=\"playHaptic\"]')\n    .addEventListener('click', event => {\n        Haptic_paly();\n        }\n    );\n\n    // // Bind play/pause button\n    // document\n    //     .querySelector('[data-action=\"play\"]')\n    //     .addEventListener('click', event => {\n    //         console.log(event);\n    //         if (wavesurfer.isPlaying()){\n    //             wavesurfer.playPause();\n    //             SendHapticData(0, 0);\n    //             intervaltester = setInterval(() => StopMapping(), 0.2);\n    //         }else{\n    //             if(play_flag){\n    //                 play_flag = !play_flag;\n    //                 clearInterval(intervaltester);\n    //                 SendHapticData(0, 0);\n    //                 SendHapticData(0, 0);\n    //             }\n    //             wavesurfer.playPause();\n    //             SendHapticData(0, 0);\n    //             SendHapticData(0, 0);\n    //         }\n    // });\n\n    // document\n    // .querySelector('[data-action=\"play2\"]')\n    // .addEventListener('click', event => {\n    //     console.log(event);\n    //     play_flag = !play_flag;\n    //     if(play_flag){\n    //         if (wavesurfer.isPlaying()){\n    //             wavesurfer.playPause();\n    //             SendHapticData(0, 0);}\n    //         current_timer = 0;\n    //         clearInterval(intervaltester);\n    //         intervaltester = setInterval(() => SimpleMapping(), timeCheckerTerm);\n    //     }\n    //     else{\n    //         SendHapticData(0, 0);\n    //         clearInterval(intervaltester);\n    //     }\n    // });\n\n    // document\n    // .querySelector('[data-action=\"CurrentStateChecker\"]')\n    // .addEventListener('click', event => {\n    //     console.log(event);\n    //     play_flag = !play_flag;\n    //     if(play_flag){\n    //         if (wavesurfer.isPlaying()){\n    //             wavesurfer.playPause();\n    //             //SendHapticData(0, 0);\n    //         }\n    //         current_timer = 0;\n    //         clearInterval(intervaltester);\n    //         intervaltester = setInterval(() => SimpleMapping(), timeCheckerTerm);\n    //     }\n    //     else{\n    //         //SendHapticData(0, 0);\n    //         clearInterval(intervaltester);\n    //     }\n    // });\n\n    // document\n    // .querySelector('[data-action=\"toHaptic\"]')\n    // .addEventListener('click', async event => {\n    //     document.getElementById(\"fileinput\").click()\n    //     // // console.log(wavesurfer.backend.mergedPeaks);\n    //     // // vocal, drum, guit, bass, inst\n        \n    //     // //TODO: fix to sync\n    //     // wavesurfer.load('./assets/bass.mp3')\n\n    //     // console.log(wavesurfer.getDuration());\n    //     // console.log(wavesurfer.backend.buffer.sampleRate);\n    //     // console.log(wavesurfer.backend.buffer.length);\n    //     // console.log(wavesurfer.backend.buffer.numberOfChannels);\n\n    //     // ch0_data = wavesurfer.backend.buffer.getChannelData(0);\n    //     // ch1_data = wavesurfer.backend.buffer.getChannelData(1);\n    \n    //     // const hz = 100;\n    //     // const volume = 1.0;\n    //     // const sineWaveArray = new Float32Array(wavesurfer.backend.buffer.length);\n    //     // let i;\n    //     // let sampleTime;\n    \n    //     // for (i = 0; i < sineWaveArray.length; i++) {\n    //     //     sampleTime = i / wavesurfer.backend.buffer.sampleRate;\n    //     //     // sineWaveArray[i] = Math.sin(Math.asin(ch0_data[i])* hz) * volume;\n    //     //     // sineWaveArray[i] = Math.sin(Math.asin(ch0_data[i])* Math.PI * 2) * volume;\n    //     //     sineWaveArray[i] = Math.sin(sampleTime * Math.PI * 2 * hz) * volume;\n    //     // }\n        \n    //     // ch0_haptic = new Float32Array(wavesurfer.backend.buffer.length);\n    //     // ch1_haptic = new Float32Array(wavesurfer.backend.buffer.length);\n    \n    //     // for (i = 0; i < sineWaveArray.length; i++) {\n    //     //     let tmp = 0.5 * (sineWaveArray[i]*Math.abs(ch0_data[i]) + sineWaveArray[i]*Math.abs(ch1_data[i]));\n    //     //     ch0_haptic[i] = tmp;\n    //     //     ch1_haptic[i] = tmp;\n    //     //     // ch0_haptic[i] = sineWaveArray[i];\n    //     //     // ch1_haptic[i] = sineWaveArray[i];\n    //     // }\n    \n    //     // console.log(ch1_haptic)\n    //     // wavesurfer.backend.buffer.copyToChannel(ch0_haptic, 0);\n    //     // wavesurfer.backend.buffer.copyToChannel(ch1_haptic, 1);\n        \n    //     // wavesurfer.loadDecodedBuffer(wavesurfer.backend.buffer);\n    \n    //     // // console.log(wavesurfer.backend.data);\n    //     // // wavesurfer.load(osc)\n    // });\n\n    // // Test커트용코드\n    // (function() {\n    //     const progressDiv = document.querySelector('#progress-bar');\n    //     const progressBar = progressDiv.querySelector('.progress-bar');\n\n    //     let showProgress = function(percent) {\n    //         progressDiv.style.display = 'block';\n    //         progressBar.style.width = percent + '%';\n    //     };\n\n    //     let hideProgress = function() {\n    //         progressDiv.style.display = 'none';\n    //     };\n\n    //     wavesurfer.on('loading', showProgress);\n    //     wavesurfer.on('ready', hideProgress);\n    //     wavesurfer.on('destroy', hideProgress);\n    //     wavesurfer.on('error', hideProgress);\n    // })();\n    \n\n\n//# sourceURL=webpack://Synthesizer/./src/js/haptic.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/haptic.js"]();
/******/ 	
/******/ })()
;