//공용 변수 관리를 위해 만든 코드

export const SyntheysizerEvents = window;

export const note_set = {
  pitch: 0,
  note: 0,
  value: 0
};

export const pad_set = {
  id: 0,
};

export const dial_set = {
  value: [[0.0, 0.0, 0.0, 0.0],  //순서대로 [[11, 12, 13, 14],
          [0.0, 0.0, 0.0, 0.0]]   //순서대로  [21, 22, 23, 24]]
}; 

export const joystick_set = {
  value:[0, 0]
};
