// js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử cần thiết
    const checkoutCartItemsContainer = document.getElementById('checkout-cart-items');
    const checkoutEmptyMessage = document.getElementById('checkout-empty-message');
    const checkoutTotalPriceElement = document.getElementById('checkout-total-price');
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');

    // Chức năng lấy dữ liệu giỏ hàng từ Local Storage (tái sử dụng từ cart.js)
    function getCart() {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    // Chức năng tính tổng tiền (tái sử dụng từ cart.js)
    function calculateTotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Chức năng hiển thị các mục trong giỏ hàng trên trang thanh toán
    function renderCheckoutCart() {
        const cart = getCart();
        checkoutCartItemsContainer.innerHTML = ''; // Xóa các mục cũ
        let total = 0;

        if (cart.length === 0) {
            checkoutEmptyMessage.style.display = 'block';
            placeOrderBtn.disabled = true; // Vô hiệu hóa nút đặt hàng nếu giỏ rỗng
        } else {
            checkoutEmptyMessage.style.display = 'none';
            placeOrderBtn.disabled = false;
            cart.forEach(item => {
                total += item.price * item.quantity;
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item'); // Sử dụng lại class từ cart.css
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Số lượng: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                `;
                checkoutCartItemsContainer.appendChild(cartItemElement);
            });
        }
        checkoutTotalPriceElement.textContent = `$${total.toFixed(2)}`;
    }

    // Gắn sự kiện cho form khi người dùng nhấn "Xác nhận đơn hàng"
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Ngăn chặn form gửi đi mặc định

            const cart = getCart();
            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống. Vui lòng thêm khóa học trước khi thanh toán.');
                return;
            }

            // Lấy thông tin từ form
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            const orderDetails = {
                customer: { fullName, email, phone, address },
                items: cart,
                total: calculateTotal(cart),
                paymentMethod: paymentMethod,
                orderDate: new Date().toLocaleString()
            };

            // Đây là nơi bạn có thể gửi orderDetails đến backend nếu có
            // Hiện tại, chúng ta chỉ hiển thị thông báo
            console.log("Order Details:", orderDetails); // Ghi log chi tiết đơn hàng vào console
            alert(
                `Đơn hàng của bạn đã được xác nhận!\n\n` +
                `Khách hàng: ${fullName}\n` +
                `Email: ${email}\n` +
                `Tổng tiền: $${orderDetails.total.toFixed(2)}\n` +
                `Phương thức thanh toán: ${paymentMethod === 'cod' ? 'Thanh toán khi nhận khóa học' : 'Chuyển khoản ngân hàng'}\n\n` +
                `Cảm ơn bạn đã mua sắm tại Edrio!`
            );

            // Xóa giỏ hàng sau khi đặt hàng thành công
            localStorage.removeItem('shoppingCart');

            // Cập nhật số lượng trên icon giỏ hàng ở header (nếu vẫn ở trang này)
            // Hoặc đơn giản là chuyển hướng về trang chủ
            window.location.href = 'index.html'; // Chuyển hướng về trang chủ
        });
    }

    // Khởi tạo hiển thị giỏ hàng khi trang thanh toán được tải
    renderCheckoutCart();
});