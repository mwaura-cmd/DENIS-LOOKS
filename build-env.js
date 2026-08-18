const fs = require('fs');

const envKeys = [
    'VITE_BRAND_NAME',
    'VITE_ARTIST_NAME',
    'VITE_PHONE_NUMBER',
    'VITE_LOCATION',
    'VITE_DEPOSIT_PERCENTAGE',
    'VITE_PAYSTACK_PUBLIC_KEY',
    'VITE_PAYSTACK_SECRET_KEY',
    'VITE_PAYSTACK_BANK_NAME',
    'VITE_PAYSTACK_ACC_NAME',
    'VITE_PAYSTACK_ACC_NUMBER',
    'VITE_TELEGRAM_BOT_TOKEN',
    'VITE_TELEGRAM_CHAT_ID',
    'VITE_CONTACT_EMAIL',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

let envContent = '';
const envJson = {};

envKeys.forEach(key => {
    if (process.env[key]) {
        envContent += `${key}=${process.env[key]}\n`;
        const cleanKey = key.replace(/^VITE_/, '');
        if (cleanKey === 'DEPOSIT_PERCENTAGE') {
            envJson[cleanKey] = Number(process.env[key]);
        } else {
            envJson[cleanKey] = process.env[key];
        }
    }
});

fs.writeFileSync('.env.local', envContent);
fs.writeFileSync('env-vars.json', JSON.stringify(envJson, null, 2));
console.log('✅ Generated .env.local and env-vars.json for production static serving.');
