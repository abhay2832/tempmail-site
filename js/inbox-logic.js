window.manualFetch = async function() {
    if(!token) return;
    const fetchIcon = document.getElementById('fetch-icon');
    const inboxContent = document.getElementById('inbox-content');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    
    if (allMessages.length === 0 && inboxContent) {
        inboxContent.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-brand text-4xl mb-3"></i><p class="font-semibold">Loading emails...</p>`;
        inboxContent.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
    }
    
    try {
        const res = await fetch(`${API}/messages`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        allMessages = data['hydra:member'] || [];
        
        if (allMessages.length > 0) {
            if(allMessages.length > lastMailCount && soundOn) {
                const audio = document.getElementById('notification-sound');
                if(audio) audio.play().catch(e => {});
            }
            lastMailCount = allMessages.length;
            window.renderMails(); 
        } else {
            window.renderMails(); 
        }
    } catch (err) {} finally {
        if(fetchIcon) fetchIcon.classList.remove('fa-spin');
    }
}

window.renderMails = function() {
    const totalEmails = document.getElementById('total-emails');
    const inboxContent = document.getElementById('inbox-content');
    if(totalEmails) totalEmails.innerText = `${allMessages.length} emails`;
    
    if (allMessages.length > 0) {
        if(inboxContent) {
            inboxContent.innerHTML = '';
            inboxContent.classList.remove('flex', 'flex-col', 'items-center', 'justify-center');
        }
        const sortOrder = document.getElementById('sort-mails').value;
        let sortedMails = [...allMessages]; 
        if (sortOrder === 'newest') sortedMails.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        else sortedMails.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        sortedMails.forEach(msg => {
            const div = document.createElement('div');
            div.className = "bg-white dark:bg-darkpanel p-4 mb-2 rounded-xl shadow-sm border border-slate-100 dark:border-darkborder cursor-pointer hover:border-brand transition-all duration-300 w-full text-left";
            div.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-slate-800 dark:text-white text-sm truncate">${msg.from.address}</span>
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-slate-400">${new Date(msg.createdAt).toLocaleTimeString()}</span>
                        <button onclick="window.deleteSingleMail('${msg.id}', event)" class="text-red-500 hover:text-red-700 hover:scale-110 transition-transform p-1" title="Delete Mail"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
                <div class="text-sm text-slate-600 dark:text-gray-300 truncate">${msg.subject || 'No Subject'}</div>
            `;
            div.onclick = () => window.openEmail(msg.id);
            if(inboxContent) inboxContent.appendChild(div);
        });
    } else {
        if(inboxContent) {
            inboxContent.innerHTML = `<i class="fa-solid fa-inbox text-4xl mb-3 opacity-50"></i><p class="font-bold text-lg text-slate-600 dark:text-gray-300">No mail yet</p><p>Waiting for emails...</p>`;
            inboxContent.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
        }
    }
}

window.openEmail = async function(id) {
    try {
        const res = await fetch(`${API}/messages/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        const modalSubject = document.getElementById('modal-subject');
        const modalFrom = document.getElementById('modal-from');
        const modalBodyIframe = document.getElementById('modal-body-iframe');
        const emailModal = document.getElementById('email-modal');
        if(modalSubject) modalSubject.innerText = data.subject || 'No Subject';
        if(modalFrom) modalFrom.innerText = data.from.address;
        if(modalBodyIframe) modalBodyIframe.srcdoc = data.html ? data.html[0] : (data.text || 'No content');
        if(emailModal) {
            emailModal.classList.remove('hidden');
            emailModal.classList.add('flex');
        }
    } catch(err) {}
}

window.closeModal = function() {
    const emailModal = document.getElementById('email-modal');
    const modalBodyIframe = document.getElementById('modal-body-iframe');
    if(emailModal) { emailModal.classList.add('hidden'); emailModal.classList.remove('flex'); }
    if(modalBodyIframe) modalBodyIframe.srcdoc = '';
}

window.deleteSingleMail = async function(id, event) {
    if(event && event.stopPropagation) event.stopPropagation();
    try {
        const res = await fetch(`${API}/messages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) { allMessages = allMessages.filter(m => m.id !== id); window.renderMails(); }
    } catch(err) {}
}

window.clearInboxUIQuiet = async function() { allMessages = []; window.renderMails(); }

window.clearInboxUI = async function() { 
    const fetchIcon = document.getElementById('fetch-icon');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    for (const msg of allMessages) {
        try { await fetch(`${API}/messages/${msg.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); } catch(e) {}
    }
    allMessages = []; window.renderMails();
    if(fetchIcon) fetchIcon.classList.remove('fa-spin');
}

window.startSync = function() {
    if(syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(window.manualFetch, refreshSec * 1000);
}

window.toggleAutoSync = function() {
    isSyncing = !isSyncing;
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');
    if(isSyncing) {
        if(icon) icon.className = "fa-solid fa-bolt text-amber-500";
        if(text) text.innerText = "Auto-Sync: ON";
        window.startSync();
    } else {
        if(icon) icon.className = "fa-solid fa-bolt text-gray-500";
        if(text) text.innerText = "Auto-Sync: OFF";
        clearInterval(syncTimer);
    }
}

window.fastOtpReset = async function() {
    const boltIcon = document.getElementById('fast-bolt-icon');
    if(boltIcon) boltIcon.classList.add('fa-spin');
    await window.manualFetch();
    if(boltIcon) boltIcon.classList.remove('fa-spin');
}
