import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost'], // Dodaj tutaj domeny, z których pobierasz obrazy
    },
}

export default nextConfig;
