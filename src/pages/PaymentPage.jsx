import React, { useState } from "react";

const PaymentPage = ({ data, onNotify }) => {
  if (!data || !data.cartItems || data.cartItems.length === 0) {
    return <p>No bill data available.</p>;
  }

  const { cartItems, discount, timestamp } = data;

  // Store details (can customize)
  const storeName = "SuperMart RFID Store";
  const storeAddress = "MG Road, Bengaluru - 560001";
  const storePhone = "+91 98765 43210";
  const gstNo = "GSTIN: 29ABCDE1234F2Z5";

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isPaid, setIsPaid] = useState(false);
  const [saving, setSaving] = useState(false);

  // Bill calculations
  let subtotal = 0;
  cartItems.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  let discountRate =
    discount === "DISC_5"
      ? 0.05
      : discount === "DISC_10"
      ? 0.1
      : discount === "DISC_20"
      ? 0.2
      : 0;

  const discountAmount = subtotal * discountRate;
  const taxRate = 0.18;
  const tax = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + tax;

  const billNo = Math.floor(Math.random() * 100000);

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmPayment = async () => {
    if (saving || isPaid) return;
    setSaving(true);

    // read cashier info from localStorage (login should save these)
    const cashierName = localStorage.getItem("name") || null;
    const cashierUsername = localStorage.getItem("username") || null;
    const cashierId = localStorage.getItem("userId") || null; // if you stored userId on login

    try {
      const response = await fetch("http://localhost:5000/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            category: i.category,
          })),
          discount,
          total,
          paymentMethod,
          cashierId,
          cashierName,
          cashierUsername,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to complete sale");
      }

      setIsPaid(true);
      onNotify && onNotify("Payment recorded & stock updated", "success");
    } catch (err) {
      console.error(err);
      onNotify && onNotify("Payment failed. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // receipt display includes cashier info
  const cashierName = localStorage.getItem("name") || "";
  const cashierUsername = localStorage.getItem("username") || "";

  return (
    <div style={{ maxWidth: 420, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>{storeName}</h2>
      <p style={{ textAlign: "center", fontSize: 13 }}>
        {storeAddress}
        <br />
        {storePhone}
        <br />
        {gstNo}
      </p>

      <p style={{ fontSize: 13 }}>
        Bill No: <strong>{billNo}</strong>
        <br />
        Date: {new Date(timestamp).toLocaleString()}
      </p>

      <hr />

      <table style={{ width: "100%", fontSize: 14 }}>
        <thead>
          <tr>
            <th align="left">Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th align="right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td align="center">{item.quantity}</td>
              <td align="center">₹{item.price}</td>
              <td align="right">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <p className="summary-row">
        Subtotal: <strong>₹{subtotal.toFixed(2)}</strong>
      </p>
      <p className="summary-row">
        Discount: <strong>-₹{discountAmount.toFixed(2)}</strong>
      </p>
      <p className="summary-row">
        Tax (18%): <strong>₹{tax.toFixed(2)}</strong>
      </p>
      <h2 className="summary-row total">
        Grand Total: ₹{total.toFixed(2)}
      </h2>

      <hr />

      {/* Cashier info shown on receipt area */}
      <p style={{ fontSize: 13 }}>
        Cashier: <strong>{cashierName || "Unknown"}{cashierUsername ? ` (@${cashierUsername})` : ""}</strong>
      </p>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 13, marginBottom: 4 }}>Payment Method</div>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <button
        className="primary-btn"
        style={{ width: "100%", marginBottom: 10 }}
        onClick={handleConfirmPayment}
        disabled={saving || isPaid}
      >
        {isPaid ? "Payment Completed ✔" : "Confirm Payment & Save Sale"}
      </button>

      <button
        className="primary-btn"
        style={{
          width: "100%",
          opacity: isPaid ? 1 : 0.5,
          cursor: isPaid ? "pointer" : "not-allowed",
        }}
        onClick={handlePrint}
        disabled={!isPaid}
      >
        Print Receipt
      </button>

      <p style={{ textAlign: "center", fontSize: 12, marginTop: 8 }}>
        {isPaid
          ? "Payment stored in system. You can safely print the receipt."
          : "Please confirm payment before printing receipt."}
      </p>
    </div>
  );
};

export default PaymentPage;
