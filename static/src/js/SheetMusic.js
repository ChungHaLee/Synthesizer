import { SyntheysizerEvents, MusicClip, MusicClipType, MusicTrack, TemplateClip} from './Share.js';
import { piano_player, beat_player, dialInitialize} from './Synthesizer.js';
//최소 범위 A2 ~ C7

const fps = 30;
let currentTime = 0.0;
let play_state = false;
let timer = null;
let duration = document.getElementById("clipduration");

let clipduration = document.getElementById("clipduration");
let timeLine1 = document.getElementById("timeLine1");
let timeLine2 = document.getElementById("timeLine2");
let timeLine3 = document.getElementById("timeLine3");
let FileInput = document.getElementById("fileUpload");

const Template_clip_array = [];
const Melody_clip_array = [];
const Beat_clip_array = [];

let current_clip_type = MusicClipType.Melody;
let melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
let beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
let template_clip = new TemplateClip(Template_clip_array.length);
templateConnectToVisualAndSound(template_clip);
let onNoteList = [];
let previousNote = [];
let previousNote_track = [];
let TrackObject = new MusicTrack();
let previousDial_ID = -1;

let doubleChecker = 0 //Webpack double Event error catcher
let trackActivaqte = false;
let noteClickIndex = -1;
let trackClickIndex = -1;
let trackClickType = null
const clip_box_width = 1810;
const clip_start_px = 80;
let player1 = null;
let player2 = null;
let practiceMode = true
document.getElementById("sheetMusicSaveButton").disabled = true;


// Check if YT is already loaded
if (window.YT && window.YT.Player) {
  createPlayer1();
  createPlayer2();
} else {
  // If not, wait for the API to load
  window.onYouTubeIframeAPIReady = function() {
      createPlayer1();
      createPlayer2();
  };
}


function createPlayer1() {
  player1 = new window.YT.Player('player1', {
      height: '390',
      width: '640',
      videoId: 'Q9OUlAVasqE', // 유투브 Share에 있는 ID 입력, 단 일부 영상은 안됌(이유를 모름)
      events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
      }
  });
}

function createPlayer2() {
  player2 = new window.YT.Player('player2', {
      height: '390',
      width: '640',
      videoId: 'sCr6mtjqHz4', // 유투브 Share에 있는 ID 입력, 단 일부 영상은 안됌(이유를 모름)
      events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
      }
  });
}

function onPlayerReady(event) { //비디오 duration을 Clip 길이로 설정
  if(practiceMode){
    console.log("Get Video Clip", player1.getDuration());
    changeClipDuration(player1.getDuration());
  }
  else{
    console.log("Get Video Clip", player2.getDuration());
    changeClipDuration(player2.getDuration());
  }
  settingExample();
  document.getElementById("synthConnector").click();
}

function onPlayerStateChange(event) {
    if (event.data == window.YT.PlayerState.PLAYING) {
        startRecording();
    }
    if (event.data == window.YT.PlayerState.ENDED || event.data == window.YT.PlayerState.PAUSED){
        stopRecording();
        stopAllNotePlayer();
    } 
}

document.getElementById("exampleVideoButton").addEventListener('click', function(){
  practiceMode = true;
  if(play_state){
    player1.pauseVideo();
    player2.pauseVideo();
    player1.seekTo(0);
    player2.seekTo(0);
    stopRecording();
    stopAllNotePlayer();
    play_state = false;
  }
  changeClipDuration(player1.getDuration());
  clearExampleClip(current_clip_type);
  settingExample();
  // if (window.YT && window.YT.Player) {
  //   createPlayer1();
  // } else {
  //   // If not, wait for the API to load
  //   window.onYouTubeIframeAPIReady = createPlayer1;
  // }
  document.getElementById("player1").style.display = 'block' 
  document.getElementById("player2").style.display = 'none'
  document.getElementById("sheetMusicSaveButton").disabled = true;
  if(Melody_clip_array.length ==0){
    clearNoteClip(MusicClipType.Melody);
    melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
  }
  else{
    clearNoteClip(MusicClipType.Beat);
    beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
  }
})
document.getElementById("danceVideoButton").addEventListener('click', function(){
  practiceMode = false;
  if(play_state){
    player1.pauseVideo();
    player2.pauseVideo();
    player1.seekTo(0);
    player2.seekTo(0);
    stopRecording();
    stopAllNotePlayer();
    play_state = false;
  }
  clearExampleClip(current_clip_type);
  changeClipDuration(player2.getDuration());
  // if (window.YT && window.YT.Player) {
  //   createPlayer2();
  // } else {
  //   // If not, wait for the API to load
  //   window.onYouTubeIframeAPIReady = createPlayer2;
  // }
  document.getElementById("player1").style.display = 'none' 
  document.getElementById("player2").style.display = 'block'
  document.getElementById("sheetMusicSaveButton").disabled = false;
  if(current_clip_type == MusicClipType.Melody){
    clearNoteClip(MusicClipType.Melody);
    if(Melody_clip_array.length ==0){
      melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
    }
    else{
      melody_clip = Melody_clip_array[0]
    }
    loadClip(melody_clip, melody_clip.getDuration())
    //melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
  }
  else if(current_clip_type == MusicClipType.Beat){
    clearNoteClip(MusicClipType.Beat);
    if(Beat_clip_array.length ==0){
      beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
    }
    else{
      beat_clip = Beat_clip_array[0]
    }
    loadClip(beat_clip, beat_clip.getDuration())
    //beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
  }
})

function settingExample(){
  if(practiceMode){
    if(current_clip_type == MusicClipType.Melody){
      const clipDuration = 32
      const clipNoteset = ["G5","E5","D5","C5","D5","E5","G5","E5","D5","C5","A5","E5","D5","C5","D5","E5","A4","G5","E5","D5","C5","D5","E5","G5","E5","D5","C5","A5","E5","D5","C5","D5","E5","A5","D5","A5","G5","A5","G5","A5","G5","E5","D5","E5","G5","E5","D5","A4","C5"]
      const clipTimeset = [[0.5720410801086426,0.7300410724792481],[1.1610019294281007,1.2907990114440917],[1.4237989084472655,1.5540709179840089],[1.7190708798370362,1.8473000343322754],[2.1814630190734863,2.314463154495239],[2.4460749465942384,2.5120749313354493],[2.7430760114440917,2.8764059485015867],[3.3050919828338623,3.3710919675750732],[3.601070954223633,3.667070938964844],[3.8980990190734865,4.0300148836517335],[4.921056057220459,5.0193979294281],[5.448078870300293,5.515079020980835],[5.746056007629394,5.846544973297119],[6.043545,6.173041082015991],[6.636477931335449,6.767477973297119],[6.937605017166137,6.966605061035156],[7.26400212588501,8.685083061035156],[9.640039020980835,9.775039011444091],[10.201064992370606,10.267064977111817],[10.466885992370605,10.531886049591064],[10.829255876022339,10.960059885559081],[11.419733024795532,11.51973316784668],[11.653087794006348,11.765088020980835],[11.952059024795533,12.08105897329712],[12.5110841411438,12.643084110626221],[12.874066879837036,12.939066937057495],[13.171033851226806,13.368070917984008],[14.19523022125244,14.385710173568725],[14.787166091552734,14.896900954223632],[15.084900917984008,15.211124885559082],[15.447746007629394,15.54674622315979],[16.10807395613098,16.173827908447265],[16.375828049591064,16.404827855041503],[16.703048125885008,18.45108102479553],[19.208072062942506,19.37358789891052],[20.134640938964843,20.29910494087219],[20.464018870300293,20.597019005722046],[21.650081870300294,21.815736038146973],[22.016539980926513,22.147540022888183],[22.320095160217285,22.445095160217285],[22.70805482833862,22.809270990463258],[22.973271024795533,23.43309004005432],[24.09308415449524,24.32402906866455],[24.984623984741212,25.128623799728395],[25.281047122070312,25.413047091552734],[25.621105076293944,25.646105171661375],[25.942291998092653,26.074030173568726],[26.30606394277954,26.403064064849854],[26.60307215258789,28.02907389128113]]
      let exampleClip = new MusicClip(MusicClipType.Melody, 1, clipDuration, clipNoteset, clipTimeset)
      loadExampleClip(exampleClip, duration, 1);
    }
    else if(current_clip_type == MusicClipType.Beat){
      const clipDuration = 33
      const clipNoteset = [0,2,0,2,0,2,0,2,0,1,0,1,0,1,0,1,0,2,0,2,1,2,1,2,0,2,0,2,1,2,1,2,1,2,2,0,2,2,0,2,2,0,2,2,0,3,0,3,0,3,3,0,3,3,3,0,3,3,3,0,0,0,0,2,0,2,3,1,3,2,2,1,2,3,2]
      const clipTimeset = [0.8923350743865966,1.3215988893737793,1.783887082015991,2.210053062942505,2.6426171792907716,3.071248047683716,3.5009819771118162,3.937069855041504,4.357986919891357,4.688954977111816,5.150106043869019,5.546112814987183,5.973742160217285,6.371558003814697,6.767146973297119,7.203359017166138,7.669121959945679,8.086711982833862,8.516056912261963,8.946046946594238,9.373160093460083,9.804123950408936,10.232187963760376,10.694013051498413,11.123076032424926,11.520072929428101,11.948057003814696,12.375916809265137,12.805368946594239,13.235294948501586,13.670276024795532,14.139074061035156,14.587094043869019,15.049020977111816,15.214032072479249,15.447037007629394,15.809105036239623,15.973025893188476,16.27105195803833,16.63296491416931,16.80208719645691,17.096145074386598,17.537091994277954,17.723091864578247,17.987112175476074,18.383171019073487,18.812052855041504,19.208062897003174,19.638008064849853,20.071020120162963,20.891656049591063,21.452100020980836,21.81414294468689,22.21116015258789,22.64113691607666,23.036157864578247,23.431101112533568,23.870385104904173,24.323038141143797,25.314036114440917,26.105072834060667,26.93616991989136,27.757107160217284,28.11808784550476,28.513469032424926,28.952086952316286,29.3380860038147,29.8010610705719,30.19804004005432,30.626112114440918,30.659112106811524,31.023299990463258,31.452135992370607,31.886031036239626,32.30906002861023]
      let exampleClip = new MusicClip(MusicClipType.Beat, 1, clipDuration, clipNoteset, clipTimeset)
      loadExampleClip(exampleClip, duration, 1);
    }
  }
}

document.getElementById("PreviousButton").addEventListener("click", function(){
  console.log("previous check")
  if(current_clip_type == MusicClipType.Melody){
    console.log('to Login')
    document.getElementById("loginPage").click();
  }
  else if(current_clip_type == MusicClipType.Beat){
    console.log("to Melody")
    if(play_state){
      player1.pauseVideo();
      player2.pauseVideo();
      player1.seekTo(0);
      player2.seekTo(0);
      stopRecording();
      stopAllNotePlayer();
      play_state = false;
    }
    current_clip_type = MusicClipType.Melody;
    document.getElementById("BeatContainer").style.display = 'none' 
    document.getElementById("MelodyContainer").style.display = 'block'
    document.getElementById("TemplateContainer").style.display = 'none'
    clearNoteClip(MusicClipType.Beat);
    initializeTimer();
    document.getElementById("danceVideoButton").click();
    addClipToTrack(false, false, false);
  }
  else{
    console.log('to Beat')
    if(play_state){
      player1.pauseVideo();
      player2.pauseVideo();
      player1.seekTo(0);
      player2.seekTo(0);
      stopRecording();
      stopAllNotePlayer();
      play_state = false;
    }
    current_clip_type = MusicClipType.Beat;
    document.getElementById("BeatContainer").style.display = 'block'
    document.getElementById("MelodyContainer").style.display = 'none'
    document.getElementById("TemplateContainer").style.display = 'none'
    clearNoteClip(MusicClipType.Beat);
    initializeTimer();
    document.getElementById("danceVideoButton").click();
    addClipToTrack(true, false, false);
  }
})

document.getElementById("NextButton").addEventListener("click", function(){
  console.log("next check")
  if(current_clip_type == MusicClipType.Melody){
    console.log("to Beat")
    if(play_state){
      player1.pauseVideo();
      player2.pauseVideo();
      player1.seekTo(0);
      player2.seekTo(0);
      stopRecording();
      stopAllNotePlayer();
      play_state = false;
    }
    current_clip_type = MusicClipType.Beat;
    document.getElementById("BeatContainer").style.display = 'block'
    document.getElementById("MelodyContainer").style.display = 'none'
    document.getElementById("TemplateContainer").style.display = 'none'
    clearNoteClip(MusicClipType.Beat);
    initializeTimer();
    document.getElementById("exampleVideoButton").click();
    addClipToTrack(true, false, false);
  }
  else if(current_clip_type == MusicClipType.Beat){
    console.log("to Tempalte")
    if(play_state){
      player1.pauseVideo();
      player2.pauseVideo();
      player1.seekTo(0);
      player2.seekTo(0);
      stopRecording();
      stopAllNotePlayer();
      play_state = false;
    }
    current_clip_type = MusicClipType.Template;
    document.getElementById("BeatContainer").style.display = 'none'
    document.getElementById("MelodyContainer").style.display = 'none'
    document.getElementById("TemplateContainer").style.display = 'block'
    document.getElementById("danceVideoButton").click();
    addClipToTrack(true, true, false);
  }
  else{
    console.log("to Save")
    if(play_state){
      player1.pauseVideo();
      player2.pauseVideo();
      player1.seekTo(0);
      player2.seekTo(0);
      stopRecording();
      stopAllNotePlayer();
      play_state = false;
    }
    current_clip_type = MusicClipType.Template;
    document.getElementById("BeatContainer").style.display = 'none'
    document.getElementById("MelodyContainer").style.display = 'none'
    document.getElementById("TemplateContainer").style.display = 'none'
    document.getElementById("danceVideoButton").click();
    player2.mute();
    addClipToTrack(true, true, true);
  }
})

function addClipToTrack(melodyBool, BeatBool, TemplateBool){
  TrackObject = new MusicTrack(); 
  InitializeAllTrack();
  if(melodyBool){
    if(Melody_clip_array.length > 0){
      const Tmp_clip = get_clip(MusicClipType.Melody, 0)
      const clipTime = createTrackClipObject('melody-dropzone', Tmp_clip.getClipType(), Tmp_clip.getClipId(), Tmp_clip.getDuration(), TrackObject.getMelodyId())
      TrackObject.setMusicClip(Tmp_clip, clipTime/10)
    }
  }
  if(BeatBool){
    if(Beat_clip_array.length > 0){
      const Tmp_clip = get_clip(MusicClipType.Beat, 0)
      const clipTime = createTrackClipObject('beat-dropzone', Tmp_clip.getClipType(), Tmp_clip.getClipId(), Tmp_clip.getDuration(), TrackObject.getMelodyId())
      TrackObject.setMusicClip(Tmp_clip, clipTime/10)
    }
  }
  if(TemplateBool){
    if(Template_clip_array.length > 0){
      const tempalteId = parseInt(0);
      const clipTime = createTrackClipObject_template('template-dropzone', tempalteId, TrackObject.getTempalateId())
      TrackObject.setTemplateClip(tempalteId, clipTime/10)
    }
  }
}





function InitializeAllSetting(){
  currentTime = 0.0;
  play_state = false;
  Template_clip_array.length = 0;
  Melody_clip_array.length = 0;
  Beat_clip_array.length = 0;
  melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
  beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
  template_clip = new TemplateClip(Template_clip_array.length);
  current_clip_type = MusicClipType.Melody;
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
  stopRecording();
  stopTrack();
  clearNoteClip(MusicClipType.Beat);
  clearNoteClip(MusicClipType.Melody);
  clearAllBoxClip();
  initializeTimer();
  initializeTimer2();
}

/* Timer Setting and Update code*/
function startRecording(){//Timer를 시작하는 코드
  play_state = true;
  startTimer();
}
function stopRecording(){//Timer를 중지하는 코드
  play_state = false;
  noteSizeAllOff();
  stopTimer();
}
function startTimer() { // 타이머 시작 코드
  if (!timer) { // 타이머가 이미 실행 중이지 않은 경우에만 실행
    timer = setInterval(updateTime, 1 / fps * 1000); // 0.01초 간격으로 updateTime 함수 실행
  }
}
function stopTimer() {  // 타이머 정지 코드
  clearInterval(timer);
  timer = null; // 타이머 변수 초기화
}
function updateTime() { //시간에 따라 업데이트 해야하는 함수들
  if(practiceMode){
    currentTime = player1.getCurrentTime();
  }
  else{
    currentTime = player2.getCurrentTime();
  }
  musicPlayer(currentTime);
  $("#slider").slider("value",time_to_px(currentTime, duration));
  timeLine2.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
  timeLine1.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
  // console.log(onNoteList[0].style.left, time_to_px(currentTime, duration) + "px")
  updateTime2(currentTime)
  for (let item of onNoteList){
    noteResizeChanger(item, time_to_px(currentTime, duration));
  }
  if(currentTime >= duration){
    stopRecording() //끝 도달하면 자동으로 종료
  }
}
// $( "#slider" ).css( "width", "20px" );
// $( "#slider" ).css( "height", "10px" );
$("#slider").slider({ //Timer 슬라이더
  value: clip_start_px,
  min: clip_start_px,
  max: clip_box_width,
  step: 0.01,
  slide: function( event, ui ) {
    timeLine1.style.left = ((ui.value)-clip_start_px) + "px";
    timeLine2.style.left = ((ui.value)-clip_start_px) + "px";
    if(practiceMode){
      player1.seekTo(px_to_time(ui.value, duration), true);
    }
    else{
      player2.seekTo(px_to_time(ui.value, duration), true);
    }
    noteSizeAllOff();
  }
});
function initializeTimer(){ //Timer 초기화
  stopRecording();
  currentTime = 0.0;
  $("#slider").slider("value",time_to_px(currentTime, duration));
  timeLine2.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
  timeLine1.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
}
function time_to_px(time, duration){ //Time을 Px로 변환하는 코드
  return clip_start_px + time / duration * (clip_box_width - clip_start_px)
}
function px_to_time(px, duration){  //Px을 Time으로 변환하는 코드
  return (px - clip_start_px) * duration / (clip_box_width - clip_start_px)
}
function px_to_time_Scale(px, duration){  //Px Scale을 Time Scale로 변환하는 코드
  return px * duration / (clip_box_width - clip_start_px)
}
/*Note Sound Maker*/
function musicPlayer(currentTime){  //음, 비트 소리를 재생하는 코드
  if(current_clip_type == MusicClipType.Melody){
    let currentNote = melody_clip.getcurrentNoteSet(currentTime)
    notePlayer(currentNote, previousNote);
    previousNote = melody_clip.getcurrentNoteSet(currentTime);
  }
  else if(current_clip_type == MusicClipType.Beat){
    let currentBeat = beat_clip.getcurrentNoteSet(currentTime);
    for (let beat of currentBeat){
      beat_player(beat)
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
}
function stopAllNotePlayer(){ //재생되는 음을 모두 정지하는
  if(previousNote.length > 0){
    //console.log("Ouput ", exclusiveArr2);
    for(let note of previousNote){
      piano_player(note, false);
    }  
  }
  previousNote = []
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

function createExamplteInResizeDragElement(note, leftPosition, noteId, type) { //Melody, Beat 노트 생성
  const resizeDrag = document.createElement("div");
  let boxItem = null
  if(type == MusicClipType.Melody){
    resizeDrag.classList.add("inresize-drag");  // resize-drag로 생성
    const Itemid = "box_" + note.substr(0, note.length - 1); 
    boxItem = document.getElementById(Itemid);
    resizeDrag.textContent = note.substr(note.length - 1, note.length);
  }
  else{
    resizeDrag.classList.add("indraggable");  // resize-drag로 생성
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

/* Clip Event Code */
document.getElementById("sheetMusicMelodyButton").addEventListener('click', function (){
  current_clip_type = MusicClipType.Melody;
  document.getElementById("BeatContainer").style.display = 'none' 
  document.getElementById("MelodyContainer").style.display = 'block'
  if(melody_clip.getClipId() != Melody_clip_array.length){
    console.log("New Melody Clip Create", melody_clip.getClipId(), Melody_clip_array.length)
    melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
    noteClickIndex = -1;
    clearNoteClip(MusicClipType.Melody);
    initializeTimer();
  }
})
document.getElementById("sheetMusicBeatButton").addEventListener('click', function (){
  current_clip_type = MusicClipType.Beat;
  document.getElementById("BeatContainer").style.display = 'block'
  document.getElementById("MelodyContainer").style.display = 'none'
  if(beat_clip.getClipId() != Beat_clip_array.length){
    console.log("New Beat Clip Create", beat_clip.getClipId(), Beat_clip_array.length)
    beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
    noteClickIndex = -1;
    clearNoteClip(MusicClipType.Beat);
    initializeTimer();
  }
})
document.getElementById("sheetMusicTemplateButton").addEventListener('click', function (){
  if(template_clip.get_Clip_id() != Template_clip_array.length){
    console.log("New Template Clip Create", template_clip.get_Clip_id(), Template_clip_array.length)
    template_clip = new TemplateClip(Template_clip_array.length);
    templateConnectToVisualAndSound(template_clip);
    console.log(Template_clip_array)
  }
})
document.getElementById("sheetTemplateSaveButton").addEventListener('click', function (){
  if(template_clip.get_Clip_id() == Template_clip_array.length){
    createTemplateClipBox(template_clip);
    Template_clip_array.push(template_clip);
    template_clip = new TemplateClip(Template_clip_array.length);
    templateConnectToVisualAndSound(template_clip);
    console.log(Template_clip_array)
    alert("Template Clip saved")
  }
  else{
    Template_clip_array[template_clip.get_Clip_id()] = template_clip;
    alert("Template Clip resaved")
  }
})

document.getElementById("sheetMusicSaveButton").addEventListener('click', function (){
  if(play_state){
    player1.pauseVideo();
    player2.pauseVideo();
    stopRecording();
    stopAllNotePlayer();
    play_state = false;
  }
  if(current_clip_type == MusicClipType.Melody){     // Melody Save 
    if(Melody_clip_array.length == 0){
      createClipBox(melody_clip);
      Melody_clip_array.push(melody_clip);
      alert("Melody Clip saved")
      initializeTimer();
    }
    else{
      Melody_clip_array[melody_clip.getClipId()] = melody_clip;
      alert("Melody Clip resaved")
    }
  }
  else if(current_clip_type == MusicClipType.Beat){      
    if(Beat_clip_array.length==0){                                   // Beat Save
      createClipBox(beat_clip);
      Beat_clip_array.push(beat_clip);
      alert("Beat Clip saved")
      initializeTimer();
    }
    else{
      Beat_clip_array[beat_clip.getClipId()] = beat_clip;
      alert("Beat Clip resaved")
    }
  }
  else{
    if(Template_clip_array.length==0){ 
      createTemplateClipBox(template_clip);
      Beat_clip_array.push(template_clip);
      alert("Template Clip saved");
      initializeTimer();
    }
    else{
      Template_clip_array[template_clip.get_Clip_id()] = template_clip;
      alert("Template Clip resaved")
    }
  }
})
document.getElementById("sheetMusicPlayButton").addEventListener('click', function (){
  //startRecording();
  if(practiceMode){
    player1.playVideo();
  }
  else{
    player2.playVideo();
  }
})
document.getElementById("sheetMusicPauseButton").addEventListener('click', function (){
  //stopRecording();
  stopAllNotePlayer();
  if(practiceMode){
    player1.pauseVideo();
  }
  else{
    player2.pauseVideo();
  }
})
document.getElementById("sheetMusicDeleteButton").addEventListener('click', function (){
  if(noteClickIndex!=1){
    if(current_clip_type == MusicClipType.Melody){
      melody_clip.deleteNote(noteClickIndex);
      clearNoteClip(MusicClipType.Melody);
      loadClip(melody_clip, melody_clip.getDuration())
    }
    else if(current_clip_type == MusicClipType.Beat){
      beat_clip.deleteNote(noteClickIndex);
      clearNoteClip(MusicClipType.Beat);
      loadClip(beat_clip, beat_clip.getDuration())
    }
  }
})
document.getElementById("sheetMusicAllDeleteButton").addEventListener('click', function (){
    if(current_clip_type == MusicClipType.Melody){
      melody_clip = new MusicClip(MusicClipType.Melody, 0, duration);
      clearNoteClip(MusicClipType.Melody);
    }
    else if(current_clip_type == MusicClipType.Beat){
      beat_clip = new MusicClip(MusicClipType.Beat, 0, duration);
      clearNoteClip(MusicClipType.Beat);
    }
})





// document.getElementById("sheetMusicLyricsButton").addEventListener('click', function (){
//   let Lyrics = document.getElementById("sheetMusiclyricsInput").value
//   if(current_clip_type == MusicClipType.Melody){
//     melody_clip.setLyrics(noteClickIndex,Lyrics)
//     const elements = document.getElementsByClassName("resize-drag");
//     for (const element of elements) {
//       if (element.getAttribute('note_id') === noteClickIndex) {
//           element.textContent = Lyrics;
//       }
//     }
//   }
// })


/* Synthesizer Event Code */
SyntheysizerEvents.addEventListener('pianoKeyInput', function (e){
  doubleChecker += 1
  if(doubleChecker%2 ==0){
  if(play_state && current_clip_type == MusicClipType.Melody){
    melody_clip.setNoteInput(e.detail.note, currentTime);
      //console.log("noteInpu Check", e.detail.note)
    let NoteItem = createResizeDragElement(e.detail.note, time_to_px(currentTime, duration), melody_clip.getNoteIndex(), MusicClipType.Melody);
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
SyntheysizerEvents.addEventListener('padInput', function (e){
  doubleChecker += 1
  if(doubleChecker%2 ==0){
  if(play_state && current_clip_type == MusicClipType.Beat){
    beat_clip.setBeatInput(e.detail.id, currentTime);
    console.log("Pad Input")
    let PadItem = createResizeDragElement(e.detail.id, time_to_px(currentTime, duration), beat_clip.getNoteIndex(), MusicClipType.Beat);
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
clipduration.addEventListener("change", function(){ //Clip duration change code
  changeClipDuration(parseFloat(clipduration.value));
})
function changeClipDuration(inputDuration){
  duration = inputDuration
  console.log("Clip duration Set : ", duration);
  noteSizeAllOff();
  clearNoteClip(current_clip_type);
  if(time_to_px(currentTime, duration) >= clip_box_width){
    $("#slider").slider("value", clip_box_width);
    timeLine2.style.left = (clip_box_width-clip_start_px) + "px";
    timeLine1.style.left = (clip_box_width-clip_start_px) + "px";
  }
  else{
    $("#slider").slider("value",time_to_px(currentTime, duration));
    timeLine2.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
    timeLine1.style.left = (time_to_px(currentTime, duration)-clip_start_px) + "px";
  }
  if(current_clip_type == MusicClipType.Melody){
    melody_clip.setDuration(duration);
    template_clip.set_duration(duration);
    loadClip(melody_clip, duration);
  }
  else if(current_clip_type == MusicClipType.Beat){
    beat_clip.setDuration(duration);
    loadClip(beat_clip, duration);
  }
}
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
function clearExampleClip(type){
  if(type == MusicClipType.Melody){
    removeAllElementsByClassName("inresize-drag");
  }
  else{
    removeAllElementsByClassName("indraggable");
  }
}


function loadClip(MusicClip, duration){ // 입력 클립을 편집기에 반영
  if(MusicClip.getClipType() == MusicClipType.Melody){
    const [NoteSet, TimeSet] = MusicClip.getMusicClip()
    //const lyricsList = MusicClip.getLyrics();
    for(let i=0; i<NoteSet.length; i++){
      //console.log(NoteSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Melody)
      let NoteItem = createResizeDragElement(NoteSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Melody);
      noteResizeChanger(NoteItem, time_to_px(TimeSet[i][1], duration));
    }
  }
  else{
    const [padSet, TimeSet] = MusicClip.getMusicClip()
    for(let i=0; i<padSet.length; i++){
      //console.log(padSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Beat)
      let NoteItem = createResizeDragElement(padSet[i], time_to_px(TimeSet[i], duration), i, MusicClipType.Beat);
    }
  }
  noteClickIndex = -1;
}

function loadExampleClip(MusicClip, duration, delay = 0){ // 입력 클립을 편집기에 반영
  if(MusicClip.getClipType() == MusicClipType.Melody){
    const [NoteSet, TimeSet] = MusicClip.getMusicClip()
    //const lyricsList = MusicClip.getLyrics();
    for(let i=0; i<NoteSet.length; i++){
      //console.log(NoteSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Melody)
      let NoteItem = createExamplteInResizeDragElement(NoteSet[i], time_to_px(TimeSet[i][0] + delay, duration), i, MusicClipType.Melody);
      noteResizeChanger(NoteItem, time_to_px(TimeSet[i][1] + delay, duration));
    }
  }
  else{
    const [padSet, TimeSet] = MusicClip.getMusicClip()
    for(let i=0; i<padSet.length; i++){
      //console.log(padSet[i], time_to_px(TimeSet[i][0], duration), i, MusicClipType.Beat)
      let NoteItem = createExamplteInResizeDragElement(padSet[i], time_to_px(TimeSet[i] + delay, duration), i, MusicClipType.Beat);
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
    dragdrop.textContent = "멜로디 " + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
    dragdrop.setAttribute("id", "melody-drop");
    let boxItem = document.getElementById("MelodydropContainer");
    boxItem.appendChild(dragdrop);
  }
  else{
    dragdrop.textContent = "비트 " + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
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
    dragdrop_template.textContent = "효과 " + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
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
  trackClip.style.width = duration * 10 + "px"

  if(clipType == MusicClipType.Melody){
    trackClip.textContent = "멜로디_" + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
    //dragdrop.setAttribute("id", "melody-drop");
  }
  else{
    trackClip.textContent = "비트_" + clip_id; //내용이 있어야 나와서 -로 일단 임시로 추가
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
  return trackClip.offsetLeft
}

//Track Clip Object 생성용 코드(Template용)
function createTrackClipObject_template(dropzoneName, clip_id, box_id){
  const trackClip = document.createElement("div");
  trackClip.classList.add("resize-drag_clip");
  trackClip.style.width = duration * 10 + "px"
  let boxItem = document.getElementById(dropzoneName);
  trackClip.textContent = "효과_" + clip_id
  trackClip.setAttribute("box_id", box_id); // clip_id 속성 추가
  trackClip.setAttribute("box_type", MusicClipType.Template); // clip_type 속성 추가
  trackClip.addEventListener("click", function(){
    console.log("type:", trackClip.getAttribute("box_type"), "id", trackClip.getAttribute("box_id"));
    trackClickIndex = trackClip.getAttribute("box_id");
    trackClickType = trackClip.getAttribute("box_type");
  })
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
  max: duration,
  step: 0.1,
  slide: function( event, ui ) {
    timeLine3.style.left = (ui.value) + "px";
    currentTime = ui.value/10;
  }
});

function updateTime2(currentTime) { //시간에 따라 업데이트 해야하는 함수들
  //musicPlayer(currentTime);
  $("#slider_track").slider("value",currentTime*10);
  timeLine3.style.left = (currentTime*10) + "px";
  let cur_track_set = TrackObject.getcurrentClipSet(currentTime);
  //console.log("Test Track", cur_track_set[0][1]);
  if(cur_track_set[0].length > 0){
    //console.log(Template_clip_array);
    templatePlayerClip(Template_clip_array[cur_track_set[0][1]]);
  }
  if(cur_track_set[1].length > 0){
    musicPlayerMelodyClip(currentTime - cur_track_set[1][0], Melody_clip_array[cur_track_set[1][1]]);
  }
  if(cur_track_set[2].length > 0){
    musicPlayerBeatClip(currentTime - cur_track_set[2][0], Beat_clip_array[cur_track_set[2][1]]);
  }
}
function initializeTimer2(){ // Timer 초기화
  $("#slider_track").slider("value",currentTime*10);
  timeLine3.style.left = currentTime + "px";
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
function templatePlayerClip(inputClip){
  if(inputClip.get_Clip_id() != previousDial_ID){
    //console.log("id", inputClip.get_Clip_id())
    console.log(Template_clip_array)
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
  //startTrack();
})
document.getElementById("trackMusicPauseButton").addEventListener('click', function (){
  //stopTrack();
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
    current_clip_type = MusicClipType.Melody;
    document.getElementById("BeatContainer").style.display = 'none';
    document.getElementById("MelodyContainer").style.display = 'block';
    clearNoteClip(MusicClipType.Melody);
    initializeTimer();
    melody_clip = Melody_clip_array[clip_id];
    loadClip(melody_clip, melody_clip.getDuration());
  }
  else{
    current_clip_type = MusicClipType.Beat;
    document.getElementById("BeatContainer").style.display = 'block';
    document.getElementById("MelodyContainer").style.display = 'none';
    clearNoteClip(MusicClipType.Beat);
    initializeTimer();
    beat_clip = Beat_clip_array[clip_id];
    loadClip(beat_clip, beat_clip.getDuration());
  }
}
function loadFromTrackToTemplateClip(clip_id){
  template_clip = Template_clip_array[clip_id];
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
  let MusicTrackObejct = {
    "Type":"MusicTrack",
    "user_Id": TrackObject.getUserId(),
    "id_set" : TrackObject.getIdData(),
    "time_set" : TrackObject.getTimeData()
  }
  downloadJsonFile("MusicTrack_" + TrackObject.getUserId(), MusicTrackObejct);  //Track 정보 저장
  for(let i = 0; i < Template_clip_array.length; i ++){
    let templateObejct = {
      "Type": MusicClipType.Template,
      "CLip id": Template_clip_array[i].get_Clip_id(),
      "duration": Template_clip_array[i].get_duration(),
      "instrument": Template_clip_array[i].get_instrument(),
      "dial_set": Template_clip_array[i].get_dial()
    }
    downloadJsonFile("template_clip_" + i, templateObejct); 
  }
  for(let i = 0; i < Melody_clip_array.length; i ++){
    let MusicObejct = {
      "Type": Melody_clip_array[i].getClipType(),
      "CLip id": Melody_clip_array[i].getClipId(),
      "duration": Melody_clip_array[i].getDuration(),
      "noteSet": Melody_clip_array[i].getMusicClip()[0],
      "timeSet": Melody_clip_array[i].getMusicClip()[1],
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
  tmp_Meldoy_array.length = 0;
  tmp_Beat_array.length = 0;
  tmp_template_array.length = 0;
  FileInput.click();
})
FileInput.addEventListener('change', function(e){
  const Files = e.target.files;
  for(let file of Files){
    const reader = new FileReader();
    reader.onload = function(event) {
      const contents = event.target.result;
      const jsonObject = JSON.parse(contents);
      if(jsonObject["Type"]==MusicClipType.Melody){
        let Tmp_melody_clip = new MusicClip(jsonObject["Type"], jsonObject["CLip_id"], jsonObject["duration"], jsonObject["noteSet"], jsonObject["TimeSet"])
        console.log("Melody push", Tmp_melody_clip);
        tmp_Meldoy_array.push(Tmp_melody_clip)
      }
      if(jsonObject["Type"]==MusicClipType.Beat){
        let Tmp_beat_clip = new MusicClip(jsonObject["Type"], jsonObject["CLip_id"], jsonObject["duration"], jsonObject["noteSet"], jsonObject["TimeSet"]);
        console.log("Beat push", Tmp_beat_clip);
        tmp_Beat_array.push(Tmp_beat_clip);
      }
      if(jsonObject["Type"]==MusicClipType.Template){
        let Tmp_template_clip = new TemplateClip(jsonObject["CLip_id"], jsonObject["duration"], jsonObject["instrument"]);
        Tmp_template_clip.set_dial(jsonObject["dial_set"]);
        console.log("Template push", Tmp_template_clip);
        tmp_template_array.push(Tmp_template_clip);
      }
      if(jsonObject["Type"]=="MusicTrack"){
        TrackObject = new MusicTrack(jsonObject["user_Id"], jsonObject["id_set"], jsonObject["time_set"]);
        console.log("TrackObject : ", TrackObject);
      }
    };
    reader.readAsText(file);
  }
  // for(let i = 0; i<tmp_Meldoy_array.length; i++){
  //   console.log("loop check")
  //   for(let melodyclip of tmp_Meldoy_array){
  //     if(melodyclip.getClipId()==i){
  //       Melody_clip_array.push(melodyclip);
  //       console.log('create clip', melodyclip)
  //       createClipBox(melodyclip);
  //     }
  //   }
  // }
  // for(let i = 0; i<tmp_Beat_array.length; i++){
  //   for(let beatclip of tmp_Beat_array){
  //     if(beatclip.getClipId()==i){
  //       Beat_clip_array.push(beatclip);
  //       console.log('create clip', beatclip)
  //       createClipBox(beatclip);
  //     }
  //   }
  // }
  // for(let i = 0; i<tmp_template_array.length; i++){
  //   for(let templateCLip of tmp_template_array){
  //     if(templateCLip.get_Clip_id()==i){
  //       Template_clip_array.push(templateCLip);
  //       console.log('create clip', templateCLip)
  //       createTemplateClipBox(templateCLip);
  //     }
  //   }
  // }
})


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
        //console.log( "id:", event.target.getAttribute("note_id"), "Add timeset:", [px_to_time_Scale(event.deltaRect.left, duration), px_to_time_Scale(event.deltaRect.left + event.deltaRect.width, duration)]);
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
      if(trackActivaqte){
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
      const tempalteId = parseInt(event.relatedTarget.getAttribute("clip_id"));
      const clipTime = createTrackClipObject_template('template-dropzone', tempalteId, TrackObject.getTempalateId())
        //console.log("clip Time Check", clipTime/10);
      TrackObject.setTemplateClip(tempalteId, clipTime/10)
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
      TrackObject.setMusicClip(Tmp_clip, clipTime/10)
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
      TrackObject.setMusicClip(Tmp_clip, clipTime/10)
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