// Tumhare original variables (var lagaya hai taaki sab files me kaam kare)
var API = 'https://api.mail.gw';
var token = localStorage.getItem('mt_token');
var address = localStorage.getItem('mt_email');

function generatePassword() {
    return "P@ss" + Math.random().toString(36).slice(-8) + "1x!";
}

var password = localStorage.getItem('mt_password') || generatePassword();
var syncTimer = null;
var refreshSec = 5; 
var lastMailCount = 0; 
var soundOn = true;
var isSyncing = true; 
var allMessages = [];
var availableDomains = [];
var activeDomain = "";
var currentEmailType = 'human';
var captchaAnswer = 0;
var captchaSuccessCallback = null;
var emailTimerInterval;
var statToday = 819; 
var statInboxes = 382;
var statGenerated = 296500;

var emailInput = document.getElementById('email-address');
var loadingOverlay = document.getElementById('loading-overlay');
var inboxContent = document.getElementById('inbox-content');
var totalEmails = document.getElementById('total-emails');

var currentBlogFilter = 'All';
var blogArticles = [
    { id: 'article1', category: 'Privacy', title: 'Protect Privacy in 2025', readTime: '12 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80', excerpt: 'Learn essential strategies to protect your online privacy.', content: '<p class="mb-4">In 2025, online privacy is under more threat than ever before. Data brokers use your primary email to track you. By utilizing disposable emails for one-time registrations, you cut off a major avenue of tracking. Combine this with a robust VPN to ensure total digital anonymity.</p>' },
    { id: 'article2', category: 'Email Security', title: 'Temp vs Permanent Email', readTime: '10 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=1000&q=80', excerpt: 'Discover when to use temporary vs permanent email addresses.', content: '<p class="mb-4">Permanent Emails (like Gmail) should be reserved for banking, government, and close contacts. Temporary Emails are your digital shield. Use them whenever a website demands an email address but you don’t fully trust them. A temporary email is designed to be discarded, keeping your main inbox pristine.</p>' },
    { id: 'article3', category: 'Email Tips', title: 'Stop Spam Emails Forever', readTime: '11 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1000&q=80', excerpt: 'Eliminate spam emails with 10 proven strategies for 2025.', content: '<p class="mb-4">The best way to stop spam is to never receive it in the first place. Never enter your real email into suspicious forms. Instead, generate a quick 10-minute mail address. Also, never click "unsubscribe" links in sketchy emails, as spammers use these to verify your email is active.</p>' },
    { id: 'article4', category: 'Industry Trends', title: 'The Rise of Disposable Emails', readTime: '13 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80', excerpt: 'Explore the growth of disposable email services and privacy.', content: '<p class="mb-4">Disposable email services have evolved into sophisticated platforms. When a massive platform gets hacked, users who signed up using a temporary email face absolutely zero risk. The integration of disposable identities will likely become a standard part of web browsing.</p>' }
];
