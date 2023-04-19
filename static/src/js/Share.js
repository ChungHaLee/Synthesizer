//공용 변수 관리를 위해 만든 코드

export const SyntheysizerEvents = window;

export const note_set = {
  pitch: 0,
  note: 0,
  value: 0
};

export const pad_set = {
  id: 0,
};

export const dial_set = {
  value: [[0.0, 0.0, 0.0, 0.0],  //순서대로 [[11, 12, 13, 14],
          [0.0, 0.0, 0.0, 0.0]]   //순서대로  [21, 22, 23, 24]]
}; 

export const joystick_set = {
  value:[0, 0]
};

export const MusicClipType = {
  Melody: "Melody",
  Beat: "Beat",
  Base: "Base"
}

const MusicNote = {
  note:"C0",
  intensity : 0.0,
  start: 0.0,
  end: -1.0
}

export class MusicClip {
  constructor (Type, Clip_id, duration = 15, instrument_id =0,) {
      console.log("music Type : ", Type, "Clip_id", Clip_id,  duration = 15);
      this.Type = Type;
      this.Clip_id = Clip_id;
      this.duration = duration;
      this.instrument_id = instrument_id;
      if(Type==MusicClipType.Melody){
        this.melodyNoteSet = [];
        this.melodyTimeset = [];
      }
      if(Type==MusicClipType.Beat){
        this.beatSet = [];
        this.beatTime = [];
      }
  }
  setType(type){
    console.log("Set Type: ", type);
    this.Type = type;
  }

  setNoteInput(note, time) {
    if(this.Type==MusicClipType.Melody){
      //console.log("Pitch input Time:", pitch, time);
      this.melodyNoteSet.push(note);
      this.melodyTimeset.push([time, -1]);
    }
    else{
      alert("This Cilp type is Melody");
    }
  }
  setNoteRelease(note, time) {
    if(this.Type==MusicClipType.Melody){
      //console.log("Pitch Release Time:", pitch, time);
      for (let i = this.melodyNoteSet.length - 1; i >= 0; i--) {
        if (this.melodyNoteSet[i] === note) {
          if(this.melodyTimeset[i][1] == -1){
            this.melodyTimeset[i][1] = time;
            break;
          }
          break;
        }
      }
    }
    else{
      alert("This Cilp type is Melody");
    }
  }
  setBeatInput(pad_id, time) {
    if(this.Type==MusicClipType.Beat){
      //console.log("Beat input Time:", pad_id, time);
      this.beatSet.push(pad_id);
      this.beatTime.push(time);
    }
    else{
      alert("This Clip type is Beat");
    }
  }
  setDuration(duration){
    this.duration = duration;
  }
  serInstrument(instrument_id){
    this.instrument_id;
  }
  getCliptId(){
    return this.Clip_id;
  }
  getClipType(){
    return this.type;
  }
  getNoteIndex(){
    if(this.Type==MusicClipType.Melody){
      return this.melodyNoteSet.length - 1;
    }
    else{
      return this.beatSet.length - 1;
    }
  }

  test(){
    if(this.Type==MusicClipType.Melody){
      return this.melodyTimeset
    }
    else{
      return this.beatTime
    }
  }
}
