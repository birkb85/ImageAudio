// let sharkFinTable;

// function sharkFin(x) {
//     if (x < 0) return 0;
//     x = x * 2 % 2 + 0.05;
//     if (x < 1) {
//         return 1 + Math.log(x) / 4;
//     }
//     return Math.pow(-x, -2);
// }

// function sharkFinInit() {
//     let sharkFinArray = new Float32Array(200);
//     for (let i = 0; i < sharkFinArray.length; i++) {
//         sharkFinArray[i] = sharkFin(i / 200);
//     }

//     let ft = new DFT(sharkFinArray.length);
//     ft.forward(sharkFinArray);
//     sharkFinTable = audioContext.createPeriodicWave(ft.real, ft.imag);

//     // let testArray = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
//     // let ft = new DFT(testArray.length);
//     // ft.forward(testArray);
//     // sharkFinTable = audioContext.createPeriodicWave(ft.real, ft.imag);
// }

// function play() {
//     osc = audioContext.createOscillator();
//     osc.frequency.value = 1200;

//     lfo = audioContext.createOscillator();
//     lfo.setPeriodicWave(imageWaveformTable);
//     lfo.frequency.value = 0.380;

//     let lfoGain = audioContext.createGain();
//     lfoGain.gain.value = 450;

//     lfo.connect(lfoGain);
//     lfoGain.connect(osc.frequency);
//     osc.connect(audioContext.destination);

//     analyser.fftSize = 16384;//2048;
//     lfo.connect(analyser);
//     waveform = new Float32Array(analyser.frequencyBinCount);

//     osc.start(0);
//     lfo.start(0);
// }

// function stop() {
//     osc.disconnect();
//     lfo.disconnect();
// }