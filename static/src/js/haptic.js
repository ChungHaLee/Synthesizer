'use strict';
// Create an instance
let sending_delay = 0.5;
const delay_value = 0.12;

let last_time = 0;
var intervaltester;
let current_timer = 0;
let timeCheckerTerm = 7;
let pre_resultcheck = 0.0;

const beatAmp = 50;
const beatFreq = 225;


let freq = 200;
let amp = 30;
let attack = 0.4;
let decay = 0.33;
let sustain = 7;

let _IntensityArray = new Int16Array([100, 0]);
let intensityArrayIndex = 0
let max_index = 16;
const Frequency_Field_size = 256;

const mappingType = ["Melody", "Beat"];
let current_type = 0;
let envelopTimer = 100;
let user_num = 16;
let current_mode = 0;

let haptic_recode_activate = false;

let freq_slider = document.querySelector('[data-action="update_frequency"]');
freq_slider.addEventListener('input', event => {
    freq = parseInt(Number(freq_slider.value) * 1.5 + 150);
    console.log("Control frequency : " + freq + " Hz");
    //console.log("mono_freq : " + mono_freq);
});

let amp_slider = document.querySelector('[data-action="update_amplitude"]');
amp_slider.addEventListener('input', event => {
    amp = parseInt(Number(amp_slider.value) * 0.5);
    console.log("Control amplitude : " + amp * 2 + " A");
    //console.log("mono_amp : " + mono_amp);
    _IntensityArray[0] = amp
});

let attack_slider = document.querySelector('[data-action="update_attack"]');
attack_slider.addEventListener('input', event => {
    attack = Number(attack_slider.value) * 0.009 + 0.1;
    console.log("Control attack : " + attack );
    //console.log("mono_freq : " + mono_freq);
    //_IntensityArray = Envelop_Maker(attack, decay, sustain);
});

let decay_slider = document.querySelector('[data-action="update_decay"]');
decay_slider.addEventListener('input', event => {
    decay = Number(decay_slider.value)  * 0.01;
    console.log("Control decay : " + decay );
    //_IntensityArray = Envelop_Maker(attack, decay, sustain);
});
let sustain_slider = document.querySelector('[data-action="update_sustain"]');
sustain_slider.addEventListener('input', event => {
    sustain = parseInt(Number(sustain_slider.value) * 0.1);
    console.log("Control sustain" + sustain );
    //_IntensityArray = Envelop_Maker(attack, decay, sustain);
});

window.onbeforeunload = DisconnectAllDevices
function DisconnectAllDevices(){
    haptic_devices.clear();
}

class HapticArray{              //통신용 블루투스 array 구현 코드
    constructor() {
        this.devices = []
      }
    
    add(hapticdevice){
        this.devices.push(hapticdevice);
    }
    clear(){
        this.devices.forEach(device => {
            device.disconnect(haptic_listener);
        });
        console.log("All Device is Disconnected");
    }
    del(id){
        let index = this.find_index(id)
        if (index != -1){
            this.devices[index].disconnect(haptic_listener)
            this.devices.splice(index, 1);
            console.log("device successfully disconneted" );
        }
    }
    send(data){
        this.devices.forEach(device => {
            device.write(data);
        });
    }
    find_index(id){
        let fin = -1;
        let index = 0;
        this.devices.forEach(device => {
            if (device.device.id == id){
                console.log("found the device", index);
                fin = index
            }
            index = index + 1;
        });
        if (fin == -1){
            console.log("there is no device in the list");
        }
        return fin;
    }
}
let haptic_devices = new HapticArray();

class HapticDevice {

    constructor() {
      this.device = null;
      this.onDisconnected = this.onDisconnected.bind(this);
    }
    
    async request() {
      let options = {
        "filters": [{
          "namePrefix": "Haptic"
        }],
        "optionalServices": ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"],
        "acceptAllDevices": false
      };
      this.device = await navigator.bluetooth.requestDevice(options);
      if (!this.device) {
        throw "No device selected";
      }
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
    }
    
    async connect() {
      if (!this.device) {
          Promise.reject('Device is not connected.');
        return 0
      }
      await this.device.gatt.connect();
      return 1
    }
    
    // write(data) {
    //   // RX Characteristic (6E400002-B5A3-F393-E0A9-E50E24DCCA9E)
    //   // Write or Write Without Response
    //   // Write data to the RX Characteristic to send it on to the UART interface.
    //   return this.device.gatt.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e")
    //   .then(service => service.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e"))
    //   .then(characteristic => characteristic.writeValue(data))
    //   .catch(error => {
    //     console.log('Argh! ' + error);
    //     sending_delay = 1.2;
    //   });
    // }
    write(data) {
        // RX Characteristic (6E400002-B5A3-F393-E0A9-E50E24DCCA9E)
        // Write or Write Without Response
        // Write data to the RX Characteristic to send it on to the UART interface.
  
        this.device.gatt.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e")
        .then(service => service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e"))
        .then(characteristic => {
          //console.log('---!---');
          //console.log("Bluetooth Notify Chracteristic Value : ", characteristic.value);
          //console.log(characteristic.oncharacteristicvaluechanged);
          //console.log('---?---');
        });
  
        return this.device.gatt.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e")
        .then(service => service.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e"))
        .then(characteristic => {characteristic.writeValue(data)
          //console.log("Bluetooth Write Chracteristic Value : ",characteristic.value);
        })
        .catch(error => {
          console.log('Argh! ' + error);
          SendHapticData(0,0);
        });
    }
    async startNotifications(listener) {
      // TX Characteristic (6E400003-B5A3-F393-E0A9-E50E24DCCA9E)
      // Notify
      // Enable notifications for the TX Characteristic to receive data from the application. The application transmits all data that is received over UART as notifications.
      const service = await this.device.gatt.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
      const characteristic = await service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', listener);
    }
  
    async stopNotifications(listener) {
        const service = await this.device.gatt.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
        const characteristic = await service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
        await characteristic.stopNotifications();
        characteristic.removeEventListener('characteristicvaluechanged', listener);
    }
  
    async disconnect(listener) {
      if (!this.device) {
        return Promise.reject('Device is not connected.');
      }
      await this.stopNotifications(listener);
      this.device.gatt.disconnect();

    }
  
    onDisconnected() {
      console.log('Device is disconnected.');
      console.log('> Name:             ' + this.device.name);
      console.log('> Id:               ' + this.device.id);
      console.log('> Connected:        ' + this.device.gatt.connected);
    }
}
function onebyte_to_twobyte_int(high, low){     // 통신 데이터가 byte 단위로 가능하기 때문에 이를 변환해주는 코드들(수정할 필요는 없음)
    let tmp = (((high & 0xff) << 8) | (low & 0xff));
    return tmp;
}
function twobyte_int_to_onebyte(origin){    
    let high = ((origin >> 8) & 0xff);
    let low = origin & 0xff;
    return [high, low];
}
function onebyte_to_fourbyte_float(origin){
    let buf = new ArrayBuffer(4);
    let view = new DataView(buf);
    origin.forEach(function (b, i) {
        view.setInt8(i, b);
    });
    return view.getFloat32(0);
}
function fourbyte_float_to_onebyte(origin){
    let high = ((origin >> 8) & 0xff);
    let low = origin & 0xff;
    return high, low;
}
// function haptic_pattern_gen(){  // haptic code
//     let fftsize = wavesurfer.backend.analyser.frequencyBinCount;
//     let _freq = 1;
//     let _index = 0;
//     let ampArray = new Float32Array(fftsize);
//     let dataArray = [0, 0];
//     wavesurfer.backend.analyser.getFloatTimeDomainData(ampArray);
//     for (let i = 0;i < fftsize; i++){
//         if (ampArray[i] > 0.01) {
//             dataArray.push(ampArray[i]);
//         }
//     }
//     let resultcheck = Math.abs(dataArray.reduce(function add(sum, currvalure){ return sum + Math.max(currvalure,0);}, 0));
    
//     if(current_type == 1){
//         if(resultcheck > pre_resultcheck * 1.4){
//             pre_resultcheck = 0.0 + resultcheck;
//             envelopTimer = 0;
//             return Envelope_Haptic(envelopTimer);
//         }
//         else{
//             pre_resultcheck = 0.0 + resultcheck;
//             envelopTimer += 1;
//             return Envelope_Haptic(envelopTimer);
//         }
//     }
    
//     else{
//         dataArray = new Float32Array(dataArray);
//         _index = dataArray.findIndex(function (item) {return item == Math.max(...ampArray)});
//         console.log("index Check" + _index);
//         _freq  = parseInt(_index/dataArray.length * _HzIndex.length);
//         let _amp = parseInt(resultcheck / Frequency_Field_size * amp * 4) * 2;
//         if (_amp  >= 100){ _amp = 100; }
//         if (_freq == NaN || _freq < 0){ _freq = 0; }
//         return [_HzIndex[_freq], _amp]
//     }
// }


function Envelop_Maker(attack_parameter, decay_parameter, sustain_parameter){

    let TMP_intensityArray = new Int16Array(3 + parseInt(sustain_parameter));
    let sustainIntensity = parseInt((50 - 45 * attack_parameter) * beatAmp / 50);
    let decayIndex = parseInt((1 - decay_parameter) * sustain_parameter);
    TMP_intensityArray[0] = beatAmp * 2;
    for(let i = 1; i < decayIndex+1; i++){
        TMP_intensityArray[i] = parseInt((50  - 45 * attack_parameter * i / (decayIndex+1)) * beatAmp / 50) * 2;
    }
    for(let i = decayIndex+1; i<= sustain_parameter; i++){
        TMP_intensityArray[i] = sustainIntensity * 2;
    }
    TMP_intensityArray[1 + parseInt(sustain_parameter)] = 0;
    TMP_intensityArray[2 + parseInt(sustain_parameter)] = 0;
    console.log(TMP_intensityArray)
    return TMP_intensityArray;
}
function Envelope_Haptic(index){
    if(index < intensityArrayIndex){
        return [beatFreq, _IntensityArray[index]]
    }
    else{
        return[0, 0]
    }
}

function SimpleMapping(){
    current_timer += timeCheckerTerm;
    if(current_timer >= delay_value * 1000){
        if(intensityArrayIndex >= _IntensityArray.length){
            StopMapping()
        }
        else{
            SendHapticData(freq,_IntensityArray[intensityArrayIndex]);
            intensityArrayIndex += 1;
            current_timer = 0;
        }
    }
}

function StopMapping(){
    SendHapticData(0, 0);
    clearInterval(intervaltester);
}

function Haptic_paly(){
    current_timer = 0;
    intensityArrayIndex = 0;
    clearInterval(intervaltester);
    intervaltester = setInterval(SimpleMapping, timeCheckerTerm);
}


function SendHapticData(frequency, amplitude){ // mono_amp : max = 0~1 mono_freq : 0 ~ 500hz  //햅틱 정보를 주는 코드
    console.log("haptic input", frequency, amplitude);
    let data_buffer = new ArrayBuffer(19);
    let view = new Int8Array(data_buffer);
    view[0] = 36; // STX 0x24
    view[1] = 2;  // TYPE 0x02
    
    let tmp = twobyte_int_to_onebyte(frequency);
    view[2] = tmp[0];
    view[3] = tmp[1];
    tmp = twobyte_int_to_onebyte(amplitude);
    view[4] = tmp[0];
    view[5] = tmp[1];
    view[17] = 13; // ETX 0x0D
    view[18] = 10; // ETX 0x0A

    //console.log(view);        // OUTPUT data check log
    //console.log(haptic_devices)
    haptic_devices.send(view);
}
function SendCurrentTime(){ // 디바이스에 시계가 추가될 예정이라서 시간 정보를 전달해주는 코드
    console.log("Current Time send check");
    let today = new Date();
    let data_buffer = new ArrayBuffer(19);
    let view = new Int8Array(data_buffer);

    view[0] = 36; // STX 0x24
    view[1] = 5; // TYPE 0x05

    view[2] = (today.getFullYear()-2000) & 0xff; // Year 0xEA
    view[3] = (today.getMonth()+1) & 0xff; // Month
    view[4] = today.getDate() & 0xff; // Day
    view[5] = today.getHours() & 0xff; // Hour
    view[6] = today.getMinutes() & 0xff; // Minute
    view[7] = today.getSeconds() & 0xff; // Second
    
    view[17] = 13; // ETX 0x0D
    view[18] = 10; // ETX 0x0A

    //console.log(view);
    haptic_devices.send(view);
} 

function haptic_listener(event){    //Haptic 디바이스가  보내는 정보를 Log로 확인용 코드
    let data_buffer = new ArrayBuffer(19);
    let view = new Uint8Array(data_buffer);
    //console.log('Log Check 3');
    for (let i = 0; i<19;i++){
        view[i] = event.currentTarget.value.getInt8(i);
    }
    console.log(view);
    console.log(data_buffer);
    // 0xF1 : battery info
    // 4byte float
    if (view[1]==-15){
        console.log("current battery" + onebyte_to_fourbyte_float([view[2],view[3],view[4],view[5]])/4.2);
    }
    // 0xF2 : echo [mono_freq] [mono_amp]
    // 2byte, 2byte
    if (view[1]==-14){
        console.log("echo data");
    }
    // 0xF3 : Device info [BLE Connection Interval MIN] [BLE Connection Interval MAX] [Freq MIN] [Freq MAX]
    // 2byte, 2byte, 2byte, 2byte
    if (view[1]==-13){
        console.log("Device info");
        console.log("BLE Connection Interval MIN from" + onebyte_to_twobyte_int(view[2],view[3]));
        console.log("BLE Connection Interval MAX from" + onebyte_to_twobyte_int(0,view[4],view[5]));
        console.log("Freq MIN" + onebyte_to_twobyte_int(view[6],view[7]));
        console.log("Freq MAX" + onebyte_to_twobyte_int(view[8],view[9]));
    }
    // 0xF4 : Device info2 [firmware version] [hardmware version] [MAC Address]
    // 2byte, 2byte, 6byte
    if (view[1]==-12){
        console.log("Device info2");
    }
    // 0xF5 : echo [year] [month] [day] [hour] [min] [sec]
    // 2byte, 2byte, 2byte, 2byte, 2byte, 2byte
    if (view[1]==-11){
        console.log("echo time");
    }
}


// 파일 접근 및 웹 코드
// Init & load audio file
// document.addEventListener('DOMContentLoaded', function() {
//     // Init
//     wavesurfer = WaveSurfer.create({
//         container: document.querySelector('#waveform'),
//         waveColor: '#A8DBA8',
//         progressColor: '#3B8686',
//         normalize: true
//     });
//     document.getElementById("fileinput").addEventListener('change', function(e){
//         let file = this.files[0];
//         if (file) {
//             let reader = new FileReader();
//             music_name = file.name.split(".")[0];
//             console.log("music Name : " + music_name);
//             if(music_name.substring(0, 4) == 'meta'){
//                 timbreType = music_name.substring(5);
//                 console.log("meta Setting : " + timbreType);
//             }
//             const h3 = document.getElementsByTagName('h5');
//             h3[0].innerText= music_name;
//             reader.onload = function (evt) {
//                 // Create a Blob providing as first argument a typed array with the file buffer
//                 let blob = new window.Blob([new Uint8Array(evt.target.result)]);
//                 // Load the blob into Wavesurfer
//                 wavesurfer.loadBlob(blob);
//             };

//             reader.onerror = function (evt) {
//                 console.error("An error ocurred reading the file: ", evt);
//             };

//             // Read File as an ArrayBuffer
//             reader.readAsArrayBuffer(file);
//         }
//     }, false);

//     // Load audio from URL
//     wavesurfer.load("./assets/metaSound/" + music_name +".mp3");

//     // Log errors
//     wavesurfer.on('error', function(msg) {
//         console.log(msg);
//     });

//     wavesurfer.on('audioprocess', function() {
//         let current_time = wavesurfer.getCurrentTime()
//         let difference_time = current_time - last_time
//         if (difference_time > delay_value || difference_time < 0){
//             let freq_amp = haptic_pattern_gen();
//             SendHapticData(freq_amp[0], freq_amp[1]);
//             if(haptic_recode_activate){
//                 haptic_freq_data.push(freq_amp[0])
//                 haptic_amp_data.push(freq_amp[1])
//             }
//             console.log("freq : " + freq_amp[0] + "  amp : " + freq_amp[1]);
//             last_time = current_time;
//         }
//     });
// });

    // function SetFileList(files){
    //     console.log("setting file Number : " + files.length);
    //     InitializeFilterSetting();
    //     for(let i = 0; i< files.length; i++){
    //         SetFileTimbreToFilter(files[i])
    //     }
    // }
    
    // document
    // .querySelector('[data-action="DisconnectHapticDevice"]')
    // .addEventListener('click', async event => {
    //     SendHapticData(0, 0);
    //     let device = new HapticDevice();
    //     await device.request();
    //     haptic_devices.del(device.device.id);
    // });

    document
    .querySelector('[data-action="SearchHapticDevice"]')
    .addEventListener('click', async event => {
        let device = new HapticDevice();
        await device.request();
        let flag = await device.connect();
        if (flag){
            await device.startNotifications(haptic_listener);
            let tmp = haptic_devices.find_index(device.device.id)
            if (tmp==-1){
                haptic_devices.add(device);
            }else{
                console.log('the device is already connected')
            }
        }
        console.log('> Name:             ' + device.device.name);
        console.log('> Id:               ' + device.device.id);
        console.log('> Connected:        ' + device.device.gatt.connected);
        setTimeout(function() { SendCurrentTime(); }, 1000);
    });
    
    document
    .querySelector('[data-action="Melody"]')
    .addEventListener('click', event => {
        //console.log(event);
        current_type = 0;
        console.log("Melody type");
        }
    );

    document
    .querySelector('[data-action="Beat"]')
    .addEventListener('click', event => {
        //console.log(event);
        current_type = 1;
        console.log("Beat Type");
        }
    );
    document
    .querySelector('[data-action="playHaptic"]')
    .addEventListener('click', event => {
        Haptic_paly();
        }
    );

    // // Bind play/pause button
    // document
    //     .querySelector('[data-action="play"]')
    //     .addEventListener('click', event => {
    //         console.log(event);
    //         if (wavesurfer.isPlaying()){
    //             wavesurfer.playPause();
    //             SendHapticData(0, 0);
    //             intervaltester = setInterval(() => StopMapping(), 0.2);
    //         }else{
    //             if(play_flag){
    //                 play_flag = !play_flag;
    //                 clearInterval(intervaltester);
    //                 SendHapticData(0, 0);
    //                 SendHapticData(0, 0);
    //             }
    //             wavesurfer.playPause();
    //             SendHapticData(0, 0);
    //             SendHapticData(0, 0);
    //         }
    // });

    // document
    // .querySelector('[data-action="play2"]')
    // .addEventListener('click', event => {
    //     console.log(event);
    //     play_flag = !play_flag;
    //     if(play_flag){
    //         if (wavesurfer.isPlaying()){
    //             wavesurfer.playPause();
    //             SendHapticData(0, 0);}
    //         current_timer = 0;
    //         clearInterval(intervaltester);
    //         intervaltester = setInterval(() => SimpleMapping(), timeCheckerTerm);
    //     }
    //     else{
    //         SendHapticData(0, 0);
    //         clearInterval(intervaltester);
    //     }
    // });

    // document
    // .querySelector('[data-action="CurrentStateChecker"]')
    // .addEventListener('click', event => {
    //     console.log(event);
    //     play_flag = !play_flag;
    //     if(play_flag){
    //         if (wavesurfer.isPlaying()){
    //             wavesurfer.playPause();
    //             //SendHapticData(0, 0);
    //         }
    //         current_timer = 0;
    //         clearInterval(intervaltester);
    //         intervaltester = setInterval(() => SimpleMapping(), timeCheckerTerm);
    //     }
    //     else{
    //         //SendHapticData(0, 0);
    //         clearInterval(intervaltester);
    //     }
    // });

    // document
    // .querySelector('[data-action="toHaptic"]')
    // .addEventListener('click', async event => {
    //     document.getElementById("fileinput").click()
    //     // // console.log(wavesurfer.backend.mergedPeaks);
    //     // // vocal, drum, guit, bass, inst
        
    //     // //TODO: fix to sync
    //     // wavesurfer.load('./assets/bass.mp3')

    //     // console.log(wavesurfer.getDuration());
    //     // console.log(wavesurfer.backend.buffer.sampleRate);
    //     // console.log(wavesurfer.backend.buffer.length);
    //     // console.log(wavesurfer.backend.buffer.numberOfChannels);

    //     // ch0_data = wavesurfer.backend.buffer.getChannelData(0);
    //     // ch1_data = wavesurfer.backend.buffer.getChannelData(1);
    
    //     // const hz = 100;
    //     // const volume = 1.0;
    //     // const sineWaveArray = new Float32Array(wavesurfer.backend.buffer.length);
    //     // let i;
    //     // let sampleTime;
    
    //     // for (i = 0; i < sineWaveArray.length; i++) {
    //     //     sampleTime = i / wavesurfer.backend.buffer.sampleRate;
    //     //     // sineWaveArray[i] = Math.sin(Math.asin(ch0_data[i])* hz) * volume;
    //     //     // sineWaveArray[i] = Math.sin(Math.asin(ch0_data[i])* Math.PI * 2) * volume;
    //     //     sineWaveArray[i] = Math.sin(sampleTime * Math.PI * 2 * hz) * volume;
    //     // }
        
    //     // ch0_haptic = new Float32Array(wavesurfer.backend.buffer.length);
    //     // ch1_haptic = new Float32Array(wavesurfer.backend.buffer.length);
    
    //     // for (i = 0; i < sineWaveArray.length; i++) {
    //     //     let tmp = 0.5 * (sineWaveArray[i]*Math.abs(ch0_data[i]) + sineWaveArray[i]*Math.abs(ch1_data[i]));
    //     //     ch0_haptic[i] = tmp;
    //     //     ch1_haptic[i] = tmp;
    //     //     // ch0_haptic[i] = sineWaveArray[i];
    //     //     // ch1_haptic[i] = sineWaveArray[i];
    //     // }
    
    //     // console.log(ch1_haptic)
    //     // wavesurfer.backend.buffer.copyToChannel(ch0_haptic, 0);
    //     // wavesurfer.backend.buffer.copyToChannel(ch1_haptic, 1);
        
    //     // wavesurfer.loadDecodedBuffer(wavesurfer.backend.buffer);
    
    //     // // console.log(wavesurfer.backend.data);
    //     // // wavesurfer.load(osc)
    // });

    // // Test커트용코드
    // (function() {
    //     const progressDiv = document.querySelector('#progress-bar');
    //     const progressBar = progressDiv.querySelector('.progress-bar');

    //     let showProgress = function(percent) {
    //         progressDiv.style.display = 'block';
    //         progressBar.style.width = percent + '%';
    //     };

    //     let hideProgress = function() {
    //         progressDiv.style.display = 'none';
    //     };

    //     wavesurfer.on('loading', showProgress);
    //     wavesurfer.on('ready', hideProgress);
    //     wavesurfer.on('destroy', hideProgress);
    //     wavesurfer.on('error', hideProgress);
    // })();
    
