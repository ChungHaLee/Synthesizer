import {JZZ} from "./JZZ.js"
import { SyntheysizerEvents, note_set, pad_set, dial_set, joystick_set} from './Share.js';

let noteType = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
let vector = {X:"x", Y:"y"}

//AutiFilter >> 그냥 필터!
const filter = new Tone.Filter().toDestination();
filter.set({
  frequency: "C4",
  type:"highpass"
});
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
const reverb = new Tone.JCReverb(0.4).toDestination();
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

// const synth = new Tone.Synth().chain(chorus).toDestination();
// const AMsynth = new Tone.AMSynth().toDestination();
// const duoSynth = new Tone.DuoSynth().toDestination();
// const fmSynth = new Tone.FMSynth().toDestination();
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
const MetalSynth = new Tone.MetalSynth().toDestination();
const noiseSynth = new Tone.NoiseSynth().toDestination();



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
        pad_input(synthesiser_msg.input_id)
        break;
      case "89":  //Release the touch pad
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

function piano_key_input(input_id, input_value){
  let input_pitch = noteType[input_id%12] + String(parseInt(input_id/12))


  polySynth.triggerAttackRelease(input_pitch, 0.5);


  note_set.pitch = input_id;  //output : 0 ~ 127
  note_set.note = input_pitch; //output : C0 ~ B7
  note_set.value = input_value; //output : 0 ~ 127
  const event = new CustomEvent('noteInput', { detail: note_set });
  SyntheysizerEvents.dispatchEvent(event);
}

function piano_key_release(input_id){
  let input_pitch = noteType[input_id%12] + String(parseInt(input_id/12))
  note_set.pitch = input_id;  //output : 0 ~ 127
  note_set.note = input_pitch; //output : C0 ~ B7
  //synth.triggerRelease(input_pitch);
  const event = new CustomEvent('noteRelease', { detail: note_set });
  SyntheysizerEvents.dispatchEvent(event);
}

function pad_input(input_id){
  //console.log("pad id", input_id);
  MetalSynth.triggerAttackRelease("8n", 0.05);
  pad_set.id = input_id - 36;
  // switch (pad_set.id){
  //   case 0:
  //     beat1Sound.play();
  //     break;
  //   case 1:
  //     beat2Sound.play();
  //     break;
  //   case 2:
  //     beat3Sound.play();
  //     break;
  //   case 3:
  //     beat4Sound.play();
  //     break;
  //   default:
  //     break;
  //   }
    const event = new CustomEvent('padInput', { detail: pad_set });
    SyntheysizerEvents.dispatchEvent(event);
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

function dial_effect(input_id, input_value){
    switch (input_id){
      case 70: // AutoWah
        let autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
        autoWah.Q.value = input_value/12.7;
        polySynth.connect(autoWah);
        break;
      case 71:
        let crusher = new Tone.BitCrusher(input_value/12.7).toDestination();
        polySynth.connect(crusher);
        break;
      case 72:
        let cheby = new Tone.Chebyshev(input_value/2).toDestination();
        polySynth.connect(cheby);
        break;
      case 73:
        let chorus = new Tone.Chorus(input_value/12.7, 2.5, 0.5).toDestination();
        polySynth.connect(chorus);
        break;
      case 74:
        let feedbackDelay = new Tone.FeedbackDelay("8n", input_value/60).toDestination();
        polySynth.connect(feedbackDelay);
        break;
      case 75:
        let freeverb = new Tone.Freeverb().toDestination();
        freeverb.dampening = input_value * 20;
        polySynth.connect(freeverb);
        break;
      case 76:
        let phaser = new Tone.Phaser({
          frequency: 150,
          octaves: parseInt(input_value/12.7),
          baseFrequency: 1000
        }).toDestination();
        polySynth.connect(phaser);
        break;
      case 77:
        let vibrato = new Tone.Vibrato(input_value/12.7, 0.1).toDestination();
        polySynth.connect(vibrato);
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