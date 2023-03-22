import {JZZ} from "./JZZ.js"
let note = 0;
let synth = new Tone.Synth().toDestination();
let note2pitch = {
  0: "C4",
  1: "C#4",
  2: "D4",
  3: "D#4",
  4: "E4",
  5: "F4",
  6: "F#4",
  7: "G4",
  8: "G#4",
  9: "A4",
  10: "A#4",
  11: "B4",
  12: "C5",
  13: "C#5",
  14: "D5",
  15: "D#5",
  16: "E5",
  17: "F5",
  18: "F#5",
  19: "G5",
  20: "G#5",
  21: "A5",
  22: "A#5",
  23: "B5",
  24: "C6",
  25: "C#6",
  26: "D6"
};


function set_synthesiser(msg, start_note = "30"){
  let synthesiser_msg = get_msg_input(msg)
    switch (synthesiser_msg.input_type){
      case "90":
        synthesiser_piano_mapping(synthesiser_msg.input_id, start_note = "30");
        break;
      case "99":
        synthesiser_pad_mapping(synthesiser_msg.input_id);
        break;
      case "b0":
        //synthesiser_dial_mapping(synthesiser_msg.input_id, synthesiser_msg.input_value);
        break;
      case "e0":
        //synthesiser_console_mapping(synthesiser_msg.input_id, synthesiser_msg.input_value);
        break;
      default:
        break;
      }
}
export { set_synthesiser }

function initialize_note(input = 0){
  note = input;
}
export { initialize_note }

function get_currnt_note(){
  return note
}
export { get_currnt_note }

function synthesiser_piano_mapping(note_id, start_note = "30"){
  let note_num = parseInt(parseInt(note_id, 16) - parseInt(start_note, 16) + 1);
  console.log("piano key : ", note_num);
  synth.triggerAttackRelease(note2pitch[note_num-1], 0.2);
  currnet_note_changed(note_num);
  haptic_play();
  initialize_note(note_num)
}

function synthesiser_pad_mapping(pad_id){
  // if(parseInt(pad_id, 16)<40){
  //   document.getElementById("drum").click();
  // }
  // else{
  //   let templete_id = "templete" + String(parseInt(pad_id, 16) - 40 + 1) +"Button";
  //   document.getElementById(templete_id).click();
  // }
  let note_num = parseInt(pad_id, 16)
  console.log("pad id", note_num);
  haptic_play();
  initialize_note(note_num)
}

function synthesiser_pad_mapping2(pad_id){
  if(parseInt(pad_id, 16) > 39.9 && parseInt(pad_id, 16) < 43.1 ){
    let templete_id = "templete" + String(parseInt(pad_id, 16) - 40 + 1) +"Button";
    document.getElementById(templete_id).click();
  }
}
function synthesiser_dial_mapping(dial_id, value){
  //console.log(dial_id, input_scale_changer(value, ["00", "7f"]));
  switch(dial_id){
    case "46":
      document.getElementById("slide-pitch-interval").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-pitch-interval").click();
      break;
    case "47":
      document.getElementById("slide-pitch-size").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-pitch-size").click();
      break;
    case "48":
      document.getElementById("slide-beat-size").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-beat-size").click();
      break;
    case "49":
      document.getElementById("slide-haptic-amplitude").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-haptic-amplitude").click();
      break;
    case "4d":
      document.getElementById("slide-haptic-frequency").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-haptic-frequency").click();
      break;
    case "4a":
      document.getElementById("slide-haptic-attack").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-haptic-attack").click();
      break;
    case "4b":
      document.getElementById("slide-haptic-decay").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-haptic-decay").click();
      break;
    case "4c":
      document.getElementById("slide-haptic-sustain").value =input_scale_changer(value, ["00", "7f"])
      document.getElementById("slide-haptic-sustain").click();
      break;
    default:
      break;
  }
}

function synthesiser_console_mapping(console_id, value){
  //console.log(console_id, input_scale_changer(value,["00", "7f"]));
  if(input_scale_changer(value,["00", "7f"]) > 60){
    document.getElementById("beatButton").click();
  }
  else if(input_scale_changer(value,["00", "7f"]) < 20){
    document.getElementById("pitchButton").click();
  }
}

function input_scale_changer(input, [min_input, max_input], [min_int, max_int] = [0, 100]){
  return parseInt((parseInt(input, 16) - parseInt(min_input, 16)) * (max_int - min_int) / (parseInt(max_input, 16) - parseInt(min_input, 16)))
}


function get_msg_input(msg){
  // output list : [input_type, input_id, input_value, bool(OnOff)]
  return {
    input_type: msg.substr(0,2), 
    input_id: msg.substr(3,2), 
    input_value: msg.substr(6,2)
  }
}
function on_off_checker(string){
  if(string == "On"){
    return true;
  }
  else{
    return false;
  }
}
function currnet_note_changed(note){
  document.getElementById("currnet_note").innerHTML = String(note);
}
function haptic_play(){
  document.getElementById('haptic_button').click()
}


var midi_in;
let open_midi = document.querySelector('[data-action="open_midi_in"]');
open_midi.addEventListener('click', event => {
  midi_in = JZZ().openMidiIn()
  .or(function(){document.getElementById("midiInName").innerHTML = "Cannot open!";})
  .and(function(){document.getElementById("midiInName").innerHTML = this.name(); console.log(this.info());})
  .connect(function(msg){
    //console.log(msg.toString());
    set_synthesiser(msg.toString(), "30", 1);
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