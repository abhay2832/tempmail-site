// ==========================================
// 1. CORE VARIABLES (Aapka original code)
// ==========================================
const API = 'https://api.mail.gw';
let token = localStorage.getItem('mt_token');
let address = localStorage.getItem('mt_email');
let syncTimer = null;
let refreshSec = 5; 
let lastMailCount = 0; 
let soundOn = true;
let isSyncing = true; 
let allMessages = [];
let availableDomains = [];
let activeDomain = "";
let currentEmailType = 'human'; 
let captchaAnswer = 0;
let captchaSuccessCallback = null;
let emailTimerInterval;
let statToday = 819; 
let statInboxes = 382; 
let statGenerated = 296500;

function generatePassword() { return "P@ss" + Math.random().toString(36).slice(-8) + "1x!"; }
let password = localStorage.getItem('mt_password') || generatePassword();

// ==========================================
// 2. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDbdxl0S7iwFn0uXlhXKMj49wB4-csSp7U",
    authDomain: "aryan-mails.firebaseapp.com",
    projectId: "aryan-mails",
    storageBucket: "aryan-mails.firebasestorage.app",
    messagingSenderId: "190362104203",
    appId: "1:190362104203:web:3240a185525825e97b3f8e",
    measurementId: "G-8S38X1F05Y"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
window.authContext = { mode: 'login' };

// ==========================================
// 3. CHANGELOG DATA (Auto Update List)
// ==========================================
window.changelogData = [
    { 
        version: "v3.0.0", 
        date: "March 2026", 
        updates: [
            "One-Time Captcha Added for uninterrupted use", 
            "5-Min exact expiry timer implemented", 
            "Live Stats now working and updating in real-time", 
            "Dynamic 20+ Auto Blogs System integrated", 
            "System Status shows real-time server ping"
        ] 
    },
    { 
        version: "v2.8.0", 
        date: "February 2026", 
        updates: [
            "Modals and UI Polish completed", 
            "Fixed India Flag rendering on Desktop devices", 
            "Added advanced Payment Modal with UPI QR Code"
        ] 
    },
    { 
        version: "v2.7.0", 
        date: "January 2026", 
        updates: [
            "Modular Code Structure applied", 
            "Performance Optimization and bug fixes"
        ] 
    }
];

// ==========================================
// 4. NULLSTO STYLE BLOGS DATA (20+ Blogs)
// ==========================================
window.baseBlogs = [
    { title: "How to Get Instagram OTP Using Temp Mail", tag: "Social" },
    { title: "Temporary Email for Telegram Signup", tag: "Chat" },
    { title: "Disposable Email for Gaming (BGMI)", tag: "Gaming" },
    { title: "Protect Your Primary Inbox from Spam", tag: "Privacy" },
    { title: "Bypass Netflix Registration Lock", tag: "Streaming" },
    { title: "Secure Your Identity on Reddit", tag: "Social" },
    { title: "How to use Temp Mails for Discord", tag: "Social" },
    { title: "Why you shouldn't use real email on Public Wi-Fi", tag: "Security" },
    { title: "Free Temporary Email for Software Trials", tag: "Tech" },
    { title: "Best Anonymous Email Generators in 2026", tag: "Privacy" },
    { title: "Using Temp Mail for TikTok Verification", tag: "Social" },
    { title: "How to hide your IP while checking emails", tag: "Security" },
    { title: "Temp Mail vs Traditional Mails", tag: "Guide" },
    { title: "Creating Unlimited Facebook Accounts Safely", tag: "Social" },
    { title: "How APIs use Disposable Emails", tag: "Dev" },
    { title: "Bypassing Paywalls with Fake Emails", tag: "Hacks" },
    { title: "The Truth About Email Tracking Pixels", tag: "Privacy" },
    { title: "Temporary Mail for Tinder Access", tag: "Social" },
    { title: "How to Spot a Phishing Email Fast", tag: "Security" },
    { title: "Avoiding Promotional Spam from Amazon", tag: "Shopping" }
];
