function createRepeatingBrickPattern(
    rng: RandomNumberGenerator,
    width: number,
    height: number,
    bricksAcross: number,
    bricksDown: number,
    brickOffsetFraction: number,
    initialBrickOffsetFraction: number,
    upperBrickColor: string,
    lowerBrickColor: string,
    brickRounding: number,
    groutWidth: number,
    groutColor: string,
    text?: string[]
): HTMLCanvasElement {

    let brickWidth = (width - groutWidth * (bricksAcross)) / bricksAcross;
    let brickHeight = (height - groutWidth * (bricksDown)) / bricksDown;
    let brickOffset = brickOffsetFraction * brickWidth;
    let initialBrickOffset = initialBrickOffsetFraction * brickWidth + groutWidth/2;

    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');

    let brickColor = ctx.createLinearGradient(0, 0, 0, height);
    brickColor.addColorStop(0, upperBrickColor);
    brickColor.addColorStop(1, lowerBrickColor);

    ctx.fillStyle = groutColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = brickColor;

    ctx.strokeStyle = groutColor;

    let count = 0;
    let y = groutWidth / 2;
    let xoffset = initialBrickOffset;
    while (y < height) {
        let x = xoffset - brickWidth - groutWidth;
        while (x < width) {
            //ctx.fillRect(x, y, brickWidth, brickHeight);
            let whole = x >= 0 && x < width - brickWidth;
            if (whole) {
                let r = rng();
                ctx.globalAlpha = (1 - r * r * r * r * 0.3);
            }
            ctx.beginPath();
            ctx.moveTo(x + brickRounding, y);
            ctx.lineTo(x + brickWidth - brickRounding, y);
            ctx.arc(x + brickWidth - brickRounding, y + brickRounding, brickRounding, -pi / 2, 0);
            ctx.lineTo(x + brickWidth, y + brickHeight - brickRounding);
            ctx.arc(x + brickWidth - brickRounding, y + brickHeight - brickRounding, brickRounding, 0, pi / 2);
            ctx.lineTo(x + brickRounding, y + brickHeight);
            ctx.arc(x + brickRounding, y + brickHeight - brickRounding, brickRounding, pi / 2, pi);
            ctx.lineTo(x, y + brickRounding);
            ctx.arc(x + brickRounding, y + brickRounding, brickRounding, -pi, -pi / 2);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = 0.3;
            ctx.lineWidth = groutWidth * 2;
            ctx.stroke();
            ctx.globalAlpha = 1;

            if (text && whole) {
                let c = text[count++%text.length];
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top'
                ctx.font = '' + brickHeight + 'px serif';
                let fontSize = brickHeight;
                ctx.lineWidth = groutWidth / 2;
                ctx.strokeText(c, x + brickWidth / 2, y);
            }

            x += brickWidth + groutWidth;
        }
        xoffset = (xoffset + brickOffset) % brickWidth;
        y += brickHeight + groutWidth;
    }

    return canvas;
}
