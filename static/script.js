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
                entriesContainer.innerHTML = '<h3>Your Past Entries</h3>'; // Clear previous content

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

    document.getElementById('llm-analysis-tab').addEventListener('click', async function() {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login first');
            return;
        }
    
        const insightsContainer = document.getElementById('llm-analysis');
    
        // Show "Study Log Feedback" heading with a loading message
        insightsContainer.innerHTML = `
            <h3>Study Log Feedback</h3>
            <p>Loading Insights... Please wait :)</p>
        `;
    
        try {
            const response = await fetch(`https://sbci9hda6b.execute-api.us-east-2.amazonaws.com/llm_call?userId=${user.uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
    
            if (response.ok) {
                try {
                    const data = await response.json();
    
                    console.log('Parsed data:', data);
    
                    let sections = [];
    
                    if (data.field_of_study) {
                        sections.push(`
                            <h3>Field of Study:</h3>
                            <p>${data.field_of_study}</p>
                        `);
                    }
    
                    if (data.progress_summary) {
                        sections.push(`
                            <h3>Progress Summary:</h3>
                            <p><strong>Total Hours Studied:</strong> ${data.progress_summary.total_hours_studied}</p>
                            <p><strong>Total Sessions:</strong> ${data.progress_summary.total_sessions}</p>
                            <p>${data.progress_summary.summary}</p>
                        `);
                    }
    
                    if (data.review_suggestions) {
                        let reviewHtml = `<h3>Review Suggestions:</h3>`;
    
                        if (data.review_suggestions.key_concepts) {
                            reviewHtml += `<h4>Key Concepts:</h4>`;
                            reviewHtml += `<p>${data.review_suggestions.key_concepts}</p>`;
                        }
    
                        if (data.review_suggestions.questions) {
                            reviewHtml += `<h4>Questions to Review:</h4>`;
                            reviewHtml += `<p>${data.review_suggestions.questions}</p>`;
                        }
    
                        sections.push(reviewHtml);
                    }
    
                    if (data.next_study_topic_suggestion) {
                        sections.push(`
                            <h3>Next Study Topic Suggestion:</h3>
                            <p>${data.next_study_topic_suggestion}</p>
                        `);
                    }
    
                    // Keep the heading and update the content
                    insightsContainer.innerHTML = `
                        <h3>Study Log Feedback</h3>
                        ${sections.length > 0 ? sections.join('') : '<p>No insights available.</p>'}
                    `;
    
                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError);
                    console.error('Response text:', await response.text());
                    insightsContainer.innerHTML = `
                        <h3>Study Log Feedback</h3>
                        <p>Error parsing AI-generated insights. Please try again.</p>
                    `;
                }
    
            } else {
                console.error('Error fetching AI-generated insights:', response);
                insightsContainer.innerHTML = `
                    <h3>Study Log Feedback</h3>
                    <p>Failed to retrieve AI-generated insights. Please try again.</p>
                `;
            }
        } catch (error) {
            console.error('Error fetching AI-generated insights:', error);
            insightsContainer.innerHTML = `
                <h3>Study Log Feedback</h3>
                <p>Error fetching AI-generated insights. Please check the console for details.</p>
            `;
        }
    });
    
    

});
