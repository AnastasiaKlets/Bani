function slider({container, wrapper, field, slide, indicatorsSelector, elementsPerPage = 1, duration = 0, rowGap = 0}) {
    let slideIndex = 1,
        offset = 0,
        mobile = false,
        timer = 0,
        templates = [],
        dots = [];
    const slider = document.querySelector(container),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        mediaQuery = window.matchMedia('(max-width: 768px)');

    let width = deleteNotDigits(window.getComputedStyle(slidesWrapper).width) / elementsPerPage + 'px';

    let indicators = document.createElement('ol');
    indicators.classList.add(indicatorsSelector);
    slider.append(indicators);

    let slides = document.querySelectorAll(slide);
    slidesField.style.width = 100 * (slides.length + elementsPerPage - 1) / elementsPerPage + "%";  

    slides.forEach((slide, index) => {
        slide.style.width = width;
        if (index != 0) {
            slide.style.paddingLeft = rowGap + 'px';
        }
        templates[index] = slide;
    });
    
    
    if (mediaQuery.matches) {
        mobile = true;
    }

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        mobile ? dot.style.width = 100 / slides.length + "%" : dot.style.width = '';
        if (i == 0) {
            dot.classList.add('active');
        } 
        indicators.append(dot);
        dots.push(dot);
    }

    for (let i = 0; i < (elementsPerPage - 1); i++) {
        slidesField.append(templates[i + 1].cloneNode(true));
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);
            makeTimer(duration);
            changeActivity();
        });
    });

    window.addEventListener('resize', (e) => {
        width = deleteNotDigits(window.getComputedStyle(slidesWrapper).width) / elementsPerPage + 'px';
        let slides = document.querySelectorAll(slide);
        slides.forEach((slide, index) => {
            slide.style.width = width;
            if (index != 0) {
                slide.style.paddingLeft = rowGap + 'px';
            }
        });
        mediaQuery.matches ? mobile = true : mobile = false;
        let dots = document.querySelectorAll('.dot')
        dots.forEach((dot) => {
            mobile ? dot.style.width = 100 / slides.length + "%" : dot.style.width = '';
        });
        slideIndex = 1,
        offset = 0,
        changeActivity();
    }); 

    makeTimer(duration);

    function changeActivity() {
        slidesField.style.transform = `translateX(-${offset}px)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex-1].classList.add('active');
    }

    function makeTimer(duration){
        if (duration == 0) {
            return;
        }
        clearInterval(timer)
        timer = setInterval(function(){
            if (offset == deleteNotDigits(width) * (slides.length - 1)) {
                offset = 0;
            } else {
                offset += deleteNotDigits(width);
            }
    
            if (slideIndex == slides.length) {
                slideIndex = 1;
            } else {
                slideIndex++;
            }
    
            changeActivity();
        },duration);
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }
}

slider({
    container: '.gallery_slider',
    wrapper: '.gallery_slider_wrapper',
    field: '.gallery_slider_inner',
    slide: '.gallery_slide',
    indicatorsSelector: 'gallery_slider_indicators',
    nextArrow: '.gallery_slider_next',
    prevArrow: '.gallery_slider_prev',
    elementsPerPage: 4,
    duration: 5000,
    rowGap: 15
});
