window.API_URL = window.API_URL || 'https://api.mail.gw';
window.allMessages = window.allMessages || [];
window.lastMailCount = window.lastMailCount || 0;
window.soundOn = window.soundOn !== undefined ? window.soundOn : true;

window.manualFetch = async function() {
    const currentToken = localStorage.getItem('mt_token');
    if(!currentToken) return; 
    
    const fetchIcon = document.getElementById('fetch-icon');
    const inboxContent = document.getElementById('inbox-content');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    
    if ((!window.allMessages || window.allMessages.length === 0) && inboxContent) {
        inboxContent.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-brand text-4xl mb-3"></i><p class="font-semibold text-slate-600 dark:text-gray-300">Checking for new emails...</p>`;
        inboxContent.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
    }
    
    try {
        const res = await fetch(`${window.API_URL}/messages`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        if(res.status === 401) { 
            if(typeof window.forceNewAccount === 'function') window.forceNewAccount(); 
            return; 
        }

        const data = await res.json();
        window.allMessages = data['hydra:member'] || [];
        
        if (window.allMessages.length > 0) {
            if(window.allMessages.length > window.lastMailCount && window.soundOn) {
                const audio = document.getElementById('notification-sound');
                if(audio) audio.play().catch(e => {});
            }
            window.lastMailCount = window.allMessages.length;
            window.renderMails(); 
        } else {
            window.renderMails(); 
        }
    } catch (err) { 
        console.error("Inbox Error:", err); 
    } finally { 
        if(fetchIcon) fetchIcon.classList.remove('fa-spin'); 
    }
}

window.renderMails = function() {
    const totalEmails = document.getElementById('total-emails');
    const inboxContent = document.getElementById('inbox-content');
    if(totalEmails) totalEmails.innerText = `${window.allMessages.length} emails`;
    
    if (window.allMessages.length > 0) {
        if(inboxContent) {
            inboxContent.innerHTML = '';
            inboxContent.classList.remove('flex', 'flex-col', 'items-center', 'justify-center');
        }
        const sortElement = document.getElementById('sort-mails');
        const sortOrder = sortElement ? sortElement.value : 'newest';
        
        let sortedMails = [...window.allMessages]; 
        if (sortOrder === 'newest') sortedMails.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        else sortedMails.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        sortedMails.forEach(msg => {
            const div = document.createElement('div');
            div.className = "bg-white dark:bg-darkpanel p-4 mb-2 rounded-xl shadow-sm border border-slate-100 dark:border-darkborder cursor-pointer hover:border-brand transition w-full text-left";
            div.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-slate-800 dark:text-white text-sm truncate">${msg.from.address}</span>
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-slate-400">${new Date(msg.createdAt).toLocaleTimeString()}</span>
                        <button onclick="window.deleteSingleMail('${msg.id}', event)" class="text-red-500 hover:text-red-700 p-1" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
                <div class="text-sm text-slate-600 dark:text-gray-300 truncate">${msg.subject || 'No Subject'}</div>
            `;
            div.onclick = () => window.openEmail(msg.id);
            if(inboxContent) inboxContent.appendChild(div);
        });
    } else {
        if(inboxContent) {
            inboxContent.innerHTML = `<i class="fa-solid fa-inbox text-4xl mb-3 opacity-50"></i><p class="font-bold text-lg text-slate-600 dark:text-gray-300">No mail yet</p><p class="text-sm">Waiting for emails...</p>`;
            inboxContent.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
        }
    }
}

window.openEmail = async function(id) {
    const currentToken = localStorage.getItem('mt_token');
    try {
        const res = await fetch(`${window.API_URL}/messages/${id}`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        const data = await res.json();
        document.getElementById('modal-subject').innerText = data.subject || 'No Subject';
        document.getElementById('modal-from').innerText = data.from.address;
        document.getElementById('modal-body-iframe').srcdoc = data.html ? data.html[0] : (data.text || 'No content');
        document.getElementById('email-modal').classList.remove('hidden');
        document.getElementById('email-modal').classList.add('flex');
    } catch(err) {}
}

window.closeModal = function() {
    document.getElementById('email-modal').classList.add('hidden');
    document.getElementById('email-modal').classList.remove('flex');
    document.getElementById('modal-body-iframe').srcdoc = '';
}

window.deleteSingleMail = async function(id, event) {
    if(event && event.stopPropagation) event.stopPropagation();
    const currentToken = localStorage.getItem('mt_token');
    try {
        await fetch(`${window.API_URL}/messages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${currentToken}` } });
        window.allMessages = window.allMessages.filter(m => m.id !== id); 
        window.renderMails(); 
    } catch(err) {}
}

window.clearInboxUIQuiet = function() { 
    window.allMessages = []; 
    window.renderMails(); 
}

window.clearInboxUI = async function() { 
    const currentToken = localStorage.getItem('mt_token');
    const fetchIcon = document.getElementById('fetch-icon');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    
    for (const msg of window.allMessages) {
        try { await fetch(`${window.API_URL}/messages/${msg.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${currentToken}` } }); } catch(e) {}
    }
    window.allMessages = []; 
    window.renderMails();
    if(fetchIcon) fetchIcon.classList.remove('fa-spin');
}

window.startSync = function() {
    if(window.syncTimer) clearInterval(window.syncTimer);
    // Yahan direct 5000 ms (5 seconds) likh diya gaya hai, koi error nahi aayega ab
    window.syncTimer = setInterval(window.manualFetch, 5000); 
}

window.toggleAutoSync = function() {
    window.isSyncing = !window.isSyncing;
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');
    if(window.isSyncing) {
        if(icon) icon.className = "fa-solid fa-bolt text-amber-500";
        if(text) text.innerText = "Auto-Sync: ON";
        window.startSync();
    } else {
        if(icon) icon.className = "fa-solid fa-bolt text-gray-500";
        if(text) text.innerText = "Auto-Sync: OFF";
        if(window.syncTimer) clearInterval(window.syncTimer);
    }
}

window.fastOtpReset = async function() {
    const boltIcon = document.getElementById('fast-bolt-icon');
    if(boltIcon) boltIcon.classList.add('fa-spin');
    await window.manualFetch();
    if(boltIcon) boltIcon.classList.remove('fa-spin');
}
