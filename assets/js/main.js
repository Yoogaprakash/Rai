document.addEventListener('DOMContentLoaded', () => {
    // Active Menu Item Highlight
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('.nav-link');
    const menuLength = menuItem.length;
    for (let i = 0; i < menuLength; i++) {
        if (menuItem[i].href === currentLocation) {
            menuItem[i].classList.add("active");
            menuItem[i].style.color = "var(--accent-color)";
        }
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = document.getElementById('submitBtn');
            const originalText = btn.innerHTML;

            // Loading State
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            btn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value; // Get Phone Number
            const message = document.getElementById('message').value;
            const subject = document.getElementById('subject').value || 'Inquiry from Website';

            // Validation Logic
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10}$/; // Simple 10-digit validation

            if (!emailRegex.test(email)) {
                showCustomAlert("Invalid Email", "Please enter a valid email address.", true);
                btn.innerHTML = originalText;
                btn.disabled = false;
                return;
            }

            if (phone && !phoneRegex.test(phone.replace(/\D/g, ''))) { // Optional: strip non-digits for check
                showCustomAlert("Invalid Phone", "Please enter a valid 10-digit phone number.", true);
                btn.innerHTML = originalText;
                btn.disabled = false;
                return;
            }


            // Send via FormSubmit.co (Free service for static sites)
            fetch("https://formsubmit.co/ajax/kyp.nkl@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Phone: phone,
                    _subject: subject, // Helper for email subject line
                    Subject: subject,  // Field to show in email body
                    Message: message
                })
            })
                .then(response => response.json())
                .then(data => {
                    showCustomAlert("Success!", `Thank you, ${name}! Your message has been sent successfully.`);
                    contactForm.reset();
                })
                .catch(error => {
                    console.log(error);
                    showCustomAlert("Error", "Something went wrong. Please try again.", true);
                })
                .finally(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
        });
    }
});

// Custom Alert Function
function showCustomAlert(title, message, isError = false) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';

    // Icon selection
    const iconClass = isError ? 'fa-exclamation-circle text-danger' : 'fa-check-circle text-success';

    // Create alert box
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert-box';
    alertBox.innerHTML = `
        <i class="fas ${iconClass} custom-alert-icon"></i>
        <div class="custom-alert-title">${title}</div>
        <div class="custom-alert-message">${message}</div>
        <button class="custom-alert-btn" onclick="this.closest('.custom-alert-overlay').remove()">OK</button>
    `;

    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
