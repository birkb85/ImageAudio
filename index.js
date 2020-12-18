let audioContext = new AudioContext();
let osc = audioContext.createOscillator();

let hornReal = new Float32Array([0, 0.4, 0.4, 1, 1, 1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8]);
let hornImag = new Float32Array(hornReal.length);
let hornTable = audioContext.createPeriodicWave(hornReal, hornImag);

let sinReal = new Float32Array([1, -1]);
let sinImag = new Float32Array(sinReal.length);
let sinTable = audioContext.createPeriodicWave(sinReal, sinImag);

let randomReal = new Float32Array(10);
let randomImag;
let randomTable;

let isPlaying = false;

function toggle() {
    let button = document.getElementById("button");
    if (!isPlaying) {
        isPlaying = true;
        button.innerText = "Stop";
        randomize();
        play();
    } else {
        isPlaying = false;
        button.innerText = "Play";
        stop();
    }
}

function randomize() {
    for (let i = 1; i < randomReal.length; i++) {
        randomReal[i] = Math.random() * 2 - 1;
    }
    randomImag = new Float32Array(randomReal.length);
    randomTable = audioContext.createPeriodicWave(randomReal, randomImag);
}

function play() {
    osc = audioContext.createOscillator();
    osc.setPeriodicWave(randomTable);
    osc.frequency.value = 160;
    osc.connect(audioContext.destination);
    osc.start(0);
}

function stop() {
    osc.disconnect();
}