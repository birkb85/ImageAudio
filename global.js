// For calculating real and imag values: https://github.com/corbanbrook/dsp.js/
// Edge detection example for p5js: https://editor.p5js.org/aatish/sketches/SJoT7GDtf

let audioContext = new AudioContext();
let osc = audioContext.createOscillator();
let lfo = audioContext.createOscillator();
let analyser = audioContext.createAnalyser();
let waveform = new Float32Array();

let isPlaying = false;

let canvas;
let capture;

// let slider;