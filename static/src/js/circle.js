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


// bloom renderer
// const renderScene = new RenderPass(scene, camera);
// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   1.5,
//   0.4,
//   0.85
// );


// bloomPass.threshold = 0;

// bloomPass.radius = 1;
// bloomPass.strength = dial_two * 0.05;
// bloomPass.exposure = dial_two * 0.01

// bloomComposer = new EffectComposer(renderer);
// bloomComposer.setSize(window.innerWidth, window.innerHeight);
// bloomComposer.addPass(renderScene);
// bloomComposer.addPass(bloomPass);
// bloomComposer.render();




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
    scene.background = new THREE.Color('#000000')

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

  color = colorByPitch();
  gradientColor = colorByWheel();
  
  if (dial_one > 0 || dial_two > 0 || dial_three > 0 || dial_four > 0){
    geometry = new THREE.IcosahedronGeometry(0.5 * dial_two, Math.ceil(dial_three*0.07));
  } else {
    geometry = new THREE.IcosahedronGeometry(0.05, 0);
  }

  // geometry = new THREE.IcosahedronGeometry(0.05 * dial_two, 0 + dial_four);
  material = new THREE.TextureLoader().load('/static/src/images/circle.png', (texture) => {
    particleMaterial = new THREE.PointsMaterial({
      map: texture,
      color: color,
      blending: THREE.AdditiveBlending,
      size: dial_four * 0.03
  })});


  const pointLight = new THREE.PointLight( 0xffffff, 1);
  camera.add(pointLight);


  compoCenter = new THREE.Points(geometry, particleMaterial);
  compoCenter.position.set(5*(pitch-48)/4 - 15, 5*(pitch-48)/6 - 10, -10);

  group.add( compoCenter );




}








//-------------------------신디 관련 컨트롤용 코드입니다.-----------------------------//
SyntheysizerEvents.addEventListener('noteInput', function (e){
  // console.log("In Circle note: ", e.detail.value); //범위가 0~127입니다.
  energy = e.detail.value * 10 / 127
  pitch = e.detail.pitch; // 48~72
  compoCenter.position.set(10, 0, 0);
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