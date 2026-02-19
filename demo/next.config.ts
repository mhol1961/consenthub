import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/consenthub',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
