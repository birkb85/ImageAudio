let edge = new Edge();

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, P2D);
    canvas.parent('sketch-holder');

    initCapture();

    noFill();
    strokeWeight(4);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    initCapture();
}

function initCapture() {
    // TODO BB https://github.com/processing/p5.js/issues/1496
    let constraints = {
        video: {
            facingMode: "environment"//,
            // width: 320,
            // height: 640
            // mandatory: {
            //     maxWidth: 640, // TODO BB 320. Of tilpas til mobil enheder og skiftende opløsning.
            //     maxHeight: 640
            // },
            // optional: [{ maxFrameRate: 10 }]
        },
        audio: false
    };
    capture = createCapture(constraints);
    capture.hide();
}

function draw() {
    edge.draw();
}

function touchStarted(event) {
    // console.log(event);

    toggle();
}

function toggle() {
    // let button = document.getElementById("button");
    if (!isPlaying) {
        // button.innerText = "Stop";
        edge.play();
        isPlaying = true;
    } else {
        isPlaying = false;
        // button.innerText = "Play";
        edge.stop();
    }
}