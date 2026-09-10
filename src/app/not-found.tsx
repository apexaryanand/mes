import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-lg justify-items-center px-4 py-20 text-center sm:py-28">
      <span className="font-display border-[var(--border-w)] border-fest-ink bg-fest-yellow px-5 py-2 text-5xl font-black text-fest-ink shadow-[var(--shadow-hard)]">
        404
      </span>
      <h1 className="font-display mt-8 text-display-md font-black">Not found</h1>
      <p className="mt-3 text-muted">This page is not part of Kalolsavam Live.</p>
      <Link
        href="/"
        className="festival-button mt-7 inline-flex min-h-11 items-center bg-fest-ink px-5 font-bold text-fest-yellow"
      >
        Home
      </Link>
    </div>
  );
}
