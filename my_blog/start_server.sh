npm install --legacy-peer-deps --os=linux --cpu=x64 sharp
npm run build
pm2 restart ecosystem.config.js