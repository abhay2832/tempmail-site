const API = 'https://api.mail.gw';
let token = localStorage.getItem('mt_token');
let address = localStorage.getItem('mt_email');
let syncTimer = null;
let refreshSec = 5; 
let lastMailCount = 0; 
let soundOn = true;
let isSyncing = true; 
let allMessages = [];
let availableDomains = [];
let activeDomain = "";
let currentEmailType = 'human'; 
let captchaAnswer = 0;
let captchaSuccessCallback = null;
let emailTimerInterval;
let statToday = 819; 
let statInboxes = 382; 
let statGenerated = 296500;

function generatePassword() { return "P@ss" + Math.random().toString(36).slice(-8) + "1x!"; }
let password = localStorage.getItem('mt_password') || generatePassword();

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbdxl0S7iwFn0uXlhXKMj49wB4-csSp7U",
    authDomain: "aryan-mails.firebaseapp.com",
    projectId: "aryan-mails",
    storageBucket: "aryan-mails.firebasestorage.app",
    messagingSenderId: "190362104203",
    appId: "1:190362104203:web:3240a185525825e97b3f8e",
    measurementId: "G-8S38X1F05Y"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
window.authContext = { mode: 'login' };
