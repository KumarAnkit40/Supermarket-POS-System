import React, { useEffect, useState } from "react";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);

  // USER MANAGEMENT
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "cashier",
  });

  // PRODUCT MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const categories = ["Dairy", "Grocery", "Snacks", "Beverages"];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    sku: "",
    stock: "",
  });

  // ---------- FETCH HELPERS ----------
  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error loading inventory:", err));
  };

  const fetchUsers = () => {
    fetch("http://localhost:5000/auth/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log("Error loading users:", err));
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  // ---------- PRODUCT CRUD ----------
  const handleSaveProduct = async () => {
    const url = editProduct
      ? `http://localhost:5000/products/${editProduct._id}`
      : "http://localhost:5000/products";
    const method = editProduct ? "PUT" : "POST";

    const body = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      sku: formData.sku,
      stock: Number(formData.stock),
    };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    fetchProducts();
    setModalOpen(false);
    setEditProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      sku: "",
      stock: "",
    });
  };

  const openAddModal = () => {
    setEditProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      sku: "",
      stock: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      sku: product.sku,
      stock: product.stock,
    });
    setModalOpen(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  // ---------- USER MANAGEMENT ----------
  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.username || !userForm.password) {
      alert("Please fill all user fields");
      return;
    }

    const res = await fetch("http://localhost:5000/auth/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to create user");
      return;
    }

    alert("User created ✔");
    setUserForm({
      name: "",
      username: "",
      password: "",
      role: "cashier",
    });
    fetchUsers();
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1>Inventory & User Management</h1>
          <p className="inventory-subtitle">
            Manage products, stock levels and staff access from one place.
          </p>
        </div>
      </div>

      <div className="inventory-layout">
        {/* LEFT: PRODUCTS PANEL */}
        <section className="inventory-card inventory-left">
          <div className="inventory-card-header">
            <div>
              <h2>Products</h2>
              <p className="card-subtext">
                Add, edit and track all items available in your supermarket.
              </p>
            </div>
            <button className="primary-btn" onClick={openAddModal}>
              + Add Product
            </button>
          </div>

          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th align="left">Name</th>
                  <th align="center">Category</th>
                  <th align="center">Price</th>
                  <th align="center">Stock</th>
                  <th align="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className={p.stock === 0 ? "row-out" : p.stock < 10 ? "row-low" : ""}
                  >
                    <td>
                      <div className="prod-name">{p.name}</div>
                      <div className="prod-sku">SKU: {p.sku}</div>
                    </td>
                    <td align="center">{p.category}</td>
                    <td align="center">₹{p.price}</td>
                    <td align="center">
                      {p.stock}
                      {p.stock === 0 && (
                        <span className="stock-badge out">Out</span>
                      )}
                      {p.stock > 0 && p.stock < 10 && (
                        <span className="stock-badge low">Low</span>
                      )}
                    </td>
                    <td align="center">
                      <button
                        className="secondary-btn"
                        onClick={() => openEditModal(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => deleteProduct(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                      No products yet. Click <strong>“Add Product”</strong> to
                      create your first item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT: USER MANAGEMENT PANEL */}
        <section className="inventory-card inventory-right">
          <div className="inventory-card-header">
            <div>
              <h2>Users</h2>
              <p className="card-subtext">
                Create cashiers and admins who can log in to this POS system.
              </p>
            </div>
          </div>

          <div className="user-form">
            <h3>Create User</h3>
            <div className="form-row">
              <label>Full Name</label>
              <input
                className="text-input"
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({ ...userForm, name: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Username</label>
              <input
                className="text-input"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input
                className="text-input"
                type="password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Role</label>
              <select
                className="text-input"
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
              >
                <option value="cashier">Cashier</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="primary-btn full-width" onClick={handleCreateUser}>
              Create User
            </button>
          </div>

          <div className="user-list">
            <h3>Existing Users</h3>
            {users.length === 0 ? (
              <p className="muted-text">No users found yet.</p>
            ) : (
              <ul>
                {users.map((u) => (
                  <li key={u._id} className="user-list-item">
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-username">@{u.username}</div>
                    </div>
                    <span className={`role-pill ${u.role}`}>
                      {u.role === "admin" ? "Admin" : "Cashier"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>

            <div className="form-row">
              <label>Name</label>
              <input
                className="text-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Price</label>
              <input
                className="text-input"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-row">
              <label>Category</label>
              <select
                className="text-input"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>SKU</label>
              <input
                className="text-input"
                value={formData.sku}
                disabled={!!editProduct}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Stock</label>
              <input
                className="text-input"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="primary-btn" onClick={handleSaveProduct}>
                Save
              </button>
              <button
                className="remove-btn"
                onClick={() => {
                  setModalOpen(false);
                  setEditProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
