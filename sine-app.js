var app = (function () {
    var a = {},
        canvas, context, center = {},
        radius, points = [],
        golden = 1.618033988749895,
        canvasBgO = (new RColor).get(false, 0.65, 0.82),
        canvasBg = [].concat(canvasBgO),
        color = (new RColor).get(false, 0.179, 0.194),
        fillColor = (new RColor).get(false, 0.17, 0.6),
        fillColor = (new RColor).get(false, 0.17, 0.6),
        circleLineEnd = {},
        horizontalLineEnd = {},
        verticalHelper = {},
        horizontalHelper = {},
        currentAngle = 0,
        angleIncrement = 3,
        box = {},
        hSineTop = [],
        hSineBottom = [],
        vSineLeft = [],
        vSineRight = [],
        sineSpeed = 0.8,
        playing = false;

    function getRadians(angle) {
        return angle * Math.PI / 180;
    }

    function distAB(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function getCoordsAngleDist(angle, distance) {
        // console.log('angle', angle);
        var rad = getRadians(angle),
            c;
        // console.log('rad', rad);
        c = {
            x: Math.cos(rad) * distance,
            y: Math.sin(rad) * distance
        }
        return c;
    }

    function init() {
        var angleSlider = document.querySelector('#angle-speed'),
            sineSlider = document.querySelector('#sine-speed'),
            playButton = document.querySelector('.play');

        playButton.addEventListener('mousedown', function () {
            if (a.playing) {
                a.stop();
                playButton.innerHTML = ">";
            } else {
                a.play();
                playButton.innerHTML = "=";
            }
        });
        angleSlider.value = angleIncrement;
        angleSlider.addEventListener('change', function () {
            angleIncrement = parseFloat(angleSlider.value, 10);

        });
        sineSlider.value = sineSpeed;

        sineSlider.addEventListener('change', function () {
            sineSpeed = parseFloat(sineSlider.value, 10);
        });

        // document.addEventListener('mousemove', function (e){
        //   var m_x = e.clientX
        //     , m_y = e.clientY
        //     ;
        //   canvasBg[0] = parseInt(canvasBgO[0] + (4 * Math.sin(m_x)));
        //   canvasBg[1] = parseInt(canvasBgO[1] + (4 * Math.sin(m_y)));
        //   canvasBg[2] = parseInt(canvasBgO[2] + (4 * Math.sin(m_x)));

        // });
    }

    function update() {

    }

    function updatecircleLineEnd() {

        var c = getCoordsAngleDist(currentAngle, radius);
        circleLineEnd.x = center.x + c.x;
        circleLineEnd.y = center.y + c.y;
        // console.log(circleLineEnd);
        updateHorizontalLineEnd();
    }

    function updateHorizontalLineEnd() {
        var opp = Math.cos(getRadians(currentAngle)) * radius;
        horizontalLineEnd.x = center.x + opp;
        horizontalLineEnd.y = center.y;
    }

    function increaseAngle(val) {
        if (val == undefined) {
            val = angleIncrement;
        }
        if (currentAngle == undefined) {
            currentAngle = 0;
        } else {
            currentAngle = (currentAngle + val) % 360;
        }
        updatecircleLineEnd();
    }

    function drawCircle() {
        context.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',1)';
        context.beginPath();
        context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
        context.stroke();
        context.closePath();
    }

    function drawBox() {
        context.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',1)';
        context.strokeRect(box.x, box.y, box.l, box.l);
    }

    function drawHelperLines() {
        // draw vertical line
        context.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',0.2)';
        verticalHelper.x = horizontalLineEnd.x;
        verticalHelper.y = center.y - box.l / 2;
        verticalHelper.x2 = verticalHelper.x;
        verticalHelper.y2 = verticalHelper.y + box.l;

        context.beginPath();
        context.moveTo(verticalHelper.x, verticalHelper.y);
        context.lineTo(verticalHelper.x2, verticalHelper.y2);

        context.closePath();
        context.stroke();

        // draw horizontal line

        horizontalHelper.x = center.x - box.l / 2;
        horizontalHelper.y = circleLineEnd.y;
        horizontalHelper.x2 = horizontalHelper.x + box.l;
        horizontalHelper.y2 = horizontalHelper.y;

        context.beginPath();
        context.moveTo(horizontalHelper.x, horizontalHelper.y);
        context.lineTo(horizontalHelper.x2, horizontalHelper.y2);
        context.closePath();
        context.stroke();
    }

    function drawClockArms() {
        context.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',1)';

        context.beginPath();
        context.moveTo(center.x, center.y);
        context.lineTo(circleLineEnd.x, circleLineEnd.y);
        context.lineTo(horizontalLineEnd.x, horizontalLineEnd.y);
        context.lineTo(center.x, center.y);
        context.closePath();
        context.stroke();
        context.fillStyle = 'rgba(' + fillColor[0] + ',' + fillColor[1] + ',' + fillColor[2] + ',0.7)';
        context.fill();
    }

    function updateVSine() {
        if (vSineLeft.length > 350) {
            vSineLeft.pop();
        }
        var tmp = [{
            x: horizontalHelper.x,
            y: horizontalHelper.y
    }];
        vSineLeft = tmp.concat(vSineLeft);
    }

    function updateHSine() {
        if (hSineTop.length > 350) {
            hSineTop.pop();
        }
        var tmp = [{
            x: verticalHelper.x,
            y: verticalHelper.y
    }];
        hSineTop = tmp.concat(hSineTop);
    }

    function animate() {
        requestAnimFrame(animate);
        if (a.playing) {
            draw();
        }
    }

    function clearCanvas() {
        context.fillStyle = 'rgba(' + canvasBg[0] + ',' + canvasBg[1] + ',' + canvasBg[2] + ', 0.4)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawVSine() {
        context.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',1)';
        context.beginPath();
        for (var i = 0; i < vSineLeft.length; i++) {
            var p = vSineLeft[i];

            if (i == 0) {
                context.moveTo(p.x, p.y);
            } else {
                context.lineTo(p.x - sineSpeed * i, p.y);
            }
            if (i == vSineLeft.length - 1) {
                context.moveTo(p.x - sineSpeed * i, p.y);
            }
        };
        context.closePath();
        context.stroke();
    }

    function drawHSine() {
        context.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',1)';
        context.beginPath();
        for (var i = 0; i < hSineTop.length; i++) {
            var p = hSineTop[i];

            if (i == 0) {
                context.moveTo(p.x, p.y);
            } else {
                context.lineTo(p.x, p.y - sineSpeed * i);
            }
            if (i == hSineTop.length - 1) {
                context.moveTo(p.x, p.y - sineSpeed * i);
            }
        };
        context.closePath();
        context.stroke();
    }

    function draw() {
        increaseAngle();
        clearCanvas();
        drawCircle();
        drawClockArms();
        drawBox();
        drawHelperLines();
        updateVSine();
        updateHSine();
        drawVSine();
        drawHSine();
        update();
    }

    a.showAngle = function () {
        console.log('angle', currentAngle);
    }

    a.next = function () {
        draw();
    }

    a.canvasResize = function () {
        canvas.height = window.innerHeight - 4;
        canvas.width = window.innerWidth;
        center.x = Math.floor(canvas.width / 2);
        center.y = Math.floor(canvas.height / 2);
        var m = (canvas.height < canvas.width) ? canvas.height : canvas.width;
        radius = (m / golden) / 5;
        box.l = radius * 3;
        box.x = center.x - box.l / 2;
        box.y = center.y - box.l / 2;
        clearCanvas();

    };

    a.blastOff = function () {
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function ( /* function */ callback, /* DOMElement */ element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        this.canvasResize();
        init();
        // requestAnimationFrame();

        animate();
        draw();
    };
    a.play = function () {
        a.playing = true;
    };
    a.stop = function () {
        a.playing = false;
    };
    return a;
})();

window.onload = function () {
    app.blastOff();
}
window.onresize = function () {
    app.canvasResize();
}