import { SyntheysizerEvents, note_set, pad_set, dial_set} from './Share.js';

let synth = new Tone.Synth().toDestination();
let noteType = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

let startTime = null;

SyntheysizerEvents.addEventListener('noteInput', function (){
  if(startTime != null){
    let cur_time = new Date().getTime() - startTime;
    console.log("In Circle note: ", note_set.note, cur_time);  //범위가 C0~C10입니다.
  }
})
SyntheysizerEvents.addEventListener('noteRelease', function (){
  if(startTime != null){
    let cur_time = new Date().getTime() - startTime;
    console.log("In Circle note: ", note_set.note, cur_time);  //범위가 C0~C10입니다.
  }
})

SyntheysizerEvents.addEventListener('padInput', function (){
  if(startTime != null){
    let cur_time = new Date().getTime() - startTime;
    console.log("In Circle Pad id: ", pad_set.id, cur_time); //그냥 패드 id입니다. 0~7로 8개가 표시됩니다.
  }
})

SyntheysizerEvents.addEventListener('dialInput', function (){
  if(startTime != null){
    let cur_time = new Date().getTime() - startTime;
    console.log("In Circle dial_value: ", dial_set.value, cur_time);
    $("#volume").slider("value", (dial_set.value[0][0]/127)*100); //여기 다이얼 값 범위가 0~127입니다.
  }
})

function startingRecorder(){
  startTime = new Date().getTime();
}
function endRecorder(){
  startTime = null;
}


