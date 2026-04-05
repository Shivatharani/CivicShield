import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
          <h1 className="font-bold">CivicShield</h1>

          <div>
            <Link href="/" className="mr-4">Home</Link>
            <Link href="/admin">Dashboard</Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}