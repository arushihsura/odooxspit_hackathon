import React, { useState } from "react";
import Navbar from "../components/Navbar";
import colors from "../styles/colors";

export default function Stock() {
  const [stock, setStock] = useState([
    { id: 1, product: "Desk", perUnitCost: 3000, onHand: 50, freeToUse: 45 },
    { id: 2, product: "Table", perUnitCost: 3000, onHand: 50, freeToUse: 50 }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (id, field, value) => {
    setStock(stock.map(item => 
      item.id === id ? { ...item, [field]: Number(value) || value } : item
    ));
  };

  const filteredStock = stock.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Navbar />

      <main className="container" style={{ padding: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: colors.brown }}>
          Stock
        </h2>

        <input
          className="input"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "260px", margin: "20px 0" }}
        />

        <div className="card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.brown}` }}>
                {["Product", "Per Unit Cost", "On Hand", "Free to Use"].map((header) => (
                  <th
                    key={header}
                    style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}
                  >
                    {header}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredStock.map((item) => (
                <tr key={item.id} style={{ borderBottom: `1px dashed ${colors.sage}` }}>
                  <td style={{ padding: "10px" }}>
                    {editingId === item.id ? (
                      <input
                        value={item.product}
                        onChange={(e) => handleEdit(item.id, "product", e.target.value)}
                        className="input"
                        style={{ width: "140px" }}
                      />
                    ) : item.product}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={item.perUnitCost}
                        onChange={(e) => handleEdit(item.id, "perUnitCost", e.target.value)}
                        className="input"
                        style={{ width: "80px" }}
                      />
                    ) : `${item.perUnitCost} Rs`}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={item.onHand}
                        onChange={(e) => handleEdit(item.id, "onHand", e.target.value)}
                        className="input"
                        style={{ width: "80px" }}
                      />
                    ) : item.onHand}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={item.freeToUse}
                        onChange={(e) => handleEdit(item.id, "freeToUse", e.target.value)}
                        className="input"
                        style={{ width: "80px" }}
                      />
                    ) : item.freeToUse}
                  </td>

                  <td style={{ padding: "10px" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                    >
                      {editingId === item.id ? "Save" : "Edit"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </main>
    </div>
  );
}
