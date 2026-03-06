window.API_URL = window.API_URL || 'https://api.mail.gw';

window.generateRandomPassword = function() { 
    return "P@ss" + Math.random().toString(36).slice(-8) + "1x!"; 
};

window.initApp = async function() {
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    if(emailInput) emailInput.value = "Connecting to Server...";
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        if(typeof window.fetchDomainsList === 'function') {
            await window.fetchDomainsList(); 
        }
    } catch(e) {
        console.log("Domain fetch error ignored in init.");
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
    if(emailInput) emailInput.value = "Generating Email...";
    
    try {
        // Safe domain selection
        let finalDomain = "txcct.com"; // Default safe domain
        if (window.activeDomain) {
            finalDomain = window.activeDomain;
        } else if (window.availableDomains && window.availableDomains.length > 0) {
            finalDomain = window.availableDomains[0];
        }

        // Username generation
        let newUsername = "";
        let type = window.currentEmailType || 'human';
        
        if (type === 'human') {
            const prefixes = ['aryan', 'abhay', 'raju', 'ranu', 'sita', 'riya', 'priya', 'nana', 'sikha', 'anuj', 'sankalp', 'joy', 'noah', 'rahul', 'rohit'];
            newUsername = prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(1000 + Math.random() * 9000); 
        } else {
            newUsername = Math.random().toString(36).substring(2, 12);
        }
        
        const newAddress = `${newUsername}@${finalDomain}`;
        const newPassword = window.generateRandomPassword();

        // Check 1: Creating Account
        const createRes = await fetch(`${window.API_URL}/accounts`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ address: newAddress, password: newPassword })
        });

        if(createRes.ok) {
            // Check 2: Getting Auth Token
            const loginRes = await fetch(`${window.API_URL}/token`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ address: newAddress, password: newPassword })
            });
            
            if(!loginRes.ok) throw new Error("Token Blocked by Server");
            
            const tokenData = await loginRes.json();
            
            // Save and Start
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
            // Error Handling if API rejects domain
            if (retryCount < 3) {
                if(emailInput) emailInput.value = `Domain ${finalDomain} failed. Trying another...`;
                if(window.availableDomains && window.availableDomains.length > 1) {
                    window.activeDomain = window.availableDomains[retryCount + 1] || window.availableDomains[0];
                } else {
                    window.activeDomain = "1secmail.net"; // Last resort domain
                }
                setTimeout(() => window.createNewAccount(retryCount + 1), 1500); 
            } else {
                throw new Error(`API Rejected. Status: ${createRes.status}`);
            }
        }
    } catch (err) {
        // THIS CATCHES THE "CHECK INTERNET" ERROR
        console.error("Detailed Generation Error:", err);
        
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        if(emailInput) {
            if(err.message.includes("Failed to fetch")) {
                emailInput.value = "Blocked by Adblocker/VPN. Please turn it off.";
            } else {
                emailInput.value = `Error: ${err.message}`;
            }
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
    if(emailInput) emailInput.value = "Initializing...";
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
        let finalDomain = window.activeDomain || "txcct.com";
        const newAddress = `${cleanPrefix}@${finalDomain}`;
        const newPassword = window.generateRandomPassword();
        
        const createRes = await fetch(`${window.API_URL}/accounts`, { 
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
            body: JSON.stringify({ address: newAddress, password: newPassword }) 
        });
        
        if(createRes.ok) {
            const loginRes = await fetch(`${window.API_URL}/token`, { 
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
            alert("Username taken or Domain blocked by API. Try 'New Email' first.");
            if(emailInput) emailInput.value = localStorage.getItem('mt_email') || "Failed"; 
            if(loadingOverlay) loadingOverlay.style.display = 'none';
        }
    } catch (err) { 
        if(emailInput) emailInput.value = "Blocked by Browser or Network.";
        if(loadingOverlay) loadingOverlay.style.display = 'none'; 
    }
}
