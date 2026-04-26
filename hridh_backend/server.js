const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* allow certificate download */
app.use(
"/certificates",
express.static(
path.join(__dirname,"certificates")
)
);

/* force download endpoint */

app.get(
"/download-certificate/:file",
(req,res)=>{

const filePath =
path.join(
__dirname,
"certificates",
req.params.file
);

res.download(filePath);

});

/* routes */
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

/* test */
app.get("/",(req,res)=>{
res.send("HRIDH backend running");
});

/* start */
const PORT = process.env.PORT || 5000;

const Order = require("./models/Order");

app.get("/api/verify/:code", async (req,res)=>{

try{

const { code } = req.params;
const { cert } = req.query;

const order = await Order.findOne({
  "itemsData.code": code
});

if(!order){
return res.json({ valid:false, type:"not_found" });
}

if(order.certificateId !== cert){
return res.json({ valid:false, type:"mismatch" });
}

const item =
order.itemsData?.find(i => i.code === code);

res.json({
valid:true,
code,
name:item?.name,
owner:order.name,
date:order.createdAt
});

}
catch(err){
res.status(500).json({ valid:false });
}

});

app.listen(PORT,()=>{
console.log("Server running on port",PORT);
});