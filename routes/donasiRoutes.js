const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const db = require("../config/db");
require("dotenv").config();

// ✅ RUTE DONASI - BUAT TRANSAKSI
router.post("/checkout", ensureAuthenticated, async (req, res) => {
  const { amount, project_id } = req.body;

  console.log("Donasi received:", req.body);

  if (!amount || isNaN(amount) || amount < 1000) {
    return res.status(400).json({ error: "Jumlah donasi tidak valid" });
  }

  try {
    const merchant_code = process.env.TRIPAY_MERCHANT_CODE;
    const private_key = process.env.TRIPAY_PRIVATE_KEY;
    const merchant_ref = `DON-${Date.now()}`;
    const amountStr = String(amount);

    // Payload: tanpa private key!
    const signaturePayload = merchant_code + merchant_ref + amountStr;

    const signature = crypto
      .createHmac("sha256", private_key)
      .update(signaturePayload)
      .digest("hex");

    // ✅ Kirim request ke Tripay
    const response = await axios.post(
      "https://tripay.co.id/api-sandbox/transaction/create",
      {
        method: "QRIS", // metode pembayaran yang kamu aktifkan di Tripay
        merchant_ref,
        amount: Number(amount),
        customer_name: req.user.name,
        customer_email: req.user.email,
        order_items: [
          {
            name: `Donasi Proyek ID ${project_id}`,
            price: Number(amount),
            quantity: 1
          }
        ],
        callback_url: process.env.TRIPAY_CALLBACK_URL,
        return_url: `${process.env.BASE_URL}/dashboard`,
        signature: signature
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TRIPAY_API_KEY}`
        }
      }
    );

    const result = response.data.data;

    // ✅ Simpan donasi ke database
    db.query(
      "INSERT INTO donations SET ?",
      {
        user_id: req.user.id,
        project_id,
        amount,
        status: "UNPAID",
        tripay_ref: result.reference
      },
      (err) => {
        if (err) console.error("Gagal simpan donasi:", err);
      }
    );

    // ✅ Kirim URL checkout Tripay ke frontend
    res.json({ payment_url: result.checkout_url });

  } catch (err) {
    console.error("Tripay error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.message || "Gagal memproses donasi" });
  }
});

// ✅ RUTE CALLBACK DARI TRIPAY
router.post("/callback", express.json(), (req, res) => {
  const { reference, status } = req.body;

  console.log("Tripay Callback Received:", req.body);

  if (!reference || !status) return res.sendStatus(400);

  // ✅ Update status donasi berdasarkan status dari Tripay
  let newStatus = "UNPAID";
  if (status === "PAID") newStatus = "success";
  else if (["FAILED", "EXPIRED"].includes(status)) newStatus = "failed";

  db.query("UPDATE donations SET status = ? WHERE tripay_ref = ?", [newStatus, reference], (err) => {
    if (err) console.error("Gagal update status donasi:", err);
  });

  res.sendStatus(200); // penting: respon 200 ke Tripay
});

module.exports = router;