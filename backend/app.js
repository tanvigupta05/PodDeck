const express= require("express");
const app = express();
require("dotenv").config();
require("./connection/conn");

app.listen(process.env.PORT,()=>{
    console.log(`server started on port: ${process.env.PORT}`);
});
