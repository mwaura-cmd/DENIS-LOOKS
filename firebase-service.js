/**
 * Aura Nails Hub - Firebase Service Module
 * Handles Firebase App, Firestore, and Firebase Storage integration
 * with automated LocalStorage / IndexedDB fallback engine.
 */

// Default Firebase Configuration template
const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

class FirebaseManager {
    constructor() {
        this.app = null;
        this.db = null;
        this.storage = null;
        this.isInitialized = false;
        this.isOnline = navigator.onLine;
        this.listeners = [];
        this.storageKey = 'auranailshub_custom_sets';
        this.configKey = 'auranailshub_firebase_config';
        
        window.addEventListener('online', () => { this.isOnline = true; });
        window.addEventListener('offline', () => { this.isOnline = false; });
    }

    // Load stored config or default
    getConfig() {
        try {
            const saved = localStorage.getItem(this.configKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn("Could not load Firebase config from LocalStorage", e);
        }
        return DEFAULT_FIREBASE_CONFIG;
    }

    saveConfig(config) {
        try {
            localStorage.setItem(this.configKey, JSON.stringify(config));
            return true;
        } catch (e) {
            console.error("Failed to save Firebase config", e);
            return false;
        }
    }

    async initialize() {
        const config = this.getConfig();
        
        // If config has valid projectId and apiKey, attempt to initialize Firebase
        if (config.apiKey && config.projectId && window.firebaseApp) {
            try {
                const { initializeApp } = window.firebaseApp;
                const { getFirestore } = window.firebaseFirestore;
                const { getStorage } = window.firebaseStorage || {};

                this.app = initializeApp(config, 'auranailshub-app');
                this.db = getFirestore(this.app);
                if (getStorage) {
                    this.storage = getStorage(this.app);
                }
                this.isInitialized = true;
                console.log("⚡ Firebase connected successfully to project:", config.projectId);
                return { success: true, mode: 'firebase' };
            } catch (err) {
                console.warn("Firebase init failed, switching to local mode:", err.message);
                this.isInitialized = false;
                return { success: false, mode: 'local', error: err.message };
            }
        } else {
            console.log("💾 Running in Local Persistence Mode (Firebase ready on config).");
            this.isInitialized = false;
            return { success: true, mode: 'local' };
        }
    }

    // Get all nail sets (combines local sets or Firestore)
    async getSets() {
        if (this.isInitialized && this.db && window.firebaseFirestore) {
            try {
                const { collection, getDocs, query, orderBy } = window.firebaseFirestore;
                const setsCol = collection(this.db, 'nail_sets');
                const q = query(setsCol, orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                
                const firebaseSets = [];
                snapshot.forEach(doc => {
                    firebaseSets.push({ id: doc.id, ...doc.data() });
                });
                
                if (firebaseSets.length > 0) {
                    return firebaseSets;
                }
            } catch (err) {
                console.warn("Error fetching from Firestore, falling back to local:", err);
            }
        }
        
        // Local fallback
        return this.getLocalSets();
    }

    // Subscribe to real-time updates
    subscribeToSets(onUpdateCallback) {
        if (this.isInitialized && this.db && window.firebaseFirestore) {
            try {
                const { collection, onSnapshot, query, orderBy } = window.firebaseFirestore;
                const setsCol = collection(this.db, 'nail_sets');
                const q = query(setsCol, orderBy('createdAt', 'desc'));
                
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const sets = [];
                    snapshot.forEach(doc => {
                        sets.push({ id: doc.id, ...doc.data() });
                    });
                    onUpdateCallback(sets);
                }, (error) => {
                    console.warn("Firestore snapshot listener error:", error);
                    onUpdateCallback(this.getLocalSets());
                });

                this.listeners.push(unsubscribe);
                return unsubscribe;
            } catch (err) {
                console.warn("Failed to attach snapshot listener", err);
            }
        }
        
        // Local mode immediate return
        onUpdateCallback(this.getLocalSets());
        return () => {};
    }

    // Upload a new set (handles image data + metadata)
    async uploadSet(setData) {
        const newId = 'set_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const item = {
            id: newId,
            title: setData.title || 'Custom Luxury Look',
            category: setData.category || 'Gel Polish',
            style: setData.style || 'Custom Artistry',
            description: setData.description || '',
            price: Number(setData.price) || 800,
            imageUrl: setData.imageUrl,
            tags: Array.isArray(setData.tags) ? setData.tags : (setData.tags ? setData.tags.split(',').map(t => t.trim()) : []),
            isCustomUpload: true,
            createdAt: new Date().toISOString(),
            likes: 0
        };

        // If Firebase is initialized, push to Firestore
        if (this.isInitialized && this.db && window.firebaseFirestore) {
            try {
                const { collection, doc, setDoc } = window.firebaseFirestore;
                await setDoc(doc(this.db, 'nail_sets', newId), item);
                console.log("Set saved to Firebase Firestore:", newId);
            } catch (err) {
                console.warn("Firestore save failed, saving locally:", err);
            }
        }

        // Always save to LocalStorage cache as well for offline resilience
        this.saveLocalSet(item);
        return item;
    }

    // Delete a set
    async deleteSet(id) {
        if (this.isInitialized && this.db && window.firebaseFirestore) {
            try {
                const { doc, deleteDoc } = window.firebaseFirestore;
                await deleteDoc(doc(this.db, 'nail_sets', id));
            } catch (err) {
                console.warn("Firestore delete failed:", err);
            }
        }
        this.deleteLocalSet(id);
    }

    // Local Storage Helpers
    getLocalSets() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Failed to read local sets:", e);
            return [];
        }
    }

    saveLocalSet(set) {
        const current = this.getLocalSets();
        const updated = [set, ...current.filter(s => s.id !== set.id)];
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }

    deleteLocalSet(id) {
        const current = this.getLocalSets();
        const updated = current.filter(s => s.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }
}

// Global instance
window.firebaseManager = new FirebaseManager();
