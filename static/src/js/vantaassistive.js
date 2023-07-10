const speedSaveButton = document.getElementById('speedSaveButton')
const zoomSaveButton = document.getElementById('zoomSaveButton')
const sizeSaveButton = document.getElementById('sizeSaveButton')



let speedvalue, speedfinal;
let sizevalue, sizefinal;
let zoomvalue, zoomfinal;



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





speedSaveButton.addEventListener('click', function(){
    speedfinal = getSpeed();
})


zoomSaveButton.addEventListener('click', function(){
    zoomfinal = getZoom();
})


sizeSaveButton.addEventListener('click', function(){
    sizefinal = getSize();
})




export { speedfinal, zoomfinal, sizefinal }