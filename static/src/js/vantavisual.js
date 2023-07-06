import { bgColor, objColor1 } from './colorpicker';

// 변수명 정의
let cloud, fog, blur, halo, cells, dots;


let cloudButton = document.getElementById('thema_clouds')
let blurButton = document.getElementById('thema_blur')
let fogButton = document.getElementById('thema_fog')
let haloButton = document.getElementById('thema_halo')
let cellsButton = document.getElementById('thema_cells')
let noneButton = document.getElementById('thema_none')



const bgColorSaveButton = document.getElementById('backgroundColorSaveButton');
const objColor1SaveButton = document.getElementById('objectColor1SaveButton');



cloudButton.addEventListener('click', cloudfunc)
blurButton.addEventListener('click', blurfunc)
fogButton.addEventListener('click', fogfunc)
haloButton.addEventListener('click', halofunc)
cellsButton.addEventListener('click', cellsfunc)
noneButton.addEventListener('click', nonefunc)

cloud = VANTA.CLOUDS({
  el: "#shape-canvas",
  minHeight: 580.00,
  minWidth: 960.00,
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  skyColor: 0x63b4d2,
  cloudColor: 0xadbedc,
  cloudShadowColor: 0x18354a,
  sunColor: 0xf79622,
  sunGlareColor: 0xfa6331,
  sunlightColor: 0xfc9c3e
})

blur = VANTA.FOG({
  el: "#shape-canvas",
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 580.00,
  minWidth: 960.00,
  highlightColor: 0xffffff,

  midtoneColor: '#fac4c4',
  lowlightColor: '#fac4c4',
  baseColor: '#8828ff',
  blurFactor: 0.90,
  speed: 2.50,
  zoom: 1.60
})

fog = VANTA.FOG({    
  el: "#shape-canvas",
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 580.00,
  minWidth: 960.00,
  highlightColor: 0xb63277,
  midtoneColor: '#0084ff',
  lowlightColor: '#0084ff',
  baseColor: '#e3d842',
  blurFactor: 0.27,
  speed: 2.20,
  zoom: 1.90
})

halo = VANTA.HALO({
  el: "#shape-canvas",
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 580.00,
  minWidth: 960.00,
  baseColor: 0x458258,
  backgroundColor: 0x123126,
  amplitudeFactor: 1.10,
  size: 3.00
})

cells = VANTA.CELLS({
  el: "#shape-canvas",
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 580.00,
  minWidth: 960.00,
  scale: 1.00,
  color1: 0xb6ebeb,
  color2: 0xecd3fa,
  size: 5.00,
  speed: 3
})


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





function cloudfunc(){
  cloud = VANTA.CLOUDS({
    el: "#shape-canvas",
    minHeight: 580.00,
    minWidth: 960.00,
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    skyColor: 0x63b4d2,
    cloudColor: 0xadbedc,
    cloudShadowColor: 0x18354a,
    sunColor: 0xf79622,
    sunGlareColor: 0xfa6331,
    sunlightColor: 0xfc9c3e
  })

  blur.destroy();
  fog.destroy();
  halo.destroy();
  cells.destroy();
  dots.destroy();
}








function blurfunc(){
  blur = VANTA.FOG({
    el: "#shape-canvas",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 580.00,
    minWidth: 960.00,
    highlightColor: 0xffffff,

    midtoneColor: '#fac4c4',
    lowlightColor: '#fac4c4',
    baseColor: '#8828ff',
    blurFactor: 0.90,
    speed: 2.50,
    zoom: 1.60
  })

  cloud.destroy();
  fog.destroy();
  halo.destroy();
  cells.destroy();
  dots.destroy();
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
    midtoneColor: '#0084ff',
    lowlightColor: '#0084ff',
    baseColor: '#e3d842',
    blurFactor: 0.27,
    speed: 2.20,
    zoom: 1.90
  })

  blur.destroy();
  cloud.destroy();
  halo.destroy();
  cells.destroy();
  dots.destroy();

}


function halofunc(){
  halo = VANTA.HALO({
    el: "#shape-canvas",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 580.00,
    minWidth: 960.00,
    baseColor: 0x458258,
    backgroundColor: 0x123126,
    amplitudeFactor: 1.10,
    size: 3.00
  })

  blur.destroy();
  fog.destroy();
  cloud.destroy();
  cells.destroy();
  dots.destroy();
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
    color1: 0xb6ebeb,
    color2: 0xecd3fa,
    size: 5.00,
    speed: 3
  })

  blur.destroy();
  fog.destroy();
  halo.destroy();
  cloud.destroy();
  dots.destroy();
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

  blur.destroy();
  fog.destroy();
  halo.destroy();
  cells.destroy();
  cloud.destroy();
}





bgColorSaveButton.addEventListener('click', function(){
  cloud.setOptions({
    cloudColor: bgColor
  });

  blur.setOptions({
    midtoneColor: bgColor,
    lowlightColor: bgColor
  });

  fog.setOptions({
    midtoneColor: bgColor,
    lowlightColor: bgColor

  })

  halo.setOptions({
    backgroundColor: bgColor
  })

  cells.setOptions({
    color1: bgColor
  })

})






objColor1SaveButton.addEventListener('click', function(){
  cloud.setOptions({
    skyColor: objColor1,
    cloudShadowColor: objColor1
  });

  blur.setOptions({
    baseColor: objColor1
  });

  fog.setOptions({
    baseColor: objColor1
  })

  halo.setOptions({
    baseColor: objColor1
  })

  cells.setOptions({
    color2: objColor1
  })

})


