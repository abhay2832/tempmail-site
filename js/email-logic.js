const API_BASE = 'https://api.mail.gw';

// Password Generator
window.generateRandomPassword = function() { 
    return "P@ss" + Math.random().toString(36).slice(-8) + "1x!"; 
};

// 🟢 1. APP INITIALIZATION
window.initApp = async function() {
    // Pehle domains fetch karo
    await window.fetchDomainsList(); 
    
    // Check karo pehle se email bana hai ya nahi
    const currentEmail = localStorage.getItem('mt_email');
    const currentToken = localStorage.getItem('mt_token');

    if (currentEmail && currentToken) {
        // Purana email load karo
        const emailInput = document.getElementById('email-address');
        const loadingOverlay = document.getElementById('loading-overlay');
        
        if(emailInput) emailInput.value = currentEmail;
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        
        // Inbox aur Timer shuru karo
        if(typeof window.startSync === 'function') window.startSync();
        if(typeof window.manualFetch === 'function') window.manualFetch();
        if(typeof window.startEmailTimer === 'function') window.startEmailTimer(300); // 5 MINUTE TIMER
    } else {
        // Naya banvao
        window.forceNewAccount(true); 
    }

    // 🟢 Auto-Delete Old Mails Locally (5 mins expiry logic)
    setInterval(() => {
        if (!window.allMessages || window.allMessages.length === 0) return;
        const now = Date.now();
        let changed = false;
        
        window.allMessages.forEach(msg => {
            const msgTime = new Date(msg.createdAt).getTime();
            // Agar mail 5 minute (300000 ms) se purana hai, delete it
            if (((now - msgTime) > 300000)) { 
                if(typeof window.deleteSingleMail === 'function') {
                    window.deleteSingleMail(msg.id);
                    changed = true;
                }
            }
        });
        
        if (changed && typeof window.renderMails === 'function') { 
            window.renderMails(); 
        }
    }, 10000); // Check every 10 seconds
}

// 🟢 2. CREATE NEW EMAIL ACCOUNT (Auto-Retry Logic)
window.createNewAccount = async function(retryCount = 0) {
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        // Ensure domains are available
        if (!window.activeDomain || !window.availableDomains || window.availableDomains.length === 0) { 
            await window.fetchDomainsList(); 
        }
        
        // Name Generation
        let newUsername = "";
        if (window.currentEmailType === 'human') {
            const prefixes = ['aryan', 'abhay', 'raju', 'ranu', 'sita', 'riya', 'priya', 'nana', 'sikha', 'anuj', 'sankalp', 'joy', 'noah', 'rahul', 'rohit'];
            newUsername = prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(1000 + Math.random() * 9000); 
        } else {
            newUsername = Math.random().toString(36).slice(-8);
        }
        
        const newAddress = `${newUsername}@${window.activeDomain}`;
        const newPassword = window.generateRandomPassword();

        // Step A: Create Account
        const createRes = await fetch(`${API_BASE}/accounts`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: newAddress, password: newPassword })
        });

        if(createRes.ok) {
            // Step B: Get Token
            const loginRes = await fetch(`${API_BASE}/token`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: newAddress, password: newPassword })
            });
            
            const tokenData = await loginRes.json();
            
            // Save to LocalStorage
            localStorage.setItem('mt_email', newAddress);
            localStorage.setItem('mt_password', newPassword);
            localStorage.setItem('mt_token', tokenData.token);
            
            // Update UI
            if(emailInput) emailInput.value = newAddress;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            
            // Reset Inbox and Start Timers
            if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
            if(typeof window.startSync === 'function') window.startSync();
            if(typeof window.manualFetch === 'function') window.manualFetch();
            if(typeof window.startEmailTimer === 'function') window.startEmailTimer(300); // 300 sec = 5 mins
            
        } else {
            // Error handling & Domain Switching
            if (retryCount < 3 && window.availableDomains.length > 1) {
                if(emailInput) emailInput.value = "Switching domain...";
                window.activeDomain = window.availableDomains[retryCount + 1] || window.availableDomains[0];
                setTimeout(() => window.createNewAccount(retryCount + 1), 1500); 
            } else {
                if(emailInput) emailInput.value = "Server Error, Try Again!";
                if(loadingOverlay) loadingOverlay.style.display = 'none';
            }
        }
    } catch (err) {
        console.error("Account Creation Error:", err);
        if(retryCount < 3) {
            if(emailInput) emailInput.value = "Network glitch, Retrying...";
            setTimeout(() => window.createNewAccount(retryCount + 1), 2000);
        } else {
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            if(emailInput) emailInput.value = "Check Internet Connection";
        }
    }
}

// 🟢 3. FORCE NEW ACCOUNT (With One-Time Captcha)
window.forceNewAccount = function(isInitialLoad = false) {
    // Agar captcha is session mein pass ho chuka hai, seedha account banao
    if(sessionStorage.getItem('captcha_passed') === 'true') {
        processNewAccount();
    } else {
        // Agar initial load nahi hai, tabhi popup dikhao (taaki first load pe direct aa jaye agar chaho, ya mandatory rakho)
        if(typeof window.showCaptcha === 'function') {
            window.showCaptcha(() => { 
                processNewAccount(); 
            });
        } else {
            // Failsafe agar captcha UI load nahi hua
            processNewAccount();
        }
    }
}

function processNewAccount() {
    localStorage.removeItem('mt_email');
    localStorage.removeItem('mt_token');
    
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    if(emailInput) emailInput.value = "Generating...";
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    if(typeof window.clearInboxUIQuiet === 'function') window.clearInboxUIQuiet();
    
    window.createNewAccount();
}

// 🟢 4. CUSTOM ACCOUNT CREATION
window.createCustomAccount = function() {
    if(sessionStorage.getItem('captcha_passed') === 'true') {
        processCustomAccount();
    } else {
        if(typeof window.showCaptcha === 'function') {
            window.showCaptcha(() => { processCustomAccount(); });
        } else {
            processCustomAccount();
        }
    }
}

async function processCustomAccount() {
    const customPrefix = prompt("Enter desired username (e.g., rahul, priya123):");
    if (!customPrefix) return;
    
    const cleanPrefix = customPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (!cleanPrefix) { 
        alert("Invalid username. Use only letters and numbers without spaces."); 
        return; 
    }
    
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    if(emailInput) emailInput.value = "Creating custom email...";
    
    try {
        if (!window.activeDomain) { await window.fetchDomainsList(); }
        const newAddress = `${cleanPrefix}@${window.activeDomain}`;
        const newPassword = window.generateRandomPassword();
        
        const createRes = await fetch(`${API_BASE}/accounts`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ address: newAddress, password: newPassword }) 
        });
        
        if(createRes.ok) {
            const loginRes = await fetch(`${API_BASE}/token`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
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
            if(typeof window.startEmailTimer === 'function') window.startEmailTimer(300); // 5 MINUTE
        } else {
            alert("This Username is already taken on this domain! Please try another name.");
            if(emailInput) emailInput.value = localStorage.getItem('mt_email') || "Failed"; 
            if(loadingOverlay) loadingOverlay.style.display = 'none';
        }
    } catch (err) { 
        console.error(err);
        alert("Network Error! Failed to create custom email."); 
        if(loadingOverlay) loadingOverlay.style.display = 'none'; 
    }
}

// 🟢 5. API KEY GENERATOR
window.generateAPIKey = function() {
    const key = 'am_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aryan_api_key', key);
    const disp = document.getElementById('api-key-display');
    if(disp) disp.value = key;
    alert("New Developer API Key Generated Successfully!");
}
