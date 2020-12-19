let sharkFinTable;

function sharkFin(x) {
    if (x < 0) return 0;
    x = x * 2 % 2 + 0.05;
    if (x < 1) {
        return 1 + Math.log(x) / 4;
    }
    return Math.pow(-x, -2);
}

function sharkFinInit() {
    let sharkFinArray = new Float32Array(196);
    for (let i = 0; i < sharkFinArray.length; i++) {
        sharkFinArray[i] = sharkFin(i / 200);
    }

    let ft = new DFT(sharkFinArray.length);
    ft.forward(sharkFinArray);
    sharkFinTable = audioContext.createPeriodicWave(ft.real, ft.imag);

    // let testArray = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // let ft = new DFT(testArray.length);
    // ft.forward(testArray);
    // sharkFinTable = audioContext.createPeriodicWave(ft.real, ft.imag);
}