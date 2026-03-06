// 🟢 1. DOMAIN DROPDOWN UI
window.renderDomainDropdown = function() {
    const btnText = document.getElementById('domain-btn-text');
    if(btnText && window.activeDomain) btnText.innerText = "@" + window.activeDomain;
    
    const dropdown = document.getElementById('domain-list');
    if(dropdown && window.availableDomains && window.availableDomains.length > 0) {
        dropdown.innerHTML = '';
        window.availableDomains.forEach(d => {
            const div = document.createElement('div');
            div.className = "px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-darkborder cursor-pointer text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors border-b border-slate-100 dark:border-darkborder last:border-0";
            div.innerText = "@" + d;
            div.onclick = () => {
                window.activeDomain = d;
                if(btnText) btnText.innerText = "@" + window.activeDomain;
                document.getElementById('domain-dropdown').classList.add('hidden');
                if(typeof window.forceNewAccount === 'function') window.forceNewAccount(false); 
            };
            dropdown.appendChild(div);
        });
    }
};

window.toggleDomainDropdown = function() {
    const el = document.getElementById('domain-dropdown');
    if(el) {
        if(el.classList.contains('hidden')) { el.classList.remove('hidden'); } 
        else { el.classList.add('hidden'); }
    }
};

document.addEventListener('click', (e) => {
    const domainBtn = e.target.closest('button[onclick="window.toggleDomainDropdown()"]');
    const domainDropdown = document.getElementById('domain-dropdown');
    if (!domainBtn && domainDropdown && !domainDropdown.classList.contains('hidden')) {
        domainDropdown.classList.add('hidden');
    }
});

// 🟢 2. UTILITY BUTTONS (Copy, Sound, Theme)
window.copyEmail = function() {
    const emailInput = document.getElementById('email-address');
    if(emailInput) { 
        emailInput.select(); 
        document.execCommand('copy'); 
    }
    const msg = document.getElementById('copy-msg');
    if(msg) { 
        msg.style.opacity = "1"; 
        setTimeout(() => { msg.style.opacity = "0"; }, 2000); 
    }
};

window.toggleAudio = function() { 
    window.soundOn = !window.soundOn; 
    const notifText = document.getElementById('notif-text');
    const notifIcon = document.getElementById('notif-icon');
    if(notifText) notifText.innerText = window.soundOn ? "Sound On" : "Sound Off";
    if(notifIcon) notifIcon.className = window.soundOn ? "fa-solid fa-bell text-brand" : "fa-regular fa-bell";
};

window.setEmailType = function(type) {
    window.currentEmailType = type;
    const btnHuman = document.getElementById('btn-type-human');
    const btnRandom = document.getElementById('btn-type-random');
    if(!btnHuman || !btnRandom) return;

    if (type === 'human') {
        btnHuman.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer";
        btnRandom.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all whitespace-nowrap cursor-pointer";
    } else {
        btnRandom.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer";
        btnHuman.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all whitespace-nowrap cursor-pointer";
    }
};

window.startEmailTimer = function(durationInSeconds) {
    if(window.emailTimerInterval) clearInterval(window.emailTimerInterval);
    let time = durationInSeconds;
    const display = document.getElementById('countdown-timer');
    if(!display) return;
    window.emailTimerInterval = setInterval(() => {
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--time < 0) time = durationInSeconds; 
    }, 1000);
};

window.changeColorTheme = function() {
    const hue = Math.floor(Math.random() * 360);
    document.documentElement.style.setProperty('--brand-color', `hsl(${hue}, 75%, 50%)`);
    document.documentElement.style.setProperty('--brand-bg', `hsla(${hue}, 75%, 50%, 0.15)`);
};

window.toggleTheme = function() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const themeIcon = document.getElementById('theme-icon');
    if(themeIcon) {
        themeIcon.className = isDark ? 'fa-solid fa-sun text-yellow-400' : 'fa-solid fa-moon text-slate-600';
    }
};

// 🟢 3. CAPTCHA UI
window.showCaptcha = function(callback) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    window.captchaAnswer = num1 + num2;
    
    const cq = document.getElementById('captcha-question');
    if(cq) cq.innerText = `${num1} + ${num2} = ?`;
    
    const ci = document.getElementById('captcha-input');
    if(ci) ci.value = "";
    
    const modal = document.getElementById('captcha-modal');
    if(modal) { 
        modal.classList.remove('hidden'); 
        modal.classList.add('flex'); 
    }
    window.captchaSuccessCallback = callback;
};

window.verifyCaptcha = function() {
    const ci = document.getElementById('captcha-input');
    const val = parseInt(ci ? ci.value : 0);
    if(val === window.captchaAnswer) {
        const modal = document.getElementById('captcha-modal');
        if(modal) { 
            modal.classList.add('hidden'); 
            modal.classList.remove('flex'); 
        }
        sessionStorage.setItem('captcha_passed', 'true');
        if(typeof window.captchaSuccessCallback === 'function') window.captchaSuccessCallback();
    } else {
        alert("Incorrect CAPTCHA. Are you a bot?");
        if(ci) ci.value = "";
    }
};

// 🟢 4. SUPPORT & UPI MODAL
window.showSupportModal = function() {
    const supportModal = document.getElementById('support-modal');
    if (supportModal) { supportModal.classList.remove('hidden'); supportModal.classList.add('flex'); }
};

window.closeSupportModal = function() {
    const supportModal = document.getElementById('support-modal');
    if (supportModal) { supportModal.classList.add('hidden'); supportModal.classList.remove('flex'); }
};

window.copyUPI = function() {
    const upiText = document.getElementById('upi-id-text');
    if(upiText) {
        navigator.clipboard.writeText(upiText.innerText);
        const msg = document.getElementById('upi-copy-msg');
        if(msg) { msg.style.opacity = '1'; setTimeout(() => { msg.style.opacity = '0'; }, 2000); }
    }
};

// 🟢 5. LIVE STATS UI
window.updateLiveStats = function() {
    // Check if variables exist, fallback if not
    window.statToday = window.statToday || 819;
    window.statInboxes = window.statInboxes || 382;
    window.statGenerated = window.statGenerated || 296500;

    window.statToday += Math.floor(Math.random() * 3) + 1;
    window.statInboxes += Math.floor(Math.random() * 2);
    window.statGenerated += 0.1;
    
    const stElement = document.getElementById('stat-today');
    const siElement = document.getElementById('stat-inboxes');
    const sgElement = document.getElementById('stat-generated');
    
    if(stElement) stElement.innerText = window.statToday.toLocaleString();
    if(siElement) siElement.innerText = window.statInboxes.toLocaleString();
    if(sgElement) sgElement.innerText = window.statGenerated.toFixed(1) + 'K';
};
setInterval(window.updateLiveStats, 3500); 

// 🟢 6. DYNAMIC HTML GENERATORS (Modals)
window.getSystemStatusHTML = function() {
    const apiPing = Math.floor(Math.random() * 15) + 10;
    const dbPing = Math.floor(Math.random() * 20) + 15;
    return `<div class="space-y-6">
                <div class="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                    <div>
                        <h4 class="font-bold text-emerald-700 dark:text-emerald-400 text-lg">All Systems Operational</h4>
                        <p class="text-sm text-emerald-600 dark:text-emerald-500 mt-1">Live Sync Active</p>
                    </div>
                    <span class="flex h-4 w-4 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span></span>
                </div>
                <div>
                    <p class="font-bold text-slate-800 dark:text-white mb-3">Real-Time Metrics</p>
                    <div class="grid grid-cols-1 gap-3">
                        <div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-darkbg rounded-lg border border-slate-200 dark:border-darkborder"><span class="font-semibold text-slate-700 dark:text-gray-300"><i class="fa-solid fa-server w-6 text-center text-slate-400"></i> API Gateway</span><span class="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">${apiPing}ms (Active)</span></div>
                        <div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-darkbg rounded-lg border border-slate-200 dark:border-darkborder"><span class="font-semibold text-slate-700 dark:text-gray-300"><i class="fa-solid fa-database w-6 text-center text-slate-400"></i> Email Delivery</span><span class="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">${dbPing}ms (Active)</span></div>
                        <div class="flex justify-between items-center p-4 bg-slate-50 dark:bg-darkbg rounded-lg border border-slate-200 dark:border-darkborder"><span class="font-semibold text-slate-700 dark:text-gray-300"><i class="fa-solid fa-shield-halved w-6 text-center text-slate-400"></i> Spam Filters</span><span class="text-xs font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">Scanning Live</span></div>
                    </div>
                </div>
            </div>`;
};

window.getBlogsHTML = function() {
    let blogs = window.baseBlogs || [];
    let html = `<div class="space-y-4"><p class="font-bold text-2xl mb-4 text-slate-800 dark:text-white">Privacy Guides (${blogs.length}+)</p><div class="grid grid-cols-1 gap-4">`;
    blogs.forEach(blog => {
        let tagColor = blog.tag === "Privacy" ? "bg-emerald-100 text-emerald-600" : (blog.tag === "Security" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600");
        html += `<a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                    <div class="flex justify-between items-start mb-2"><h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">${blog.title}</h4><span class="${tagColor} text-[10px] font-bold px-2 py-1 rounded uppercase">${blog.tag}</span></div>
                    <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                </a>`;
    });
    return html + `</div></div>`;
};

window.getChangelogHTML = function() {
    let logs = window.changelogData || [];
    let html = `<div class="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">`;
    logs.forEach((log, index) => {
        let isLatest = index === 0 ? `<span class="text-xs font-bold bg-brand/10 text-brand px-2 py-1 rounded">Latest</span>` : '';
        html += `<div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active ${index === 0 ? 'mb-8' : 'opacity-80'}">
                    <div class="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-darkpanel ${index === 0 ? 'bg-brand' : 'bg-slate-400'} text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div class="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                        <div class="flex items-center justify-between mb-2"><h4 class="font-bold text-slate-800 dark:text-white text-lg">${log.version}</h4>${isLatest}</div>
                        <p class="text-xs font-bold text-slate-400 mb-3">${log.date}</p><ul class="text-sm text-slate-600 dark:text-gray-300 list-none space-y-2 mt-3">`;
        log.updates.forEach(up => { html += `<li class="flex gap-2"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> ${up}</li>`; });
        html += `</ul></div></div>`;
    });
    return html + `</div>`;
};

window.showPageModal = function(pageName) {
    const title = document.getElementById('page-modal-title');
    const body = document.getElementById('page-modal-body');
    const modal = document.getElementById('page-modal');
    if(!title || !body || !modal) return;

    title.innerText = pageName;
    if(window.statusIntervalDisplay) clearInterval(window.statusIntervalDisplay);
    
    if (pageName === 'System Status') {
        body.innerHTML = window.getSystemStatusHTML();
        window.statusIntervalDisplay = setInterval(() => { 
            if(document.getElementById('page-modal-title').innerText === 'System Status') {
                body.innerHTML = window.getSystemStatusHTML(); 
            }
        }, 1500);
    } else if (pageName === 'Changelog') { 
        body.innerHTML = window.getChangelogHTML(); 
    } else if (pageName === 'Blog & News') { 
        body.innerHTML = window.getBlogsHTML(); 
    } else if (pageName === 'Privacy Policy' || pageName === 'Terms of Service' || pageName === 'Cookie Policy' || pageName === 'Report Abuse') {
        body.innerHTML = `<div class="p-4 text-center"><p class="text-slate-600 dark:text-slate-300 font-medium">This section is currently being updated for V3.0.</p></div>`;
    } else { 
        body.innerHTML = `<p class="text-slate-600 dark:text-slate-400">Content loaded.</p>`; 
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closePageModal = function() {
    if(window.statusIntervalDisplay) clearInterval(window.statusIntervalDisplay);
    const modal = document.getElementById('page-modal');
    if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
};

// 🟢 7. INITIALIZATION (Cookies & T&C)
window.checkCookies = function() {
    if (!localStorage.getItem('cookie_accepted')) {
        const cb = document.getElementById('cookie-banner');
        if(cb) {
            cb.classList.remove('hidden');
            setTimeout(() => cb.classList.remove('translate-y-full'), 100);
        }
    }
};

window.acceptCookies = function() {
    localStorage.setItem('cookie_accepted', 'true');
    const cb = document.getElementById('cookie-banner');
    if(cb) {
        cb.classList.add('translate-y-full');
        setTimeout(() => cb.classList.add('hidden'), 500);
    }
};

window.checkTNC = function() {
    if (!localStorage.getItem('tnc_accepted_time')) {
        const tm = document.getElementById('tnc-modal');
        if(tm) { tm.classList.remove('hidden'); tm.classList.add('flex'); }
        return false;
    }
    return true;
};

window.acceptTNC = function() {
    const checkbox = document.getElementById('tnc-checkbox');
    if(checkbox && !checkbox.checked) { alert("Please check the agreement box."); return; }
    localStorage.setItem('tnc_accepted_time', Date.now().toString());
    const tm = document.getElementById('tnc-modal');
    if(tm) { tm.classList.add('hidden'); tm.classList.remove('flex'); }
    if(typeof window.initApp === 'function') window.initApp(); 
};

// EVENT LISTENER
document.addEventListener('DOMContentLoaded', () => {
    if(typeof window.checkAuthSession === 'function') window.checkAuthSession();
    
    // FAQ Accordion Setup
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

    if(window.checkTNC() && typeof window.initApp === 'function') {
        window.initApp();
    }
    window.checkCookies();
});
