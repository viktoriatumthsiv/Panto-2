let cart = [];

// 1.  
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

// 2. 
$('.wrap').on('click', '.add-item', function(e) {
    axios.get('http://localhost:3000/product/' + e.target.id)
    .then(res => {
        cart.push(res.data);
        $('.cart-count').text(cart.length);
        showToast();
        appendCart(cart);
    });
});

// 3 
function appendCart(cart) {
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

// 4. 
window.removeFromCart = function(id, event) {
    if (event) {
        event.stopPropagation();  
    }

    const index = cart.findIndex(p => p._id === id);
    if (index > -1) {
        cart.splice(index, 1);
    }
    
    $('.cart-count').text(cart.length);
    appendCart(cart);
};

// 5.  
function showToast() {
    if (!$('#toast').length) {
        $('body').append('<div id="toast">Товар додано в кошик! 🛒</div>');
    }
    $('#toast').stop(true, true).fadeIn(300).delay(1500).fadeOut(300);
}

// 6. 
$('#orderForm').on('submit', function(e) {
    e.preventDefault();
    axios.post('http://localhost:3000/create-order', {
        totalPrice: cart.reduce((acc, el) => acc + el.price, 0),
        customerName: e.target[1].value,
        products: cart
    })
    .then(res => {
        $('#cartSidebar').removeClass('active');
        $('#successModal').css('display', 'flex');
        cart = [];  
        $('.cart-count').text(0);
        appendCart(cart);
        this.reset();
    });
});

function closeModal() { $('#successModal').hide(); }

 // 7. 
axios.get('https://panto-admin-2.onrender.com/all-products')
.then(res => {
    for(let el of res.data){
        let card = `
        <div class="product-card">
            <div class="img-box"><img src="https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png" alt=" "></div>
            <p class="category-label">${el.category}</p>
            <h4>${el.name}</h4>
            <div class="stars">★★★★★</div>
            <div class="card-footer">
                <span class="price"><sup>$</sup>${el.price}</span>
                <button class="add-item" id="${el._id}">+</button>
            </div>
        </div>`;
        $('.products-container').append(card);
    }


 
$('.testimonials-container').empty();
    
 
const customAvatars = [
     
];

const bgImages = [
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600"
];

res.data.slice(0, 3).forEach((el, index) => {
 
    let userAvatar = (el.avatar && el.avatar !== "") ? el.avatar : customAvatars[index];
    
    
    let backImg = (el.imageUrl && el.imageUrl !== "") ? el.imageUrl : bgImages[index];

    let testimonialCard = `
    <div class="testimonial-card">
        <div class="main-photo">
            <img src="${backImg}" alt="room">
        </div>
        <div class="info-card">
            <img src="${userAvatar}" class="avatar">
            <h4 class="client-name">${el.name}</h4>
            <p class="occupation">${el.category}</p>
            <p class="review-text">"Terimakasih banyak, kini ruanganku menjadi lebih mewah!"</p>
            <div class="stars">★★★★★</div>
        </div>
    </div>`;
    
    $('.testimonials-container').append(testimonialCard);
});
});


axios.get('http://localhost:3000/social')

.then(res => {
    for(let el of res.data){
        let socialLink = `
        <a href="${el.link}" target="_blank"><i class="${el.icon}"></i></a>
        `;
        $('.social-list').append(socialLink);
    }


});

axios.get('https://panto-admin-2.onrender.com/social')
.then(res=>{
      const container = $('#social-links-container');
    
    (res.data).forEach(res => {
        const linkHtml = `<a href="${res.link}" target="_blank">
                            <i class="${res.icon}"></i> ${res.platform}
                          </a>`;
        container.append(linkHtml);
    });
})


const socialMedia = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', link: 'https://www.facebook.com/?locale=uk_UA' },
    { name: 'Twitter', icon: 'fab fa-twitter', link: 'https://twitter.com' },
    { name: 'Instagram', icon: 'fab fa-instagram', link: 'https://instagram.com' },
    { name: 'YouTube', icon: 'fab fa-youtube', link: 'https://youtube.com' } 
];

// function renderSocialLinks() {
//     const container = $('#social-links-container');
    
//     socialMedia.forEach(social => {
//         const linkHtml = `<a href="${social.link}" target="_blank">
//                             <i class="${social.icon}"></i> ${social.name}
//                           </a>`;
//         container.append(linkHtml);
//     });
// }

// renderSocialLinks();

// // 7. Завантаження товарів
// axios.get('http://localhost:3000/all-products')
// .then(res => {
//     for(let el of res.data){
//         let card = `
//         <div class="product-card">
//             <div class="img-box"><img src="https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png" alt=" "></div>
//             <p class="category-label">${el.category}</p>
//             <h4>${el.name}</h4>
//             <div class="stars">★★★★★</div>
//             <div class="card-footer">
//                 <span class="price"><sup>$</sup>${el.price}</span>
//                 <button class="add-item" id="${el._id}">+</button>
//             </div>
//         </div>`;
//         $('.products-container').append(card);
//     }
// });