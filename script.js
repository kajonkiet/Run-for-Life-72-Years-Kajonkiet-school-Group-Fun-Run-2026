// ==================== Form Handling ==================== 

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('donationForm');
    const fileInput = document.getElementById('evidence');

    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // File upload validation
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }

    // Smooth scroll for anchor links
    setupSmoothScroll();
});

// ==================== Form Submission Handler ==================== 
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(this);
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }

    // Show success message
    showSuccessMessage();

    // Log form data (in real application, send to server)
    console.log('Form Data:');
    console.log('ชื่อ:', formData.get('firstName'));
    console.log('นามสกุล:', formData.get('lastName'));
    console.log('เบอร์โทร:', formData.get('phone'));
    console.log('อีเมล:', formData.get('email'));
    console.log('จำนวนเงิน:', formData.get('donationAmount'));
    console.log('ข้อความ:', formData.get('message'));

    // Reset form after 2 seconds
    setTimeout(() => {
        this.reset();
        removeSuccessMessage();
    }, 2000);
}

// ==================== Form Validation ==================== 
function validateForm(formData) {
    let isValid = true;
    const firstName = formData.get('firstName').trim();
    const lastName = formData.get('lastName').trim();
    const phone = formData.get('phone').trim();
    const terms = document.getElementById('terms').checked;

    // Clear previous errors
    clearErrors();

    // Validate First Name
    if (!firstName) {
        showError('firstName', 'กรุณากรอกชื่อ');
        isValid = false;
    } else if (firstName.length < 2) {
        showError('firstName', 'ชื่อต้องมีอักษรอย่างน้อย 2 ตัว');
        isValid = false;
    }

    // Validate Last Name
    if (!lastName) {
        showError('lastName', 'กรุณากรอกนามสกุล');
        isValid = false;
    } else if (lastName.length < 2) {
        showError('lastName', 'นามสกุลต้องมีอักษรอย่างน้อย 2 ตัว');
        isValid = false;
    }

    // Validate Phone
    if (!phone) {
        showError('phone', 'กรุณากรอกเบอร์โทรศัพท์');
        isValid = false;
    } else if (!/^[0-9]{9,10}$/.test(phone)) {
        showError('phone', 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก');
        isValid = false;
    }

    // Validate File Upload
    const fileInput = document.getElementById('evidence');
    if (!fileInput.files || fileInput.files.length === 0) {
        showError('evidence', 'กรุณาแนบหลักฐานการบริจาค');
        isValid = false;
    } else {
        const file = fileInput.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            showError('evidence', 'ประเภทไฟล์ไม่ถูกต้อง (JPG, PNG หรือ PDF เท่านั้น)');
            isValid = false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            showError('evidence', 'ขนาดไฟล์เกินกว่า 5MB');
            isValid = false;
        }
    }

    // Validate Terms
    if (!terms) {
        showError('terms', 'กรุณายอมรับเงื่อนไข');
        isValid = false;
    }

    return isValid;
}

// ==================== Error Handling ==================== 
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');

    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorMsg = document.createElement('span');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    formGroup.appendChild(errorMsg);
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
}

// ==================== Success Message ==================== 
function showSuccessMessage() {
    const form = document.getElementById('donationForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
        ">
            <span style="font-size: 24px;">✅</span>
            <div>
                <strong>ขอบคุณที่ส่งแบบฟอร์ม!</strong>
                <p style="font-size: 14px; margin: 5px 0 0 0;">เราได้รับข้อมูลของท่านแล้ว</p>
            </div>
        </div>
    `;
    form.parentNode.insertBefore(successDiv, form);
}

function removeSuccessMessage() {
    const notification = document.querySelector('.success-notification');
    if (notification) {
        notification.remove();
    }
}

// ==================== File Upload Handler ==================== 
function handleFileUpload(event) {
    const file = event.target.files[0];
    const formGroup = event.target.closest('.form-group');

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showError('evidence', 'ประเภทไฟล์ไม่ถูกต้อง (JPG, PNG หรือ PDF เท่านั้น)');
        return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
        showError('evidence', 'ขนาดไฟล์เกินกว่า 5MB');
        return;
    }

    // Clear errors and show file name
    formGroup.classList.remove('error');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }

    // Display file info
    const uploadLabel = formGroup.querySelector('.file-upload-label');
    uploadLabel.innerHTML = `
        <span style="font-size: 20px; color: #4caf50; margin-bottom: 5px;">✓</span>
        <span style="color: #4caf50; font-weight: 500;">ไฟล์: ${file.name}</span>
        <span style="color: #999; font-size: 13px; margin-top: 5px;">ขนาด: ${(file.size / 1024).toFixed(2)} KB</span>
    `;
}

// ==================== Phone Number Formatting ==================== 
function formatPhoneNumber(event) {
    let phone = event.target.value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (phone.length > 10) {
        phone = phone.slice(0, 10);
    }

    event.target.value = phone;
}

// ==================== Smooth Scroll ==================== 
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== Donation Amount Formatting ==================== 
const donationAmountInput = document.getElementById('donationAmount');
if (donationAmountInput) {
    donationAmountInput.addEventListener('input', function(event) {
        let value = event.target.value;
        
        // Remove non-numeric characters
        value = value.replace(/\D/g, '');
        
        // Add thousand separators
        if (value) {
            value = parseInt(value).toLocaleString('th-TH');
        }
        
        event.target.value = value;
    });
}

// ==================== Add Animation Styles ==================== 
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ==================== Utility Functions ==================== 

// Format date to Thai format
function formatDateThai(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    return new Date(date).toLocaleDateString('th-TH', options);
}

// Get current year
function getCurrentYear() {
    return new Date().getFullYear();
}

// Log page load
console.log('Run for Life - Donation Website Loaded');
console.log('Year:', getCurrentYear());
