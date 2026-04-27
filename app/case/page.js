"use client";
import { useState, useEffect } from "react";

export default function CasePage() {
  const [expenses, setExpenses] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
  date: "",
  provider: "",
  description: "",
  amount: "",
  status: "Billed",
  notes: "",
});

  const totalBilled = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalPaid = expenses
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalReimbursed = expenses
    .filter((e) => e.status === "Reimbursed")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const outstanding = totalBilled - totalPaid - totalReimbursed;

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingIndex !== null) {
      const updatedExpenses = [...expenses];
      updatedExpenses[editingIndex] = formData;
      setExpenses(updatedExpenses);
      setEditingIndex(null);
    } else {
      setExpenses([...expenses, formData]);
    }

    setFormData({
      date: "",
      provider: "",
      description: "",
      amount: "",
      status: "Billed",
      notes: "",
    });
  }

  function startEdit(expense, index) {
    setFormData(expense);
    setEditingIndex(index);
  }
  function exportToCSV() {
  const headers = ["Date", "Provider", "Description", "Amount", "Status", "Notes"];

  const rows = expenses.map((expense) => [
    expense.date,
    expense.provider,
    expense.description,
    expense.amount,
    expense.status,
    expense.notes,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((field) => `"${String(field || "").replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "casekeep-expenses.csv";
  link.click();

  URL.revokeObjectURL(url);
}
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">CaseKeep</h1>

      <div className="mb-4 space-y-1">
        <p>Total Billed: ${totalBilled.toFixed(2)}</p>
        <p>Total Paid: ${totalPaid.toFixed(2)}</p>
        <p>Total Reimbursed: ${totalReimbursed.toFixed(2)}</p>
        <p className="font-semibold">Outstanding: ${outstanding.toFixed(2)}</p>
      </div>

      {editingIndex !== null && (
        <p className="mb-3 font-semibold text-blue-600">
          Editing selected expense
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="Date (MM/DD/YYYY)"
          className="border p-2 w-full"
        />

        <input
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          placeholder="Provider"
          className="border p-2 w-full"
        />

        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full"
        />

        <input
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border p-2 w-full"
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          className="border p-2 w-full"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="Billed">Billed</option>
          <option value="Pending Insurance">Pending Insurance</option>
          <option value="Paid">Paid</option>
          <option value="Reimbursed">Reimbursed</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingIndex !== null ? "Update Expense" : "Add Expense"}
        </button>

        {editingIndex !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingIndex(null);
              setFormData({
                date: "",
                provider: "",
                description: "",
                amount: "",
                status: "Billed",
              });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel Edit
          </button>
        )}
      </form>
<button
  onClick={exportToCSV}
  className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
>
  Export CSV
</button>
      {selectedRows.length > 0 && (
        <button
          onClick={() => {
            const confirmDelete = window.confirm(
              `Delete ${selectedRows.length} selected expense(s)?`
            );

            if (confirmDelete) {
              setExpenses(expenses.filter((_, index) => !selectedRows.includes(index)));
              setSelectedRows([]);
            }
          }}
          className="mb-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Selected
        </button>
      )}

      <table className="w-full border border-collapse text-left">
        <thead>
          <tr className="bg-gray-200 text-gray-900">
            <th className="border p-2">Select</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Provider</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Notes</th>
            <th className="border p-2">Edit</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => {
                    if (selectedRows.includes(index)) {
                      setSelectedRows(selectedRows.filter((row) => row !== index));
                    } else {
                      setSelectedRows([...selectedRows, index]);
                    }
                  }}
                />
              </td>

              <td className="border p-2">{expense.date}</td>
              <td className="border p-2">{expense.provider}</td>
              <td className="border p-2">{expense.description}</td>
              <td className="border p-2">${expense.amount}</td>
              <td className="border p-2">{expense.status}</td>
              <td className="border p-2">{expense.notes}</td>

              <td className="border p-2">
                <button
                  onClick={() => startEdit(expense, index)}
                  className="text-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}