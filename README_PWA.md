# Dandle Recliners - Progressive Web App

This is a fully configured Progressive Web App (PWA) version of the Dandle Recliners application built with React, Vite, and TypeScript.

## Features

- **Progressive Web App (PWA)**: Installable on desktop and mobile devices
- **Offline Support**: Works offline with cached content
- **Native-like Experience**: Runs in standalone mode without browser UI
- **Fast Performance**: Optimized build with code splitting
- **Responsive Design**: Works on all device sizes
- **Luxury UI**: Premium design with Tailwind CSS and shadcn/ui components

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

```bash
npm run build
```

This generates a production build in the `dist/` directory with PWA support.

### Preview

```bash
npm run preview
```

Preview the production build locally.

## PWA Features

### Installation

Users can install the app on their devices:

- **Desktop**: Look for the install button in the address bar
- **Android**: Tap menu → "Add to Home screen"
- **iOS**: Tap Share → "Add to Home Screen"

### Offline Support

The app works offline with all static assets cached by the service worker.

### App Icons

Custom app icons for all platforms:
- 192x192px for home screen
- 512x512px for splash screens
- Apple Touch Icon for iOS
- Favicon for browser tabs

### Web App Manifest

The manifest provides:
- App name and branding
- Icon definitions
- Standalone display mode
- Theme colors
- Start URL and scope

## Project Structure

```
dandle-earned-luxury/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Entry point with PWA registration
│   └── pwa.d.ts       # PWA type definitions
├── public/
│   ├── pwa-icon-*.png # App icons
│   ├── favicon.ico    # Browser favicon
│   └── manifest.webmanifest # Web app manifest
├── dist/              # Production build
├── vite.config.ts     # Vite configuration with PWA plugin
└── index.html         # HTML template
```

## Technologies

- **React 18**: UI framework
- **Vite 5**: Build tool
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Vite PWA Plugin**: PWA support
- **Workbox**: Service worker management

## Configuration

### PWA Configuration (vite.config.ts)

The PWA is configured with:
- Auto-updating service worker
- Automatic asset precaching
- Manifest generation
- Icon optimization

### Service Worker

The service worker is automatically generated and provides:
- Precaching of all static assets
- Network-first strategy for navigation
- Automatic cache updates
- Offline fallback

## Deployment

### Recommended Platforms

1. **Vercel** (Recommended)
   - Automatic HTTPS
   - Optimal PWA support
   - Automatic deployments

2. **Netlify**
   - Great PWA support
   - Automatic deployments
   - HTTPS included

3. **GitHub Pages**
   - Free hosting
   - GitHub integration

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## Testing

### Local Testing

```bash
npm run build
npm run preview
```

### DevTools Verification

1. Open DevTools (F12)
2. Go to Application tab
3. Check Service Workers for registration
4. Check Manifest for configuration
5. Check Storage for cached assets

### Offline Testing

1. Open DevTools → Application → Service Workers
2. Check "Offline"
3. Reload the page
4. App should load from cache

### Lighthouse Audit

1. Open DevTools → Lighthouse
2. Run audit with PWA category
3. Aim for 90+ score

## Performance

The app is optimized for performance:
- Code splitting for faster loads
- Asset precaching for offline support
- Optimized images and videos
- Minified CSS and JavaScript

## Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Firefox | ✅ | ⚠️ |
| Safari | ⚠️ | ✅ |
| Opera | ✅ | ✅ |

## Documentation

- `PWA_DOCUMENTATION.md` - Comprehensive PWA documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `PWA_CHANGES_SUMMARY.md` - Summary of PWA changes

## Troubleshooting

### Service Worker Not Registering
- Ensure HTTPS is enabled (required for production)
- Clear browser cache
- Check browser console for errors

### App Not Installable
- Verify manifest.webmanifest is accessible
- Check all required icons are present
- Clear browser cache

### Offline Not Working
- Verify service worker is registered
- Check cached assets in DevTools
- Ensure assets are in precache list

## Support

For issues or questions, refer to:
- PWA_DOCUMENTATION.md for detailed information
- Browser console for error messages
- Lighthouse audit for recommendations

## License

This project is part of Dandle Store Group's Earned Luxury initiative.

---

**Last Updated**: February 5, 2026
**PWA Version**: 1.0.0
**Build Tool**: Vite 5.4.19
**React Version**: 18.3.1
