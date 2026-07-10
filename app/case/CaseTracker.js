"use client";

import { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";

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
const STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/8x27sK2X3epy6whcwEdjO00";

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
    "border border-[#DED8CF] bg-white text-[#2B2D42] p-3 w-full rounded-xl focus:border-[#B5443B] focus:outline-none focus:ring-4 focus:ring-[#B5443B]/10";

  function handleAdjustmentChange(index, field, value) {
    const updated = [...data.adjustments];
    updated[index][field] = value;
    setData({ ...data, adjustments: updated });
  }

  function addAdjustment() {
    setData({
      ...data,
      adjustments: [
        ...data.adjustments,
        { name: "", amount: "" },
      ],
    });
  }

  function removeAdjustment(index) {
    const updated = data.adjustments.filter((_, i) => i !== index);

    setData({
      ...data,
      adjustments: updated.length
        ? updated
        : [{ name: "", amount: "" }],
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
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

      <div className="space-y-4">
        {data.adjustments.map((adjustment, index) => (
          <div
            key={index}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              list="adjustment-suggestions"
              value={adjustment.name}
              onChange={(e) =>
                handleAdjustmentChange(
                  index,
                  "name",
                  e.target.value
                )
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
                  handleAdjustmentChange(
                    index,
                    "amount",
                    e.target.value
                  )
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
                  className="rounded-xl bg-[#2B2D42] px-4 py-3 font-bold !text-[#F5F1EA] hover:bg-[#1F2133]"
                  aria-label="Add adjustment"
                >
                  +
                </button>
              )}

              {data.adjustments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAdjustment(index)}
                  className="rounded-xl border border-[#B5443B] bg-white px-3 py-2 font-bold text-[#B5443B] hover:bg-[#F5E5E2]"
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

        <div className="grid gap-4 md:grid-cols-2">
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
        className="w-full rounded-xl border border-[#DED8CF] bg-white p-3 text-[#2B2D42] focus:border-[#B5443B] focus:outline-none focus:ring-4 focus:ring-[#B5443B]/10"
      />

      <p className="font-bold text-[#2B2D42]">
        Remaining Balance for this expense: $
        {getRemainingBalance(data).toFixed(2)}
      </p>

      <div>
        <button className="casekeep-button-primary">
          {submitLabel}
        </button>

        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-2 rounded-xl border border-[#2B2D42] bg-white px-5 py-3 font-bold text-[#2B2D42] hover:bg-[#2B2D42] hover:text-[#F5F1EA]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function CaseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState(emptyExpense);
  const [editData, setEditData] = useState(emptyExpense);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [adjustmentSuggestions, setAdjustmentSuggestions] =
    useState([]);
  const [exportMode, setExportMode] = useState("all");

  const [filters, setFilters] = useState({
    date: "",
    provider: "",
    status: "",
  });

  const isCaseUnlocked = false;

  const hasReachedFreeLimit =
    !isCaseUnlocked &&
    expenses.length >= FREE_EXPENSE_LIMIT;

  const remainingFreeExpenses = Math.max(
    FREE_EXPENSE_LIMIT - expenses.length,
    0
  );

  useEffect(() => {

    const saved = localStorage.getItem("casekeepExpensesV2");
    const savedSuggestions = localStorage.getItem(
      "casekeepAdjustmentSuggestions"
    );

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
    localStorage.setItem(
      "casekeepExpensesV2",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(
      "casekeepAdjustmentSuggestions",
      JSON.stringify(adjustmentSuggestions)
    );
  }, [adjustmentSuggestions]);

  function handleAddChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleEditChange(e) {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  }

  function cleanExpense(expense, options = {}) {
    const cleaned = {
      ...expense,
      id: expense.id || createId(),
      adjustments: (
        expense.adjustments || [{ name: "", amount: "" }]
      ).map((adj) => ({
        name: String(adj.name || "").trim(),
        amount: adj.amount,
      })),
      statusOverride: Boolean(expense.statusOverride),
    };

    const remainingBalance = getRemainingBalance(cleaned);

    if (remainingBalance === 0) {
      cleaned.status = "Paid";
      cleaned.statusOverride = false;
    } else if (
      !cleaned.statusOverride ||
      options.forceAutoStatus
    ) {
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

  const totalCharges = expenses.reduce(
    (sum, expense) =>
      sum + money(expense.totalCharges),
    0
  );

  const totalAdjustments = expenses.reduce(
    (sum, expense) =>
      sum + getTotalAdjustments(expense),
    0
  );

  const totalInsurancePayments = expenses.reduce(
    (sum, expense) =>
      sum + money(expense.insurancePayment),
    0
  );

  const totalSelfPayments = expenses.reduce(
    (sum, expense) =>
      sum + money(expense.selfPayment),
    0
  );

  const totalRemainingBalance =
    totalCharges -
    totalAdjustments -
    totalInsurancePayments -
    totalSelfPayments;

  const filteredExpenses = expenses
    .map((expense, index) => ({
      ...expense,
      originalIndex: index,
    }))
    .filter((expense) => {
      const matchesDate = true;

      const matchesProvider = filters.provider
        ? expense.provider === filters.provider
        : true;

      const matchesStatus = filters.status
        ? expense.status === filters.status
        : true;

      return (
        matchesDate &&
        matchesProvider &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      if (filters.date === "oldest") {
        return (
          new Date(a.date || 0) -
          new Date(b.date || 0)
        );
      }

      return (
        new Date(b.date || 0) -
        new Date(a.date || 0)
      );
    });

  const exportExpenses =
    exportMode === "filtered"
      ? filteredExpenses
      : expenses.map((expense, index) => ({
          ...expense,
          originalIndex: index,
        }));

  const exportTotalCharges = exportExpenses.reduce(
    (sum, expense) =>
      sum + money(expense.totalCharges),
    0
  );

  const exportTotalAdjustments =
    exportExpenses.reduce(
      (sum, expense) =>
        sum + getTotalAdjustments(expense),
      0
    );

  const exportTotalInsurancePayments =
    exportExpenses.reduce(
      (sum, expense) =>
        sum + money(expense.insurancePayment),
      0
    );

  const exportTotalSelfPayments =
    exportExpenses.reduce(
      (sum, expense) =>
        sum + money(expense.selfPayment),
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
          const label = adj.name
            ? `Adjustment - ${adj.name}`
            : "Adjustment";

          return `${label}: $${money(
            adj.amount
          ).toFixed(2)}`;
        })
        .join(" | "),
      getTotalAdjustments(expense).toFixed(2),
      expense.insurancePayment,
      expense.selfPayment,
      expense.status,
      getRemainingBalance(expense).toFixed(2),
      expense.notes,
    ]);

    const generatedAt =
      new Date().toLocaleString();

    const summary = [
      ["CaseKeep Expense Report"],
      ["Export Generated", generatedAt],
      [
        "Export Type",
        exportMode === "filtered"
          ? "Filtered Records"
          : "All Records",
      ],
      [],
      [
        "Total Charges",
        exportTotalCharges.toFixed(2),
      ],
      [
        "Total Insurance Payments",
        exportTotalInsurancePayments.toFixed(2),
      ],
      [
        "Total Adjustments",
        exportTotalAdjustments.toFixed(2),
      ],
      [
        "Total Insurance Payments + Adjustments",
        (
          exportTotalInsurancePayments +
          exportTotalAdjustments
        ).toFixed(2),
      ],
      [
        "Total Self Payments",
        exportTotalSelfPayments.toFixed(2),
      ],
      [
        "Remaining Balance",
        exportTotalRemainingBalance.toFixed(2),
      ],
      [],
    ];

    const csvContent = [
      ...summary,
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (field) =>
              `"${String(field || "").replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      "casekeep-expense-report.csv";
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
              color: #2B2D42;
              padding: 32px;
              background: #ffffff;
            }

            .header {
              border-bottom: 4px solid #2B2D42;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }

            h1 {
              margin: 0;
              font-size: 30px;
              color: #2B2D42;
            }

            .subtitle {
              margin-top: 8px;
              color: #7D7C84;
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
              border: 1px solid #DED8CF;
              border-radius: 10px;
              padding: 12px;
              background: #F5F1EA;
            }

            .label {
              color: #7D7C84;
              font-size: 12px;
              margin-bottom: 4px;
            }

            .value {
              font-weight: bold;
              font-size: 16px;
              color: #2B2D42;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }

            th {
              background: #2B2D42;
              color: white;
              text-align: left;
              padding: 8px;
              border: 1px solid #2B2D42;
            }

            td {
              padding: 8px;
              border: 1px solid #DED8CF;
              vertical-align: top;
            }

            tr:nth-child(even) {
              background: #F5F1EA;
            }

            .footer {
              margin-top: 24px;
              color: #7D7C84;
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
              <div class="value">$${exportTotalInsurancePayments.toFixed(
                2
              )}</div>
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
              <div class="value">$${exportTotalRemainingBalance.toFixed(
                2
              )}</div>
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
            Generated by CaseKeep. This report is intended to organize medical
            expense records for settlement tracking.
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
    <div className="min-h-screen bg-[#F5F1EA] px-4 py-6 text-[#2B2D42] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex flex-col gap-4 rounded-2xl border border-[#DED8CF] bg-white p-5 shadow-[0_8px_24px_rgba(43,45,66,0.07)] sm:flex-row sm:items-center sm:justify-between">
          <img
            src="/casekeep-logo-lockup.svg"
            alt="CaseKeep"
            className="h-14 w-auto"
          />
          <LogoutButton />
        </div>

        <p className="mb-6 text-[#696A73]">
          Organize accident-related medical expenses, track payments and
          adjustments, and export clean reports for settlement review.
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-[#DED8CF] bg-white p-4 shadow-[0_6px_18px_rgba(43,45,66,0.05)]">
            <p className="text-sm font-semibold text-[#7D7C84]">
              Total Charges
            </p>

            <p className="font-bold text-[#2B2D42]">
              ${totalCharges.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DED8CF] bg-white p-4 shadow-[0_6px_18px_rgba(43,45,66,0.05)]">
            <p className="text-sm font-semibold text-[#7D7C84]">
              Insurance Payments
            </p>

            <p className="font-bold text-[#2B2D42]">
              ${totalInsurancePayments.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DED8CF] bg-white p-4 shadow-[0_6px_18px_rgba(43,45,66,0.05)]">
            <p className="text-sm font-semibold text-[#7D7C84]">
              Adjustments
            </p>

            <p className="font-bold text-[#2B2D42]">
              ${totalAdjustments.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DED8CF] bg-white p-4 shadow-[0_6px_18px_rgba(43,45,66,0.05)]">
            <p className="text-sm font-semibold text-[#7D7C84]">
              Self Payments
            </p>

            <p className="font-bold text-[#2B2D42]">
              ${totalSelfPayments.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DED8CF] bg-white p-4 shadow-[0_6px_18px_rgba(43,45,66,0.05)]">
            <p className="text-sm font-semibold text-[#7D7C84]">
              Remaining Balance
            </p>

            <p className="font-bold text-[#2B2D42]">
              ${totalRemainingBalance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[#DED8CF] bg-white p-5 shadow-[0_8px_24px_rgba(43,45,66,0.07)] sm:p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Add Expense</h2>

              <p className="text-sm font-semibold text-[#7D7C84]">
                {isCaseUnlocked
                  ? "This case is unlocked."
                  : `${remainingFreeExpenses} of ${FREE_EXPENSE_LIMIT} free expenses remaining.`}
              </p>
            </div>

            {!isCaseUnlocked && (
              <div className="rounded-xl border border-[#E4B7B2] bg-[#F8E9E7] p-4 text-sm text-[#7A2F29] md:max-w-sm">
                Try your first {FREE_EXPENSE_LIMIT} expenses free. Unlock the
                full case for $49 when you are ready to continue.
              </div>
            )}
          </div>

          {hasReachedFreeLimit ? (
            <div className="rounded-2xl border border-[#DED8CF] bg-[#FAF8F4] p-5">
              <h3 className="mb-2 text-lg font-extrabold">
                You’ve used your 5 free expenses.
              </h3>

              <p className="mb-4 text-[#696A73]">
                Unlock this case for $49 to continue adding expenses, editing
                your records, and exporting reports.
              </p>

              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#B5443B] px-5 py-3 font-bold !text-[#F5F1EA] hover:bg-[#9F3932]"
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

        <div className="mb-4 rounded-2xl border border-[#DED8CF] bg-white p-5 shadow-[0_6px_18px_rgba(43,45,66,0.05)]">
          <h2 className="mb-3 text-xl font-extrabold">Filter</h2>

          <div className="grid gap-3 md:grid-cols-3">
            <select
              onChange={(e) =>
                setFilters({ ...filters, date: e.target.value })
              }
              className="w-full rounded-xl border border-[#DED8CF] bg-white p-3 text-[#2B2D42] focus:border-[#B5443B] focus:outline-none focus:ring-4 focus:ring-[#B5443B]/10"
            >
              <option value="">Date (Newest First)</option>
              <option value="oldest">Date (Oldest First)</option>
            </select>

            <select
              onChange={(e) =>
                setFilters({ ...filters, provider: e.target.value })
              }
              className="w-full rounded-xl border border-[#DED8CF] bg-white p-3 text-[#2B2D42] focus:border-[#B5443B] focus:outline-none focus:ring-4 focus:ring-[#B5443B]/10"
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

            <select
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full rounded-xl border border-[#DED8CF] bg-white p-3 text-[#2B2D42] focus:border-[#B5443B] focus:outline-none focus:ring-4 focus:ring-[#B5443B]/10"
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

        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={exportMode}
            onChange={(e) => setExportMode(e.target.value)}
            className="rounded-xl border border-[#DED8CF] bg-white px-4 py-3 text-[#2B2D42] focus:border-[#B5443B] focus:outline-none"
          >
            <option value="all">Export All Records</option>
            <option value="filtered">Export Filtered Records</option>
          </select>

          <button
            onClick={exportToCSV}
            className="rounded-xl bg-[#B5443B] px-4 py-3 font-bold !text-[#F5F1EA] hover:bg-[#9F3932]"
          >
            Export CSV
          </button>

          <button
            onClick={exportToPDF}
            className="rounded-xl bg-[#2B2D42] px-4 py-3 font-bold !text-[#F5F1EA] hover:bg-[#1F2133]"
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
                  setExpenses(
                    expenses.filter(
                      (_, index) => !selectedRows.includes(index)
                    )
                  );

                  setSelectedRows([]);
                }
              }}
              className="rounded-xl border border-[#B5443B] bg-white px-4 py-3 font-bold text-[#B5443B] hover:bg-[#F5E5E2]"
            >
              Delete Selected
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#DED8CF] bg-white shadow-[0_8px_24px_rgba(43,45,66,0.06)]">
          <table className="w-full border-collapse bg-white text-left text-sm text-[#2B2D42]">
            <thead>
              <tr className="bg-[#2B2D42] text-[#F5F1EA]">
                <th className="border-b border-r border-[#DED8CF] p-3">
                  Select
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Date
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Location
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Provider
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Description
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Total Charges
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Adjustments
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Insurance Payment
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Self Payment
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Remaining Balance
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Status
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Notes
                </th>

                <th className="border-b border-r border-[#DED8CF] p-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan="13"
                    className="border-b border-[#DED8CF] p-8 text-center text-[#7D7C84]"
                  >
                    No expenses found. Add an expense or adjust your filters.
                  </td>
                </tr>
              )}

              {filteredExpenses.map((expense) => (
                <tr key={expense.id || expense.originalIndex}>
                  <td className="border-b border-r border-[#DED8CF] p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(expense.originalIndex)}
                      onChange={() => {
                        if (
                          selectedRows.includes(expense.originalIndex)
                        ) {
                          setSelectedRows(
                            selectedRows.filter(
                              (row) => row !== expense.originalIndex
                            )
                          );
                        } else {
                          setSelectedRows([
                            ...selectedRows,
                            expense.originalIndex,
                          ]);
                        }
                      }}
                    />
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    {expense.date}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    {expense.location}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    {expense.provider}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    {expense.description}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    ${money(expense.totalCharges).toFixed(2)}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    {(expense.adjustments || []).map((adj, index) => (
                      <div key={index}>
                        Adjustment{adj.name ? ` - ${adj.name}` : ""}: $
                        {money(adj.amount).toFixed(2)}
                      </div>
                    ))}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    ${money(expense.insurancePayment).toFixed(2)}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    ${money(expense.selfPayment).toFixed(2)}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    ${getRemainingBalance(expense).toFixed(2)}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
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
                      className="rounded-lg border border-[#DED8CF] bg-white p-2 text-[#2B2D42]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    {expense.notes}
                  </td>

                  <td className="border-b border-r border-[#DED8CF] p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          startEdit(expense, expense.originalIndex)
                        }
                        className="font-bold text-[#2B2D42] underline underline-offset-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          const confirmDelete =
                            window.confirm("Delete this expense?");

                          if (confirmDelete) {
                            setExpenses(
                              expenses.filter(
                                (_, index) =>
                                  index !== expense.originalIndex
                              )
                            );

                            setSelectedRows(
                              selectedRows.filter(
                                (row) =>
                                  row !== expense.originalIndex
                              )
                            );
                          }
                        }}
                        className="font-bold text-[#B5443B] underline underline-offset-4"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2D42]/70 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#DED8CF] bg-white p-6 text-[#2B2D42] shadow-2xl">
              <h2 className="mb-4 text-2xl font-extrabold">
                Edit Expense
              </h2>

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
    </div>
  );
}