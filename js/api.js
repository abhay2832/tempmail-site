window.checkAuthSession = function() {
    const token = localStorage.getItem('auth_jwt');
    const userDetailsStr = localStorage.getItem('auth_user_details');
    const signupBtn = document.getElementById('nav-signup-btn');
    const profileBtn = document.getElementById('nav-profile-btn');
    
    if (token && userDetailsStr) {
        const user = JSON.parse(userDetailsStr);
        if(signupBtn) signupBtn.classList.add('hidden');
        if(profileBtn) { profileBtn.classList.remove('hidden'); profileBtn.classList.add('flex'); }
        return user;
    }
    if(signupBtn) signupBtn.classList.remove('hidden');
    if(profileBtn) { profileBtn.classList.add('hidden'); profileBtn.classList.remove('flex'); }
    return null;
};

window.openAuthPortal = function() {
    const user = window.checkAuthSession();
    const modal = document.getElementById('auth-modal');
    if(!modal) return;
    modal.classList.remove('hidden'); modal.classList.add('flex');
    
    if(user) {
        window.switchAuthView('view-profile');
        document.getElementById('profile-name').innerText = user.name || "Verified User";
        if(user.photo) {
            document.getElementById('profile-img').src = user.photo;
            document.getElementById('profile-img').classList.remove('hidden');
            document.getElementById('profile-initial').classList.add('hidden');
        } else {
            document.getElementById('profile-img').classList.add('hidden');
            document.getElementById('profile-initial').classList.remove('hidden');
            document.getElementById('profile-initial').innerText = (user.name || user.contact || "U").charAt(0).toUpperCase();
        }
        document.getElementById('profile-contact').innerText = user.contact || user.email || user.id;
    } else {
        window.switchAuthView('view-auth-init');
    }
};

window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
};

window.switchAuthView = function(viewId) {
    ['view-auth-init', 'view-profile'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            if(id === viewId) { el.classList.remove('hidden'); el.classList.add('block'); } 
            else { el.classList.add('hidden'); el.classList.remove('block'); }
        }
    });
};

window.startGoogleFlow = function() {
    if (typeof firebase === 'undefined') return alert("Firebase not loaded!");
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        const user = result.user;
        localStorage.setItem('auth_jwt', user.uid);
        localStorage.setItem('auth_user_details', JSON.stringify({ id: user.uid, email: user.email, name: user.displayName, photo: user.photoURL, contact: user.email }));
        window.openAuthPortal();
    }).catch((error) => { alert("Google Login Failed: " + error.message); });
};

window.triggerLogout = function() {
    if (typeof firebase !== 'undefined') {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('auth_jwt');
            localStorage.removeItem('auth_user_details');
            window.checkAuthSession();
            window.closeAuthModal();
        });
    }
};

window.fetchDomainsList = async function() {
    try {
        // Safe check for API URL
        const apiUrl = window.API_URL || 'https://api.mail.gw';
        const res = await fetch(`${apiUrl}/domains`);
        const data = await res.json();
        let apiDomains = data['hydra:member'].filter(d => d.isActive).map(d => d.domain);
        window.availableDomains = [...new Set([...apiDomains])];
        if(window.availableDomains.length > 0 && !window.activeDomain) {
            window.activeDomain = window.availableDomains[0]; 
        }
        if(typeof window.renderDomainDropdown === 'function') window.renderDomainDropdown();
    } catch(e) { console.error("Domain API Down:", e); }
};
