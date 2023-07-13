import {JZZ} from "./JZZ.js"
import { SyntheysizerEvents, note_set, pad_set, dial_set, joystick_set, poly_note_set} from './Share.js';

let noteType = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
let vector = {X:"x", Y:"y"}

let BeatHapticOn = true; //bpm-beat haptic 설정용 예비함수2 (서로 반대로 설정해야함)

//AutiFilter >> 그냥 필터!
const filter = new Tone.Filter().toDestination();
filter.set({
  frequency: "C4",
  type:"highpass"
});

const beatAudio1 = document.getElementById('beat1');
const beatAudio2 = document.getElementById('beat2');
const beatAudio3 = document.getElementById('beat3');
const beatAudio4 = document.getElementById('beat4');
//AutoWah >> 울리는 효과
// const autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
// autoWah.Q.value = 6;

//BitCrusher >> 찢어지는 듯한 효과
// const crusher = new Tone.BitCrusher(4).toDestination();

//Chebyshev >> 고양이 소리?
// const cheby = new Tone.Chebyshev(50).toDestination();

//Chorus >> 동시에 누를 때 확인
// const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();

//Distortion >> 음이 더 늘어지는 효과
//const dist = new Tone.Distortion(1.5).toDestination();

//FeedbackDelay >> delay랑 코러스 효과음?
// const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

//Freeverb >> 먹먹해지는 효과?
// const freeverb = new Tone.Freeverb().toDestination();
// freeverb.dampening = 1000;

//JCReverb >> 두 음이 울리는 느낌?
//const reverb = new Tone.JCReverb(0.4).toDestination();
const delay = new Tone.FeedbackDelay(0.5).toDestination();;
//const synth = new Tone.Synth().chain(delay, reverb);

//Phaser >> 잡음이 섞이는 느낌
// const phaser = new Tone.Phaser({
// 	frequency: 150,
// 	octaves: 10,
// 	baseFrequency: 1000
// }).toDestination();

// //PingPonDelay >> 탁구공이 튀는 느낌으로 점점 음이 생기는 느낌
// const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();

// const vibrato = new Tone.Vibrato(5, 0.1).toDestination();

let autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
let crusher = new Tone.BitCrusher(4).toDestination();
let cheby = new Tone.Chebyshev(50).toDestination();
let chorus = new Tone.Chorus(5, 2.5, 0.5).toDestination();
let feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
let freeverb = new Tone.Freeverb().toDestination();
let phaser = new Tone.Phaser({
  frequency: 150,
  octaves: 10,
  baseFrequency: 1000
}).toDestination();
let vibrato = new Tone.Vibrato(5, 0.1).toDestination();
let dial_bool = [false, false, false, false, false, false, false, false]

// const synth = new Tone.Synth().chain(chorus).toDestination();
// const AMsynth = new Tone.AMSynth().toDestination();
// const duoSynth = new Tone.DuoSynth().toDestination();
const fmSynth = new Tone.FMSynth().toDestination();
// const MembraneSynth = new Tone.MembraneSynth().toDestination();
// const plucky = new Tone.PluckSynth().toDestination();


const polySynth = new Tone.PolySynth().toDestination();
polySynth.set({ detune: -1200 });

const MonoSynth = new Tone.MonoSynth({
	oscillator: {
		type: "square"
	},
	envelope: {
		attack: 0.1
	}
}).toDestination();

const sampler = new Tone.Sampler({
	urls: {
		A1: "A1.mp3",
		A2: "A2.mp3",
	},
	//baseUrl: "https://tonejs.github.io/audio/salamander/",
  baseUrl: "https://tonejs.github.io/audio/casio/",
  attack: 1,
  release: 0,
}).toDestination();

//sampler.connect(pingPong)



// Beat
//const MetalSynth = new Tone.MetalSynth().toDestination();
//const noiseSynth = new Tone.NoiseSynth().toDestination();



function set_synthesiser(msg){
  let synthesiser_msg = get_msg_input(msg)
    switch (synthesiser_msg.input_type){
      case "90":  //Press the piano keys
        piano_key_input(synthesiser_msg.input_id, synthesiser_msg.input_value)
        break;
      case "80":  //Release the piano keys
        piano_key_release(synthesiser_msg.input_id)
        break;
      case "99":  //tap the touch pad
        pad_input(synthesiser_msg.input_id, synthesiser_msg.input_value)
        break;
      case "89":  //Release the touch pad
        pad_output(synthesiser_msg.input_id)
        break;
      case "b0":  //Moving the dial or Moving the joystick(up,down)
        if(synthesiser_msg.input_id != 1){
          dial_input(synthesiser_msg.input_id, synthesiser_msg.input_value)
        }
        else{
          joystick_input(synthesiser_msg.input_id, synthesiser_msg.input_value, vector.Y)
        }
        break;
      case "e0":  //Moving the joystick(left, right)
        joystick_input(synthesiser_msg.input_id, synthesiser_msg.input_value, vector.X)
        break;
      case "d9":  //Press the touch pad
        break;
      default:
        break;
      }
}

function get_msg_input(msg){
  // output list : [input_type, input_id, input_value, bool(OnOff)]
  return {
    input_type: msg.substr(0,2), 
    input_id: parseInt(msg.substr(3,2), 16), 
    input_value: parseInt(msg.substr(6,2), 16)
  }
}
export function piano_player(input_note, attackRelase, value = 127){
  if(attackRelase){
    polySynth.triggerAttack(input_note);
    note_set.pitch = note2Pitch(input_note);  //output : 0 ~ 127
    note_set.note = input_note; //output : C0 ~ B7
    note_set.value = value; //output : 0 ~ 127
    const event = new CustomEvent('noteInput', { detail: note_set });
    SyntheysizerEvents.dispatchEvent(event);
  }
  else{
    polySynth.triggerRelease(input_note);
    note_set.pitch = note2Pitch(input_note);  //output : 0 ~ 127
    note_set.note = input_note; //output : C0 ~ B7
    const event = new CustomEvent('noteRelease', { detail: note_set });
    SyntheysizerEvents.dispatchEvent(event);
  }
}
function note2Pitch(input_note){
  //console.log("input", input_note.slice(0,-1), input_note.slice(-1));
  let num = noteType.findIndex((num) => num == input_note.slice(0,1));
  return num + noteType.length * parseInt(input_note.slice(-1))
}
function pitch2Note(input_pitch){
  return noteType[input_pitch%12] + String(parseInt(input_pitch/12))
}

function piano_key_input(input_id, input_value){
  let input_note = pitch2Note(input_id)
  piano_player(input_note, true);
  note_set.pitch = input_id;  //output : 0 ~ 127
  note_set.note = input_note; //output : C0 ~ B7
  note_set.value = input_value; //output : 0 ~ 127
  const event = new CustomEvent('pianoKeyInput', { detail: note_set });
  SyntheysizerEvents.dispatchEvent(event);
}

function piano_key_release(input_id){
  let input_note = pitch2Note(input_id)
  piano_player(input_note, false);
  note_set.pitch = input_id;  //output : 0 ~ 127
  note_set.note = input_note; //output : C0 ~ B7
  const event = new CustomEvent('pianoKeyOutput', { detail: note_set });
  SyntheysizerEvents.dispatchEvent(event);
}
function restartAudio(audioElement) {
  audioElement.currentTime = 0; // 재생 위치를 0으로 설정
  audioElement.play(); // 오디오 재생 시작
}
export function beat_player(input_id){
  pad_set.id = input_id;
  const event = new CustomEvent('padInput', { detail: pad_set });
  SyntheysizerEvents.dispatchEvent(event);
  //console.log("tap Check");
  switch (input_id){
    case 0:
      restartAudio(beatAudio1);
      if(!document.getElementById("hapticType").checked){
        document.getElementById('HapticPlayButton1').click();
      }
      break;
    case 1:
      restartAudio(beatAudio2);
      if(!document.getElementById("hapticType").checked){
        document.getElementById('HapticPlayButton2').click();
      }
      break;
    case 2:
      restartAudio(beatAudio3);
      if(!document.getElementById("hapticType").checked){
        document.getElementById('HapticPlayButton3').click();
      }
      break;
    case 3:
      restartAudio(beatAudio4);
      if(!document.getElementById("hapticType").checked){
        document.getElementById('HapticPlayButton4').click();
      }
      break;
    default:
      break;
  }
}
export function beat_output_play(input_id){
  pad_set.id = input_id;
  const event = new CustomEvent('padOutput', { detail: pad_set });
  SyntheysizerEvents.dispatchEvent(event);
}

function pad_input(input_id){
  pad_set.id = input_id - 36;
  beat_player(input_id - 36)
  const event = new CustomEvent('padkeyInput', { detail: pad_set });
  SyntheysizerEvents.dispatchEvent(event);
}
function pad_output(input_id){
  beat_output_play(input_id - 36)
}
SyntheysizerEvents.addEventListener('templateLoad', function (e){
  // console.log("In Circle note: ", e.detail.value); //범위가 0~127입니다.
  dial_set.value = e.detail;
  //console.log("set chnaged", dial_set);
  const event = new CustomEvent('dialInput', { detail: dial_set });
  SyntheysizerEvents.dispatchEvent(event);
  //console.log(dial_set);
  //for(let i = 70; i < 78; i++){
  //  dial_effect(i, dial_set.value[parseInt((i-70)/4)][(i-70)%4]);
  //}
})


export function dialInitialize(){
  dial_set.value = [[0.0, 0.0, 0.0, 0.0], 
                  [0.0, 0.0, 0.0, 0.0]]
  const event = new CustomEvent('dialInput', { detail: dial_set });
  SyntheysizerEvents.dispatchEvent(event);
  for(let i = 70; i < 78; i++){
    dial_effect(i, 0);
  }
  
}
function dial_input(input_id, input_value){
  //console.log("dial_input", input_id, );
  if(input_id > 69){  //there are except case in joystick
    dial_set.value[parseInt((input_id-70)/4)][(input_id-70)%4] = input_value;
    const event = new CustomEvent('dialInput', { detail: dial_set });
    SyntheysizerEvents.dispatchEvent(event);
    dial_effect(input_id, input_value);
  }
}

function Normaizing(input_value, minmaxList){
  return minmaxList[0] + (minmaxList[1] - minmaxList[0]) * ((input_value - 10) / (127 - 10));
}

function dial_effect(input_id, input_value){
    switch (input_id){
      case 70:
        console.log("feedbackDelay", input_value)
        if(dial_bool[0]){
          // console.log("disconnect");
          polySynth.disconnect(feedbackDelay);
          dial_bool[0] = false;
        }
        if(input_value > 10){
          // console.log("connect");
          //feedbackDelay = new Tone.FeedbackDelay("8n", Normaizing(input_value, [0, 0.8])).toDestination();
          feedbackDelay.feedback.value = Normaizing(input_value, [0, 0.5]);
          polySynth.connect(feedbackDelay);
          dial_bool[0] = true;
        }
        break;
      case 71:
        console.log("crusher", input_value)
        if(dial_bool[1]){
          // console.log("disconnect");
          polySynth.disconnect(crusher);
          dial_bool[1] = false;
        }
        if(input_value > 10){
          // console.log("connect");
          crusher.bits.value = 9 - parseInt(Normaizing(input_value, [1, 3]));
          polySynth.connect(crusher);
          dial_bool[1] = true;
        }
        break;
      case 72:
        console.log("cheby", input_value)
        if(dial_bool[2]){
          // console.log("disconnect");
          polySynth.disconnect(cheby);
          dial_bool[2] = false;
        }
        if(input_value > 10){  
          // console.log("connect");
          cheby.order = parseInt(Normaizing(input_value, [1, 20]));
          polySynth.connect(cheby);
          dial_bool[2] = true;
        }
        break;
      case 73:
        console.log("chorus", input_value)
        if(dial_bool[3]){
          // console.log("disconnect");
          polySynth.disconnect(chorus);
          dial_bool[3] = false;
        }
        if(input_value > 10){
          // console.log("connect");
          //chorus = new Tone.Chorus(Normaizing(input_value, [1, 10]), 2.5, 0.5).toDestination();
          chorus.frequency.value = Normaizing(input_value, [1, 7])
          polySynth.connect(chorus);
          dial_bool[3] = true;
        }
        break;
      default:
        break;
      }
}



function joystick_input(input_id, input_value, type){
  if(type == vector.X){
    //console.log(type, input_value - 64)
    joystick_set.value[0] = input_value - 64;
    const event = new CustomEvent('joystickInpnut', { detail: joystick_set });
    SyntheysizerEvents.dispatchEvent(event);
  }
  else{
    //console.log(type, parseInt(input_value/2))
    joystick_set.value[1] = parseInt(input_value/2)
    const event = new CustomEvent('joystickInpnut', { detail: joystick_set });
    SyntheysizerEvents.dispatchEvent(event);
  }
}

// MIDI Device Detect code
var midi_in;
let open_midi = document.querySelector('[data-action="open_midi_in"]');
open_midi.addEventListener('click', event => {
  midi_in = JZZ().openMidiIn()
  .or(function(){document.getElementById("midiInName").innerHTML = "Cannot open!";})
  .and(function(){document.getElementById("midiInName").innerHTML = this.name(); console.log(this.info());})
  .connect(function(msg){
    set_synthesiser(msg.toString());
  });
 });

 let close_midi = document.querySelector('[data-action="close_midi_in"]');
 close_midi.addEventListener('click', event => {
  if (midi_in) {
    midi_in.close();
    midi_in = undefined;
    document.getElementById("midiInName").innerHTML = "closed";
  }
  });