// 🟢 FAILSAFE: Purane cached files ke liye taaki "not defined" ka error na aaye
var refreshSec = 5; 
window.refreshSec = 5;

// CORE VARIABLES
window.API_URL = 'https://api.mail.gw';
window.token = localStorage.getItem('mt_token');
window.address = localStorage.getItem('mt_email');
window.syncTimer = null;
window.lastMailCount = 0; 
window.soundOn = true;
window.isSyncing = true; 
window.allMessages = [];
window.availableDomains = [];
window.activeDomain = "";
window.currentEmailType = 'human'; 
window.captchaAnswer = 0;
window.captchaSuccessCallback = null;
window.emailTimerInterval = null;

// Live Stats Initial Values
window.statToday = 819; 
window.statInboxes = 382; 
window.statGenerated = 296500;

// Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyDbdxl0S7iwFn0uXlhXKMj49wB4-csSp7U",
    authDomain: "aryan-mails.firebaseapp.com",
    projectId: "aryan-mails",
    storageBucket: "aryan-mails.firebasestorage.app",
    messagingSenderId: "190362104203",
    appId: "1:190362104203:web:3240a185525825e97b3f8e",
    measurementId: "G-8S38X1F05Y"
};
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    window.authContext = { mode: 'login' };
}

// Changelog & Blogs Data
window.changelogData = [
    { version: "v3.0.0", date: "March 2026", updates: ["One-Time Captcha Added", "5-Min Timer Fixed", "Live Stats Real-time working", "20+ Auto Blogs System", "Smart Domain Switcher"] },
    { version: "v2.8.0", date: "Feb 2026", updates: ["Modals & UI Polish", "Fixed India Flag rendering", "Added advanced Payment Modal"] },
    { version: "v2.7.0", date: "Jan 2026", updates: ["Modular Code Structure", "Performance Optimization"] }
];

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
