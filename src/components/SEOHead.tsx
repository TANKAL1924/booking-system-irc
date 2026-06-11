import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string;
  noSuffix?: boolean;
}

const BASE_URL = 'https://arena-irc.com.my';
const DEFAULT_IMAGE = `${BASE_URL}/ARENA_IRC_LOGO.png`;

export default function SEOHead({ title, description, url = BASE_URL, image = DEFAULT_IMAGE, keywords, noSuffix = false }: SEOHeadProps) {
  const fullTitle = noSuffix ? title : `${title} | Arena IRC`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:site_name" content="Arena IRC" />
      <meta property="og:locale" content="en_MY" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
