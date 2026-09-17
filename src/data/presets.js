export const PRESETS = [
  {
    id: "full",
    label: "Full SEO + AEO + Launch",
    description: "Everything enabled — full SEO/AEO audit plus Webflow launch QA.",
    enabledCategories: { technical: true, onpage: true, aeo: true, content: true, webflow: true },
    showAdvancedSeo: true,
  },
  {
    id: "webflow-only",
    label: "Webflow Launch Only",
    description: "Just the pre-launch QA checklist — no SEO/AEO items.",
    enabledCategories: { technical: false, onpage: false, aeo: false, content: false, webflow: true },
    showAdvancedSeo: true,
  },
  {
    id: "launch-basic-seo",
    label: "Launch + Basic SEO",
    description: "Launch QA plus the essential SEO items only — skips AEO, content quality, and advanced SEO.",
    enabledCategories: { technical: true, onpage: true, aeo: false, content: false, webflow: true },
    showAdvancedSeo: false,
  },
];
