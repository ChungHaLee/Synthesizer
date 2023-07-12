import { SyntheysizerEvents, MusicClip, MusicClipType, MusicTrack, TemplateClip, VideoClip} from './Share.js';
import { piano_player, beat_player, dialInitialize, beat_output_play} from './Synthesizer.js';
import * as Midi from "./jsmidgen.js"
//import * as JZZ from "./JZZ.js"

//최소 범위 A2 ~ C7

const fps = 30;
let currentTime = 0.0;
let currentTrackTime = 0.0;
let play_state = false;
let play_state_track = false;
let timer = null;
let duration = document.getElementById("clipduration").value;
let duration_track = document.getElementById("trackduration").value;

let clipduration = document.getElementById("clipduration");
let timeLine1 = document.getElementById("timeLine1");
let timeLine2 = document.getElementById("timeLine2");
let timeLine3 = document.getElementById("timeLine3");
let FileInput = document.getElementById("fileUpload");

const Template_clip_array = [];
const Melody_clip_array = [];
const Beat_clip_array = [];

let current_clip_type = MusicClipType.Mood;
let melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
let beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
let template_clip = new TemplateClip(Template_clip_array.length, duration_track);
templateConnectToVisualAndSound(template_clip);
let onNoteList = [];
let previousNote = [];
let previousNote_track = [];
let TrackObject = new MusicTrack();
let videoObject = new VideoClip();
let previousDial_ID = -1;
let doubleChecker = 0 //Webpack double Event error catcher
let trackActivaqte = false;
let noteClickIndex = -1;
let trackClickIndex = -1;
let trackClickType = null
const clip_box_width = 1810;
const clip_start_px = 80;
const track_box_width = 700;

let lyricsId = 0;

let bpmPlayNumber = 0;

const userName = document.getElementById("userName").innerHTML
const userEmail = document.getElementById("userEmail").innerHTML
const musicId = parseInt(document.getElementById("musicType").innerHTML);

document.getElementById("synthConnector").click();






document.getElementById("PreviousButton").addEventListener("click", function(){
  console.log("previous check")
  stopRecording();
  stopAllNotePlayer();
  play_state = false;
  if(current_clip_type == MusicClipType.Mood){
    console.log('to Login')
    document.getElementById("loginPage").click();
  }
  else if(current_clip_type == MusicClipType.Beat){
    moodTypeSceneChanger();
  }
  else if(current_clip_type == MusicClipType.Melody){
    beatTypeSceneChanger();
    clearNoteClip(MusicClipType.Beat);
  }
  else if(current_clip_type == MusicClipType.Lyrics){
    melodyTypeSceneChanger();
  }
  else{
    lyricsTypeSceneChanger();
  }
})

document.getElementById("NextButton").addEventListener("click", function(){
  stopRecording();
  stopAllNotePlayer();
  play_state = false;
  if(current_clip_type == MusicClipType.Mood){
    beatTypeSceneChanger();
    clearNoteClip(MusicClipType.Beat);
  }
  else if(current_clip_type == MusicClipType.Beat){
    melodyTypeSceneChanger();
    clearNoteClip(MusicClipType.Melody);
  }
  else if(current_clip_type == MusicClipType.Melody){
    lyricsTypeSceneChanger();
  }
  else{
    templateTypeSceneChanger();
  }
})
function moodTypeSceneChanger(){
  current_clip_type = MusicClipType.Mood;
  noteClickIndex = -1;
  console.log("to Mood", current_clip_type);
  document.getElementById("moodContainer").style.display = "block";
  document.getElementById("sheetMusicController").style.display = "none";
  document.getElementById("trackContainer").style.display = "none";
  document.getElementById("ThemaContainer").style.display = "block";
  document.getElementById("BeatContainer").style.display = 'none';
  document.getElementById("MelodyContainer").style.display = 'none';
  document.getElementById("TemplateContainer").style.display = 'none';
}
function beatTypeSceneChanger(){
  current_clip_type = MusicClipType.Beat;
  noteClickIndex = -1;
  console.log("to Beat", current_clip_type);
  document.getElementById("moodContainer").style.display = "none";
  document.getElementById("sheetMusicController").style.display = "block";
  document.getElementById("trackContainer").style.display = "block";
  document.getElementById("ThemaContainer").style.display = "none";
  document.getElementById("BeatContainer").style.display = 'block';
  document.getElementById("MelodyContainer").style.display = 'none';
  document.getElementById("TemplateContainer").style.display = 'none';
  initializeTimer();
}
function melodyTypeSceneChanger(){
  current_clip_type = MusicClipType.Melody;
  noteClickIndex = -1;
  console.log("to Melody", current_clip_type);
  document.getElementById("moodContainer").style.display = "none";
  document.getElementById("sheetMusicController").style.display = "block";
  document.getElementById("trackContainer").style.display = "block";
  document.getElementById("ThemaContainer").style.display = "none";
  document.getElementById("BeatContainer").style.display = 'none';
  document.getElementById("MelodyContainer").style.display = 'block';
  document.getElementById("TemplateContainer").style.display = 'none';

  document.getElementById("noteBoxContainer").style.display = 'block';
  document.getElementById("timeLineContainer").style.display = 'block';
  document.getElementById("lyricsVideoContainer").style.display = 'none';
  initializeTimer();
}
function lyricsTypeSceneChanger(){
  current_clip_type = MusicClipType.Lyrics;
  noteClickIndex = -1;
  console.log("to Lyrics", current_clip_type);
  document.getElementById("moodContainer").style.display = "none";
  document.getElementById("sheetMusicController").style.display = "block";
  document.getElementById("trackContainer").style.display = "block";
  document.getElementById("ThemaContainer").style.display = "none";
  document.getElementById("BeatContainer").style.display = 'none';
  document.getElementById("MelodyContainer").style.display = 'block';
  document.getElementById("TemplateContainer").style.display = 'none';

  document.getElementById("noteBoxContainer").style.display = 'none'
  document.getElementById("timeLineContainer").style.display = 'none';
  document.getElementById("lyricsVideoContainer").style.display = 'block';
  initializeTimer();
}
function templateTypeSceneChanger(){
  current_clip_type = MusicClipType.Template;
  noteClickIndex = -1;
  console.log("to Template", current_clip_type);
  document.getElementById("moodContainer").style.display = "none";
  document.getElementById("sheetMusicController").style.display = "block";
  document.getElementById("trackContainer").style.display = "block";
  document.getElementById("ThemaContainer").style.display = "none";
  document.getElementById("BeatContainer").style.display = 'none';
  document.getElementById("MelodyContainer").style.display = 'none';
  document.getElementById("TemplateContainer").style.display = 'block';
}
/*------------------------------단축키 코드 관련 코드--------------------------------*/
document.addEventListener('keyup', function(event) {
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case 'Enter':
      console.log("Enter")
      if(current_clip_type == MusicClipType.Melody || current_clip_type == MusicClipType.Lyrics){
        document.getElementById("LyricsPushButton").click();
      }
      break;
    case ' ':
      if (event.shiftKey) { 
        console.log("Shift+space")
        if(play_state_track){
          document.getElementById("trackMusicPlayButton").click();
        }
        else{
          document.getElementById("trackMusicPauseButton").click();
        }
      } 
      else {
        console.log("space")
        if(play_state){
          document.getElementById("sheetMusicPlayButton").click();
        }
        else{
          document.getElementById("sheetMusicPauseButton").click();
        }
      }
      break;
    case 's':
      if(event.ctrlKey){
        document.getElementById("sheetMusicSaveButton").click();
      }
      break;
    case 'ArrowLeft':
      console.log("Left")
      document.getElementById("PreviousButton").click();
      break;
    case 'ArrowRight':
      console.log("right")
      document.getElementById("NextButton").click();
      break;
    default:
      return;
  }

  event.preventDefault();
}, true);

/*------------------------------녹화용 코드 관련 코드--------------------------------*/
let mediaRecorder = null;
let videoId = 0;
const videoRecordCanvas = document.getElementById("videoRecordCanvas");
const videoCheckCanvas = document.getElementById("videoCheckCanvas");
videoCheckCanvas.autoplay = false;
let chunck = [];
function videoRecordingMode(recordingState){
  if(recordingState){
    videoRecordCanvas.style.display = "block"
    videoCheckCanvas.style.display = "none"
  }
  else{
    videoRecordCanvas.style.display = "none"
    videoCheckCanvas.style.display = "block"
  }
}

document.getElementById("recordStartButton").addEventListener("click", function(){
  let timeElapsed = 4;
  const intervalId = setInterval( function() {
    timeElapsed--;
    console.log(`${timeElapsed}초 뒤에 함수가 실행됩니다.`);
    document.getElementById("videoWaitTime").innerHTML = `${timeElapsed}초 뒤에 녹화 시작.`;
    if (timeElapsed <= 0) {
      document.getElementById("videoWaitTime").innerHTML = '';
      videoRecordingStart()
      clearInterval(intervalId);
    }
  }, 1000);
});

async function videoRecordingStart(){
  videoRecordingMode(true);
  let vidoeDuration = 0;
  let startDate = 0;
  let waitTime = 3;
  let recordingState = false
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  });
  videoRecordCanvas.srcObject = mediaStream;
  videoRecordCanvas.onloadedmetadata = (event)=>{
    videoRecordCanvas.play();
    console.log("recording Start");
    vidoeDuration = 0
    startDate = Date.now();
  }
  mediaRecorder = new MediaRecorder(mediaStream);
  mediaRecorder.ondataavailable = (event)=>{
    chunck.push(event.data);
  }
  mediaRecorder.onstop = (event)=>{
    // 배열에 담아둔 녹화 데이터들을 통합한 Blob객체 생성
    vidoeDuration = (Date.now() - startDate)/1000
    console.log("recording Stop : ");
    console.log("video Duration :", vidoeDuration);
    let videoBlob = new Blob(chunck, { type: 'video/webm' });
    videoObject.setVideo(videoId, videoBlob, vidoeDuration);
    // BlobURL(ObjectURL) 생성
    const blobURL = window.URL.createObjectURL(videoBlob);
    // 녹화된 영상 재생: 
    videoCheckCanvas.src = blobURL;
    videoCheckCanvas.play();
    // 기존 녹화 데이터 제거
    chunck.splice(0);
    createVideoClipObject(videoId)
    videoId +=1;
    console.log(videoObject);
  }
  mediaRecorder.start();
}




document.getElementById("recordStopButton").addEventListener("click", function(){
  // 녹화 종료!
  videoRecordingMode(false);
  mediaRecorder.stop();
})
function loadVideoClip(videoId, playDuration = null){
  videoRecordingMode(false);
  let videoData = videoObject.getVideoData(videoId);
  let videoDuration = videoObject.getVideoDuration(videoId);
  if (videoData instanceof Blob){
    let url = window.URL.createObjectURL(videoData);
    videoCheckCanvas.src = url;
    videoCheckCanvas.play();
    if(playDuration != null && playDuration > 0){
      console.log("play rate :", videoDuration / playDuration);
      videoCheckCanvas.playbackRate  = videoDuration / playDuration;
    }
    else{
      videoCheckCanvas.playbackRate  = 1.0
    }
  }
  else{
    console.error('The element at this index is not a Blob')
  }
}
function setViodeTime(setTime, playbackRate){
  let videoTime = setTime * playbackRate;
  if(Math.abs(videoCheckCanvas.currentTime - videoTime) > 0.4){
    console.log("setting video Time : ", videoCheckCanvas.currentTime, videoTime)
    videoCheckCanvas.currentTime = videoTime;
  }
}
function pauseVideo(){
  videoCheckCanvas.pause();
}
//video Clip Object 생성용 코드(melody, Beat용)
function createVideoClipObject(videoCLipId){
  const videoIdClip = document.createElement("div");
  videoIdClip.classList.add("Video_clip");
  videoIdClip.style.width = '200px'
  videoIdClip.textContent = "수어 " + (videoCLipId + 1); 
  let boxItem = document.getElementById("VideoClipContainer");
  videoIdClip.setAttribute("Video_Cilp_id", videoCLipId); // clip_id 속성 추가
  videoIdClip.addEventListener("click", function(){
    console.log("videoClipId:", videoIdClip.getAttribute("Video_Cilp_id"));
    if(videoCLipId != -1){
    loadVideoClip(videoIdClip.getAttribute("Video_Cilp_id"));
    }
    if(current_clip_type == MusicClipType.Lyrics){
      document.getElementById('lyricsVideo').innerHTML = videoIdClip.textContent;
    }
  })
  boxItem.appendChild(videoIdClip);
}

document.getElementById("lyricsSettingButton").addEventListener("click", function(){
  if(current_clip_type == MusicClipType.Lyrics){
    let lyricsText = document.getElementById('lyricsVideo').innerHTML;
    if(noteClickIndex != -1){
      console.log("current lyrics id :", noteClickIndex, "video id :", parseInt(lyricsText.substr(2))-1);
      melody_clip.setLyricsVideo(noteClickIndex, parseInt(lyricsText.substr(2))-1)
    }
  }
})

let previousLyricsIndex  = null;
function playVideoControl(currentTime, lyricsIndex){
  if(current_clip_type == MusicClipType.Lyrics){
    let videoId = melody_clip.getLyricsVideoId(lyricsIndex);
    console.log(videoId);
    if(lyricsIndex != -1 && videoId != -1){
      let [startTime, lastTime] = melody_clip.getLyricsTimeset(lyricsIndex);
      let videoDuration = videoObject.getVideoDuration(videoId);
      //console.log("time:", currentTime - startTime, "VideoId", videoId);
      if(lyricsIndex != -1 && previousLyricsIndex != lyricsIndex){
        let videoData = videoObject.getVideoData(videoId);
        if (videoData instanceof Blob){
          let url = window.URL.createObjectURL(videoData);
          videoCheckCanvas.src = url;
          let playDuration = lastTime - startTime;
          console.log("check", playDuration, startTime, lastTime);
          if(playDuration != null && playDuration > 0){
            videoCheckCanvas.playbackRate  = videoDuration / playDuration;
            console.log("rate Change", videoDuration / playDuration)
          }
          else{
            videoCheckCanvas.playbackRate  = 1.0;
          }
        }
        previousLyricsIndex = lyricsIndex;
      }
      if(videoCheckCanvas.paused){
        videoCheckCanvas.play();
      }
      setViodeTime(currentTime - startTime, videoDuration/(lastTime - startTime))
    }
    else{
      if(!videoCheckCanvas.paused){
        console.log("pause check");
        videoCheckCanvas.pause();
      }
    }
  }
}







/*-----------------------------MIDI 파일 생성용 코드-----------------------------------------*/

let MidiEventTime = 0.0
const midiBPM = 120;
const midiBeatNote = ["C" ,"D", "F", "A#"]
function generateMidi() {
  var file = new Midi.File();
  var track = new Midi.Track();

  file.addTrack(track);
  track.setTempo(midiBPM);
  track.instrument(0, 0x03)
  track.instrument(1, 0x70)
  track.instrument(2, 0x72)
  track.instrument(3, 0x74)
  track.instrument(4, 0x76)
  
  MidiTrackMaker(track)

  var midiData = file.toBytes();
  var byteNumbers = new Array(midiData.length);
  for (var i = 0; i < midiData.length; i++) {
      byteNumbers[i] = midiData.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);
  var blob = new Blob([byteArray], {type: "application/octet-stream"});
  var downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = 'test.mid';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function MidiTrackMaker(track){
  for(let trackTimer = 0; trackTimer <duration_track; trackTimer += 1/fps){
    let cur_track_set = TrackObject.getcurrentClipSet(trackTimer);
    if(cur_track_set[1].length > 0){
      MidiMelodyMaker(track, trackTimer, trackTimer - cur_track_set[1][0], Melody_clip_array[cur_track_set[1][1]]);
    }
    if(cur_track_set[2].length > 0){
      MidiBeatMaker(track, trackTimer, trackTimer - cur_track_set[2][0], Beat_clip_array[cur_track_set[2][1]]);
    }
  }
}


function MidiMelodyMaker(track, currentTime, inputTime, melody_clip){
  let currentNote = melody_clip.getcurrentNoteSet(inputTime);
  MidiNoteAdditor(track, currentNote, previousNote_track, currentTime);
  previousNote_track = melody_clip.getcurrentNoteSet(inputTime);
}
function MidiNoteAdditor(track, currentNote, previousNote, currentTime){ //피아노 음 재생 함수
  //piano_player(currentNote[0], true);
  if(currentTime < MidiEventTime){
    MidiEventTime = 0.0;
  }
  var exclusiveArr1 = currentNote.filter(function(val) {
    return previousNote.indexOf(val) === -1;
  });
  var exclusiveArr2 = previousNote.filter(function(val) {
    return currentNote.indexOf(val) === -1;
  });
  if(exclusiveArr1.length > 0){
    //console.log("Inpnut", exclusiveArr1);
    for( let note of exclusiveArr1){
      track.noteOn(0, note, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
      console.log("note ON", note, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
      MidiEventTime = currentTime
    }  
  }
  if(exclusiveArr2.length > 0){
    //console.log("Ouput ", exclusiveArr2);
    for( let note of exclusiveArr2){
      track.noteOff(0, note, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
      console.log("note OFF", note, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
      MidiEventTime = currentTime
    }  
  }
}


function MidiBeatMaker(track, currentTime, inputTime, beat_clip){
  let currentBeat = beat_clip.getcurrentNoteSet(inputTime);
  if(currentTime < MidiEventTime){
    console.log("MidiEventTimer reset")
    MidiEventTime = 0.0;
  }
  for (let beat of currentBeat){
    if(beat == 0){
      track.addNote(beat+1, midiBeatNote[beat]+"2", 32, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
      console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
      MidiEventTime = currentTime
    }
    else if(beat == 1){
      track.addNote(beat+1, midiBeatNote[beat]+"2", 32, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
      console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
      MidiEventTime = currentTime
    }
    else if(beat == 2){
      track.addNote(beat+1, midiBeatNote[beat]+"2", 32, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
      console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
      MidiEventTime = currentTime
    }
    else{
      track.addNote(beat+1, midiBeatNote[beat]+"2", 32, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
      console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
      MidiEventTime = currentTime
    }
   }
}



/*-----------------------------MIDI 파일 생성용 코드-----------------------------------------*/



function InitializeAllSetting(){
  currentTime = 0.0;
  currentTrackTime = 0.0;
  play_state = false;
  play_state_track = false;
  Template_clip_array.length = 0;
  Melody_clip_array.length = 0;
  Beat_clip_array.length = 0;
  melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
  beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
  template_clip = new TemplateClip(Template_clip_array.length, duration_track);
  current_clip_type = MusicClipType.Beat;
  onNoteList = [];
  previousNote = [];
  previousNote_track = [];
  TrackObject = new MusicTrack();
  previousDial_ID = -1;
  doubleChecker = 0;
  trackActivaqte = false;
  noteClickIndex = -1;
  trackClickIndex = -1;
  trackClickType = null
  lyricsId = 0;
  stopRecording();
  clearNoteClip(MusicClipType.Beat);
  clearNoteClip(MusicClipType.Melody);
  clearAllBoxClip();
  initializeTimer();
  initializeTimer2();
}

/* Timer Setting and Update code*/
function startRecording(){//Timer를 시작하는 코드
  stopTrack()
  play_state = true;
  previousLyricsIndex = null;
  startTimer();
  startMetronome();
  if(!document.getElementById("BPMType").checked){
    bpmPlayNumber = 5
  }
}
function stopRecording(){//Timer를 중지하는 코드
  play_state = false;
  noteSizeAllOff();
  stopTimer();
  stopMetronome();
}
function startTimer() { // 타이머 시작 코드
  if (!timer) { // 타이머가 이미 실행 중이지 않은 경우에만 실행
    timer = setInterval(updateTime, 1 / fps * 1000); // 0.01초 간격으로 updateTime 함수 실행
  }
}
function stopTimer() {  // 타이머 정지 코드
  clearInterval(timer);
  timer = null; // 타이머 변수 초기화
  pauseVideo(); // 영상 재생 정지
}


// track timer code
function startTrack(){//Timer를 시작하는 코드
  stopRecording()
  play_state = true;
  play_state_track = true;
  previousLyricsIndex = null;
  startTimer2();
  startMetronome();
  if(!document.getElementById("BPMType").checked){
    bpmPlayNumber = 5
  }
}
function stopTrack(){//Timer를 중지하는 코드
  play_state = false;
  play_state_track = false;
  noteSizeAllOff();
  stopTimer2();
  stopMetronome();
}
function startTimer2() { // 타이머 시작 코드
  if (!timer) { // 타이머가 이미 실행 중이지 않은 경우에만 실행
    timer = setInterval(updateTime2, 1 / fps * 1000); // 0.01초 간격으로 updateTime 함수 실행
  }
}
function stopTimer2() {  // 타이머 정지 코드
  clearInterval(timer);
  timer = null; // 타이머 변수 초기화
}
function currentClipDuration(){
  if(current_clip_type == MusicClipType.Melody||current_clip_type == MusicClipType.Lyrics){
    return melody_clip.getDuration();
  }
  else{
    return beat_clip.getDuration();
  }
}



function updateTime() { //시간에 따라 업데이트 해야하는 함수들
  if(bpmPlayNumber > 4){
    currentTime += 1/fps;
    musicPlayer(currentTime);
    //console.log(time_to_px(currentTime, duration)-clip_start_px);
    $("#slider").slider("value",time_to_px(currentTime, currentClipDuration()));
    timeLine2.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
    timeLine1.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
    // console.log(onNoteList[0].style.left, time_to_px(currentTime, currentClipDuration()) + "px")
    // updateTime2(currentTime)
    showLyrics(currentTime);
    for (let item of onNoteList){
      noteResizeChanger(item, time_to_px(currentTime, currentClipDuration()));
    }
    if(currentTime >= currentClipDuration()){
      stopRecording() //끝 도달하면 자동으로 종료
    }
  }
}

function ClipUpdateTimeControl(setTime){
  currentTime = setTime
  $("#slider").slider("value",time_to_px(currentTime, currentClipDuration()));
  timeLine2.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
  timeLine1.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
  showLyrics(currentTime);
  for (let item of onNoteList){
    noteResizeChanger(item, time_to_px(currentTime, currentClipDuration()));
  }
}





$("#slider").slider({ //Timer 슬라이더
  value: clip_start_px,
  min: clip_start_px,
  max: clip_box_width,
  step: 0.01,
  slide: function( event, ui ) {
    timeLine1.style.left = ((ui.value)-clip_start_px) + "px";
    timeLine2.style.left = ((ui.value)-clip_start_px) + "px";
    currentTime = px_to_time(ui.value, currentClipDuration());
    // if(practiceMode){
    //   player1.seekTo(px_to_time(ui.value, duration), true);
    // }
    // else{
    //   player2.seekTo(px_to_time(ui.value, duration), true);
    // }
    noteSizeAllOff();
  }
});
function initializeTimer(){ //Timer 초기화
  stopRecording();
  currentTime = 0.0;
  $("#slider").slider("value",time_to_px(currentTime, currentClipDuration()));
  timeLine2.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
  timeLine1.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
}
function time_to_px(time, duration, width = clip_box_width, start = clip_start_px){ //Time을 Px로 변환하는 코드
  return start + time / duration * (width - start)
}
function time_to_px_Scale(time, duration, width = clip_box_width, start = clip_start_px){ //Time을 Px로 변환하는 코드
  return time / duration * (width - start)
}
function px_to_time(px, duration, width = clip_box_width, start = clip_start_px){  //Px을 Time으로 변환하는 코드
  return (px - start) * duration / (width - start)
}
function px_to_time_Scale(px, duration, width = clip_box_width, start = clip_start_px){  //Px Scale을 Time Scale로 변환하는 코드
  return px * duration / (width - start)
}
/*Note Sound Maker*/
function musicPlayer(currentTime){  //음, 비트 소리를 재생하는 코드
  if(current_clip_type == MusicClipType.Melody || current_clip_type==MusicClipType.Lyrics){
    let currentNote = melody_clip.getcurrentNoteSet(currentTime)
    notePlayer(currentNote, previousNote);
    previousNote = melody_clip.getcurrentNoteSet(currentTime);
  }
  else if(current_clip_type == MusicClipType.Beat){
    let currentBeat = beat_clip.getcurrentNoteSet(currentTime);
    for (let beat of currentBeat){
      beat_player(beat);
      setTimeout(() => beat_output_play(beat), 100);
    }
  }
}
function notePlayer(currentNote, previousNote){ //피아노 음 재생 함수
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
  //console.log("piano Player Test ", exclusiveArr1, exclusiveArr2)
}
function stopAllNotePlayer(){ //재생되는 음을 모두 정지하는
  if(previousNote.length > 0){
    //console.log("Ouput ", exclusiveArr2);
    for(let note of previousNote){
      piano_player(note, false);
    }  
  }
  if(previousNote_track.length > 0){
    //console.log("Ouput ", exclusiveArr2);
    for(let note of previousNote_track){
      piano_player(note, false);
    }  
  }
  previousNote = []
  previousNote_track = []
}
function OctaveToColor(octave){
  switch(octave){
    case "C4":
      return 'hsl(0,99%,41%)'
    case "C#4":
      return 'hsl(24,99%,41%)';
    case "D4":
      return 'hsl(36,99%,41%)';
    case "D#4":
      return 'hsl(46,99%,41%)';
    case "E4":
      return 'hsl(55,99%,41%)';
    case "F4":
      return 'hsl(129,100%,31%)';
    case "F#4":
      return 'hsl(179,100%,27%)';
    case "G4":
      return 'hsl(186,99%,41%)';
    case "G#4":
      return  '#2E93FF';
    case "A4":
      return 'hsl(273,99%,40%)';
    case "A#4":
      return  'hsl(284,100%,34%)';
    case "B4":
      return 'hsl(329,100%,39%)';
    //let magenta = 'hsl(346,100%,39%)'
    case "C5":
      return 'hsl(0,100%,25%)'
    case "C#5":
      return 'hsl(25,100%,24%)'
    case "D5":
      return 'hsl(36,100%,24%)'
    case "D#5":
      return 'hsl(48,100%,24%)'
    case "E5":
      return  'hsl(57,100%,26%)'
    case "F5":
      return  'hsl(120,100%,19%)'
    case "F#5":
      return 'hsl(178,100%,18%)'
    case "G5":
      return 'hsl(210,100%,22%)'
    case "G#5":
      return 'hsl(246,100%,22%)'
    case "A5":
      return 'hsl(275,100%,22%)'
    case "A#5":
      return  'hsl(308,100%,22%)'
    case "B5":
      return  'hsl(323,100%,21%)'
    case "C6":
      return  'hsl(351,100%,21%)'
    default:
      return 'hsl(0,100%,0%)'
  }
}

/*Cilp Note Object creater*/
function createResizeDragElement(note, leftPosition, noteId, type) { //Melody, Beat 노트 생성
  const resizeDrag = document.createElement("div");
  let boxItem = null
  if(type == MusicClipType.Melody){
    resizeDrag.classList.add("resize-drag");  // resize-drag로 생성
    const Itemid = "box_" + note.substr(0, note.length - 1); 
    boxItem = document.getElementById(Itemid);
    resizeDrag.textContent = note.substr(note.length - 1, note.length);
    resizeDrag.style.backgroundColor =  OctaveToColor(note)
  }
  else{
    resizeDrag.classList.add("draggable");  // resize-drag로 생성
    const Itemid = "box_" + note;
    boxItem = document.getElementById(Itemid);
    resizeDrag.textContent = ""
  }
  resizeDrag.style.left = leftPosition + "px"; // left 스타일 추가
  resizeDrag.setAttribute("note_id", noteId); // note_id 속성 추가
  resizeDrag.setAttribute("note", note); // note_id 속성 추가
  resizeDrag.addEventListener("click", function(){
    //console.log("Note Id:", resizeDrag.getAttribute("note_id"));
    noteClickIndex = resizeDrag.getAttribute("note_id");
  })
  noteClickIndex = noteId;
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
function newClipCreater(){
  if(current_clip_type == MusicClipType.Melody){
    console.log("New Melody Clip Create", Melody_clip_array.length)
    melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
    noteClickIndex = -1;
    clearNoteClip(MusicClipType.Melody);
    initializeTimer();
  }
  else if(current_clip_type == MusicClipType.Beat){
    console.log("New Beat Clip Create", Beat_clip_array.length)
    beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
    noteClickIndex = -1;
    clearNoteClip(MusicClipType.Beat);
    initializeTimer();
  }
  else if(current_clip_type == MusicClipType.Template){
    console.log("New Template Clip Create", Template_clip_array.length)
    template_clip = new TemplateClip(Template_clip_array.length, duration_track);
    templateConnectToVisualAndSound(template_clip);
    console.log(Template_clip_array)
  }
}

/* Clip Event Code */
document.getElementById("trackClipCreateButton").addEventListener('click', function (){
  newClipCreater();
})
document.getElementById("sheetMusicTemplateButton").addEventListener('click', function (){
  if(template_clip.get_Clip_id() != Template_clip_array.length){
    console.log("New Template Clip Create", template_clip.get_Clip_id(), Template_clip_array.length)
    template_clip = new TemplateClip(Template_clip_array.length, duration_track);
    templateConnectToVisualAndSound(template_clip);
    console.log(Template_clip_array)
  }
})
document.getElementById("sheetMusicSaveButton").addEventListener('click', function (){
  if(current_clip_type == MusicClipType.Melody){     // Melody Save 
    if(melody_clip.getClipId() == Melody_clip_array.length){
      clipDurationNormalize(current_clip_type)
      createClipBox(melody_clip);
      Melody_clip_array.push(melody_clip);
      melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
      alert("Melody Clip saved")
      clearNoteClip(MusicClipType.Melody);
      initializeTimer();
    }
    else{
      clipDurationNormalize(current_clip_type)
      Melody_clip_array[melody_clip.getClipId()] = melody_clip;
      alert("Melody Clip resaved")
    }
  }
  else if(current_clip_type == MusicClipType.Beat){      
    if(beat_clip.getClipId() == Beat_clip_array.length){        
      clipDurationNormalize(current_clip_type)                          // Beat Save
      createClipBox(beat_clip);
      Beat_clip_array.push(beat_clip);
      beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
      alert("Beat Clip saved")
      clearNoteClip(MusicClipType.Beat);
      initializeTimer();
    }
    else{
      clipDurationNormalize(current_clip_type)
      Beat_clip_array[beat_clip.getClipId()] = beat_clip;
      alert("Beat Clip resaved")
    }
  }
  else if(current_clip_type == MusicClipType.Lyrics){
    
  }
  else if(current_clip_type == MusicClipType.Template){
    if(template_clip.get_Clip_id() == Template_clip_array.length){
      createTemplateClipBox(template_clip);
      Template_clip_array.push(template_clip);
      template_clip = new TemplateClip(Template_clip_array.length , duration_track);
      templateConnectToVisualAndSound(template_clip);
      console.log(Template_clip_array)
      alert("Template Clip saved")
    }
    else{
      Template_clip_array[template_clip.get_Clip_id()] = template_clip;
      alert("Template Clip resaved")
    }
  }
})


document.getElementById("sheetMusicPlayButton").addEventListener('click', function (){
  startRecording();
})
document.getElementById("sheetMusicPauseButton").addEventListener('click', function (){
  stopRecording();
  stopAllNotePlayer();
  stopAllNotePlayer();
})
document.getElementById("sheetMusicDeleteButton").addEventListener('click', function (){
  if(noteClickIndex!=-1){
    if(current_clip_type == MusicClipType.Melody){
      melody_clip.deleteNote(noteClickIndex);
      clearNoteClip(MusicClipType.Melody);
      loadClip(melody_clip, melody_clip.getDuration());
    }
    else if(current_clip_type == MusicClipType.Beat){
      beat_clip.deleteNote(noteClickIndex);
      clearNoteClip(MusicClipType.Beat);
      loadClip(beat_clip, beat_clip.getDuration())
    }
    else if(current_clip_type == MusicClipType.Lyrics){
      melody_clip.deletelyric(noteClickIndex);
      clearNoteClip(MusicClipType.Melody);
      loadClip(melody_clip, melody_clip.getDuration());
    }
  }
})
document.getElementById("sheetMusicAllDeleteButton").addEventListener('click', function (){
  if (window.confirm("정말 클립 내용을 모두 삭제하시겠습니까?")) {
    if(current_clip_type == MusicClipType.Melody){
      melody_clip = new MusicClip(MusicClipType.Melody, 0, duration);
      clearNoteClip(MusicClipType.Melody);
    }
    else if(current_clip_type == MusicClipType.Beat){
      beat_clip = new MusicClip(MusicClipType.Beat, 0, duration);
      clearNoteClip(MusicClipType.Beat);
    }
    else if(current_clip_type == MusicClipType.Lyrics){
      melody_clip.dleteAlllyric();
      clearNoteClip(MusicClipType.Lyrics);
    }
  }
})

/* Synthesizer Event Code */
SyntheysizerEvents.addEventListener('pianoKeyInput', function (e){
  doubleChecker += 1
  if(doubleChecker%2 ==0){
    if(play_state && current_clip_type == MusicClipType.Melody){
      melody_clip.setNoteInput(e.detail.note, currentTime);
        //console.log("noteInpu Check", e.detail.note)
      let NoteItem = createResizeDragElement(e.detail.note, time_to_px(currentTime, currentClipDuration()), melody_clip.getNoteIndex(), MusicClipType.Melody);
      onNoteList.push(NoteItem); 
    }
  }
})
SyntheysizerEvents.addEventListener('pianoKeyOutput', function (e){
  doubleChecker += 1
  if(doubleChecker%2 ==0){
    if(play_state && current_clip_type == MusicClipType.Melody){
      melody_clip.setNoteRelease(e.detail.note, currentTime);
      noteOff(e.detail.note)
    }
  }
})
SyntheysizerEvents.addEventListener('padkeyInput', function (e){
  doubleChecker += 1
  if(doubleChecker%2 ==0){
    if(play_state && current_clip_type == MusicClipType.Beat){
      beat_clip.setBeatInput(e.detail.id, currentTime);
      console.log("Pad Input")
      let PadItem = createResizeDragElement(e.detail.id, time_to_px(currentTime, currentClipDuration()), beat_clip.getNoteIndex(), MusicClipType.Beat);
    }
  }
})
SyntheysizerEvents.addEventListener('dialInput', function(e){
  doubleChecker += 1
  if(doubleChecker%2 ==0){
    template_clip.set_dial(e.detail.value);
    document.getElementById("dial_1").value = e.detail.value[0][0]
    document.getElementById("dial_2").value = e.detail.value[0][1]
    document.getElementById("dial_3").value = e.detail.value[0][2]
    document.getElementById("dial_4").value = e.detail.value[0][3]
  }
})

/*Clip Edit code*/
// clipduration.addEventListener("change", function(){ //Clip duration change code
//   changeClipDuration(parseFloat(clipduration.value));
// })
// function changeClipDuration(inputDuration){
//   duration = inputDuration
//   console.log("Clip duration Set : ", duration);
//   noteSizeAllOff();
//   clearNoteClip(current_clip_type);
//   if(time_to_px(currentTime, duration) >= clip_box_width){
//     $("#slider").slider("value", clip_box_width);
//     timeLine2.style.left = (clip_box_width-clip_start_px) + "px";
//     timeLine1.style.left = (clip_box_width-clip_start_px) + "px";
//   }
//   else{
//     $("#slider").slider("value",time_to_px(currentTime, duration));
//     timeLine2.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
//     timeLine1.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
//   }
//   if(current_clip_type == MusicClipType.Melody){
//     melody_clip.setDuration(duration);
//     template_clip.set_duration(duration);
//     loadClip(melody_clip, duration);
//   }
//   else if(current_clip_type == MusicClipType.Beat){
//     beat_clip.setDuration(duration);
//     loadClip(beat_clip, duration);
//   }
// }
function removeAllElementsByClassName(className) {//
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}
function clearNoteClip(type){// 편집기에 모든 노트 제거
  if(type == MusicClipType.Melody){
    removeAllElementsByClassName("resize-drag");
    removeAllElementsByClassName("resize-lyrics");
  }
  if(type == MusicClipType.Lyrics){
    removeAllElementsByClassName("resize-lyrics");
  }
  else{
    removeAllElementsByClassName("draggable");
  }
}
function clearExampleClip(type){
  if(type == MusicClipType.Melody){
    removeAllElementsByClassName("inresize-drag");
  }
  else{
    removeAllElementsByClassName("indraggable");
  }
}


function loadClip(MusicClip, duration){ // 입력 클립을 편집기에 반영
  console.log("load Clip", MusicClip);
  console.log("duration ", duration);
  if(MusicClip.getClipType() == MusicClipType.Melody){
    const [NoteSet, TimeSet] = MusicClip.getMusicClip();
    //const lyricsList = MusicClip.getLyrics();
    for(let i=0; i<NoteSet.length; i++){
      let NoteItem = createResizeDragElement(NoteSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Melody);
      noteResizeChanger(NoteItem, time_to_px(TimeSet[i][1], duration));
    }
    const [LyricsSet, LyricsTimeSet, LyricsVideoId] = MusicClip.getAllLyrics();
    for(let i=0; i<LyricsSet.length; i++){
      createLyricsObject(i, LyricsSet[i], LyricsTimeSet[i][0],LyricsTimeSet[i][1], LyricsVideoId[i])
    }
  }
  else{
    const [padSet, TimeSet] = MusicClip.getMusicClip()
    for(let i=0; i<padSet.length; i++){
      let NoteItem = createResizeDragElement(padSet[i], time_to_px(TimeSet[i], duration), i, MusicClipType.Beat);
    }
  }
  noteClickIndex = -1;
}

function changeMusicClip(noteIndex, deltaTimeset){ // 노트 위치, 크기 편집을 클립 시간에 반영
  if(current_clip_type == MusicClipType.Melody){
    melody_clip.editNote(noteIndex, deltaTimeset)
  }
  else if(current_clip_type == MusicClipType.Beat){
    beat_clip.editNote(noteIndex, deltaTimeset)
  }
}
function changelyricsClip(noteIndex, deltaTimeset){ // 노트 위치, 크기 편집을 클립 시간에 반영
  if(current_clip_type == MusicClipType.Melody||current_clip_type==MusicClipType.Lyrics){
    melody_clip.editLyrics(noteIndex, deltaTimeset);
  }
}

//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//------------------------------------------- Track Code------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//

//Track Clip Icon Maker
function createClipBox(musicClip) { //Melody, Beat 노트 생성
  let currenctCliptType = musicClip.getClipType();
  let clip_id = musicClip.getClipId();
  const dragdrop = document.createElement("div");
  dragdrop.classList.add("drag-drop");  // resize-drag로 생성
  dragdrop.setAttribute("clip_id", clip_id); // clip_id 속성 추가
  dragdrop.setAttribute("clip_type", currenctCliptType); // clip_type 속성 추가
  dragdrop.addEventListener("click", function(){
    console.log("current Clip Type:", dragdrop.getAttribute("clip_type"),"current Clip id", dragdrop.getAttribute("clip_id"))
    loadFromTrackToMusicClip(dragdrop.getAttribute("clip_type"), dragdrop.getAttribute("clip_id"));
  })
  if(currenctCliptType == MusicClipType.Melody){
    dragdrop.textContent = "멜로디 " + (clip_id+1); //내용이 있어야 나와서 -로 일단 임시로 추가
    dragdrop.setAttribute("id", "melody-drop");
    let boxItem = document.getElementById("MelodydropContainer");
    boxItem.appendChild(dragdrop);
  }
  else{
    dragdrop.textContent = "비트 " + (clip_id+1); //내용이 있어야 나와서 -로 일단 임시로 추가
    dragdrop.setAttribute("id", "beat-drop");
    let boxItem = document.getElementById("BeatdropContainer");
    boxItem.appendChild(dragdrop);
  }
}
function createTemplateClipBox(template_clip){
  let clip_id = template_clip.get_Clip_id()
  const dragdrop_template = document.createElement("div");
  dragdrop_template.classList.add("drag-drop");  // resize-drag로 생성
  dragdrop_template.setAttribute("clip_id", clip_id); // clip_id 속성 추가
  dragdrop_template.setAttribute("clip_type", MusicClipType.Template); // clip_type 속성 추가
  dragdrop_template.addEventListener("click", function(){
    //console.log("current Clip Type:", dragdrop_template.getAttribute("clip_type"),"current Clip id", dragdrop_template.getAttribute("clip_id"))
    loadFromTrackToTemplateClip(dragdrop_template.getAttribute("clip_id"));
  })
    dragdrop_template.textContent = "효과 " + (clip_id+1); //내용이 있어야 나와서 -로 일단 임시로 추가
    dragdrop_template.setAttribute("id", "template-drop");
    let boxItem_template = document.getElementById("TemplatedropContainer");
    boxItem_template.appendChild(dragdrop_template);
  }


//Track Clip Object 생성용 코드(melody, Beat용)
function createTrackClipObject(dropzoneName, clipType, clip_id, duration, box_id){
  //let clipType = musicClip.getClipType();
  //let clip_id = musicClip.getClipId();
  //let duration = musicClip.getDuration();
  //console.log("duration Check", duration);
  const trackClip = document.createElement("div");
  trackClip.classList.add("draggable_clip");
  trackClip.style.width = time_to_px(duration, duration_track, track_box_width, 0) + "px"

  if(clipType == MusicClipType.Melody){
    trackClip.textContent = "멜로디" + (clip_id + 1); //내용이 있어야 나와서 -로 일단 임시로 추가
    //dragdrop.setAttribute("id", "melody-drop");
  }
  else{
    trackClip.textContent = "비트" + (clip_id + 1); //내용이 있어야 나와서 -로 일단 임시로 추가
    //dragdrop.setAttribute("id", "beat-drop");
  }
  let boxItem = document.getElementById(dropzoneName);
  trackClip.setAttribute("box_id", box_id); // clip_id 속성 추가
  trackClip.setAttribute("box_type", clipType); // clip_type 속성 추가
  trackClip.addEventListener("click", function(){
    console.log("type:", trackClip.getAttribute("box_type"), "id", trackClip.getAttribute("box_id"));
    trackClickIndex = trackClip.getAttribute("box_id");
    trackClickType = trackClip.getAttribute("box_type");
  })
  boxItem.appendChild(trackClip);
  return px_to_time_Scale(trackClip.offsetLeft, duration_track, track_box_width, 0)
}

//Track Clip Object 생성용 코드(Template용)
function createTrackClipObject_template(dropzoneName, clip_id, box_id){
  const trackClip = document.createElement("div");
  trackClip.classList.add("resize-drag_clip");
  trackClip.style.width = time_to_px(60, duration_track, track_box_width, 0) + "px"
  let boxItem = document.getElementById(dropzoneName);
  trackClip.textContent = "효과" + (clip_id+1)
  trackClip.setAttribute("box_id", box_id); // clip_id 속성 추가
  trackClip.setAttribute("box_type", MusicClipType.Template); // clip_type 속성 추가
  trackClip.addEventListener("click", function(){
    console.log("type:", trackClip.getAttribute("box_type"), "id", trackClip.getAttribute("box_id"));
    trackClickIndex = trackClip.getAttribute("box_id");
    trackClickType = trackClip.getAttribute("box_type");
  })
  boxItem.appendChild(trackClip);
  return px_to_time_Scale(trackClip.offsetLeft, duration_track, track_box_width, 0)
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
  max: track_box_width,
  step: 0.1,
  slide: function( event, ui ) {
    timeLine3.style.left = (ui.value) + "px";
    currentTrackTime = px_to_time(ui.value, duration_track, track_box_width, 0)
    //console.log("Track Time", currentTrackTime)
  }
});

function updateTime2() { //시간에 따라 업데이트 해야하는 함수들
  if(bpmPlayNumber > 4){
    currentTrackTime += 1/fps
    //musicPlayer(currentTime);
    $("#slider_track").slider("value",time_to_px(currentTrackTime, duration_track, track_box_width, 0));
    timeLine3.style.left = time_to_px(currentTrackTime, duration_track, track_box_width, 0) + "px";
    //console.log("Test Track", cur_track_set[0][1]);
    let cur_track_set = TrackObject.getcurrentClipSet(currentTrackTime);
    //console.log(cur_track_set)
    if(cur_track_set[0].length > 0){
      //console.log(Template_clip_array);
      templatePlayerClip(Template_clip_array[cur_track_set[0][1]]);
    }
    if(cur_track_set[1].length > 0){
      musicPlayerMelodyClip(currentTrackTime - cur_track_set[1][0], Melody_clip_array[cur_track_set[1][1]]);
      if(current_clip_type == MusicClipType.Melody || current_clip_type == MusicClipType.Lyrics){ // 클립 로드
        if(melody_clip != Melody_clip_array[cur_track_set[1][1]]){
          melody_clip = Melody_clip_array[cur_track_set[1][1]];
          clearNoteClip(MusicClipType.Melody);
          loadClip(melody_clip, melody_clip.getDuration());
        }
        ClipUpdateTimeControl(currentTrackTime - cur_track_set[1][0]);
      }
    }
    if(cur_track_set[2].length > 0){
      musicPlayerBeatClip(currentTrackTime - cur_track_set[2][0], Beat_clip_array[cur_track_set[2][1]]);
      if(current_clip_type == MusicClipType.Beat){// 클립 로드
        if(beat_clip != Beat_clip_array[cur_track_set[2][1]]){
          beat_clip = Beat_clip_array[cur_track_set[2][1]];
          clearNoteClip(MusicClipType.Beat);
          loadClip(beat_clip, beat_clip.getDuration());
        }
        ClipUpdateTimeControl(currentTrackTime - cur_track_set[2][0])
      }
    }
    if(currentTrackTime >= duration_track){
      stopTrack() // 끝 도달하면 자동으로 종료
    }
  }
}
function initializeTimer2(){ // Timer 초기화
  $("#slider_track").slider("value",time_to_px(currentTrackTime, duration_track, track_box_width, 0));
  timeLine3.style.left = time_to_px(currentTrackTime, duration_track, track_box_width, 0) + "px";
}
function musicPlayerMelodyClip(currentTime, melody_clip){  //음이나 비트 소리를 재생하는 코드
  let currentNote = melody_clip.getcurrentNoteSet(currentTime);
  notePlayer(currentNote, previousNote_track);
  previousNote_track = melody_clip.getcurrentNoteSet(currentTime);
  showLyrics(currentTime);
}
function musicPlayerBeatClip(currentTime, beat_clip){  //음이나 비트 소리를 재생하는 코드
  let currentBeat = beat_clip.getcurrentNoteSet(currentTime);
  for (let beat of currentBeat){
    beat_player(beat);
    setTimeout(() => beat_output_play(beat), 100);
  }
}
function templatePlayerClip(inputClip){
  if(inputClip.get_Clip_id() != previousDial_ID){
    //console.log("id", inputClip.get_Clip_id())
    template_clip = inputClip
    templateConnectToVisualAndSound(inputClip);
     previousDial_ID = inputClip.get_Clip_id();
  }
}
function templateConnectToVisualAndSound(inputClip){
  const event = new CustomEvent('templateLoad', { detail: inputClip.get_dial() });
  SyntheysizerEvents.dispatchEvent(event);
}
function clearAllBoxClip(){// 편집기에 모든 노트 제거
  InitializeAllTrack();
  removeAllElementsByClassName("drag-drop");
}
function InitializeAllTrack(){
  removeAllElementsByClassName("resize-drag_clip");
  removeAllElementsByClassName("draggable_clip");
}
document.getElementById("trackMusicPlayButton").addEventListener('click', function (){
  startTrack();
})
document.getElementById("trackMusicPauseButton").addEventListener('click', function (){
  stopTrack();
  stopAllNotePlayer2();
})
document.getElementById("trackMusicDeleteButton").addEventListener('click', function (){
  TrackObject.deleteClip(trackClickType, trackClickIndex);
  InitializeAllTrack();
  loadTrack(TrackObject);
})
function loadTrack(MusicTrack){ // Track을 편집기에 반영
  const [TemplateId, TemplateTimeset] = MusicTrack.getTemplateSet()
  const [MelodyClipId, MelodyTimeset] = MusicTrack.getMelodySet()
  const [BeatClipId, BeatTimeset] = MusicTrack.getBeatSet()
  for(let i=0; i<TemplateId.length; i++){
    createTrackClipObject_template('template-dropzone', TemplateId[i], i);
  }
  for(let i=0; i<MelodyClipId.length; i++){
    createTrackClipObject("melody-dropzone", MusicClipType.Melody, MelodyClipId[i], MelodyTimeset[i][1]-MelodyTimeset[i][0], i)
  }
  for(let i=0; i<BeatClipId.length; i++){
    createTrackClipObject("beat-dropzone", MusicClipType.Beat, BeatClipId[i], BeatTimeset[i][1]-BeatTimeset[i][0], i)
  }
}

function stopAllNotePlayer2(){
  if(previousNote_track.length > 0){
    //console.log("Ouput ", exclusiveArr2);
    for( let note of previousNote_track){
      piano_player(note, false);
    }  
  }
  previousNote_track - [];
}
function loadFromTrackToMusicClip(clip_type, clip_id){
  if(clip_type == MusicClipType.Melody){
    if(current_clip_type == MusicClipType.Lyrics){  //클릭 당시 Lyrics 씬일 때만 적용
      lyricsTypeSceneChanger();
      melody_clip = Melody_clip_array[clip_id];
      loadClip(melody_clip, melody_clip.getDuration());
    }
    else{                                           // 나머지는 다 Melody 씬으로 이동
      melodyTypeSceneChanger();
      clearNoteClip(MusicClipType.Melody);
      melody_clip = Melody_clip_array[clip_id];
      loadClip(melody_clip, melody_clip.getDuration());
    }
  }
  else{
    beatTypeSceneChanger();
    clearNoteClip(MusicClipType.Beat);
    beat_clip = Beat_clip_array[clip_id];
    loadClip(beat_clip, beat_clip.getDuration());
  }
}
function loadFromTrackToTemplateClip(clip_id){
  templateTypeSceneChanger();
  templateConnectToVisualAndSound(template_clip);
}

//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------- File Save and upLoad code -------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//

function downloadJsonFile(filename, data) { // 객체를 JSON 파일로 다운로드하는 함수
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
const tmp_Meldoy_array = []
const tmp_Beat_array = []
const tmp_template_array = []


document.getElementById("trackMusicSaveButton").addEventListener('click', function(){
  generateMidi();
//   let MusicTrackObejct = {
//     "Type":"MusicTrack",
//     "user_Id": TrackObject.getUserId(),
//     "id_set" : TrackObject.getIdData(),
//     "time_set" : TrackObject.getTimeData()
//   }
//   //downloadJsonFile("MusicTrack_" + TrackObject.getUserId(), MusicTrackObejct);  //Track 정보 저장
//   if(current_clip_type == MusicClipType.Template){
//     for(let i = 0; i < Template_clip_array.length; i ++){
//       let templateObejct = {
//         "userName":userName,
//         "musicName":musicId,
//         "Type": MusicClipType.Template,
//         "CLip id": Template_clip_array[i].get_Clip_id(),
//         "duration": Template_clip_array[i].get_duration(),
//         "instrument": Template_clip_array[i].get_instrument(),
//         "dial_set": Template_clip_array[i].get_dial()
//       }
//       downloadJsonFile("template_clip_" + userName + "_" + musicId, templateObejct); 
//     }
//   }
//   if(current_clip_type == MusicClipType.Melody){
//     for(let i = 0; i < Melody_clip_array.length; i ++){
//       let MusicObejct = {
//         "userName":userName,
//         "musicName":musicId,
//         "Type": Melody_clip_array[i].getClipType(),
//         "CLip id": Melody_clip_array[i].getClipId(),
//         "duration": Melody_clip_array[i].getDuration(),
//         "noteSet": Melody_clip_array[i].getMusicClip()[0],
//         "timeSet": Melody_clip_array[i].getMusicClip()[1],
//       }
//       downloadJsonFile("Melody_clip_" + userName + "_" + musicId, MusicObejct); 
//     }
//   }
//   if(current_clip_type == MusicClipType.Beat){
//     for(let i = 0; i < Beat_clip_array.length; i ++){
//       let MusicObejct = {
//         "userName":userName,
//         "musicName":musicId,
//         "Type": Beat_clip_array[i].getClipType(),
//         "CLip id": Beat_clip_array[i].getClipId(),
//         "duration": Beat_clip_array[i].getDuration(),
//         "noteSet": Beat_clip_array[i].getMusicClip()[0],
//         "timeSet": Beat_clip_array[i].getMusicClip()[1]
//       }
//       downloadJsonFile("Beat_clip_" + userName + "_" + musicId, MusicObejct); 
//     }
//   }
})



/*------------------------------------------laod MIDI Code -------------------------------------------- */
document.getElementById("sheetMusicLoadButton").addEventListener('click', function (){
  FileInput.click();
})
FileInput.addEventListener('change', function(e){
  // const Files = e.target.files;
  // for(let file of Files){
  //   const reader = new FileReader();
  //   reader.onload = function(event) {
  //     const contents = event.target.result;
  //     const jsonObject = JSON.parse(contents);
  //     if(jsonObject["Type"]==MusicClipType.Melody){
  //       let Tmp_melody_clip = new MusicClip(jsonObject["Type"], jsonObject["CLip_id"], jsonObject["duration"], jsonObject["noteSet"], jsonObject["TimeSet"])
  //       console.log("Melody push", Tmp_melody_clip);
  //       tmp_Meldoy_array.push(Tmp_melody_clip)
  //     }
  //     if(jsonObject["Type"]==MusicClipType.Beat){
  //       let Tmp_beat_clip = new MusicClip(jsonObject["Type"], jsonObject["CLip_id"], jsonObject["duration"], jsonObject["noteSet"], jsonObject["TimeSet"]);
  //       console.log("Beat push", Tmp_beat_clip);
  //       tmp_Beat_array.push(Tmp_beat_clip);
  //     }
  //     if(jsonObject["Type"]==MusicClipType.Template){
  //       let Tmp_template_clip = new TemplateClip(jsonObject["CLip_id"], jsonObject["duration"], jsonObject["instrument"]);
  //       Tmp_template_clip.set_dial(jsonObject["dial_set"]);
  //       console.log("Template push", Tmp_template_clip);
  //       tmp_template_array.push(Tmp_template_clip);
  //     }
  //     if(jsonObject["Type"]=="MusicTrack"){
  //       TrackObject = new MusicTrack(jsonObject["user_Id"], jsonObject["id_set"], jsonObject["time_set"]);
  //       console.log("TrackObject : ", TrackObject);
  //     }
  //   };
  //   reader.readAsText(file);
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
      try {
          const data = new Uint8Array(e.target.result);
          const smf = new JZZ.MIDI.SMF(data.buffer);
          getMididata(smf[0])
      } catch (error) {
          console.error('Error parsing MIDI file:', error);
      }
  };
  reader.onerror = function() {
      console.error('Error reading file:', reader.error);
  };
  reader.readAsArrayBuffer(file);
})
let OverMidiDataChecker = false;

function clipDurationNormalize(type){
  if(type == MusicClipType.Melody){
    if(melody_clip.getNoteIndex() != 0){
      melody_clip.setDuration(melody_clip.getClipLastTime()+1)
    }
    else{
      console.log("there isn't note")
    }
  }
  else{
    if(beat_clip.getNoteIndex() != 0){
      beat_clip.setDuration(beat_clip.getClipLastTime()+1)
    }
    else{
      console.log("there isn't note")
    }
  }
}
function setMidiToMelodyClip(inputLog){
  let [channel, input, note, time] = inputLog
  if(channel == 0){
    if(input){
      melody_clip.setNoteInput(note,time);
    }
    else{
      melody_clip.setNoteRelease(note,time);
    }
  }
}
function setMidiToBeatClip(inputLog){
  let [channel, input, note, time] = inputLog
  if(input){
    console.log("note :", note.slice(0, -1), "index :", midiBeatNote.indexOf(note.slice(0, -1)), "time:", time)
    if(midiBeatNote.indexOf(note.slice(0, -1)) != -1){
      beat_clip.setBeatInput(midiBeatNote.indexOf(note.slice(0, -1)), time)
    }
    else{
      OverMidiDataChecker = true;
    }
  }
}
function getMididata(midiData) { 
  console.log("current Type", current_clip_type);
  newClipCreater();  
  for(let i = 0; i<midiData.length; i++){
    if(midiData[i].length > 0){
      let MidiTextLine = getMidiLine(midiData[i])
      if(MidiTextLine != null){
        if(current_clip_type == MusicClipType.Melody){
          setMidiToMelodyClip(MidiTextLine)
        }
        else if(current_clip_type==MusicClipType.Beat){
          setMidiToBeatClip(MidiTextLine)
        }
      }
    }
  }
  if(current_clip_type == MusicClipType.Melody){
    clipDurationNormalize(MusicClipType.Melody)
    console.log(melody_clip)
    loadClip(melody_clip, melody_clip.getDuration())
  }
  else if(current_clip_type == MusicClipType.Beat){
    clipDurationNormalize(MusicClipType.Beat)
    console.log(beat_clip)
    loadClip(beat_clip, beat_clip.getDuration())
  }
  if(OverMidiDataChecker){
    alert("범위에서 벗어난 MIDI 정보가 있습니다. 일부는 적용이 안됩니다.")
    OverMidiDataChecker = false;
  }
}

function getMidiLine(midiLine){
  if(midiLine[0] >= 144 && midiLine[0] <= 154){
    return [midiLine[0] - 144, true, pitch2NoteMidi(midiLine[1]), midiLine.tt/midiBPM/2]
  }
  else if(midiLine[0] >= 128 && midiLine[0] <= 138){
    return [midiLine[0] - 128, false, pitch2NoteMidi(midiLine[1]), midiLine.tt/midiBPM/2]
  }
  else if(midiLine[0] >= 192 && midiLine[0] <= 202){
    console.log("channel :", midiLine[0] - 192, " setting MIDI Instrument :", midiLine[1])
    return null
  }
  else{
    //console.log("except check here");
    console.log("except check here", midiLine);
    OverMidiDataChecker = true;
    return null
  }
}

function pitch2NoteMidi(input_pitch){
  let noteType = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
  return noteType[(input_pitch -12)%12] + String(parseInt((input_pitch - 12)/12))
}


/*------------------------------------------laod MIDI Code -------------------------------------------- */

//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------가사 관련 추가 코드---------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//




document.getElementById("LyricsPushButton").addEventListener("click", function(){
  let lyricsDefaultTime = parseInt(melody_clip.getDuration()/10)
  if(lyricsDefaultTime < 1){
    lyricsDefaultTime = 1
  }
  let lyricsText = document.getElementById("lyricsInputer").value;
  let lyricsLastTime = melody_clip.getLyricsLastTime();
  let lyticsId = melody_clip.getLyricsIndex()
  melody_clip.setLyrics(lyricsText,[lyricsLastTime, lyricsLastTime + lyricsDefaultTime])
  createLyricsObject(lyticsId, lyricsText, lyricsLastTime, lyricsLastTime + lyricsDefaultTime, -1);
  document.getElementById("lyricsInputer").value = ""
})
function createLyricsObject(note_id, lyricsText, startTime, endTime, LyricsVideoId){
  const boxItem = document.getElementById("LyricsBox1");
  const lyricsNote = document.createElement("div");
  lyricsNote.classList.add("resize-lyrics");
  lyricsNote.style.left = time_to_px(startTime, currentClipDuration()) + "px";
  lyricsNote.style.width = time_to_px_Scale(endTime - startTime, currentClipDuration()) + "px";
  lyricsNote.textContent = lyricsText
  lyricsNote.setAttribute("note_id", note_id); // clip_id 속성 추가
  lyricsNote.addEventListener("click", function(){
    console.log("id", lyricsNote.getAttribute("note_id"));
    noteClickIndex = lyricsNote.getAttribute("note_id");
    document.getElementById("lyricsWord").innerHTML = lyricsNote.textContent;
    let lyricsVideoId = melody_clip.getLyricsVideoId(lyricsNote.getAttribute("note_id"))
    if(lyricsVideoId != -1){
      loadVideoClip(lyricsVideoId)
      document.getElementById('lyricsVideo').innerHTML = "수어 " + (lyricsVideoId + 1);
    }
    else{
      document.getElementById('lyricsVideo').innerHTML = "none";
    }
  })
  boxItem.appendChild(lyricsNote);
}

function showLyrics(currentTime){
  let [currentLyricsText, currentLyricsIndex] = melody_clip.getLyrics(currentTime);
  document.getElementById("lyricsDisplay").innerHTML = currentLyricsText;
  playVideoControl(currentTime, currentLyricsIndex);
}



interact('.resize-lyrics')
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
        changelyricsClip(event.target.getAttribute("note_id"), [px_to_time_Scale(event.deltaRect.left, currentClipDuration()), px_to_time_Scale(event.deltaRect.left + event.deltaRect.width, currentClipDuration())])
        Object.assign(event.target.dataset, { x, y })
      }
    }
  })
  .draggable({
    listeners: { move: window.dragMoveListener_lyrics },
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
      move: dragMoveListener_lyrics,

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
function dragMoveListener_lyrics(event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = 0
  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  changelyricsClip(event.target.getAttribute("note_id"), [px_to_time_Scale(event.dx, currentClipDuration()), px_to_time_Scale(event.dx, currentClipDuration())])
  // update the posiion attributes
  target.setAttribute('data-x', x)
}

//------------------------------------------- 매트로늄 생성용 코드---------------------------------------------------//


//let bpmPlayOn = document.getElementById("BPMType"); //bpm 온오프 설정용 예비함수1

let bpmHapticOn = false // bpm-beat haptic 설정용 예비함수2
const metronome = new Tone.Loop(time => {
  const synth = new Tone.NoiseSynth().toDestination();
  if(document.getElementById("BPMType").checked){
    synth.triggerAttackRelease("2n", time);
  }
  if(!document.getElementById("hapticType").checked){
    document.getElementById('HapticPlayButton1').click();
  }
  bpmPlayNumber += 1;
}, "4n");

function startMetronome() {
  const bpm = parseFloat(document.getElementById("bpm").value);
  Tone.Transport.bpm.value = bpm;
  metronome.start(0);
  Tone.Transport.start();
}
function stopMetronome() {
  metronome.stop();
  Tone.Transport.stop();
  bpmPlayNumber = 0;
}



//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//
//------------------------------------------- Note Interaction용 ----------------------------------------------------//
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
        changeMusicClip(event.target.getAttribute("note_id"), [px_to_time_Scale(event.deltaRect.left, currentClipDuration()), px_to_time_Scale(event.deltaRect.left + event.deltaRect.width, currentClipDuration())])
        
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
    changeMusicClip(event.target.getAttribute("note_id"), [px_to_time_Scale(event.dx, currentClipDuration()), px_to_time_Scale(event.dx, currentClipDuration())])
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
    TrackObject.editMusicClip(event.target.getAttribute("box_type"), event.target.getAttribute("box_id"), px_to_time(event.dx, duration_track, track_box_width, 0))
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
      if(trackActivaqte){
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
      const tempalteId = parseInt(event.relatedTarget.getAttribute("clip_id"));
      const clipTime = createTrackClipObject_template('template-dropzone', tempalteId, TrackObject.getTempalateId())
        //console.log("clip Time Check", clipTime/10);
      TrackObject.setTemplateClip(tempalteId, clipTime)
        trackActivaqte = false;
      }
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
      trackActivaqte = true
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
      if(trackActivaqte){
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
      const Tmp_clip = get_clip(event.relatedTarget.getAttribute("clip_type"), event.relatedTarget.getAttribute("clip_id"))
      const clipTime = createTrackClipObject('melody-dropzone', Tmp_clip.getClipType(), Tmp_clip.getClipId(), Tmp_clip.getDuration(), TrackObject.getMelodyId())
      //console.log("clip Time Check", clipTime/10);
      TrackObject.setMusicClip(Tmp_clip, clipTime)
        trackActivaqte = false;
      }
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
      trackActivaqte = true
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
      if(trackActivaqte){
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
      const Tmp_clip = get_clip(event.relatedTarget.getAttribute("clip_type"), event.relatedTarget.getAttribute("clip_id"))
      const clipTime = createTrackClipObject('beat-dropzone', Tmp_clip.getClipType(), Tmp_clip.getClipId(), Tmp_clip.getDuration(), TrackObject.getBeatId())
      TrackObject.setMusicClip(Tmp_clip, clipTime)
      //console.log("clip Time Check", clipTime/10);
        trackActivaqte = false;
      }
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
      trackActivaqte = true
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