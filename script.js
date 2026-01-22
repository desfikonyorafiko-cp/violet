// ========== WHATSAPP CONFIGURATION ========== 
// ⚠️ PENTING! GANTI NOMOR INI DENGAN NOMOR WHATSAPP ANDA
// Format: 62xxx (tanpa tanda + dan tanpa angka 0 di depan)
// 
// Contoh konversi:
// 0812-3456-7890  →  6281234567890
// 0821-9876-5432  →  6282198765432
// 
// Nomor ini akan digunakan untuk:
// 1. Form pemesanan laundry
// 2. Tombol WhatsApp di section Contact
// 3. Floating WhatsApp button
// 4. Link sosial media
//
const WHATSAPP_NUMBER = '6281234567890'; // ← GANTI NOMOR INI!

// ========== GOOGLE MAPS CONFIGURATION ========== 
// Untuk mengganti lokasi Google Maps:
// 1. Buka Google Maps (https://maps.google.com)
// 2. Cari lokasi toko laundry Anda
// 3. Klik tombol "Share" atau "Bagikan"
// 4. Pilih "Embed a map" atau "Sematkan peta"
// 5. Copy link yang ada di dalam tag <iframe src="...">
// 6. Ganti di file HTML pada bagian contact-map
//
// Contoh: Lokasi saat ini adalah Pekanbaru, Riau
// Ganti dengan lokasi toko Anda yang sebenarnya

// ========== NAVIGATION ========== 
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== COUNTER ANIMATION ========== 
const counters = document.querySelectorAll('.stat-number');
const speed = 200; // Animation speed

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    const increment = target / speed;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounter(counter), 1);
    } else {
        counter.innerText = target;
    }
};

// Intersection Observer for counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ========== SMOOTH SCROLL ========== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== ORDER FORM ========== 
const orderForm = document.getElementById('orderForm');
const serviceSelect = document.getElementById('serviceType');
const weightInput = document.getElementById('estimateWeight');
const selectedServiceEl = document.getElementById('selectedService');
const selectedWeightEl = document.getElementById('selectedWeight');
const totalPriceEl = document.getElementById('totalPrice');

// Set minimum date to today
const pickupDateInput = document.getElementById('pickupDate');
const today = new Date().toISOString().split('T')[0];
pickupDateInput.setAttribute('min', today);
pickupDateInput.value = today;

// Calculate price
const calculatePrice = () => {
    const service = serviceSelect.options[serviceSelect.selectedIndex];
    const weight = parseFloat(weightInput.value) || 0;
    
    if (service.value && weight > 0) {
        const price = parseInt(service.getAttribute('data-price')) || 0;
        const total = price * weight;
        
        selectedServiceEl.textContent = service.text;
        selectedWeightEl.textContent = `${weight} kg`;
        totalPriceEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    } else {
        selectedServiceEl.textContent = '-';
        selectedWeightEl.textContent = '-';
        totalPriceEl.textContent = 'Rp 0';
    }
};

serviceSelect.addEventListener('change', calculatePrice);
weightInput.addEventListener('input', calculatePrice);

// Handle form submission
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const weight = weightInput.value;
    const pickupDate = pickupDateInput.value;
    const notes = document.getElementById('orderNotes').value;
    const total = totalPriceEl.textContent;
    
    // Validation
    if (!name || !phone || !address || !serviceSelect.value || !weight) {
        showNotification('Mohon lengkapi semua field yang wajib diisi!', 'error');
        return;
    }

    // Format pickup date
    const dateObj = new Date(pickupDate);
    const formattedDate = dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create WhatsApp message
    let message = `*PESANAN LAUNDRY BARU*\n\n`;
    message += `*Nama:* ${name}\n`;
    message += `*No. WhatsApp:* ${phone}\n`;
    message += `*Alamat:* ${address}\n\n`;
    message += `*Detail Pesanan:*\n`;
    message += `- Layanan: ${service}\n`;
    message += `- Estimasi Berat: ${weight} kg\n`;
    message += `- Tanggal Pickup: ${formattedDate}\n`;
    if (notes) {
        message += `- Catatan: ${notes}\n`;
    }
    message += `\n*${total}*\n\n`;
    message += `Mohon konfirmasi pesanan ini. Terima kasih! 🧺`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp using configured number
    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(waURL, '_blank');
    
    // Show success message
    showNotification('Pesanan berhasil! Anda akan diarahkan ke WhatsApp...', 'success');
    
    // Reset form after 2 seconds
    setTimeout(() => {
        orderForm.reset();
        pickupDateInput.value = today;
        calculatePrice();
    }, 2000);
});

// ========== NOTIFICATION SYSTEM ========== 
const showNotification = (message, type = 'success') => {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: start; gap: 12px;">
            <div style="font-size: 24px;">
                ${type === 'success' ? '✅' : '❌'}
            </div>
            <div>
                <div style="font-weight: 700; margin-bottom: 4px;">
                    ${type === 'success' ? 'Berhasil!' : 'Perhatian!'}
                </div>
                <div style="color: var(--gray); font-size: 14px;">
                    ${message}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ========== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animatedElements = document.querySelectorAll('.about-card, .service-card, .pricing-card, .info-card');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ========== PHONE NUMBER FORMATTING ========== 
const phoneInput = document.getElementById('customerPhone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format: 0812-3456-7890
    if (value.length > 4 && value.length <= 8) {
        value = value.slice(0, 4) + '-' + value.slice(4);
    } else if (value.length > 8) {
        value = value.slice(0, 4) + '-' + value.slice(4, 8) + '-' + value.slice(8, 12);
    }
    
    e.target.value = value;
});

// ========== LAZY LOADING IMAGES ========== 
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ========== PARALLAX EFFECT ========== 
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-shapes');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== FORM VALIDATION ========== 
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[0-9-]{10,15}$/;
    return re.test(phone);
};

// Real-time validation
const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value) {
            input.style.borderColor = 'var(--danger)';
        } else {
            input.style.borderColor = 'var(--gray-light)';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--purple-primary)';
    });
});

// ========== PRICE CALCULATOR HELPER ========== 
const priceCalculatorInfo = {
    'cuci-kering': {
        name: 'Cuci Kering',
        price: 6000,
        unit: 'kg',
        description: 'Pakaian dicuci bersih dan dikeringkan'
    },
    'cuci-setrika': {
        name: 'Cuci Setrika',
        price: 8000,
        unit: 'kg',
        description: 'Pakaian dicuci, dikeringkan, dan disetrika'
    },
    'express': {
        name: 'Express 3 Jam',
        price: 15000,
        unit: 'kg',
        description: 'Layanan kilat selesai 3 jam'
    },
    'dry-clean': {
        name: 'Dry Clean',
        price: 25000,
        unit: 'pcs',
        description: 'Untuk pakaian berbahan khusus'
    },
    'bed-cover': {
        name: 'Bed Cover & Karpet',
        price: 10000,
        unit: 'kg',
        description: 'Sprei, selimut, dan karpet'
    },
    'setrika': {
        name: 'Setrika Saja',
        price: 4000,
        unit: 'kg',
        description: 'Khusus setrika untuk pakaian bersih'
    }
};

// ========== LOCAL STORAGE FOR FORM DATA ========== 
const saveFormData = () => {
    const formData = {
        name: document.getElementById('customerName').value,
        phone: phoneInput.value,
        address: document.getElementById('customerAddress').value,
        service: serviceSelect.value,
        weight: weightInput.value,
        notes: document.getElementById('orderNotes').value
    };
    // Note: localStorage not available in Claude.ai artifacts
    // This is for reference if deployed elsewhere
    // localStorage.setItem('laundryFormData', JSON.stringify(formData));
};

// Auto-save form data on input
const formInputs = orderForm.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('change', saveFormData);
});

// ========== SCROLL TO TOP BUTTON ========== 
const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-1);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-lg);
        z-index: 999;
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(button);
};

// Initialize scroll to top button
createScrollTopButton();

// ========== FLOATING WHATSAPP BUTTON ========== 
const createFloatingWhatsApp = () => {
    const button = document.createElement('a');
    button.href = `https://wa.me/${WHATSAPP_NUMBER}`;
    button.target = '_blank';
    button.innerHTML = '💬';
    button.className = 'floating-wa-btn';
    button.title = 'Chat via WhatsApp';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
        z-index: 998;
        text-decoration: none;
        animation: bounce 2s ease-in-out infinite;
    `;
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 12px 32px rgba(37, 211, 102, 0.6)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
    });
    
    // Add tooltip
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Chat Sekarang!';
    tooltip.style.cssText = `
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        color: #128C7E;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    
    button.appendChild(tooltip);
    
    button.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.right = '75px';
    });
    
    button.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.right = '70px';
    });
    
    document.body.appendChild(button);
};

// Add bounce animation for WhatsApp button
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(bounceStyle);

// Initialize floating WhatsApp button
createFloatingWhatsApp();

// ========== 3D FLOATING OBJECTS ANIMATION ========== 
const create3DFloatingObjects = () => {
    const objects = ['🧺', '👕', '👔', '🧥', '👗', '🧦', '🩳', '👖', '💧', '✨', '🫧', '🌟'];
    const container = document.createElement('div');
    container.className = 'floating-objects-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
        const obj = document.createElement('div');
        const emoji = objects[Math.floor(Math.random() * objects.length)];
        const size = 30 + Math.random() * 40;
        const duration = 15 + Math.random() * 25;
        const delay = Math.random() * 5;
        const startX = Math.random() * 100;
        
        obj.innerHTML = emoji;
        obj.style.cssText = `
            position: absolute;
            font-size: ${size}px;
            left: ${startX}%;
            top: -100px;
            opacity: 0.15;
            animation: float3D ${duration}s ease-in-out ${delay}s infinite;
            filter: blur(0.5px);
            transform-style: preserve-3d;
        `;
        
        container.appendChild(obj);
    }
    
    document.body.appendChild(container);
};

// Add 3D floating animation
const float3DStyle = document.createElement('style');
float3DStyle.textContent = `
    @keyframes float3D {
        0% {
            transform: translate3d(0, -100px, 0) rotate(0deg) scale(0.5);
            opacity: 0;
        }
        10% {
            opacity: 0.15;
        }
        50% {
            transform: translate3d(${Math.random() * 200 - 100}px, 50vh, 50px) rotate(180deg) scale(1);
            opacity: 0.2;
        }
        90% {
            opacity: 0.1;
        }
        100% {
            transform: translate3d(${Math.random() * 200 - 100}px, 100vh, 0) rotate(360deg) scale(0.5);
            opacity: 0;
        }
    }
    
    .floating-objects-container {
        perspective: 1000px;
    }
`;
document.head.appendChild(float3DStyle);

// Initialize 3D floating objects
create3DFloatingObjects();

// ========== ANIMATED BACKGROUND WAVES ========== 
const createBackgroundWaves = () => {
    const wavesContainer = document.createElement('div');
    wavesContainer.className = 'waves-container';
    wavesContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = `wave wave-${i + 1}`;
        wave.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background: linear-gradient(135deg, rgba(139, 92, 246, ${0.05 - i * 0.01}) 0%, rgba(236, 72, 153, ${0.05 - i * 0.01}) 100%);
            border-radius: 1000px 1000px 0 0;
            animation: wave ${10 + i * 3}s ease-in-out infinite;
            animation-delay: ${i * 0.5}s;
        `;
        wavesContainer.appendChild(wave);
    }
    
    document.body.appendChild(wavesContainer);
};

// Add wave animation
const waveStyle = document.createElement('style');
waveStyle.textContent = `
    @keyframes wave {
        0%, 100% {
            transform: translateX(0) translateY(0);
        }
        50% {
            transform: translateX(-25%) translateY(-20px);
        }
    }
`;
document.head.appendChild(waveStyle);

// Initialize background waves
createBackgroundWaves();

// ========== PARALLAX 3D CARDS ON MOUSE MOVE ========== 
const cards = document.querySelectorAll('.service-card, .pricing-card, .about-card');

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const speed = (index % 3 + 1) * 2;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        card.style.transform = `translate(${x}px, ${y}px) perspective(1000px)`;
    });
});

// Reset card position when mouse leaves
document.addEventListener('mouseleave', () => {
    cards.forEach(card => {
        card.style.transform = 'translate(0, 0)';
    });
});

// ========== INTERACTIVE CURSOR EFFECT ========== 
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(139, 92, 246, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    
    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: rgba(139, 92, 246, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.05s ease;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth cursor follow
    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .pricing-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'rgba(236, 72, 153, 0.8)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorDot.style.background = 'rgba(236, 72, 153, 1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'rgba(139, 92, 246, 0.6)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.background = 'rgba(139, 92, 246, 0.8)';
        });
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    interactiveElements.forEach(el => {
        el.style.cursor = 'none';
    });
};

// Initialize custom cursor (only on desktop)
if (window.innerWidth > 768) {
    createCursorEffect();
}

// ========== SPARKLE EFFECT ON CLICK ========== 
document.addEventListener('click', (e) => {
    const sparkles = ['✨', '💫', '⭐', '🌟', '💥'];
    
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: ${15 + Math.random() * 15}px;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleAnimation ${0.5 + Math.random() * 0.5}s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
});

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnimation {
        0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) scale(1) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// ========== SCROLL REVEAL ANIMATIONS ========== 
const scrollRevealElements = document.querySelectorAll('.hero-content, .hero-image, .section-header');

scrollRevealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = `all 0.8s ease ${index * 0.1}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

scrollRevealElements.forEach(el => revealObserver.observe(el));

// ========== TYPING EFFECT FOR HERO TITLE ========== 
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalHTML = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.opacity = '1';
    
    let charIndex = 0;
    const typeSpeed = 50;
    
    const typeWriter = () => {
        if (charIndex < originalHTML.length) {
            heroTitle.innerHTML += originalHTML.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typeSpeed);
        }
    };
    
    setTimeout(typeWriter, 500);
}

// ========== LOADING ANIMATION ========== 
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========== EASTER EGGS & SPECIAL EFFECTS ========== 
let clickCount = 0;
const logo = document.querySelector('.logo');

logo.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showNotification('Terima kasih telah mengeksplorasi website kami! 🎉', 'success');
        clickCount = 0;
        
        // Add confetti effect
        createConfetti();
    }
});

const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${['#8B5CF6', '#EC4899', '#6366F1', '#F0ABFC'][Math.floor(Math.random() * 4)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${2 + Math.random() * 3}s ease-out forwards;
            z-index: 9999;
            border-radius: 50%;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
};

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== CONSOLE MESSAGE ========== 
console.log('%c🧺 PurpleLaundry', 'font-size: 24px; font-weight: bold; color: #8B5CF6;');
console.log('%cSelamat datang di website laundry terbaik!', 'font-size: 14px; color: #64748B;');
console.log('%cDibuat dengan ❤️ menggunakan HTML, CSS, dan JavaScript', 'font-size: 12px; color: #94A3B8;');

// ========== PERFORMANCE OPTIMIZATION ========== 
// Debounce function for performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Scroll-dependent operations here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

console.log('✅ Website loaded successfully!');
