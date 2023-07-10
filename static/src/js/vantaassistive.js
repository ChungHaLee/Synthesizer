const speedSaveButton = document.getElementById('speedSaveButton')
const sizeSaveButton = document.getElementById('sizeSaveButton')



let speedvalue, speedfinal;
let sizevalue, sizefinal;



function getSpeed()  {
   speedvalue = Number(document.getElementById('speedID').value);
   return speedvalue
}



function getSize()  {
    sizevalue = Number(document.getElementById('sizeID').value);
    return sizevalue
 }





speedSaveButton.addEventListener('click', function(){
    speedfinal = getSpeed();
})



sizeSaveButton.addEventListener('click', function(){
    sizefinal = getSize();
})




export { speedfinal, sizefinal }