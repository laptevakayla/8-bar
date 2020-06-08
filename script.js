;

'use strict';

const COUNTRY_SELECT_OPEN_CLASS = 'country-select--open';
const SELECT_LIST_NAME_ACTIVE_CLASS = 'select__list__name--active';
const COUNTRIES = [{
    name: 'UKRAINE',
    shipping: '3',
}, {
    name: 'RUSSIA',
    shipping: '5',
}, {
    name: 'FRANCE',
    shipping: '8',
}, {
    name: 'USA',
    shipping: '10',
}];

function decreaseProduct(element) {
    const product = element.parentElement.parentElement.parentElement;
    const productPrice = Number(product.querySelector('.product-row__price').innerHTML.match(/[0-9]+/)[0]);
    const productTotalPrice = product.querySelector('.product-row__total-price');
    const productQuantityElement = product.querySelector('.quantity-numeral');
    const productQuantity = Number(productQuantityElement.innerHTML) - 1;

    if (productQuantity === 0) {
        return;
    }

    productQuantityElement.innerHTML = String(productQuantity);
    productTotalPrice.innerHTML = productTotalPrice.innerHTML.replace(/[0-9]+/, String(productQuantity * productPrice));

    get('.subtotal-price').innerHTML = productTotalPrice.innerHTML;
}

function increaseProduct(element) {
    const product = element.parentElement.parentElement.parentElement;
    const productPrice = Number(product.querySelector('.product-row__price').innerHTML.match(/[0-9]+/)[0]);
    const productTotalPrice = product.querySelector('.product-row__total-price');
    const productQuantityElement = product.querySelector('.quantity-numeral');
    const productQuantity = Number(productQuantityElement.innerHTML) + 1;

    productQuantityElement.innerHTML = String(productQuantity);
    productTotalPrice.innerHTML = productTotalPrice.innerHTML.replace(/[0-9]+/, String(productQuantity * productPrice));

    get('.subtotal-price').innerHTML = productTotalPrice.innerHTML;
}

function deleteProduct(element) {
    const subtotalPrice = get('.subtotal-price');

    element.parentElement.parentElement.remove();
    get('.no-products-message').style.display = 'block';

    subtotalPrice.innerHTML = subtotalPrice.innerHTML.replace(/[0-9]+/, 0);
}

function get(selector) {
    return document.querySelector(selector);
}

function getAll(selector) {
    return document.querySelectorAll(selector);
}

function initCountriesSelect() {
    const countrySelect = get('.country-select');

    if (countrySelect) {
        const countrySelectText = get('.country-select__text');
        const shippingPrice = get('.shipping-price');
        let countriesList = COUNTRIES.reduce((res, country, i) => {
            res += `<div class="select__list__name ${ i === 0 ? SELECT_LIST_NAME_ACTIVE_CLASS : '' }">${ country.name }</div>`;

            return res;
        }, '');

        countrySelectText.innerHTML = COUNTRIES[0].name;
        get('.country-select__list').innerHTML = countriesList;
        shippingPrice.innerHTML += COUNTRIES[0].shipping;

        countrySelect.addEventListener('click', function (event) {
            this.classList.add(COUNTRY_SELECT_OPEN_CLASS);

            if (event.target?.classList.contains('select__list__name')) {
                const selectedCountry = { ...COUNTRIES.find(country => country.name === event.target.innerHTML) };

                countrySelectText.innerHTML = selectedCountry.name;

                getAll(`.${ SELECT_LIST_NAME_ACTIVE_CLASS }`).forEach(item => item.classList.remove(SELECT_LIST_NAME_ACTIVE_CLASS));
                event.target.classList.add(SELECT_LIST_NAME_ACTIVE_CLASS);
                shippingPrice.innerHTML = shippingPrice.innerHTML.replace(/[0-9]+/, selectedCountry.shipping);
            } else {
                event.stopPropagation();
            }
        });
        document.addEventListener('click', function () {
            if (countrySelect?.classList.contains(COUNTRY_SELECT_OPEN_CLASS)) {
                countrySelect?.classList.remove(COUNTRY_SELECT_OPEN_CLASS);
            }
        });
    }
}

window.onload = () => {
    const video = get('.video-container video');
    const productsList = getAll('.product');
    const basket = get('.basket-img');
    const mainPageImg = get('.main-page_img');

    if (mainPageImg) {
        mainPageImg.style.opacity = '1';
    }

    // initProductHoverAnimation();
    initSlider();
    get('.play')?.addEventListener('click', function () {
        video.play();

        this.style.display = 'none';
    });

    productsList.forEach((product, i) => {
        product.querySelector('.product_cart__button-buy').addEventListener('click', () => {
            console.log(basket);
            console.dir(basket);
            console.log(basket.style.transform);

            if (!basket.style.transform) {
                basket.style.transform = 'rotate(360deg)';
            } else {
                basket.style.transform = '';
            }
        });
        setTimeout(
            () => product.classList.add('product--show'),
            i * 150,
        );
    });

    initCountriesSelect();
};

/**
 * Initializes swiper slider.
 */
function initSlider() {
    if (!window['Swiper']) {
        return;
    }

    const swiperSpeed = 1200;
    const mySwiper = new Swiper (
        '.swiper-container',
        {
            breakpoints: {
                // when window width is >= 992px
                992: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                },
            },
            loop: true,
            slidesPerView: 1.75,
            spaceBetween: 10,
        },
    );

    document.querySelector('.slider-screen__swiper .slider-arrow__previous').addEventListener('click', function (e) {
        e.preventDefault();
        mySwiper.slidePrev(swiperSpeed);
    });
    document.querySelector('.slider-screen__swiper .slider-arrow__next').addEventListener('click', function (e) {
        e.preventDefault();
        mySwiper.slideNext(swiperSpeed);
    });
}
