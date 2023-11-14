class Homepage {

    constructor() {

        this.doorOrder = [
            8, 21, 23, 0, 4,
            13, 10, 2, 15, 14,
            6, 12, 5, 17, 19,
            7, 11, 9, 20, 24,
            3, 18, 22, 1, 16
        ];
        this.doors = [];

        for (let i = 0; i < this.doorOrder.length; i++) {

            this.doors.push(new Door(i%5, int(i/5), i, this.doorOrder[i]));
        }

        this.originX = width/2;
        this.originY = height/2;
        this.cameraX = width/2;
        this.cameraY = height/2;
        this.zoom = 1;
        this.minZoom = 1;
        this.maxZoom = width/100;

        this.visible = true;
        this.currentDoor = -1;
        this.enteringDoor = false;
        this.exitingDoor = false;
        this.doorOpen = false;

        this.doorDateAlpha = 1;

        this.defaultOpenOnX();
    }

    defaultOpenOnX() {

        this.visible = false;
        this.doorDateAlpha = 0;
        this.zoom = this.maxZoom;
        this.doorOpen = true;

        this.currentDoor = this.doors[this.doorOrder.findIndex((e) => e == today)];
        this.currentDoor.hovering = 1;
        this.currentDoor.openAmount = 1;
        this.cameraX = this.currentDoor.xPos;
        this.cameraY = this.currentDoor.yPos;

        updateInfo(days[today]);
    }

    update() {

        if (this.enteringDoor) this.enterDoor();
        else if (this.exitingDoor) this.exitDoor();

        if (this.enteringDoor || this.exitingDoor) return;

        for (let i = 0; i < this.doors.length; i++) {
            this.doors[i].update();
        }
    }

    checkDoorClick() {

        if (this.enteringDoor || this.exitingDoor) return;

        for (let i = 0; i < this.doors.length; i++) {
            this.doors[i].checkClick();
        }
    }

    enterDoor() {

        let door = this.currentDoor;

        if (dist(this.cameraX, this.cameraY, door.xPos, door.yPos) > 0) {

            this.cameraX = lerp(this.cameraX, door.xPos, 0.1);
            this.cameraY = lerp(this.cameraY, door.yPos, 0.1);
            this.doorDateAlpha = lerp(this.doorDateAlpha, 0, 0.1);

            if (dist(this.cameraX, this.cameraY, door.xPos, door.yPos) < 3) {
                this.cameraX = door.xPos;
                this.cameraY = door.yPos;
                this.doorDateAlpha = 0;
            }

        } else if (dist(this.cameraX, this.cameraY, door.xPos, door.yPos) == 0 && this.maxZoom - this.zoom > 0) {

            this.zoom = lerp(this.zoom, this.maxZoom, 0.1);
            if (this.maxZoom - this.zoom < 0.01) {

                this.zoom = this.maxZoom;

                changeDay(door.date);
                this.doorOpen = true;
                updateInfo(days[door.date]);
            }

        } else if (this.maxZoom == this.zoom) {

            door.openAmount = lerp(door.openAmount, 1, 0.1);
            if (door.openAmount > 0.99) {
                door.openAmount = 1;
                this.enteringDoor = false;
                this.visible = false;
            }
        }
    }

    exitDoor() {

        let door = this.currentDoor;

        if (door.openAmount != 0) {

            door.openAmount = lerp(door.openAmount, 0, 0.1);
            if (door.openAmount < 0.001) {
                door.openAmount = 0;
                this.doorOpen = false;
                updateInfo(-1);
            }

        } else if (door.openAmount == 0 && this.zoom-this.minZoom > 0) {

            this.zoom = lerp(this.zoom, this.minZoom, 0.1);
            if (this.zoom - this.minZoom < 0.01) this.zoom = this.minZoom;

        } else if (this.zoom == this.minZoom) {

            this.cameraX = lerp(this.cameraX, this.originX, 0.1);
            this.cameraY = lerp(this.cameraY, this.originY, 0.1);
            this.doorDateAlpha = lerp(this.doorDateAlpha, 1, 0.1);

            if (this.doorDateAlpha > 0.999) {

                this.cameraX = this.originX;
                this.cameraY = this.originY;
                this.doorDateAlpha = 1;

                door.clicked = false;
                this.exitingDoor = false;
                this.currentDoor = -1;
            }
        }
    }

    display() {

        push();

        translate(width/2, height/2);
        translate(-this.cameraX*homepage.zoom, -this.cameraY*homepage.zoom);

        if (this.zoom != this.maxZoom) background("#111");

        for (let i = 0; i < this.doors.length; i++) {
            this.doors[i].display();
        }

        pop();
    }
}