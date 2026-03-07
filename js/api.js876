async function initializeAppWithIPCheck() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const userIP = data.ip;
        const blocked = JSON.parse(localStorage.getItem('blocked_ips') || '[]');
        if(blocked.includes(userIP) || localStorage.getItem('is_banned') === 'true') {
            document.body.innerHTML = `<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-900 text-white"><i class="fa-solid fa-ban text-6xl text-red-500 mb-4"></i><h1 class="text-3xl font-bold mb-2">Access Denied</h1><p>Your IP (${userIP}) has been permanently blocked from our network due to policy violations or abuse.</p></div>`;
            return;
        }
        initApp();
    } catch(e) {
        initApp();
    }
}

async function fetchDomainsList() {
    try {
        const res = await fetch(`${API}/domains`);
        const data = await res.json();
        let apiDomains = data['hydra:member'].map(d => d.domain);
        const extraDomains = ['mailto.plus', 'fexbox.org', 'fexbox.ru', 'mailbox.in.ua', 'rover.info', 'inpwa.com', 'intopwa.com', 'tofeat.com', 'tovinit.com', 'mentonit.net'];
        availableDomains = [...new Set([...apiDomains, ...extraDomains])].slice(0, 10);
        if(apiDomains.length > 0 && !activeDomain) activeDomain = apiDomains[0]; 
        renderDomainDropdown();
    } catch(e) { }
}

function generateAPIKey() {
    const key = 'am_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aryan_api_key', key);
    const disp = document.getElementById('api-key-display');
    if(disp) disp.value = key;
    alert("New API Key Generated Successfully!");
}
