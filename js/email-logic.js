window.initializeAppWithIPCheck = async function() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const userIP = data.ip;
        const blocked = JSON.parse(localStorage.getItem('blocked_ips') || '[]');
        if(blocked.includes(userIP) || localStorage.getItem('is_banned') === 'true') {
            document.body.innerHTML = `<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-900 text-white"><i class="fa-solid fa-ban text-6xl text-red-500 mb-4"></i><h1 class="text-3xl font-bold mb-2">Access Denied</h1><p>Your IP (${userIP}) has been permanently blocked from our network due to policy violations or abuse.</p></div>`;
            return;
        }
        window.initApp();
    } catch(e) {
        window.initApp();
    }
};

window.initApp = async function() {
    await window.fetchDomainsList();
    if (window.address && window.token) {
        const emailInput = document.getElementById('email-address');
        const loadingOverlay = document.getElementById('loading-overlay');
        if(emailInput) emailInput.value = window.address;
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        if (typeof window.startSync === 'function') window.startSync();
        if (typeof window.manualFetch === 'function') window.manualFetch();
        if (typeof window.startEmailTimer === 'function') window.startEmailTimer(600); 
    }

    setInterval(() => {
        if (!window.allMessages || window.allMessages.length === 0) return;
        const now = new Date();
        const adultKws = ['pornhub', 'xvideos', 'brazzers', 'onlyfans', 'xhamster', 'adult', 'sex', 'nude'];
        
        window.allMessages.forEach(msg => {
            const msgTime = new Date(msg.createdAt);
            const fromAddr = (msg.from.address || "").toLowerCase();
            const subj = (msg.subject || "").toLowerCase();
            const isAdult = adultKws.some(kw => fromAddr.includes(kw) || subj.includes(kw));
            
            if (((now - msgTime) > 5 * 60 * 1000) || isAdult) { 
                if (typeof window.deleteSingleMail === 'function') window.deleteSingleMail(msg.id);
            }
        });
    }, 30000);
};

window.createNewAccount = async function() {
    const history = JSON.parse(localStorage.getItem('mt_limit') || '[]');
    const now = Date.now();
    const recent = history.filter(t => now - t < 60 * 60 * 1000);
    if(recent.length >= 50) { 
        localStorage.setItem('is_banned', 'true');
        alert("Anti-Abuse System: You have exceeded the limit. Your IP is blocked.");
        location.reload();
        return;
    }
    recent.push(now);
    localStorage.setItem('mt_limit', JSON.stringify(recent));

    const loadingOverlay = document.getElementById('loading-overlay');
    const emailInput = document.getElementById('email-address');

    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    try {
        let stableDomain = window.activeDomain;
        if (!stableDomain) {
            const domainRes = await fetch(`${window.API}/domains`);
            const domainData = await domainRes.json();
            stableDomain = domainData['hydra:member'][0].domain; 
            window.activeDomain = stableDomain;
            if (typeof window.renderDomainDropdown === 'function') window.renderDomainDropdown();
        }

        let newUsername = "";
        if (window.currentEmailType === 'human') {
            const prefixes = ['aryan', 'abhay', 'raju', 'ranu', 'sita', 'riya', 'priya', 'nana', 'sikha', 'anuj', 'sankalp', 'joy', 'noah', 'theo', 'freddie', 'leo', 'arthur', 'rahul', 'rohit', 'neha', 'pooja', 'vikas', 'karan', 'amit', 'suraj'];
            const pfx = prefixes[Math.floor(Math.random() * prefixes.length)];
            const num = Math.floor(100 + Math.random() * 900); 
            newUsername = pfx + num;
        } else {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            for(let i = 0; i < 9; i++) {
                newUsername += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        
        const newAddress = `${newUsername}@${stableDomain}`;
        const newPassword = window.generatePassword();

        const createRes = await fetch(`${window.API}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: newAddress, password: newPassword })
        });
        if(createRes.ok) {
            const loginRes = await fetch(`${window.API}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: newAddress, password: newPassword })
            });
            const tokenData = await loginRes.json();
            window.address = newAddress;
            window.password = newPassword;
            window.token = tokenData.token;
            localStorage.setItem('mt_email', window.address);
            localStorage.setItem('mt_password', window.password);
            localStorage.setItem('mt_token', window.token);
            if(emailInput) emailInput.value = window.address;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
            if(typeof window.startSync === 'function') window.startSync();
            if(typeof window.startEmailTimer === 'function') window.startEmailTimer(600);
        } else {
            const domainRes = await fetch(`${window.API}/domains`);
            const domainData = await domainRes.json();
            window.activeDomain = domainData['hydra:member'][0].domain;
            if(emailInput) emailInput.value = "Switching domain...";
            setTimeout(() => window.createNewAccount(), 1000);
        }
    } catch (err) {
        const emailInput = document.getElementById('email-address');
        if(emailInput) emailInput.value = "Network Error! Retrying...";
        setTimeout(() => window.createNewAccount(), 2000);
    }
};

window.forceNewAccount = function() {
    if(typeof window.showCaptcha === 'function') {
        window.showCaptcha(() => {
            localStorage.removeItem('mt_email');
            localStorage.removeItem('mt_token');
            window.address = null;
            window.token = null;
            const emailInput = document.getElementById('email-address');
            const loadingOverlay = document.getElementById('loading-overlay');
            if(emailInput) emailInput.value = "Generating...";
            if(loadingOverlay) loadingOverlay.style.display = 'flex';
            if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
            window.createNewAccount();
        });
    }
};

window.createCustomAccount = function() {
    if(typeof window.showCaptcha === 'function') {
        window.showCaptcha(async () => {
            const customPrefix = prompt("Enter your desired username (e.g., rahul, priya123):");
            if (!customPrefix) return;
            const cleanPrefix = customPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
            if (!cleanPrefix) { alert("Invalid username. Use only letters and numbers."); return; }
            const loadingOverlay = document.getElementById('loading-overlay');
            const emailInput = document.getElementById('email-address');
            if(loadingOverlay) loadingOverlay.style.display = 'flex';
            if(emailInput) emailInput.value = "Creating custom email...";
            try {
                let stableDomain = window.activeDomain;
                if (!stableDomain) {
                    const domainRes = await fetch(`${window.API}/domains`);
                    const domainData = await domainRes.json();
                    stableDomain = domainData['hydra:member'][0].domain; 
                    window.activeDomain = stableDomain;
                }
                const newAddress = `${cleanPrefix}@${stableDomain}`;
                const newPassword = window.generatePassword();
                const createRes = await fetch(`${window.API}/accounts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: newAddress, password: newPassword })
                });
                if(createRes.ok) {
                    const loginRes = await fetch(`${window.API}/token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address: newAddress, password: newPassword })
                    });
                    const tokenData = await loginRes.json();
                    localStorage.removeItem('mt_token');
                    localStorage.removeItem('mt_email');
                    window.address = newAddress; window.password = newPassword; window.token = tokenData.token;
                    localStorage.setItem('mt_email', window.address);
                    localStorage.setItem('mt_password', window.password);
                    localStorage.setItem('mt_token', window.token);
                    if(emailInput) emailInput.value = window.address;
                    if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
                    if(window.syncTimer) clearInterval(window.syncTimer);
                    if(typeof window.startSync === 'function') window.startSync();
                    if(typeof window.manualFetch === 'function') window.manualFetch();
                    if(typeof window.startEmailTimer === 'function') window.startEmailTimer(600);
                } else {
                    alert("Username is already taken on this domain! Try another.");
                    if(emailInput) emailInput.value = window.address; 
                    if(loadingOverlay) loadingOverlay.style.display = 'none';
                }
            } catch (err) {
                alert("Network Error! Please try again.");
                if(emailInput) emailInput.value = window.address;
                if(loadingOverlay) loadingOverlay.style.display = 'none';
            }
        });
    }
};

window.fastOtpReset = async function() {
    const boltIcon = document.getElementById('fast-bolt-icon');
    if(boltIcon) boltIcon.classList.add('fa-spin');
    if(typeof window.manualFetch === 'function') await window.manualFetch();
    if(boltIcon) boltIcon.classList.remove('fa-spin');
};
