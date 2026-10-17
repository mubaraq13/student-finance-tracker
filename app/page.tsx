import { Wallet } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Wallet size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Student Finance Tracker
        </h1>
        
        <p className="text-gray-500 mb-6">
          Catat uang masuk dan keluar dengan mudah.
        </p>
        
        {/* INI BAGIAN YANG PENTING: Menggunakan Link, bukan button */}
        <Link 
          href="/login" 
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Mulai Sekarang
        </Link>
      </div>
    </main>
  );
}