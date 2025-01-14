function slider({container, wrapper, field, slide, indicatorsSelector, elementsPerPage = 1, elementsPerPageMobile = 1, duration = 0, rowGap = 0}) {
    let slideIndex = 1,
        offset = 0,
        mobile = false,
        timer = 0,
        perPage = 1,
        templates = [],
        dots = [];
    const slider = document.querySelector(container),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        mediaQuery = window.matchMedia('(max-width: 768px)');

    if (mediaQuery.matches) {
        mobile = true;
        perPage = elementsPerPageMobile;
    } else {
        perPage = elementsPerPage;
    }

    let width = deleteNotDigits(window.getComputedStyle(slidesWrapper).width) / perPage + 'px';

    let indicators = document.createElement('ol');
    indicators.classList.add(indicatorsSelector);
    slider.append(indicators);

    let slides = document.querySelectorAll(slide);
    let baseSlides = slides;
    slidesField.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";  

    slides.forEach((slide, index) => {
        slide.style.width = width;
        if (index != 0) {
            slide.style.paddingLeft = rowGap + 'px';
        }
        templates[index] = slide;
    });

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
    dots = document.querySelectorAll('.dot')

    for (let i = 0; i < (perPage - 1); i++) {
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
        if (mediaQuery.matches) {
            mobile = true;
            perPage = elementsPerPageMobile;
        } else {
            mobile = false;
            perPage = elementsPerPage;
        }
        
        width = deleteNotDigits(window.getComputedStyle(slidesWrapper).width) / perPage + 'px';
        
        while (slidesField.childElementCount > baseSlides.length) {
            slidesField.removeChild(slidesField.lastElementChild)
        }
        for (let i = 0; i < (perPage - 1); i++) {
            slidesField.append(templates[i + 1].cloneNode(true));
        }

        slidesField.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";  
        
        dots.forEach((dot) => {
            mobile ? dot.style.width = 100 / slides.length + "%" : dot.style.width = '';
        });
        
        let slidesNew = document.querySelectorAll(slide);
        slidesNew.forEach((slide, index) => {
            slide.style.width = width;
            if (index != 0) {
                slide.style.paddingLeft = rowGap + 'px';
            }
        });
        
        slideIndex = 1,
        offset = 0,
        changeActivity();
    }); 

    makeTimer(duration);

    function moveNext() {
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
    }

    function movePrev() {
        if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
		}

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

        changeActivity();
    }

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
        timer = setInterval(() => moveNext(), duration);
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }

    let startX;
    let endX;

    const start = (e) => {
        startX = e.pageX || e.touches[0].pageX;	
    }

    const end = () => {
        if (endX < startX) {
            moveNext();
            makeTimer(duration);
        }  
        if (endX > startX) {
            movePrev();
            makeTimer(duration);
        }
    }

    const move = (e) => {
        e.preventDefault();
        endX = e.pageX || e.touches[0].pageX;
    }

    slidesField.addEventListener('mousedown', start);
    slidesField.addEventListener('touchstart', start);

    slidesField.addEventListener('mousemove', move);
    slidesField.addEventListener('touchmove', move);

    slidesField.addEventListener('mouseleave', end);
    slidesField.addEventListener('mouseup', end);
    slidesField.addEventListener('touchend', end);
}

function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    let tabs = document.querySelectorAll(tabsSelector),
		tabsContent = document.querySelectorAll(tabsContentSelector),
		tabsParent = document.querySelector(tabsParentSelector);

	function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove(activeClass);
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
	});
}

function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, closeSelector, modalSelector) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute(closeSelector) == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal(modalSelector);
        }
    });
}

$("form").on( "submit", function( event ) {
    event.preventDefault();
    let name = event.target.classList.value.slice(0, -5);
    $(`.${name}_form`).trigger('reset');
    closeModal(`.${name}`)
    openModal('.thanks');
    setTimeout(function(){
        closeModal('.thanks');
        location="#promo";
    }, 15000)
});

if (document.querySelector('.gallery_slider') != null) {
    slider({
        container: '.gallery_slider',
        wrapper: '.gallery_slider_wrapper',
        field: '.gallery_slider_inner',
        slide: '.gallery_slide',
        indicatorsSelector: 'gallery_slider_indicators',
        nextArrow: '.gallery_slider_next',
        prevArrow: '.gallery_slider_prev',
        elementsPerPage: 4,
        elementsPerPageMobile: 1.45,
        duration: 5000,
        rowGap: 15
    });
}

if (document.querySelector('.consult') != null) {
    modal('[data-modal]', 'data-close', '.consult');
}

tabs('.product_tab_item', '.product_tab_content', '.product_tab_header', 'product_tab_active');

const menu = document.querySelectorAll('.catalog_menu'),
    menu_items = document.querySelectorAll('.catalog_menu-items'),
    menu_item = document.querySelectorAll('.catalog_menu-item');

menu.forEach(item => {
    item.addEventListener('click', (e) => {
        menu_items.forEach(item => item.classList.remove('show'));
        menu_item.forEach(item => item.classList.remove('active'));
        const dropFor = item.getAttribute('drop-for');
        let drop = document.getElementById(dropFor);
        document.getElementById(dropFor).classList.add('show');
    });
});

menu_item.forEach(item => {
    item.addEventListener('click', (e) => {
        menu_item.forEach(item => item.classList.remove('active'));
        item.classList.add('active');
    });
});

let bottom_images = document.querySelectorAll('.product_images_bottom img');

bottom_images.forEach(image => {
    image.addEventListener('click', (e) => {
        let new_src = image.getAttribute('src');
        let main_image = document.querySelector('.product_images_main img');
        let old_src = main_image.getAttribute('src');
        main_image.setAttribute('src', new_src)
        image.setAttribute('src', old_src)
    });
}); 
