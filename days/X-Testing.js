// Made by Firstname Lastname (keep this line and replace with your name)
pg = null
ng = null
function dayXPreload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
}

class DayX extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Firstname Lastname"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        pg =createGraphics(200, 200);
        ng =createGraphics(200, 200);
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
        
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

        pg.background(100);
        pg.noStroke();
        pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
        image(pg, 50, 50);
        image(pg, 0, 0, 50, 50);

        ng.background(100);
        ng.noStroke();
        ng.ellipse(pg.width / 2, pg.height / 2, 30, 30);
        image(ng, 30, 30);
        image(ng, 0, 0, 50, 50);
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {

    }

    mouseReleased() {

    }

    keyPressed() {

    }

    keyReleased() {

    }

    // Below is the basic setup for a nested class. This can be deleted or renamed

    HelperClass = class {

        constructor() {

        }
    }
}