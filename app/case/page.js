"use client";
import { useState, useEffect } from "react";

const emptyExpense = {
  id: "",
  date: "",
  location: "",
  provider: "",
  description: "",
  totalCharges: "",
  adjustments: [{ name: "", amount: "" }],
  insurancePayment: "",
  selfPayment: "",
  status: "Billed",
  statusOverride: false,
  notes: "",
};

const statusOptions = ["Billed", "Partially Paid", "Paid"];

const FREE_EXPENSE_LIMIT = 5;
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/8x27sK2X3epy6whcwEdjO00";

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function money(value) {
  return Number(value || 0);
}
function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function getTotalAdjustments(expense) {
  return (expense.adjustments || []).reduce((sum, adj) => {
    return sum + money(adj.amount);
  }, 0);
}

function getRemainingBalance(expense) {
  return (
    money(expense.totalCharges) -
    getTotalAdjustments(expense) -
    money(expense.insurancePayment) -
    money(expense.selfPayment)
  );
}

function getAutoStatus(expense) {
  const remainingBalance = getRemainingBalance(expense);

  if (remainingBalance === 0) {
    return "Paid";
  }

  if (
    money(expense.insurancePayment) > 0 ||
    money(expense.selfPayment) > 0
  ) {
    return "Partially Paid";
  }

  return "Billed";
}

function ExpenseForm({
  data,
  setData,
  onChange,
  onSubmit,
  submitLabel,
  showCancel,
  onCancel,
  adjustmentSuggestions,
}) {
  const inputClass =
    "border border-gray-300 bg-white text-gray-900 p-2 w-full rounded";
  function handleAdjustmentChange(index, field, value) {
    const updated = [...data.adjustments];
    updated[index][field] = value;
    setData({ ...data, adjustments: updated });
  }

  function addAdjustment() {
    setData({
      ...data,
      adjustments: [...data.adjustments, { name: "", amount: "" }],
    });
  }

  function removeAdjustment(index) {
    const updated = data.adjustments.filter((_, i) => i !== index);
    setData({
      ...data,
      adjustments: updated.length ? updated : [{ name: "", amount: "" }],
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input
          type="date"
          name="date"
          value={data.date}
          onChange={onChange}
          className={inputClass}
        />

        <input
          name="location"
          value={data.location}
          onChange={onChange}
          placeholder="Location"
          className={inputClass}
        />

        <input
          name="provider"
          value={data.provider}
          onChange={onChange}
          placeholder="Provider"
          className={inputClass}
        />

        <input
          name="description"
          value={data.description}
          onChange={onChange}
          placeholder="Description"
          className={inputClass}
        />

        <input
          type="number"
          step="0.01"
          min="0"
          name="totalCharges"
          value={data.totalCharges}
          onChange={onChange}
          placeholder="Total Charges"
          className={inputClass}
        />

        <input
          type="number"
          step="0.01"
          min="0"
          name="insurancePayment"
          value={data.insurancePayment}
          onChange={onChange}
          placeholder="Insurance Payment"
          className={inputClass}
        />
      </div>

       <div className="space-y-3">
        {data.adjustments.map((adjustment, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-3">
            <input
              list="adjustment-suggestions"
              value={adjustment.name}
              onChange={(e) =>
                handleAdjustmentChange(index, "name", e.target.value)
              }
              placeholder={
                index === 0
                  ? "Adjustment Name / Type"
                  : "Additional Adjustment Name / Type"
              }
              className={inputClass}
            />

            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={adjustment.amount}
                onChange={(e) =>
                  handleAdjustmentChange(index, "amount", e.target.value)
                }
                placeholder={
                  index === 0
                    ? "Adjustment Amount"
                    : "Additional Adjustment Amount"
                }
                className={inputClass}
              />

              {index === data.adjustments.length - 1 && (
                <button
                  type="button"
                  onClick={addAdjustment}
                  className="bg-gray-900 text-white px-4 py-2 rounded"
                  aria-label="Add adjustment"
                >
                  +
                </button>
              )}

              {data.adjustments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAdjustment(index)}
                  className="bg-red-600 text-white px-3 py-2 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <datalist id="adjustment-suggestions">
          {adjustmentSuggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="number"
            step="0.01"
            min="0"
            name="selfPayment"
            value={data.selfPayment}
            onChange={onChange}
            placeholder="Self Payment"
            className={inputClass}
          />
        </div>
      </div>

      <textarea
        name="notes"
        value={data.notes}
        onChange={onChange}
        placeholder="Notes"
        className="border border-gray-300 bg-white text-gray-900 p-2 w-full rounded"
      />

      <p className="font-semibold">
        Remaining Balance for this expense: ${getRemainingBalance(data).toFixed(2)}
      </p>

      <div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {submitLabel}
        </button>

        {showCancel && (
          <button type="button" onClick={onCancel} className="ml-2 bg-gray-600 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function CasePage() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState(emptyExpense);
  const [editData, setEditData] = useState(emptyExpense);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [adjustmentSuggestions, setAdjustmentSuggestions] = useState([]);
  const [exportMode, setExportMode] = useState("all");

  const [filters, setFilters] = useState({
    date: "",
    provider: "",
    status: "",
  });

  const isCaseUnlocked = false;
  const hasReachedFreeLimit =
    !isCaseUnlocked && expenses.length >= FREE_EXPENSE_LIMIT;
  const remainingFreeExpenses = Math.max(
    FREE_EXPENSE_LIMIT - expenses.length,
    0
  );

  useEffect(() => {
    const saved = localStorage.getItem("casekeepExpensesV2");
    const savedSuggestions = localStorage.getItem("casekeepAdjustmentSuggestions");

    if (saved) {
  const parsedExpenses = JSON.parse(saved).map((expense) =>
    cleanExpense({
      ...expense,
      id: expense.id || createId(),
      statusOverride: Boolean(expense.statusOverride),
    })
  );

  setExpenses(parsedExpenses);
}

    if (savedSuggestions) {
      setAdjustmentSuggestions(JSON.parse(savedSuggestions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("casekeepExpensesV2", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("casekeepAdjustmentSuggestions", JSON.stringify(adjustmentSuggestions));
  }, [adjustmentSuggestions]);

  function handleAddChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleEditChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  function cleanExpense(expense, options = {}) {
  const cleaned = {
    ...expense,
    id: expense.id || createId(),
    adjustments: (expense.adjustments || [{ name: "", amount: "" }]).map((adj) => ({
      name: String(adj.name || "").trim(),
      amount: adj.amount,
    })),
    statusOverride: Boolean(expense.statusOverride),
  };

  const remainingBalance = getRemainingBalance(cleaned);

  if (remainingBalance === 0) {
    cleaned.status = "Paid";
    cleaned.statusOverride = false;
  } else if (!cleaned.statusOverride || options.forceAutoStatus) {
    cleaned.status = getAutoStatus(cleaned);
  }

  return cleaned;
}

  function saveAdjustmentSuggestions(expense) {
    const names = expense.adjustments
      .map((adj) => adj.name.trim())
      .filter(Boolean);

    setAdjustmentSuggestions([
      ...new Set([...adjustmentSuggestions, ...names]),
    ]);
  }

  function addExpense(e) {
    e.preventDefault();

    if (hasReachedFreeLimit) {
      return;
    }

    const newExpense = cleanExpense({
      ...formData,
      id: createId(),
      statusOverride: false,
    });
    
    saveAdjustmentSuggestions(newExpense);

    setExpenses([...expenses, newExpense]);
    setFormData({
  ...emptyExpense,
  adjustments: [{ name: "", amount: "" }],
});
  }

  function startEdit(expense, index) {
    setEditData({
      ...expense,
      adjustments:
        expense.adjustments && expense.adjustments.length
          ? expense.adjustments
          : [{ name: "", amount: "" }],
    });
    setEditingIndex(index);
  }

  function saveEdit(e) {
    e.preventDefault();

    const updatedExpense = cleanExpense(editData);
    saveAdjustmentSuggestions(updatedExpense);

    const updated = [...expenses];
    updated[editingIndex] = updatedExpense;

    setExpenses(updated);
    setEditingIndex(null);
    setEditData({
  ...emptyExpense,
  adjustments: [{ name: "", amount: "" }],
});
  }
  function cancelEdit() {
    setEditingIndex(null);
    setEditData({
  ...emptyExpense,
  adjustments: [{ name: "", amount: "" }],
});
  }
  const totalCharges = expenses.reduce((sum, e) => sum + money(e.totalCharges), 0);
  const totalAdjustments = expenses.reduce((sum, e) => sum + getTotalAdjustments(e), 0);
  const totalInsurancePayments = expenses.reduce((sum, e) => sum + money(e.insurancePayment), 0);
  const totalSelfPayments = expenses.reduce((sum, e) => sum + money(e.selfPayment), 0);
  const totalRemainingBalance = totalCharges - totalAdjustments - totalInsurancePayments - totalSelfPayments;

  const filteredExpenses = expenses
    .map((expense, index) => ({ ...expense, originalIndex: index }))
    .filter((expense) => {
      const matchesDate = true;

      const matchesProvider = filters.provider
        ? expense.provider === filters.provider
        : true;
      const matchesStatus = filters.status
      ? expense.status === filters.status
      : true;

      return matchesDate && matchesProvider && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.date === "oldest") {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

    const exportExpenses =
    exportMode === "filtered"
      ? filteredExpenses
      : expenses.map((expense, index) => ({
          ...expense,
          originalIndex: index,
        }));

  const exportTotalCharges = exportExpenses.reduce(
    (sum, e) => sum + money(e.totalCharges),
    0
  );

  const exportTotalAdjustments = exportExpenses.reduce(
    (sum, e) => sum + getTotalAdjustments(e),
    0
  );

  const exportTotalInsurancePayments = exportExpenses.reduce(
    (sum, e) => sum + money(e.insurancePayment),
    0
  );

  const exportTotalSelfPayments = exportExpenses.reduce(
    (sum, e) => sum + money(e.selfPayment),
    0
  );

  const exportTotalRemainingBalance =
    exportTotalCharges -
    exportTotalAdjustments -
    exportTotalInsurancePayments -
    exportTotalSelfPayments;

  function exportToCSV() {
    const headers = [
      "Date",
      "Location",
      "Provider",
      "Description",
      "Total Charges",
      "Adjustments",
      "Total Adjustments",
      "Insurance Payment",
      "Self Payment",
      "Status",
      "Remaining Balance",
      "Notes",
    ];

    const rows = exportExpenses.map((expense) => [
      expense.date,
      expense.location,
      expense.provider,
      expense.description,
      expense.totalCharges,
      expense.adjustments
        .map((adj) => {
          const label = adj.name ? `Adjustment - ${adj.name}` : "Adjustment";
          return `${label}: $${money(adj.amount).toFixed(2)}`;
        })
        .join(" | "),
      getTotalAdjustments(expense).toFixed(2),
      expense.insurancePayment,
      expense.selfPayment,
      expense.status,
      getRemainingBalance(expense).toFixed(2),
      expense.notes,
    ]);

    const generatedAt = new Date().toLocaleString();

    const summary = [
      ["CaseKeep Expense Report"],
      ["Export Generated", generatedAt],
      ["Export Type", exportMode === "filtered" ? "Filtered Records" : "All Records"],
      [],
      ["Total Charges", exportTotalCharges.toFixed(2)],
      ["Total Insurance Payments", exportTotalInsurancePayments.toFixed(2)],
      ["Total Adjustments", exportTotalAdjustments.toFixed(2)],
      [
        "Total Insurance Payments + Adjustments",
        (exportTotalInsurancePayments + exportTotalAdjustments).toFixed(2),
      ],
      ["Total Self Payments", exportTotalSelfPayments.toFixed(2)],
      ["Remaining Balance", exportTotalRemainingBalance.toFixed(2)],
      [],
    ];

    const csvContent = [...summary, headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field || "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "casekeep-expense-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }
  function exportToPDF() {
    const generatedAt = new Date().toLocaleString();

    const reportRows = exportExpenses
      .map((expense) => {
        const adjustments = (expense.adjustments || [])
          .map((adj) => {
            const label = adj.name
  ? `Adjustment - ${escapeHtml(adj.name)}`
  : "Adjustment";

return `${label}: $${money(adj.amount).toFixed(2)}`;
          })
          .join("<br />");

return `
  <tr>
    <td>${escapeHtml(expense.date)}</td>
    <td>${escapeHtml(expense.location)}</td>
    <td>${escapeHtml(expense.provider)}</td>
    <td>${escapeHtml(expense.description)}</td>
    <td>$${money(expense.totalCharges).toFixed(2)}</td>
    <td>${adjustments}</td>
    <td>$${money(expense.insurancePayment).toFixed(2)}</td>
    <td>$${money(expense.selfPayment).toFixed(2)}</td>
    <td>$${getRemainingBalance(expense).toFixed(2)}</td>
    <td>${escapeHtml(expense.status)}</td>
    <td>${escapeHtml(expense.notes)}</td>
  </tr>
`;
      })
      .join("");

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      alert("Please allow popups to export the PDF report.");
      return;
    }

    reportWindow.document.write(`
      <html>
        <head>
          <title>CaseKeep Expense Report</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              color: #111827;
              padding: 32px;
              background: #ffffff;
            }

            .header {
              border-bottom: 4px solid #111827;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }

            h1 {
              margin: 0;
              font-size: 30px;
              color: #111827;
            }

            .subtitle {
              margin-top: 8px;
              color: #4b5563;
              font-size: 14px;
              line-height: 1.5;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              margin-bottom: 24px;
            }

            .card {
              border: 1px solid #d1d5db;
              border-radius: 10px;
              padding: 12px;
              background: #f9fafb;
            }

            .label {
              color: #6b7280;
              font-size: 12px;
              margin-bottom: 4px;
            }

            .value {
              font-weight: bold;
              font-size: 16px;
              color: #111827;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }

            th {
              background: #111827;
              color: white;
              text-align: left;
              padding: 8px;
              border: 1px solid #111827;
            }

            td {
              padding: 8px;
              border: 1px solid #d1d5db;
              vertical-align: top;
            }

            tr:nth-child(even) {
              background: #f9fafb;
            }

            .footer {
              margin-top: 24px;
              color: #6b7280;
              font-size: 12px;
              line-height: 1.5;
            }

            @media print {
              body {
                padding: 16px;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <h1>CaseKeep Expense Report</h1>
            <div class="subtitle">
              Export Generated: ${generatedAt}<br />
              Export Type: ${
                exportMode === "filtered" ? "Filtered Records" : "All Records"
              }<br />
              Records Included: ${exportExpenses.length}
            </div>
          </div>

          <div class="summary">
            <div class="card">
              <div class="label">Total Charges</div>
              <div class="value">$${exportTotalCharges.toFixed(2)}</div>
            </div>

            <div class="card">
              <div class="label">Insurance Payments</div>
              <div class="value">$${exportTotalInsurancePayments.toFixed(2)}</div>
            </div>

            <div class="card">
              <div class="label">Adjustments</div>
              <div class="value">$${exportTotalAdjustments.toFixed(2)}</div>
            </div>

            <div class="card">
              <div class="label">Self Payments</div>
              <div class="value">$${exportTotalSelfPayments.toFixed(2)}</div>
            </div>

            <div class="card">
              <div class="label">Remaining Balance</div>
              <div class="value">$${exportTotalRemainingBalance.toFixed(2)}</div>
            </div>

            <div class="card">
              <div class="label">Report Type</div>
              <div class="value">${
                exportMode === "filtered" ? "Filtered" : "Full"
              }</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Provider</th>
                <th>Description</th>
                <th>Total Charges</th>
                <th>Adjustments</th>
                <th>Insurance</th>
                <th>Self Pay</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              ${
                reportRows ||
                `<tr><td colspan="11">No expenses available for this report.</td></tr>`
              }
            </tbody>
          </table>

          <div class="footer">
            Generated by CaseKeep. This report is intended to organize medical expense records for settlement tracking.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    reportWindow.document.close();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white text-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold mb-2">CaseKeep</h1>
      <p className="mb-6 text-gray-700">
        Organize accident-related medical expenses, track payments and adjustments,
        and export clean reports for settlement review.
      </p>

      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <div className="border border-gray-300 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Total Charges</p>
          <p className="font-semibold">${totalCharges.toFixed(2)}</p>
        </div>
        <div className="border border-gray-300 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Insurance Payments</p>
          <p className="font-semibold">${totalInsurancePayments.toFixed(2)}</p>
        </div>
        <div className="border border-gray-300 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Adjustments</p>
          <p className="font-semibold">${totalAdjustments.toFixed(2)}</p>
        </div>
        <div className="border border-gray-300 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Self Payments</p>
          <p className="font-semibold">${totalSelfPayments.toFixed(2)}</p>
        </div>
        <div className="border border-gray-300 bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Remaining Balance</p>
          <p className="font-semibold">${totalRemainingBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="border border-gray-300 bg-white p-4 rounded mb-8">
  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
    <div>
      <h2 className="text-xl font-semibold">Add Expense</h2>
      <p className="text-sm text-gray-600">
        {isCaseUnlocked
          ? "This case is unlocked."
          : `${remainingFreeExpenses} of ${FREE_EXPENSE_LIMIT} free expenses remaining.`}
      </p>
    </div>

    {!isCaseUnlocked && (
      <div className="border border-blue-200 bg-blue-50 text-blue-900 rounded p-3 text-sm md:max-w-sm">
        Try your first {FREE_EXPENSE_LIMIT} expenses free. Unlock the full
        case for $49 when you are ready to continue.
      </div>
    )}
  </div>

  {hasReachedFreeLimit ? (
    <div className="border border-gray-300 bg-gray-50 rounded p-5">
      <h3 className="text-lg font-semibold mb-2">
        You’ve used your 5 free expenses.
      </h3>
      <p className="text-gray-700 mb-4">
        Unlock this case for $49 to continue adding expenses, editing your
        records, and exporting reports.
      </p>

      <a
        href={STRIPE_PAYMENT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-700 text-white px-5 py-3 rounded font-semibold"
      >
        Unlock full case for $49
      </a>
    </div>
  ) : (
    <ExpenseForm
          data={formData}
          setData={setFormData}
          onChange={handleAddChange}
          onSubmit={addExpense}
          submitLabel="Add Expense"
    adjustmentSuggestions={adjustmentSuggestions}
  />
  )}
</div>

     <div className="border border-gray-300 bg-gray-50 p-4 rounded mb-4">
  <h2 className="text-xl font-semibold mb-3">Filter</h2>

  <div className="grid md:grid-cols-3 gap-3">
    
    {/* DATE SORT */}
    <select
      onChange={(e) =>
        setFilters({ ...filters, date: e.target.value })
      }
      className="border border-gray-300 bg-white text-gray-900 p-2 w-full rounded"
    >
      <option value="">Date (Newest First)</option>
      <option value="oldest">Date (Oldest First)</option>
    </select>

    {/* PROVIDER FILTER */}
    <select
      onChange={(e) =>
        setFilters({ ...filters, provider: e.target.value })
      }
      className="border border-gray-300 bg-white text-gray-900 p-2 w-full rounded"
    >
      <option value="">All Providers</option>
      {[...new Set(expenses.map((e) => e.provider))]
        .filter(Boolean)
        .map((provider) => (
          <option key={provider} value={provider}>
            {provider}
          </option>
        ))}
    </select>

    {/* STATUS FILTER */}
    <select
      onChange={(e) =>
        setFilters({ ...filters, status: e.target.value })
      }
      className="border border-gray-300 bg-white text-gray-900 p-2 w-full rounded"
    >
      <option value="">All Statuses</option>
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>

  </div>
</div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={exportMode}
          onChange={(e) => setExportMode(e.target.value)}
          className="border border-gray-300 bg-white text-gray-900 px-3 py-2 rounded"
        >
          <option value="all">Export All Records</option>
          <option value="filtered">Export Filtered Records</option>
        </select>

        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={exportToPDF}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Export PDF
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
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Selected
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-collapse text-left text-sm bg-white text-gray-900">
          <thead>
            <tr className="bg-gray-200 text-gray-900">
              <th className="border border-gray-300 p-2">Select</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Location</th>
              <th className="border border-gray-300 p-2">Provider</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Total Charges</th>
              <th className="border border-gray-300 p-2">Adjustments</th>
              <th className="border border-gray-300 p-2">Insurance Payment</th>
              <th className="border border-gray-300 p-2">Self Payment</th>
              <th className="border border-gray-300 p-2">Remaining Balance</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Notes</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.length === 0 && (
              <tr>
                <td
                  colSpan="13"
                  className="border border-gray-300 p-6 text-center text-gray-600"
                >
                  No expenses found. Add an expense or adjust your filters.
                </td>
              </tr>
            )}

            {filteredExpenses.map((expense) => (

              <tr key={expense.id || expense.originalIndex}>
                <td className="border border-gray-300 p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(expense.originalIndex)}
                    onChange={() => {
                      if (selectedRows.includes(expense.originalIndex)) {
                        setSelectedRows(selectedRows.filter((row) => row !== expense.originalIndex));
                      } else {
                        setSelectedRows([...selectedRows, expense.originalIndex]);
                      }
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2">{expense.date}</td>
                <td className="border border-gray-300 p-2">{expense.location}</td>
                <td className="border border-gray-300 p-2">{expense.provider}</td>
                <td className="border border-gray-300 p-2">{expense.description}</td>
                <td className="border border-gray-300 p-2">${money(expense.totalCharges).toFixed(2)}</td>
                <td className="border border-gray-300 p-2">
                  {(expense.adjustments || []).map((adj, i) => (
                    <div key={i}>
                      Adjustment{adj.name ? ` - ${adj.name}` : ""}: ${money(adj.amount).toFixed(2)}
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 p-2">${money(expense.insurancePayment).toFixed(2)}</td>
                <td className="border border-gray-300 p-2">${money(expense.selfPayment).toFixed(2)}</td>
                <td className="border border-gray-300 p-2">${getRemainingBalance(expense).toFixed(2)}</td>
                <td className="border border-gray-300 p-2">
  <select
  value={expense.status}
  onChange={(e) => {
    const updated = [...expenses];

    updated[expense.originalIndex] = {
      ...updated[expense.originalIndex],
      status: e.target.value,
      statusOverride: true,
    };

    setExpenses(updated);
  }}
  className="border border-gray-300 bg-white text-gray-900 p-1 rounded"
>
    {statusOptions.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
</td>
                <td className="border border-gray-300 p-2">{expense.notes}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(expense, expense.originalIndex)}
                      className="text-blue-700 underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Delete this expense?"
                        );

                        if (confirmDelete) {
                          setExpenses(
                            expenses.filter(
                              (_, index) => index !== expense.originalIndex
                            )
                          );

                          setSelectedRows(
                            selectedRows.filter(
                              (row) => row !== expense.originalIndex
                            )
                          );
                        }
                      }}
                      className="text-red-700 underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-300">
            <h2 className="text-2xl font-semibold mb-4">Edit Expense</h2>

            <ExpenseForm
              data={editData}
              setData={setEditData}
              onChange={handleEditChange}
              onSubmit={saveEdit}
              submitLabel="Save Changes"
              showCancel={true}
              onCancel={cancelEdit}
              adjustmentSuggestions={adjustmentSuggestions}
            />
          </div>
        </div>
      )}
    </div>
  );
  }
