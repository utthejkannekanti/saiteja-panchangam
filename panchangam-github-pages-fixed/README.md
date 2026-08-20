# Sai Teja Jewellery Works – Daily Panchangam Poster Generator

React + Vite version of the uploaded Daily Panchangam HTML poster generator.

## Features
- Telugu Panchangam text parser
- Traditional Yellow, Royal Gold and Deep Maroon themes
- Telugu font-size controls
- Four image uploads
- Location and WhatsApp QR codes
- PNG download
- Native share with image when supported
- WhatsApp fallback
- Print / Save as PDF
- GitHub Pages ready

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

For GitHub Pages, deploy the generated `dist` folder using GitHub Pages or a Pages action.


## GitHub Pages
This repository is configured for GitHub Pages using GitHub Actions. Push the project to the `main` branch, then in GitHub go to **Settings → Pages → Source** and select **GitHub Actions**.

The Vite base path is configured for the repository name `panchangam-github-app`, so assets load from `/panchangam-github-app/` instead of `/`.
