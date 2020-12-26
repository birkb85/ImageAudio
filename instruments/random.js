// let randomReal;
// let randomImag;
// let randomTable;

// this.customReal = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
// this.customImag = new Float32Array(this.customReal.length);
// this.customTable = audioContext.createPeriodicWave(this.customReal, this.customImag);

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