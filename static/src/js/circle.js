import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { dataArray, analyser, pitchDetector, myNote, octave, randomEnergy, colorByPitchMulti } from './audio.js'
import { bgColor, objColor1, objColor2, setBgColor, setObjColor1 } from './colorpicker'
import { SyntheysizerEvents, note_set, pad_set, dial_set} from './Share.js';



let controls;
let camera, scene, renderer;
let geometry, material, energy = 0;
let geometry2, material2;
let compoCenter;
let compoCenter2;
let particleMaterial;
let particleMaterial2;


let container;
let FrameRate = 0;
let pitch, pitchColor


let pitch1, pitch2
let pitchOne, pitchTwo
let gradientColor;
let color1;
let color2;

let dial_one, dial_two, dial_three, dial_four, dial_five, dial_six, dial_seven, dial_eight;


let group;
let ambientLight, spotLight, pointLight;
var pitchInfo;

let red = '#C20000'
let redorange = '#FF4814'
let orange = '#FF1A00'
let orangeyellow = '#FFCF00'
let yellow = '#FF3B00'
let green = '#008000'
let greenblue = '#29FA00'
let blue = '#004FFF'
let blueviolet = '#2E93FF'
let violet = '#5D00E1'
let violetpink = '#ff69b4'
let pink = '#CF003D'
let magenta = '#808080'






String.prototype.format = function() {
  var formatted = this, i = 0;
  while (/%s/.test(formatted))
    formatted = formatted.replace("%s", arguments[i++]);
  return formatted;
}


// function backgroundColor(){
//   if (isNaN(dial_one)){
//     var backgroundColor = new THREE.Color("hsl(0, 100%, 1%)")
//   } else {
//     var dial_one_edit = dial_one * 360 / 127
//     backgroundColor = new THREE.Color("hsl(%s, 100%, 20%)".format(dial_one_edit));
//   }
//   return backgroundColor
// }

// init function
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('black')

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

  geometry2 = new THREE.CircleGeometry( 10, 60 );
  material2 = new THREE.MeshBasicMaterial();
  compoCenter2 = new THREE.Mesh(geometry2, material2);
  compoCenter2.position.set(1, 0, 0);

  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(200, 200, 200);
  scene.add(pointLight);

  group.add( compoCenter );
  group.add( compoCenter2 );

}



function returnPitchOne(polyPitchArray){
  pitch1 = polyPitchArray[0];
  return pitch1
}


function returnPitchTwo(polyPitchArray){
  pitch2 = polyPitchArray[1];
  return pitch2
}



function colorByPitch(pitchNum){
  
  let pitchColor;

  if (pitchNum == '48'){ // 도
      pitchColor = red
  } else if (pitchNum == '49'){ // 도샾++
      pitchColor = redorange
  } else if (pitchNum == '50'){ // 레++
      pitchColor = orange
  } else if (pitchNum == '51'){ // 레샾
      pitchColor = orangeyellow
  } else if (pitchNum == '52'){ // 미++
      pitchColor = yellow
  } else if (pitchNum == '53'){ // 파
      pitchColor = green
  } else if (pitchNum == '54'){ // 파샾
      pitchColor = greenblue
  } else if (pitchNum == '55'){ // 솔
     pitchColor = blue
  } else if (pitchNum == '56'){ // 솔샾
    pitchColor = blueviolet
  } else if (pitchNum == '57'){ // 라
    pitchColor = violet
  } else if (pitchNum=='58'){ // 라샾
    pitchColor = violetpink
  } else if (pitchNum=='59'){ // 시
    pitchColor = pink
  } else if (pitchNum=='60'){
    pitchColor = magenta
  }
    return pitchColor;
  }










// 3D 도형

function createShape(){
  if (polyPitchArray.length != 0){
    pitchOne = returnPitchOne(polyPitchArray)
    pitchTwo = returnPitchTwo(polyPitchArray)
  
    color1 = colorByPitch(pitchOne);
    color2 = colorByPitch(pitchTwo);
  } else {
    color1 = '#FFFFFF'
    color2 = '#FFFFFF'
  }

  scene.background = new THREE.Color('black')


  if (dial_one > 0 || dial_two > 0 || dial_three > 0 || dial_four > 0){
    geometry = new THREE.IcosahedronGeometry(0.5 * dial_two, Math.ceil(dial_three*0.1));
  } else {
    geometry = new THREE.IcosahedronGeometry(0.05, 0);
  }

  material = new THREE.TextureLoader().load('/static/src/images/circle.png', (texture) => {
    particleMaterial = new THREE.PointsMaterial({
      map: texture,
      color: color1,
      blending: THREE.AdditiveBlending,
      size: dial_four * 0.5,
      depthWrite: false,
      sizeAttenuation: false,
      opacity: 1
  })});


  const pointLight = new THREE.PointLight( gradientColor, 1, 100 );
  group.add(pointLight);


  compoCenter = new THREE.Points(geometry, particleMaterial);
  compoCenter.position.set(5*(pitchOne-48)/4 - 15, 5*(pitchOne-48)/6 - 10, -10);

  group.add( compoCenter );



  // let realBG = backgroundColor();
  // scene.background = realBG;
  addGeometryAgain();

}

function addGeometryAgain(){
  if (polyPitchArray.length != 0){
    pitchOne = returnPitchOne(polyPitchArray)
    pitchTwo = returnPitchTwo(polyPitchArray)
  
    color1 = colorByPitch(pitchOne);
    color2 = colorByPitch(pitchTwo);
  } else {
    color1 = '#FFFFFF'
    color2 = '#FFFFFF'
  }
  
  if (polyPitchArray.length == 2){
    scene.background = new THREE.Color('black')


    
    if (dial_one > 0 || dial_two > 0 || dial_three > 0 || dial_four > 0){
      geometry = new THREE.IcosahedronGeometry(0.5 * dial_two, Math.ceil(dial_three*0.1));
    } else {
      geometry = new THREE.IcosahedronGeometry(0.05, 0);
    }


    material = new THREE.TextureLoader().load('/static/src/images/circle.png', (texture) => {
      particleMaterial = new THREE.PointsMaterial({
        map: texture,
        color: color1,
        blending: THREE.AdditiveBlending,
        size: dial_four * 0.5,
        depthWrite: false,
        sizeAttenuation: false,
        opacity: 1
    })});


    const pointLight = new THREE.PointLight( gradientColor, 1, 100 );
    group.add(pointLight);


    compoCenter = new THREE.Points(geometry, particleMaterial);
    compoCenter.position.set(5*(pitchOne-48)/4 - 15, 5*(pitchOne-48)/6 - 10, -10);

    group.add( compoCenter );

      if (dial_one > 0 || dial_two > 0 || dial_three > 0 || dial_four > 0){
        geometry2 = new THREE.IcosahedronGeometry(0.5 * dial_two, Math.ceil(dial_three*0.1));
      } else {
        geometry2 = new THREE.IcosahedronGeometry(0.05, 0);
      }

      material2 = new THREE.TextureLoader().load('/static/src/images/circle.png', (texture) => {
        particleMaterial2 = new THREE.PointsMaterial({
          map: texture,
          color: color2,
          blending: THREE.AdditiveBlending,
          size: dial_four * 0.5,
          depthWrite: false,
          sizeAttenuation: false,
          opacity: 1
      })});


      compoCenter2 = new THREE.Points(geometry2, particleMaterial2);
      compoCenter2.position.set(5*(pitchTwo-48)/4 - 15, 5*(pitchTwo-48)/6 - 10, -10);

      group.add( compoCenter2 );
    
  }
}






//-------------------------신디 관련 컨트롤용 코드입니다.-----------------------------//
let polyPitchArray = [] // 현재 입력으로 사용되고 있는 Note들의 Array
SyntheysizerEvents.addEventListener('noteInput', function (e){
  energy = e.detail.value * 10 / 127
  pitch = e.detail.pitch; // 48~72
  if (!polyPitchArray.includes(pitch)) {
    polyPitchArray.push(pitch);
  }
  compoCenter.position.set(10, 0, 0);
})

SyntheysizerEvents.addEventListener('noteRelease', function (e){
  polyPitchArray = polyPitchArray.filter((item) => item !== e.detail.pitch);
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
          if (polyPitchArray.length == 0){
            particleMaterial.opacity = 0;
            
          } else {
            particleMaterial.opacity = 1;
          }
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