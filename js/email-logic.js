const API_BASE = 'https://api.mail.gw';

window.generateRandomPassword = function() { 
    return "P@ss" + Math.random().toString(36).slice(-8) + "1x!"; 
};

window.initApp = async function() {
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    if(emailInput) emailInput.value = "Loading domain...";
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    if(typeof window.fetchDomainsList === 'function') {
        await window.fetchDomainsList(); 
    }

    const currentEmail = localStorage.getItem('mt_email');
    const currentToken = localStorage.getItem('mt_token');

    if (currentEmail && currentToken) {
        if(emailInput) emailInput.value = currentEmail;
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        
        if(typeof window.startSync === 'function') window.startSync();
        if(typeof window.manualFetch === 'function') window.manualFetch();
        if(typeof window.startEmailTimer === 'function') window.startEmailTimer(300);
    } else {
        window.forceNewAccount(true); 
    }

    // Auto-Delete Interval (5 Minutes)
    setInterval(() => {
        if (!window.allMessages || window.allMessages.length === 0) return;
        const now = Date.now();
        let changed = false;
        window.allMessages.forEach(msg => {
            const msgTime = new Date(msg.createdAt).getTime();
            if (((now - msgTime) > 300000)) { 
                if(typeof window.deleteSingleMail === 'function') {
                    window.deleteSingleMail(msg.id);
                    changed = true;
                }
            }
        });
        if (changed && typeof window.renderMails === 'function') window.renderMails(); 
    }, 10000); 
}

window.createNewAccount = async function(retryCount = 0) {
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        if (!window.activeDomain || !window.availableDomains || window.availableDomains.length === 0) { 
            if(typeof window.fetchDomainsList === 'function') await window.fetchDomainsList(); 
        }
        
        // Failsafe: Agar API list na de paye, toh ye working domain use karega
        let finalDomain = window.activeDomain || "txcct.com"; 

        let newUsername = "";
        if (window.currentEmailType === 'human') {
            const prefixes = ['aryan', 'abhay', 'raju', 'ranu', 'sita', 'riya', 'priya', 'nana', 'sikha', 'anuj', 'sankalp', 'joy', 'noah', 'rahul', 'rohit'];
            newUsername = prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(1000 + Math.random() * 9000); 
        } else {
            newUsername = Math.random().toString(36).substring(2, 12);
        }
        
        const newAddress = `${newUsername}@${finalDomain}`;
        const newPassword = window.generateRandomPassword();

        const createRes = await fetch(`${API_BASE}/accounts`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ address: newAddress, password: newPassword })
        });

        if(createRes.ok) {
            const loginRes = await fetch(`${API_BASE}/token`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ address: newAddress, password: newPassword })
            });
            const tokenData = await loginRes.json();
            
            localStorage.setItem('mt_email', newAddress);
            localStorage.setItem('mt_password', newPassword);
            localStorage.setItem('mt_token', tokenData.token);
            
            if(emailInput) emailInput.value = newAddress;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            
            if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
            if(typeof window.startSync === 'function') window.startSync();
            if(typeof window.manualFetch === 'function') window.manualFetch();
            if(typeof window.startEmailTimer === 'function') window.startEmailTimer(300); 
            
        } else {
            if (retryCount < 3) {
                if(emailInput) emailInput.value = "Switching domain...";
                if(window.availableDomains && window.availableDomains.length > 1) {
                    window.activeDomain = window.availableDomains[retryCount + 1] || window.availableDomains[0];
                }
                setTimeout(() => window.createNewAccount(retryCount + 1), 1500); 
            } else {
                if(emailInput) emailInput.value = "API Error, Try again later.";
                if(loadingOverlay) loadingOverlay.style.display = 'none';
            }
        }
    } catch (err) {
        if(retryCount < 3) {
            if(emailInput) emailInput.value = "Network glitch, Retrying...";
            setTimeout(() => window.createNewAccount(retryCount + 1), 2000);
        } else {
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            if(emailInput) emailInput.value = "Check Internet Connection";
        }
    }
}

window.forceNewAccount = function(isInitialLoad = false) {
    if(sessionStorage.getItem('captcha_passed') === 'true') {
        window.processNewAccount();
    } else {
        if(typeof window.showCaptcha === 'function') {
            window.showCaptcha(() => { window.processNewAccount(); });
        } else { 
            window.processNewAccount(); 
        }
    }
}

window.processNewAccount = function() {
    localStorage.removeItem('mt_email');
    localStorage.removeItem('mt_token');
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(emailInput) emailInput.value = "Generating...";
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
    window.createNewAccount();
}

window.createCustomAccount = function() {
    if(sessionStorage.getItem('captcha_passed') === 'true') {
        window.processCustomAccount();
    } else {
        if(typeof window.showCaptcha === 'function') {
            window.showCaptcha(() => { window.processCustomAccount(); });
        } else { 
            window.processCustomAccount(); 
        }
    }
}

window.processCustomAccount = async function() {
    const customPrefix = prompt("Enter desired username (e.g., rahul, priya123):");
    if (!customPrefix) return;
    const cleanPrefix = customPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (!cleanPrefix) { alert("Invalid username."); return; }
    
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    if(emailInput) emailInput.value = "Creating custom email...";
    
    try {
        if (!window.activeDomain) { 
            if(typeof window.fetchDomainsList === 'function') await window.fetchDomainsList(); 
        }
        let finalDomain = window.activeDomain || "txcct.com";
        const newAddress = `${cleanPrefix}@${finalDomain}`;
        const newPassword = window.generateRandomPassword();
        
        const createRes = await fetch(`${API_BASE}/accounts`, { 
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
            body: JSON.stringify({ address: newAddress, password: newPassword }) 
        });
        
        if(createRes.ok) {
            const loginRes = await fetch(`${API_BASE}/token`, { 
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
                body: JSON.stringify({ address: newAddress, password: newPassword }) 
            });
            const tokenData = await loginRes.json();
            
            localStorage.setItem('mt_email', newAddress); 
            localStorage.setItem('mt_password', newPassword); 
            localStorage.setItem('mt_token', tokenData.token);
            
            if(emailInput) emailInput.value = newAddress;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
            if(typeof window.startSync === 'function') window.startSync();
            if(typeof window.manualFetch === 'function') window.manualFetch();
            if(typeof window.startEmailTimer === 'function') window.startEmailTimer(300);
        } else {
            alert("This Username is already taken on this domain! Please try another name.");
            if(emailInput) emailInput.value = localStorage.getItem('mt_email') || "Failed"; 
            if(loadingOverlay) loadingOverlay.style.display = 'none';
        }
    } catch (err) { 
        alert("Network Error!"); 
        if(loadingOverlay) loadingOverlay.style.display = 'none'; 
        if(emailInput) emailInput.value = localStorage.getItem('mt_email') || "Failed";
    }
}

window.generateAPIKey = function() {
    const key = 'am_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aryan_api_key', key);
    const disp = document.getElementById('api-key-display');
    if(disp) disp.value = key;
    alert("New Developer API Key Generated Successfully!");
}
