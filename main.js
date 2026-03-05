let cart = [];
const BASE_URL = 'https://panto-admin-2.onrender.com';

// 1. Кошик: Відкриття/Закриття
$('#cartBtn').on('click', function(e) {
    e.stopPropagation();
    $('#cartSidebar').toggleClass('active');
});

$(document).on('click', function(e) {
    const isCart = $(e.target).closest('#cartSidebar').length;
    const isCartBtn = $(e.target).closest('#cartBtn').length;
    const isAddBtn = $(e.target).closest('.add-item').length;

    if (!isCart && !isCartBtn && !isAddBtn) {
        $('#cartSidebar').removeClass('active');
    }
});

// 2. Додавання в кошик (через ID товару)
$('.wrap').on('click', '.add-item', function(e) {
    const productId = $(this).attr('id');
    // Використовуємо ендпоінт для отримання одного товару
    axios.get(`${BASE_URL}/product/${productId}`)
    .then(res => {
        cart.push(res.data);
        updateCartUI();
        showToast();
    })
    .catch(err => console.error("Помилка додавання:", err));
});

// 3. Оновлення інтерфейсу кошика
function updateCartUI() {
    $('.cart-count').text(cart.length);
    $('.cart-container').empty();
    $('.empty-msg').toggle(cart.length === 0);

    const grouped = cart.reduce((acc, el) => {
        acc[el._id] = acc[el._id] || { ...el, qty: 0 };
        acc[el._id].qty++;
        return acc;
    }, {});

    Object.values(grouped).forEach(el => {
        $('.cart-container').append(`
            <div class="cart-item-card">
                <div class="cart-item-info">
                    <strong>${el.name}</strong>
                    <span>$${el.price * el.qty} <small>(x${el.qty})</small></span>
                </div>
                <button class="cart-remove-btn" onclick="removeFromCart('${el._id}', event)">✕</button>
            </div>`);
    });
}

// 4. Видалення з кошика
window.removeFromCart = function(id, event) {
    if (event) event.stopPropagation();
    const index = cart.findIndex(p => p._id === id);
    if (index > -1) cart.splice(index, 1);
    updateCartUI();
};

// 5. Повідомлення (Toast)
function showToast() {
    if (!$('#toast').length) {
        $('body').append('<div id="toast" style="position:fixed; bottom:20px; right:20px; background:#e58411; color:white; padding:10px 20px; border-radius:5px; display:none; z-index:1000;">Товар додано в кошик! 🛒</div>');
    }
    $('#toast').stop(true, true).fadeIn(300).delay(1500).fadeOut(300);
}

// 6. Оформлення замовлення
$('#orderForm').on('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) return alert("Кошик порожній!");

    const orderData = {
        totalPrice: cart.reduce((acc, el) => acc + el.price, 0),
        customerName: $(this).find('input[type="text"]').val(),
        customerEmail: $(this).find('input[type="email"]').val(),
        products: cart
    };

    axios.post(`${BASE_URL}/create-order`, orderData)
    .then(res => {
        $('#cartSidebar').removeClass('active');
        $('#successModal').css('display', 'flex');
        cart = [];
        updateCartUI();
        this.reset();
    })
    .catch(err => alert("Помилка при створенні замовлення"));
});

function closeModal() { $('#successModal').hide(); }

// 7. Завантаження товарів та відгуків
axios.get(`${BASE_URL}/all-products`)
.then(res => {
    // Товари
    res.data.forEach(el => {
        let card = `
        <div class="product-card">
            <div class="img-box"><img src="${el.imageUrl || 'https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png'}" alt="${el.name}"></div>
            <p class="category-label">${el.category}</p>
            <h4>${el.name}</h4>
            <div class="stars">★★★★★</div>
            <div class="card-footer">
                <span class="price"><sup>$</sup>${el.price}</span>
                <button class="add-item" id="${el._id}">+</button>
            </div>
        </div>`;
        $('.products-container').append(card);
    });

    // Відгуки (використовуємо ті ж дані або окремий ендпоінт, якщо є)
    $('.testimonials-container').empty();
    const bgImages = [
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600"
    ];

    res.data.slice(0, 3).forEach((el, index) => {
        let backImg = bgImages[index] || bgImages[0];
        let testimonialCard = `
        <div class="testimonial-card">
            <div class="main-photo"><img src="${backImg}" alt="room"></div>
            <div class="info-card">
                <img src="https://ui-avatars.com/api/?name=${el.name}&background=random" class="avatar">
                <h4 class="client-name">${el.name}</h4>
                <p class="occupation">${el.category}</p>
                <p class="review-text">"Чудова якість, меблі ідеально вписалися в інтер'єр!"</p>
                <div class="stars">★★★★★</div>
            </div>
        </div>`;
        $('.testimonials-container').append(testimonialCard);
    });
});

// 8. Соціальні мережі
axios.get(`${BASE_URL}/social`)
.then(res => {
    const container = $('.social-list');
    const footerContainer = $('#social-links-container');
    
    res.data.forEach(item => {
        const linkHtml = `<a href="${item.link}" target="_blank"><i class="${item.icon}"></i> ${item.platform || ''}</a>`;
        container.append(linkHtml);
        footerContainer.append(linkHtml);
    });
})
.catch(err => console.log("Соцмережі не завантажено"));