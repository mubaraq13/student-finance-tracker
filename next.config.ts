import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tambahkan baris ini untuk mengizinkan akses dari jaringan lokal/HP kamu
  allowedDevOrigins: ['192.168.18.10'],
};

export default nextConfig;