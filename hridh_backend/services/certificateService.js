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

/* left fields */
let startY = 380;

function field(label,value,y){
doc.font("Times-Roman")
.fontSize(11)
.fillColor("#444")
.text(label,100,y);

doc.moveTo(200,y+12)
.lineTo(480,y+12)
.stroke("#aaa");

doc.font("Times-Roman")
.fontSize(12)
.fillColor("#000")
.text(value,210,y);
}

field("ARTWORK ID",artworkCode,startY);
field("OWNER",order.name,startY+40);
field("DATE",new Date().toDateString(),startY+80);

/* signature */
doc.font("Times-Roman")
.fontSize(11)
.text("ARTIST SIGNATURE",100,startY+140);

doc.moveTo(250,startY+155)
.lineTo(420,startY+155)
.stroke("#aaa");

/* hridh signature text */
doc.font("Times-Italic")
.fontSize(18)
.text("Hridh",260,startY+130);

/* QR */
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