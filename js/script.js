document.addEventListener('DOMContentLoaded', function() {
    // --- KHAI BÁO BIẾN CHUNG ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Thêm các biến cho nút đăng ký, đăng nhập, đăng xuất
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // Khởi tạo Swiper Slider cho Hero Section
    if (document.querySelector('.hero-swiper')) {
        new Swiper('.hero-swiper', {
            // Optional parameters
            direction: 'horizontal', // hoặc 'vertical'
            loop: true, // Lặp lại vô hạn slider
            speed: 1000, // Tốc độ chuyển slide (ms)
            autoplay: {
                delay: 5000, // Thời gian giữa các slide (ms)
                disableOnInteraction: false, // Tiếp tục tự động phát sau khi tương tác
            },
            effect: 'fade', // Hiệu ứng chuyển slide: 'slide', 'fade', 'cube', 'coverflow', 'flip'
            fadeEffect: {
                crossFade: true, // Quan trọng cho hiệu ứng fade mượt mà
            },

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true, // Cho phép nhấp vào chấm để chuyển slide
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // Keyboard control (tùy chọn)
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },

            // Mousewheel control (tùy chọn)
            mousewheel: {
                invert: true,
            },
        });
    }

    // --- HÀM HỖ TRỢ ĐỂ CẬP NHẬT TRẠNG THÁI NÚT ĐĂNG NHẬP/ĐĂNG KÝ/ĐĂNG XUẤT ---
    function updateAuthButtons() {
        const isLoggedIn = localStorage.getItem('isLoggedIn'); // Lấy trạng thái từ LocalStorage

        if (isLoggedIn === 'true') {
            // Nếu đã đăng nhập: ẩn Đăng ký/Đăng nhập, hiện Đăng xuất
            if (registerBtn) registerBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            // Nếu chưa đăng nhập: hiện Đăng ký/Đăng nhập, ẩn Đăng xuất
            if (registerBtn) registerBtn.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // --- GỌI HÀM CẬP NHẬT NÚT KHI TRANG TẢI LẠI ---
    // Điều này đảm bảo trạng thái nút được cập nhật ngay khi người dùng mở bất kỳ trang nào.
    updateAuthButtons(); 

    // --- THÊM CHỨC NĂNG ĐĂNG XUẤT ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> (chuyển đến #)
            localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
            localStorage.removeItem('registeredUser'); // Xóa luôn thông tin người dùng giả lập
            alert('Bạn đã đăng xuất thành công!');
            
            // Cập nhật lại trạng thái nút ngay lập tức
            updateAuthButtons(); 
            // Chuyển hướng về trang chủ sau khi đăng xuất
            window.location.href = 'index.html'; 
        });
    }

    // --- CHỨC NĂNG CHUNG CHO MENU RESPONSIVE VÀ DROPDOWN ---
    function setupMobileMenu() {
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                if (mainNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }

        if (dropdownToggles) {
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    if (window.innerWidth <= 992) {
                        e.preventDefault(); 
                        const parentLi = this.parentElement; 
                        parentLi.classList.toggle('open'); 

                        const dropdownMenu = parentLi.querySelector('.dropdown-menu');
                        if (dropdownMenu) {
                            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                        }
                    }
                });
            });
        }

        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 992 && mainNav && menuToggle) {
                const isClickInsideNav = mainNav.contains(event.target);
                const isClickOnToggle = menuToggle.contains(event.target);

                if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.style.display = '';
                    });
                    document.querySelectorAll('.has-dropdown.open').forEach(li => {
                        li.classList.remove('open');
                    });
                }
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (menuToggle) { 
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.display = ''; 
                });
                document.querySelectorAll('.has-dropdown.open').forEach(li => {
                    li.classList.remove('open');
                });
            }
        });
    }

    // --- CHỨC NĂNG CHO ACCORDION (TRANG CHI TIẾT KHÓA HỌC) ---
    function setupAccordion() {
        if (accordionHeaders) {
            accordionHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const accordionBody = this.nextElementSibling;
                    accordionBody.classList.toggle('active');
                });
            });
        }
    }

    // --- CHỨC NĂNG XỬ LÝ FORM ĐĂNG KÝ ---
    function setupRegisterForm() {
        if (registerForm) {
            registerForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const username = document.getElementById('reg-username').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const password = document.getElementById('reg-password').value;
                const confirmPassword = document.getElementById('reg-confirm-password').value;
                const termsAccepted = document.getElementById('terms').checked;

                if (username === '' || email === '' || password === '' || confirmPassword === '') {
                    alert('Vui lòng điền đầy đủ tất cả các trường.');
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Vui lòng nhập địa chỉ email hợp lệ (ví dụ: example@domain.com).');
                    return;
                }

                if (password.length < 6) {
                    alert('Mật khẩu phải có ít nhất 6 ký tự.');
                    return;
                }

                if (password !== confirmPassword) {
                    alert('Xác nhận mật khẩu không khớp.');
                    return;
                }

                if (!termsAccepted) {
                    alert('Bạn phải đồng ý với Điều khoản dịch vụ.');
                    return;
                }

                // --- LƯU THÔNG TIN ĐĂNG KÝ VÀO LOCALSTORAGE ---
                const registeredUser = {
                    username: username,
                    email: email,
                    password: password
                };
                localStorage.setItem('registeredUser', JSON.stringify(registeredUser));
                // ---------------------------------------------

                localStorage.setItem('isLoggedIn', 'true'); // Đánh dấu là đã đăng nhập ngay sau đăng ký
                alert('Đăng ký thành công! Bạn sẽ được chuyển hướng qua trang đăng nhập.');
                updateAuthButtons(); // Cập nhật trạng thái nút
                window.location.href = 'login.html'; // Chuyển hướng về trang chủ
            });
        }
    }

    // --- CHỨC NĂNG XỬ LÝ FORM ĐĂNG NHẬP ---
    function setupLoginForm() {
        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const loginEmailUsername = document.getElementById('login-email').value.trim();
                const loginPassword = document.getElementById('login-password').value;

                if (loginEmailUsername === '' || loginPassword === '') {
                    alert('Vui lòng điền đầy đủ email/tên người dùng và mật khẩu.');
                    return;
                }

                const storedUserString = localStorage.getItem('registeredUser');
                
                if (storedUserString) {
                    const storedUser = JSON.parse(storedUserString);

                    if ((loginEmailUsername === storedUser.email || loginEmailUsername === storedUser.username) && loginPassword === storedUser.password) {
                        localStorage.setItem('isLoggedIn', 'true'); // Đánh dấu là đã đăng nhập
                        alert('Đăng nhập thành công! Chuyển hướng về trang chủ.');
                        updateAuthButtons(); // Cập nhật trạng thái nút
                        window.location.href = 'index.html'; // Chuyển hướng về trang chủ
                    } else {
                        alert('Email/Tên người dùng hoặc mật khẩu không đúng. Vui lòng thử lại.');
                    }
                } else {
                    alert('Chưa có tài khoản nào được đăng ký. Vui lòng đăng ký trước.');
                }
            });
        }
    }

    // --- GỌI CÁC CHỨC NĂNG KHI DOM ĐƯỢC TẢI XONG ---
    setupMobileMenu();
    setupAccordion();
    setupRegisterForm();
    setupLoginForm();
});