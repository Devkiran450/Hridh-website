const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

function generateCertificate(order,itemId){

return new Promise(async (resolve,reject)=>{

try{

const doc = new PDFDocument({
size:"A4",
margin:0
});

const fileName =
`certificate_${order.paymentId}_${itemId}.pdf`;

const dir = path.join(__dirname,"../certificates");

if(!fs.existsSync(dir)){
fs.mkdirSync(dir);
}

const filePath = path.join(dir,fileName);
const stream = fs.createWriteStream(filePath);

doc.pipe(stream);

/* background */
doc.rect(0,0,595,842).fill("#f8f5ef");

/* border */
doc.lineWidth(2)
.rect(40,40,515,762)
.stroke("#c9b37e");

doc.lineWidth(1)
.rect(55,55,485,732)
.stroke("#c9b37e");

/* title */
doc.font("Times-Bold")
.fontSize(26)
.fillColor("#000")
.text("CERTIFICATE OF",0,120,{align:"center"});

doc.fontSize(40)
.text("AUTHENTICITY",0,150,{align:"center"});

/* divider */
doc.moveTo(250,210).lineTo(345,210).stroke("#c9b37e");

/* product info */
const item =
order.itemsData?.find(p => String(p.id)===String(itemId));

const artworkCode = item?.code || `HRIDH-${itemId}`;
const artworkName = item?.name || "";

/* artwork title */
doc.font("Times-Italic")
.fontSize(26)
.fillColor("#b89b5e")
.text(artworkName,0,240,{align:"center"});

/* description */
doc.font("Times-Roman")
.fontSize(12)
.fillColor("#333")
.text(
"This artwork is an original, one-of-a-kind hand-painted textile creation.\nThis artwork is not reproduced or replicated in any form.\nYou now own the only piece of its kind.",
100,
290,
{align:"center",width:400}
);

/* ===================== */
/* CENTER DOMINANT FIELDS */
/* ===================== */

let centerY = 380;

/* Artwork ID */
doc.font("Times-Roman")
.fontSize(12)
.fillColor("#777")
.text("ARTWORK ID",0,centerY,{align:"center"});

doc.font("Times-Bold")
.fontSize(22)
.fillColor("#000")
.text(artworkCode,0,centerY+20,{align:"center"});

/* Owner (MOST IMPORTANT) */
doc.font("Times-Roman")
.fontSize(12)
.fillColor("#777")
.text("OWNER",0,centerY+80,{align:"center"});

doc.font("Times-Bold")
.fontSize(28)   // 🔥 bigger = premium feel
.fillColor("#000")
.text(order.name,0,centerY+100,{align:"center"});

/* Date */
doc.font("Times-Roman")
.fontSize(12)
.fillColor("#777")
.text("DATE",0,centerY+170,{align:"center"});

doc.font("Times-Bold")
.fontSize(18)
.fillColor("#000")
.text(new Date().toDateString(),0,centerY+190,{align:"center"});

/* ===================== */
/* LABEL SIGNATURE */
/* ===================== */

doc.font("Times-Roman")
.fontSize(11)
.fillColor("#444")
.text("LABEL SIGNATURE",0,centerY+250,{align:"center"});

/* signature line */
doc.moveTo(200,centerY+270)
.lineTo(395,centerY+270)
.stroke("#aaa");

/* transparent signature image */
doc.opacity(0.95);

doc.image(
path.join(__dirname,"../../images/hridh_signature-removebg-preview.png"),
doc.page.width/2 - 60,
centerY+235,
{ width:120 }
);

doc.opacity(1);

/* ===================== */
/* QR */
/* ===================== */

const verifyUrl =
`https://hridh.com/verify.html?code=${artworkCode}&cert=${order.certificateId}`;

const qrBuffer = await QRCode.toBuffer(verifyUrl,{
color:{ dark:"#333", light:"#f8f5ef" }
});

doc.image(qrBuffer,100,620,{width:70});

/* seal */
doc.image(
path.join(__dirname,"../../images/hridh-seal.png"),
400,
600,
{width:120}
);

/* footer */
doc.font("Times-Roman")
.fontSize(10)
.fillColor("#666")
.text(
"THANK YOU FOR SUPPORTING ORIGINAL ART",
0,
750,
{align:"center"}
);

doc.end();

stream.on("finish",()=>resolve(fileName));
stream.on("error",(err)=>reject(err));

}
catch(err){
reject(err);
}

});

}

module.exports = generateCertificate;