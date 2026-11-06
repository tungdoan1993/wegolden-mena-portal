/**
 * Site-wide settings. Edit THIS file for links and contacts —
 * never hard-code them inside pages or templates.
 * Items marked TODO need the real value before going live.
 */
export const config = {
  domain: 'wegoldenpartners.com',
  siteUrl: 'https://wegoldenpartners.com',
  languages: ['en', 'ar', 'fa'],
  defaultLanguage: 'en',

  links: {
    openAccount: 'https://my.wegolden.com', // TODO: add MENA tracking / IB ref param
    clientArea: 'https://my.wegolden.com',
    mainSite: 'https://wegolden.com',
    telegram: '#', // TODO: WeGolden MENA Telegram channel
  },

  // Official promotion terms (wegolden.com). Promotion copy lives in i18n → promos / pages.promotions.
  promoTerms: {
    goldflash: 'https://wegolden.com/goldflash',
    bonus: 'https://wegolden.com/20-tradable-bonus/',
    freeswap: 'https://wegolden.com/freeswap/',
  },

  contact: {
    support: 'support@wegolden.com',
    partners: 'partners@wegolden.com',
  },

  // Official MENA mascot (brand-assets/mena/mascot). Languages where it is shown.
  // Farsi is off until approved (kandura is Gulf dress — brand.json usage note).
  mascot: {
    src: 'img/mascot/mena-cat-kandura.png',
    ratio: 713 / 959,
    languages: ['en', 'ar'],
  },

  // Partner brochure (flipbook). Add 'ar' / 'fa' files here when those editions exist.
  brochures: {
    en: 'brochure/partner-catalogue-en.html',
  },

  // Leave empty to show the placeholder card; set a YouTube ID to embed the intro video.
  introVideoYoutubeId: '',

  // Lead form. Empty = demo mode (form shows success locally, nothing is sent).
  // HubSpot: https://api.hsforms.com/submissions/v3/integration/submit/<portalId>/<formGuid>
  leadFormEndpoint: '',

  pages: ['index', 'guides', 'promotions', 'partners', 'brochure', 'about', 'activities', 'partner-area'],
};
