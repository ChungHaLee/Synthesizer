import anime from 'animejs/lib/anime.es.js';
import { bgColor, objColor1, objColor2 } from './colorpicker'


const bgColorSaveButton = document.getElementById('backgroundColorSaveButton');
const objColor1SaveButton = document.getElementById('objectColor1SaveButton');
const objColor2SaveButton = document.getElementById('objectColor2SaveButton');

const staggerVisual = document.getElementsByClassName('stagger-visualizer')[0]


const staggerVisualizerEl = document.querySelector('.stagger-visualizer');
const fragment = document.createDocumentFragment();
const grid = [30, 30];
const col = grid[0];
const row = grid[1];
const numberOfElements = col * row;

const input_note = document.getElementById('currnet_note')

for (let i = 0; i < numberOfElements; i++) {
  fragment.appendChild(document.createElement('div'));

}

staggerVisualizerEl.appendChild(fragment);
// console.log(staggerVisualizerEl.children[0].style)




bgColorSaveButton.addEventListener('click', function () {
  staggerVisual.style.backgroundColor = bgColor
})


objColor1SaveButton.addEventListener('click', function() {
  for (let i = 0; i < numberOfElements; i++) {
    staggerVisualizerEl.children[i].style.backgroundColor = objColor1
  }
  
})



let A = parseInt(input_note.innerHTML);


const staggersAnimation1 = anime.timeline({
  targets: '.stagger-visualizer div',
  easing: 'easeInOutSine',
  delay: anime.stagger(2),
  loop: false,
  autoplay: false
})
.add({
  translateX: anime.stagger('.50rem', {grid: grid, from: 'center', axis: 'x'}),
  translateY: anime.stagger('.50rem', {grid: grid, from: 'center', axis: 'y'}),
  rotate: 0,
  scaleX: 2.5,
  scaleY: .25,
  delay: anime.stagger(2, {from: 'center'})

})
.add({
  rotate: anime.stagger([90, 0], {grid: grid, from: 'center'}),
  delay: anime.stagger(5, {grid: grid, from: 'center'})
})


const staggersAnimation2 = anime.timeline({
  targets: '.stagger-visualizer div',
  easing: 'easeInOutSine',
  // delay: anime.stagger(0.1),
  loop: false,
  autoplay: false
})
.add({
  translateX: anime.stagger('.50rem', {grid: grid, from: 'center', axis: 'x'}),
  translateY: anime.stagger('.50rem', {grid: grid, from: 'center', axis: 'y'}),
  rotate: 1,
  scaleX: 2.5,
  scaleY: .25,
})
.add({
  translateX: anime.stagger('.50rem', {grid: grid, from: 'center', axis: 'x'}),
  translateY: anime.stagger('.50rem', {grid: grid, from: 'center', axis: 'y'}),
  rotate: 0,
  scaleX: 0,
  scaleY: 0,

})
// .add({
//   rotate: anime.stagger([90, 0], {grid: grid, from: 'center'}),
//   delay: anime.stagger(0.1, {grid: grid, from: 'center'})
// })
// .add({
//   translateX: 0,
//   translateY: 0,
//   scale: .5,
//   scaleX: 1,
//   rotate: 180,
//   duration: 10,
//   delay: anime.stagger(0.1, {grid: grid, from: 'center'})
// })
// .add({
//   scaleY: 1,
//   scale: 2,
//   delay: anime.stagger(0.1, {grid: grid, from: 'center'})
// })

// staggersAnimation.play();


export { staggersAnimation1, staggersAnimation2 }