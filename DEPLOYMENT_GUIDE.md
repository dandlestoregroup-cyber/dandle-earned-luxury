# Dandle Recliners PWA - Deployment Guide

## Overview

The Dandle Recliners application is now a fully configured Progressive Web App (PWA) that can be deployed to any static hosting service or traditional web server.

## Pre-Deployment Checklist

Before deploying, ensure the following:

- ✅ Build is successful: `npm run build`
- ✅ Service worker is generated: `dist/sw.js`
- ✅ Manifest is present: `dist/manifest.webmanifest`
- ✅ All icons are in place: `dist/pwa-icon-*.png`
- ✅ HTTPS is configured (required for PWA)
- ✅ Correct domain is configured

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides automatic HTTPS and optimal PWA support.

1. **Connect Repository**
   - Push your code to GitHub
   - Connect repository to Vercel

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Vercel automatically deploys on push
   - HTTPS is automatically configured

### Option 2: Netlify

Netlify offers excellent PWA support and automatic deployments.

1. **Connect Repository**
   - Push code to GitHub
   - Connect to Netlify

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Deploy**
   - Netlify automatically builds and deploys
   - HTTPS is automatically enabled

### Option 3: GitHub Pages

Free hosting with GitHub Pages.

1. **Update package.json**
   ```json
   "homepage": "https://yourusername.github.io/dandle-earned-luxury"
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add Deploy Scripts**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Traditional Web Server (Apache/Nginx)

For self-hosted solutions:

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Copy dist/ Contents**
   - Copy all files from `dist/` to your web server's public directory
   - Ensure proper file permissions (typically 644 for files, 755 for directories)

3. **Configure HTTPS**
   - Use Let's Encrypt for free SSL certificates
   - Configure your web server for HTTPS

4. **Configure Server**

   **For Nginx:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       root /var/www/dandle;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
       
       location = /manifest.webmanifest {
           add_header Content-Type "application/manifest+json";
       }
       
       location = /sw.js {
           add_header Cache-Control "no-cache";
       }
   }
   ```

   **For Apache:**
   ```apache
   <VirtualHost *:443>
       ServerName yourdomain.com
       DocumentRoot /var/www/dandle
       
       SSLEngine on
       SSLCertificateFile /path/to/cert.pem
       SSLCertificateKeyFile /path/to/key.pem
       
       <Directory /var/www/dandle>
           RewriteEngine On
           RewriteBase /
           RewriteRule ^index\.html$ - [L]
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteRule . /index.html [L]
       </Directory>
       
       <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
           Header set Cache-Control "max-age=31536000, public"
       </FilesMatch>
       
       <FilesMatch "manifest.webmanifest$">
           Header set Content-Type "application/manifest+json"
       </FilesMatch>
       
       <FilesMatch "sw.js$">
           Header set Cache-Control "no-cache"
       </FilesMatch>
   </VirtualHost>
   ```

### Option 5: Docker Deployment

For containerized deployments:

1. **Create Dockerfile**
   ```dockerfile
   FROM node:22 AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**
   ```bash
   docker build -t dandle-pwa .
   docker run -p 80:80 dandle-pwa
   ```

## Post-Deployment Verification

After deployment, verify the PWA is working correctly:

1. **Check HTTPS**
   - Ensure the site is served over HTTPS
   - Look for the lock icon in the browser

2. **Verify Manifest**
   - Open DevTools (F12)
   - Go to Application → Manifest
   - Verify all fields are present and correct

3. **Check Service Worker**
   - Open DevTools (F12)
   - Go to Application → Service Workers
   - Verify service worker is registered and active

4. **Test Installation**
   - Look for install prompt in address bar
   - Click install and verify app works

5. **Test Offline**
   - Open DevTools (F12)
   - Go to Application → Service Workers
   - Check "Offline"
   - Reload page - should load from cache

6. **Run Lighthouse Audit**
   - Open DevTools (F12)
   - Go to Lighthouse
   - Run audit with PWA category
   - Aim for 90+ score

## Environment Variables

If your application uses environment variables, create a `.env` file:

```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Dandle Recliners
```

## Monitoring

After deployment, monitor:

- **Performance**: Use Lighthouse regularly
- **Errors**: Check browser console for errors
- **Service Worker**: Monitor service worker updates
- **Analytics**: Track installation and usage metrics

## Troubleshooting

### App Not Installable
- Verify HTTPS is enabled
- Check manifest.webmanifest is accessible
- Verify all required icons are present
- Clear browser cache

### Service Worker Not Updating
- Check service worker cache settings
- Verify new version is deployed
- Clear service worker cache in DevTools

### Offline Not Working
- Verify service worker is registered
- Check cached assets in DevTools
- Ensure all required assets are precached

## Rollback Procedure

If deployment has issues:

1. **Revert to Previous Version**
   - Redeploy previous build
   - Clear service worker cache

2. **Clear Cache**
   - Clear CDN cache if applicable
   - Clear browser cache

3. **Verify Rollback**
   - Check service worker version
   - Verify app functionality

## Support

For issues or questions:
- Check PWA_DOCUMENTATION.md for detailed information
- Review browser console for error messages
- Check Lighthouse audit recommendations

---

**Last Updated**: February 5, 2026
**PWA Version**: 1.0.0
**Deployment Guide Version**: 1.0
