import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

const BASE_URL = 'https://arena-irc.com.my';
const DEFAULT_IMAGE = `${BASE_URL}/ARENA_IRC_LOGO.png`;

export default function SEOHead({ title, description, url = BASE_URL, image = DEFAULT_IMAGE }: SEOHeadProps) {
  const fullTitle = `${title} | Arena IRC`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
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
