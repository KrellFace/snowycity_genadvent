class Door {

    constructor(x, y, num, date) {

        this.x = x;
        this.y = y;
        this.num = num;
        this.date = date;

        this.doorSize = 100;
        this.doorSpacing = 140;

        this.xPos = x * this.doorSpacing + this.doorSpacing/2;
        this.yPos = y * this.doorSpacing + this.doorSpacing/2;

        this.hovering = false;
        this.clicked = false;
        this.openAmount = 0;

        this.ready = this.date < days.length;
    }

    update() {

        if (!this.ready) return;

        if (!this.clicked) this.checkHover();
    }

    checkHover() {

        let w = this.doorSize/2;

        this.hovering = false;

        if ((mouseX > this.xPos-w && mouseX < this.xPos+w) && (mouseY > this.yPos-w && mouseY < this.yPos+w)) {
            this.hovering = true;
        }
    }

    checkClick() {

        if (!this.hovering) return;

        if (!this.clicked) {

            this.clicked = true;
            homepage.enteringDoor = true;
            homepage.currentDoor = this;
        }
    }

    display() {

        push();

        rectMode(CORNERS);
        noStroke();
        textAlign(CENTER, CENTER);

        translate(this.xPos*homepage.zoom, this.yPos*homepage.zoom);
        if (this.hovering) fill(150);
        else if (this.ready) fill(100);
        else fill(25);
        let quarter = this.doorSize*homepage.zoom/2;

        if (this.openAmount == 0) {
            rect(-quarter, -quarter, quarter, quarter);
        } else {
            rect(-quarter, -quarter, -quarter*this.openAmount, quarter);
            rect(quarter*this.openAmount, -quarter, quarter, quarter);
        }

        if (this.ready) {

            fill(0, homepage.doorDateAlpha*255);
            textSize(25);
            text(this.date == 0 ? "X" : this.date, 0, 0);
            fill(50, homepage.doorDateAlpha*255);
            textSize(15);
            rectMode(CENTER);
            text(days[this.date].label, 0, 30, this.doorSize);
        }
        pop();
    }
}