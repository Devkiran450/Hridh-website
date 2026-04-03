const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateCertificate(order){

const doc = new PDFDocument({

size:"A4",

margins:{
top:80,
bottom:80,
left:70,
right:70
}

});

const fileName = `certificate_${order.paymentId}.pdf`;

const filePath = path.join(__dirname,"../certificates",fileName);

doc.pipe(fs.createWriteStream(filePath));


/* ===== PAPER BACKGROUND ===== */

doc.rect(0,0,595,842)
.fill("#f8f5ef");


/* ===== DOUBLE BORDER ===== */

doc.lineWidth(3)
.rect(40,40,515,762)
.stroke("#1c1c1c");

doc.lineWidth(1)
.rect(55,55,485,732)
.stroke("#1c1c1c");


/* ===== HRIDH BRAND ===== */

doc.font("Times-Bold")
.fontSize(14)
.fillColor("#333")
.text("HRIDH",{
align:"center"
});


/* ===== TITLE ===== */

doc.moveDown(2);

doc.font("Times-Bold")
.fontSize(28)
.text("CERTIFICATE OF AUTHENTICITY",{
align:"center"
});


/* ===== SUBTITLE ===== */

doc.moveDown();

doc.font("Times-Italic")
.fontSize(14)
.fillColor("#444")
.text(
"This document certifies the authenticity of an original HRIDH textile artwork",
{
align:"center",
width:420
}
);


/* ===== DETAILS ===== */

doc.moveDown(3);

doc.font("Times-Roman")
.fontSize(16)
.fillColor("#111");

doc.text(`Artwork ID: HRIDH-${order.items[0]}`,{
align:"center"
});

doc.text(`Owner: ${order.name}`,{
align:"center"
});

doc.text(
`Purchase Date: ${new Date().toDateString()}`,
{
align:"center"
}
);


/* ===== AUTHENTICITY TEXT ===== */

doc.moveDown(3);

doc.font("Times-Italic")
.fontSize(16)
.fillColor("#333")
.text(
"This artwork is an original hand-painted textile creation.",
{
align:"center"
}
);

doc.moveDown(.5);

doc.text(
"Only ONE version of this artwork exists.",
{
align:"center"
}
);

doc.moveDown(.5);

doc.text(
"No reproductions will ever be created.",
{
align:"center"
}
);


/* ===== HRIDH RED SEAL ===== */

doc.image(

path.join(__dirname,"../../images/hridh-seal.png"),

doc.page.width/2 - 55,   // center horizontally

560,                     // vertical position

{
width:110,
opacity:0.9
}

);


/* ===== EDITION NOTE ===== */

doc.fontSize(11)
.fillColor("#777")
.text(
"Original Artwork · Edition 1 of 1",
{
align:"center",
y:720
}
);


doc.end();

return fileName;

}

module.exports = generateCertificate;