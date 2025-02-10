// Firebase Configuration
const firebaseConfig = {
    apiKey: "API-KET",
    authDomain: "DOMAIN",
    projectId: "diary-llm-delin",
    storageBucket: "BUCKET",
    messagingSenderId: "ID",
    appId: "ID",
    measurementId: "ID"
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

    // Fetch and display past entries when the "View Past Entries" button is clicked
    document.getElementById('past-entries-tab').addEventListener('click', async function() {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login first');
            return;
        }

        try {
            const response = await fetch(`https://sbci9hda6b.execute-api.us-east-2.amazonaws.com/get_entries?userId=${user.uid}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            if (response.ok) {
                const data = await response.json();
                const entriesContainer = document.getElementById('past-entries');
                entriesContainer.innerHTML = '<h2>Your Past Entries</h2>'; // Clear previous content

                if ((data.length > 0)) {
                    data.forEach(entry => {
                        const entryDiv = document.createElement('div');
                        entryDiv.classList.add('entry');
                        entryDiv.innerHTML = `
                            <p><strong>Date:</strong> ${entry.logDate}</p>
                            <p><strong>Theme:</strong> ${entry.themeEntry}</p>
                            <p><strong>Time Spent:</strong> ${entry.studyTime} hours</p>
                            <p><strong>Diary Entry:</strong> ${entry.diaryEntry}</p>
                        `;
                        entriesContainer.appendChild(entryDiv);
                    });
                    
                } else {
                    entriesContainer.innerHTML += '<p>No past entries found.</p>';
                }
            } else {
                console.error('Error fetching past entries:', response);
                alert('Failed to retrieve past entries.');
            }
        } catch (error) {
            console.error('Error fetching past entries:', error);
            alert('Error fetching past entries.');
        }
    });
});
