// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDaAcEICKkV77fbFDxpE6qQG40PmukTfXQ",
    authDomain: "diary-llm-delin.firebaseapp.com",
    projectId: "diary-llm-delin",
    storageBucket: "diary-llm-delin.firebasestorage.app",
    messagingSenderId: "878916064976",
    appId: "1:878916064976:web:f74d829e8cd7490179b0d5",
    measurementId: "G-N5Y38Y31JN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Toggle between login and signup forms
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    // Listen for authentication state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.querySelector('.landing-page').style.display = 'none';
            document.querySelector('.main-page').style.display = 'flex';
            document.getElementById('user-email').textContent = user.email;
        } else {
            document.querySelector('.main-page').style.display = 'none';
            document.querySelector('.landing-page').style.display = 'flex';
            document.getElementById('signup-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        }
    });

    // Login Form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            document.getElementById('login-form').reset();
        } catch (error) {
            alert(`Login error: ${error.message}`);
        }
    });

    // Signup Form
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            await auth.createUserWithEmailAndPassword(email, password);
            document.getElementById('signup-form').reset();
        } catch (error) {
            alert(`Sign up error: ${error.message}`);
        }
    });

    // Logout Button
    document.getElementById('logout-btn').addEventListener('click', () => {
        auth.signOut();
    });

    // Diary Form Submission
    document.getElementById('diary-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            alert('Please login first');
            return;
        }

        const formData = {
            userId: user.uid,
            logDate: document.getElementById('log-date').value,
            themeEntry: document.getElementById('theme-entry').value,
            studyTime: document.getElementById('study-time').value,
            diaryEntry: document.getElementById('diary-entry').value
        };

        try {
            console.log("Form Data Sent:", JSON.stringify(formData)); 
            const response = await fetch('https://sbci9hda6b.execute-api.us-east-2.amazonaws.com/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Diary logged, keep it going!');
                document.getElementById('diary-form').reset();
            } else {
                console.error('API response error:', response);
                alert('Failed to log diary entry.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error to Submit Form.');
        }
    });

    // Toggle between Past Entries and LLM Analysis
    document.getElementById('past-entries-tab').addEventListener('click', function() {
        document.getElementById('past-entries').classList.add('active');
        document.getElementById('llm-analysis').classList.remove('active');
    });

    document.getElementById('llm-analysis-tab').addEventListener('click', function() {
        document.getElementById('llm-analysis').classList.add('active');
        document.getElementById('past-entries').classList.remove('active');
    });
});
