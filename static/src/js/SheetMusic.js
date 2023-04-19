import { SyntheysizerEvents, MusicClip, MusicClipType} from './Share.js';
//최소 범위 A2 ~ C7

let fps = 30;
let currentTime = 0.0;
let play_state = false;
let timer = null;
let duration = 30
let clipduration = document.getElementById("clipduration");
let timeLine1 = document.getElementById("timeLine1");
let timeLine2 = document.getElementById("timeLine2");
const Melody_clip_array = [];
const Beat_clip_array = [];
let current_clip_type = MusicClipType.Melody;
let melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration)
let beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration)

let onNoteList = []

clipduration.addEventListener("change", function(){
  duration = parseFloat(clipduration.value);
  noteSizeAllOff();
  clearNoteClip(current_clip_type);
  if(time_to_px(currentTime, duration) >= 1880){
    $("#slider").slider("value",1880);
    timeLine2.style.left = 1880+ "px";
    timeLine1.style.left = 1880 + "px";
  }
  else{
    $("#slider").slider("value",time_to_px(currentTime, duration));
    timeLine2.style.left = time_to_px(currentTime, duration) + "px";
    timeLine1.style.left = time_to_px(currentTime, duration) + "px";
  }
  if(current_clip_type == MusicClipType.Melody){
    melody_clip.setDuration(duration);
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
  $("#slider").slider("value",time_to_px(currentTime, duration));
  timeLine2.style.left = time_to_px(currentTime, duration) + "px";
  timeLine1.style.left = time_to_px(currentTime, duration) + "px";
  //console.log(onNoteList[0].style.left, time_to_px(currentTime, duration) + "px")
  for (let item of onNoteList){
    noteResizeChanger(item, time_to_px(currentTime, duration));
  }
  
  if(currentTime >= duration){
    stopRecording() //끝 도달하면 자동으로 종료
  }
}
function startTimer() {
  if (!timer) { // 타이머가 이미 실행 중이지 않은 경우에만 실행
    timer = setInterval(updateTime, 1/fps * 1000); // 0.01초 간격으로 updateTime 함수 실행
  }
}
function stopTimer() {
  clearInterval(timer); // 타이머 정지
  timer = null; // 타이머 변수 초기화
}

$("#slider").slider({ //Timer 슬라이더
  value: 60,
  min: 60,
  max: 1880,
  step: 0.01,
  slide: function( event, ui ) {
    timeLine1.style.left = (ui.value) + "px";
    timeLine2.style.left = (ui.value) + "px";
    currentTime = px_to_time(ui.value, duration);
    noteSizeAllOff();
  }
});
function initializeTimer(){
  stopRecording();
  currentTime = 0.0;
  $("#slider").slider("value",time_to_px(currentTime, duration));
  timeLine2.style.left = time_to_px(currentTime, duration) + "px";
  timeLine1.style.left = time_to_px(currentTime, duration) + "px";
}


function time_to_px(time, duration){ //Time을 Px로 변환하는 코드
  const start_px = 60
  return start_px + time / duration * (1880 - start_px)
}
function px_to_time(px, duration){  //Px을 Time으로 변환하는 코드
  const start_px = 60
  return (px - start_px) * duration / (1880 - start_px)
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
function noteSizeAllOff(){
  for (let i = 0; i < onNoteList.length; i++) {
    melody_clip.setNoteRelease(onNoteList[i].getAttribute("note"), currentTime);
  }
  onNoteList = [];
}
function noteOff(note){
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
      Melody_clip_array.push(melody_clip);
      melody_clip = new MusicClip(MusicClipType.Melody, Melody_clip_array.length, duration);
      alert("Melody Clip saved")
      clearNoteClip(MusicClipType.Melody);
      initializeTimer();
    }
    else{
      alert("There isn't any note in clip")
    }
  }
  else{                                         //비트   클립 저장시
    if(beat_clip.getNoteIndex() != -1){
      Beat_clip_array.push(beat_clip);
      beat_clip = new MusicClip(MusicClipType.Beat, Beat_clip_array.length, duration);
      alert("Beat Clip saved")
      clearNoteClip(MusicClipType.Beat);
      initializeTimer();
    }
    else{
      alert("There isn't any note in clip")
    }
  }
})
document.getElementById("sheetMusicPlayButton").addEventListener('click', function (){
  startRecording();
})
document.getElementById("sheetMusicPauseButton").addEventListener('click', function (){
  stopRecording();
})


SyntheysizerEvents.addEventListener('noteInput', function (e){
  if(play_state && current_clip_type == MusicClipType.Melody){
    melody_clip.setNoteInput(e.detail.note, currentTime);
    let NoteItem = createResizeDragElement(e.detail.note, time_to_px(currentTime, duration), melody_clip.getNoteIndex(), MusicClipType.Melody);
    onNoteList.push(NoteItem);  //Melody만
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

function removeAllElementsByClassName(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function clearNoteClip(type){
  if(type == MusicClipType.Melody){
    removeAllElementsByClassName("resize-drag");
  }
  else{
    removeAllElementsByClassName("draggable");
  }
}

function loadClip(MusicClip, duration){
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























//Note Interaction용
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

        Object.assign(event.target.dataset, { x, y })
      }
    }
  })
  .draggable({
    listeners: { move: window.dragMoveListener },
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
      move: dragMoveListener,

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

interact('.draggable')
  .draggable({
    listeners: { move: window.dragMoveListener },
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
      move: dragMoveListener,

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

  function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = 0
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    // update the posiion attributes
    target.setAttribute('data-x', x)
  }
  

