import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { injectGlobalStyles } from "../styles/colors";

const DeliveryPage = () => {
  useEffect(() => { injectGlobalStyles(); }, []);
  
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    customer: "",
    fromLocation: "WH/Stock1",
    deliveryAddress: "",
    scheduleDate: "",
    responsible: "",
    operationType: "DELIVERY",
    items: []
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDeliveries();
    fetchProducts();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/deliveries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(res.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const createDelivery = async () => {
    if (!newDelivery.customer || newDelivery.items.length === 0) {
      return alert("Customer and at least one item required");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/deliveries", newDelivery, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeliveries();
      setShowNewModal(false);
      setNewDelivery({ 
        customer: "", 
        fromLocation: "WH/Stock1", 
        deliveryAddress: "",
        scheduleDate: "", 
        responsible: "", 
        operationType: "DELIVERY",
        items: [] 
      });
      navigate(`/delivery/${res.data.delivery._id}`);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create delivery");
    }
  };

  const deleteDelivery = async (id) => {
    if (!window.confirm("Delete this delivery?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/deliveries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeliveries();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete");
    }
  };

  const addItemToDelivery = () => {
    setNewDelivery({
      ...newDelivery,
      items: [...newDelivery.items, { product: "", quantityOrdered: 0 }]
    });
  };

  const updateDeliveryItem = (index, field, value) => {
    const updated = [...newDelivery.items];
    updated[index][field] = value;
    setNewDelivery({ ...newDelivery, items: updated });
  };

  const removeDeliveryItem = (index) => {
    setNewDelivery({
      ...newDelivery,
      items: newDelivery.items.filter((_, i) => i !== index)
    });
  };

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading deliveries...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "32px", minHeight: "100vh", background: "var(--cream)" }}>
        <div className="card" style={{ marginBottom: 24 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
                <Plus size={16} /> NEW
              </button>
              <h2 style={{ color: "var(--brown)", fontSize: "20px", fontWeight: "600", margin: 0 }}>
                Delivery Orders
              </h2>
            </div>

            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--brown)" }} />
                <input
                  className="input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: 40, width: 240 }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--brown)" }}>
              <tr>
                {["Reference", "From", "To", "Contact", "Schedule Date", "Status", "Actions"].map((header) => (
                  <th key={header} style={{ textAlign: "left", padding: "12px 14px", color: "white", fontWeight: "600", fontSize: "13px", textTransform: "uppercase" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 40, textAlign: "center", color: "#997644" }}>
                    No delivery orders found
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--cream)" }}>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "var(--brown)",
                        fontSize: "14px",
                        fontStyle: "italic",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: "600"
                      }}
                      onClick={() => navigate(`/delivery/${item._id}`)}
                    >
                      {item.reference}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.fromLocation}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.toLocation}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.customer}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>
                      {item.scheduleDate ? new Date(item.scheduleDate).toLocaleDateString('en-IN') : "-"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className="chip" style={{ fontSize: 11, padding: "3px 8px" }}>{item.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {item.status !== "DONE" && (
                        <button className="btn btn-cancel" onClick={() => deleteDelivery(item._id)} style={{ fontSize: 12, padding: "6px 10px" }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* New Delivery Modal */}
      {showNewModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>Create New Delivery Order</h3>
              <button onClick={() => setShowNewModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="profile-field">
                <label className="profile-label">Customer Name</label>
                <input
                  className="input"
                  value={newDelivery.customer}
                  onChange={(e) => setNewDelivery({ ...newDelivery, customer: e.target.value })}
                  placeholder="e.g. Azure Interior"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">From Location</label>
                <input
                  className="input"
                  value={newDelivery.fromLocation}
                  onChange={(e) => setNewDelivery({ ...newDelivery, fromLocation: e.target.value })}
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Delivery Address</label>
                <input
                  className="input"
                  value={newDelivery.deliveryAddress}
                  onChange={(e) => setNewDelivery({ ...newDelivery, deliveryAddress: e.target.value })}
                  placeholder="e.g. 123 Main St, Mumbai"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Responsible</label>
                <input
                  className="input"
                  value={newDelivery.responsible}
                  onChange={(e) => setNewDelivery({ ...newDelivery, responsible: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Schedule Date (Optional)</label>
                <input
                  type="date"
                  className="input"
                  value={newDelivery.scheduleDate}
                  onChange={(e) => setNewDelivery({ ...newDelivery, scheduleDate: e.target.value })}
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Operation Type</label>
                <select
                  className="select"
                  value={newDelivery.operationType}
                  onChange={(e) => setNewDelivery({ ...newDelivery, operationType: e.target.value })}
                >
                  <option value="DELIVERY">Delivery</option>
                  <option value="PICKUP">Pickup</option>
                  <option value="RETURN">Return</option>
                </select>
              </div>

              <h4 style={{ marginTop: 20, marginBottom: 12, color: "var(--brown)" }}>Items</h4>
              {newDelivery.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "end" }}>
                  <div style={{ flex: 1 }}>
                    <label className="profile-label">Product</label>
                    <select
                      className="select"
                      value={item.product}
                      onChange={(e) => updateDeliveryItem(idx, "product", e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Available: {p.freeToUse})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: 120 }}>
                    <label className="profile-label">Quantity</label>
                    <input
                      type="number"
                      className="input"
                      value={item.quantityOrdered}
                      onChange={(e) => updateDeliveryItem(idx, "quantityOrdered", Number(e.target.value))}
                    />
                  </div>
                  <button className="btn btn-cancel" onClick={() => removeDeliveryItem(idx)} style={{ padding: "8px 12px" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addItemToDelivery} style={{ marginTop: 8 }}>
                <Plus size={14} /> Add Item
              </button>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowNewModal(false)} className="btn btn-cancel">
                Cancel
              </button>
              <button onClick={createDelivery} className="btn btn-primary">
                Create Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryPage;