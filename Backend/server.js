const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const express = require('express');
const cors  = require('cors');
const employeeRoutes = require('./src/routes/employeeRoutes');


const connectDb = require('./src/config/db');

dotenv.config();


const app = express();
connectDb();


app.use(express.json());

app.use(cors());

app.use('/api/v1', employeeRoutes);




let PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
    console.log(`server is listening on PORT number ${PORT}`);
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
