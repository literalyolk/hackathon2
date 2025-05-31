// Global storage for user data
let globalUserData = {
    age: null,
    gender: null,
    height: null,
    weight: null
};

class Questionnaire {
    constructor() {
        this.userData = { ...globalUserData }; // Create a new copy of the data
        this.currentStep = 0;
        this.questions = [
            {
                question: "What is your age group?",
                options: ["Under 18", "19-60", "60-90"],
                type: "age"
            },
            {
                question: "What is your gender?",
                options: ["Male", "Female", "Other"],
                type: "gender"
            },
            {
                question: "What is your height (in cm)?",
                type: "height",
                inputType: "number",
                min: "100",
                max: "250"
            },
            {
                question: "What is your weight (in kg)?",
                type: "weight",
                inputType: "number",
                min: "30",
                max: "300"
            }
        ];
    }

    showQuestion() {
        const question = this.questions[this.currentStep];
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        let optionsHTML = '';
        if (question.options) {
            optionsHTML = question.options.map(option => 
                `<button class="option-btn" data-value="${option}">${option}</button>`
            ).join('');
        } else {
            optionsHTML = `
                <input type="${question.inputType}" 
                       class="question-input" 
                       placeholder="Enter your ${question.type}"
                       min="${question.min}"
                       max="${question.max}"
                       required>
                <button class="submit-btn">Next</button>
            `;
        }

        modal.innerHTML = `
            <div class="modal-content">
                <h2>${question.question}</h2>
                <div class="options-container">
                    ${optionsHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        if (question.options) {
            modal.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.userData[question.type] = btn.dataset.value;
                    this.nextQuestion();
                });
            });
        } else {
            const input = modal.querySelector('.question-input');
            const submitBtn = modal.querySelector('.submit-btn');
            
            submitBtn.addEventListener('click', () => {
                const value = parseFloat(input.value);
                if (value && value >= parseFloat(question.min) && value <= parseFloat(question.max)) {
                    this.userData[question.type] = value;
                    this.nextQuestion();
                } else {
                    alert(`Please enter a valid ${question.type} between ${question.min} and ${question.max}`);
                }
            });

            // Allow Enter key to submit
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            });
        }
    }

    nextQuestion() {
        const currentModal = document.querySelector('.modal');
        if (currentModal) {
            currentModal.remove();
        }

        this.currentStep++;
        if (this.currentStep < this.questions.length) {
            this.showQuestion();
        } else {
            // Update global data when questionnaire is complete
            Object.assign(globalUserData, this.userData);
            this.showDashboard();
            this.addDashboardButton();
        }
    }

    showDashboard() {
        // Remove any existing dashboard
        const existingDashboard = document.querySelector('.modal');
        if (existingDashboard) {
            existingDashboard.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        const bmi = this.calculateBMI();
        const bmiCategory = this.getBMICategory(bmi);

        modal.innerHTML = `
            <div class="modal-content dashboard">
                <h2>Your Fitness Profile</h2>
                <div class="dashboard-content">
                    <div class="profile-section">
                        <h3>Personal Information</h3>
                        <p><strong>Age Group:</strong> ${this.userData.age || 'Not set'}</p>
                        <p><strong>Gender:</strong> ${this.userData.gender || 'Not set'}</p>
                        <p><strong>Height:</strong> ${this.userData.height ? this.userData.height + ' cm' : 'Not set'}</p>
                        <p><strong>Weight:</strong> ${this.userData.weight ? this.userData.weight + ' kg' : 'Not set'}</p>
                    </div>
                    <div class="bmi-section">
                        <h3>BMI Analysis</h3>
                        ${this.userData.height && this.userData.weight ? `
                            <p><strong>BMI:</strong> ${bmi.toFixed(1)}</p>
                            <p><strong>Category:</strong> ${bmiCategory}</p>
                        ` : '<p>Complete your profile to see BMI analysis</p>'}
                    </div>
                </div>
                <button class="close-dashboard">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-dashboard').addEventListener('click', () => {
            modal.remove();
        });
    }

    addDashboardButton() {
        // Remove any existing dashboard button
        const existingButton = document.getElementById('dashboardBtn');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.id = 'dashboardBtn';
        button.className = 'btn dashboard-btn';
        button.textContent = 'View Dashboard';
        button.addEventListener('click', () => {
            // Create a new instance to show the dashboard with current data
            const dashboard = new Questionnaire();
            dashboard.userData = { ...globalUserData };
            dashboard.showDashboard();
        });

        // Add button to the header
        const authButtons = document.querySelector('.auth-buttons');
        authButtons.insertBefore(button, authButtons.firstChild);
    }

    calculateBMI() {
        if (!this.userData.height || !this.userData.weight) return 0;
        const heightInMeters = this.userData.height / 100;
        return this.userData.weight / (heightInMeters * heightInMeters);
    }

    getBMICategory(bmi) {
        if (bmi === 0) return "Not available";
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal weight";
        if (bmi < 30) return "Overweight";
        return "Obese";
    }
}

// Initialize questionnaire when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const questionnaire = new Questionnaire();
    questionnaire.showQuestion();
}); 