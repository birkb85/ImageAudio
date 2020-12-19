let audioContext = new AudioContext();
let osc = audioContext.createOscillator();
let lfo = audioContext.createOscillator();
let analyser = audioContext.createAnalyser();
let waveform = new Float32Array();

let isPlaying = false;

let canvas;
let capture;

// let slider;