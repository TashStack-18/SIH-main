import { MetadataRoute } from 'next';
import { siteConfig } from '@/src/config/site';
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS } from '@/src/lib/fixtures';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/destinations',
    '/itinerary',
    '/map',
    '/safety',
    '/festivals',
    '/territories',
    '/ai',
    '/privacy'
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const territoryRoutes = VERIFIED_TERRITORIES.map((ut) => ({
    url: `${siteConfig.url}/territories/${ut.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const destRoutes = VERIFIED_DESTINATIONS.map((dest) => ({
    url: `${siteConfig.url}/destinations/${dest.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...territoryRoutes, ...destRoutes];
}
