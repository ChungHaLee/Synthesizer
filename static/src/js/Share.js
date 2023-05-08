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
  Template: "Template"
}

const MusicNote = {
  note:"C0",
  intensity : 0.0,
  start: 0.0,
  end: -1.0
}

export class MusicClip {
  constructor (Type, Clip_id, duration = 15, instrument_id = 0) {
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
    this.instrument_id = instrument_id;
  }
  editNote(noteIndex, deltaTimeset){
    if(this.Type==MusicClipType.Melody){
      this.melodyTimeset[noteIndex][0] += deltaTimeset[0];
      this.melodyTimeset[noteIndex][1] += deltaTimeset[1];
    }
    else{
      this.beatTime[noteIndex] += deltaTimeset[0];
    }
  }
  getClipId(){
    return this.Clip_id;
  }
  getClipType(){
    return this.Type;
  }
  getDuration(){
    return this.duration;
  }
  getNoteIndex(){
    if(this.Type==MusicClipType.Melody){
      return this.melodyNoteSet.length - 1;
    }
    else{
      return this.beatSet.length - 1;
    }
  }
  getMusicClip(){
    if(this.Type==MusicClipType.Melody){
      return [this.melodyNoteSet, this.melodyTimeset]
    }
    else{
      return [this.beatSet, this.beatTime]
    }
  }

  getcurrentNoteSet(currentTime){
    const noteSet = []
    if(this.Type==MusicClipType.Melody){
      //return [this.melodyNoteSet, this.melodyTimeset]
      for (let i = 0; i < this.melodyTimeset.length; i++) {
        if (this.melodyTimeset[i][0] <= currentTime && currentTime < this.melodyTimeset[i][1]) {
          noteSet.push(this.melodyNoteSet[i]);
        }
      }
      return noteSet;
    }
    else{
      //return [this.beatSet, this.beatTime]
      for (let i = 0; i < this.beatTime.length; i++) {
        if (this.beatTime[i] - 1/60 <= currentTime && currentTime < this.beatTime[i] + 1/60) {
          noteSet.push(this.beatSet[i]);
        }
      }
      return noteSet;
    }
  }
}

export class MusicTrack{
  constructor (userId = 0, Track_name = "MusicTrack"){
    this.userId = userId;
    this.Track_name = Track_name;
    this.TemplateClip = [];
    this.MelodyClipIdList = [];
    this.BeatClipIdList = [];
    this.TemplateTime = [];
    this.MelodyTime = [];
    this.BeatTime = [];
  }
  setMusicClip(musicClip, clipTime){
    if(MusicClip.getClipType == MusicClipType.Melody){
      this.MelodyClipIdList.push(musicClip.getClipId);
      this.MelodyTime.push(clipTime);
    }
    else{
      this.BeatClipIdList.push(musicClip.getClipId);
      this.BeatTime.push(clipTime);
    }
  }
  setTemplateClip(templateClip, clipTime){
    this.MelodyClipIdList.push(0);
    this.MelodyTime.push(clipTime);
  }
  setMusicClip(Melody_clip_array){  //Track의 Clip 정리 코드
    const MaxId = Math.max.apply(null, this.MelodyClipIdList);
  }
  setBeatClip(Beat_clip_array){  //Track의 Clip 정리 코드
    const MaxId = Math.max.apply(null, this.BeatClipIdList);
  }
  saveTrack(){
    console.log("save the Music Track");
  }
}