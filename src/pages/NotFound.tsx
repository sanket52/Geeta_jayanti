import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 text-center">
      <div>
        <div style={{ fontFamily: "var(--font-display)" }} className="text-9xl font-bold text-maroon/10">404</div>
        <div className="text-5xl mb-4 -mt-8">🪔</div>
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-brown mb-3">Page Not Found</h1>
        <p className="text-brown-mid mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Please return to the home page.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-maroon text-cream font-semibold rounded-lg hover:bg-maroon-dark transition-colors text-sm">
            ← Return Home
          </Link>
          <Link to="/contact" className="px-6 py-3 border-2 border-maroon text-maroon font-semibold rounded-lg hover:bg-maroon/5 transition-colors text-sm">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
