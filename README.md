# SEO + AEO Audit Tracker

A React + Vite app for tracking SEO and AEO audits across multiple pages of a site: check off checklist items, mark items N/A, manage per-page progress, and export/import results.

## Features

- Per-page checklists across Technical SEO, On-Page SEO, AEO, and Content Quality categories
- Page management (add, duplicate, rename, delete)
- Progress saved automatically to `localStorage`
- Generate a Markdown report for a single page or the full site
- Export reports to PDF
- Export all pages to a styled Excel workbook (checklist matrix, summary dashboard, legend)
- Import a previously exported Markdown report to restore state

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
