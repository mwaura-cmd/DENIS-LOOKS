/**
 * Aura Nails Hub - Environment Configuration Loader
 * Safely loads variables from .env.local / env-vars.json.
 * Exposes window.envLoader.ready (Promise) so other scripts can
 * await env load before reading keys — this fixes the Paystack race condition.
 */

const DEFAULT_ENV = {
    BRAND_NAME: "Aura Nails Hub Embu",
    ARTIST_NAME: "Denis Mwaura",
    PHONE_NUMBER: "254741959888",
    LOCATION: "University of Embu & Surrounding Area",
    CONTACT_EMAIL: "auranailshubembu@gmail.com",
    DEPOSIT_PERCENTAGE: 50,
    PAYSTACK_PUBLIC_KEY: "",
    PAYSTACK_BANK_NAME: "Equity Bank",
    PAYSTACK_ACC_NAME: "AURA NAILS HUB",
    PAYSTACK_ACC_NUMBER: "0890184548340",
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
        // ready resolves after env fetch finishes — await this before reading keys
        this._readyResolve = null;
        this.ready = new Promise(resolve => { this._readyResolve = resolve; });
        this.loadEnv();
    }

    async loadEnv() {
        try {
            // First attempt to load JSON format (Best for Render production)
            const jsonRes = await fetch('env-vars.json?t=' + Date.now());
            if (jsonRes.ok) {
                const data = await jsonRes.json();
                this.env = { ...this.env, ...data };
                console.log('✅ Loaded env from env-vars.json. Paystack key present:', !!this.env.PAYSTACK_PUBLIC_KEY);
            } else {
                // Fallback to parsing .env.local (Best for local dev)
                const response = await fetch('.env.local?t=' + Date.now());
                if (response.ok) {
                    const text = await response.text();
                    this.parseEnvText(text);
                    console.log('✅ Loaded env from .env.local. Paystack key present:', !!this.env.PAYSTACK_PUBLIC_KEY);
                }
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

        // Expose globally and signal ready
        window.AURA_ENV = this.env;
        this._readyResolve();
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

                // Strip VITE_ prefix
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
