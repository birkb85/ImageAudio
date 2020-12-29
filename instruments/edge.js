// For calculating real and imag values: https://github.com/corbanbrook/dsp.js/
// Edge detection example for p5js: https://editor.p5js.org/aatish/sketches/SJoT7GDtf

class Edge {
    constructor() {
        this.audioContext = new AudioContext();
        this.osc = this.audioContext.createOscillator();
        this.lfo = this.audioContext.createOscillator();
        this.analyser = this.audioContext.createAnalyser();
        this.waveform = new Float32Array();

        this.imageWaveformArray;
        this.imageWaveformTable;
    }

    draw() {
        background(200);

        let captureRatio = capture.width / capture.height;
        let canvasRatio = width / height;
        let captureX = 0;
        let captureY = 0;
        let captureWidth = width;
        let captureHeight = height;
        if (captureRatio < canvasRatio) {
            captureWidth = height * captureRatio;
            captureX = (width - captureWidth) / 2;
        } else {
            captureHeight = width / captureRatio;
            captureY = (height - captureHeight) / 2;
        }

        image(capture, captureX, captureY, captureWidth, captureHeight);

        capture.loadPixels();
        if (capture.pixels.length > 0) {
            let blurSize = 8;
            let lowThreshold = 60;//38;
            let highThreshold = 0;//64;

            // blurSize = map(blurSize, 0, 100, 1, 12);
            // lowThreshold = map(lowThreshold, 0, 100, 0, 255);
            // highThreshold = map(highThreshold, 0, 100, 0, 255);

            let buffer = new jsfeat.matrix_t(capture.width, capture.height, jsfeat.U8C1_t);
            jsfeat.imgproc.grayscale(capture.pixels, capture.width, capture.height, buffer);
            jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
            jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);

            let result;
            result = this.jsfeatToP5(buffer, result);
            image(result, captureX, captureY, captureWidth, captureHeight);

            this.calcImageWaveform(buffer);
            this.drawImageWaveform(captureX, captureY, captureWidth);
            this.setImageWaveformTable();
        }

        if (isPlaying) {
            this.analyser.getFloatTimeDomainData(this.waveform);
        }
        if (this.waveform.length > 0) {
            stroke('red');
            beginShape();
            let waveformW = this.waveform.length / width;
            for (let i = 0; i < this.waveform.length; i++) {
                let x = i / waveformW;//8;
                let y = (height / 2) + (this.waveform[i] * (height / 2));
                vertex(x, y);
            }
            endShape();
        }
    }

    calcImageWaveform(src) {
        this.imageWaveformArray = new Int16Array(src.cols);
        let imageWaveformCalcArray = new Float32Array(src.cols);
        let prevY = src.rows / 2;
    
        for (let x = 0; x < src.cols; x++) {
            for (let row = 0; row < src.rows / 2; row++) {
                let yUp = (src.rows / 2) - 1 - row;
                let yDown = (src.rows / 2) + row;

                let colorUp = src.data[x + (yUp * src.cols)];
                if (colorUp == 255) {
                    this.imageWaveformArray[x] = yUp;
                    imageWaveformCalcArray[x] = 1 - (yUp / src.rows);
                    prevY = yUp;
                    break;
                } else if (yUp == 0) {
                    this.imageWaveformArray[x] = prevY;
                    imageWaveformCalcArray[x] = 1 - (prevY / src.rows);
                }

                let colorDown = src.data[x + (yDown * src.cols)];
                if (colorDown == 255) {
                    this.imageWaveformArray[x] = yDown;
                    imageWaveformCalcArray[x] = 1 - (yDown / src.rows);
                    prevY = yDown;
                    break;
                } else if (yDown == (src.rows - 1)) {
                    this.imageWaveformArray[x] = prevY;
                    imageWaveformCalcArray[x] = 1 - (prevY / src.rows);
                }
            }
        }
    
        let ft = new DFT(imageWaveformCalcArray.length);
        ft.forward(imageWaveformCalcArray);
        this.imageWaveformTable = this.audioContext.createPeriodicWave(ft.real, ft.imag);
    }
    
    drawImageWaveform(captureX, captureY, captureWidth) {
        let ratio = captureWidth / this.imageWaveformArray.length;

        stroke('green');
        line(captureX, height / 2, ((this.imageWaveformArray.length - 1) * ratio) + captureX, height / 2);

        stroke('black');
        beginShape();
        for (let x = 0; x < this.imageWaveformArray.length; x++) {
            vertex((x * ratio) + captureX, (this.imageWaveformArray[x] * ratio) + captureY);
        }
        endShape();
    }
    
    // convert grayscale jsfeat image to p5 rgba image
    // usage: dst = jsfeatToP5(src, dst)
    jsfeatToP5(src, dst) {
        if (!dst || dst.width != src.cols || dst.height != src.rows) {
            dst = createImage(src.cols, src.rows);
        }
        let n = src.data.length;
        dst.loadPixels();
        let srcData = src.data;
        let dstData = dst.pixels;
        for (let i = 0, j = 0; i < n; i++) {
            let cur = srcData[i];
            // Normal conversion:
            // dstData[j++] = cur;
            // dstData[j++] = cur;
            // dstData[j++] = cur;
            // dstData[j++] = 255;
    
            // Changed to my situation:
            dstData[j++] = 0;
            dstData[j++] = 0;
            dstData[j++] = 0;
            if (cur == 0) {
                dstData[j++] = 0;
            } else if (cur == 255) {
                dstData[j++] = 255;
            }
        }
        dst.updatePixels();
        return dst;
    }

    setImageWaveformTable() {
        if (isPlaying) {
            if (this.imageWaveformTable) {
                // this.osc.setPeriodicWave(this.imageWaveformTable);
                this.lfo.setPeriodicWave(this.imageWaveformTable);
            }
        }
    }
    
    // play() {
    //     this.osc = this.audioContext.createOscillator();
    //     this.osc.setPeriodicWave(this.imageWaveformTable);
    //     this.osc.frequency.value = 160;

    //     this.osc.connect(this.audioContext.destination);

    //     this.analyser.fftSize = 2048;
    //     this.osc.connect(this.analyser);
    //     this.waveform = new Float32Array(this.analyser.frequencyBinCount);

    //     this.osc.start(0);
    // }

    play() {
        this.osc = this.audioContext.createOscillator();
        this.osc.frequency.value = 600;//1200;//160;

        this.lfo = this.audioContext.createOscillator();
        if (this.imageWaveformTable) {
            this.lfo.setPeriodicWave(this.imageWaveformTable);
        }
        this.lfo.frequency.value = 0.2;//1 / 0.380;

        let lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 2000;//450;

        this.lfo.connect(lfoGain);
        lfoGain.connect(this.osc.frequency);
        this.osc.connect(this.audioContext.destination);

        this.analyser.fftSize = 16384;//2048;
        this.lfo.connect(this.analyser);
        this.waveform = new Float32Array(this.analyser.frequencyBinCount);

        this.osc.start(0);
        this.lfo.start(0);
    }
    
    stop() {
        this.osc.disconnect();
        this.lfo.disconnect();
    }
}