window.API_URL = window.API_URL || 'https://api.mail.gw';
window.allMessages = window.allMessages || [];
window.lastMailCount = window.lastMailCount || 0;
window.soundOn = window.soundOn !== undefined ? window.soundOn : true;

// 🛡️ SECURITY HELPER: Ye email ke subject ko HTML todne se rokega
function safeText(text) {
    if (!text) return 'No Subject';
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

window.manualFetch = async function() {
    const currentToken = localStorage.getItem('mt_token');
    if(!currentToken) return; 
    
    const fetchIcon = document.getElementById('fetch-icon');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    
    try {
        const res = await fetch(`${window.API_URL}/messages`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        if(res.status === 401) { 
            if(typeof window.forceNewAccount === 'function') window.forceNewAccount(); 
            return; 
        }

        const data = await res.json();
        window.allMessages = data['hydra:member'] || [];
        
        if (window.allMessages.length > window.lastMailCount && window.soundOn) {
            const audio = document.getElementById('notification-sound');
            if(audio) audio.play().catch(e => {});
        }
        window.lastMailCount = window.allMessages.length;
        
        // Render mails instantly
        window.renderMails(); 
    } catch (err) { 
        console.error("Inbox Fetch Error:", err); 
    } finally { 
        if(fetchIcon) fetchIcon.classList.remove('fa-spin'); 
    }
};

window.renderMails = function() {
    try {
        const totalEmails = document.getElementById('total-emails');
        const inboxContent = document.getElementById('inbox-content');
        
        if(totalEmails) totalEmails.innerText = `${window.allMessages.length} emails`;
        if(!inboxContent) return;
        
        if (window.allMessages.length > 0) {
            // ✅ FIX 1: Inbox ka design change nahi hoga ab.
            inboxContent.className = "min-h-[350px] max-h-[600px] overflow-y-auto bg-white dark:bg-[#0f1525] relative p-4 text-slate-600";
            inboxContent.innerHTML = ''; 
            
            const sortElement = document.getElementById('sort-mails');
            const sortOrder = sortElement ? sortElement.value : 'newest';
            
            let sortedMails = [...window.allMessages]; 
            if (sortOrder === 'newest') sortedMails.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            else sortedMails.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
            
            sortedMails.forEach(msg => {
                const fromAddr = msg.from ? msg.from.address : 'Unknown Sender';
                const subject = safeText(msg.subject);
                const time = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                const div = document.createElement('div');
                // ✅ FIX 2: Email card ka perfect layout
                div.className = "bg-slate-50 dark:bg-darkpanel p-4 mb-3 rounded-xl shadow-sm border border-slate-200 dark:border-darkborder cursor-pointer hover:border-brand transition-all w-full text-left block group";
                div.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-slate-800 dark:text-white text-sm truncate pr-2">${safeText(fromAddr)}</span>
                        <div class="flex items-center gap-3 shrink-0">
                            <span class="text-xs text-slate-400 font-medium">${time}</span>
                            <button onclick="window.deleteSingleMail('${msg.id}', event)" class="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-2 py-1.5 rounded-lg transition-colors" title="Delete Mail">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-sm text-slate-600 dark:text-gray-300 truncate w-full">${subject}</div>
                `;
                div.onclick = () => window.openEmail(msg.id);
                inboxContent.appendChild(div);
            });
        } else {
            // ✅ FIX 3: Empty state ka perfect layout (Wapas reset karna)
            inboxContent.className = "min-h-[350px] max-h-[600px] overflow-y-auto bg-white dark:bg-[#0f1525] relative p-4 flex flex-col items-center justify-center text-slate-400";
            inboxContent.innerHTML = `
                <i class="fa-solid fa-inbox text-6xl mb-4 opacity-30"></i>
                <p class="font-bold text-xl text-slate-700 dark:text-gray-300 mb-1">No mail yet</p>
                <p class="text-sm font-medium">Waiting for incoming emails...</p>
            `;
        }
    } catch(err) {
        console.error("UI Render Error (Handled):", err);
    }
};

window.openEmail = async function(id) {
    const currentToken = localStorage.getItem('mt_token');
    try {
        const res = await fetch(`${window.API_URL}/messages/${id}`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        const data = await res.json();
        
        const modalSubject = document.getElementById('modal-subject');
        const modalFrom = document.getElementById('modal-from');
        const modalBodyIframe = document.getElementById('modal-body-iframe');
        const emailModal = document.getElementById('email-modal');
        
        if(modalSubject) modalSubject.innerText = data.subject || 'No Subject';
        if(modalFrom) modalFrom.innerText = data.from.address || 'Unknown Sender';
        if(modalBodyIframe) modalBodyIframe.srcdoc = data.html ? data.html[0] : (data.text || '<p style="padding:20px; font-family:sans-serif;">No content to display.</p>');
        
        if(emailModal) {
            emailModal.classList.remove('hidden');
            emailModal.classList.add('flex');
        }
    } catch(err) { console.error("Email Open Error:", err); }
};

window.closeModal = function() {
    const emailModal = document.getElementById('email-modal');
    const modalBodyIframe = document.getElementById('modal-body-iframe');
    if(emailModal) { emailModal.classList.add('hidden'); emailModal.classList.remove('flex'); }
    if(modalBodyIframe) modalBodyIframe.srcdoc = '';
};

window.deleteSingleMail = async function(id, event) {
    if(event && event.stopPropagation) event.stopPropagation(); // Parent par click hone se roke
    const currentToken = localStorage.getItem('mt_token');
    try {
        await fetch(`${window.API_URL}/messages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${currentToken}` } });
        window.allMessages = window.allMessages.filter(m => m.id !== id); 
        window.renderMails(); 
    } catch(err) { console.error("Delete Error:", err); }
};

window.clearInboxUIQuiet = function() { 
    window.allMessages = []; 
    window.renderMails(); 
};

window.clearInboxUI = async function() { 
    const currentToken = localStorage.getItem('mt_token');
    const fetchIcon = document.getElementById('fetch-icon');
    if(fetchIcon) fetchIcon.classList.add('fa-spin');
    
    // Sabko delete karo asynchronously
    const deletePromises = window.allMessages.map(msg => 
        fetch(`${window.API_URL}/messages/${msg.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${currentToken}` } }).catch(e => e)
    );
    
    await Promise.all(deletePromises);
    
    window.allMessages = []; 
    window.renderMails();
    if(fetchIcon) fetchIcon.classList.remove('fa-spin');
};

window.startSync = function() {
    if(window.syncTimer) clearInterval(window.syncTimer);
    window.syncTimer = setInterval(window.manualFetch, 5000); 
};

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
};

window.fastOtpReset = async function() {
    const boltIcon = document.getElementById('fast-bolt-icon');
    if(boltIcon) boltIcon.classList.add('fa-spin');
    await window.manualFetch();
    if(boltIcon) boltIcon.classList.remove('fa-spin');
};
