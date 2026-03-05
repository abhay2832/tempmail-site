window.initApp = async function() {
    await window.fetchDomainsList(); 
    if (address && token) {
        const emailInput = document.getElementById('email-address');
        const loadingOverlay = document.getElementById('loading-overlay');
        if(emailInput) emailInput.value = address;
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        window.startSync();
        window.manualFetch();
        window.startEmailTimer(600); 
    } else {
        window.createNewAccount();
    }

    setInterval(() => {
        if (!allMessages || allMessages.length === 0) return;
        const now = Date.now();
        let changed = false;
        
        allMessages.forEach(msg => {
            const msgTime = new Date(msg.createdAt).getTime();
            if (((now - msgTime) > 300000)) { // 300000ms = 5 mins
                window.deleteSingleMail(msg.id);
                changed = true;
            }
        });
        if (changed) { window.renderMails(); }
    }, 10000); 
}

window.createNewAccount = async function() {
    const emailInput = document.getElementById('email-address');
    const loadingOverlay = document.getElementById('loading-overlay');
    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    
    try {
        if (!activeDomain || availableDomains.length === 0) { await window.fetchDomainsList(); }
        
        let newUsername = "";
        if (currentEmailType === 'human') {
            const prefixes = ['aryan', 'abhay', 'raju', 'ranu', 'sita', 'riya', 'priya', 'nana', 'sikha', 'anuj', 'sankalp', 'joy', 'noah', 'rahul', 'rohit', 'neha', 'pooja', 'vikas'];
            newUsername = prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(100 + Math.random() * 900); 
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
            window.startEmailTimer(600); 
        } else {
            const domainRes = await fetch(`${API}/domains`);
            const domainData = await domainRes.json();
            activeDomain = domainData['hydra:member'][0].domain;
            if(emailInput) emailInput.value = "Switching domain...";
            setTimeout(() => window.createNewAccount(), 1000); 
        }
    } catch (err) {
        if(emailInput) emailInput.value = "Network Error! Retrying...";
        setTimeout(() => window.createNewAccount(), 2000);
    }
}

window.forceNewAccount = function() {
    window.showCaptcha(() => {
        localStorage.removeItem('mt_email');
        localStorage.removeItem('mt_token');
        address = null; token = null;
        const emailInput = document.getElementById('email-address');
        const loadingOverlay = document.getElementById('loading-overlay');
        if(emailInput) emailInput.value = "Generating...";
        if(loadingOverlay) loadingOverlay.style.display = 'flex';
        window.clearInboxUIQuiet();
        window.createNewAccount();
    });
}

window.createCustomAccount = function() {
    window.showCaptcha(async () => {
        const customPrefix = prompt("Enter your desired username (e.g., rahul, priya123):");
        if (!customPrefix) return;
        const cleanPrefix = customPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (!cleanPrefix) { alert("Invalid username. Use only letters and numbers."); return; }
        
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
                localStorage.setItem('mt_email', address);
                localStorage.setItem('mt_password', password);
                localStorage.setItem('mt_token', token);
                if(emailInput) emailInput.value = address;
                if(loadingOverlay) loadingOverlay.style.display = 'none';
                window.clearInboxUIQuiet();
                if(syncTimer) clearInterval(syncTimer);
                window.startSync();
                window.manualFetch();
                window.startEmailTimer(600); 
            } else {
                alert("Username is already taken on this domain! Try another.");
                if(emailInput) emailInput.value = address; 
                if(loadingOverlay) loadingOverlay.style.display = 'none';
            }
        } catch (err) {
            alert("Network Error! Please try again.");
            if(emailInput) emailInput.value = address;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
        }
    });
}

window.generateAPIKey = function() {
    const key = 'am_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aryan_api_key', key);
    const disp = document.getElementById('api-key-display');
    if(disp) disp.value = key;
    alert("New API Key Generated Successfully!");
}
