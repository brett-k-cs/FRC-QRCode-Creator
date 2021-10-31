const QRCode = require('qrcode')
const Jimp = require('jimp')
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

    QRCode.toBuffer(
        data[i],
        {
            errorCorrectionLevel: 'H',
            color: {
                dark: '#BE1E2D',  // Red dots
                light: '#0000' // Transparent background
            }
        },
        async function (err, buffer) {
            if (err) throw err

            const qrCode = await Jimp.read(buffer)

            const frcLogo = await Jimp.read('./frcLogo.png');

            qrCode.composite(
                frcLogo, 
                qrCode.getWidth() / 2 - frcLogo.getWidth() / 2,
                qrCode.getHeight() / 2 - frcLogo.getHeight() / 2
            )

            var finalBuffer = await qrCode.getBufferAsync(Jimp.MIME_PNG);
            fs.writeFileSync(`./qr${i}.png`, finalBuffer)
        }
    )
}