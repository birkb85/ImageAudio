class Edge {
    constructor() {
        this.imageWaveformArray;
        this.imageWaveformTable;
    }

    draw() {
        background(200);

        image(capture, 0, 0, capture.width, capture.height);
        // image(capture, 0, 0, width, width * (capture.height / capture.width));

        capture.loadPixels();
        if (capture.pixels.length > 0) {  
            let blurSize = 8;
            let lowThreshold = 38;
            let highThreshold = 64;

            let buffer = new jsfeat.matrix_t(capture.width, capture.height, jsfeat.U8C1_t);
            jsfeat.imgproc.grayscale(capture.pixels, capture.width, capture.height, buffer);
            jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
            jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
            let result;
            result = this.jsfeatToP5(buffer, result);
            image(result, 0, 0, capture.width, capture.height);
            this.calcImageWaveform(buffer);
            this.drawImageWaveform();
            this.setImageWaveformTable();
        }

        if (isPlaying) {
            analyser.getFloatTimeDomainData(waveform);
        }
        if (waveform.length > 0) {
            stroke('red');
            beginShape();
            let waveformW = waveform.length / width;
            for (let i = 0; i < waveform.length; i++) {
                let x = i / waveformW;//8;
                let y = (height / 2) + (waveform[i] * (height / 2));
                vertex(x, y);
            }
            endShape();
        }
    }

    calcImageWaveform(src) {
        this.imageWaveformArray = new Int16Array(src.cols);
        let imageWaveformCalcArray = new Float32Array(src.rows);
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
        this.imageWaveformTable = audioContext.createPeriodicWave(ft.real, ft.imag);
    }
    
    drawImageWaveform() {
        stroke('black');
        beginShape();
        for (let x = 0; x < this.imageWaveformArray.length; x++) {
            vertex(x, this.imageWaveformArray[x]);
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
            if (this.imageWaveformTable)
                lfo.setPeriodicWave(this.imageWaveformTable);
        }
    }
    
    play() {
        osc = audioContext.createOscillator();
        osc.frequency.value = 600;//1200;//160;
    
        lfo = audioContext.createOscillator();
        if (this.imageWaveformTable)
            lfo.setPeriodicWave(this.imageWaveformTable);
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
    
    stop() {
        osc.disconnect();
        lfo.disconnect();
    }
}