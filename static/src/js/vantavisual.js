import * as THREE from 'three';


let cloud, fog, waves, halo, cells, dots;

let cloudButton = document.getElementById('thema_clouds')
let wavesButton = document.getElementById('thema_waves')
let fogButton = document.getElementById('thema_fog')
let haloButton = document.getElementById('thema_halo')
let cellsButton = document.getElementById('thema_cells')
let noneButton = document.getElementById('thema_none')

dots = VANTA.DOTS({
  el: "#shape-canvas",
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 580.00,
  minWidth: 960.00,
  scale: 1.00,
  color: 0x0,
  color2: 0x0,
  backgroundColor: 0x0,
  size: 0.50,
  spacing: 5.00,
  showLines: false
})


cloudButton.addEventListener('click', cloudfunc)
wavesButton.addEventListener('click', wavesfunc)
fogButton.addEventListener('click', fogfunc)
haloButton.addEventListener('click', halofunc)
cellsButton.addEventListener('click', cellsfunc)
noneButton.addEventListener('click', nonefunc)



function cloudfunc(){
  cloud = VANTA.CLOUDS({
    el: "#shape-canvas",
    minHeight: 580.00,
    minWidth: 960.00,
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    backgroundColor: 0xc0c0c0,
    skyColor: 0x66797f,
    cloudColor: 0xbcbcff,
    cloudShadowColor: 0x8e8e8e,
    sunColor: 0xfffafa,
    sunGlareColor: 0xff0086,
    sunlightColor: 0xff3030,
    speed: 1.30
  })

}

function wavesfunc(){
  waves = VANTA.WAVES({
    el: "#shape-canvas",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 580.00,
    minWidth: 960.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x146619
  })

}

function fogfunc(){
  fog = VANTA.FOG({    
    el: "#shape-canvas",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 580.00,
    minWidth: 960.00,
    highlightColor: 0xb63277,
    midtoneColor: 0xca3f68,
    lowlightColor: 0xcd44d7,
    blurFactor: 0.27,
    speed: 2.20,
    zoom: 1.90
  })

}


function halofunc(){
  halo = VANTA.HALO({
    el: "#shape-canvas",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 580.00,
    minWidth: 960.00,
    baseColor: 0x1b56e6,
    backgroundColor: 0x4e60c0
  })
}


function cellsfunc(){
  cells = VANTA.CELLS({
    el: "#shape-canvas",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 580.00,
    minWidth: 960.00,
    scale: 1.00,
    color1: 0xe8877b,
    color2: 0xd99a9a,
    size: 5.00
  })
}


function nonefunc(){
  dots = VANTA.DOTS({
    el: "#shape-canvas",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 580.00,
    minWidth: 960.00,
    scale: 1.00,
    color: 0x0,
    color2: 0x0,
    backgroundColor: 0x0,
    size: 0.50,
    spacing: 5.00,
    showLines: false
  })
}



export { cloudfunc, wavesfunc, fogfunc, halofunc }