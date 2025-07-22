// js/cart.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy các phần tử cần thiết từ DOM
    const cartCountElement = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    // 2. Chức năng lưu và lấy dữ liệu giỏ hàng từ Local Storage
    function getCart() {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartDisplay(); // Cập nhật hiển thị giỏ hàng sau mỗi lần lưu
    }

    // 3. Chức năng thêm sản phẩm vào giỏ hàng
    function addToCart(courseId, courseName, coursePrice) {
        let cart = getCart();
        const existingItem = cart.find(item => item.id === courseId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: courseId,
                name: courseName,
                price: parseFloat(coursePrice),
                quantity: 1
            });
        }
        saveCart(cart);
        alert(`${courseName} đã được thêm vào giỏ hàng!`); // Thông báo cho người dùng
    }

    // 4. Chức năng xóa sản phẩm khỏi giỏ hàng
    function removeFromCart(courseId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== courseId);
        saveCart(cart);
    }

    // 5. Chức năng cập nhật số lượng sản phẩm
    function updateQuantity(courseId, newQuantity) {
        let cart = getCart();
        const item = cart.find(item => item.id === courseId);
        if (item) {
            item.quantity = parseInt(newQuantity);
            if (item.quantity <= 0) {
                removeFromCart(courseId); // Xóa nếu số lượng là 0 hoặc âm
            } else {
                saveCart(cart);
            }
        }
    }

    // 6. Chức năng tính tổng tiền
    function calculateTotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // 7. Chức năng hiển thị giỏ hàng (render UI)
    function renderCart() {
        let cart = getCart();
        cartItemsContainer.innerHTML = ''; // Xóa các mục cũ
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
            clearCartBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;
            clearCartBtn.disabled = false;
            cart.forEach(item => {
                total += item.price * item.quantity;
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Giá: ${item.price.toFixed(0)}VNĐ</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" min="1" value="${item.quantity}" class="item-quantity" data-item-id="${item.id}">
                        <button class="btn btn-danger btn-sm remove-item-btn" data-item-id="${item.id}">Xóa</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        cartTotalPriceElement.textContent = `${total.toFixed(0)}VNĐ`;
    }

    // 8. Chức năng cập nhật số lượng trên biểu tượng giỏ hàng ở header
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
        if (cartCountElement) { // Đảm bảo phần tử tồn tại trước khi truy cập
            cartCountElement.textContent = totalItems;
        }
    }

    // 9. Gắn sự kiện cho các nút "Thêm vào giỏ hàng"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const courseId = event.target.dataset.courseId;
            const courseName = event.target.dataset.courseName;
            const coursePrice = event.target.dataset.coursePrice;
            addToCart(courseId, courseName, coursePrice);
        });
    });

    // 10. Gắn sự kiện cho các nút "Xóa" và input "Số lượng" (trên trang cart.html)
    // Sử dụng event delegation vì các mục giỏ hàng được tạo động
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item-btn')) {
                const itemId = event.target.dataset.itemId;
                removeFromCart(itemId);
            }
        });

        cartItemsContainer.addEventListener('change', (event) => {
            if (event.target.classList.contains('item-quantity')) {
                const itemId = event.target.dataset.itemId;
                const newQuantity = event.target.value;
                updateQuantity(itemId, newQuantity);
            }
        });
    }

    // 11. Gắn sự kiện cho nút "Xóa giỏ hàng"
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            localStorage.removeItem('shoppingCart');
            updateCartDisplay();
            alert('Giỏ hàng đã được xóa!');
        });
    }

    // 12. Gắn sự kiện cho nút "Tiến hành thanh toán"
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Kiểm tra xem giỏ hàng có rỗng không trước khi chuyển hướng
            const cart = getCart();
            if (cart.length > 0) {
                window.location.href = 'checkout.html'; // Chuyển hướng đến trang thanh toán
            } else {
                alert('Giỏ hàng của bạn đang trống. Vui lòng thêm khóa học trước khi thanh toán.');
            }
        });
    }


    // 13. Khởi tạo: Cập nhật hiển thị giỏ hàng khi tải trang
    function updateCartDisplay() {
        if (window.location.pathname.includes('cart.html')) {
            renderCart(); // Chỉ render chi tiết giỏ hàng nếu đang ở trang cart.html
        }
        updateCartCount(); // Luôn cập nhật số lượng trên icon giỏ hàng
    }

    updateCartDisplay(); // Gọi khi DOM được tải

});