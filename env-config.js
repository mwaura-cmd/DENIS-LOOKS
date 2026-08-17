/**
 * Aura Nails Hub - Environment Configuration Loader
 * Safely loads variables from .env.local and localStorage overrides.
 */

const DEFAULT_ENV = {
    BRAND_NAME: "Aura Nails Hub Embu",
    ARTIST_NAME: "Denis Mwaura",
    PHONE_NUMBER: "254741959888",
    LOCATION: "University of Embu & Surrounding Area",
    CONTACT_EMAIL: "auranailshubembu@gmail.com",
    DEPOSIT_PERCENTAGE: 50,
    PAYSTACK_PUBLIC_KEY: "",
    PAYSTACK_BANK_NAME: "GTBank",
    PAYSTACK_ACC_NAME: "AURA NAILS HUB",
    PAYSTACK_ACC_NUMBER: "0123456789",
    TELEGRAM_BOT_TOKEN: "",
    TELEGRAM_CHAT_ID: "",
    FIREBASE_API_KEY: "",
    FIREBASE_PROJECT_ID: "",
    FIREBASE_STORAGE_BUCKET: "",
    FIREBASE_APP_ID: ""
};

class EnvLoader {
    constructor() {
        this.env = { ...DEFAULT_ENV };
        this.loadEnv();
    }

    async loadEnv() {
        try {
            // Attempt to fetch and parse .env.local if served
            const response = await fetch('.env.local');
            if (response.ok) {
                const text = await response.text();
                this.parseEnvText(text);
            }
        } catch (e) {
            console.log("ℹ️ Using default/stored environment configuration.");
        }

        // Apply any stored localStorage overrides
        try {
            const stored = localStorage.getItem('auranailshub_env_overrides');
            if (stored) {
                const parsed = JSON.parse(stored);
                this.env = { ...this.env, ...parsed };
            }
        } catch (e) {
            console.warn("Could not load stored env overrides", e);
        }

        // Expose globally
        window.AURA_ENV = this.env;
    }

    parseEnvText(text) {
        const lines = text.split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            const eqIndex = trimmed.indexOf('=');
            if (eqIndex > 0) {
                let key = trimmed.slice(0, eqIndex).trim();
                let value = trimmed.slice(eqIndex + 1).trim();

                // Strip quotes
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                // Strip prefix like VITE_
                const cleanKey = key.replace(/^VITE_/, '');
                if (cleanKey === 'DEPOSIT_PERCENTAGE') {
                    this.env[cleanKey] = Number(value) || 50;
                } else {
                    this.env[cleanKey] = value;
                }
            }
        });
    }

    get(key, fallback = '') {
        return this.env[key] !== undefined ? this.env[key] : fallback;
    }
}

window.envLoader = new EnvLoader();
