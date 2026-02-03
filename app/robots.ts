import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Jangan indeks API
    },
    sitemap: 'https://cuaca.bmkg-samarinda.go.id/sitemap.xml', // Ganti domain
  };
}