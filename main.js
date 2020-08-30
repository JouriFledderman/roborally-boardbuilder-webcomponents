customElements.define('roborally-tile',
    class extends HTMLElement {
        constructor() {
            super();

            const shadowRoot = this.attachShadow({mode: 'open'});

            const style = document.createElement('style');

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const type = this.getAttribute('type');
            const walls = this.getAttribute('walls');
            const lasers = this.getAttribute('lasers');
            const checkpoint = this.getAttribute('checkpoint') ;

            this.createAndRotateImage(context, 'tiles', type, this.getDegrees(this.getAttribute('direction')));

            if (checkpoint) {
                this.createAndRotateImage(context, 'checkpoints', 'checkpoint-' + checkpoint, 0)
            }

            if (lasers) {
                lasers.split(",")
                    .forEach(direction => {
                        let wallArray = [];
                        if (walls) {
                            wallArray = walls.split(",")
                        }
                        const laserType = wallArray.indexOf(direction) == -1 ? "laser" : "laserWall";
                        this.createAndRotateImage(context, 'laser', laserType, this.getDegrees(direction))
                    })
            }

            if (walls) {
                walls.split(",")
                    .forEach(direction => {
                        this.createAndRotateImage(context, 'walls', 'wall', this.getDegrees(direction), 300, 48)
                })
            }

            canvas.width = 300;
            canvas.height = 300;
            canvas.style.width = "3.08cm";
            canvas.style.height= "3.08cm";

            shadowRoot.appendChild(style);
            shadowRoot.appendChild(canvas);
        }

        getDegrees(direction) {
            if (!direction) {
                return 0;
            }

            switch (direction) {
                case "top":
                    return 0;
                case "right":
                    return 90;
                case "bottom":
                    return 180;
                case "left":
                    return 270;
            }
            throw Error("invalid direction");
        }

        createAndRotateImage(context, type, subtype, degrees, width = 300, height = 300) {
            const image = new Image();
            if (subtype === "plain") {
                subtype = "plain_" + Math.floor(Math.random() * 4);
            }
            image.src = type + '/' + subtype + '.png';
            setTimeout(function() {
                context.save();
                context.translate(150, 150);
                context.rotate(degrees * Math.PI / 180);
                context.translate(-150, -150);
                context.drawImage(image, 0, 0, width, height);
                context.restore();
            }, 100);
        }
    }
);

customElements.define('roborally-board',
    class extends HTMLElement {
        constructor() {
            super();

            const shadowRoot = this.attachShadow({mode: 'open'});
            const table = document.createElement('div');

            const width = this.getAttribute("width");

            const tiles = this.getElementsByTagName("roborally-tile");

            let index = 0;
            let row;
            Array.from(tiles).forEach(tile => {
                if (index % width == 0) {
                    row = document.createElement('span');
                    row.style = "display:block;clear:right;max-height:3.08cm";
                    table.appendChild(row);
                }
                const cell = document.createElement('span');
                cell.appendChild(tile);
                row.appendChild(cell);
                index++;

            });

            shadowRoot.appendChild(table);
        }
    }
);