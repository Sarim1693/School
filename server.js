const express=require('express');
require('dotenv').config();
const bodyParser=require('body-parser');
const PORT=process.env.PORT||3000;
const app=express();
const schoolRoute=require('./routes/schoolRoutes');
app.use(express.json());
app.use('/school', schoolRoute);
app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
});