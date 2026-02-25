import React, { useState, useEffect } from 'react';
import Cart from '../components/Cart';

const CATEGORIES = ['All', 'Dairy', 'Grocery', 'Snacks', 'Beverages'];
const TAX_RATE = 0.18;

const HomePage = ({ onNotify, onGoToPayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState('NONE');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => onNotify('Failed to load products', 'error'));
  }, [onNotify]);

  const filteredProducts = products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const lower = searchTerm.toLowerCase();
    const matchText = p.name.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower);
    return matchCat && matchText;
  });

  const addToCart = (product) => {
    if (product.stock === 0) {
      onNotify(`${product.name} is out of stock`, "error");
      return;
    }

    const exists = cartItems.find((it) => it._id === product._id);

    if (exists) {
      if (exists.quantity >= product.stock) {
        onNotify(`Only ${product.stock} in stock`, "error");
        return;
      }

      setCartItems((prev) =>
        prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
      onNotify(`${product.name} quantity updated`, "info");
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
      onNotify(`${product.name} added`, "success");
    }
  };

  const increaseQty = (id) => {
    const product = products.find((p) => p._id === id);
    const cartItem = cartItems.find((i) => i._id === id);

    if (cartItem.quantity >= product.stock) {
      onNotify(`Only ${product.stock} in stock`, "error");
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    onNotify(`${product.name} quantity increased`, "info");
  };

  const decreaseQty = (id) => {
    const product = products.find((p) => p._id === id);
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      if (updated.length < prev.length) {
        onNotify(`${product.name} removed`, "error");
      }
      return updated;
    });
  };

  const removeItem = (id) => {
    const product = products.find((p) => p._id === id);
    onNotify(`${product.name} removed`, "error");
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'F9' && filteredProducts.length > 0) {
        const product = filteredProducts[0];
        addToCart(product);
        onNotify(`${product.name} scanned`, 'success');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [filteredProducts, cartItems]);

  return (
    <>
      <div className="page-title">RFID POS Checkout</div>
      <div className="page-subtitle">Scan/Search items and manage cart</div>

      <div className="pos-layout">
        <div className="pos-panel">
          <div className="search-row">
            <input
              className="search-input"
              placeholder="Enter SKU or product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={"category-btn " + (activeCategory === cat ? "active" : "")}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="item-list">
            {filteredProducts.map((item) => (
              <div
                key={item._id}
                className="item-row"
                style={{
                  background:
                    item.stock === 0 ? "#ffe5e5" :
                    item.stock < 10 ? "#fff3cd" :
                    "white",
                }}
              >
                <div className="item-info">
                  <span className="item-name">
                    {item.name} – ₹{item.price}
                  </span>
                  <span className="item-meta">
                    SKU: {item.sku} • Stock: {item.stock}
                  </span>

                  {item.stock === 0 && (
                    <span style={{ color: "#d32f2f", fontSize: 13 }}>
                      Out of Stock!
                    </span>
                  )}

                  {item.stock > 0 && item.stock < 10 && (
                    <span style={{ color: "#856404", fontSize: 13 }}>
                      Low Stock!
                    </span>
                  )}
                </div>

                <button
                  className="primary-btn"
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                  style={{
                    background: item.stock === 0 ? "#aaa" : undefined,
                    cursor: item.stock === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {item.stock === 0 ? "Sold Out" : "Add"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <Cart
          items={cartItems}
          discount={discount}
          setDiscount={setDiscount}
          taxRate={TAX_RATE}
          onIncreaseQty={increaseQty}
          onDecreaseQty={decreaseQty}
          onRemove={removeItem}
          onProceedToPayment={() => onGoToPayment(cartItems, discount)}
        />
      </div>
    </>
  );
};

export default HomePage;
