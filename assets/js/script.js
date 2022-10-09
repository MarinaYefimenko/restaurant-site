window.addEventListener('DOMContentLoaded', () => {

    function showModal(modal) {
        modal.style.display = 'block';
        let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = paddingOffset;
    }

    function hideModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.paddingRight = 0;
    }

    function modal(triggerSelector, modalSelector) {
        const btn = document.querySelector(triggerSelector),
            modal = document.querySelector(modalSelector);

        btn.addEventListener('click', () => {
            showModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                hideModal(modal);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && window.getComputedStyle(modal).display === 'block') {
                hideModal(modal);
            }
        });
    }

    function checkDate(dateSelector, btnSelector) {
        const date = document.querySelector(dateSelector),
            btn = document.querySelector(btnSelector);

        date.addEventListener('input', (e) => {
            if (e.target.valueAsNumber < new Date()) {
                date.style.outline = '1px solid red';
                btn.setAttribute("disabled", "disabled");
                btn.style.background = 'gray';
            } else {
                date.style.outline = '';
                btn.removeAttribute("disabled");
                btn.style.background = '#af1e1e';
            };
        });
    }

    checkDate('#date', '.booking__form .btn');


    function postRequest(formSelector) {

        const form = document.querySelector(formSelector);

        const message = {
            success: 'Thank you!<br><br>We will call you back soon!',
            failure: 'Something went wrong. Please try again later',
        };

        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
            });

            return await res.json();
        };

        function bindpostData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const loading = document.querySelector('.spinner');
                loading.style.display = 'block';

                const formData = new FormData(form);
                const json = JSON.stringify(Object.fromEntries(formData.entries()));

                postData('http://localhost:3000/requests', json)
                    .then(data => {
                        console.log(data);
                        showThanksModal(message.success);
                    }).catch(() => {
                        showThanksModal(message.failure);
                    }).finally(() => {
                        form.reset();
                        loading.style.display = 'none';
                    })
            });
        }

        function showThanksModal(message) {
            const modal = document.querySelector('.modal');
            const pervModalDialog = document.querySelector('.modal__dialog');
            pervModalDialog.style.display = 'none';

            showModal(modal);

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
                <div class = "modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__text">${message}</div>
                </div>
            `;

            modal.append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                pervModalDialog.style.display = 'block';
                hideModal(modal);
            }, 4000);
        }

        bindpostData(form);
    }


    function toggleUpBtn(selector, activeClass) {
        const upBtn = document.querySelector(selector);

        window.addEventListener('scroll', () => {
            if (scrollY == 0) {
                upBtn.classList.remove(activeClass);
            } else if (scrollY < document.documentElement.clientHeight) {
                upBtn.classList.add(activeClass);
            }
        })

        upBtn.addEventListener('click', () => {
            window.scrollTo(pageXOffset, 0);
            upBtn.classList.remove(activeClass);
        })
    }

    function openBurgerMenu(burgerSelector, menuSelector, crossSelector, linkSelector) {
        const burger = document.querySelector(burgerSelector),
            menu = document.querySelector(menuSelector),
            cross = document.querySelector(crossSelector),
            links = document.querySelectorAll(linkSelector);

        burger.addEventListener('click', () => {
            menu.style.display = "block";
            burger.style.display = "none";
            cross.style.display = "block";
            document.body.style.overflow = 'hidden';
        });

        function close() {
            menu.style.display = "none";
            burger.style.display = "block";
            cross.style.display = "none";
            document.body.style.overflow = '';
        }

        menu.addEventListener('click', (e) => {
            links.forEach((link) => {
                if (e.target == link && document.documentElement.scrollWidth < 770) {
                    close();
                }
            })
        });

        cross.addEventListener('click', () => {
            close();
        })

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && window.getComputedStyle(menu).display === 'block') {
                close();
            }
        });
    }

    function slider(sliderSelector, wrapperSelector, slidesSelector, prewBtn, nextBtn) {

        const slider = document.querySelector(sliderSelector),
            sliderWrapper = document.querySelector(wrapperSelector),
            slides = document.querySelectorAll(slidesSelector),
            slide = document.querySelector(slidesSelector),
            prev = document.querySelector(prewBtn),
            next = document.querySelector(nextBtn),
            width = window.getComputedStyle(slide).width;

        let slideIndex = 1;
        let offset = 0;

        sliderWrapper.style.width = 34 * slides.length + '%';
        sliderWrapper.style.transition = '1s all';

        slider.style.overflow = 'hidden';

        slides.forEach(slide => {
            slide.style.width = width;
        })

        function moveSlide() {
            sliderWrapper.style.transform = `translateX(-${offset}px)`;
        }

        function transfToDigit(str) {
            return +str.slice(0, -2);
        }

        next.addEventListener('click', () => {
            if (offset == transfToDigit(width) * (slides.length - 3)) {
                offset = 0;
            } else {
                offset += transfToDigit(width);
            }

            if (slideIndex == slides.length) {
                slideIndex = 1;
            } else {
                slideIndex++;
            }
            moveSlide();
        })

        prev.addEventListener('click', () => {
            if (offset == 0) {
                offset = transfToDigit(width) * (slides.length - 3);
            } else {
                offset -= transfToDigit(width);
            }

            if (slideIndex == 1) {
                slideIndex = slides.length;
            } else {
                slideIndex--;
            }
            moveSlide();
        })
    }

    modal('.book', '.modal');
    postRequest('.booking__form');
    toggleUpBtn('.up__btn', 'show');
    openBurgerMenu('.nav-toggle', '.nav', '.cross', '.nav__item a');
    slider('.gallery', '.gallery__wrapper', '.gallery__wrapper img', '.arrow-prew', '.arrow-next')
})