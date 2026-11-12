import { servicesData } from './servicesData';
import { solutionsData } from './solutionsData';
import { industriesData } from './industriesData';
import { insightsData } from './insightsData';

export const SITE_URL = 'https://a8fusion.com';

export const DEFAULT_SEO = {
  title: 'A8Fusion | Global Enterprise Technology & Digital Transformation',
  description: 'A8Fusion architects and delivers mission-critical enterprise software, sovereign AI infrastructure, and cloud systems for multinational corporations and public sector institutions across Singapore, UAE, and the UK.',
  keywords: 'enterprise software development, sovereign artificial intelligence, cloud infrastructure, zero-trust cybersecurity, system integration, digital transformation, enterprise ERP, government technology, Singapore, UAE, UK',
  ogImage: `${SITE_URL}/aboutus.png`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  canonical: SITE_URL
};

// Static route metadata registry with keyword-rich titles and descriptions
export const STATIC_SEO = {
  '/': {
    title: 'A8Fusion | Global Enterprise Technology & Sovereign Software Engineering',
    description: 'A8Fusion delivers intelligent enterprise platforms, private AI infrastructure, and high-concurrency systems for multinational corporations and sovereign institutions.',
    keywords: 'enterprise software engineering, sovereign cloud infrastructure, private LLM, mission-critical systems, Singapore IT consulting, Dubai tech partner, London enterprise engineering',
    canonical: `${SITE_URL}/`,
    ogType: 'website',
    ogImage: `${SITE_URL}/aboutus.png`
  },
  '/company/about': {
    title: 'About Us | A8Fusion - Corporate Foundations & Engineering Excellence',
    description: 'Learn about A8Fusion corporate identity, foundational charter, engineering values, and our commitment to sovereign digital infrastructure free from vendor lock-in.',
    keywords: 'about A8Fusion, enterprise engineering firm, sovereign IT infrastructure, software corporation Singapore, independent technology partner',
    canonical: `${SITE_URL}/company/about`,
    ogType: 'company',
    ogImage: `${SITE_URL}/aboutus.png`
  },
  '/about': {
    title: 'About Us | A8Fusion - Corporate Foundations & Engineering Excellence',
    description: 'Learn about A8Fusion corporate identity, foundational charter, engineering values, and our commitment to sovereign digital infrastructure free from vendor lock-in.',
    keywords: 'about A8Fusion, enterprise engineering firm, sovereign IT infrastructure',
    canonical: `${SITE_URL}/company/about`,
    ogType: 'company',
    ogImage: `${SITE_URL}/aboutus.png`
  },
  '/company/leadership': {
    title: 'Executive Leadership & Governance | A8Fusion Board & Advisory',
    description: 'Meet the executive leadership and advisory board of A8Fusion, bringing decades of computer science leadership, sovereign infrastructure governance, and enterprise delivery.',
    keywords: 'A8Fusion leadership, executive board, technology governance, enterprise software architects, sovereign IT advisory',
    canonical: `${SITE_URL}/company/leadership`,
    ogType: 'profile',
    ogImage: `${SITE_URL}/office_interior.jpg`
  },
  '/company/our-approach': {
    title: 'Engineering Approach & Governance | A8Fusion Delivery Methodology',
    description: 'Discover A8Fusion 4-stage engineering lifecycle: Rigorous Discovery, Sovereign Architecture, Milestone-Gated Delivery, and 24/7 SRE Operational Hypercare.',
    keywords: 'software engineering methodology, enterprise governance, zero-trust architecture, high-concurrency engineering, SLA guarantees',
    canonical: `${SITE_URL}/company/our-approach`,
    ogType: 'website',
    ogImage: `${SITE_URL}/office_tech.jpg`
  },
  '/careers': {
    title: 'Careers & Engineering Opportunities | A8Fusion Global Squads',
    description: 'Join A8Fusion distributed global engineering teams in Singapore, London, and Dubai. Explore open roles in Distributed Systems, Sovereign AI, SRE, and Cyber Defense.',
    keywords: 'tech careers Singapore, software engineering jobs London, enterprise architect jobs Dubai, distributed systems careers, A8Fusion careers',
    canonical: `${SITE_URL}/careers`,
    ogType: 'website',
    ogImage: `${SITE_URL}/career.png`
  },
  '/services': {
    title: 'Enterprise Technology Services | A8Fusion Core Engineering Capabilities',
    description: 'Comprehensive enterprise IT services: Custom Software Engineering, Sovereign AI & LLMs, Cloud Infrastructure, Zero-Trust Cybersecurity, ESB Integration, and Consulting.',
    keywords: 'enterprise software development, sovereign AI services, cloud infrastructure architecture, cybersecurity engineering, enterprise integration ESB',
    canonical: `${SITE_URL}/services`,
    ogType: 'website',
    ogImage: `${SITE_URL}/services.png`
  },
  '/solutions': {
    title: 'Enterprise Software Platforms & Industry Suites | A8Fusion Catalog',
    description: 'Production-ready software platforms: A8 Enterprise ERP, CRM, HRMS, FinTech Management, Business Intelligence, DMS, and Sovereign Artificial Intelligence.',
    keywords: 'enterprise ERP software, corporate CRM, enterprise HRMS platform, financial management software, sovereign enterprise AI, business intelligence',
    canonical: `${SITE_URL}/solutions`,
    ogType: 'website',
    ogImage: `${SITE_URL}/solutions.png`
  },
  '/industries': {
    title: 'Vertical Industry Solutions & Sector Architectures | A8Fusion',
    description: 'Specialized enterprise technology tailored to statutory and regulatory frameworks of Healthcare, Banking & Finance, Government, Manufacturing, Education, and Energy.',
    keywords: 'healthcare software solutions, fintech banking architecture, municipal government technology, manufacturing MES, supply chain software',
    canonical: `${SITE_URL}/industries`,
    ogType: 'website',
    ogImage: `${SITE_URL}/industries.png`
  },
  '/government': {
    title: 'Government & Sovereign Public Sector Solutions | A8Fusion Tender Desk',
    description: 'Sovereign digital infrastructure, automated civil registry systems, defense cloud architectures, and municipal platforms with FedRAMP, GDPR, and PDPA compliance.',
    keywords: 'government software solutions, sovereign public cloud, municipal digital transformation, public sector IT tender, government civil registry',
    canonical: `${SITE_URL}/government`,
    ogType: 'website',
    ogImage: `${SITE_URL}/government.png`
  },
  '/government/enquiry': {
    title: 'Government Tender & Procurement Portal | A8Fusion Public Sector',
    description: 'Official procurement conduit for sovereign institutions, federal ministries, and statutory boards submitting formal technology tenders and RFPs.',
    keywords: 'government tender RFP, public sector procurement, municipal technology tender, sovereign RFP submission',
    canonical: `${SITE_URL}/government/enquiry`,
    ogType: 'website',
    ogImage: `${SITE_URL}/government_building.jpg`
  },
  '/global-business': {
    title: 'Global Business & International Delivery Corridors | A8Fusion',
    description: 'Strategic international operations spanning Singapore (APAC), United Arab Emirates (GCC), and United Kingdom (EMEA) with 24/7 Follow-the-Sun delivery squads.',
    keywords: 'cross-border software engineering, global IT delivery Singapore Dubai London, sovereign IT jurisdiction, international software vendor',
    canonical: `${SITE_URL}/global-business`,
    ogType: 'website',
    ogImage: `${SITE_URL}/global.png`
  },
  '/insights': {
    title: 'Executive Insights, Whitepapers & Technical Briefings | A8Fusion',
    description: 'In-depth research on sovereign AI infrastructure, zero-trust enterprise security, FinOps cloud optimization, and legacy modernization for executive technologists.',
    keywords: 'enterprise IT whitepapers, sovereign AI research, zero-trust architecture guide, cloud FinOps, enterprise engineering insights',
    canonical: `${SITE_URL}/insights`,
    ogType: 'website',
    ogImage: `${SITE_URL}/insight.png`
  },
  '/contact': {
    title: 'Corporate Contact & Global Offices | A8Fusion Singapore, UAE, UK',
    description: 'Connect with A8Fusion corporate leadership. Verified delivery hubs: Marina Bay Singapore, DIFC Dubai UAE, and City of London UK.',
    keywords: 'contact A8Fusion, Singapore office, Dubai DIFC office, London office, enterprise software consultation',
    canonical: `${SITE_URL}/contact`,
    ogType: 'website',
    ogImage: `${SITE_URL}/contact.png`
  },
  '/request-project': {
    title: 'Request Enterprise Project Scope | A8Fusion Technical Scoping',
    description: 'Submit technical proposals and project scopes directly to Principal Systems Architects and Sovereign Compliance Leads under mutual NDA protection.',
    keywords: 'request project scope, enterprise RFP submission, software development quote, technical architecture assessment',
    canonical: `${SITE_URL}/request-project`,
    ogType: 'website',
    ogImage: `${SITE_URL}/office.jpg`
  },
  '/partnerships': {
    title: 'Strategic Systems Partnership & Alliances | A8Fusion Global Network',
    description: 'Join A8Fusion global partner ecosystem. Channel partnerships, system integrator alliances, and OEM software distribution programs across international markets.',
    keywords: 'enterprise software partnership, system integrator alliance, technology channel partner, OEM software agreement',
    canonical: `${SITE_URL}/partnerships`,
    ogType: 'website',
    ogImage: `${SITE_URL}/civic_building.jpg`
  }
};

/**
 * Resolve SEO metadata for any path (static or dynamic detail pages)
 */
export function getSEOMetadata(pathname) {
  // 1. Check exact match in static routes
  if (STATIC_SEO[pathname]) {
    return STATIC_SEO[pathname];
  }

  // 2. Service Detail Dynamic Pages (/services/:slug)
  if (pathname.startsWith('/services/')) {
    const slug = pathname.replace('/services/', '');
    const service = servicesData.find(s => s.slug === slug);
    if (service) {
      return {
        title: `${service.title} | A8Fusion Enterprise Services`,
        description: service.shortDesc || service.overview?.intro || `${service.title} engineering services by A8Fusion for global enterprise operations.`,
        keywords: `${service.title}, enterprise software, ${service.technologies?.slice(0, 4).join(', ') || ''}, sovereign cloud, Singapore, UAE, UK`,
        canonical: `${SITE_URL}/services/${slug}`,
        ogType: 'service',
        ogImage: `${SITE_URL}/services.png`,
        itemType: 'Service',
        name: service.title
      };
    }
  }

  // 3. Solution Detail Dynamic Pages (/solutions/:slug)
  if (pathname.startsWith('/solutions/')) {
    const slug = pathname.replace('/solutions/', '');
    const solution = solutionsData.find(s => s.slug === slug);
    if (solution) {
      return {
        title: `${solution.title} | A8 Enterprise Software Platform`,
        description: solution.tagline || solution.overview?.challenge || `${solution.title} by A8Fusion - high-concurrency, sovereign enterprise platform.`,
        keywords: `${solution.title}, enterprise software platform, ERP CRM, ${solution.modules?.map(m => m.name).slice(0, 3).join(', ') || ''}`,
        canonical: `${SITE_URL}/solutions/${slug}`,
        ogType: 'product',
        ogImage: `${SITE_URL}/solutions.png`,
        itemType: 'SoftwareApplication',
        name: solution.title
      };
    }
  }

  // 4. Industry Detail Dynamic Pages (/industries/:slug)
  if (pathname.startsWith('/industries/')) {
    const slug = pathname.replace('/industries/', '');
    const industry = industriesData.find(i => i.slug === slug);
    if (industry) {
      return {
        title: `${industry.title} Technology & Architecture | A8Fusion Industry Solutions`,
        description: industry.description || `Specialized digital systems for ${industry.title} complying with strict statutory and operational standards.`,
        keywords: `${industry.title} software, ${industry.title} digital transformation, statutory compliance, enterprise architecture`,
        canonical: `${SITE_URL}/industries/${slug}`,
        ogType: 'website',
        ogImage: `${SITE_URL}/industries.png`,
        itemType: 'Industry',
        name: industry.title
      };
    }
  }

  // 5. Insight Detail Dynamic Pages (/insights/:slug)
  if (pathname.startsWith('/insights/')) {
    const slug = pathname.replace('/insights/', '');
    const article = insightsData.find(a => a.slug === slug);
    if (article) {
      return {
        title: `${article.title} | A8Fusion Executive Insights`,
        description: article.excerpt || `${article.title} - Whitepaper and architectural briefing by ${article.author?.name || 'A8Fusion Research'}.`,
        keywords: `${article.category}, ${article.tags?.join(', ') || ''}, sovereign technology, enterprise architecture`,
        canonical: `${SITE_URL}/insights/${slug}`,
        ogType: 'article',
        ogImage: article.coverImage?.startsWith('http') ? article.coverImage : `${SITE_URL}${article.coverImage}`,
        author: article.author?.name,
        datePublished: article.date,
        itemType: 'Article',
        name: article.title
      };
    }
  }

  // Fallback default
  return DEFAULT_SEO;
}

/**
 * Generate Structured Data (JSON-LD) for a given route and resolved SEO
 */
export function generateStructuredData(pathname, seo) {
  // Base Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    '@id': `${SITE_URL}/#organization`,
    name: 'A8Fusion',
    legalName: 'A8Fusion Enterprise Technology Corporation',
    url: SITE_URL,
    logo: `${SITE_URL}/aboutus.png`,
    description: DEFAULT_SEO.description,
    foundingDate: '2020',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Level 24, Tower 1, 8 Marina Boulevard',
        addressLocality: 'Singapore',
        postalCode: '018981',
        addressCountry: 'SG'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Gate Avenue, Level 4, DIFC Innovation Hub',
        addressLocality: 'Dubai',
        addressCountry: 'AE'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '100 Bishopsgate, Level 18',
        addressLocality: 'London',
        postalCode: 'EC2N 4AG',
        addressCountry: 'GB'
      }
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+65-6800-9200',
        contactType: 'customer service',
        areaServed: ['SG', 'MY', 'APAC'],
        availableLanguage: ['en']
      },
      {
        '@type': 'ContactPoint',
        telephone: '+971-4-360-8100',
        contactType: 'sales',
        areaServed: ['AE', 'SA', 'GCC'],
        availableLanguage: ['en', 'ar']
      },
      {
        '@type': 'ContactPoint',
        telephone: '+44-20-7946-0880',
        contactType: 'corporate',
        areaServed: ['GB', 'EU'],
        availableLanguage: ['en']
      }
    ],
    sameAs: [
      'https://github.com/a8fusion',
      'https://linkedin.com/company/a8fusion'
    ]
  };

  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'A8Fusion',
    publisher: {
      '@id': `${SITE_URL}/#organization`
    }
  };

  // Breadcrumb Schema
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`
      },
      ...pathSegments.map((segment, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        item: `${SITE_URL}/${pathSegments.slice(0, idx + 1).join('/')}`
      }))
    ]
  };

  const schemas = [organizationSchema, websiteSchema, breadcrumbList];

  // Specific Structured Data: Service
  if (seo.itemType === 'Service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: seo.name,
      description: seo.description,
      provider: {
        '@id': `${SITE_URL}/#organization`
      },
      areaServed: ['Singapore', 'United Arab Emirates', 'United Kingdom', 'Global'],
      serviceType: 'Enterprise Software & IT Architecture'
    });
  }

  // Specific Structured Data: SoftwareApplication
  if (seo.itemType === 'SoftwareApplication') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: seo.name,
      description: seo.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cloud Native / Kubernetes / Sovereign Linux',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: 'Contact for Enterprise Tier',
        priceCurrency: 'USD'
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`
      }
    });
  }

  // Specific Structured Data: Article
  if (seo.itemType === 'Article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: seo.name,
      description: seo.description,
      image: seo.ogImage,
      datePublished: seo.datePublished || '2026-01-01',
      author: {
        '@type': 'Person',
        name: seo.author || 'A8Fusion Engineering Practice'
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': seo.canonical
      }
    });
  }

  return schemas;
}

