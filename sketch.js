let audioContext = new AudioContext();
let osc = audioContext.createOscillator();
let analyser = audioContext.createAnalyser();
let waveform = new Float32Array();

let hornReal = new Float32Array([0, 0.4, 0.4, 1, 1, 1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8]);
let hornImag = new Float32Array(hornReal.length);
let hornTable = audioContext.createPeriodicWave(hornReal, hornImag);

let sinReal = new Float32Array([0, 1]);
let sinImag = new Float32Array(sinReal.length);
let sinTable = audioContext.createPeriodicWave(sinReal, sinImag);

let randomLength = 3;//12;
let randomReal = new Float32Array(randomLength);
let randomImag = new Float32Array(randomLength);
let randomTable;

let isPlaying = false;

let canvas;
let capture;

function setup() {
    canvas = createCanvas(640, 480, P2D);
    canvas.parent('sketch-holder');

    // capture = createCapture(VIDEO);
    // capture.size(640, 480);
    // capture.hide();

    randomize();
}

function draw() {
    background(200, 200, 200);

    // image(capture, 0, 0, 640, 480);
    // filter(INVERT);

    if (isPlaying) {
        analyser.getFloatTimeDomainData(waveform);
        noFill();
        translate(0, height / 4);
        beginShape();
        for (let i = 0; i < waveform.length; i++) {
            let x = i;
            let y = (0.5 + (waveform[i] / 2)) * (height / 2);
            vertex(x, y);
        }
        endShape();
    }
}

function randomize() {
    for (let i = 1; i < randomLength; i++) {
        randomReal[i] = 1;//Math.random() * 2 - 1;
        randomImag[i] = 0;
    }
    randomTable = audioContext.createPeriodicWave(randomReal, randomImag);
}

function toggle() {
    let button = document.getElementById("button");
    if (!isPlaying) {
        button.innerText = "Stop";
        // randomize();
        play();
        isPlaying = true;
    } else {
        isPlaying = false;
        button.innerText = "Play";
        stop();
    }
}

function play() {
    osc = audioContext.createOscillator();
    osc.setPeriodicWave(hornTable);
    osc.frequency.value = 160;//160;
    osc.connect(audioContext.destination);
    osc.connect(analyser);
    waveform = new Float32Array(analyser.frequencyBinCount);
    osc.start(0);
}

function stop() {
    osc.disconnect();
}