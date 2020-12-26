let edge = new Edge();

function setup() {
    canvas = createCanvas(w, h, P2D);
    canvas.parent('sketch-holder');

    capture = createCapture(VIDEO);
    capture.size(w, h);
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