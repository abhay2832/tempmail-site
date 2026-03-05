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

// SUPPORT MODAL LOGIC
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

window.copyUPI = function() {
    const upiText = document.getElementById('upi-id-text').innerText;
    navigator.clipboard.writeText(upiText);
    const msg = document.getElementById('upi-copy-msg');
    if(msg) { msg.style.opacity = '1'; setTimeout(() => { msg.style.opacity = '0'; }, 2000); }
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

// PAGE MODALS LOGIC (T&C, Blog, Changelog etc)
window.showPageModal = function(pageName) {
    const title = document.getElementById('page-modal-title');
    const body = document.getElementById('page-modal-body');
    const modal = document.getElementById('page-modal');
    title.innerText = pageName;
    let content = '';
    
    if (pageName === 'Privacy Policy') {
        content = `<div class="space-y-4">
                    <p class="font-bold text-lg text-slate-800 dark:text-white border-b pb-2 dark:border-slate-700">1. Data Collection & Minimization</p>
                    <p>Aryan Mails operates on a strict principle of data minimization and ephemeral storage. By accessing our infrastructure, you acknowledge and agree to the following data handling protocols.</p>
                    <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>No Logs Policy:</strong> We do not log, store, or monitor your personal IP address, browser fingerprint, or real-world identity for tracking purposes.</li>
                        <li><strong>Ephemeral Data:</strong> All generated email addresses, received messages, and associated session tokens are temporarily held. Once your session is terminated or the auto-delete timer expires, this data is <strong>permanently destroyed</strong> from our servers. Recovery is impossible.</li>
                        <li><strong>Third-Party Sharing:</strong> We maintain a zero-compromise stance. We do not sell, rent, or share any data to advertisers, data brokers, or third-party entities.</li>
                    </ul>
                    <p class="font-bold text-lg text-slate-800 dark:text-white border-b pb-2 dark:border-slate-700 mt-6">2. Anti-Abuse Compliance</p>
                    <p>While we respect privacy, we actively deploy automated anti-abuse algorithms to detect and block malicious network requests. Any attempt to exploit our platform will result in an automated hardware ban.</p>
                   </div>`;
    } else if (pageName === 'Terms of Service') {
        content = `<div class="space-y-4">
                    <p class="font-bold text-lg text-slate-800 dark:text-white">Terms of Service & Acceptable Use Policy</p>
                    <p>These Terms of Service constitute a legally binding agreement between you and Aryan Mails. Your access to this platform is strictly conditional upon your compliance with the following rules:</p>
                    <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-800/30 mt-4">
                        <p class="font-bold text-red-600 dark:text-red-400 mb-2">1. ZERO TOLERANCE FOR ILLEGAL ACTIVITY</p>
                        <p class="text-sm text-red-800 dark:text-red-200">You are expressly prohibited from using our temporary email infrastructure for any illegal, fraudulent, or harmful activities. Violation will result in immediate, permanent hardware-level IP bans and potential reporting to local authorities.</p>
                    </div>
                    <p class="font-bold text-slate-800 dark:text-white mt-4">2. Automated Access & Rate Limiting</p>
                    <p>Unauthorized scraping, botting, or API abuse is strictly forbidden. If you need automated access, please use our official developer API responsibly.</p>
                    <p class="font-bold text-slate-800 dark:text-white mt-4">3. Liability Disclaimer</p>
                    <p>The service is provided "as is". Aryan Mails takes no responsibility for missed emails, rejected registrations, or any damages arising from the use of our temporary inboxes.</p>
                   </div>`;
    } else if (pageName === 'Cookie Policy') {
        content = `<div class="space-y-4 text-center py-4">
                    <i class="fa-solid fa-cookie-bite text-6xl text-amber-500 mb-4"></i>
                    <p class="font-bold text-xl text-slate-800 dark:text-white">Strictly Necessary Cookies Only</p>
                    <p class="text-slate-600 dark:text-slate-400 max-w-md mx-auto">Aryan Mails uses local storage and strictly necessary session tokens to function. We do NOT use tracking, advertising, or third-party analytic cookies.</p>
                    <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left mt-6 border border-slate-200 dark:border-slate-700">
                        <p class="font-bold text-slate-800 dark:text-white mb-2">What we store on your browser:</p>
                        <ul class="list-disc pl-5 space-y-2 text-sm">
                            <li><strong>JWT Session Tokens:</strong> To keep you securely logged into your current temporary email.</li>
                            <li><strong>UI Preferences:</strong> Theme settings (Dark/Light mode).</li>
                        </ul>
                    </div>
                   </div>`;
    } else if (pageName === 'Report Abuse') {
        content = `<div class="text-center space-y-4 py-4">
                    <i class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-2"></i>
                    <p class="font-bold text-2xl text-slate-800 dark:text-white">Report Malicious Activity</p>
                    <p class="text-slate-600 dark:text-slate-400">Aryan Mails has a zero-tolerance policy for abuse, spam, illegal activities, and phishing attempts originating from or sent to our domains.</p>
                    <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-left border border-slate-200 dark:border-slate-700 mt-4 mb-6">
                        <p class="font-semibold text-sm mb-1">Please include the following in your report:</p>
                        <ul class="list-disc pl-5 text-sm text-slate-500 space-y-1">
                            <li>The temporary email address involved.</li>
                            <li>Date and time of the incident.</li>
                            <li>Original headers or evidence of abuse.</li>
                        </ul>
                    </div>
                    <a href="mailto:abuse@aryanmails.com?subject=Reporting Abuse from Aryan Mails" target="_blank" class="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 w-full shadow-lg active:scale-95 text-lg cursor-pointer">
                        <i class="fa-regular fa-paper-plane"></i> Send Email to Abuse Team
                    </a>
                   </div>`;
    } else if (pageName === 'API Access') {
        let apiKey = localStorage.getItem('aryan_api_key') || '';
        content = `<div class="space-y-4">
                    <div class="flex items-center gap-3 mb-4">
                        <i class="fa-solid fa-code text-3xl text-brand"></i>
                        <div>
                            <p class="font-bold text-xl text-slate-800 dark:text-white">Public API Access</p>
                            <p class="text-xs text-emerald-500 font-bold tracking-widest uppercase">Live Environment</p>
                        </div>
                    </div>
                    <p class="text-slate-600 dark:text-slate-400">Integrate Aryan Mails into your custom application or scripts. Generate your unique API key below to authenticate your HTTP requests.</p>
                    <div class="bg-slate-100 dark:bg-darkbg p-5 rounded-xl border border-slate-200 dark:border-darkborder mt-4">
                        <p class="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Your API Key:</p>
                        <div class="flex flex-col sm:flex-row items-center gap-2">
                            <input type="text" id="api-key-display" readonly value="${apiKey || 'Not Generated'}" class="w-full bg-white dark:bg-darkpanel border border-slate-300 dark:border-darkborder rounded-lg px-4 py-3 text-sm font-mono text-brand focus:outline-none">
                            <button onclick="window.generateAPIKey()" class="w-full sm:w-auto bg-brand text-white px-6 py-3 rounded-lg font-bold hover:brightness-110 transition shadow cursor-pointer whitespace-nowrap"><i class="fa-solid fa-arrows-rotate mr-2"></i>Generate</button>
                        </div>
                    </div>
                    <p class="text-xs text-slate-500 mt-4"><i class="fa-solid fa-circle-info mr-1"></i> Keep your API key secure. Do not share it publicly.</p>
                   </div>`;
    } else if (pageName === 'Premium Plans') {
        content = `<div class="text-center py-6">
                    <i class="fa-solid fa-crown text-6xl text-amber-400 mb-6 drop-shadow-lg"></i>
                    <p class="font-bold text-3xl text-slate-800 dark:text-white mb-2">Upgrade Your Experience</p>
                    <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">We are actively developing Aryan Mails Premium to give you ultimate control over your privacy.</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-8">
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <i class="fa-solid fa-globe text-brand text-xl"></i> <span class="font-medium text-sm">Custom Domains</span>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <i class="fa-solid fa-inbox text-brand text-xl"></i> <span class="font-medium text-sm">Permanent Inboxes</span>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <i class="fa-solid fa-ban text-brand text-xl"></i> <span class="font-medium text-sm">100% Ad-Free</span>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <i class="fa-solid fa-bolt text-brand text-xl"></i> <span class="font-medium text-sm">Priority Support</span>
                        </div>
                    </div>
                    <div class="inline-block bg-brand/10 text-brand px-6 py-2 rounded-full font-bold text-sm border border-brand/20">
                        🚀 Launching Late 2026
                    </div>
                   </div>`;
    } else if (pageName === 'System Status') {
        content = `<div class="space-y-6">
                        <div class="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                            <div>
                                <h4 class="font-bold text-emerald-700 dark:text-emerald-400 text-lg">All Systems Operational</h4>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Last checked: <span class="font-mono">Just now</span></p>
                            </div>
                            <span class="flex h-4 w-4 relative">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                            </span>
                        </div>
                        
                        <div>
                            <p class="font-bold text-slate-800 dark:text-white mb-3">Service Metrics</p>
                            <div class="grid grid-cols-1 gap-3">
                                <div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-darkbg rounded-lg border border-slate-200 dark:border-darkborder">
                                    <span class="font-semibold text-slate-700 dark:text-gray-300"><i class="fa-solid fa-server w-6 text-center text-slate-400"></i> API Gateway</span>
                                    <span class="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">Operational (99.99%)</span>
                                </div>
                                <div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-darkbg rounded-lg border border-slate-200 dark:border-darkborder">
                                    <span class="font-semibold text-slate-700 dark:text-gray-300"><i class="fa-solid fa-database w-6 text-center text-slate-400"></i> Email Delivery</span>
                                    <span class="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">Operational (99.98%)</span>
                                </div>
                                <div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-darkbg rounded-lg border border-slate-200 dark:border-darkborder">
                                    <span class="font-semibold text-slate-700 dark:text-gray-300"><i class="fa-solid fa-shield-halved w-6 text-center text-slate-400"></i> Spam Filters</span>
                                    <span class="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
    } else if (pageName === 'Changelog') {
        content = `<div class="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                        
                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-darkpanel bg-brand text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                            <div class="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-bold text-slate-800 dark:text-white text-lg">v2.8.0 - Modals & UI Polish</h4>
                                    <span class="text-xs font-bold bg-brand/10 text-brand px-2 py-1 rounded">Latest</span>
                                </div>
                                <ul class="text-sm text-slate-600 dark:text-gray-300 list-none space-y-2 mt-3">
                                    <li class="flex gap-2"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> Improved all legal and info modals.</li>
                                    <li class="flex gap-2"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> Fixed India Flag rendering issue on Desktop.</li>
                                    <li class="flex gap-2"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> Added functional Support and UPI modal.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-darkpanel bg-slate-400 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                            <div class="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] bg-slate-50 dark:bg-darkbg p-5 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm opacity-80">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-bold text-slate-700 dark:text-gray-300">v2.7.0 - Secure Auth Update</h4>
                                    <span class="text-xs font-semibold text-slate-500">March 2026</span>
                                </div>
                                <ul class="text-sm text-slate-500 dark:text-gray-400 list-disc pl-5 space-y-1">
                                    <li>Implemented real Firebase Google Auth system.</li>
                                    <li>Nullsto clean UI design applied.</li>
                                    <li>Separated 1000+ lines into modular files.</li>
                                </ul>
                            </div>
                        </div>

                    </div>`;
    } else if (pageName === 'Blog & News') {
        content = `<div class="space-y-4">
                    <p class="font-bold text-2xl mb-4 text-slate-800 dark:text-white">Privacy Guides (2026)</p>
                    <div class="grid grid-cols-1 gap-4">
                        <a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">How to Get Instagram OTP Using Temp Mail</h4>
                                <span class="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Social</span>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Learn how to verify accounts in India without providing your real personal phone number or email address.</p>
                            <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                        </a>
                        
                        <a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">Temporary Email for Telegram</h4>
                                <span class="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Chat</span>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Discover the truth about using fake emails for chat signups and bypassing strict messenger restrictions.</p>
                            <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                        </a>

                        <a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">Disposable Email for Gaming (BGMI)</h4>
                                <span class="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Gaming</span>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400">How to use fake emails to register for gaming platforms safely without getting your main account banned.</p>
                            <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                        </a>
                    </div>
                   </div>`;
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
