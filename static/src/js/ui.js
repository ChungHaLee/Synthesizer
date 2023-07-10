// 보여지는 메뉴
const themaGroup = document.getElementsByClassName('themaButton')



let blurButton = document.getElementById('thema_blur')
let fogButton = document.getElementById('thema_fog')

let haloButton = document.getElementById('thema_halo')

let cloudButton = document.getElementById('thema_clouds')
let cellsButton = document.getElementById('thema_cells')
let noneButton = document.getElementById('thema_none')

let clickList = []


// 색상 저장 버튼
const bgColorSaveButton = document.getElementById('backgroundColorSaveButton');
const objColor1SaveButton = document.getElementById('objectColor1SaveButton');


// assisitve menu (save)
let speedDIV = document.getElementById('speedDIV')
let zoomDIV = document.getElementById('zoomDIV')
let sizeDIV = document.getElementById('sizeDIV')
let velocityDIV = document.getElementById('velocityDIV')
let objColor1DIV = document.getElementById('objColor1DIV')



// functions start!

blurButton.addEventListener('click', function(){
    speedDIV.style.display = 'block'
    zoomDIV.style.display = 'block'
    sizeDIV.style.display = 'none'
    velocityDIV.style.display = 'none'
    objColor1DIV.style.display = 'block'
});



fogButton.addEventListener('click', function(){
    speedDIV.style.display = 'block'
    zoomDIV.style.display = 'block'
    sizeDIV.style.display = 'none'
    velocityDIV.style.display = 'none'
    objColor1DIV.style.display = 'block'
});


haloButton.addEventListener('click', function(){
    speedDIV.style.display = 'none'
    zoomDIV.style.display = 'none'
    sizeDIV.style.display = 'block'
    velocityDIV.style.display = 'none'
    objColor1DIV.style.display = 'block'
})


cellsButton.addEventListener('click', function(){
    speedDIV.style.display = 'none'
    zoomDIV.style.display = 'none'
    sizeDIV.style.display = 'none'
    velocityDIV.style.display = 'block'
    objColor1DIV.style.display = 'block'
})


cloudButton.addEventListener('click', function(){
    speedDIV.style.display = 'none'
    zoomDIV.style.display = 'none'
    sizeDIV.style.display = 'none'
    velocityDIV.style.display = 'block'
    objColor1DIV.style.display = 'block'
})


noneButton.addEventListener('click', function(){
    speedDIV.style.display = 'none'
    zoomDIV.style.display = 'none'
    sizeDIV.style.display = 'none'
    velocityDIV.style.display = 'none'
    objColor1DIV.style.display = 'none'
})







// function changeDisplay(identifier){
//     for (let i=0; i < themaGroup.length; i++ ){
//         if (themaGroup[i].id.slice(6, ) == identifier){

//             // themaGroup[i].style.display = 'block'
//         } else {

//             // themaGroup[i].style.display = 'none'
//         }
//     }
// }


// function changeBorder(identifier){
//     for (let i=0; i < effectButtonGroup.length; i++ ){
//         if (effectButtonGroup[i].id.slice(6, ) == identifier){
//             effectButtonGroup[i].style.border = '3px solid black';
//         } else {
//             effectButtonGroup[i].style.border = 'none';
//         }
//     }
// }


// for (let i = 0; i < bloom2D.length; i++) {
//     bloom2D[i].addEventListener('click', hideColorMenuBG, false);
// }


// for (let i = 0; i < bloom3D.length; i++) {
//     bloom3D[i].addEventListener('click', hideColorMenuOBJ1, false);
// }