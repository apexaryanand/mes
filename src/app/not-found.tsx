import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-4xl">Not found</h1>
      <p className="mt-3 text-muted">This page is not part of Kalolsavam Live.</p>
      <Link href="/" className="mt-6 inline-block text-kerala-dark">
        Home
      </Link>
    </div>
  );
}
