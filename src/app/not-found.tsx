import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container section-spacing flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="text-6xl mb-4">🧭</div>
      <h1 className="text-3xl font-bold mb-2">Destination Not Found</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
        We could not find the travel destination or page you were looking for across the 8 Union Territories.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn btn-primary">
          Back to Homepage
        </Link>
        <Link href="/territories" className="btn btn-outline">
          Explore 8 UTs
        </Link>
      </div>
    </main>
  );
}
