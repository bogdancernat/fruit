var app = (function (root) {
    "use strict";
    var x = {},
        canvas = null,
        context = null,
        center = {x: 0, y: 0},
        color = (new root.RColor()).get(false, 0.739, 0.54),
        radius = 60,
        layers = [],
        usedCenters = [];

    x.ignite = function () {
        canvas = document.querySelector('#main-canvas');
        context = canvas.getContext('2d');
        this.updateSizes();
        this.draw();
    };

    x.updateSizes = function () {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        center.x = canvas.width / 2;
        center.y = canvas.height / 2;
        layers = [];
        usedCenters = [];
    };
    
    x.drawCircle = function (coords, radius) {
//        color = (new root.RColor()).get(false, 0.739, 0.54);

        context.lineWidth = 1;
        context.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',1)';
        context.beginPath();
        context.arc(coords.x, coords.y, radius, 0, Math.PI * 2, true);
        context.stroke();
        context.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',0.25)';
        context.fill();
        context.closePath();
    };
    
    x.animate = function () {
        root.tb.animationFrame(this.animate);
        this.draw();
    };
    
    x.draw = function () {
        var splitsAngle = 15,
            splits = 360 / splitsAngle,
            i,
            j,
            layer;
        
        layers = [];
        usedCenters = [];
        /* add root circle */
        layers.push([{c: center, r: radius}]);
        usedCenters.push(center);
        
        /* init first-layer */
        layer = [];
        layer.push({c: root.tb.getCoordsOnCircle(0, radius, center), r: radius});
        usedCenters.push(root.tb.getCoordsOnCircle(0, radius, center));
        
        for (i = 0; i < 5; i += 1) {
            var candidat = this.getNextCircleCenter(layers[0][0], layer[layer.length - 1]);
            layer.push({
                c: candidat,
                r: radius
            });
            usedCenters.push(candidat);
        }
        layers.push(layer);

//        draw second layer
        for (j = 0; j < 3; j += 1) {
            layer = [];
            var layer2 = [];
            var nrOfCircles = 6;
            for (i = 0; i < nrOfCircles; i += 1) {
                var a = layers[layers.length - 1][i],
                    b = layers[layers.length - 1][(i + 1) % nrOfCircles],
                    c = null,
                    candidat = null;
                
                if (j == 2) {
                    a = layers[layers.length - 2][i];
                    b = layers[layers.length - 1][i];
                    c = layers[layers.length - 2][(i + 1) % 6]
                    
                    candidat = this.getNextCircleCenter(c, b);

                    layer2.push({
                        c: candidat,
                        r: radius
                    });
                    usedCenters.push(candidat);
                }
                candidat = this.getNextCircleCenter(a, b);

                layer.push({
                    c: candidat,
                    r: radius
                });
                usedCenters.push(candidat);
            }
            
            layers.push(layer);
            if(layer2.length) {
                layers.push(layer2);
            }

        }
        
        root.console.log(layers);
        for (i = 0; i < layers.length; i += 1) {
            for (j = 0; j < layers[i].length; j += 1) {
                this.drawCircle(layers[i][j].c, layers[i][j].r);
            }
        }
    };
    
    x.getNextCircleCenter = function (C1, C2) {
        var d = root.tb.distAB(C1.c, C2.c),
            delta = null,
            x_a = 0,
            x_b = 0,
            y_a = 0,
            y_b = 0,
            p1 = null,
            p2 = null;
        delta = (1 / 4) * Math.sqrt((d + C1.r + C2.r) * (d + C1.r - C2.r) * (d - C1.r + C2.r) * (-d + C1.r + C2.r));
        
        x_a = (C1.c.x + C2.c.x) / 2 + ((C2.c.x - C1.c.x) * (Math.pow(C1.r, 2) - Math.pow(C2.r, 2)) / (2 * Math.pow(d, 2)));
        x_b = 2 * ((C1.c.y - C2.c.y) / Math.pow(d, 2)) * delta;
        
        y_a = (C1.c.y + C2.c.y) / 2 + ((C2.c.y - C1.c.y) * (Math.pow(C1.r, 2) - Math.pow(C2.r, 2)) / (2 * Math.pow(d, 2)));
        y_b = 2 * ((C1.c.x - C2.c.x) / Math.pow(d, 2)) * delta;
        
        p1 = {
            x: x_a - x_b,
            y: y_a + y_b
        };
        
        p2 = {
            x: x_a + x_b,
            y: y_a - y_b
        };
        
        if (this.isUsedCircleCenter(p1)) {
            return p2;
        }
        return p1;
    };
    
    x.isUsedCircleCenter = function (point) {
        var i = null,
            c = null;
        for (i = usedCenters.length - 1; i >= 0; i -= 1) {
            c = usedCenters[i];
            if (Math.floor(c.x) === Math.floor(point.x) && Math.floor(c.y) === Math.floor(point.y)) {
                return true;
            }
        }
        return false;
    };
    
    return x;
}(window));

window.onload = function () {
    "use strict";
    app.ignite();
};
window.onresize = function () {
    "use strict";
    app.updateSizes();
    app.draw();
};