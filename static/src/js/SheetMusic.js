import { SyntheysizerEvents, MusicClip, MusicClipType, MusicTrack, TemplateClip, VideoClip} from './Share.js';
import { piano_player, beat_player, dialInitialize, beat_output_play} from './Synthesizer.js';
import * as Midi from "./jsmidgen.js"
//import * as JZZ from "./JZZ.js"

//최소 범위 A2 ~ C7

let nowClicked;
let previousClicked;
let clickCount = 0;
let clickedHistory = [];


let nowVideoClicked;
let previousVideoClicked;
let clickVideoCount = 0;
let clickedVideoHistory = [];

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
let TrackObject = new MusicTrack(duration_track);
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
let recordingState = false
const userName = document.getElementById("username").innerHTML;
console.log("userName", userName)

document.getElementById("synthConnector").click();

const videoRecordCanvas = document.getElementById("videoRecordCanvas");
let videoCheckContainerBox = document.getElementById("videoCheckContainer");

let saveStepTime = 2

createVerticalGrid(MusicClipType.Melody, time_to_px_Scale(saveStepTime, duration,clip_box_width-clip_start_px,0))
createVerticalGrid(MusicClipType.Beat, time_to_px_Scale(saveStepTime, duration,clip_box_width-clip_start_px,0))


document.getElementById("beatSelect").style.fontSize = '21px';
document.getElementById("beatSelect").style.marginTop = '-10px';




//---------------------------무드 데이터 수집용-------------------------//

const MoodList = ["blur", "cloud", "fog", "halo", "cells","none"]
const MoodId   = ['thema_blur', 'thema_clouds', 'thema_fog', 'thema_halo', 'thema_cells', 'thema_none']


let currentMoodName = MoodList[0];
let backgroundColor = document.getElementById("backgroundColorID").value;
let objectColor = document.getElementById("objectColor1ID").value;
let speedFeature = document.getElementById("speedID").value;
let zoomFeature = document.getElementById("zoomID").value;
let sizeFeature = document.getElementById("sizeID").value;
let velocityFeature = document.getElementById("velocityID").value;

document.getElementById(MoodId[0]).addEventListener("click", function(){currentMoodName = MoodList[0]});
document.getElementById(MoodId[1]).addEventListener("click", function(){currentMoodName = MoodList[1]});
document.getElementById(MoodId[2]).addEventListener("click", function(){currentMoodName = MoodList[2]});
document.getElementById(MoodId[3]).addEventListener("click", function(){currentMoodName = MoodList[3]});
document.getElementById(MoodId[4]).addEventListener("click", function(){currentMoodName = MoodList[4]});
document.getElementById(MoodId[5]).addEventListener("click", function(){currentMoodName = MoodList[5]});


// 색상 저장 버튼
document.getElementById('backgroundColorSaveButton').addEventListener("click", function(){
  backgroundColor = document.getElementById("backgroundColorID").value;
});
document.getElementById('objectColor1SaveButton').addEventListener("click", function(){
  objectColor = document.getElementById("objectColor1ID").value;
});


// 추가 요소 저장 버튼
document.getElementById('speedSaveButton').addEventListener("click", function(){
  speedFeature = document.getElementById("speedID").value;
});
document.getElementById('zoomSaveButton').addEventListener("click", function(){
  zoomFeature = document.getElementById("zoomID").value;
});
document.getElementById('sizeSaveButton').addEventListener("click", function(){
  sizeFeature = document.getElementById("sizeID").value;
});
document.getElementById('velocitySaveButton').addEventListener("click", function(){
  velocityFeature = document.getElementById("velocityID").value;
});

function saveMood(){
  let MoodDataObject = {
    "MoodName":currentMoodName,
    "backgroundColor":backgroundColor,
    "objectColor":objectColor,
    "speedFeature":speedFeature,
    "zoomFeature":zoomFeature,
    "sizeFeature":sizeFeature,
    "velocityFeature":velocityFeature
  }
  console.log("MoodDataSave")
  console.log(MoodDataObject)
  downloadJsonFile(userName + "_Moodlog", MoodDataObject);
}
function loadMood(jsonObject){
  let MoodName = jsonObject["MoodName"];
  let backgroundColor = jsonObject["backgroundColor"]
  let objectColor = jsonObject["objectColor"]
  let speedFeature = jsonObject["speedFeature"]
  let zoomFeature = jsonObject["zoomFeature"]
  let sizeFeature = jsonObject["sizeFeature"]
  let velocityFeature = jsonObject["velocityFeature"]

  document.getElementById(MoodId[MoodList.indexOf(MoodName)]).click();
 
  document.getElementsByClassName('clr-field')[0].style.color = backgroundColor;
  document.getElementById("backgroundColorSaveButton").click();

  document.getElementsByClassName('clr-field')[1].style.color = objectColor;
  document.getElementById("objectColor1SaveButton").click();

  document.getElementById("speedID").value = speedFeature;
  document.getElementById("zoomID").value = zoomFeature;
  document.getElementById("sizeID").value = sizeFeature;
  document.getElementById("velocityID").value = velocityFeature;

  document.getElementById("speedSaveButton").click();
  document.getElementById("zoomSaveButton").click();
  document.getElementById("sizeSaveButton").click();
  document.getElementById("velocitySaveButton").click();

}


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
  // else{
  //   templateTypeSceneChanger();
  // }
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
  // else if(current_clip_type == MusicClipType.Lyrics){
  //   templateTypeSceneChanger();
  // }
  else{
    totalTypeSceneChanger();
    document.getElementById("sheetMusicSaveButton").click();
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
  document.getElementById("Melody-VerticalGrid").style.display ='block';
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
  document.getElementById("Melody-VerticalGrid").style.display ='none';

  document.getElementById("trackText").style.display = 'block';
  document.getElementById("timeLine3").style.display = 'block';
  document.getElementById("trackMusicDeleteButton").disabled = false;
  document.getElementById("trackClipCreateButton").disabled = false;
  document.getElementById("TrackContainer").style.display = 'block';
  document.getElementById("clipEditContainer").style.display = 'block';
  document.getElementById("videoCheckContainer2").style.display = 'none';

  //videoCheckCanvas = document.getElementById("videoCheckCanvas");
  videoCheckContainerBox = document.getElementById("videoCheckContainer");

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

  document.getElementById("trackText").style.display = 'block';
  document.getElementById("timeLine3").style.display = 'block';
  document.getElementById("trackMusicDeleteButton").disabled = false;
  document.getElementById("trackClipCreateButton").disabled = false;
  document.getElementById("TrackContainer").style.display = 'block';
  document.getElementById("clipEditContainer").style.display = 'block';
  document.getElementById("videoCheckContainer2").style.display = 'none';

  videoCheckContainerBox = document.getElementById("videoCheckContainer");
}
function totalTypeSceneChanger(){
  if(window.confirm("마지막 페이지로 가면 감상 및 저장만 가능하고 더 이상 편집이 불가능합니다. 다음 페이지로 넘기시겠습니까?")){
    current_clip_type = MusicClipType.Total;
    noteClickIndex = -1;
    console.log("to Total", current_clip_type);
    document.getElementById("moodContainer").style.display = "none";
    document.getElementById("sheetMusicController").style.display = "none";
    document.getElementById("trackContainer").style.display = "block";
    document.getElementById("ThemaContainer").style.display = "none";
    document.getElementById("BeatContainer").style.display = 'none';
    document.getElementById("MelodyContainer").style.display = 'none';
    document.getElementById("TemplateContainer").style.display = 'none';

    document.getElementById("trackText").style.display = 'none';
    document.getElementById("timeLine3").style.display = 'none';
    document.getElementById("trackMusicDeleteButton").disabled = true;
    document.getElementById("trackClipCreateButton").disabled = true;
    document.getElementById("TrackContainer").style.display = 'none';
    document.getElementById("clipEditContainer").style.display = 'none';
    document.getElementById("videoCheckContainer2").style.display = 'block';


    document.getElementById("shape-canvas").style.width = '960px';
    document.getElementById("shape-canvas").style.height = '580px';
    document.getElementById("shape-canvas").style.marginTop = '300px'

    document.getElementById("trackContainer").style.width = '900px'
    document.getElementById("trackContainer").style.height = '620px'

    document.getElementById("trackContainer").style.marginTop = '-620px'
    document.getElementById("slider_track").style.width = '720px';
    document.getElementById("slider_track").style.marginLeft = '70px';
    document.getElementById('trackMusicPlayButton').style.marginLeft = '580px';
    document.getElementById('trackMusicDeleteButton').style.display = 'none';
    document.getElementById('trackClipCreateButton').style.display = 'none';


    document.getElementById('sheetMusicSaveButton').style.marginBottom = '-400px;'

    videoCheckContainerBox = document.getElementById("videoCheckContainer2");
    // videoCheckCanvas.style.width = '750px';
    // videoCheckCanvas.style.height = '510px';
    // videoCheckCanvas.style.marginTop = '10px';
    // videoCheckCanvas.style.marginLeft = '60px';
  }
}
/*------------------------------단축키 코드 관련 코드--------------------------------*/
let spaceKeyOnOff = true;
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
        if(!play_state_track){
          document.getElementById("trackMusicPlayButton").click();
        }
        else{
          document.getElementById("trackMusicPauseButton").click();
        }
      } 
      else {
        console.log("space")
        if(document.getElementById("lyricsInputer").value == ""){
          if(current_clip_type == MusicClipType.Melody||current_clip_type == MusicClipType.Beat){
            if(!play_state){
              document.getElementById("sheetMusicPlayButton").click();
            }
            else{
              document.getElementById("sheetMusicPauseButton").click();
            }
          }
          else if(current_clip_type == MusicClipType.Lyrics){
            if(!recordingState){
              document.getElementById("recordStartButton").click();
            }
            else{
              document.getElementById("recordStopButton").click();
            }
          }
        }
      }
      break;
    case 's':
      if(event.shiftKey){
      document.getElementById("sheetMusicSaveButton").click();
      }
      break;
    case 'q':
      if(event.shiftKey){
        document.getElementById("synthInitialize").click();
        console.log("initial synth")
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
    // case "Backspace":
    //   if(current_clip_type == MusicClipType.Beat || current_clip_type == MusicClipType.Melody || current_clip_type == MusicClipType.Lyrics){
    //     document.getElementById("sheetMusicDeleteButton").click();
    //   }
    //   break
    // case "Delete":
    //   if(current_clip_type == MusicClipType.Beat || current_clip_type == MusicClipType.Melody || current_clip_type == MusicClipType.Lyrics){
    //     document.getElementById("sheetMusicDeleteButton").click();
    //   }
    //   break
    default:
      return;
  }

  event.preventDefault();
}, true);

/*------------------------------녹화용 코드 관련 코드--------------------------------*/
let mediaRecorder = null;
let videoId = 0;
let chunck = [];
function videoRecordingMode(recordingState){
  if(recordingState){
    videoRecordCanvas.style.display = "block"
    document.getElementById("videoCheckContainer").style.display = "none"
  }
  else{
    videoRecordCanvas.style.display = "none"
    document.getElementById("videoCheckContainer").style.display = "block"
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
  recordingState = true;
  let vidoeDuration = 0;
  let startDate = 0;
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
    recordingState = false;
    vidoeDuration = (Date.now() - startDate)/1000
    console.log("recording Stop : ");
    console.log("video Duration :", vidoeDuration);
    let videoBlob = new Blob(chunck, { type: 'video/webm' });
    console.log(videoBlob);


    let newId = videoObject.get_newVideoId();
    videoObject.setVideo(newId, videoBlob, vidoeDuration);
    videoDownload(videoBlob, newId, vidoeDuration);
    // 녹화 영상 생성 밑 재생
    createVideoCheckCanvas(newId, videoBlob);

    //최종본에도 일단 생성
    createVideoCheckCanvas2(newId, videoBlob);
    // 기존 녹화 데이터 제거
    chunck.splice(0);
    // Clip 생성
    createVideoClipObject(newId);
  }
  mediaRecorder.start();
}



function createVideoCheckCanvas(videoId, blob) {
  // Ensure blob is an instance of Blob
  if (!(blob instanceof Blob)) {
      console.error('The input data is not a Blob');
      return;
  }
  // Create a new video element
  var video = document.createElement('video');

  // Apply the attributes and styles
  video.setAttribute('id', videoId);
  video.setAttribute('controls', '');
  video.style.width = '550px';
  video.style.height = '350px';
  //video.style.marginLeft = '-30px';
  //video.style.marginTop = '-30px';
  video.style.transform = 'rotateY(180deg)';
  video.style.webkitTransform = 'rotateY(180deg)';
  video.style.mozTransform = 'rotateY(180deg)';
  
  // Create a URL for the blob
  var url = URL.createObjectURL(blob);
  // Set the source of the video element
  video.src = url;
  // Add controls to the video
  video.controls = true;
  let container = document.getElementById("videoCheckContainer")
  // Append the video to the body (or any other container)
  container.appendChild(video);
  videoDisplay(videoId);
  video.play();
}

function createVideoCheckCanvas2(videoId, blob) {
  // Ensure blob is an instance of Blob
  if (!(blob instanceof Blob)) {
      console.error('The input data is not a Blob');
      return;
  }
  // Create a new video element
  var video = document.createElement('video');

  // Apply the attributes and styles
  video.setAttribute('id', videoId);
  video.setAttribute('controls', '');
  video.style.width = '750px';
  video.style.height = '510px';
  //video.style.marginLeft = '-30px';
  //video.style.marginTop = '-30px';
  video.style.transform = 'rotateY(180deg)';
  video.style.webkitTransform = 'rotateY(180deg)';
  video.style.mozTransform = 'rotateY(180deg)';
  
  // Create a URL for the blob
  var url = URL.createObjectURL(blob);
  // Set the source of the video element
  video.src = url;
  // Add controls to the video
  video.controls = true;
  let container = document.getElementById("videoCheckContainer2")
  // Append the video to the body (or any other container)
  container.appendChild(video);
}








function videoDisplay(videoId){ //지정한 비디오만 
    // Get all the video elements inside the div
    var videos = videoCheckContainerBox.getElementsByTagName('video');
    
    // Log the videoId of each video
    for (var i = 0; i < videos.length; i++) {
      if(videoId ==videos[i].getAttribute('id')){
        videos[i].style.display = "block";
      }
      else{
        videos[i].style.display = "none";
      }
    }
}
function getVideo(videoId){ //비디오를 ID로 접근하는 코드
  // Get all the video elements inside the div
  var videos = videoCheckContainerBox.getElementsByTagName('video');
  // Log the videoId of each video
  for (var i = 0; i < videos.length; i++) {
    if(videoId ==videos[i].getAttribute('id')){
      videoDisplay(videoId);
      videos[i].currentTime = 0.0;
      return videos[i];
    }
  }
  return null;
}
function pauseVideo(){  //저장된 비디오 전부 정지
  // Get all the video elements inside the div
  var videos = videoCheckContainerBox.getElementsByTagName('video');
  // Log the videoId of each video
  for (var i = 0; i < videos.length; i++) {
    if(!videos[i].paused){
      videos[i].pause();
    }
  }
}

document.getElementById("recordStopButton").addEventListener("click", function(){
  // 녹화 종료!
  videoRecordingMode(false);
  mediaRecorder.stop();
})
function loadVideoClip(videoId){
  videoRecordingMode(false);
  videoDisplay(videoId);
  let videoCheckCanvas = getVideo(videoId);
  if(videoCheckCanvas!=null && videoCheckCanvas.paused){
    videoCheckCanvas.play();
  }
}
function setViodeTime(videoCheckCanvas, setTime, playbackRate){
  let videoTime = setTime * playbackRate;
  if(Math.abs(videoCheckCanvas.currentTime - videoTime) > 0.4){
    console.log("setting video Time : ", videoCheckCanvas.currentTime, videoTime)
    videoCheckCanvas.currentTime = videoTime;
  }
}

function videoDownload(blob, id, duration){
  const url = window.URL.createObjectURL(blob);
  console.log(blob)
  const a = document.createElement('a');
  let fileName = userName +"_id" + id + "_du_" + parseInt(duration*1000)
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

function parseVideoString(inputString) {
  const regex = /^(.*?)_id(\d+)_du_(\d+)(?:\.webm)?$/; // Regular expression to match the format
  const match = inputString.match(regex);

  if (!match) {
    throw new Error("Invalid input string format");
  }

  const userName = match[1];
  const id = parseInt(match[2]);
  const duration = parseInt(match[3]) / 1000;

  return [ id, duration ];
}


function loadVideoFile(videoId, Bolb, videoDuration){
  videoRecordingMode(false);
  //removeAllElementsByClassName("Video_clip");
  // Create a new Uint8Array from the ArrayBuffer
  // Create a new Blob from the Uint8Array
  //let videoBlob = new Blob([result], { type: 'video/webm' });
  console.log(Bolb)
  videoObject.setVideo(videoId, Bolb, videoDuration);
  // 녹화 영상 생성 밑 재생
  createVideoCheckCanvas(videoId, Bolb);
  //최종본에도 일단 생성
  createVideoCheckCanvas2(videoId, Bolb);
  // Clip 생성
  createVideoClipObject(videoId);
}

//video Clip Object 생성용 코드(melody, Beat용)
function createVideoClipObject(videoCLipId){
  const videoIdClip = document.createElement("div");
  videoIdClip.classList.add("Video_clip");
  videoIdClip.style.width = '200px'
  videoIdClip.style.backgroundColor = getColor(videoCLipId)
  videoIdClip.textContent = "수어_" + (videoCLipId + 1); 
  let boxItem = document.getElementById("VideoClipContainer");
  videoIdClip.setAttribute("Video_Cilp_id", videoCLipId); // clip_id 속성 추가
  videoIdClip.setAttribute('id', "video" + videoCLipId); // 색상 바꾸는 용도
  videoIdClip.addEventListener("click", function(){
    console.log("videoClipId:", videoIdClip.getAttribute("Video_Cilp_id"));
    if(videoCLipId != -1){
      loadVideoClip(videoIdClip.getAttribute("Video_Cilp_id"));
    }
    if(current_clip_type == MusicClipType.Lyrics){
      document.getElementById('lyricsVideo').innerHTML = videoIdClip.textContent;
    }
  })


  // 여기임당

  videoIdClip.addEventListener("click", function (){
    clickVideoCount += 1;
    console.log(videoIdClip.id);
    clickedVideoHistory.push(videoIdClip.id) // 아이디 히스토리 리스트로 넣기

    // clickedHistory[-2] != clickedHistory[-1]
    if (clickedVideoHistory.length == 1){     // 하나만 들어왔을 시
      // console.log('히스토리', clickedHistory);
      nowVideoClicked = document.getElementById(clickedVideoHistory[0]);
      console.log('요거', nowVideoClicked)
      nowVideoClicked.style.borderWidth = '0.5em'
    }

    // 두개 이상 들어왔을 시
    else if (clickedVideoHistory.length > 1 && clickedVideoHistory[clickedVideoHistory.length - 1] != clickedVideoHistory[clickedVideoHistory.length - 2]){
      nowVideoClicked = document.getElementById(clickedVideoHistory[clickedVideoHistory.length - 1]);
      previousVideoClicked = document.getElementById(clickedVideoHistory[clickedVideoHistory.length - 2])

      nowVideoClicked.style.borderWidth = '0.5em'
      previousVideoClicked.style.borderWidth = ''
      
    }})
  boxItem.appendChild(videoIdClip);
}





document.getElementById("lyricsSettingButton").addEventListener("click", function(){
  if(current_clip_type == MusicClipType.Lyrics){
    let lyricsText = document.getElementById('lyricsVideo').innerHTML;
    let lyricsId = parseInt(lyricsText.split("_")[1]) - 1;
    if(noteClickIndex != -1){
      console.log("current lyrics id :", noteClickIndex, "video id :", lyricsId);
      alert("자막(" + melody_clip.getLyricsText(noteClickIndex) +")과 영상 ("+lyricsText +")이 연결되었습니다.")
      melody_clip.setLyricsVideo(noteClickIndex, lyricsId);
      videoClipObjectNameChange(lyricsId, melody_clip.getLyricsText(noteClickIndex));
    }
  }
})

function videoClipObjectNameChange(lyricsId, chageName){
  let object = getVideoClipObeject(lyricsId);
  if(object != null){
    object.innerHTML = chageName + "_" + (lyricsId+1)
  }
}



function getVideoClipObeject(lyricsId){
  const elements = document.getElementsByClassName("Video_clip");
  for (let i = 0; i < elements.length; i++) {
    if(elements[i].getAttribute("Video_Cilp_id") == lyricsId)
      return elements[i];
    }
  return null;
}



let previousLyricsIndex  = null;
let currentVideoId = null;
function playVideoControl(currentTime, lyricsIndex){
  if(current_clip_type == MusicClipType.Lyrics  || current_clip_type == MusicClipType.Total){
    let videoId = melody_clip.getLyricsVideoId(lyricsIndex);
    if(lyricsIndex != -1 && videoId != -1){
      let [startTime, lastTime] = melody_clip.getLyricsTimeset(lyricsIndex);
      let videoDuration = videoObject.getVideoDuration(videoId);
      //console.log("time:", currentTime - startTime, "VideoId", videoId);
      if(lyricsIndex != -1 && previousLyricsIndex != lyricsIndex){
        let videoCheckCanvas = getVideo(videoId);
        let playDuration = lastTime - startTime;
        if(playDuration != null && playDuration > 0){
          videoCheckCanvas.playbackRate  = videoDuration / playDuration;
          console.log("rate Change", videoDuration / playDuration)
        }
        else{
          videoCheckCanvas.playbackRate  = 1.0;
        }
        previousLyricsIndex = lyricsIndex;
        if(videoCheckCanvas.paused){
        videoCheckCanvas.play();
        }
        setViodeTime(videoCheckCanvas, currentTime - startTime, videoDuration/(lastTime - startTime));
      }
    }
    // else{
    //   if(!videoCheckCanvas.paused){
    //     console.log("pause check");
    //     videoCheckCanvas.pause();
    //   }
    // }
  }
}







/*-----------------------------MIDI 파일 생성용 코드-----------------------------------------*/

let MidiEventTime = 0.0
const midiBPM = 120;
const midiBeatNote = ["C" ,"D", "F", "A#"]
function generateMidi(miditype) {
    var file = new Midi.File();
    var track = new Midi.Track();

    file.addTrack(track);
    track.setTempo(midiBPM);
    if(miditype == MusicClipType.Melody){
      track.instrument(0, 0x03) // 피아노 악기로 설정
    }
    else{
      track.instrument(0, 0x70) // 타악기로 설정
    }
    
    MidiTrackMaker(track, miditype)

    var midiData = file.toBytes();
    var byteNumbers = new Array(midiData.length);
    for (var i = 0; i < midiData.length; i++) {
        byteNumbers[i] = midiData.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], {type: "application/octet-stream"});
    var downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = userName + "_" + miditype + '_Midi.mid';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function MidiTrackMaker(track, miditype){
  for(let trackTimer = 0; trackTimer <duration_track; trackTimer += 1/fps){
    let cur_track_set = TrackObject.getcurrentClipSet(trackTimer);
    if(cur_track_set[1].length > 0 && miditype == MusicClipType.Melody){
      MidiMelodyMaker(track, trackTimer, trackTimer - cur_track_set[1][0], Melody_clip_array[cur_track_set[1][1]]);
    }
    if(cur_track_set[2].length > 0 && miditype == MusicClipType.Beat){
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
    console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
    track.noteOn(0, midiBeatNote[beat]+"2", parseInt((currentTime - MidiEventTime) * midiBPM * 2))
    MidiEventTime = currentTime
    track.noteOff(0, midiBeatNote[beat]+"2", 4)
  }
    // if(beat == 0){
    //   //track.addNote(0, midiBeatNote[beat]+"2", 1, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
    //   console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
    //   track.noteOn(0, midiBeatNote[beat]+"2", parseInt((currentTime - MidiEventTime) * midiBPM * 2))
    //   MidiEventTime = currentTime
    //   track.noteOff(0, midiBeatNote[beat]+"2", parseInt((currentTime - MidiEventTime) * midiBPM * 2))
    // }
    // else if(beat == 1){
    //   track.addNote(0, midiBeatNote[beat]+"2", 1, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
    //   console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
    //   MidiEventTime = currentTime
    // }
    // else if(beat == 2){
    //   track.addNote(0, midiBeatNote[beat]+"2", 1, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
    //   console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
    //   MidiEventTime = currentTime
    // }
    // else{
    //   track.addNote(0, midiBeatNote[beat]+"2", 1, parseInt((currentTime - MidiEventTime) * midiBPM * 2))
    //   console.log("beat ON",beat+1, parseInt((currentTime - MidiEventTime) * midiBPM * 2), currentTime)
    //   MidiEventTime = currentTime
    // }
  //  }
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
  if(document.getElementById("BPMType").checked){
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
  if(document.getElementById("BPMType").checked){
    bpmPlayNumber = 5
  }
}
function stopTrack(){//Timer를 중지하는 코드
  play_state = false;
  play_state_track = false;
  noteSizeAllOff();
  stopTimer2();
  stopMetronome();
  pauseVideo();
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
    document.getElementById("clipTimeShower").innerText = getTimeString(currentTime);
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
  document.getElementById("clipTimeShower").innerText = getTimeString(currentTime);
  timeLine2.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
  timeLine1.style.left = (time_to_px(currentTime, currentClipDuration())-clip_start_px) + "px";
  showLyrics(currentTime);
  for (let item of onNoteList){
    noteResizeChanger(item, time_to_px(currentTime, currentClipDuration()));
  }
}

function getTimeString(currentTime){
  if(currentTime < 1){
    return "0." + parseInt(currentTime *100);
  }
  else{
    if(parseInt((currentTime%1) *100) > 10){
      return parseInt(currentTime) + "." + parseInt((currentTime%1) *100);
    }
    else{
      return parseInt(currentTime) + ".0" + parseInt((currentTime%1) *100);
    }
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
    document.getElementById("clipTimeShower").innerText = getTimeString(currentTime);
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
  document.getElementById("clipTimeShower").innerText = getTimeString(currentTime);
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
function getColor(id){
  switch(id%12){
    case 0:
      return 'hsl(0,99%,41%)'
    case 1:
      return 'hsl(24,99%,41%)';
    case 2:
      return 'hsl(36,99%,41%)';
    case 3:
      return 'hsl(46,99%,41%)';
    case 4:
      return 'hsl(55,99%,41%)';
    case 5:
      return 'hsl(129,100%,31%)';
    case 6:
      return 'hsl(179,100%,27%)';
    case 7:
      return 'hsl(186,99%,41%)';
    case 8:
      return  '#2E93FF';
    case 9:
      return 'hsl(273,99%,40%)';
    case 10:
      return  'hsl(284,100%,34%)';
    case 11:
      return 'hsl(329,100%,39%)';
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
  if(boxItem != null){
    boxItem.appendChild(resizeDrag);
  }
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
    }
  }
}
function newClipCreater(){
  if(current_clip_type == MusicClipType.Melody){
    console.log("New Melody Clip Create", Melody_clip_array.length)
    melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
    noteClickIndex = -1;
    clearNoteClip(MusicClipType.Melody);
    loadClip(melody_clip, melody_clip.getDuration());
    initializeTimer();
  }
  else if(current_clip_type == MusicClipType.Beat){
    console.log("New Beat Clip Create", Beat_clip_array.length)
    beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
    noteClickIndex = -1;
    clearNoteClip(MusicClipType.Beat);
    loadClip(beat_clip, melody_clip.getDuration());
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
      //melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
      alert("멜로디 저장")
      clearNoteClip(MusicClipType.Melody);
      initializeTimer();
      loadClip(melody_clip, melody_clip.getDuration());
    }
    else{
      clipDurationNormalize(current_clip_type)
      Melody_clip_array[melody_clip.getClipId()] = melody_clip;
      alert("멜로디 다시 저장")
      InitializeAllTrack();
      loadTrack(TrackObject);
      clearNoteClip(MusicClipType.Melody);
      loadClip(melody_clip, melody_clip.getDuration());
    }
  }
  else if(current_clip_type == MusicClipType.Beat){      
    if(beat_clip.getClipId() == Beat_clip_array.length){        
      clipDurationNormalize(current_clip_type)                          // Beat Save
      createClipBox(beat_clip);
      Beat_clip_array.push(beat_clip);
      //beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
      alert("비트 저장");
      clearNoteClip(MusicClipType.Beat);
      loadClip(beat_clip, beat_clip.getDuration());
      initializeTimer();
    }
    else{
      clipDurationNormalize(current_clip_type)
      Beat_clip_array[beat_clip.getClipId()] = beat_clip;
      alert("비트 다시 저장")
      InitializeAllTrack();
      loadTrack(TrackObject);
      clearNoteClip(MusicClipType.Beat);
      loadClip(beat_clip, beat_clip.getDuration());
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
      alert("이펙트 저장")
    }
    else{
      Template_clip_array[template_clip.get_Clip_id()] = template_clip;
      alert("이펙트 다시 저장")
      InitializeAllTrack();
      loadTrack(TrackObject);
    }
  }
  else if (current_clip_type == MusicClipType.Mood){
    saveMood();
  }
  
  else if(current_clip_type == MusicClipType.Total){  //마지막 전부 저장하는 부분
     generateMidi(MusicClipType.Melody);
     generateMidi(MusicClipType.Beat);
     let [videoId, videoData, videoDuration] = videoObject.getAllData();
    //  for(let i=0;i <videoId.length; i++){
    //   videoDownload(videoData[i], videoId[i], videoDuration[i])
    //  }
     saveLyrics();
     saveMood();
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
  noteClickIndex = -1; //선택 클립 number 초기화
})
document.getElementById("sheetMusicAllDeleteButton").addEventListener('click', function (){
  if (window.confirm("정말 클립 내용을 모두 삭제하시겠습니까?")) {
    if(current_clip_type == MusicClipType.Melody){
      melody_clip = new MusicClip(MusicClipType.Melody, melody_clip.getClipId(), duration);
      clearNoteClip(MusicClipType.Melody);
      loadClip(melody_clip, melody_clip.getDuration());
    }
    else if(current_clip_type == MusicClipType.Beat){
      beat_clip = new MusicClip(MusicClipType.Beat, beat_clip.getClipId(), duration);
      clearNoteClip(MusicClipType.Beat);
      loadClip(beat_clip, beat_clip.getDuration());
    }
    else if(current_clip_type == MusicClipType.Lyrics){
      melody_clip.dleteAlllyric();
      clearNoteClip(MusicClipType.Lyrics);
      loadClip(melody_clip, melody_clip.getDuration());
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
  //doubleChecker += 1
  //if(doubleChecker%2 ==0){
    if(play_state && current_clip_type == MusicClipType.Melody){
      melody_clip.setNoteRelease(e.detail.note, currentTime);
      noteOff(e.detail.note)
    }
  //}
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
  removeAllVerticalGrid();
  createVerticalGrid(MusicClip.getClipType());
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
function createTrackClipObject(dropzoneName, clipType, clip_id, duration, box_id, startTime){
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
  trackClip.style.left = time_to_px_Scale(startTime, duration_track, track_box_width, 0) + "px"
  //return px_to_time_Scale(trackClip.offsetLeft, duration_track, track_box_width, 0)
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
    console.log("get Clip data", Melody_clip_array[clip_id]);
    return Melody_clip_array[clip_id]
    //dragdrop.setAttribute("id", "melody-drop");
  }
  else{
    console.log("get Clip data", Beat_clip_array[clip_id]);
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
    document.getElementById("trackTimeShower").innerHTML = getTimeString(currentTrackTime);
    //console.log("Track Time", currentTrackTime)
  }
});

function updateTime2() { //시간에 따라 업데이트 해야하는 함수들
  if(bpmPlayNumber > 4){
    currentTrackTime += 1/fps
    //musicPlayer(currentTime);
    $("#slider_track").slider("value",time_to_px(currentTrackTime, duration_track, track_box_width, 0));
    document.getElementById("trackTimeShower").innerHTML = getTimeString(currentTrackTime);
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
  document.getElementById("trackTimeShower").innerHTML = getTimeString(currentTrackTime);
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
  // const [TemplateId, TemplateTimeset] = MusicTrack.getTemplateSet()
  const [MelodyClipId, MelodyTimeset] = MusicTrack.getMelodySet()
  const [BeatClipId, BeatTimeset] = MusicTrack.getBeatSet()
  // for(let i=0; i<TemplateId.length; i++){
  //   createTrackClipObject_template('template-dropzone', TemplateId[i], i);
  // }
  for(let i=0; i<MelodyClipId.length; i++){
    createTrackClipObject("melody-dropzone", MusicClipType.Melody, MelodyClipId[i], Melody_clip_array[MelodyClipId[i]].getDuration(), i, MelodyTimeset[i][0])
  }
  for(let i=0; i<BeatClipId.length; i++){
    createTrackClipObject("beat-dropzone", MusicClipType.Beat, BeatClipId[i], Beat_clip_array[BeatClipId[i]].getDuration(), i, BeatTimeset[i][0])
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
      clearNoteClip(MusicClipType.Melody);
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

function saveLyrics(){
  let [MelodyClipIdList, MelodyTimeset] = TrackObject.getMelodySet()
  // let [videoId, videoData, videoDuration] = videoObject.getAllData();
  let clipId =[]
  let LyricsSet = []
  let LyricsTimeset = []
  let LyricsVideoSet = []
  for(let i = 0; i <Melody_clip_array.length; i++){
    clipId.push(Melody_clip_array[i].getClipId());
    let [text, time, video] = Melody_clip_array[i].getAllLyrics();
    LyricsSet.push(text)
    LyricsTimeset.push(time)
    LyricsVideoSet.push(video)
  }
  // let arrayVideoData = []
  // for(let i = 0; i <videoData.length; i++){
  //   arrayVideoData.push(blobToBase64(videoData[i]));
  // }
  let LyricsDataObject = {
        "name":userName,
        "trackIdset":MelodyClipIdList,
        "trackTimeset":MelodyTimeset,
        "clipIdset":clipId,
        "LyricsSet":LyricsSet,
        "LyricsTimeset":LyricsTimeset,
        "LyricsVideoSet":LyricsVideoSet,
        // "videoId":videoId,
        // "videoData":arrayVideoData,
        // "videoDuration": videoDuration
      }
  console.log("lyricsSave")
  console.log(LyricsDataObject)
  downloadJsonFile(userName + "_LyricsLog", LyricsDataObject);
}
function loadLyrics(jsonObject){
  let trackIdSet = jsonObject["trackIdset"];
  let trackTimeset = jsonObject["trackTimeset"];
  let clipIdset = jsonObject["clipIdset"];
  let LyricsSet = jsonObject["LyricsSet"];
  let LyricsTimeset = jsonObject["LyricsTimeset"];
  let LyricsVideoSet = jsonObject["LyricsVideoSet"];
  console.log("Load Lyrics data")
  console.log(trackIdSet);
  console.log(trackTimeset);
  console.log(clipIdset);
  console.log(LyricsSet);
  console.log(LyricsTimeset);
  console.log(LyricsVideoSet);
  let AllLyricsSet = [];
  let AllLyricsTimeSet = [];
  let AllLyricsVideoSet = [];
  for(let i = 0; i< trackIdSet.length; i++){
    let clipIndex = clipIdset.indexOf(trackIdSet[i]);
    let addTime = trackTimeset[i][0];
    for(let j = 0; j<LyricsSet[clipIndex].length; j++){
      AllLyricsSet.push(LyricsSet[clipIndex][j]);
      AllLyricsTimeSet.push([LyricsTimeset[clipIndex][j][0] + addTime,LyricsTimeset[clipIndex][j][1] + addTime])
      AllLyricsVideoSet.push(LyricsVideoSet[clipIndex][j]);
    }
  }
  console.log(AllLyricsSet);
  console.log(AllLyricsTimeSet);
  console.log(AllLyricsVideoSet);
  melody_clip.setAllLyrics(AllLyricsSet, AllLyricsTimeSet, AllLyricsVideoSet);

  // // video Load 코드 임시
  // console.log("Load Video data");
  // let videoId = jsonObject["videoId"];
  // let arrayVideoData = jsonObject["videoData"];
  // let videoDuration = jsonObject["videoDuration"];
  // console.log(videoId);
  // console.log(arrayVideoData);
  // console.log(videoDuration);
  // let videoData = []
  // for(let i = 0; i < arrayVideoData.length; i++){
  //   videoData.push(base64ToBlob(arrayVideoData));
  // }
  // for(let i = 0; i < videoId.length; i++){
  //   loadVideoFile(videoId[i], videoData[i], videoDuration[i]);
  // }
}

// function blobToArray(blob) {
//   return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(new Uint8Array(reader.result));
//       reader.onerror = reject;
//       reader.readAsArrayBuffer(blob);
//   });
// }
// function arrayToBlob(arrayData, contentType = 'video/webm') {
//   return new Blob([new Uint8Array(arrayData)], { type: contentType });
// }

// function blobToBase64(blob) {
//   return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//   });
// }
// // Convert an ArrayBuffer to a blob
// function base64ToBlob(base64, type = 'video/webm') {
//   const byteString = atob(base64.split(',')[1]);
//   const arrayBuffer = new ArrayBuffer(byteString.length);
//   const int8Array = new Uint8Array(arrayBuffer);
//   for (let i = 0; i < byteString.length; i++) {
//       int8Array[i] = byteString.charCodeAt(i);
//   }
//   return new Blob([int8Array], { type: type });
// }


// document.getElementById("trackMusicSaveButton").addEventListener('click', function(){
//   generateMidi(MusicClipType.Melody);
//   generateMidi(MusicClipType.Beat);
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
//})



/*------------------------------------------laod MIDI Code -------------------------------------------- */
document.getElementById("sheetMusicLoadButton").addEventListener('click', function (){
  FileInput.click();
})
document.getElementById("MoodLoadButtonMood").addEventListener('click', function (){
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
  const Files = e.target.files;
  for(let file of Files){
    console.log("Current Upload FIle Data");
    console.log(file["name"])
    console.log(file["name"].substr(file["name"].indexOf(".")))
    if(current_clip_type == MusicClipType.Mood){
      if(file["name"].substr(file["name"].indexOf(".")) == ".json"){
        const reader = new FileReader();
        reader.onload = function(event) {
          try{
            const contents = event.target.result;
            const jsonObject = JSON.parse(contents);
            loadMood(jsonObject);
          } catch(error){
            console.error('Error parsing Mood file:', error);
            alert("불러온 파일이 잘못되었습니다.")
          }
        };
        reader.readAsText(file);
      }
      else{
        alert("무드로 불러올 수 있는 데이터는 Json 파일만 가능합니다.")
      }
    }
    if(current_clip_type == MusicClipType.Melody || current_clip_type == MusicClipType.Beat){
      const reader = new FileReader();
      reader.onload = function(e) {
          try {
              const data = new Uint8Array(e.target.result);
              const smf = new JZZ.MIDI.SMF(data.buffer);
              getMididata(smf[0])
          } catch (error) {
              console.error('Error parsing MIDI file:', error);
              alert("불러온 파일 형식이 잘못되었습니다.")
          }
      };
      reader.onerror = function() {
          console.error('Error reading file:', reader.error);
          alert("불러온 파일 정보에 문제가 있습니다.")
      };
      reader.readAsArrayBuffer(file);
    }
    else if(current_clip_type == MusicClipType.Lyrics){
      if(file["name"].substr(file["name"].indexOf(".")) == ".json"){
        const reader = new FileReader();
        reader.onload = function(event) {
          try{
            const contents = event.target.result;
            const jsonObject = JSON.parse(contents);
            loadLyrics(jsonObject);
            clipDurationNormalize(MusicClipType.Melody);
            loadClip(melody_clip, melody_clip.getDuration());
          } catch(error){
            console.error('Error parsing Mood file:', error);
            alert("불러온 파일이 잘못되었습니다.")
          }
        };
        reader.readAsText(file);
      }
      else if(file["name"].substr(file["name"].indexOf(".")) == ".webm"){
        let [videoId, videoDuration] = parseVideoString(file["name"])
        const reader = new FileReader();
        reader.onload = function(event) {
          try{
            // let result = event.target.result;
            // let uint8Array = new Uint8Array(result);
            // console.log(result);
            // console.log(uint8Array);
            // //loadVideoFile(videoId, result, videoDuration)

            loadWebmFile(file).then(blob => {
              // Now you can use your blob
                console.log(blob);
                loadVideoFile(videoId, blob, videoDuration)
            })
            .catch(error => {
                console.error(error);
            });
          } catch(error){
            console.error('Error parsing Mood file:', error);
            alert("불러온 파일이 잘못되었습니다.")
          }
        };
        reader.readAsText(file);
      }
      else{
        alert("무드로 불러올 수 있는 데이터는 Json 파일만 가능합니다.")
      }
    }
    
  }
})


function loadWebmFile(file) {
  return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
          const blob = new Blob([event.target.result], { type: 'video/webm' });
          resolve(blob);
      };
      fileReader.onerror = function(event) {
          reject(new Error("Error reading file: "+ event.target.error));
      };
      fileReader.readAsArrayBuffer(file);
  });
}



let OverMidiDataChecker = false;
function clipDurationNormalize(type){
  if(type == MusicClipType.Melody){
    if(melody_clip.getNoteIndex() != 0){
      melody_clip.setDuration(getStepDuration(melody_clip.getClipLastTime()));
    }
    else{
      console.log("there isn't note")
    }
  }
  else{
    if(beat_clip.getNoteIndex() != 0){
      beat_clip.setDuration(getStepDuration(beat_clip.getClipLastTime()));
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

document.getElementById("lyricsInputer").addEventListener("click", function(){
  spaceKeyOnOff = false;
});

document.getElementById("LyricsPushButton").addEventListener("click", function(){
  let lyricsDefaultTime = parseInt(melody_clip.getDuration()/10)
  if(lyricsDefaultTime < 1){
    lyricsDefaultTime = 1
  }
  let lyricsText = document.getElementById("lyricsInputer").value;
  if(lyricsText != ""){
    let lyricsLastTime = melody_clip.getLyricsLastTime();
    let lyticsId = melody_clip.getLyricsIndex()
    melody_clip.setLyrics(lyricsText,[lyricsLastTime, lyricsLastTime + lyricsDefaultTime])
    createLyricsObject(lyticsId, lyricsText, lyricsLastTime, lyricsLastTime + lyricsDefaultTime, -1);
  }
  document.getElementById("lyricsInputer").value = ""
  spaceKeyOnOff = true;
})
function createLyricsObject(note_id, lyricsText, startTime, endTime, LyricsVideoId){
  if(lyricsText != ""){
    const boxItem = document.getElementById("LyricsBox1");
    const lyricsNote = document.createElement("div");
    lyricsNote.classList.add("resize-lyrics");
    lyricsNote.style.left = time_to_px(startTime, currentClipDuration()) + "px";
    lyricsNote.style.width = time_to_px_Scale(endTime - startTime, currentClipDuration()) + "px";
    lyricsNote.textContent = lyricsText
    lyricsNote.setAttribute("note_id", note_id); // clip_id 속성 추가
    lyricsNote.setAttribute('id', note_id) // 색상 바꾸는 용도
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
        document.getElementById('lyricsVideo').innerHTML = "연결 없음";
      }
    })
    lyricsNote.addEventListener("click", function history(){
      clickCount += 1;
      clickedHistory.push(lyricsNote.id) // 아이디 히스토리 리스트로 넣기
      // clickedHistory[-2] != clickedHistory[-1]
      if (clickedHistory.length == 1){     //하나 이상 클릭했을 때
        // console.log('히스토리', clickedHistory);
        nowClicked = document.getElementById(clickedHistory[0]);
        nowClicked.style.borderWidth = 'thick'
      }
      else if (clickedHistory.length > 1 && clickedHistory[clickedHistory.length - 1] != clickedHistory[clickedHistory.length - 2]){
        nowClicked = document.getElementById(clickedHistory[clickedHistory.length - 1]);
        previousClicked = document.getElementById(clickedHistory[clickedHistory.length - 2])

        nowClicked.style.borderWidth = 'thick'
        if(previousClicked != null){
          previousClicked.style.borderWidth = '' 
        }
      }
    })
  boxItem.appendChild(lyricsNote);
  }
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
  if(!document.getElementById("BPMType").checked){
    synth.triggerAttackRelease("2n", time, 0.3);
  }
  if(document.getElementById("hapticType").checked){
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

document.getElementById("bpm").addEventListener("change", function(){
  saveStepTime = 60 / document.getElementById("bpm").value * parseInt(document.getElementById("beatSelect").value);
  removeAllVerticalGrid();
  createVerticalGrid(MusicClipType.Melody);
  createVerticalGrid(MusicClipType.Beat);
})

document.getElementById("beatSelect").addEventListener("change", function(){
  saveStepTime = 60 / document.getElementById("bpm").value * parseInt(document.getElementById("beatSelect").value);
  removeAllVerticalGrid();
  createVerticalGrid(MusicClipType.Melody);
  createVerticalGrid(MusicClipType.Beat);
})

function getStepDuration(time){
 let a = parseInt(time / saveStepTime)
 let b= time % saveStepTime 
 if( b >0.0001){
  return (a+1) * saveStepTime;
 }
 else{
  return (a) * saveStepTime;
 }
}

function createVerticalGrid(clipType, stepSize = -1){
  const a = document.getElementById(clipType + "-VerticalGrid");
  let gridNum = parseInt(melody_clip.getDuration()/saveStepTime);
  if(stepSize == -1){
    gridNum = parseInt(melody_clip.getDuration()/saveStepTime);
    if(clipType == MusicClipType.Melody){
      stepSize = time_to_px_Scale(saveStepTime, melody_clip.getDuration(),clip_box_width-clip_start_px,0)
    }
    else{
      stepSize = time_to_px_Scale(saveStepTime, beat_clip.getDuration(),clip_box_width-clip_start_px,0)
    }
  }
  for(let i= 0; i< gridNum; i++){
    const verticalGrid = document.createElement("div");
    verticalGrid.classList.add("vertical-grid");
    verticalGrid.style.left = (stepSize * (i+1))+"px"
    a.appendChild(verticalGrid);
  }
}
function removeAllVerticalGrid(){
  removeAllElementsByClassName("vertical-grid");
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
        let Tmp_clip = get_clip(event.relatedTarget.getAttribute("clip_type"), event.relatedTarget.getAttribute("clip_id"))
        let [lastMelodyId, lastMelodyTime] = TrackObject.getLastClipData(MusicClipType.Melody);
        let trackLastTime = 0;
        if(lastMelodyId != null){
          trackLastTime= lastMelodyTime[0] + Melody_clip_array[lastMelodyId].getDuration();
        }
        console.log("trackLastTime", trackLastTime, Tmp_clip.getDuration())
        if(trackLastTime + Tmp_clip.getDuration() < duration_track){
          createTrackClipObject('melody-dropzone', Tmp_clip.getClipType(), Tmp_clip.getClipId(), Tmp_clip.getDuration(), TrackObject.getMelodyId(), trackLastTime)
          TrackObject.setMusicClip(Tmp_clip, trackLastTime)
        }
        else{
          alert("트랙의 크기가 " + duration_track + "초를 넘겼습니다")
        }
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
        let Tmp_clip = get_clip(event.relatedTarget.getAttribute("clip_type"), event.relatedTarget.getAttribute("clip_id"))
        let [lastBeatId, lastBeatTime] = TrackObject.getLastClipData(MusicClipType.Beat)
        let trackLastTime = 0;
        if(lastBeatId != null){
          trackLastTime = lastBeatTime[0] + Beat_clip_array[lastBeatId].getDuration();
        }
        if(trackLastTime + Tmp_clip.getDuration() < duration_track){
          createTrackClipObject('beat-dropzone', Tmp_clip.getClipType(), Tmp_clip.getClipId(), Tmp_clip.getDuration(), TrackObject.getBeatId(), trackLastTime)
          TrackObject.setMusicClip(Tmp_clip, trackLastTime)
          trackActivaqte = false;
        }
        else{
          alert("트랙의 크기가 " + duration_track + "초를 넘겼습니다")
        }
        //console.log("clip Time Check", clipTime/10);
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