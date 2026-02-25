import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const Cart = ({
  items,
  discount,
  setDiscount,
  taxRate,
  onIncreaseQty,
  onDecreaseQty,
  onRemove,
  onProceedToPayment,
}) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const discountRate =
    discount === "DISC_5" ? 0.05 :
    discount === "DISC_10" ? 0.10 :
    discount === "DISC_20" ? 0.20 : 0;

  const discountAmount = subtotal * discountRate;
  const tax = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + tax;

  return (
    <div className="cart-panel pretty-cart">
      <h3 className="cart-title">🛒 Cart</h3>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-info">
              <strong>{item.name}</strong>
              <span className="price-tag">₹{item.price}</span>
            </div>

            <div className="cart-actions">
              <button className="qty-btn" onClick={() => onDecreaseQty(item._id)}>
                <FaMinus size={12} />
              </button>
              <span className="qty-number">{item.quantity}</span>
              <button className="qty-btn" onClick={() => onIncreaseQty(item._id)}>
                <FaPlus size={12} />
              </button>
            </div>

            <div className="cart-amount">
              <strong>₹{item.price * item.quantity}</strong>
            </div>

            <button className="remove-icon" onClick={() => onRemove(item._id)}>
              <FaTrash size={13} />
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <>
          <div className="cart-summary">
            <div>Subtotal: ₹{subtotal.toFixed(2)}</div>

            <div>
              Discount:{" "}
              <select
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              >
                <option value="NONE">None</option>
                <option value="DISC_5">5%</option>
                <option value="DISC_10">10%</option>
                <option value="DISC_20">20%</option>
              </select>
            </div>

            <div>Discount Amount: ₹{discountAmount.toFixed(2)}</div>
            <div>Tax (18%): ₹{tax.toFixed(2)}</div>
          </div>

          <div className="cart-total-highlight">
            Total: ₹{total.toFixed(2)}
          </div>

          <button className="print-btn" onClick={onProceedToPayment}>
            Print Receipt
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
