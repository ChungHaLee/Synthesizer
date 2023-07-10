const bgColorSaveButton = document.getElementById('backgroundColorSaveButton');
const objColor1SaveButton = document.getElementById('objectColor1SaveButton');

// const bgColorSwatch = document.getElementById('backgroundColorID')
// const objColor1Swatch = document.getElementById('objectColor1ID')

// 변수명 정의
var bgColor, objColor1


var bgColorArr, objColor1Arr

objColor1 = '#FFFFFF'
bgColor = '#FFFFFF'




function rgbToHex([r, g, b]) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}


document.querySelector('#backgroundColor').addEventListener('click', e => {
  Coloris({
    themeMode: 'light',
    alpha: true,
    formatToggle: true,
    swatchesOnly: true
  });

});



document.querySelector('#objectColor1').addEventListener('click', e => {
  Coloris({
    themeMode: 'light',
    alpha: true,
    formatToggle: true,
    swatchesOnly: true
  });

});





function setBgColor(color){
  bgColor = color
}
function setObjColor1(color){
  objColor1 = color
}



function colortoList(colorpick){
  let colors = colorpick.replace('rgb(', '').replace(')', '')
  let colorArr = colors.split(',')
  return colorArr
}


bgColorSaveButton.addEventListener('click', function (){
    bgColor = document.getElementsByClassName('clr-field')[0].style.color
    bgColorArr = colortoList(bgColor);
    bgColor = rgbToHex(bgColorArr);


    // bgColorSwatch.style.backgroundColor = bgColor
})


objColor1SaveButton.addEventListener('click', function (){
    objColor1 = document.getElementsByClassName('clr-field')[1].style.color
    objColor1Arr = colortoList(objColor1);
    objColor1 = rgbToHex(objColor1Arr);


    // objColor1Swatch.style.backgroundColor = objColor1
})







export { bgColor, objColor1, setBgColor, setObjColor1 };