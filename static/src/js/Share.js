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
  value: 0
};

export const dial_set = {
  value: [[0.0, 0.0, 0.0, 0.0], 
          [0.0, 0.0, 0.0, 0.0]]  //순서대로  [21, 22, 23, 24]]
}; 

export const joystick_set = {
  value:[0, 0]
};  

export const MusicClipType = {
  Mood: "Mood",
  Melody: "Melody",
  Beat: "Beat",
  Lyrics:"Lyrics",
  Template: "Template"
}

const MusicNote = {
  note:"C0",
  intensity : 0.0,
  start: 0.0,
  end: -1.0
}
export class TemplateClip{
  constructor(Clip_id, duration = 60, instrument = 0){
    this.Clip_id = Clip_id;
    this.duration = duration;
    this.instrument = instrument;
    this.dial_set = [[0.0, 0.0, 0.0, 0.0], 
                     [0.0, 0.0, 0.0, 0.0]]
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

class VideoObject{
  constructor(videoId, videoData, videoDuration){{
    this.videoId = videoId;
    this.videoData = videoData;
    this.videoDuration = videoDuration;
  }}
}


export class VideoClip{
  constructor (videoId = [], videoData = [], videoDuration = []){ 
    this.videoId = videoId;
    this.videoData = videoData;
    this.videoDuration = videoDuration;
  }
  setVideo(videoId, videoData, videoDuration){
    this.videoId.push(videoId);
    this.videoData.push(videoData);
    this.videoDuration.push(videoDuration);
  }
  getVideoData(videoId){
    if (videoId >= 0 && videoId < this.videoId.length){
      // console.log(this.videoId)
      // console.log(videoId)
      // let index = this.videoId.indexOf(videoId);
      // console.log("get id :", videoId, "index :", index)
      return this.videoData[videoId]
    }
    else{
      console.log("Data index out of bounds");
      return null
    }
  }
  getVideoDuration(videoId){
    if (videoId >= 0 && videoId < this.videoId.length){
      // console.log(this.videoId)
      // console.log(videoId)
      // let index = this.videoId.indexOf(videoId);
      // console.log("get id :", videoId, "index :", index)
      return this.videoDuration[videoId]
    }
    else{
      console.log("Data index out of bounds");
      return null
    }
  }
}

export class MusicClip {
  constructor (Type, Clip_id, duration = 60, arraySet = [], timeSet = [], lyricSet = [], lyrictimeSet = [], lyricsVideoId = []) {
      console.log("music Type : ", Type, "Clip_id", Clip_id,  "duration", duration);
      this.Type = Type;
      this.Clip_id = Clip_id;
      this.duration = duration;
      if(Type==MusicClipType.Melody){
        this.melodyNoteSet = arraySet;
        this.melodyTimeset = timeSet;
        this.melodyNoteId = arraySet.length;

        this.lyricSet = lyricSet;
        this.lyrictimeSet = lyrictimeSet;
        this.lyricId = lyricSet.length;
        this.lyricsVideoId = lyricsVideoId
      }
      if(Type==MusicClipType.Beat){
        this.beatSet = arraySet;
        this.beatTime = timeSet;
        this.beatSetId = arraySet.length;
      }
  }
  setType(type){
    this.Type = type;
  }
  setNoteInput(note, time) {
    if(this.Type==MusicClipType.Melody){
      this.melodyNoteSet.push(note);
      this.melodyTimeset.push([time, -1]);
      this.melodyNoteId +=1;
    }
    else{
      alert("This Cilp type is Melody");
    }
  }
  setNoteRelease(note, time) {
    if(this.Type==MusicClipType.Melody){
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
      this.beatSet.push(pad_id);
      this.beatTime.push(time);
      this.beatSetId+=1;
    }
    else{
      alert("This Clip type is Beat");
    }
  }
  setDuration(duration){
    this.duration = duration;
  }
  setInstrument(instrument_id){
    this.instrument_id = instrument_id;
  }
  setLyrics(lyric, timeset){
    this.lyricSet.push(lyric);
    this.lyrictimeSet.push(timeset);
    this.lyricId += 1;
    this.lyricsVideoId.push(-1);
  }
  setLyricsVideo(lyricsId, vidoeId){
    this.lyricsVideoId[lyricsId] = vidoeId;
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
  editLyrics(lyricid, deltaTimeset){
    if(this.Type==MusicClipType.Melody){
      this.lyrictimeSet[lyricid][0] += deltaTimeset[0];
      this.lyrictimeSet[lyricid][1] += deltaTimeset[1];
    }
  }
  deleteNote(noteIndex){
    if(this.Type==MusicClipType.Melody){
      this.melodyNoteSet.splice(noteIndex,1);
      this.melodyTimeset.splice(noteIndex,1);
    }
    else{
      this.beatSet.splice(noteIndex,1);
      this.beatTime.splice(noteIndex,1);
    }
  }
  deletelyric(lyricId){
    if(this.Type==MusicClipType.Melody){
      this.lyricSet.splice(lyricId,1);
      this.lyrictimeSet.splice(lyricId,1);
      this.lyricsVideoId.push(lyricId,1);
    }
  }
  dleteAlllyric(){
    if(this.Type==MusicClipType.Melody){
      this.lyricSet =[];
      this.lyrictimeSet=[];
      this.lyricId = 0;
      this.lyricsVideoId = [];
    }
  }
  getClipLastTime(){
    let lastTime = 1;
    if(this.Type == MusicClipType.Melody){
      for(let i=0; i<this.melodyTimeset.length; i++){
        if(lastTime < this.melodyTimeset[i][1]){
          lastTime = this.melodyTimeset[i][1]
        }
      }
      for(let i=0; i<this.lyrictimeSet.length; i++){
        if(lastTime < this.lyrictimeSet[i][1]){
          lastTime = this.lyrictimeSet[i][1]
        }
      }
      return lastTime
    }
    else{
      for(let i=0; i<this.beatTime.length; i++){
        if(lastTime < this.beatTime[i]){
          lastTime = this.beatTime[i]
        }
      }
      return lastTime
    }
  }
  getLyricsVideoId(lyricsId){
    return this.lyricsVideoId[lyricsId];
  }
  getClipId(){
    return this.Clip_id;
  }
  getClipType(){
    return this.Type;
  }
  getDuration(){
    return parseFloat(this.duration);
  }
  getNoteIndex(){
    if(this.Type==MusicClipType.Melody){
      return this.melodyNoteId;
    }
    else{
      return this.beatSetId;
    }
  }
  getLyricsIndex(){
    return this.lyricId;
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

  getLyrics(currentTime){
    //console.log(this.lyricSet, this.lyrictimeSet)
    for (let i = 0; i < this.lyrictimeSet.length; i++) {
      if (this.lyrictimeSet[i][0] <= currentTime && currentTime < this.lyrictimeSet[i][1]) {
        return [this.lyricSet[i], i];
      }
    }
    return ["", -1];
  }
  getLyricsTimeset(lyricsId){
    if (lyricsId < this.lyrictimeSet.length && lyricsId >= 0 ){ 
      return [this.lyrictimeSet[lyricsId][0], this.lyrictimeSet[lyricsId][1]];
    }
    else{
      return [null, null]
    }
  }
  getLyricsLastTime(){
    let lastTime = 0;
    if(this.Type == MusicClipType.Melody){
      for(let i=0; i<this.lyrictimeSet.length; i++){
        if(lastTime < this.lyrictimeSet[i][1]){
          lastTime = this.lyrictimeSet[i][1]
        }
      }
    }
    return lastTime
  }
  getLyricsText(lyricsId){
    return this.lyricSet[lyricsId];
  }
  getAllLyrics(){
    return [this.lyricSet, this.lyrictimeSet, this.lyricsVideoId];
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
      let duration = parseFloat(musicClip.getDuration());
      this.MelodyTimeset.push([clipTime, clipTime + duration]);
      console.log("Add Melody box", this.MelodyClipIdList);
    }
    else{
      this.BeatClipIdList.push(musicClip.getClipId());
      let duration = parseFloat(musicClip.getDuration());
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
    //console.log(this.BeatTimeset);
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
  getTemplateSet(){
    return [this.TemplateIdClip, this.TemplateTimeset]
  }
  getMelodySet(){
    return [this.MelodyClipIdList, this.MelodyTimeset]
  }
  getBeatSet(){
    return [this.BeatClipIdList, this.BeatTimeset]
  }
  deleteClip(clipType, clipIndex){
    console.log("delete Track", clipType, clipIndex);
    if(clipType != null){
      if(clipType == MusicClipType.Template){
        this.TemplateIdClip.splice(clipIndex,1)
        this.TemplateTimeset.splice(clipIndex,1)
      }
      else if(clipType == MusicClipType.Melody){
        this.MelodyClipIdList.splice(clipIndex,1)
        this.MelodyTimeset.splice(clipIndex,1)
      }
      else{
        this.BeatClipIdList.splice(clipIndex,1)
        this.BeatTimeset.splice(clipIndex,1)
      }
    }
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