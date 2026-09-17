export const DATA = [
  { id: "webflow", name: "Webflow Launch Checklist", items: [
    { id: "w1", text: "Custom domain connected and SSL certificate active", tool: "Webflow > Hosting", priority: "High" },
    { id: "w2", text: "Staging site password / \"noindex\" removed before go-live", tool: "Webflow > Site settings", priority: "High" },
    { id: "w3", text: "Favicon and social share (Open Graph) image set", tool: "Webflow > Site settings", priority: "Medium" },
    { id: "w4", text: "Custom 404 page designed and working", tool: "Manual — visit a broken URL", priority: "Medium" },
    { id: "w5", text: "All forms submit successfully and notification emails arrive", tool: "Manual test submission", priority: "High" },
    { id: "w6", text: "Form submissions connected to CRM/inbox/Zapier as needed", tool: "Manual / Zapier", priority: "Medium" },
    { id: "w7", text: "No broken internal or external links", tool: "Screaming Frog / Ahrefs", priority: "High" },
    { id: "w8", text: "301 redirects set up for any changed or retired URLs", tool: "Webflow > Redirects", priority: "High" },
    { id: "w9", text: "Site checked responsively on mobile, tablet, and desktop", tool: "Manual / Chrome DevTools", priority: "High" },
    { id: "w10", text: "Cross-browser check (Chrome, Safari, Firefox, Edge)", tool: "Manual / BrowserStack", priority: "Medium" },
    { id: "w11", text: "Google Analytics (GA4) and/or GTM installed and firing", tool: "GA4 Realtime / Tag Assistant", priority: "High" },
    { id: "w12", text: "Google Search Console verified and sitemap submitted", tool: "Search Console", priority: "Medium" },
    { id: "w13", text: "Legal pages present (Privacy Policy, Terms of Service)", tool: "Manual page review", priority: "Medium" },
    { id: "w14", text: "Cookie consent banner added if required for the audience", tool: "Manual / CookieYes", priority: "Low" },
    { id: "w15", text: "CMS collections populated with real content (no placeholder/lorem ipsum)", tool: "Manual CMS review", priority: "High" },
    { id: "w16", text: "Site backup/export taken before handoff", tool: "Webflow > Export code", priority: "Medium" },
    { id: "w17", text: "Page load speed checked on key pages", tool: "PageSpeed Insights", priority: "Medium" },
    { id: "w18", text: "Client walkthrough / CMS training completed", tool: "Manual", priority: "Low" },
  ]},
  { id: "technical", name: "Technical SEO", items: [
    { id: "t1", text: "Page is indexed by Google", tool: "Google Search Console", priority: "High", tier: "basic" },
    { id: "t2", text: "No crawl errors (404s, server errors)", tool: "Screaming Frog / Search Console", priority: "High", tier: "basic" },
    { id: "t3", text: "Robots.txt not blocking important pages/resources", tool: "Screaming Frog + manual", priority: "High", tier: "basic" },
    { id: "t4", text: "XML sitemap exists and is submitted", tool: "Search Console", priority: "Medium", tier: "basic" },
    { id: "t5", text: "Canonical tags set correctly (no conflicts)", tool: "Screaming Frog", priority: "Medium", tier: "advanced" },
    { id: "t6", text: "No orphan pages (zero internal links)", tool: "Screaming Frog", priority: "Medium", tier: "advanced" },
    { id: "t7", text: "HTTPS enabled sitewide, no mixed content", tool: "Screaming Frog / devtools", priority: "High", tier: "basic" },
    { id: "t8", text: "Core Web Vitals (LCP, CLS, INP) within 'Good' range", tool: "PageSpeed Insights", priority: "High", tier: "advanced" },
    { id: "t9", text: "Mobile-friendly rendering", tool: "Google Mobile-Friendly Test", priority: "High", tier: "basic" },
    { id: "t10", text: "Image sizes optimized / lazy loading in place", tool: "PageSpeed Insights", priority: "Medium", tier: "advanced" },
    { id: "t11", text: "URLs are clean, descriptive, lowercase, hyphenated", tool: "Manual + Screaming Frog", priority: "Low", tier: "advanced" },
    { id: "t12", text: "Redirect chains resolved (no more than 1 hop)", tool: "Screaming Frog", priority: "Medium", tier: "advanced" },
    { id: "t13", text: "No duplicate content across URL variants", tool: "Screaming Frog", priority: "Medium", tier: "advanced" },
  ]},
  { id: "onpage", name: "On-Page SEO", items: [
    { id: "o1", text: "Unique, descriptive title tag under ~60 characters", tool: "Screaming Frog", priority: "High", tier: "basic" },
    { id: "o2", text: "Compelling meta description under ~155 characters", tool: "Screaming Frog", priority: "Medium", tier: "basic" },
    { id: "o3", text: "One clear H1 per page", tool: "Screaming Frog / manual", priority: "High", tier: "basic" },
    { id: "o4", text: "Logical H2/H3 hierarchy (no skipped levels)", tool: "Manual scan", priority: "Medium", tier: "advanced" },
    { id: "o5", text: "Target keyword/topic clearly defined per page", tool: "Ahrefs / SEMrush", priority: "High", tier: "advanced" },
    { id: "o6", text: "Keyword used naturally without stuffing", tool: "Ahrefs / SEMrush", priority: "Medium", tier: "advanced" },
    { id: "o7", text: "Content depth competitive vs top-ranking pages", tool: "Ahrefs Content Gap", priority: "Medium", tier: "advanced" },
    { id: "o8", text: "Internal links to/from related pages", tool: "Ahrefs Site Explorer", priority: "Medium", tier: "advanced" },
    { id: "o9", text: "All images have descriptive alt text", tool: "Screaming Frog", priority: "Medium", tier: "basic" },
    { id: "o10", text: "Images compressed / served in modern formats (WebP)", tool: "PageSpeed Insights", priority: "Low", tier: "advanced" },
  ]},
  { id: "aeo", name: "AEO Checklist", items: [
    { id: "a1", text: "Schema markup implemented (Article, FAQ, HowTo, Product, Organization)", tool: "Rich Results Test", priority: "High" },
    { id: "a2", text: "Schema validates with no errors", tool: "Rich Results Test", priority: "High" },
    { id: "a3", text: "Organization/author schema present for E-E-A-T", tool: "Schema Validator + manual", priority: "Medium" },
    { id: "a4", text: "Page gives a direct answer in first 1-2 sentences", tool: "Manual read-through", priority: "High" },
    { id: "a5", text: "FAQ section present, matching real user questions", tool: "Manual + 'People Also Ask'", priority: "High" },
    { id: "a6", text: "Content uses short, factual, quotable sentences", tool: "Manual read-through", priority: "Medium" },
    { id: "a7", text: "Lists/tables used for comparable or stepwise info", tool: "Manual read-through", priority: "Medium" },
    { id: "a8", text: "Content is up to date (dates, stats, references current)", tool: "Manual / CMS", priority: "Medium" },
    { id: "a9", text: "Brand appears when asking ChatGPT target questions", tool: "Manual query / Otterly.AI", priority: "High" },
    { id: "a10", text: "Brand appears in Perplexity answers for target queries", tool: "Manual query / Profound", priority: "Medium" },
    { id: "a11", text: "Brand appears in Google AI Overviews", tool: "Manual search / Peec AI", priority: "Medium" },
    { id: "a12", text: "llms.txt file present (optional, emerging standard)", tool: "Manual - check /llms.txt", priority: "Low" },
  ]},
  { id: "content", name: "Content Quality", items: [
    { id: "c1", text: "Content covers topic more thoroughly than top 3 competitors", tool: "Ahrefs Content Gap", priority: "Medium" },
    { id: "c2", text: "Author bio / credentials visible on the page", tool: "Manual page review", priority: "Medium" },
    { id: "c3", text: "Content readability appropriate for audience", tool: "Hemingway App", priority: "Low" },
    { id: "c4", text: "No duplicate content across your own site", tool: "Copyscape / Siteliner", priority: "Medium" },
    { id: "c5", text: "Content refreshed/updated on a regular cadence", tool: "Manual / CMS", priority: "Low" },
  ]},
];

export const CATEGORY_IDS = DATA.map((cat) => cat.id);

export const ITEM_BY_ID = {};
DATA.forEach(cat => cat.items.forEach(it => { ITEM_BY_ID[it.id] = it; }));

export const ITEM_BY_TEXT = {};
DATA.forEach(cat => cat.items.forEach(it => { ITEM_BY_TEXT[it.text.trim().toLowerCase()] = it; }));

export const ALL_ITEMS = DATA.flatMap(cat => cat.items.map(item => ({ cat, item })));

export const TOTAL_ITEMS = DATA.reduce((sum, cat) => sum + cat.items.length, 0);
