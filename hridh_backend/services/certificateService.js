const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateCertificate(order){

const doc = new PDFDocument();

const fileName = `certificate_${order.paymentId}.pdf`;

doc.pipe(fs.createWriteStream("certificates/"+fileName));

doc.fontSize(22).text("Certificate of Authenticity",{
align:"center"
});

doc.moveDown();

doc.fontSize(14).text(`Artwork ID: ${order.items[0]}`);
doc.text(`Owner: ${order.name}`);
doc.text(`Purchase Date: ${new Date().toDateString()}`);

doc.moveDown();

doc.text("This artwork is an original hand-painted piece.");
doc.text("Only ONE version of this artwork exists.");

doc.end();

return fileName;

}

module.exports = generateCertificate;