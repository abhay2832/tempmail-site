window.initApp = async function() {
    await window.fetchDomainsList(); 
    if (address && token) {
        const emailInput = document.getElementById('email-address');
        const loadingOverlay = document.getElementById('loading-overlay');
        if(emailInput) emailInput.value = address;
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        window.startSync();
        window.manualFetch();
        window.startEmailTimer(300); // 5 MINUTE TIMER
    } else {
        window.forceNewAccount();
    }

    setInterval(() => {
        if (!allMessages || allMessages.length === 0) return;
        const now = Date.now();
        let changed = false;
        allMessages.forEach(msg => {
            const msgTime = new Date(msg.createdAt).getTime();
            if (((now - msgTime) > 300000)) { 
                window.deleteSingleMail(msg.id);
                changed = true;
            }
        });
        if (changed) { window.renderMails(); }
    }, 10000); 
}

// 🟢 NEW STRONG ACCOUNT GENERATION (WITH AUTO-RETRY ON BAD DOMAINS)
window.createNewAccount = async function(retryCount = 0) {
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        if (!activeDomain || availableDomains.length === 0) { await window.fetchDomainsList(); }
        
        let newUsername = "";
        if (currentEmailType === 'human') {
            const prefixes = ['aryan', 'abhay', 'raju', 'ranu', 'sita', 'riya', 'priya', 'nana', 'sikha', 'anuj', 'sankalp', 'joy', 'noah', 'rahul', 'rohit', 'neha', 'pooja', 'vikas'];
            newUsername = prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(1000 + Math.random() * 9000); 
        } else {
            newUsername = Math.random().toString(36).slice(-8);
        }
        
        const newAddress = `${newUsername}@${activeDomain}`;
        const newPassword = generatePassword();

        const createRes = await fetch(`${API}/accounts`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: newAddress, password: newPassword })
        });

        if(createRes.ok) {
            const loginRes = await fetch(`${API}/token`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: newAddress, password: newPassword })
            });
            const tokenData = await loginRes.json();
            address = newAddress; password = newPassword; token = tokenData.token;
            localStorage.setItem('mt_email', address);
            localStorage.setItem('mt_password', password);
            localStorage.setItem('mt_token', token);
            
            if(emailInput) emailInput.value = address;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            
            window.clearInboxUIQuiet();
            window.startSync();
            window.startEmailTimer(300); // 5 MINUTE
        } else {
            // Agar API reject kare, toh agla domain try karo (Max 3 baar)
            if (retryCount < 3 && availableDomains.length > 1) {
                if(emailInput) emailInput.value = "Switching domain...";
                activeDomain = availableDomains[retryCount + 1] || availableDomains[0];
                setTimeout(() => window.createNewAccount(retryCount + 1), 1500); 
            } else {
                if(emailInput) emailInput.value = "Error generating email";
                if(loadingOverlay) loadingOverlay.style.display = 'none';
            }
        }
    } catch (err) {
        if(retryCount < 3) {
            if(emailInput) emailInput.value = "Network glitch, Retrying...";
            setTimeout(() => window.createNewAccount(retryCount + 1), 2000);
        } else {
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            if(emailInput) emailInput.value = "Please refresh the page.";
        }
    }
}

window.forceNewAccount = function() {
    if(sessionStorage.getItem('captcha_passed') === 'true') {
        processNewAccount();
    } else {
        window.showCaptcha(() => { processNewAccount(); });
    }
}

function processNewAccount() {
    localStorage.removeItem('mt_email');
    localStorage.removeItem('mt_token');
    address = null; token = null;
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(emailInput) emailInput.value = "Generating...";
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    window.clearInboxUIQuiet();
    window.createNewAccount();
}

window.createCustomAccount = function() {
    if(sessionStorage.getItem('captcha_passed') === 'true') {
        processCustomAccount();
    } else {
        window.showCaptcha(() => { processCustomAccount(); });
    }
}

async function processCustomAccount() {
    const customPrefix = prompt("Enter desired username (e.g., rahul, priya123):");
    if (!customPrefix) return;
    const cleanPrefix = customPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (!cleanPrefix) { alert("Invalid username."); return; }
    
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    if(emailInput) emailInput.value = "Creating custom email...";
    
    try {
        if (!activeDomain || availableDomains.length === 0) { await window.fetchDomainsList(); }
        const newAddress = `${cleanPrefix}@${activeDomain}`;
        const newPassword = generatePassword();
        
        const createRes = await fetch(`${API}/accounts`, { 
            method: 'POST', headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ address: newAddress, password: newPassword }) 
        });
        
        if(createRes.ok) {
            const loginRes = await fetch(`${API}/token`, { 
                method: 'POST', headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ address: newAddress, password: newPassword }) 
            });
            const tokenData = await loginRes.json();
            localStorage.removeItem('mt_token'); localStorage.removeItem('mt_email');
            address = newAddress; password = newPassword; token = tokenData.token;
            localStorage.setItem('mt_email', address); localStorage.setItem('mt_password', password); localStorage.setItem('mt_token', token);
            if(emailInput) emailInput.value = address;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            window.clearInboxUIQuiet();
            if(syncTimer) clearInterval(syncTimer);
            window.startSync();
            window.manualFetch();
            window.startEmailTimer(300);
        } else {
            alert("Username is already taken on this domain! Try another.");
            if(emailInput) emailInput.value = address || "Failed"; 
            if(loadingOverlay) loadingOverlay.style.display = 'none';
        }
    } catch (err) { 
        alert("Network Error!"); 
        if(loadingOverlay) loadingOverlay.style.display = 'none'; 
    }
}

window.generateAPIKey = function() {
    const key = 'am_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aryan_api_key', key);
    const disp = document.getElementById('api-key-display');
    if(disp) disp.value = key;
    alert("New API Key Generated Successfully!");
}
