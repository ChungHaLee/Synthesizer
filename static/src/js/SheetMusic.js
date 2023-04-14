import { SyntheysizerEvents} from './Share.js';

SyntheysizerEvents.addEventListener('noteInput', function (e){
  // console.log("In Circle note: ", e.detail.note);  //범위가 C0~C10입니다.
  //console.log("In SheetMusic note: ", e.detail.pitch, 'noteInput'); //범위가 0~127입니다.

  // console.log("In Circle note: ", e.detail.value); //범위가 0~127입니다.
})
SyntheysizerEvents.addEventListener('noteRelease', function (e){
  // console.log("In Circle note: ", e.detail.note);  //범위가 C0~C10입니다.
  //console.log("In SheetMusic note: ", e.detail.pitch, 'noteRelease'); //범위가 0~127입니다.

  // console.log("In Circle note: ", e.detail.value); //범위가 0~127입니다.
})

SyntheysizerEvents.addEventListener('padInput', function (e){
  //console.log("In SheetMusic Pad id: ", e.detail.id); //그냥 패드 id입니다. 0~7로 8개가 표시됩니다.
})
