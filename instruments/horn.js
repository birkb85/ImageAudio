// let hornReal = new Float32Array([0, 0.4, 0.4, 1, 1, 1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8]);
// let hornImag = new Float32Array(hornReal.length);
// let hornTable = audioContext.createPeriodicWave(hornReal, hornImag);

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