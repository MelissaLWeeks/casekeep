import Link from "next/link";

const CheckIcon = () => (
  <span
    aria-hidden="true"
    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B5443B] text-sm font-bold text-[#F5F1EA]"
  >
    ✓
  </span>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F1EA] text-[#2B2D42]">
      <header className="border-b border-[#DED8CF] bg-[#F5F1EA]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex w-fit items-center">
            <img
              src="/casekeep-logo-lockup.svg"
              alt="CaseKeep"
              className="h-16 w-auto"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#2B2D42] px-5 py-2.5 font-bold text-[#2B2D42] transition hover:bg-[#2B2D42] hover:text-[#F5F1EA]"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              style={{ color: "#F5F1EA" }}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#B5443B] px-5 py-2.5 font-bold text-[#F5F1EA] shadow-sm transition hover:bg-[#9F3932]"
            >
              Try CaseKeep free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-[#DED8CF]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.14em] text-[#B5443B]">
                Medical expense and document organization
              </p>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.035em] text-[#2B2D42] md:text-6xl">
                Keep every medical bill, claim, and document organized.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F5F68]">
                CaseKeep gives you one clear place to track accident-related
                medical expenses, payments, adjustments, balances, notes, and
                supporting documents.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  style={{ color: "#F5F1EA" }}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#B5443B] px-7 py-3 font-bold text-[#F5F1EA] shadow-[0_8px_20px_rgba(181,68,59,0.22)] transition hover:-translate-y-0.5 hover:bg-[#9F3932]"
                >
                  Try 5 expenses free
                </Link>

                <a
                  href="#pricing"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#2B2D42] px-7 py-3 font-bold text-[#2B2D42] transition hover:bg-[#2B2D42] hover:text-[#F5F1EA]"
                >
                  View pricing
                </a>
              </div>

              <p className="mt-5 max-w-xl text-xs leading-5 text-[#7D7C84]">
                CaseKeep is an organization tool. It does not provide legal,
                medical, financial, insurance, or tax advice.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DED8CF] bg-white p-7 shadow-[0_18px_45px_rgba(43,45,66,0.1)] sm:p-9">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#B5443B]">
                    Your case at a glance
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold text-[#2B2D42]">
                    Everything important, in one place.
                  </h2>
                </div>

                <img
                  src="/casekeep-logo-icon.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0"
                />
              </div>

              <div className="space-y-4">
                {[
                  "Medical provider and visit details",
                  "Charges, payments, and adjustments",
                  "Remaining balances and payment status",
                  "Notes and supporting documents",
                  "Clean CSV and PDF exports",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckIcon />
                    <p className="font-medium text-[#4D4E59]">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                style={{ color: "#F5F1EA" }}
                className="mt-8 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2B2D42] px-6 py-3 font-bold text-[#F5F1EA] transition hover:bg-[#1F2133]"
              >
                Open CaseKeep
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#B5443B]">
              Clear records. Less stress.
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] text-[#2B2D42] md:text-4xl">
              Built to make medical expense records easier to understand.
            </h2>

            <p className="mt-4 text-lg leading-8 text-[#62636C]">
              Stop searching through bills, portals, spreadsheets, emails, and
              handwritten notes. CaseKeep brings the important details
              together.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-[#DED8CF] bg-white p-7 shadow-[0_8px_24px_rgba(43,45,66,0.07)]">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E5E2] text-xl font-extrabold text-[#B5443B]">
                1
              </div>

              <h3 className="text-xl font-extrabold text-[#2B2D42]">
                Track every expense
              </h3>

              <p className="mt-3 leading-7 text-[#696A73]">
                Record the date, provider, description, charges, payments,
                adjustments, status, and notes for each medical expense.
              </p>
            </article>

            <article className="rounded-2xl border border-[#DED8CF] bg-white p-7 shadow-[0_8px_24px_rgba(43,45,66,0.07)]">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8E8EC] text-xl font-extrabold text-[#2B2D42]">
                2
              </div>

              <h3 className="text-xl font-extrabold text-[#2B2D42]">
                Understand balances
              </h3>

              <p className="mt-3 leading-7 text-[#696A73]">
                See what was billed, what insurance paid, what you paid, what
                was adjusted, and what remains due.
              </p>
            </article>

            <article className="rounded-2xl border border-[#DED8CF] bg-white p-7 shadow-[0_8px_24px_rgba(43,45,66,0.07)]">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5E5E2] text-xl font-extrabold text-[#B5443B]">
                3
              </div>

              <h3 className="text-xl font-extrabold text-[#2B2D42]">
                Export clean reports
              </h3>

              <p className="mt-3 leading-7 text-[#696A73]">
                Export complete or filtered records as CSV and PDF files for
                your own review or to share with the appropriate professional.
              </p>
            </article>
          </div>
        </section>

        <section className="border-y border-[#DED8CF] bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#B5443B]">
                Organized from start to finish
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] text-[#2B2D42] md:text-4xl">
                See the full financial picture of your case.
              </h2>

              <p className="mt-5 text-lg leading-8 text-[#62636C]">
                CaseKeep is designed for accident-related medical record
                organization. It helps you keep the numbers and documents
                clear, searchable, and ready when you need them.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "See total charges at a glance",
                  "Separate insurance payments from self-payments",
                  "Track write-offs and custom adjustments",
                  "Filter by provider, date, or payment status",
                  "Keep documents connected to the right case",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <p className="pt-0.5 font-medium text-[#555660]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="pricing"
              className="rounded-3xl bg-[#2B2D42] p-8 text-[#F5F1EA] shadow-[0_20px_45px_rgba(43,45,66,0.2)] sm:p-10"
            >
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#D9D4CC]">
                Simple pricing
              </p>

              <div className="mt-5 flex items-end gap-3">
                <p className="text-6xl font-extrabold">$49</p>
                <p className="pb-2 text-[#D9D4CC]">one-time per case</p>
              </div>

              <p className="mt-6 text-lg leading-8 text-[#E7E2DA]">
                Start with 5 free expenses and 5 free document uploads. Unlock
                the full case when you are ready to continue.
              </p>

              <div className="mt-7 space-y-3 text-[#F5F1EA]">
                <p>✓ No monthly subscription</p>
                <p>✓ One payment per unlocked case</p>
                <p>✓ Expense and document organization</p>
                <p>✓ CSV and PDF reporting</p>
              </div>

              <Link
                href="/signup"
                style={{ color: "#F5F1EA" }}
                className="mt-8 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B5443B] px-6 py-3 font-bold text-[#F5F1EA] transition hover:bg-[#C65349]"
              >
                Try CaseKeep free
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-[#BBB8BE]">
                Payment processing for full case unlocks will be connected
                before launch.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="rounded-3xl border border-[#DED8CF] bg-white p-8 shadow-[0_10px_30px_rgba(43,45,66,0.07)] sm:p-10">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#B5443B]">
              Product details
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] text-[#2B2D42]">
              Know exactly what CaseKeep provides.
            </h2>

            <div className="mt-9 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-extrabold text-[#2B2D42]">
                  What you are buying
                </h3>

                <p className="mt-2 leading-7 text-[#696A73]">
                  A digital organization tool for entering, calculating,
                  filtering, storing, and exporting accident-related medical
                  expense records.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#2B2D42]">
                  What is included
                </h3>

                <p className="mt-2 leading-7 text-[#696A73]">
                  Expense tracking, multiple adjustments, payment statuses,
                  document organization, case summaries, and export tools.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#2B2D42]">
                  Pricing
                </h3>

                <p className="mt-2 leading-7 text-[#696A73]">
                  Each case begins with a free allowance and can be unlocked
                  separately with a one-time $49 payment.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#2B2D42]">
                  Support
                </h3>

                <p className="mt-2 leading-7 text-[#696A73]">
                  Email{" "}
                  <a
                    href="mailto:support@weekssystems.com"
                    className="font-bold text-[#B5443B] underline decoration-[#B5443B] underline-offset-4"
                  >
                    support@weekssystems.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DED8CF] bg-[#EEE9E1]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm md:grid-cols-3">
          <div>
            <p className="text-xl font-extrabold">
              <span className="text-[#2B2D42]">Case</span>
              <span className="text-[#B5443B]">Keep</span>
            </p>

            <p className="mt-2 text-[#696A73]">A Weeks Systems product.</p>
          </div>

          <div>
            <p className="font-extrabold text-[#2B2D42]">Support</p>

            <a
              href="mailto:support@weekssystems.com"
              className="mt-2 inline-block font-semibold text-[#B5443B] underline underline-offset-4"
            >
              support@weekssystems.com
            </a>
          </div>

          <div>
            <p className="font-extrabold text-[#2B2D42]">Important note</p>

            <p className="mt-2 leading-6 text-[#696A73]">
              CaseKeep does not provide legal, medical, financial, insurance,
              or tax advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}