const QRCode = require('qrcode')
const Canvas = require('canvas')
const fs = require('fs')

var exampleStuff = {
    mN: 10,
    tN: 1023,
    dC: 4,
    df: 3,
    notes: "Hello!\nCool stuff!\nNice Design.\nLol!\namazing!"
}

exampleStuff = JSON.stringify(exampleStuff);

var data = [
    exampleStuff,
    Buffer.from(exampleStuff).toString('base64'),
]

for (let i = 0; i < data.length; i++) {
    console.log(data[i].length)

    QRCode.toDataURL(
        data[i],
        {
            errorCorrectionLevel: 'H',
            color: {
                dark: '#BE1E2D',  // Red dots
                light: '#0000' // Transparent background
            }
        },
        async function (err, url) {
            if (err) throw err

            const qrCode = await Canvas.loadImage(url)

            const canvas = Canvas.createCanvas(qrCode.width, qrCode.height);
            const context = canvas.getContext('2d');

            context.drawImage(qrCode, 0, 0, canvas.width, canvas.height);
            
            const frcLogo = await Canvas.loadImage('./frcLogo.png');

            context.drawImage(
                frcLogo, 
                canvas.width / 2 - frcLogo.width / 2,
                canvas.height / 2 - frcLogo.height / 2
            )

            fs.writeFileSync(`./qr${i}.png`, canvas.toBuffer())
        }
    )
}