import { SyntheysizerEvents, MusicClip, MusicClipType, MusicTrack, TemplateClip} from './Share.js';
import {piano_player, beat_player, dialInitialize} from './Synthesizer.js';
//최소 범위 A2 ~ C7

const clip_box_width = 1880;
const clip_start_px = 60;
const fps = 30;
let currentTime = 0.0;
let currentTime_track = 0.0;
let play_state = false;
let play_state_track = false;
let timer = null;
let duration = 30
let duration_track = 300;

let clipduration = document.getElementById("clipduration");
let timeLine1 = document.getElementById("timeLine1");
let timeLine2 = document.getElementById("timeLine2");
let timeLine3 = document.getElementById("timeLine3");
let FileInput = document.getElementById("fileUpload");

let Template_clip_array = [];
let Melody_clip_array = [];
let Beat_clip_array = [];
let current_clip_type = MusicClipType.Melody;
let melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
let beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
let template_clip = new TemplateClip(Template_clip_array.length);
let onNoteList = [];
let previousNote = [];
let previousNote_track = [];
let TrackObject = new MusicTrack();




function InitializeAllSetting(){
  currentTime = 0.0;
  currentTime_track = 0.0;
  play_state = false;
  play_state_track = false;
  duration_track = 300;
  Template_clip_array = [];
  Melody_clip_array = [];
  Beat_clip_array = [];
  melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
  beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
  template_clip = new TemplateClip(Template_clip_array.length);
  current_clip_type = MusicClipType.Melody;
  onNoteList = [];
  previousNote = [];
  previousNote_track = [];
  TrackObject = new MusicTrack();
  stopRecording();
  stopTrack();
  clearNoteClip(MusicClipType.Beat);
  clearNoteClip(MusicClipType.Melody);
  clearAllBoxClip();
  initializeTimer();
  initializeTimer2();
}

clipduration.addEventListener("change", function(){//Clip의 시간을 바꾸면 실행하는 코드
  duration = parseFloat(clipduration.value);
  noteSizeAllOff();
  clearNoteClip(current_clip_type);
  if(time_to_px(currentTime, duration) >= clip_box_width){
    $("#slider").slider("value", clip_box_width);
    timeLine2.style.left = clip_box_width + "px";
    timeLine1.style.left = clip_box_width + "px";
  }
  else{
    $("#slider").slider("value",time_to_px(currentTime, duration));
    timeLine2.style.left = time_to_px(currentTime, duration) + "px";
    timeLine1.style.left = time_to_px(currentTime, duration) + "px";
  }
  if(current_clip_type == MusicClipType.Melody){
    melody_clip.setDuration(duration);
    template_clip.set_duration(duration);
    loadClip(melody_clip, duration);
  }
  else{
    beat_clip.setDuration(duration);
    loadClip(beat_clip, duration);
  }
})
function startRecording(){//Timer를 시작하는 코드
  play_state = true;
  startTimer();
}
function stopRecording(){//Timer를 중지하는 코드
  play_state = false;
  noteSizeAllOff();
  stopTimer();
}
function updateTime() { //시간에 따라 업데이트 해야하는 함수들
  currentTime += 1/fps;
  musicPlayer(currentTime);
  $("#slider").slider("value",time_to_px(currentTime, duration));
  timeLine2.style.left = time_to_px(currentTime, duration) + "px";
  timeLine1.style.left = time_to_px(currentTime, duration) + "px";
  // console.log(onNoteList[0].style.left, time_to_px(currentTime, duration) + "px")
  for (let item of onNoteList){
    noteResizeChanger(item, time_to_px(currentTime, duration));
  }
  
  if(currentTime >= duration){
    stopRecording() //끝 도달하면 자동으로 종료
  }
}
function musicPlayer(currentTime){  //음이나 비트 소리를 재생하는 코드
  if(current_clip_type == MusicClipType.Melody){
    let currentNote = melody_clip.getcurrentNoteSet(currentTime)
    notePlayer(currentNote, previousNote);
    previousNote = melody_clip.getcurrentNoteSet(currentTime);
  }
  else{
    let currentBeat = beat_clip.getcurrentNoteSet(currentTime);
    for (let beat of currentBeat){
      beat_player(beat)
    }
  }
}
function notePlayer(currentNote, previousNote){ //피아노 음 재생용 함수
  //console.log(currentNote, previousNote);
  //piano_player(currentNote[0], true);
  var exclusiveArr1 = currentNote.filter(function(val) {
    return previousNote.indexOf(val) === -1;
  });
  var exclusiveArr2 = previousNote.filter(function(val) {
    return currentNote.indexOf(val) === -1;
  });
  if(exclusiveArr1.length > 0){
    //console.log("Inpnut", exclusiveArr1);
    for( let note of exclusiveArr1){
      piano_player(note, true);
    }  
  }
  if(exclusiveArr2.length > 0){
    //console.log("Ouput ", exclusiveArr2);
    for( let note of exclusiveArr2){
      piano_player(note, false);
    }  
  }
}
function stopAllNotePlayer(){
  if(previousNote.length > 0){
    //console.log("Ouput ", exclusiveArr2);
    for( let note of previousNote){
      piano_player(note, false);
    }  
  }
  previousNote - []
}

function startTimer() {
  if (!timer) { // 타이머가 이미 실행 중이지 않은 경우에만 실행
    timer = setInterval(updateTime, 1 / fps * 1000); // 0.01초 간격으로 updateTime 함수 실행
  }
}
function stopTimer() {
  clearInterval(timer); // 타이머 정지
  timer = null; // 타이머 변수 초기화
}

$("#slider").slider({ //Timer 슬라이더
  value: clip_start_px,
  min: clip_start_px,
  max: clip_box_width,
  step: 0.01,
  slide: function( event, ui ) {
    timeLine1.style.left = (ui.value) + "px";
    timeLine2.style.left = (ui.value) + "px";
    currentTime = px_to_time(ui.value, duration);
    noteSizeAllOff();
  }
});
function initializeTimer(){ //Timer 초기화
  stopRecording();
  currentTime = 0.0;
  $("#slider").slider("value",time_to_px(currentTime, duration));
  timeLine2.style.left = time_to_px(currentTime, duration) + "px";
  timeLine1.style.left = time_to_px(currentTime, duration) + "px";
}

function time_to_px(time, duration){ //Time을 Px로 변환하는 코드
  return clip_start_px + time / duration * (clip_box_width - clip_start_px)
}
function px_to_time(px, duration){  //Px을 Time으로 변환하는 코드
  return (px - clip_start_px) * duration / (clip_box_width - clip_start_px)
}
function px_to_time_Scale(px, duration){  //Px을 Time으로 변환하는 코드
  return px * duration / (clip_box_width - clip_start_px)
}

function createResizeDragElement(note, leftPosition, noteId, type) { //Melody, Beat 노트 생성
  const Itemid = "box_" + note; 
  const boxItem = document.getElementById(Itemid); //노트에 해당하는 Box를 찾아오기(속도가 더 빠름)
  const resizeDrag = document.createElement("div");
  if(type == MusicClipType.Melody){
    resizeDrag.classList.add("resize-drag");  // resize-drag로 생성
  }
  else{
    resizeDrag.classList.add("draggable");  // resize-drag로 생성
  }
  resizeDrag.textContent = " "; //내용이 있어야 나와서 -로 일단 임시로 추가
  resizeDrag.style.left = leftPosition + "px"; // left 스타일 추가
  resizeDrag.setAttribute("note_id", noteId); // note_id 속성 추가
  resizeDrag.setAttribute("note", note); // note_id 속성 추가
  boxItem.appendChild(resizeDrag);
  return resizeDrag
}
function noteResizeChanger(noteObejct, target_pix){
  const currentWidth = 10;  //Meldoy 음표의 최소 길이값(css에서 변경시 바꿔야함)
  const currentleft = parseFloat(noteObejct.style.left);
  if(currentWidth < target_pix - currentleft){
    noteObejct.style.width = (target_pix - currentleft) + "px";
  }
}
function noteSizeAllOff(){ //Note 변화용 array 초기화
  for (let i = 0; i < onNoteList.length; i++) {
    melody_clip.setNoteRelease(onNoteList[i].getAttribute("note"), currentTime);
  }
  onNoteList = [];
}
function noteOff(note){//Note 변화 설정 초기화
  for (let i = 0; i < onNoteList.length; i++) {
    if (onNoteList[i].getAttribute("note") === note) {
      onNoteList.splice(i, 1);
      break;
    }
  }
}

document.getElementById("sheetMusicMelodyButton").addEventListener('click', function (){
  current_clip_type = MusicClipType.Melody;
  document.getElementById("BeatContainer").style.display = 'none' 
  document.getElementById("MelodyContainer").style.display = 'block'
})
document.getElementById("sheetMusicBeatButton").addEventListener('click', function (){
  current_clip_type = MusicClipType.Beat;
  document.getElementById("BeatContainer").style.display = 'block'
  document.getElementById("MelodyContainer").style.display = 'none'
})
document.getElementById("sheetMusicSaveButton").addEventListener('click', function (){
  if(current_clip_type == MusicClipType.Melody){     //멜로디 클립 저장 시
    if(melody_clip.getNoteIndex() != -1){
      createClipBox(melody_clip);
      Melody_clip_array.push(melody_clip);
      melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
      Template_clip_array.push(template_clip);
      template_clip = new TemplateClip(Template_clip_array.length);
      //dialInitialize();
      alert("Melody Clip saved")
      clearNoteClip(MusicClipType.Melody);
      initializeTimer();
    }
    else{
      alert("There isn't any note in clip");
    }
  }
  else{                                         //비트   클립 저장시
    if(beat_clip.getNoteIndex() != -1){
      createClipBox(beat_clip);
      Beat_clip_array.push(beat_clip);
      beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
      alert("Beat Clip saved")
      clearNoteClip(MusicClipType.Beat);
      initializeTimer();
    }
    else{
      alert("There isn't any note in clip");
    }
  }
})
document.getElementById("sheetMusicPlayButton").addEventListener('click', function (){
  startRecording();
})
document.getElementById("sheetMusicPauseButton").addEventListener('click', function (){
  stopRecording();
  stopAllNotePlayer();
})

SyntheysizerEvents.addEventListener('noteInput', function (e){
  if(play_state && current_clip_type == MusicClipType.Melody){
    melody_clip.setNoteInput(e.detail.note, currentTime);
    let NoteItem = createResizeDragElement(e.detail.note, time_to_px(currentTime, duration), melody_clip.getNoteIndex(), MusicClipType.Melody);
    onNoteList.push(NoteItem); 
  }
})
SyntheysizerEvents.addEventListener('noteRelease', function (e){
  if(play_state && current_clip_type == MusicClipType.Melody){
    melody_clip.setNoteRelease(e.detail.note, currentTime);
    noteOff(e.detail.note)
  }
})
SyntheysizerEvents.addEventListener('padInput', function (e){
  if(play_state && current_clip_type == MusicClipType.Beat){
    beat_clip.setBeatInput(e.detail.id, currentTime);
    let PadItem = createResizeDragElement(e.detail.id, time_to_px(currentTime, duration), beat_clip.getNoteIndex(), MusicClipType.Beat);
  }
})
SyntheysizerEvents.addEventListener('dialInput', function(e){
  template_clip.set_dial(e.detail.value);
})




function removeAllElementsByClassName(className) {//
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function clearNoteClip(type){// 편집기에 모든 노트 제거
  if(type == MusicClipType.Melody){
    removeAllElementsByClassName("resize-drag");
  }
  else{
    removeAllElementsByClassName("draggable");
  }
}

function loadClip(MusicClip, duration){//입력 클립을 편집기에 반영
  if(MusicClip.getClipType() == MusicClipType.Melody){
    const [NoteSet, TimeSet] = MusicClip.getMusicClip()
    for(let i=0; i<NoteSet.length; i++){
      console.log(NoteSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Melody)
      let NoteItem = createResizeDragElement(NoteSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Melody);
      noteResizeChanger(NoteItem, time_to_px(TimeSet[i][1], duration));
    }
  }
  else{
    const [padSet, TimeSet] = MusicClip.getMusicClip()
    for(let i=0; i<padSet.length; i++){
      console.log(padSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Beat)
      let NoteItem = createResizeDragElement(padSet[i], time_to_px(TimeSet[i], duration), i, MusicClipType.Beat);
    }
  }
}
function changeMusicClip(noteIndex, deltaTimeset){//노트 위치, 크기 편집을 클립 시간에 반영
  if(current_clip_type = MusicClipType.Melody){
    melody_clip.editNote(noteIndex, deltaTimeset)
  }
  else{
    beat_clip.editNote(noteIndex, deltaTimeset)
  }
}

//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//------------------------------------------- Track용 추가 코드 ------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//

//Track Clip Icon 생성용 코드
function createClipBox(musicClip) { //Melody, Beat 노트 생성
  let currenctCliptType = musicClip.getClipType();
  let clip_id = musicClip.getClipId();
  //let clip_id = 0
  const dragdrop = document.createElement("div");
  dragdrop.classList.add("drag-drop");  // resize-drag로 생성
  dragdrop.setAttribute("clip_id", clip_id); // clip_id 속성 추가
  dragdrop.setAttribute("clip_type", currenctCliptType); // clip_type 속성 추가
  if(currenctCliptType == MusicClipType.Melody){
    dragdrop.textContent = "Melody_" + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
    dragdrop.setAttribute("id", "melody-drop");
    let boxItem = document.getElementById("MelodydropContainer");
    boxItem.appendChild(dragdrop);

    //Template Icon 생성은 Melody 생성에 동시에 만들어지도록 설정
    const dragdrop_template = document.createElement("div");
    dragdrop_template.classList.add("drag-drop");  // resize-drag로 생성
    dragdrop_template.setAttribute("clip_id", clip_id); // clip_id 속성 추가
    dragdrop_template.setAttribute("clip_type", MusicClipType.Template); // clip_type 속성 추가
    dragdrop_template.textContent = "Template_" + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
    dragdrop_template.setAttribute("id", "template-drop");
    let boxItem_template = document.getElementById("TemplatedropContainer");
    boxItem_template.appendChild(dragdrop_template);
  }
  else{
    dragdrop.textContent = "Beat_" + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
    dragdrop.setAttribute("id", "beat-drop");
    let boxItem = document.getElementById("BeatdropContainer");
    boxItem.appendChild(dragdrop);
  }
}

//Track Clip Object 생성용 코드(melody, Beat용)
function createTrackClipObject(dropzoneName, musicClip, box_id){
  let currenctCliptType = musicClip.getClipType();
  let clip_id = musicClip.getClipId();
  let duration = musicClip.getDuration();
  console.log("duration Check", duration);
  const trackClip = document.createElement("div");
  trackClip.classList.add("draggable_clip");
  trackClip.style.width = duration * 10 + "px"

  if(currenctCliptType == MusicClipType.Melody){
    trackClip.textContent = "Melody_" + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
    //dragdrop.setAttribute("id", "melody-drop");
  }
  else{
    trackClip.textContent = "Beat_" + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
    //dragdrop.setAttribute("id", "beat-drop");
  }
  let boxItem = document.getElementById(dropzoneName);
  trackClip.setAttribute("box_id", box_id); // clip_id 속성 추가
  trackClip.setAttribute("box_type", currenctCliptType); // clip_type 속성 추가
  boxItem.appendChild(trackClip);
  return trackClip.offsetLeft
}

//Track Clip Object 생성용 코드(Template용)
function createTrackClipObject_template(dropzoneName, clip_id, box_id){
  const trackClip = document.createElement("div");
  trackClip.classList.add("resize-drag_clip");
  trackClip.style.width = duration * 10 + "px"
  let boxItem = document.getElementById(dropzoneName);
  trackClip.textContent = "Template_" + clip_id
  trackClip.setAttribute("box_id", box_id); // clip_id 속성 추가
  trackClip.setAttribute("box_type", MusicClipType.Template); // clip_type 속성 추가
  boxItem.appendChild(trackClip);
  return trackClip.offsetLeft
}


//clip 정보를 가져오는 코드
function get_clip(clipType, clip_id){
  if(clipType == MusicClipType.Melody){
    return Melody_clip_array[clip_id]
    //dragdrop.setAttribute("id", "melody-drop");
  }
  else{
    return Beat_clip_array[clip_id]
    //dragdrop.setAttribute("id", "beat-drop");
  }
}

$("#slider_track").slider({ //Timer 슬라이더2
  value: 0,
  min: 0,
  max: duration_track*10,
  step: 0.1,
  slide: function( event, ui ) {
    timeLine3.style.left = (ui.value) + "px";
    currentTime_track = ui.value/10;
  }
});
function startTrack(){//Timer를 시작하는 코드
  play_state_track = true;
  startTimer2();
}
function stopTrack(){//Timer를 중지하는 코드
  play_state_track = false;
  stopTimer2();
}
function startTimer2() {
  if (!timer) { // 타이머가 이미 실행 중이지 않은 경우에만 실행
    timer = setInterval(updateTime2, 1 / fps * 1000); // 0.01초 간격으로 updateTime 함수 실행
  }
}
function stopTimer2() {
  clearInterval(timer); // 타이머 정지
  timer = null; // 타이머 변수 초기화
}

function updateTime2() { //시간에 따라 업데이트 해야하는 함수들
  currentTime_track += 1/fps;
  //musicPlayer(currentTime);
  $("#slider_track").slider("value",currentTime_track*10);
  timeLine3.style.left = (currentTime_track*10) + "px";
  let cur_track_set = TrackObject.getcurrentClipSet(currentTime_track);
  //console.log("Test Track", cur_track_set);
  if(cur_track_set[0].length > 0){
    templatePlayerClip(Template_clip_array[cur_track_set[0][1]]);
  }
  if(cur_track_set[1].length > 0){
    musicPlayerMelodyClip(currentTime_track - cur_track_set[1][0], Melody_clip_array[cur_track_set[1][1]]);
  }
  if(cur_track_set[2].length > 0){
    musicPlayerBeatClip(currentTime_track - cur_track_set[2][0], Beat_clip_array[cur_track_set[2][1]]);
  }
  if(currentTime_track >= duration_track){
    stopRecording() //끝 도달하면 자동으로 종료
  }
}

function initializeTimer2(){ //Timer 초기화
  stopTrack();
  currentTime_track = 0.0;
  $("#slider_track").slider("value",currentTime_track*10);
  timeLine3.style.left = currentTime_track + "px";
}

function musicPlayerMelodyClip(currentTime, melody_clip){  //음이나 비트 소리를 재생하는 코드
  let currentNote = melody_clip.getcurrentNoteSet(currentTime);
  notePlayer(currentNote, previousNote_track);
  previousNote_track = melody_clip.getcurrentNoteSet(currentTime);
}

function musicPlayerBeatClip(currentTime, beat_clip){  //음이나 비트 소리를 재생하는 코드
  let currentBeat = beat_clip.getcurrentNoteSet(currentTime);
  for (let beat of currentBeat){
    beat_player(beat);
  }
}
function templatePlayerClip(template_clip){
  let dial_set = template_clip.get_dial();
  //console.log("dial_set_change", dial_set);
  const event = new CustomEvent('templateLoad', { detail: dial_set });
  SyntheysizerEvents.dispatchEvent(event);
}
function clearAllBoxClip(){// 편집기에 모든 노트 제거
  removeAllElementsByClassName("resize-drag_clip");
  removeAllElementsByClassName("draggable_clip");
  removeAllElementsByClassName("drag-drop");
}
document.getElementById("trackMusicPlayButton").addEventListener('click', function (){
  startTrack();
})
document.getElementById("trackMusicPauseButton").addEventListener('click', function (){
  stopTrack();
  stopAllNotePlayer();
})

// 객체를 JSON 파일로 다운로드하는 함수
function downloadJsonFile(filename, data) {
  const jsonData = JSON.stringify(data);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
//Track이랑 Clip을 따로 파일로 저장하는 함수, Track은 Clip의 위치값만 있기 때문에 한 번에 가져와야함
document.getElementById("trackMusicSaveButton").addEventListener('click', function(){
  let MusicTrackObejct = {
    "user_Id": TrackObject.getUserId(),
    "id_set" : TrackObject.getIdData(),
    "time_set" : TrackObject.getTimeData()
  }
  downloadJsonFile("MusicTrack_" + TrackObject.getUserId(), MusicTrackObejct);  //Track 정보 저장
  for(let i = 0; i < Template_clip_array.length; i ++){
    let templateObejct = {
      "CLip id": Template_clip_array[i].get_Clip_id(),
      "duration": Template_clip_array[i].get_duration(),
      "instrument": Template_clip_array[i].get_instrument(),
      "dial_set": Template_clip_array[i].get_dial()
    }
    downloadJsonFile("template_clip_" + i, MusicTrackObejct); 
  }
  for(let i = 0; i < Melody_clip_array.length; i ++){
    let MusicObejct = {
      "Type": Melody_clip_array[i].getClipType(),
      "CLip id": Melody_clip_array[i].getClipId(),
      "duration": Melody_clip_array[i].getDuration(),
      "noteSet": Melody_clip_array[i].getMusicClip()[0],
      "timeSet": Melody_clip_array[i].getMusicClip()[1]
    }
    downloadJsonFile("Melody_clip_" + i, MusicObejct); 
  }
  for(let i = 0; i < Beat_clip_array.length; i ++){
    let MusicObejct = {
      "Type": Beat_clip_array[i].getClipType(),
      "CLip id": Beat_clip_array[i].getClipId(),
      "duration": Beat_clip_array[i].getDuration(),
      "noteSet": Beat_clip_array[i].getMusicClip()[0],
      "timeSet": Beat_clip_array[i].getMusicClip()[1]
    }
    downloadJsonFile("Beat_clip_" + i, MusicObejct); 
  }
})
document.getElementById("trackMusicLoadButton").addEventListener('click', function (){
  InitializeAllSetting();
  FileInput.click();
})
FileInput.addEventListener('change', function(e){
  const Files = e.target.files;
  console.log(Files);
  for(let jsonfile of Files){
    if(jsonfile.name.includes("Melody")){
      Melody_upload(jsonfile);
    }
    if(jsonfile.name.includes("Beat")){
      Beat_upload(jsonfile);
    }
    if(jsonfile.name.includes("template")){
      Template_upload(jsonfile);
    }
  }
  for(let jsonfile of Files){
    if(jsonfile.name.includes("MusicTrack")){
      Track_upload(jsonfile);
    }
  }
  // const file = e.target.files[0];
  // const reader = new FileReader();
  // reader.onload = function(event) {
  //   const contents = event.target.result;
  //   const jsonObject = JSON.parse(contents);
  //   if(AudioObject.src == ""){
  //     alert("First, Need to input the music")
  //   }
  //   else if(musicName.files[0].name != jsonObject["music"]){
  //     alert("It doesn't match the music in this template.")
  //   }
  //   else{
  //     InitializeAllSetting();
  //     visualizationList = jsonObject["visualization"];
  //     backgroundColorList = jsonObject["backgroundColorList"];
  //     objectColorList = jsonObject["objectColor"];
  //     objectPositionXList = jsonObject["objectPositionX"];
  //     objectPositionYList = jsonObject["objectPositionY"];
  //     objectPositionZList = jsonObject["objectPositionZ"];
  //     timeTableList = jsonObject["timeTable"];
  //     volumeList = jsonObject["volume"];
  //     for(var i =1; i< visualizationList.length+1; i++){
  //       ButtonMaker(i)
  //     }
  //     loadTemplate(1);
  //   }
  // };
  // reader.readAsText(file);
})
function Track_upload(file){
  const json = readJsonFile(file);
  console.log(json); // 읽어온 Json 출력
}
function Melody_upload(file){
  const json = readJsonFile(file);
  console.log(json); // 읽어온 Json 출력
}
function Beat_upload(file){
  const json = readJsonFile(file);
  console.log(json); // 읽어온 Json 출력
}
function Template_upload(file){
  const json = readJsonFile(file);
  console.log(json); // 읽어온 Json 출력
}
function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
}
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//------------------------------------------- Note Interaction용 ----------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//


//Piano clip note 
interact('.resize-drag')
  .resizable({
    edges: { top: false, left: true, bottom: false, right: true },
    listeners: {
      move: function (event) {
        let { x, y } = event.target.dataset
        x = (parseFloat(x) || 0) + event.deltaRect.left
        y = (parseFloat(y) || 0) + event.deltaRect.top
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`
        })
        console.log( "id:", event.target.getAttribute("note_id"), "Add timeset:", [px_to_time_Scale(event.deltaRect.left, duration), px_to_time_Scale(event.deltaRect.left + event.deltaRect.width, duration)]);
        changeMusicClip(event.target.getAttribute("note_id"), [px_to_time_Scale(event.deltaRect.left, duration), px_to_time_Scale(event.deltaRect.left + event.deltaRect.width, duration)])
        
        Object.assign(event.target.dataset, { x, y })
      }
    }
  })
  .draggable({
    listeners: { move: window.dragMoveListener_note },
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ]
  })
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,
    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener_note,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')
        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })
  // Track Template
  interact('.resize-drag_clip')
  .resizable({
    edges: { top: false, left: false, bottom: false, right: true },
    listeners: {
      move: function (event) {
        let { x, y } = event.target.dataset
        x = (parseFloat(x) || 0) + event.deltaRect.left
        y = (parseFloat(y) || 0) + event.deltaRect.top
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`
        })
        Object.assign(event.target.dataset, { x, y })
      }
    }
  })

//beat clip note 
interact('.draggable')
  .draggable({
    listeners: { move: window.dragMoveListener_note },
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ]
  })
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,
    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener_note,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                    Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })

//track music box
interact('.draggable_clip')
.draggable({
  listeners: { move: window.dragMoveListener_clip },
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ]
})
.draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  // enable autoScroll
  autoScroll: true,
  listeners: {
    // call this function on every dragmove event
    move: dragMoveListener_clip,

    // call this function on every dragend event
    end (event) {
      var textEl = event.target.querySelector('p')

      textEl && (textEl.textContent =
        'moved a distance of ' +
        (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                  Math.pow(event.pageY - event.y0, 2) | 0))
          .toFixed(2) + 'px')
    }
  }
})

  function dragMoveListener_note (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = 0
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    //console.log( "id:", event.target.getAttribute("note_id"), "Add timeset:", [px_to_time_Scale(event.dx, duration), px_to_time_Scale(event.dx, duration)]);
    changeMusicClip(event.target.getAttribute("note_id"), [px_to_time_Scale(event.dx, duration), px_to_time_Scale(event.dx, duration)])
    // console.log("Add Plus :", px_to_time(x, duration), "id:", target.getAttribute("note_id"));
    // update the posiion attributes
    target.setAttribute('data-x', x)
  }

  function dragMoveListener_clip (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = 0
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    //console.log( "type:", event.target.getAttribute("box_type"), "id:", event.target.getAttribute("box_id"), "Add timeset:", event.dx/10);
    TrackObject.editMusicClip(event.target.getAttribute("box_type"), event.target.getAttribute("box_id"), event.dx/10)
    // console.log("Add Plus :", px_to_time(x, duration), "id:", target.getAttribute("note_id"));
    // update the posiion attributes
    target.setAttribute('data-x', x)
  }


  //clip dropzone 설정용 코드
  interact('.template-dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '#template-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,
  
    // listen for drop related events:
  
    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active')
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget
      var dropzoneElement = event.target
  
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
      const tempalteId = parseInt(event.relatedTarget.getAttribute("clip_id"));
      const clipTime = createTrackClipObject_template('template-dropzone', tempalteId, TrackObject.getTempalateId())
      console.log("clip Time Check", clipTime/10);
      TrackObject.setTemplateClip(tempalteId, clipTime/10)
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target')
      event.relatedTarget.classList.remove('can-drop')
      //event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: function (event) {
      //event.relatedTarget.textContent = 'Dropped'
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
    }
  })

  interact('.melody-dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '#melody-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,
    // listen for drop related events:
    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active')
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget
      var dropzoneElement = event.target
  
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
       const Tmp_clip = get_clip(event.relatedTarget.getAttribute("clip_type"), event.relatedTarget.getAttribute("clip_id"))
      const clipTime = createTrackClipObject('melody-dropzone', Tmp_clip, TrackObject.getMelodyId())
      console.log("clip Time Check", clipTime/10);
      TrackObject.setMusicClip(Tmp_clip, clipTime/10)
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target')
      event.relatedTarget.classList.remove('can-drop')
      //event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: function (event) {
      //event.relatedTarget.textContent = 'Dropped'
      //createTrackClipObject('melody-dropzone',get_clip(event.target.getAttribute("clip_id"), event.target.getAttribute("clip_type")))

    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
    }
  })

    interact('.beat-dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '#beat-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,
    // listen for drop related events:
    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active')
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget
      var dropzoneElement = event.target
  
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
      const Tmp_clip = get_clip(event.relatedTarget.getAttribute("clip_type"), event.relatedTarget.getAttribute("clip_id"))
      const clipTime = createTrackClipObject('beat-dropzone', Tmp_clip, TrackObject.getBeatId())
      TrackObject.setMusicClip(Tmp_clip, clipTime/10)
      console.log("clip Time Check", clipTime/10);
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target')
      event.relatedTarget.classList.remove('can-drop')
      //event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: function (event) {
      //event.relatedTarget.textContent = 'Dropped'
      //createTrackClipObject('beat-dropzone',get_clip(event.target.getAttribute("clip_id"), event.target.getAttribute("clip_type")))
  
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
    }
  })
  
  interact('.drag-drop')
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      listeners: { move: dragMoveListenerxy }
    })
  
  function dragMoveListenerxy (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }