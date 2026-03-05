<div class="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-darkpanel bg-brand text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                            <div class="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-bold text-slate-800 dark:text-white text-lg">v2.8.0 - Modals & UI Polish</h4>
                                    <span class="text-xs font-bold bg-brand/10 text-brand px-2 py-1 rounded">Latest</span>
                                </div>
                                <ul class="text-sm text-slate-600 dark:text-gray-300 list-none space-y-2 mt-3">
                                    <li class="flex gap-2"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> Improved all legal and info modals.</li>
                                    <li class="flex gap-2"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> Fixed India Flag rendering issue on Desktop.</li>
                                    <li class="flex gap-2"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> Added functional Support and UPI modal.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div class="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-darkpanel bg-slate-400 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                            <div class="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] bg-slate-50 dark:bg-darkbg p-5 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm opacity-80">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-bold text-slate-700 dark:text-gray-300">v2.7.0 - Secure Auth Update</h4>
                                    <span class="text-xs font-semibold text-slate-500">March 2026</span>
                                </div>
                                <ul class="text-sm text-slate-500 dark:text-gray-400 list-disc pl-5 space-y-1">
                                    <li>Implemented real Firebase Google Auth system.</li>
                                    <li>Nullsto clean UI design applied.</li>
                                    <li>Separated 1000+ lines into modular files.</li>
                                </ul>
                            </div>
                        </div>

                    </div>`;
    } else if (pageName === 'Blog & News') {
        content = `<div class="space-y-4">
                    <p class="font-bold text-2xl mb-4 text-slate-800 dark:text-white">Privacy Guides (2026)</p>
                    <div class="grid grid-cols-1 gap-4">
                        <a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">How to Get Instagram OTP Using Temp Mail</h4>
                                <span class="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Social</span>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Learn how to verify accounts in India without providing your real personal phone number or email address.</p>
                            <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                        </a>
                        
                        <a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">Temporary Email for Telegram</h4>
                                <span class="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Chat</span>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Discover the truth about using fake emails for chat signups and bypassing strict messenger restrictions.</p>
                            <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                        </a>

                        <a href="#" class="block bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand transition group">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-brand group-hover:text-blue-500 transition">Disposable Email for Gaming (BGMI)</h4>
                                <span class="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Gaming</span>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400">How to use fake emails to register for gaming platforms safely without getting your main account banned.</p>
                            <p class="text-xs text-slate-400 mt-3 font-semibold">Read Article <i class="fa-solid fa-arrow-right ml-1"></i></p>
                        </a>
                    </div>
                   </div>`;
    }

    body.innerHTML = content;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

window.closePageModal = function() {
    const modal = document.getElementById('page-modal');
    if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

window.checkCookies = function() {
    if (!localStorage.getItem('cookie_accepted')) {
        const banner = document.getElementById('cookie-banner');
        if(banner) {
            banner.classList.remove('hidden');
            setTimeout(() => banner.classList.remove('translate-y-full'), 100);
        }
    }
}

window.acceptCookies = function() {
    localStorage.setItem('cookie_accepted', 'true');
    const banner = document.getElementById('cookie-banner');
    if(banner) {
        banner.classList.add('translate-y-full');
        setTimeout(() => banner.classList.add('hidden'), 500);
    }
}

window.checkTNC = function() {
    const lastAccepted = localStorage.getItem('tnc_accepted_time');
    const now = Date.now();
    if (!lastAccepted || (now - parseInt(lastAccepted)) > 24 * 60 * 60 * 1000) {
        const modal = document.getElementById('tnc-modal');
        if(modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
        return false;
    }
    return true;
}

window.acceptTNC = function() {
    const cb = document.getElementById('tnc-checkbox');
    if(!cb || !cb.checked) { alert("You must check the box to agree to the Terms and Conditions."); return; }
    localStorage.setItem('tnc_accepted_time', Date.now().toString());
    const modal = document.getElementById('tnc-modal');
    if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    window.initializeAppWithIPCheck(); 
}

window.initializeAppWithIPCheck = async function() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const userIP = data.ip;
        const blocked = JSON.parse(localStorage.getItem('blocked_ips') || '[]');
        
        if(blocked.includes(userIP) || localStorage.getItem('is_banned') === 'true') {
            document.body.innerHTML = `<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-900 text-white"><i class="fa-solid fa-ban text-6xl text-red-500 mb-4"></i><h1 class="text-3xl font-bold mb-2">Access Denied</h1><p>Your IP (${userIP}) has been permanently blocked.</p></div>`;
            return;
        }
        window.initApp(); 
    } catch(e) {
        window.initApp(); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.checkAuthSession();
    
    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const icon = btn.querySelector('.fa-chevron-down');
            const isOpen = answer.style.maxHeight;

            document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);
            document.querySelectorAll('.faq-btn .fa-chevron-down').forEach(i => i.style.transform = 'rotate(0deg)');

            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                if(icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    if(!window.checkTNC()) return; 
    window.initializeAppWithIPCheck();
    window.checkCookies();
});
