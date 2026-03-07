// AAKHIRI AUR SABSE SAHI CODE - VARIABLES
window.API = 'https://api.mail.gw';
window.token = localStorage.getItem('mt_token');
window.address = localStorage.getItem('mt_email');

window.generatePassword = function() {
    return "P@ss" + Math.random().toString(36).slice(-8) + "1x!";
};

window.password = localStorage.getItem('mt_password') || window.generatePassword();
window.syncTimer = null;
window.refreshSec = 5; 
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
window.statToday = 819; 
window.statInboxes = 382;
window.statGenerated = 296500;
window.currentBlogFilter = 'All';

// DOM Elements
window.emailInput = document.getElementById('email-address');
window.loadingOverlay = document.getElementById('loading-overlay');
window.inboxContent = document.getElementById('inbox-content');
window.totalEmails = document.getElementById('total-emails');

// Blog Data
window.blogArticles = [
    { id: 'article1', category: 'Privacy', title: 'Protect Privacy in 2025', readTime: '12 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80', excerpt: 'Learn essential strategies to protect your online privacy.', content: '<p class="mb-4">In 2025, online privacy is under more threat than ever before. Data brokers use your primary email to track you. By utilizing disposable emails for one-time registrations, you cut off a major avenue of tracking. Combine this with a robust VPN to ensure total digital anonymity.</p>' },
    { id: 'article2', category: 'Email Security', title: 'Temp vs Permanent Email', readTime: '10 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=1000&q=80', excerpt: 'Discover when to use temporary vs permanent email addresses.', content: '<p class="mb-4">Permanent Emails (like Gmail) should be reserved for banking, government, and close contacts. Temporary Emails are your digital shield. Use them whenever a website demands an email address but you don’t fully trust them. A temporary email is designed to be discarded, keeping your main inbox pristine.</p>' },
    { id: 'article3', category: 'Email Tips', title: 'Stop Spam Emails Forever', readTime: '11 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1000&q=80', excerpt: 'Eliminate spam emails with 10 proven strategies for 2025.', content: '<p class="mb-4">The best way to stop spam is to never receive it in the first place. Never enter your real email into suspicious forms. Instead, generate a quick 10-minute mail address. Also, never click "unsubscribe" links in sketchy emails, as spammers use these to verify your email is active.</p>' },
    { id: 'article4', category: 'Industry Trends', title: 'The Rise of Disposable Emails', readTime: '13 min read', date: '07/01/2026', author: 'TempMail Team', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80', excerpt: 'Explore the growth of disposable email services and privacy.', content: '<p class="mb-4">Disposable email services have evolved into sophisticated platforms. When a massive platform gets hacked, users who signed up using a temporary email face absolutely zero risk. The integration of disposable identities will likely become a standard part of web browsing.</p>' }
];
