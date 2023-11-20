let today = 0;

let days = [];
let totalDays = 3;

let assets = {};

let homepage;
let body, controlsText, creditsText;
let canvas;
let noLoopCanvas;

function preload() {

    for (let i = 0; i < totalDays; i++) {
        let n = i == 0 ? "X" : i;
        eval("day"+ n +"Preload()");
    }
}

function setup() {

    canvas = createCanvas(700, 700);
    canvas.parent("canvas-wrapper");
    noLoopCanvas = createGraphics(width, height);

    resetModes();

    // allSprites.autoDraw = false;
    // allSprites.autoUpdate = false;
    // world.autoStep = false;

    body = select("body");
    controlsText = select("#controls");
    creditsText = select("#credits");

    bodyColours = {
        unhover: color("#111"),
        hover: color("#969696"),
        current: color("#111"),
        step: 0,
        duration: 20,
    };

    createDays();
    changeDay(today);

    homepage = new Homepage();
}

function draw() {

    if (!homepage.visible || (homepage.visible && homepage.doorOpen)) {

        if (days[today].loop) {
            push();
            days[today].update();
            pop();
            autoPlayP5Play();
            resetModes();
        } else if (homepage.enteringDoor || homepage.exitingDoor) {
            image(noLoopCanvas, 0, 0, width, height);
        }
    }

    if (homepage.visible) {
        homepage.update();
        homepage.display();
    }

    updatePageBackground();
    resetModes();
}

function createDays() {

    for (let i = 0; i < totalDays; i++) {
        let n = i == 0 ? "X" : i;
        eval("days.push(new Day"+ n +"())");
    }
}

function changeDay(date) {

    // if (today == date) return;

    today = date;

    resetP5Play();

    clear();

    push();
    days[today].prerun();
    pop();
    resetModes();

    if (!days[today].loop) {
        push();
        days[today].update();
        pop();
        noLoopCanvas.image(canvas, 0, 0, width, height);
    }
}

function resetModes() {

    colorMode(RGB, 255);
    ellipseMode(CENTER);
    rectMode(CORNER);
    blendMode(BLEND);
    imageMode(CORNER);
    angleMode(RADIANS);
    textureMode(IMAGE);
}

function autoPlayP5Play() {

    return;

    if (days[today].autoPlayP5Play) {
        camera.on();
        allSprites.draw();
        world.step()
        allSprites.update();
        camera.off();
    }
}

function resetP5Play() {

    return;

    allSprites.removeAll();
    world.gravity.x = 0;
    world.gravity.y = 0;
    world.allowSleeping = true;
}

function setupGrammar(grammarSource) {

    let grammar = tracery.createGrammar(grammarSource);
    grammar.addModifiers(tracery.baseEngModifiers);

    return grammar;
}

function getText(grammar) {

    return grammar.flatten("#origin#");
}

function updateInfo(day) {

    if (day == -1) {
        controlsText.html("");
        creditsText.html("");
    } else {
        controlsText.html(day.controls);
        creditsText.html(day.credits);
    }
}

function updatePageBackground() {

    bodyColours.current = lerpColor(bodyColours.unhover, bodyColours.hover, bodyColours.step/bodyColours.duration);

    if (!homepage.visible && (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)) {
        if (bodyColours.step < bodyColours.duration) bodyColours.step++;
    } else {
        if (bodyColours.step > 0) bodyColours.step--;
    }

    body.style("background-color", bodyColours.current);
}

function mousePressed() {

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {

        if (!homepage.visible) {
            homepage.visible = true;
            homepage.exitingDoor = true;
            bodyColours.step = bodyColours.duration + 20;
        }
        return;
    }

    if (homepage.visible) homepage.checkDoorClick();
    else days[today].mousePressed();
}

function mouseReleased() {

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    days[today].mouseReleased();
}

function keyPressed() {

    if (!homepage.visible || (homepage.visible && homepage.doorOpen)) days[today].keyPressed();
}

function keyReleased() {

    if (!homepage.visible || (homepage.visible && homepage.doorOpen)) days[today].keyReleased();
}