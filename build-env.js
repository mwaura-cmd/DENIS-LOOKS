const fs = require('fs');

const envKeys = [
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

envKeys.forEach(key => {
    if (process.env[key]) {
        envContent += `${key}=${process.env[key]}\n`;
    }
});

fs.writeFileSync('.env.local', envContent);
console.log('✅ Generated .env.local for production static serving.');
