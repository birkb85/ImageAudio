class Edge {
    constructor() {
        this.buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);
        this.result;

        this.imageWaveformArray;
        this.imageWaveformTable;
    }

    draw() {
        // background(200, 200, 200);

        image(capture, 0, 0, w, h);
        // image(capture, 0, 0, width, width * (capture.height / capture.width));

        capture.loadPixels();
        if (capture.pixels.length > 0) { // don't forget this!        
            let blurSize = 8;//30;
            let lowThreshold = 38;//15;
            let highThreshold = 64;//25;

            // blurSize = map(blurSize, 0, 100, 1, 12);
            // lowThreshold = map(lowThreshold, 0, 100, 0, 255);
            // highThreshold = map(highThreshold, 0, 100, 0, 255);

            jsfeat.imgproc.grayscale(capture.pixels, w, h, this.buffer);
            jsfeat.imgproc.gaussian_blur(this.buffer, this.buffer, blurSize, 0);
            jsfeat.imgproc.canny(this.buffer, this.buffer, lowThreshold, highThreshold);
            // this.result = jsfeatToP5(this.buffer, this.result);
            // image(this.result, 0, 0, w, h);
            this.calcImageWaveform(this.buffer);
            this.drawImageWaveform();
            this.setImageWaveformTable();
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

    calcImageWaveform(src) {
        this.imageWaveformArray = new Int16Array(w);
        let imageWaveformCalcArray = new Float32Array(w);
        let prevY = src.rows / 2;
    
        for (let x = 0; x < src.cols; x++) {
            for (let y = 0; y < src.rows; y++) {
                let color = src.data[x + (y * src.cols)];
                if (color == 255) {
                    this.imageWaveformArray[x] = y;
                    imageWaveformCalcArray[x] = 1 - (y / src.rows);
                    prevY = y;
                    break;
                } else if (y == (src.rows - 1)) {
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
    
    // // convert grayscale jsfeat image to p5 rgba image
    // // usage: dst = jsfeatToP5(src, dst)
    // jsfeatToP5(src, dst) {
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

    setImageWaveformTable() {
        if (isPlaying) {
            lfo.setPeriodicWave(this.imageWaveformTable);
        }
    }
    
    play() {
        osc = audioContext.createOscillator();
        osc.frequency.value = 600;//1200;//160;
    
        lfo = audioContext.createOscillator();
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