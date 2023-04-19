import * as THREE from 'three';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass'
import { RenderPass } from 'three/addons/postprocessing/RenderPass'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { dataArray, analyser, pitchDetector, myNote, octave, randomEnergy, colorByPitchMulti } from './audio.js'
import { bgColor, objColor1, objColor2, setBgColor, setObjColor1 } from './colorpicker'
import { SyntheysizerEvents, note_set, pad_set, dial_set} from './Share.js';



let controls, bloomComposer;
let camera, scene, renderer;
let geometry, material, material1, material2, material3, energy = 0;
let compoCenter, compoCenter1, compoCenter2, compoCenter3;
let particleMaterial;
let container;
let FrameRate = 0;
let pitch, pitchColor, color, gradientColor;
let dial_one, dial_two, dial_three, dial_four, dial_five, dial_six, dial_seven, dial_eight;


let group;
let ambientLight, spotLight, pointLight;
var pitchInfo;

// html 버튼 요소



const templateSaveButton = document.getElementById("templateSave");
let AudioObject = document.getElementById("audio");
let playButton  = document.getElementById("playButton")
let musicDuration = 60;

let dialTWO = [];

// 시각화 구분자 단어
let identityVisualization = document.getElementById('identityVisual');

// init function
function init() {
    scene = new THREE.Scene();
    // canvas
    renderer = new THREE.WebGLRenderer( { antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(800, 600);


    camera = new THREE.PerspectiveCamera(70, renderer.domElement.width/renderer.domElement.height, 2, 2000);
    camera.position.set(0, 10, 30);
  
    container = document.getElementById('shape-canvas')
    
    container.appendChild( renderer.domElement )
    renderer.autoClear = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputEncoding = THREE.sRGBEncoding;


    group = new THREE.Group();
    scene.add(group);
   

    controls = new OrbitControls( camera, container );
    controls.update();
    createCircle_Vanilla();
  
  };

// 베이스 도형

function createCircle_Vanilla(){
  geometry = new THREE.CircleGeometry( 10, 60 );
  material = new THREE.MeshBasicMaterial();


  compoCenter = new THREE.Mesh(geometry, material);
  compoCenter.position.set(1, 0, 0);
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(200, 200, 200);
  scene.add(pointLight);

  group.add( compoCenter );
}


function colorByWheel(){
  let wheelColor;

  if ( dial_one < 12 ){
    wheelColor = '#FFFFFF'
  } else if ( dial_one < 24 && dial_one >= 12){
    wheelColor = '#E2E2E2'
  } else if ( dial_one < 36 && dial_one >= 24){
    wheelColor = '#C6C6C6'
  } else if ( dial_one < 48 && dial_one >= 36){
    wheelColor = '#ABABAB'
  } else if ( dial_one < 60 && dial_one >= 48){
    wheelColor = '#919191'
  } else if ( dial_one < 72 && dial_one >= 60){
    wheelColor = '#777777'
  } else if ( dial_one < 84 && dial_one >= 72){
    wheelColor = '#5E5E5E'
  } else if ( dial_one < 96 && dial_one >= 84){
    wheelColor = '#474747'
  } else if ( dial_one < 108 && dial_one >= 96){
    wheelColor = '#303030'
  } else if ( dial_one < 127 && dial_one >= 108){
    wheelColor = '#000000'
  } else {
    wheelColor = '#FFFFFF'
  }


  return wheelColor;



}



function colorByPitch(){
  let pitchColor;

  let red = '#C20000'
  let orange = '#FF1A00'
  let yellow = '#FF3B00'
  let green = '#008000'
  let blue = '#004FFF'
  let violet = '#5D00E1'
  let pink = '#CF003D'
  if (pitch == '48'){ // 도
      pitchColor = red
  } else if (pitch == '49'){ // 도샾++
      pitchColor = '#FF4814'
  } else if (pitch == '50'){ // 레++
      pitchColor = orange
  } else if (pitch == '51'){ // 레샾
      pitchColor = '#FFCF00'
  } else if (pitch == '52'){ // 미++
      pitchColor = yellow
  } else if (pitch == '53'){ // 파
      pitchColor = green
  } else if (pitch == '54'){ // 파샾
      pitchColor = '#29FA00'
  } else if (pitch == '55'){ // 솔
     pitchColor = blue
  } else if (pitch == '56'){ // 솔샾
    pitchColor = '#2E93FF'
 } else if (pitch == '57'){ // 라
    pitchColor = violet
  } else if (pitch=='58'){ // 라샾
    pitchColor = '#ff69b4'
  } else if (pitch=='59'){ // 시
    pitchColor = pink
  } else {
    pitchColor = '#808080'
  }
    return pitchColor;
  }



// 3D 도형

function createShape(){

  //bloom renderer
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );

  
  bloomPass.threshold = 0;

  bloomPass.radius = 1;
  bloomPass.strength = dial_two * 0.05;
  bloomPass.exposure = dial_two * 0.01

  color = colorByPitch();
  gradientColor = colorByWheel();
  if (dial_three == 'undefined'){
    dial_three = 1
  } else {
    
  }

  geometry = new THREE.IcosahedronGeometry( 12, dial_four );
  // material = new THREE.MeshPhongMaterial( { color: color, emissive: color, specular: color, shininess: 50} )
  material = new THREE.TextureLoader().load('/static/src/images/circle.png', (texture) => {
    particleMaterial = new THREE.PointsMaterial({
      map: texture,
      color: color,
      blending: THREE.AdditiveBlending,
      size: dial_three * 0.03
  })});


  // let wireframe = new THREE.WireframeGeometry( geometry )
  // material = new THREE.PointsMaterial({
  //   color: color,
  //   size : 0.25,
  //   //map : new THREE.TextureLoader().load('three/particle.jpg')
  // })

  // let particleSystem = new THREE.Points(geometry, material);
  // particleSystem.name = 'particles';
  // scene.add(particleSystem);


  // let particles = scene.getObjectByName('particles');

  // let t = 0;
  // t += 1;
  // let interval = 10,
  //     length = 2;
  // console.log(particles.geometry.attributes.position.array);
  // particles.geometry.attributes.position.array.forEach((vertex,index)=>{
  //    vertex.x +=  Math.sin( ( (t + index )/interval   ) ) * (0.005 * length) ;
  //    vertex.y +=  Math.sin( ( (t + index )/interval   ) ) * (0.005 * length);
  //    vertex.z +=  Math.sin( ( (t + index )/interval   ) ) * (0.005 * length);

  // });
  // particles.geometry.verticesNeedUpdate = true;


  // let point_light = new THREE.PointLight(0xffffff, 2);
  // point_light.position.y = 10;d

  // scene.add(point_light);
  // scene.add(camera);
    
  // compoCenter = new THREE.Mesh(geometry, material);
  compoCenter.position.set(1, 0, 0);

  const pointLight = new THREE.PointLight( 0xffffff, 1);
  camera.add(pointLight);

    
  bloomComposer = new EffectComposer(renderer);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  // bloomComposer.renderToScreen = true;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  compoCenter = new THREE.Points(geometry, particleMaterial);
  // compoCenter = new THREE.Mesh(geometry, material);
  compoCenter.position.set(1, 0, 0);


  group.add( compoCenter );
  bloomComposer.render();




}








//-------------------------신디 관련 컨트롤용 코드입니다.-----------------------------//
SyntheysizerEvents.addEventListener('noteInput', function (e){
  // console.log("In Circle note: ", e.detail.value); //범위가 0~127입니다.
  energy = e.detail.value * 10 / 127
  pitch = e.detail.pitch
})


SyntheysizerEvents.addEventListener('padInput', function (e){
  console.log("In Circle Pad id: ", e.detail.id); //그냥 패드 id입니다. 0~7로 8개가 표시됩니다.
})


SyntheysizerEvents.addEventListener('dialInput', function (e){
  dial_one = e.detail.value[0][0]
  dial_two = e.detail.value[0][1]
  dial_three = e.detail.value[0][2]
  dial_four = e.detail.value[0][3]
  dial_five = e.detail.value[1][0]
  dial_six = e.detail.value[1][1]
  dial_seven = e.detail.value[1][2]
  dial_eight = e.detail.value[1][3]


  $("#volume").slider("value", (e.detail.value[0][0]/127)*100); //여기 다이얼 값 범위가 0~127입니다.
})

SyntheysizerEvents.addEventListener('joystickInpnut', function (e){ // 조이스틱을 움직이면 업데이트되는 값입니다.
  //console.log("In Circle Pjoystic: ", e.detail.value); //출력은 [x, y] 형태이며, x는 -64 ~ +64. Y는 0 ~ +64 범위를 가집니다.
  //console.log(compoCenter.position.set(100, 1, 1))
  
})




//-----------------------------------------Songmin code-----------------------------------------//
    //여기 밑부터 코드를 다른 곧으로 옮길 예정입니다.... 시간이 없었어서 너무 지저분하네요....//
// let currentTempleteNumber = 0;
// const saveButtonColorList = ["#FFCC99", "#FFCC00","#99FF99", "#9999FF", "#666699", "#FF66FF", "#FF9999"]
// let musicName = document.getElementById("thefile")
// let templateFile = document.getElementById("TemplateFile")

// let visualizationList = []
// let backgroundColorList = []
// let objectColorList = []
// let objectPositionXList = []
// let objectPositionYList = []
// let objectPositionZList = []
// let timeTableList = [0]
// let volumeList =[]

// function loadTemplate(buttonId){
//   identityVisualization.innerText = visualizationList[buttonId-1];
//   setBgColor(backgroundColorList[buttonId-1]);
//   setObjColor1(objectColorList[buttonId-1]);
//   camera.position.x = objectPositionXList[buttonId-1];
//   camera.position.y = objectPositionYList[buttonId-1];
//   camera.position.z = objectPositionZList[buttonId-1];
//   $("#slider-range").slider("values", [timeTableList[buttonId-1], timeTableList[buttonId]]);
//   $("#playTime").val(sec2Timer(timeTableList[buttonId-1])+ " - "+sec2Timer(timeTableList[buttonId]));
//   $("#volume").slider("value", volumeList[buttonId-1]);
//   currentTempleteNumber = buttonId-1;
//   //AudioObject.currentTime = timeTableList[buttonId-1];
// }

// function saveTemplate(){

//   visualizationList.push(identityVisualization.innerText);
//   backgroundColorList.push(bgColor);
//   objectColorList.push(objColor1);
//   objectPositionXList.push(camera.position.x);
//   objectPositionYList.push(camera.position.y);
//   objectPositionZList.push(camera.position.z);
//   let finishedTime = $("#slider-range").slider("values")[1];
//   timeTableList.push(finishedTime);
//   $("#slider-range").slider("values", [finishedTime, finishedTime]);
//   volumeList.push($("#volume").slider("value"))
// }

// templateSaveButton.addEventListener('click', function (){
//   //console.log("check the template", currentTempleteNumber, visualizationList.length);
//   if(identityVisualization.innerText != "" && AudioObject.src != ""){
//     if(currentTempleteNumber == visualizationList.length){
//       currentTempleteNumber += 1
//       //console.log("check the template", currentTempleteNumber, visualizationList.length);
//       console.log("Template Save Button Click")
//       var button = document.createElement('button');
//       button.type = 'button';
//       button.style = "font-size: 1.4em;" + "background-color: " + saveButtonColorList[(currentTempleteNumber%(saveButtonColorList.length+1))]
//       console.log("Finished Time:", timeTableList[currentTempleteNumber])
      
//       if(currentTempleteNumber < 10){
//         button.innerHTML = "0" + String(currentTempleteNumber);
//       }
//       else{
//         button.innerHTML = String(currentTempleteNumber);
//       }
//       button.onclick = function() {
//         loadTemplate(parseInt(button.innerHTML));
//       };
//       var container = document.getElementById('templateContainer');
//       container.appendChild(button);
//       saveTemplate()
//     }
//     else{
//       visualizationList[currentTempleteNumber] = identityVisualization.innerText;
//       backgroundColorList[currentTempleteNumber] = bgColor;
//       objectColorList[currentTempleteNumber] = objColor1;
//       objectPositionXList[currentTempleteNumber] = camera.position.x;
//       objectPositionYList[currentTempleteNumber] = camera.position.y;
//       objectPositionZList[currentTempleteNumber] = camera.position.z;
//       volumeList[currentTempleteNumber] = $("#volume").slider("value");
//       alert("Template Resaved");
//     }
//   }
// })
// function ButtonMaker(index){
//   var button = document.createElement('button');
//   button.type = 'button';
//   button.style = "font-size: 1.4em;" + "background-color: " + saveButtonColorList[(index%(saveButtonColorList.length+1))]
//   if(index < 10){
//     button.innerHTML = "0" + String(index);
//   }
//   else{
//     button.innerHTML = String(index);
//   }
//   button.onclick = function() {
//     loadTemplate(parseInt(button.innerHTML));
//   };
//   var container = document.getElementById('templateContainer');
//   container.appendChild(button);
// }

// function InitializeAllSetting(){
//   //모든 버튼 내용 삭제
//   var container = document.getElementById('templateContainer');
//   while (container.firstChild) {
//     container.removeChild(container.firstChild);
//   }
//   currentTempleteNumber = 0;
//   AudioObject.currentTime = 0;
//   visualizationList = [];
//   backgroundColorList = [];
//   objectColorList = [];
//   objectPositionXList = [];
//   objectPositionYList = [];
//   objectPositionZList = [];
//   timeTableList = [0];
//   volumeList = [];
//   AudioObject.currentTime = 0;
// }

// // 객체를 JSON 파일로 다운로드하는 함수
// function downloadJsonFile(filename, data) {
//   const jsonData = JSON.stringify(data);
//   const blob = new Blob([jsonData], { type: 'application/json' });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement('a');
//   link.download = filename;
//   link.href = url;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// }

// document.getElementById("TemplateJsonSave").addEventListener('click', function(){
//   let JsonObject = {
//     "music": musicName.files[0].name,
//     "visualization" : visualizationList,
//     "backgroundColorList" : backgroundColorList, 
//     "objectColor" : objectColorList, 
//     "objectPositionX" : objectPositionXList, 
//     "objectPositionY" : objectPositionYList, 
//     "objectPositionZ" : objectPositionZList,
//     "timeTable" : timeTableList,
//     "volume" : volumeList
//   }
//   downloadJsonFile("Template_file", JsonObject);
// })


// document.getElementById("TemplateJsonLoad").addEventListener('click', function(){
//   templateFile.click();
// })
// templateFile.addEventListener('change', function(e){
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = function(event) {
//       const contents = event.target.result;
//       const jsonObject = JSON.parse(contents);
//       if(AudioObject.src == ""){
//         alert("First, Need to input the music")
//       }
//       else if(musicName.files[0].name != jsonObject["music"]){
//         alert("It doesn't match the music in this template.")
//       }
//       else{
//         InitializeAllSetting();
//         visualizationList = jsonObject["visualization"];
//         backgroundColorList = jsonObject["backgroundColorList"];
//         objectColorList = jsonObject["objectColor"];
//         objectPositionXList = jsonObject["objectPositionX"];
//         objectPositionYList = jsonObject["objectPositionY"];
//         objectPositionZList = jsonObject["objectPositionZ"];
//         timeTableList = jsonObject["timeTable"];
//         volumeList = jsonObject["volume"];
//         for(var i =1; i< visualizationList.length+1; i++){
//           ButtonMaker(i)
//         }
//         loadTemplate(1);
//       }
//     };
//     reader.readAsText(file);
//   })

// function sec2Timer(time){
//   let m = String(parseInt(parseFloat(time)/60))
//   let s = String(parseInt(parseFloat(time)%60))
//   let _s = String(parseInt((parseFloat(time)-parseInt(time))*100))
//   if(s.length <2){s = "0" + s}
//   if(_s.length <2){_s = "0" + _s}
//   return m + ":" +  s + ":" + _s
// }

// playButton.addEventListener("click", function(){
//   var musicDuration = AudioObject.duration;
//   var currentPlayTime = AudioObject.currentTime;
//   $("#slider").slider("option", "max", musicDuration);
//   $("#slider").slider("value", currentPlayTime);
//   $("#rangeTime").val(sec2Timer(currentPlayTime));

//   $("#slider-range").slider("option", "max", musicDuration);

//   if(playButton.innerHTML == "Play"){
//     playButton.innerHTML = "Pause"
//     console.log("music play");
//     audio.play();
//   }
//   else{
//     playButton.innerHTML = "Play"
//     console.log("music pause");
//     audio.pause();
//   }
// })

// AudioObject.addEventListener("timeupdate", function(){
//   var currentPlayTime = AudioObject.currentTime;
//   $("#slider").slider("value", currentPlayTime);
//   $("#rangeTime").val(sec2Timer(currentPlayTime));
//   if(currentPlayTime > timeTableList[timeTableList.length-1]){
//     $("#slider-range").slider("values", [timeTableList[currentTempleteNumber], currentPlayTime]);
//     $("#playTime").val(sec2Timer(timeTableList[currentTempleteNumber])+ " - "+sec2Timer(currentPlayTime));
//     currentTempleteNumber = timeTableList.length-1
//     //console.log(currentTempleteNumber);
//   }
//   else{
    

//     for(let i=0; i<timeTableList.length; i++){
//       if(currentPlayTime < timeTableList[i]){

//         if(i-1 != currentTempleteNumber){
//           loadTemplate(i);
//           //console.log(currentTempleteNumber);
//         }
//         break;
//       }
//       //loadTemplate(i+2);
//     }
//   }
// })


// $("#slider").slider({
//   value:0,
//   min: 0,
//   max: 0,
//   step: 0.01,
//   slide: function( event, ui ) {
//       $( "#rangeTime" ).val(sec2Timer(ui.value));
//       AudioObject.currentTime = ui.value;
//       // console.log("test", AudioObject.currentTime);
//       // console.log("duration", AudioObject.duration);
//       // AudioObject.currentTime = parseFloat(ui.value);
//   }
// });
// $("#rangeTime").val(sec2Timer($( "#slider" ).slider( "value" )));

// // 음악 Template 범위 지정용 슬라이더랑 연결
// $("#slider-range").slider({
//     range: true,
//     min: 0,
//     max: 0,
//     values: [0, 0],
//     step: 0.01,
//     slide: function(event, ui) {
//       if(ui.values[0] != timeTableList[currentTempleteNumber]){
//         $(this).slider("values", timeTableList[currentTempleteNumber], ui.values[1]);
//         console.log("detected")
//       }
//       $("#playTime").val(sec2Timer(timeTableList[currentTempleteNumber]) + " - " + sec2Timer(ui.values[1]));
//     }
//   });
//   $("#playTime").val(sec2Timer($("#slider-range").slider("values", 0)) + " - " + sec2Timer($("#slider-range").slider("values", 1)));


// // volume control

// $("#volume").slider({
//   min: 0,
//   max: 100,
//   value: 0,
//     range: "min",
//   slide: function(event, ui) {
//     setVolume(ui.value / 100);
//   }
// });

// var myMedia = document.createElement('audio');
// $('#player').append(myMedia);
// myMedia.id = "myMedia";

// //   playAudio(audio, 0);

// //   function playAudio(fileName, myVolume) {
// //           myMedia.src = fileName;
// //           myMedia.setAttribute('loop', 'loop');
// //       setVolume(myVolume);
// //       myMedia.play();
// //   }

// function setVolume(myVolume) {
// var myMedia = document.getElementById('audio');
// myMedia.volume = myVolume;
//}
//------------------------------------------------------------------------------------------//

function animate() {
  requestAnimationFrame(animate);
  // 여기를 기점으로 색깔 등 요소 변경을 추가하면됨
  FrameRate = FrameRate + 1
  
  if (FrameRate % 4 == 0){
        deleteBasics();
        createShape();
        render();
      } 

    }

function deleteBasics(){
  group.parent.remove(group);
  group = new THREE.Group();
  scene.add(group);
  
  compoCenter.geometry.dispose();
  compoCenter.material.dispose();
};

// render function
function render() {
    controls.update();
    renderer.render(scene, camera);
  }

// optionalVisualization();


// BASIC EVENTS
init();
animate();


export { pitchInfo }