let customReal = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
let customImag = new Float32Array(customReal.length);
let customTable = audioContext.createPeriodicWave(customReal, customImag);

let randomReal;
let randomImag;
let randomTable;

function setup() {
    canvas = createCanvas(1024, 480, P2D);
    canvas.parent('sketch-holder');

    // slider = createSlider(2, 20, 2);

    // capture = createCapture(VIDEO);
    // capture.size(640, 480);
    // capture.hide();

    sharkFinInit();
}

function draw() {
    // image(capture, 0, 0, 640, 480);
    // filter(INVERT);

    if (isPlaying) {
        background(200, 200, 200);

        analyser.getFloatTimeDomainData(waveform);
        noFill();
        beginShape();
        for (let i = 0; i < waveform.length; i++) {
            let x = i/8;
            let y = (height / 2) + (waveform[i] * 200);
            vertex(x, y);
        }
        endShape();
    }
}

function toggle() {
    let button = document.getElementById("button");
    if (!isPlaying) {
        button.innerText = "Stop";
        // initRandom();
        play();
        isPlaying = true;
    } else {
        isPlaying = false;
        button.innerText = "Play";
        stop();
    }
}

// function initRandom() {
//     let randomLength = slider.value();//12;
//     randomReal = new Float32Array(randomLength);
//     randomImag = new Float32Array(randomLength);
//     let x = 0;
//     let y = 0;
//     for (let i = 1; i < randomLength; i++) {
//         let n = i * 2 - 1;
//         let radius = 50 * (4 / (n * PI));
//         x += radius * cos(n * 160);
//         y += radius * sin(n * 160);
//         randomReal[i] = x;
//         randomImag[i] = y;
//     }
//     randomTable = audioContext.createPeriodicWave(randomReal, randomImag);
// }

function play() {
    osc = audioContext.createOscillator();
    osc.frequency.value = 1200;//160;

    lfo = audioContext.createOscillator();
    lfo.setPeriodicWave(sharkFinTable);
    lfo.frequency.value = 1 / 0.380;

    let lfoGain = audioContext.createGain();
    lfoGain.gain.value = 450;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(audioContext.destination);

    analyser.fftSize = 16384;//2048;
    lfo.connect(analyser);
    waveform = new Float32Array(analyser.frequencyBinCount);

    osc.start(0);
    lfo.start(0);
}

function stop() {
    osc.disconnect();
    lfo.disconnect();
}