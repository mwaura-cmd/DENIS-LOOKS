/**
 * Aura Nails Hub — Paystack Payment & 50% Deposit Module
 * Handles deposit calculation, Paystack Popup Checkout,
 * manual transfer fallback, browser push notifications,
 * and digital receipt/booking-pass generation.
 */

class PaystackPaymentEngine {
 constructor() {
 this.currentBooking = null;
 this.activeTimer = null;
 this.storageKey = 'auranailshub_bookings';
 }

 getEnv(key, fallback = '') {
 return window.envLoader ? window.envLoader.get(key, fallback) : fallback;
 }

 // ─── 50% Deposit Calculation ──────────────────────────────────────────────
 calculateDeposit(totalPrice) {
 const percentage = this.getEnv('DEPOSIT_PERCENTAGE', 50);
 const deposit = Math.ceil(totalPrice * (percentage / 100));
 const balance = totalPrice - deposit;
 return { totalPrice, percentage, deposit, balance };
 }

 // ─── Unique Reference Generator ───────────────────────────────────────────
 generateReference() {
 const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 let ref = '';
 for (let i = 0; i < 5; i++) {
 ref += chars.charAt(Math.floor(Math.random() * chars.length));
 }
 return `AURA-${ref}`;
 }

 // ─── Open Payment Modal ───────────────────────────────────────────────────
 openPaymentModal(setDetails) {
 const modal = document.getElementById('payment-modal');
 if (!modal) return;

 const pricing = this.calculateDeposit(Number(setDetails.price) || 1000);

 this.currentBooking = {
 reference: this.generateReference(),
 setId: setDetails.id || 'custom',
 setTitle: setDetails.title || 'Custom Luxury Set',
 setCategory: setDetails.category || 'Custom Nail Art',
 setImageUrl: setDetails.imageUrl || 'nails1.png.png',
 totalPrice: pricing.totalPrice,
 depositAmount: pricing.deposit,
 balanceAmount: pricing.balance,
 status: 'pending',
 createdAt: new Date().toISOString()
 };

 // Populate modal fields
 document.getElementById('pay-set-title').textContent = this.currentBooking.setTitle;
 document.getElementById('pay-set-category').textContent = this.currentBooking.setCategory;
 document.getElementById('pay-set-img').src = this.currentBooking.setImageUrl;
 document.getElementById('pay-full-price').textContent = `Ksh ${pricing.totalPrice.toLocaleString()}`;
 document.getElementById('pay-deposit-price').textContent = `Ksh ${pricing.deposit.toLocaleString()}`;
 document.getElementById('pay-balance-price').textContent = `Ksh ${pricing.balance.toLocaleString()}`;
 document.getElementById('pay-ref-badge').textContent = this.currentBooking.reference;

 // Populate Paystack manual transfer details
 const paystackAccEl = document.getElementById('paystack-acc-num');
 const paystackBankEl = document.getElementById('paystack-bank-name');
 const paystackAccNumEl = document.getElementById('paystack-bank-acc');

 const bankName = this.getEnv('PAYSTACK_BANK_NAME', 'GTBank');
 const accName = this.getEnv('PAYSTACK_ACC_NAME', 'AURA NAILS HUB');
 const accNum = this.getEnv('PAYSTACK_ACC_NUMBER', '0123456789');

 if (paystackAccEl) paystackAccEl.textContent = accName;
 if (paystackBankEl) paystackBankEl.textContent = bankName;
 if (paystackAccNumEl) paystackAccNumEl.textContent = accNum;

 // Reset views
 document.getElementById('payment-form-step').style.display = 'block';
 document.getElementById('payment-processing-step').style.display = 'none';
 document.getElementById('payment-receipt-step').style.display = 'none';

 modal.classList.add('active');
 }

 // ─── Trigger Paystack Popup Checkout ──────────────────────────────────────
 async triggerPaystackPopup(emailOrPhone, clientName, dateTime, location) {
 if (!this.currentBooking) return;

 this.currentBooking.clientName = clientName;
 this.currentBooking.clientEmail = emailOrPhone;
 this.currentBooking.appointmentDate = dateTime;
 this.currentBooking.location = location;

 // Show processing screen while env loads and popup opens
 document.getElementById('payment-form-step').style.display = 'none';
 document.getElementById('payment-processing-step').style.display = 'flex';

 // CRITICAL: Await env ready before reading the key (fixes race condition)
 if (window.envLoader && window.envLoader.ready) {
 await window.envLoader.ready;
 }

 const publicKey = this.getEnv('PAYSTACK_PUBLIC_KEY', '');
 const amountKobo = this.currentBooking.depositAmount * 100; // Paystack uses kobo

 // Sanitize email — Paystack requires valid email format
 // If user entered a phone number, convert it to a derived email
 let email = emailOrPhone;
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailRegex.test(email)) {
 // Strip non-digits and build a fallback email
 const digits = email.replace(/\D/g, '');
 email = `client_${digits || Date.now()}@auranailshub.app`;
 console.log('ℹ️ Phone entered instead of email — using derived email:', email);
 }

 console.log(` Paystack key loaded: ${publicKey ? publicKey.slice(0, 10) + '...' : 'MISSING'}`);

 if (!publicKey || publicKey === 'pk_test_your_paystack_public_key_here') {
 console.warn('️ Paystack public key not set.');
 document.getElementById('payment-processing-step').style.display = 'none';
 document.getElementById('payment-form-step').style.display = 'block';
 
 const errMsg = 'Payment gateway is currently unavailable (Missing API Key). Please try again later or contact support.';
 if (window.showToast) {
 window.showToast(errMsg);
 } else {
 alert(errMsg);
 }
 return;
 }

 // Load Paystack inline script if not already loaded
 if (!window.PaystackPop) {
 await this._loadPaystackScript();
 }

 const handler = window.PaystackPop.setup({
 key: publicKey,
 email: email,
 amount: amountKobo,
 currency: 'KES',
 ref: this.currentBooking.reference,
 metadata: {
 custom_fields: [
 { display_name: 'Client Name', variable_name: 'client_name', value: clientName },
 { display_name: 'Nail Set', variable_name: 'nail_set', value: this.currentBooking.setTitle },
 { display_name: 'Appointment', variable_name: 'appointment', value: dateTime },
 { display_name: 'Location', variable_name: 'location', value: location }
 ]
 },
 onClose: () => {
 // User closed popup without paying — go back to form
 document.getElementById('payment-processing-step').style.display = 'none';
 document.getElementById('payment-form-step').style.display = 'block';
 if (window.showToast) {
 window.showToast('Payment cancelled. You can try again anytime.');
 }
 },
 callback: (response) => {
 // Payment successful
 console.log(' Paystack payment success:', response);
 this.completePayment(response.reference || response.trxref);
 }
 });

 handler.openIframe();
 }

 // ─── Lazy load Paystack JS ────────────────────────────────────────────────
 _loadPaystackScript() {
 return new Promise((resolve, reject) => {
 if (document.getElementById('paystack-js')) { resolve(); return; }
 const s = document.createElement('script');
 s.id = 'paystack-js';
 s.src = 'https://js.paystack.co/v1/inline.js';
 s.onload = resolve;
 s.onerror = reject;
 document.head.appendChild(s);
 });
 }

 // ─── Complete / Confirm Payment ───────────────────────────────────────────
 async completePayment(transactionRef = '') {
 clearInterval(this.activeTimer);
 if (!this.currentBooking) return;

 const finalRef = transactionRef.trim() || `PS${Date.now().toString().slice(-7)}`;
 this.currentBooking.transactionCode = finalRef;
 this.currentBooking.status = 'deposit_paid';
 this.currentBooking.paidAt = new Date().toISOString();

 // Save booking locally & to Firestore
 await this.saveBooking(this.currentBooking);

 // Show Receipt Step
 document.getElementById('payment-form-step').style.display = 'none';
 document.getElementById('payment-processing-step').style.display = 'none';
 document.getElementById('payment-receipt-step').style.display = 'block';

 document.getElementById('receipt-ref').textContent = this.currentBooking.reference;
 document.getElementById('receipt-tx-code').textContent = finalRef;
 document.getElementById('receipt-deposit-paid').textContent = `Ksh ${this.currentBooking.depositAmount.toLocaleString()}`;
 document.getElementById('receipt-balance-due').textContent = `Ksh ${this.currentBooking.balanceAmount.toLocaleString()}`;
 document.getElementById('receipt-client-name').textContent = this.currentBooking.clientName || 'Valued Client';
 document.getElementById('receipt-date-time').textContent = this.currentBooking.appointmentDate || 'Confirmed';
 document.getElementById('receipt-location').textContent = this.currentBooking.location || 'Embu House Call';

 // Prepare WhatsApp Verification Link
 const waMsg = encodeURIComponent(
 ` *AURA NAILS HUB — BOOKING CONFIRMATION & 30% DEPOSIT PAID*\n\n` +
 `• *Booking Ref:* ${this.currentBooking.reference}\n` +
 `• *Client:* ${this.currentBooking.clientName}\n` +
 `• *Nail Set:* ${this.currentBooking.setTitle} (${this.currentBooking.setCategory})\n` +
 `• *Appointment:* ${this.currentBooking.appointmentDate}\n` +
 `• *Location:* ${this.currentBooking.location}\n\n` +
 ` *Financials:*\n` +
 `• *Total Price:* Ksh ${this.currentBooking.totalPrice.toLocaleString()}\n` +
 `• *30% Deposit Paid:* Ksh ${this.currentBooking.depositAmount.toLocaleString()} \n` +
 `• *Balance Due:* Ksh ${this.currentBooking.balanceAmount.toLocaleString()}\n` +
 `• *Paystack Ref:* ${finalRef}\n\n` +
 `Please confirm my slot in Embu. Thank you!`
 );

 const phone = this.getEnv('PHONE_NUMBER', '254741959888');
 const waBtn = document.getElementById('receipt-wa-confirm-btn');
 if (waBtn) {
 waBtn.href = `https://wa.me/${phone}?text=${waMsg}`;
 }

 if (window.showToast) {
 window.showToast(' 30% Deposit confirmed! Booking secured.');
 }

 // Fire browser push notification + Telegram bot alert
 this._sendSuccessNotification();
 this._sendTelegramNotification();
 }

 // ─── Complete Manual Transfer ─────────────────────────────────────────────
 async completeManualTransfer(txCode, clientName, phone, dateTime, location) {
 if (!txCode) {
 if (window.showToast) window.showToast('Please enter your Paystack / Bank transaction reference.');
 return;
 }
 this.currentBooking.clientName = clientName;
 this.currentBooking.clientPhone = phone;
 this.currentBooking.appointmentDate = dateTime;
 this.currentBooking.location = location;
 await this.completePayment(txCode);
 }

 // ─── Browser Push Notification ────────────────────────────────────────────
 async _sendSuccessNotification() {
 const title = ' Aura Nails Hub — Payment Received!';
 const body = `Deposit of Ksh ${this.currentBooking?.depositAmount?.toLocaleString() ?? ''} confirmed. Ref: ${this.currentBooking?.reference ?? ''}. Denis will reach out soon! `;

 // If Notification API is unsupported, silently skip
 if (!('Notification' in window)) return;

 if (Notification.permission === 'granted') {
 this._dispatchNotification(title, body);
 } else if (Notification.permission !== 'denied') {
 const perm = await Notification.requestPermission();
 if (perm === 'granted') {
 this._dispatchNotification(title, body);
 }
 }
 }

 _dispatchNotification(title, body) {
 try {
 new Notification(title, {
 body,
 icon: 'nails3.png.png',
 badge: 'nails3.png.png',
 tag: `aura-payment-${Date.now()}`,
 requireInteraction: false
 });
 } catch (e) {
 console.warn('Notification dispatch failed:', e);
 }
 }

 // ─── Telegram Bot Notification ────────────────────────────────────────────
 async _sendTelegramNotification() {
 const botToken = this.getEnv('TELEGRAM_BOT_TOKEN', '');
 const chatId = this.getEnv('TELEGRAM_CHAT_ID', '');

 if (!botToken || !chatId || botToken === 'your_bot_token_here') {
 console.info('ℹ️ Telegram bot not configured — skipping notification.');
 return;
 }

 const b = this.currentBooking;
 const text =
 ` *AURA NAILS HUB — PAYMENT RECEIVED* \n\n` +
 ` *Booking Ref:* \`${b.reference}\`\n` +
 ` *Client:* ${b.clientName || 'N/A'}\n` +
 ` *Contact:* ${b.clientPhone || b.clientEmail || 'N/A'}\n` +
 ` *Service:* ${b.setTitle} (${b.setCategory})\n` +
 ` *Appointment:* ${b.appointmentDate || 'TBC'}\n` +
 ` *Location:* ${b.location || 'Embu'}\n\n` +
 ` *Financials:*\n` +
 `├ Total Price: Ksh ${b.totalPrice?.toLocaleString()}\n` +
 `├ Deposit Paid: Ksh ${b.depositAmount?.toLocaleString()} \n` +
 `└ Balance Due: Ksh ${b.balanceAmount?.toLocaleString()}\n\n` +
 ` *Paystack Ref:* \`${b.transactionCode}\`\n` +
 ` *Paid At:* ${new Date(b.paidAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}`;

 try {
 const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
 const res = await fetch(url, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 chat_id: chatId,
 text,
 parse_mode: 'Markdown'
 })
 });
 const data = await res.json();
 if (data.ok) {
 console.log(' Telegram notification sent successfully!');
 } else {
 console.warn('Telegram send failed:', data.description);
 }
 } catch (err) {
 console.warn('Telegram notification error:', err);
 }
 }

 // ─── Save Booking ─────────────────────────────────────────────────────────
 async saveBooking(booking) {
 // Save to LocalStorage
 try {
 const raw = localStorage.getItem(this.storageKey);
 const list = raw ? JSON.parse(raw) : [];
 list.unshift(booking);
 localStorage.setItem(this.storageKey, JSON.stringify(list));
 } catch (e) {
 console.error('Local booking save failed', e);
 }

 // Save to Firebase Firestore if connected
 if (window.firebaseManager && window.firebaseManager.isInitialized && window.firebaseManager.db && window.firebaseFirestore) {
 try {
 const { collection, doc, setDoc } = window.firebaseFirestore;
 await setDoc(doc(window.firebaseManager.db, 'bookings', booking.reference), booking);
 console.log('Booking synced to Firestore:', booking.reference);
 } catch (err) {
 console.warn('Firestore booking sync failed:', err);
 }
 }
 }

 copyText(text, label = 'Copied') {
 navigator.clipboard.writeText(text);
 if (window.showToast) {
 window.showToast(` ${label} copied to clipboard!`);
 }
 }
}

window.paystackPayment = new PaystackPaymentEngine();
// Keep legacy alias so any old refs still work
window.equityPayment = window.paystackPayment;
