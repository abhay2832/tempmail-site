async function initApp() {
    await fetchDomainsList();
    if (address && token) {
        if(emailInput) emailInput.value = address;
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        startSync();
        manualFetch();
        startEmailTimer(600); 
    }

    setInterval(() => {
        if (!allMessages || allMessages.length === 0) return;
        const now = new Date();
        const adultKws = ['pornhub', 'xvideos', 'brazzers', 'onlyfans', 'xhamster', 'adult', 'sex', 'nude'];
        
        allMessages.forEach(msg => {
            const msgTime = new Date(msg.createdAt);
            const fromAddr = (msg.from.address || "").toLowerCase();
            const subj = (msg.subject || "").toLowerCase();
            const isAdult = adultKws.some(kw => fromAddr.includes(kw) || subj.includes(kw));
            
            if (((now - msgTime) > 5 * 60 * 1000) || isAdult) { 
                deleteSingleMail(msg.id);
            }
        });
    }, 30000);
}

async function createNewAccount() {
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

    if(loadingOverlay) loadingOverlay.style.display = 'flex';
    try {
        let stableDomain = activeDomain;
        if (!stableDomain) {
            const domainRes = await fetch(`${API}/domains`);
            const domainData = await domainRes.json();
            stableDomain = domainData['hydra:member'][0].domain; 
            activeDomain = stableDomain;
            renderDomainDropdown();
        }

        let newUsername = "";
        if (currentEmailType === 'human') {
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
        const newPassword = generatePassword();

        const createRes = await fetch(`${API}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: newAddress, password: newPassword })
        });
        if(createRes.ok) {
            const loginRes = await fetch(`${API}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: newAddress, password: newPassword })
            });
            const tokenData = await loginRes.json();
            address = newAddress;
            password = newPassword;
            token = tokenData.token;
            localStorage.setItem('mt_email', address);
            localStorage.setItem('mt_password', password);
            localStorage.setItem('mt_token', token);
            if(emailInput) emailInput.value = address;
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            clearInboxUIQuiet();
            startSync();
            startEmailTimer(600);
        } else {
            const domainRes = await fetch(`${API}/domains`);
            const domainData = await domainRes.json();
            activeDomain = domainData['hydra:member'][0].domain;
            if(emailInput) emailInput.value = "Switching domain...";
            setTimeout(() => createNewAccount(), 1000);
        }
    } catch (err) {
        if(emailInput) emailInput.value = "Network Error! Retrying...";
        setTimeout(() => createNewAccount(), 2000);
    }
}

function forceNewAccount() {
    showCaptcha(() => {
        localStorage.removeItem('mt_email');
        localStorage.removeItem('mt_token');
        address = null;
        token = null;
        if(emailInput) emailInput.value = "Generating...";
        if(loadingOverlay) loadingOverlay.style.display = 'flex';
        clearInboxUIQuiet();
        createNewAccount();
    });
}

function createCustomAccount() {
    showCaptcha(async () => {
        const customPrefix = prompt("Enter your desired username (e.g., rahul, priya123):");
        if (!customPrefix) return;
        const cleanPrefix = customPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (!cleanPrefix) { alert("Invalid username. Use only letters and numbers."); return; }
        if(loadingOverlay) loadingOverlay.style.display = 'flex';
        if(emailInput) emailInput.value = "Creating custom email...";
        try {
            let stableDomain = activeDomain;
            if (!stableDomain) {
                const domainRes = await fetch(`${API}/domains`);
                const domainData = await domainRes.json();
                stableDomain = domainData['hydra:member'][0].domain; 
                activeDomain = stableDomain;
            }
            const newAddress = `${cleanPrefix}@${stableDomain}`;
            const newPassword = generatePassword();
            const createRes = await fetch(`${API}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: newAddress, password: newPassword })
            });
            if(createRes.ok) {
                const loginRes = await fetch(`${API}/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: newAddress, password: newPassword })
                });
                const tokenData = await loginRes.json();
                localStorage.removeItem('mt_token');
                localStorage.removeItem('mt_email');
                address = newAddress; password = newPassword; token = tokenData.token;
                localStorage.setItem('mt_email', address);
                localStorage.setItem('mt_password', password);
                localStorage.setItem('mt_token', token);
                if(emailInput) emailInput.value = address;
                clearInboxUIQuiet();
                if(syncTimer) clearInterval(syncTimer);
                startSync();
                manualFetch();
                startEmailTimer(600);
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
