document.addEventListener('DOMContentLoaded', function() {
    // --- KHAI BÁO BIẾN CHUNG ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const header = document.querySelector('.main-header'); // Lấy phần tử header

    // Thêm các biến cho nút đăng ký, đăng nhập, đăng xuất
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // Biến để lưu trữ đối tượng Swiper
    let heroSwiperInstance = null;

    // --- HÀM HỖ TRỢ ĐỂ CẬP NHẬT TRẠNG THÁI NÚT ĐĂNG NHẬP/ĐĂNG KÝ/ĐĂNG XUẤT ---
    function updateAuthButtons() {
        const isLoggedIn = localStorage.getItem('isLoggedIn'); // Lấy trạng thái từ LocalStorage

        // Console log để debug:
        console.log('updateAuthButtons called. isLoggedIn:', isLoggedIn);

        if (isLoggedIn === 'true') {
            // Nếu đã đăng nhập: ẩn Đăng ký/Đăng nhập, hiện Đăng xuất
            if (registerBtn) {
                registerBtn.style.display = 'none';
                console.log('Register button hidden.');
            }
            if (loginBtn) {
                loginBtn.style.display = 'none';
                console.log('Login button hidden.');
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'block';
                console.log('Logout button shown.');
            }
        } else {
            // Nếu chưa đăng nhập: hiện Đăng ký/Đăng nhập, ẩn Đăng xuất
            if (registerBtn) {
                registerBtn.style.display = 'block';
                console.log('Register button shown.');
            }
            if (loginBtn) {
                loginBtn.style.display = 'block';
                console.log('Login button shown.');
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
                console.log('Logout button hidden.');
            }
        }
    }

    // --- GỌI HÀM CẬP NHẬT NÚT KHI TRANG TẢI LẠI (QUAN TRỌNG) ---
    // Hàm này sẽ chạy ngay khi DOM của trang được tải, đọc localStorage và cập nhật UI.
    updateAuthButtons();

    // --- THÊM CHỨC NĂNG ĐĂNG XUẤT ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
            localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
            localStorage.removeItem('registeredUser'); // Xóa thông tin người dùng giả lập (nếu cần)
            alert('Bạn đã đăng xuất thành công!');

            // Không cần gọi updateAuthButtons() ở đây nếu bạn chuyển hướng
            // vì trang sẽ tải lại và hàm đó sẽ chạy tự động.
            window.location.href = 'index.html'; // Chuyển hướng về trang chủ
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
                // KHÔNG GỌI updateAuthButtons() Ở ĐÂY NỮA, vì nó sẽ được gọi lại trên trang login.html hoặc index.html
                window.location.href = 'login.html'; // Chuyển hướng về trang đăng nhập
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
                        // Rất quan trọng: Bỏ updateAuthButtons() ở đây.
                        // Hàm này sẽ được gọi lại khi index.html (trang đích) tải xong.
                        // updateAuthButtons(); // Bỏ dòng này đi!
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

    // --- CHỨC NĂNG ẨN/HIỆN HEADER KHI CUỘN TRANG ---
    if (header) {
        let lastScrollY = window.scrollY;
        let headerHeight = header.offsetHeight;

        document.body.style.paddingTop = headerHeight + 'px';

        window.addEventListener('scroll', () => {
            if (window.scrollY > headerHeight) {
                if (window.scrollY > lastScrollY) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('header-hidden');
            }
            lastScrollY = window.scrollY;
        });
    }

    // --- CHỨC NĂNG ĐỂ CHUYỂN ĐỔI TEXT THÀNH SPAN CHO ANIMATION ---
    function animateTextByLetters(selector) {
        if (typeof $ === 'undefined') {
            console.error("jQuery is not loaded. animateTextByLetters cannot run.");
            return;
        }

        $(selector).each(function() {
            var $this = $(this);
            if ($this.data('animated-by-letters')) {
                return;
            }

            var text = $this.text().trim();
            if (text.length === 0) {
                $this.data('animated-by-letters', true);
                return;
            }

            var newHtml = '';
            for (var i = 0; i < text.length; i++) {
                newHtml += '<span>' + text[i] + '</span>';
            }
            $this.html(newHtml);
            $this.data('animated-by-letters', true);
        });
    }

    // --- GỌI CÁC CHỨC NĂNG KHI DOM ĐƯỢC TẢI XONG ---
    setupMobileMenu();
    setupAccordion();
    setupRegisterForm();
    setupLoginForm();

    // Khởi tạo Swiper Slider cho Hero Section
    if (document.querySelector('.hero-swiper')) {
        heroSwiperInstance = new Swiper('.hero-swiper', {
            direction: 'horizontal',
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            mousewheel: {
                invert: true,
            },
            on: {
                init: function() {
                    console.log('Swiper initialized. Animating active hero-tagline.');
                    animateTextByLetters('.swiper-slide-active .hero-tagline');
                },
                slideChangeTransitionEnd: function() {
                    // Để đảm bảo animation luôn chạy trên slide mới khi thay đổi,
                    // bạn cần "reset" lại trạng thái của hero-tagline trên slide đó.
                    // Tuy nhiên, với hiệu ứng fade và animation chữ, việc này có thể gây giật.
                    // Nếu bạn chỉ muốn animate lần đầu khi load trang, không cần code trong đây.
                    // Nếu muốn animate mỗi khi slide thay đổi, hãy cân nhắc kỹ hiệu ứng:
                    var currentActiveTagline = heroSwiperInstance.slides[heroSwiperInstance.activeIndex].querySelector('.hero-tagline');
                    if (currentActiveTagline) {
                        $(currentActiveTagline).removeData('animated-by-letters'); // Xóa cờ
                        var originalText = $(currentActiveTagline).text(); // Giả định text gốc đã được lưu
                        $(currentActiveTagline).text(originalText); // Đặt lại text gốc
                        animateTextByLetters(currentActiveTagline); // Chạy lại animation
                    }
                }
            }
        });

        if (heroSwiperInstance && heroSwiperInstance.initialized) {
            console.log('Swiper already initialized. Animating active hero-tagline.');
            animateTextByLetters('.swiper-slide-active .hero-tagline');
        }
    } else {
        if (typeof $ !== 'undefined') {
             animateTextByLetters('.hero-tagline');
        }
    }

    // --- CHỨC NĂNG REPEAT CHO ANIMATION (Sử dụng jQuery) ---
    if (typeof $ !== 'undefined') {
        $('.repeat').click(function(){
            var classes = $(this).parent().attr('class');
            $(this).parent().attr('class', 'animate');
            var indicator = $(this);
            setTimeout(function(){
                $(indicator).parent().addClass(classes);
            }, 20);
        });
    }
});