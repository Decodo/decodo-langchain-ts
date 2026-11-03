import type { MapSiteRequest } from '@decodo/sdk-ts';
import { SiteDiscoveryInputType } from '../schema';

type SiteDiscoveryParams = Pick<
  MapSiteRequest,
  'url' | 'sitemap' | 'domain_filter' | 'select_paths' | 'exclude_paths' | 'geo' | 'locale'
>;

export const siteDiscoveryParams = ({
  url,
  sitemap,
  domainFilter,
  selectPaths,
  excludePaths,
  geo,
  locale,
}: SiteDiscoveryInputType): SiteDiscoveryParams => ({
  url,
  ...(sitemap && { sitemap }),
  ...(domainFilter && { domain_filter: domainFilter }),
  ...(selectPaths?.length && { select_paths: selectPaths }),
  ...(excludePaths?.length && { exclude_paths: excludePaths }),
  ...(geo && { geo }),
  ...(locale && { locale }),
});
