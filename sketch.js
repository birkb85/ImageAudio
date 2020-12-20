let customReal = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
let customImag = new Float32Array(customReal.length);
let customTable = audioContext.createPeriodicWave(customReal, customImag);

let randomReal;
let randomImag;
let randomTable;

let buffer;
let result;
let lines;
let w = 640, h = 480;

let imageWaveformArray;
let imageWaveformTable;

function setup() {
    // frameRate(10);

    canvas = createCanvas(w, h, P2D);
    canvas.parent('sketch-holder');

    // slider = createSlider(2, 20, 2);

    capture = createCapture(VIDEO);
    capture.size(w, h);
    capture.hide();

    buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);

    noFill();
    strokeWeight(4);

    // sharkFinInit();
}

function draw() {
    // background(200, 200, 200);

    image(capture, 0, 0, capture.width, capture.height);
    // image(capture, 0, 0, width, width * (capture.height / capture.width));

    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!        
        let blurSize = 8;//30;
        let lowThreshold = 38;//15;
        let highThreshold = 64;//25;

        // blurSize = map(blurSize, 0, 100, 1, 12);
        // lowThreshold = map(lowThreshold, 0, 100, 0, 255);
        // highThreshold = map(highThreshold, 0, 100, 0, 255);

        jsfeat.imgproc.grayscale(capture.pixels, w, h, buffer);
        jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
        jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
        // result = jsfeatToP5(buffer, result);
        // image(result, 0, 0, w, h);
        calcImageWaveform(buffer);
        drawImageWaveform();
        setImageWaveformTable();
    }

    if (isPlaying) {
        analyser.getFloatTimeDomainData(waveform);
    }
    if (waveform.length > 0) {
        stroke('red');
        beginShape();
        let waveformW = waveform.length / w;
        for (let i = 0; i < waveform.length; i++) {
            let x = i / waveformW;//8;
            let y = (height / 2) + (waveform[i] * 200);
            vertex(x, y);
        }
        endShape();
    }
}

function calcImageWaveform(src) {
    imageWaveformArray = new Int16Array(w);
    let imageWaveformCalcArray = new Float32Array(w);
    let prevY = src.rows / 2;

    for (let x = 0; x < src.cols; x++) {
        for (let y = 0; y < src.rows; y++) {
            let color = src.data[x + (y * src.cols)];
            if (color == 255) {
                imageWaveformArray[x] = y;
                imageWaveformCalcArray[x] = 1 - (y / src.rows);
                prevY = y;
                break;
            } else if (y == (src.rows - 1)) {
                imageWaveformArray[x] = prevY;
                imageWaveformCalcArray[x] = 1 - (prevY / src.rows);
            }
        }
    }

    let ft = new DFT(imageWaveformCalcArray.length);
    ft.forward(imageWaveformCalcArray);
    imageWaveformTable = audioContext.createPeriodicWave(ft.real, ft.imag);
}

function drawImageWaveform() {
    stroke('black');
    beginShape();
    for (let x = 0; x < imageWaveformArray.length; x++) {
        vertex(x, imageWaveformArray[x]);
    }
    endShape();
}

// // convert grayscale jsfeat image to p5 rgba image
// // usage: dst = jsfeatToP5(src, dst)
// function jsfeatToP5(src, dst) {
//     if (!dst || dst.width != src.cols || dst.height != src.rows) {
//         dst = createImage(src.cols, src.rows);
//     }
//     let n = src.data.length;
//     dst.loadPixels();
//     let srcData = src.data;
//     let dstData = dst.pixels;
//     for (let i = 0, j = 0; i < n; i++) {
//         let cur = srcData[i];
//         // Normal conversion:
//         // dstData[j++] = cur;
//         // dstData[j++] = cur;
//         // dstData[j++] = cur;
//         // dstData[j++] = 255;

//         // Changed to my situation:
//         dstData[j++] = 0;
//         dstData[j++] = 0;
//         dstData[j++] = 0;
//         if (cur == 0) {
//             dstData[j++] = 0;
//         } else if (cur == 255) {
//             dstData[j++] = 255;
//         }
//     }
//     dst.updatePixels();
//     return dst;
// }

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

function setImageWaveformTable() {
    if (isPlaying) {
        lfo.setPeriodicWave(imageWaveformTable);
    }
}

// function play() {
//     osc = audioContext.createOscillator();
//     osc.setPeriodicWave(imageWaveformTable);
//     osc.frequency.value = 160;

//     osc.connect(audioContext.destination);

//     analyser.fftSize = 2048;
//     osc.connect(analyser);
//     waveform = new Float32Array(analyser.frequencyBinCount);

//     osc.start(0);
// }

// function stop() {
//     osc.disconnect();
// }

function play() {
    osc = audioContext.createOscillator();
    osc.frequency.value = 600;//1200;//160;

    lfo = audioContext.createOscillator();
    lfo.setPeriodicWave(imageWaveformTable);
    lfo.frequency.value = 0.2;//1 / 0.380;

    let lfoGain = audioContext.createGain();
    lfoGain.gain.value = 2000;//450;

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