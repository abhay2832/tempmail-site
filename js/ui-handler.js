window.renderDomainDropdown = function() {
    const btnText = document.getElementById('domain-btn-text');
    if(btnText && activeDomain) btnText.innerText = "@" + activeDomain;
    const dropdown = document.getElementById('domain-list');
    if(dropdown && availableDomains.length > 0) {
        dropdown.innerHTML = '';
        availableDomains.forEach(d => {
            const div = document.createElement('div');
            div.className = "px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-darkborder cursor-pointer text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors border-b border-slate-100 dark:border-darkborder last:border-0";
            div.innerText = "@" + d;
            div.onclick = () => {
                activeDomain = d;
                if(btnText) btnText.innerText = "@" + activeDomain;
                document.getElementById('domain-dropdown').classList.add('hidden');
                window.forceNewAccount(); 
            };
            dropdown.appendChild(div);
        });
    }
}

window.toggleDomainDropdown = function() {
    const el = document.getElementById('domain-dropdown');
    if(!el) return;
    if (el.classList.contains('hidden')) { el.classList.remove('hidden'); } 
    else { el.classList.add('hidden'); }
}

document.addEventListener('click', (e) => {
    const domainBtn = e.target.closest('button[onclick="window.toggleDomainDropdown()"]');
    const domainDropdown = document.getElementById('domain-dropdown');
    if (!domainBtn && domainDropdown && !domainDropdown.classList.contains('hidden')) {
        domainDropdown.classList.add('hidden');
    }
});

window.copyEmail = function() {
    const emailInput = document.getElementById('email-address');
    if(emailInput) { emailInput.select(); document.execCommand('copy'); }
    const msg = document.getElementById('copy-msg');
    if(msg) { msg.style.opacity = "1"; setTimeout(() => { msg.style.opacity = "0"; }, 2000); }
}

window.toggleAudio = function() { 
    soundOn = !soundOn; 
    const text = document.getElementById('notif-text');
    if(text) text.innerText = soundOn ? "Sound On" : "Sound Off";
    const icon = document.getElementById('notif-icon');
    if(icon) icon.className = soundOn ? "fa-solid fa-bell text-brand" : "fa-regular fa-bell";
}

window.setEmailType = function(type) {
    currentEmailType = type;
    const btnHuman = document.getElementById('btn-type-human');
    const btnRandom = document.getElementById('btn-type-random');
    if(!btnHuman || !btnRandom) return;
    
    if (type === 'human') {
        btnHuman.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer";
        btnRandom.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all whitespace-nowrap cursor-pointer";
    } else {
        btnRandom.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer";
        btnHuman.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all whitespace-nowrap cursor-pointer";
    }
}

window.startEmailTimer = function(durationInSeconds) {
    clearInterval(emailTimerInterval);
    let time = durationInSeconds;
    const display = document.getElementById('countdown-timer');
    if(!display) return;
    emailTimerInterval = setInterval(() => {
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--time < 0) time = durationInSeconds; 
    }, 1000);
}

window.changeColorTheme = function() {
    const hue = Math.floor(Math.random() * 360);
    const brandColor = `hsl(${hue}, 75%, 50%)`;
    const brandBg = `hsla(${hue}, 75%, 50%, 0.15)`;
    document.documentElement.style.setProperty('--brand-color', brandColor);
    document.documentElement.style.setProperty('--brand-bg', brandBg);
}

window.toggleTheme = function() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const themeIcon = document.getElementById('theme-icon');
    if(themeIcon) { themeIcon.className = isDark ? 'fa-solid fa-sun text-yellow-400' : 'fa-solid fa-moon text-slate-600'; }
}

window.showCaptcha = function(callback) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    const cq = document.getElementById('captcha-question');
    if(cq) cq.innerText = `${num1} + ${num2} = ?`;
    const ci = document.getElementById('captcha-input');
    if(ci) ci.value = "";
    const modal = document.getElementById('captcha-modal');
    if(modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
    captchaSuccessCallback = callback;
}

window.verifyCaptcha = function() {
    const ci = document.getElementById('captcha-input');
    const val = parseInt(ci ? ci.value : 0);
    if(val === captchaAnswer) {
        const modal = document.getElementById('captcha-modal');
        if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
        if(captchaSuccessCallback) captchaSuccessCallback();
    } else {
        alert("Incorrect CAPTCHA. Are you a bot?");
        if(ci) ci.value = "";
    }
}

window.showSupportModal = function() {
    const supportModal = document.getElementById('support-modal');
    if (supportModal) {
        supportModal.classList.remove('hidden');
        supportModal.classList.add('flex');
    }
}

window.closeSupportModal = function() {
    const supportModal = document.getElementById('support-modal');
    if (supportModal) {
        supportModal.classList.add('hidden');
        supportModal.classList.remove('flex');
    }
}

window.updateLiveStats = function() {
    statToday += Math.floor(Math.random() * 3);
    statInboxes += Math.floor(Math.random() * 2);
    statGenerated += Math.floor(Math.random() * 5);
    const stElement = document.getElementById('stat-today');
    const siElement = document.getElementById('stat-inboxes');
    const sgElement = document.getElementById('stat-generated');
    if(stElement) stElement.innerText = statToday.toLocaleString();
    if(siElement) siElement.innerText = statInboxes.toLocaleString();
    if(sgElement) sgElement.innerText = (statGenerated / 1000).toFixed(1) + 'K';
}
setInterval(window.updateLiveStats, 3500); 

window.showPageModal = function(pageName) {
    const title = document.getElementById('page-modal-title');
    const body = document.getElementById('page-modal-body');
    const modal = document.getElementById('page-modal');
    title.innerText = pageName;
    let content = '';
    
    if (pageName === 'Privacy Policy') {
        content = `<p class="font-bold text-lg mb-2 text-slate-800 dark:text-white">Privacy Policy & Data Handling</p>
                    <p class="mb-3">Aryan Mails operates on a strict principle of data minimization and ephemeral storage. By accessing our infrastructure, you acknowledge and agree to the following data handling protocols:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>No Logs Policy:</strong> We do not log, store, or monitor your personal IP address, browser fingerprint, or real-world identity for tracking purposes.</li>
                        <li><strong>Ephemeral Data:</strong> All generated email addresses, received messages, and associated session tokens are temporarily held. Once your session is terminated or the auto-delete timer expires, this data is <strong>permanently destroyed</strong> from our servers. Recovery is impossible.</li>
                        <li><strong>Third-Party Sharing:</strong> We maintain a zero-compromise stance. We do not sell, rent, or share any data to advertisers, data brokers, or third-party entities.</li>
                    </ul>
                    <p class="text-red-500 font-bold mb-2">Anti-Abuse Compliance:</p>
                    <p>While we respect privacy, we actively deploy automated anti-abuse algorithms to detect and block malicious network requests.</p>`;
    } else if (pageName === 'Terms of Service') {
        content = `<p class="font-bold text-lg mb-2 text-slate-800 dark:text-white">Terms of Service & Acceptable Use Policy</p>
                    <p class="mb-3">These Terms of Service constitute a legally binding agreement between you and Aryan Mails. Your access to this platform is strictly conditional upon your compliance with the following rules:</p>
                    <p class="font-bold text-red-500 mb-2 mt-4">1. ZERO TOLERANCE FOR ILLEGAL ACTIVITY</p>
                    <p class="mb-3">You are expressly prohibited from using our temporary email infrastructure for any illegal, fraudulent, or harmful activities. Violation will result in immediate, permanent hardware-level IP bans.</p>
                    <p class="font-bold text-slate-800 dark:text-white mb-2 mt-4">2. Automated Access & Rate Limiting</p>
                    <p class="mb-3">Unauthorized scraping, botting, or API abuse is strictly forbidden.</p>`;
    } else if (pageName === 'Cookie Policy') {
        content = `<p class="font-bold text-lg mb-2 text-slate-800 dark:text-white">Cookie Policy</p>
                    <p class="mb-4">Aryan Mails uses strictly necessary cookies and local storage to function. We do NOT use tracking, advertising, or third-party analytic cookies.</p>
                    <p class="font-bold text-slate-800 dark:text-white mb-2 mt-4">What we store on your browser:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Session Tokens:</strong> To keep you logged into your current temporary email.</li>
                        <li><strong>Email & Password:</strong> To automatically reload your inbox.</li>
                    </ul>`;
    } else if (pageName === 'Report Abuse') {
        content = `<p class="font-bold text-lg mb-2 text-red-500 dark:text-red-400"><i class="fa-solid fa-triangle-exclamation"></i> Report Malicious Activity</p>
                    <p class="mb-4">Aryan Mails has a zero-tolerance policy for abuse, spam, illegal activities, and phishing attempts originating from or sent to our domains.</p>
                    <p class="mb-4">If you notice our service being used maliciously, please report it immediately.</p>
                    <a href="mailto:abuse@aryanmails.com?subject=Reporting Abuse from Aryan Mails" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 w-full shadow-lg active:scale-95 text-[15px] mt-4 whitespace-nowrap cursor-pointer">
                        <i class="fa-regular fa-paper-plane"></i> Email Abuse Team
                    </a>`;
    } else if (pageName === 'API Access') {
        let apiKey = localStorage.getItem('aryan_api_key') || '';
        content = `<p class="font-bold text-lg mb-2 text-slate-800 dark:text-white">Public API Access (Live)</p>
                    <p class="mb-4">Integrate Aryan Mails into your application. Use the API key below to authenticate your requests.</p>
                    <div class="bg-slate-100 dark:bg-darkbg p-4 rounded-xl border border-slate-200 dark:border-darkborder mb-4">
                        <p class="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Your API Key:</p>
                        <div class="flex items-center gap-2">
                            <input type="text" id="api-key-display" readonly value="${apiKey || 'Not Generated'}" class="w-full bg-white dark:bg-darkpanel border border-slate-300 dark:border-darkborder rounded-md px-3 py-2 text-sm font-mono text-brand focus:outline-none">
                            <button onclick="window.generateAPIKey()" class="bg-brand text-white px-4 py-2 rounded-md font-bold text-sm hover:brightness-110 transition shadow whitespace-nowrap cursor-pointer"><i class="fa-solid fa-arrows-rotate"></i></button>
                        </div>
                    </div>`;
    } else if (pageName === 'Premium Plans') {
        content = `<p class="font-bold text-lg mb-2 text-slate-800 dark:text-white">Upgrade Your Experience</p>
                    <p>We are working hard to bring you Aryan Mails Premium! Upcoming features include:</p>
                    <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-gray-300">
                        <li>Custom domain names</li>
                        <li>Permanent email inboxes</li>
                        <li>Ad-free experience</li>
                    </ul>
                    <p class="mt-2 text-brand font-semibold">Coming soon in 2026!</p>`;
    } else if (pageName === 'System Status') {
        content = `<div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                            <div>
                                <h4 class="font-bold text-emerald-700 dark:text-emerald-400">All Systems Operational</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Last checked: Just now</p>
                            </div>
                            <span class="flex h-3 w-3 relative">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-darkbg rounded-lg border border-slate-200 dark:border-darkborder">
                                <span class="text-sm font-semibold text-slate-700 dark:text-gray-300">API Gateway</span>
                                <span class="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">Operational (99.99%)</span>
                            </div>
                        </div>
                    </div>`;
    } else if (pageName === 'Changelog') {
        content = `<div class="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full border border-white dark:border-darkpanel bg-brand text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                            <div class="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white dark:bg-darkbg p-4 rounded-xl border border-slate-200 dark:border-darkborder shadow-sm">
                                <div class="flex items-center justify-between mb-1">
                                    <h4 class="font-bold text-slate-800 dark:text-white text-sm">v2.7.0 - Secure Auth Update</h4>
                                    <span class="text-[10px] font-semibold text-brand">March 2026</span>
                                </div>
                                <ul class="text-xs text-slate-600 dark:text-gray-400 list-disc pl-4 space-y-1">
                                    <li>Implemented real Firebase Google Auth system.</li>
                                    <li>Nullsto clean UI design applied.</li>
                                </ul>
                            </div>
                        </div>
                    </div>`;
    } else if (pageName === 'Blog & News') {
        content = `<p class="font-bold text-lg mb-2 text-slate-800 dark:text-white">Privacy Guides (2026)</p>
                    <ul class="space-y-3">
                        <li class="border-b border-slate-200 dark:border-darkborder pb-2">
                            <h4 class="font-semibold text-brand">How to Get Instagram OTP Using Temp Mail</h4>
                            <p class="text-xs text-slate-500">Learn how to verify accounts in India without your real number.</p>
                        </li>
                        <li class="border-b border-slate-200 dark:border-darkborder pb-2">
                            <h4 class="font-semibold text-brand">Temporary Email for Telegram</h4>
                            <p class="text-xs text-slate-500">Discover the truth about using fake emails for chat signups.</p>
                        </li>
                        <li>
                            <h4 class="font-semibold text-brand">Disposable Email for Gaming (BGMI)</h4>
                            <p class="text-xs text-slate-500">How to use fake emails to register for gaming platforms safely.</p>
                        </li>
                    </ul>`;
    }

    body.innerHTML = content;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

window.closePageModal = function() {
    const modal = document.getElementById('page-modal');
    if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

window.checkCookies = function() {
    if (!localStorage.getItem('cookie_accepted')) {
        const banner = document.getElementById('cookie-banner');
        if(banner) {
            banner.classList.remove('hidden');
            setTimeout(() => banner.classList.remove('translate-y-full'), 100);
        }
    }
}

window.acceptCookies = function() {
    localStorage.setItem('cookie_accepted', 'true');
    const banner = document.getElementById('cookie-banner');
    if(banner) {
        banner.classList.add('translate-y-full');
        setTimeout(() => banner.classList.add('hidden'), 500);
    }
}

window.checkTNC = function() {
    const lastAccepted = localStorage.getItem('tnc_accepted_time');
    const now = Date.now();
    if (!lastAccepted || (now - parseInt(lastAccepted)) > 24 * 60 * 60 * 1000) {
        const modal = document.getElementById('tnc-modal');
        if(modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
        return false;
    }
    return true;
}

window.acceptTNC = function() {
    const cb = document.getElementById('tnc-checkbox');
    if(!cb || !cb.checked) { alert("You must check the box to agree to the Terms and Conditions."); return; }
    localStorage.setItem('tnc_accepted_time', Date.now().toString());
    const modal = document.getElementById('tnc-modal');
    if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    window.initializeAppWithIPCheck(); 
}

window.initializeAppWithIPCheck = async function() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const userIP = data.ip;
        const blocked = JSON.parse(localStorage.getItem('blocked_ips') || '[]');
        
        if(blocked.includes(userIP) || localStorage.getItem('is_banned') === 'true') {
            document.body.innerHTML = `<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-900 text-white"><i class="fa-solid fa-ban text-6xl text-red-500 mb-4"></i><h1 class="text-3xl font-bold mb-2">Access Denied</h1><p>Your IP (${userIP}) has been permanently blocked.</p></div>`;
            return;
        }
        window.initApp(); 
    } catch(e) {
        window.initApp(); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.checkAuthSession();
    
    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const icon = btn.querySelector('.fa-chevron-down');
            const isOpen = answer.style.maxHeight;

            document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);
            document.querySelectorAll('.faq-btn .fa-chevron-down').forEach(i => i.style.transform = 'rotate(0deg)');

            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                if(icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    if(!window.checkTNC()) return; 
    window.initializeAppWithIPCheck();
    window.checkCookies();
});
