import {JZZ} from "./JZZ.js"
import { SyntheysizerEvents, note_set, pad_set, dial_set} from './Share.js';

let synth = new Tone.Synth().toDestination();
let noteType = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

function set_synthesiser(msg){
  let synthesiser_msg = get_msg_input(msg)
    switch (synthesiser_msg.input_type){
      case "90":  //Press the piano keys
        piano_key_input(synthesiser_msg.input_id, synthesiser_msg.input_value)
        break;
      case "80":  //Release the piano keys
        break;
      case "99":  //tap the touch pad
        pad_input(synthesiser_msg.input_id)
        break;
      case "89":  //Release the touch pad
        break;
      case "b0":  //Moving the dial or Moving the joystick(up,down)
        dial_input(synthesiser_msg.input_id, synthesiser_msg.input_value)
        break;
      case "e0":  //Moving the joystick(left, right)
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
  //console.log("Press the piano key : ", input_pitch);
  synth.triggerAttackRelease(input_pitch, 0.2);
  note_set.pitch = input_id;  //output : 0 ~ 127
  note_set.note = input_pitch; //output : C0 ~ B7
  note_set.value = input_value;
  const event = new CustomEvent('noteInput', { detail: note_set });
  SyntheysizerEvents.dispatchEvent(event);
}

function pad_input(input_id){
  //console.log("pad id", input_id);
  //DrumAudio.play();
  pad_set.id = input_id-36;
  const event = new CustomEvent('padInput', { detail: pad_set });
  SyntheysizerEvents.dispatchEvent(event);
}

function dial_input(input_id, input_value){
  //console.log("dial_input", input_id, );
  if(input_id > 69){  //there are except case in joystick
    dial_set.value[parseInt((input_id-70)/4)][(input_id-70)%4] = input_value;
    const event = new CustomEvent('dialInput', { detail: dial_set });
    SyntheysizerEvents.dispatchEvent(event);
  }
}


// function synthesiser_console_mapping(console_id, value){
//   if(input_scale_changer(value,["00", "7f"]) > 60){
//     document.getElementById("beatButton").click();
//   }
//   else if(input_scale_changer(value,["00", "7f"]) < 20){
//     document.getElementById("pitchButton").click();
//   }
// }


// MIDI Detect code
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