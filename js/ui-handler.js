window.renderDomainDropdown = function() {
    const btnText = document.getElementById('domain-btn-text');
    if(btnText && activeDomain) btnText.innerText = "@" + activeDomain;
    const dropdown = document.getElementById('domain-list');
    if(dropdown && availableDomains.length > 0) {
        dropdown.innerHTML = '';
        availableDomains.forEach(d => {
            const div = document.createElement('div');
            div.className = "px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-darkborder cursor-pointer text-sm transition-colors border-b border-slate-100 dark:border-darkborder last:border-0";
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
    if(el.classList.contains('hidden')) { el.classList.remove('hidden'); } else { el.classList.add('hidden'); }
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
    document.getElementById('notif-text').innerText = soundOn ? "Sound On" : "Sound Off";
    document.getElementById('notif-icon').className = soundOn ? "fa-solid fa-bell text-brand" : "fa-regular fa-bell";
}

window.setEmailType = function(type) {
    currentEmailType = type;
    const btnHuman = document.getElementById('btn-type-human');
    const btnRandom = document.getElementById('btn-type-random');
    if (type === 'human') {
        btnHuman.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer";
        btnRandom.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all whitespace-nowrap cursor-pointer";
    } else {
        btnRandom.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer";
        btnHuman.className = "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all whitespace-nowrap cursor-pointer";
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
    document.documentElement.style.setProperty('--brand-color', `hsl(${hue}, 75%, 50%)`);
    document.documentElement.style.setProperty('--brand-bg', `hsla(${hue}, 75%, 50%, 0.15)`);
}

window.toggleTheme = function() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('theme-icon').className = isDark ? 'fa-solid fa-sun text-yellow-400' : 'fa-solid fa-moon text-slate-600';
}

window.showCaptcha = function(callback) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    document.getElementById('captcha-question').innerText = `${num1} + ${num2} = ?`;
    document.getElementById('captcha-input').value = "";
    document.getElementById('captcha-modal').classList.remove('hidden');
    document.getElementById('captcha-modal').classList.add('flex');
    captchaSuccessCallback = callback;
}

window.verifyCaptcha = function() {
    const val = parseInt(document.getElementById('captcha-input').value);
    if(val === captchaAnswer) {
        document.getElementById('captcha-modal').classList.add('hidden');
        document.getElementById('captcha-modal').classList.remove('flex');
        sessionStorage.setItem('captcha_passed', 'true');
        if(captchaSuccessCallback) captchaSuccessCallback();
    } else {
        alert("Incorrect CAPTCHA. Are you a bot?");
    }
}

window.showSupportModal = function() {
    document.getElementById('support-modal').classList.remove('hidden');
    document.getElementById('support-modal').classList.add('flex');
}

window.closeSupportModal = function() {
    document.getElementById('support-modal').classList.add('hidden');
    document.getElementById('support-modal').classList.remove('flex');
}

window.copyUPI = function() {
    navigator.clipboard.writeText(document.getElementById('upi-id-text').innerText);
    const msg = document.getElementById('upi-copy-msg');
    msg.style.opacity = '1'; setTimeout(() => { msg.style.opacity = '0'; }, 2000);
}

// 🟢 LIVE STATS AUTO UPDATER (Updates every 3.5 seconds)
window.updateLiveStats = function() {
    statToday += Math.floor(Math.random() * 3) + 1;
    statInboxes += Math.floor(Math.random() * 2);
    statGenerated += 0.1;
    document.getElementById('stat-today').innerText = statToday.toLocaleString();
    document.getElementById('stat-inboxes').innerText = statInboxes.toLocaleString();
    document.getElementById('stat-generated').innerText = statGenerated.toFixed(1) + 'K';
}
setInterval(window.updateLiveStats, 3500); 

// 🟢 DYNAMIC HTML GENERATORS
let statusInterval;

function getSystemStatusHTML() {
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
}

function getBlogsHTML() {
    let html = `<div class="space-y-4"><p class="font-bold text-2xl mb-4 text-slate-800 dark:text-white">Privacy Guides (${window.baseBlogs.length}+)</p><div class="grid grid-cols-1 gap-4">`;
    window.baseBlogs.forEach(blog => {
        let tagColor = blog.tag === "Privacy" ? "bg-emerald-100 text-emerald-600" : (blog.tag === "Security" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600");
        html += `<a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                    <div class="flex justify-between items-start mb-2"><h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">${blog.title}</h4><span class="${tagColor} text-[10px] font-bold px-2 py-1 rounded uppercase">${blog.tag}</span></div>
                    <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                </a>`;
    });
    return html + `</div></div>`;
}

function getChangelogHTML() {
    let html = `<div class="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">`;
    window.changelogData.forEach((log, index) => {
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
}

window.showPageModal = function(pageName) {
    document.getElementById('page-modal-title').innerText = pageName;
    const body = document.getElementById('page-modal-body');
    if(window.statusInterval) clearInterval(window.statusInterval);
    
    if (pageName === 'System Status') {
        body.innerHTML = getSystemStatusHTML();
        window.statusInterval = setInterval(() => { if(document.getElementById('page-modal-title').innerText === 'System Status') body.innerHTML = getSystemStatusHTML(); }, 1500);
    } else if (pageName === 'Changelog') { body.innerHTML = getChangelogHTML(); } 
    else if (pageName === 'Blog & News') { body.innerHTML = getBlogsHTML(); } 
    else { body.innerHTML = `<p class="text-slate-600 dark:text-slate-400">Content for ${pageName} loaded successfully.</p>`; }

    document.getElementById('page-modal').classList.remove('hidden');
    document.getElementById('page-modal').classList.add('flex');
}

window.closePageModal = function() {
    if(window.statusInterval) clearInterval(window.statusInterval);
    document.getElementById('page-modal').classList.add('hidden');
    document.getElementById('page-modal').classList.remove('flex');
}

// COOKIES AND TNC
window.checkCookies = function() {
    if (!localStorage.getItem('cookie_accepted')) {
        document.getElementById('cookie-banner').classList.remove('hidden');
        setTimeout(() => document.getElementById('cookie-banner').classList.remove('translate-y-full'), 100);
    }
}
window.acceptCookies = function() {
    localStorage.setItem('cookie_accepted', 'true');
    document.getElementById('cookie-banner').classList.add('translate-y-full');
    setTimeout(() => document.getElementById('cookie-banner').classList.add('hidden'), 500);
}
window.checkTNC = function() {
    if (!localStorage.getItem('tnc_accepted_time')) {
        document.getElementById('tnc-modal').classList.remove('hidden');
        document.getElementById('tnc-modal').classList.add('flex');
        return false;
    }
    return true;
}
window.acceptTNC = function() {
    if(!document.getElementById('tnc-checkbox').checked) { alert("Please check the agreement box."); return; }
    localStorage.setItem('tnc_accepted_time', Date.now().toString());
    document.getElementById('tnc-modal').classList.add('hidden');
    document.getElementById('tnc-modal').classList.remove('flex');
    window.initApp(); 
}

document.addEventListener('DOMContentLoaded', () => {
    window.checkAuthSession();
    if(window.checkTNC()) window.initApp();
    window.checkCookies();
});
