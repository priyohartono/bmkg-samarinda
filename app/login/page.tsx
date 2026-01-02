import { Suspense } from "react";
import LoginForm from "./LoginForm"; // Import komponen yang baru dibuat

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Suspense Boundary Wajib untuk useSearchParams */}
      <Suspense fallback={<div className="text-gray-500">Memuat form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}