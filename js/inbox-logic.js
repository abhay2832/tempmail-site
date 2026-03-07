async function fastOtpReset() {
    const boltIcon = document.getElementById('fast-bolt-icon');
    if(boltIcon) boltIcon.classList.add('fa-spin');
    await manualFetch();
    if(boltIcon) boltIcon.classList.remove('fa-spin');
}

async function deleteSingleMail(id, event) {
    if(event && event.stopPropagation) event.stopPropagation();
    try {
        const res = await fetch(`${API}/messages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) {
            allMessages = allMessages.filter(m => m.id !== id);
            renderMails();
        }
    } catch(err) {}
}

async function manualFetch() {
    if(!token) return;
    const fetchIcon = document.getElementById('fetch-icon');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    if (allMessages.length === 0 && inboxContent) {
        inboxContent.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-brand text-4xl mb-3"></i><p class="font-semibold">Loading emails...</p>`;
        inboxContent.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
    }
    try {
        const res = await fetch(`${API}/messages`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        let fetchedMails = data['hydra:member'] || [];
        const adultKws = ['pornhub', 'xvideos', 'brazzers', 'onlyfans', 'xhamster', 'adult', 'sex', 'nude'];
        allMessages = fetchedMails.filter(msg => {
            const fromAddr = (msg.from.address || "").toLowerCase();
            const subj = (msg.subject || "").toLowerCase();
            const isAdult = adultKws.some(kw => fromAddr.includes(kw) || subj.includes(kw));
            if(isAdult) {
                fetch(`${API}/messages/${msg.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                return false;
            }
            return true;
        });
        if (allMessages.length > 40) {
            const sortedForDelete = [...allMessages].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
            const extraMails = sortedForDelete.slice(0, allMessages.length - 40);
            extraMails.forEach(m => fetch(`${API}/messages/${m.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }));
            allMessages = allMessages.filter(m => !extraMails.some(e => e.id === m.id));
        }

        if (allMessages.length > 0) {
            if(allMessages.length > lastMailCount && soundOn) {
                const audio = document.getElementById('notification-sound');
                if(audio) audio.play().catch(e => {});
            }
            lastMailCount = allMessages.length;
            renderMails(); 
        } else {
            renderMails();
        }
    } catch (err) {} finally {
        if(fetchIcon) fetchIcon.classList.remove('fa-spin');
    }
}

function renderMails() {
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
                        <button onclick="deleteSingleMail('${msg.id}', event)" class="text-red-500 hover:text-red-700 hover:scale-110 transition-transform p-1" title="Delete Mail"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
                <div class="text-sm text-slate-600 dark:text-gray-300 truncate">${msg.subject || 'No Subject'}</div>
            `;
            div.onclick = () => openEmail(msg.id);
            if(inboxContent) inboxContent.appendChild(div);
        });
    } else {
        if(inboxContent) {
            inboxContent.innerHTML = `<i class="fa-solid fa-inbox text-4xl mb-3 opacity-50"></i><p class="font-bold text-lg text-slate-600 dark:text-gray-300">No mail yet</p><p>Waiting for emails...</p>`;
            inboxContent.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
        }
    }
}

async function openEmail(id) {
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

function closeModal() {
    const emailModal = document.getElementById('email-modal');
    const modalBodyIframe = document.getElementById('modal-body-iframe');
    if(emailModal) { emailModal.classList.add('hidden'); emailModal.classList.remove('flex'); }
    if(modalBodyIframe) modalBodyIframe.srcdoc = '';
}

async function clearInboxUIQuiet() { 
    allMessages = [];
    lastMailCount = 0; renderMails(); 
}

async function clearInboxUI() { 
    const fetchIcon = document.getElementById('fetch-icon');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    for (const msg of allMessages) {
        try { await fetch(`${API}/messages/${msg.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        } catch(e) {}
    }
    allMessages = [];
    lastMailCount = 0; renderMails();
    if(fetchIcon) fetchIcon.classList.remove('fa-spin');
}

function startSync() {
    if(syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(manualFetch, refreshSec * 1000);
}

function toggleAutoSync() {
    isSyncing = !isSyncing;
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');
    if(isSyncing) {
        if(icon) icon.className = "fa-solid fa-bolt text-amber-500";
        if(text) text.innerText = "Auto-Sync: ON";
        startSync();
    } else {
        if(icon) icon.className = "fa-solid fa-bolt text-gray-500";
        if(text) text.innerText = "Auto-Sync: OFF";
        clearInterval(syncTimer);
    }
}
