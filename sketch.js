let edge = new Edge();

function setup() {
    canvas = createCanvas(w, h, P2D);
    canvas.parent('sketch-holder');

    let constraints = {
        video: {
            mandatory: {
                maxWidth: 640, // TODO BB 320. Of tilpas til mobil enheder og skiftende opløsning.
                maxHeight: 640
            },
            optional: [{ maxFrameRate: 10 }]
        },
        audio: false
    };
    capture = createCapture(constraints);
    capture.hide();

    noFill();
    strokeWeight(4);
}

function draw() {
    edge.draw();
}

function toggle() {
    let button = document.getElementById("button");
    if (!isPlaying) {
        button.innerText = "Stop";
        edge.play();
        isPlaying = true;
    } else {
        isPlaying = false;
        button.innerText = "Play";
        edge.stop();
    }
}