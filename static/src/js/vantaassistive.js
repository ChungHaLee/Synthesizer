const speedSaveButton = document.getElementById('speedSaveButton')
const zoomSaveButton = document.getElementById('zoomSaveButton')
const sizeSaveButton = document.getElementById('sizeSaveButton')
const velocitySaveButton = document.getElementById('velocitySaveButton')



let speedvalue, speedfinal;
let sizevalue, sizefinal;
let zoomvalue, zoomfinal;
let velocityvalue, velocityfinal; 



function getSpeed()  {
   speedvalue = Number(document.getElementById('speedID').value);
   return speedvalue
}


function getZoom() {
    zoomvalue = Number(document.getElementById('zoomID').value);
    return zoomvalue
}



function getSize()  {
    sizevalue = Number(document.getElementById('sizeID').value);
    return sizevalue
 }


 function getVelocity() {
    velocityvalue = Number(document.getElementById('velocityID').value);
    return velocityvalue
 }




speedSaveButton.addEventListener('click', function(){
    speedfinal = getSpeed();
})


zoomSaveButton.addEventListener('click', function(){
    zoomfinal = getZoom();
})


sizeSaveButton.addEventListener('click', function(){
    sizefinal = getSize();
})


velocitySaveButton.addEventListener('click', function(){
    velocityfinal = getVelocity();
})



export { speedfinal, zoomfinal, sizefinal, velocityfinal }