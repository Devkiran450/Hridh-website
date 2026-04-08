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
app.use("/certificates", (req,res,next)=>{

res.setHeader(
"Content-Disposition",
"attachment"
);

next();

}, express.static(
path.join(__dirname,"certificates")
));

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

app.listen(PORT,()=>{
console.log("Server running on port",PORT);
});