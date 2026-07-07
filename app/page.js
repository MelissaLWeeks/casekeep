import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">CaseKeep</p>
            <p className="text-sm text-gray-600">
              By Weeks Systems
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="border border-gray-300 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-center"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-center"
            >
              Try 5 expenses free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-3">
                Medical expense tracking for accident-related settlement organization
              </p>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Keep every medical bill, payment, adjustment, and balance organized.
              </h1>

              <p className="text-lg text-gray-700 mb-8">
                CaseKeep helps you organize accident-related medical expenses,
                track charges, insurance payments, self payments, adjustments,
                remaining balances, and export clean CSV and PDF reports for
                settlement review.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-center"
                >
                  Try 5 expenses free
                </Link>

                <a
                  href="#pricing"
                  className="border border-gray-300 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold text-center"
                >
                  View pricing
                </a>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                CaseKeep is an organization tool. It does not provide legal,
                medical, financial, insurance, or tax advice.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">What CaseKeep tracks</p>

              <div className="space-y-3 text-sm text-gray-700 mt-4">
                <p>✓ Medical provider and visit details</p>
                <p>✓ Total charges</p>
                <p>✓ Insurance payments</p>
                <p>✓ Self payments</p>
                <p>✓ Multiple adjustments or write-offs</p>
                <p>✓ Remaining balance</p>
                <p>✓ Status: Billed, Partially Paid, or Paid</p>
                <p>✓ Notes for each expense</p>
              </div>

              <Link
                href="/signup"
                className="mt-6 block w-full bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-center"
              >
                Open CaseKeep
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-3">
              Built to make settlement-related expense records easier to explain.
            </h2>
            <p className="text-gray-700">
              CaseKeep keeps important medical expense numbers in one dashboard
              instead of scattered across bills, portals, spreadsheets, and notes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Track every expense</h3>
              <p className="text-gray-600">
                Add the date, location, provider, description, charges, payments,
                adjustments, status, and notes for each accident-related expense.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Calculate balances</h3>
              <p className="text-gray-600">
                CaseKeep calculates remaining balances using charges,
                adjustments, insurance payments, and self payments.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Export clean reports</h3>
              <p className="text-gray-600">
                Export all records or filtered records as CSV or PDF with a
                generated date and time stamp.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Designed for accident-related medical bill organization.
              </h2>

              <p className="text-gray-700 mb-5">
                CaseKeep is not a reimbursement app and does not replace legal,
                medical, insurance, tax, or financial advice. It is a digital
                organization tool for keeping medical expense records clear and
                exportable.
              </p>

              <ul className="space-y-3 text-gray-700">
                <li>✓ See total charges at a glance</li>
                <li>✓ Separate insurance payments from self payments</li>
                <li>✓ Track write-offs and other adjustments</li>
                <li>✓ Filter by provider or payment status</li>
                <li>✓ Export reports for review</li>
              </ul>
            </div>

            <div
              id="pricing"
              className="bg-gray-900 text-white rounded-2xl p-8 shadow-sm"
            >
              <p className="text-sm text-gray-300 mb-2">Simple launch pricing</p>

              <p className="text-5xl font-bold mb-3">$49</p>

              <p className="text-gray-300 mb-4">
                One-time unlock per case.
              </p>

              <p className="text-gray-300 mb-6">
                Start with 5 expenses free. Unlock the full case for $49 to
                continue organizing expenses and exporting records.
              </p>

              <Link
                href="/signup"
                className="block bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold text-center"
              >
                Try 5 expenses free
              </Link>

              <p className="text-xs text-gray-400 mt-4">
                Stripe payment connection will be added for full case unlocks.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-4">
              Product details
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What you are buying
                </h3>
                <p>
                  CaseKeep is a digital medical expense organization tool.
                  It helps users enter, calculate, filter, and export
                  accident-related medical expense records.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What is included
                </h3>
                <p>
                  Each case includes expense tracking, multiple adjustments,
                  status tracking, CSV export, PDF export, and generated
                  date/time stamps on exports.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Price
                </h3>
                <p>
                  CaseKeep is planned as a $49 one-time unlock per case. Each
                  separate named case is unlocked separately.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Support
                </h3>
                <p>
                  Email support:{" "}
                  <a
                    href="mailto:support@weekssystems.com"
                    className="text-blue-700 underline"
                  >
                    support@weekssystems.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business</h3>
              <p>CaseKeep by Weeks Systems</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p>
                <a
                  href="mailto:support@weekssystems.com"
                  className="text-blue-700 underline"
                >
                  support@weekssystems.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Important note
              </h3>
              <p>
                CaseKeep is an organization tool and does not provide legal,
                medical, financial, insurance, or tax advice.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}