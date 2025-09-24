const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.raw({ limit: "50mb", type: "*/*" }));

//EKXTENSI
app.get('/webhook_dana', async (req, res) => {
  try {
    const { package: pkg, title, text, timestamp, code } = req.query;
    const today = new Date();
    const timestampDate = new Date(timestamp * 1000);
    if (today.toDateString() !== timestampDate.toDateString()) {
      return res.json({ success: false, data: 'Date is invalid' });
    }
    // if (pkg === 'org.telegram.messenger') {
    //   if (title === 'NOTIFIKASI STOK') {
    //     const response = await axios.post('http://157.245.57.254:6969/telegram', {
    //       'pkg': pkg,
    //       'title': title,
    //       'text': text,
    //       'code': code
    //     });
    //     return res.json({ success: true, data: { pkg, title, text } });
    //   } else {
    //     return res.json({ success: false, data: { pkg, title, text } });
    //   }
    // }
    if (!text.includes("Rp")) {
      return res.json({ success: false, data: null });
    }
    if (pkg === 'id.dana' || pkg === 'id.co.bankbkemobile.digitalbank') {
      const payment = 'QRIS';
      let amount;
      if (text.startsWith('Rp')) {
        const amount1 = text.split(' ')[0];
        amount = parseInt(amount1.replace(/[^0-9]/g, ''));
      } else {
        const amount1 = text.split('Rp')[1];
        amount = parseInt(amount1.split(' ')[0].replace(/[^0-9]/g, ''));
      }
      try {
        const response = await axios.post('http://157.245.57.254:6969/dana', {
          'code': code,
          'payment': payment,
          'amount': parseInt(amount)
        });
        res.json({ success: true, data: { pkg, title, text, timestamp, code} });
      } catch (err) {
        res.json({ success: false, data: null });
      }
    } else {
      res.json({ success: true, data: 'Package is invalid' });
    }
  } catch (err) {
    res.status(500).json({ success: false, data: 'Terjadi kesalahan' });
  }
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Error");
});
app.use((req, res, next) => {
  res.send("Hello World :)");
});
app.listen(PORT, () => {
  console.log(`Server Telah Berjalan > http://localhost:${PORT}`);
});