window.fetchDomainsList = async function() {
    try {
        const res = await fetch(`${window.API}/domains`);
        const data = await res.json();
        let apiDomains = data['hydra:member'].map(d => d.domain);
        const extraDomains = ['mailto.plus', 'fexbox.org', 'fexbox.ru', 'mailbox.in.ua', 'rover.info', 'inpwa.com', 'intopwa.com', 'tofeat.com', 'tovinit.com', 'mentonit.net'];
        window.availableDomains = [...new Set([...apiDomains, ...extraDomains])].slice(0, 10);
        if(apiDomains.length > 0 && !window.activeDomain) window.activeDomain = apiDomains[0]; 
        if (typeof window.renderDomainDropdown === 'function') window.renderDomainDropdown();
    } catch(e) { }
};

window.generateAPIKey = function() {
    const key = 'am_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aryan_api_key', key);
    const disp = document.getElementById('api-key-display');
    if(disp) disp.value = key;
    alert("New API Key Generated Successfully!");
};
