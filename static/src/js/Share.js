export const SyntheysizerEvents = window;

export const note_set = {
  pitch: 0,
  note: 0,
  value: 0
};
export const poly_note_set = {
  pitch: [],
  note : [],
  value : []
}

export const pad_set = {
  id: 0,
};

export const dial_set = {
  value: [[50.0, 50.0, 50.0, 50.0], 
          [50.0, 50.0, 50.0, 50.0]]  //순서대로  [21, 22, 23, 24]]
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
export class TemplateClip{
  constructor(Clip_id, duration = 30, instrument = 0){
    this.Clip_id = Clip_id;
    this.duration = duration;
    this.instrument = instrument;
    this.dial_set = [[50.0, 50.0, 50.0, 50.0], 
                     [50.0, 50.0, 50.0, 50.0]]
  }
  set_dial(dial_set){
    this.dial_set = dial_set
  }
  set_duration(duration){
    this.duration = duration;
  }
  get_Clip_id(){
    return this.Clip_id;
  }
  get_duration(){
    return this.duration;
  }
  get_instrument(){
    return this.instrument;
  }
  get_dial(){
    return this.dial_set;
  }
}


export class MusicClip {
  constructor (Type, Clip_id, duration = 30) {
      console.log("music Type : ", Type, "Clip_id", Clip_id,  "duration", duration);
      this.Type = Type;
      this.Clip_id = Clip_id;
      this.duration = duration;
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
  constructor (userId = 0, id_set = [[],[],[]], time_set = [[], [], []]){
    this.userId = userId;

    this.TemplateIdClip = id_set[0];
    this.MelodyClipIdList = id_set[1];
    this.BeatClipIdList = id_set[2];

    this.TemplateTimeset = time_set[0];
    this.MelodyTimeset = time_set[1];
    this.BeatTimeset = time_set[2];
  }
  setMusicClip(musicClip, clipTime){
    if(musicClip.getClipType() == MusicClipType.Melody){
      this.MelodyClipIdList.push(musicClip.getClipId());
      let duration = musicClip.getDuration();
      this.MelodyTimeset.push([clipTime, clipTime + duration]);
      console.log("Add Melody box", this.MelodyClipIdList);
    }
    else{
      this.BeatClipIdList.push(musicClip.getClipId());
      let duration = musicClip.getDuration();
      this.BeatTimeset.push([clipTime, clipTime + duration]);
      console.log("Add Beat box", this.BeatClipIdList);
    }
  }
  setTemplateClip(templateId, clipTime){  //지금 코드가 조금 꼬여서 임의로 Template은 30초 길이로 고정
    this.TemplateIdClip.push(templateId);
    this.TemplateTimeset.push([clipTime, clipTime + 30]);
    console.log("Add Template box", this.TemplateIdClip);
  }
  editMusicClip(type, clip_id, deltaTime){
    if(type == MusicClipType.Melody){
      this.MelodyTimeset[clip_id][0] += deltaTime;
      this.MelodyTimeset[clip_id][1] += deltaTime;
    }
    else{
      this.BeatTimeset[clip_id][0] += deltaTime;
      this.BeatTimeset[clip_id][1] += deltaTime;
    }
  }
  getTempalateId(){
    return this.TemplateIdClip.length;
  }
  getMelodyId(){
    return this.MelodyClipIdList.length;
  }
  getBeatId(){
    return this.BeatClipIdList.length;
  }
  getcurrentClipSet(currentTime){
    const Meldoy_set = []
    const Beat_set = []
    const Template_set = []
    for (let i = 0; i < this.TemplateTimeset.length; i++) {
      if (this.TemplateTimeset[i][0] <= currentTime && currentTime < this.TemplateTimeset[i][1]) {
        Template_set.push(this.TemplateTimeset[i][0]);  // 시간이 먼저
        Template_set.push(this.TemplateIdClip[i]);
      }
    }
    for (let i = 0; i < this.MelodyTimeset.length; i++) {
      if (this.MelodyTimeset[i][0] <= currentTime && currentTime < this.MelodyTimeset[i][1]) {
        Meldoy_set.push(this.MelodyTimeset[i][0]);
        Meldoy_set.push(this.MelodyClipIdList[i]);
      }
    }
    for (let i = 0; i < this.BeatTimeset.length; i++) {
      if (this.BeatTimeset[i][0] <= currentTime && currentTime < this.BeatTimeset[i][1]) {
        Beat_set.push(this.BeatTimeset[i][0]);
        Beat_set.push(this.BeatClipIdList[i]);
      }
    }
    return [Template_set, Meldoy_set, Beat_set];  //순서는 항상 Template, Melody, Beat로 고정
  }
  getUserId(){
    return this.userId;
  }
  getIdData(){
    return [this.TemplateIdClip, this.MelodyClipIdList, this.BeatClipIdList]
  }
  getTimeData(){
    return [this.TemplateTimeset, this.MelodyTimeset, this.BeatTimeset]
  }
  // setMusicClip(Melody_clip_array){  //Track의 Clip 정리 코드
  //   const MaxId = Math.max.apply(null, this.MelodyClipIdList);
  // }
  // setBeatClip(Beat_clip_array){  //Track의 Clip 정리 코드
  //   const MaxId = Math.max.apply(null, this.BeatClipIdList);
  // }
  // saveTrack(){
  //   console.log("save the Music Track");
  // }
}