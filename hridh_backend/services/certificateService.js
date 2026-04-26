const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

function generateCertificate(order,itemId){

return new Promise(async (resolve,reject)=>{

try{

const doc = new PDFDocument({

size:"A4",

margins:{
top:80,
bottom:80,
left:70,
right:70
}

});

const fileName =
`certificate_${order.paymentId}_${itemId}.pdf`;

const dir =
path.join(
__dirname,
"../certificates"
);

if(!fs.existsSync(dir)){
fs.mkdirSync(dir);
}

const filePath =
path.join(dir,fileName);

const stream =
fs.createWriteStream(filePath);

doc.pipe(stream);

/* background */
doc.rect(0,0,595,842)
.fill("#f8f5ef");

/* border */
doc.lineWidth(3)
.rect(40,40,515,762)
.stroke("#1c1c1c");

doc.lineWidth(1)
.rect(55,55,485,732)
.stroke("#1c1c1c");

/* title */
doc.font("Times-Bold")
.fontSize(14)
.fillColor("#333")
.text("HRIDH",{align:"center"});

doc.moveDown(2);

doc.font("Times-Bold")
.fontSize(28)
.text("CERTIFICATE OF AUTHENTICITY",{align:"center"});

doc.moveDown();

doc.font("Times-Italic")
.fontSize(14)
.text(
"This document certifies the authenticity of an original HRIDH textile artwork",
{align:"center"}
);

doc.moveDown(3);

/* get product info */
const item =
order.itemsData?.find(
p => String(p.id) === String(itemId)
);

const artworkCode =
item?.code || `HRIDH-${itemId}`;

const artworkName =
item?.name || "";

/* COLLECTION label */
doc.font("Times-Roman")
.fontSize(12)
.fillColor("#555")
.text("COLLECTION",{align:"center"});

doc.moveDown(0.4);

/* artwork name */
doc.font("Times-Bold")
.fontSize(20)
.fillColor("#000")
.text(artworkName,{align:"center"});

doc.moveDown(1);

/* artwork id */
doc.font("Times-Roman")
.fontSize(14)
.fillColor("#333")
.text(`Artwork ID: ${artworkCode}`,{align:"center"});

/* certificate id (NEW) */
doc.font("Times-Roman")
.fontSize(12)
.text(`Certificate ID: ${order.certificateId}`,{align:"center"});

/* owner */
doc.fontSize(16)
.text(`Owner: ${order.name}`,{align:"center"});

/* date */
doc.text(
`Purchase Date: ${new Date().toDateString()}`,
{align:"center"}
);

doc.moveDown(3);

/* statement */
doc.font("Times-Italic")
.fontSize(16);

doc.text(
"This artwork is an original hand-painted textile creation.",
{align:"center"}
);

doc.text(
"Only ONE version of this artwork exists.",
{align:"center"}
);

doc.text(
"No reproductions will ever be created.",
{align:"center"}
);

/* ================= QR ================= */
const verifyUrl =
`https://hridh.com/verify.html?code=${artworkCode}&cert=${order.certificateId}`;

const qrBuffer =
await QRCode.toBuffer(verifyUrl,{
color:{
dark:"#333333",
light:"#f8f5ef"
}
});

/* separator */
doc.moveTo(200,660)
.lineTo(395,660)
.strokeColor("#aaa")
.stroke();

/* label */
doc.font("Times-Roman")
.fontSize(10)
.fillColor("#555")
.text("Verify authenticity",0,670,{align:"center"});

/* QR */
doc.image(
qrBuffer,
doc.page.width/2 - 40,
690,
{ width:80 }
);

/* seal */
doc.image(
path.join(
__dirname,
"../../images/hridh-seal.png"
),
doc.page.width/2 - 55,
560,
{ width:110 }
);

/* footer */
doc.fontSize(11)
.text(
"Original Artwork · Edition 1 of 1",
{
align:"center",
y:720
}
);

doc.end();

/* wait */
stream.on("finish",()=>{
resolve(fileName);
});

stream.on("error",(err)=>{
reject(err);
});

}
catch(err){
reject(err);
}

});

}

module.exports = generateCertificate;