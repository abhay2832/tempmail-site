// 1. CORE VARIABLES
const API = 'https://api.mail.gw';
let token = localStorage.getItem('mt_token');
let address = localStorage.getItem('mt_email');
let syncTimer = null;
let allMessages = [];
let availableDomains = [];
let activeDomain = "";
let captchaAnswer = 0;
let captchaSuccessCallback = null;
let emailTimerInterval;

// Live Stats Variables
let statToday = 819; 
let statInboxes = 382; 
let statGenerated = 296.5;

function generatePassword() { return "P@ss" + Math.random().toString(36).slice(-8) + "1x!"; }
let password = localStorage.getItem('mt_password') || generatePassword();

// 2. CHANGELOG ARRAY (Aap yahan naya version likh sakte hain, site pe update ho jayega)
window.changelogData = [
    { version: "v3.0.0", date: "March 2026", updates: ["One-Time Captcha Added", "5-Min Timer Fixed", "Live Stats Real-time working", "20+ Auto Blogs System", "System Status Real Time API Ping"] },
    { version: "v2.8.0", date: "Feb 2026", updates: ["Modals & UI Polish", "Fixed India Flag rendering"] },
    { version: "v2.7.0", date: "Feb 2026", updates: ["Modular Code Structure", "Performance Optimization"] }
];

// 3. BASE BLOGS DATA (Auto-Generating Logic will be handled in ui-handler.js)
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
