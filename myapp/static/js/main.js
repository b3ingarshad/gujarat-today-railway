(function (window, document, $, undefined) {
	'use strict';

	var NEWS = {
		i: function (e) {
			NEWS.s();
			NEWS.methods();
		},

		s: function (e) {
			this._window = $(window),
				this._document = $(document),
				this._body = $('body'),
				this._html = $('html'),
				this.sideNav = $('.side-nav'),
				this.zoomGallery = $('.zoom-gallery'),
				this.niceScrollContainer = $('.nicescroll-container'),
				this.yScrollContainer = $('.y-scroll-container'),
				this._bannerSidebarMediaWrapper = $(".axil-banner-sidebar-media-wrapper"),
				this._navbarSearch = $(".navbar-search"),
				this._subscribePopUp = $('.subscribe-popup'),
				this.videoPopup = $('.video-popup');
		},

		methods: function (e) {
			NEWS.w();
			NEWS._clickDoc();
			NEWS._click();
			NEWS.menuItemAnim();
			NEWS.magnificPopup();
			NEWS.niceScrollInit();
			NEWS.yScrollInit();
			NEWS.slickSync();
			NEWS.isIE();
			NEWS.initContactForm();
		},

		w: function (e) {
			this._window.on('load', NEWS.l).on('scroll', NEWS.scrl).on('resize', NEWS.res)
		},

		l: function (e) {
			NEWS.perfectSquare();
			NEWS.shapeLoaded();
			NEWS.animPostBannerContent();
			NEWS._masonryInit();
			NEWS._isotopInit();
			NEWS.loadSubscribePopup();
		},

		scrl: function () {

		},

		res: function () {
			NEWS.perfectSquare();
		},

		loadSubscribePopup: function () {
			setTimeout(function () {
				NEWS._subscribePopUp.addClass('show-popup');
			}, 3000);
		},

		_clickDoc: function (e) {
			var smoothScroll, openMainNav, openSubmenu, closeSubmenu, closeSideNav, openSideNav, inputFocus, inputblur, toggleShares, scrollPostUp, scrollPostDown, navSearchShow, navSearchHide, sideNavHover, removeHoverEffect, subscribePopupHide;

			//SMOOTHSCROLL
			smoothScroll = function (e) {

				if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
					var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
					var $f = target.offset().top,
						$g = $f - 40,
						$y;

					if (target.length) {
						$('#section-featured_work').is(target) ? $y = $g : $y = $f;
						$('html, body').animate({
							scrollTop: $y
						}, 1000, 'easeInOutExpo');
						return !1;
					}
				}
			};

			openMainNav = function () {

				if (NEWS._html.hasClass('main-menu-opened')) {
					NEWS._html.removeClass('main-menu-opened');
					$(this).removeClass('expanded');
					$('.main-navigation').children('li').removeAttr('style');
				} else {
					$(this).addClass('expanded');

					setTimeout(function () {
						NEWS._html.addClass('main-menu-opened');
						$('.main-menu-opened .main-navigation').children('li').each(function (index) {
							$(this).delay(80 * index)
								.animate({
									opacity: "1",
									top: '0'
								}, 100);
						});
					}, 800);
				}
			};

			openSubmenu = function (e) {
				if (NEWS._window.width() < 992) {
					$(this).siblings('.submenu').slideToggle(500, "easeInOutQuint").parent('li').toggleClass('active');
					$(this).parents('li').siblings().removeClass('active').find('.submenu').slideUp(500, "easeInOutQuint");
				} else {
					$(this).siblings('.submenu').toggleClass('opened').parent('li').toggleClass('active');
					$(this).parents('li').siblings('.has-dropdown').removeClass('active').find('.submenu').removeClass('opened');
				}
			};

			closeSubmenu = function (e) {
				if (!$('.main-navigation li, .main-navigation li a').is(e.target)) {
					$('.submenu').removeClass('opened').parent('li').removeClass('active');
				}
			};

			openSideNav = function () {
				NEWS.sideNav.addClass('opened');
				NEWS._html.addClass('side-nav-opened');

				setTimeout(function () {
					$('.side-nav-opened .side-navigation').children('li').each(function (index) {
						$(this).delay(100 * index)
							.animate({
								opacity: "1",
								left: '0'
							}, 100);
					});
				}, 500);
			};

			closeSideNav = function (e) {
				if (!$('.side-nav, .side-nav *:not(".close-sidenav")').is(e.target) && !$('.side-nav-toggler, .side-nav-toggler *').is(e.target)) {
					NEWS.sideNav.removeClass('opened');
					NEWS._html.removeClass('side-nav-opened');
					$('.side-navigation').children('li').removeAttr('style');
				}
			};

			inputFocus = function (e) {
				$(this).parents(".form-group").addClass('focused');
			};

			inputblur = function (e) {
				if (!$(this).val()) {
					$(this).parent(".form-group").removeClass('focused');
				}
			};

			toggleShares = function () {
				$(this).siblings('.social-share-wrapper').toggleClass('show-shares');
			};

			scrollPostDown = function (e) {
				e.preventDefault();
				NEWS._bannerSidebarMediaWrapper.animate({
					scrollTop: '+=200'
				}, 800, "easeInOutExpo");
			};

			scrollPostUp = function (e) {
				e.preventDefault();
				NEWS._bannerSidebarMediaWrapper.animate({
					scrollTop: '-=200'
				}, 800, "easeInOutExpo");
			};

			navSearchShow = function (e) {
				e.preventDefault();
				NEWS._navbarSearch.addClass('show-nav-search');
			};

			navSearchHide = function (e) {
				e.preventDefault();
				NEWS._navbarSearch.removeClass('show-nav-search');
			};

			sideNavHover = function (e) {
				e.preventDefault();
				$(this).removeClass('hover-removed').addClass('hovered').siblings('li').addClass('hover-removed').removeClass('hovered');
			};

			removeHoverEffect = function (e) {
				e.preventDefault();
				$(this).find('li').removeClass('hover-removed hovered');
			};

			subscribePopupHide = function (e) {
				if (!$('.subscribe-popup-inner, .subscribe-popup-inner *:not(.close-popup,.close-popup i)').is(e.target)) {
					NEWS._subscribePopUp.fadeOut("300");
				}
			};

			NEWS._document
				.on('click', '.page-scroll', smoothScroll)
				.on('click', '.main-navigation .has-dropdown > a', openSubmenu)
				.on('click', closeSubmenu)
				.on('click', '#close-sidenav', closeSideNav)
				.on('click', closeSideNav)
				.on('click', '.close-popup', subscribePopupHide)
				.on('click', subscribePopupHide)
				.on('click', '#side-nav-toggler', openSideNav)
				.on('focus', 'input:not([type="radio"]),input:not([type="checkbox"]),textarea,select', inputFocus)
				.on('blur', 'input,textarea,select', inputblur)
				.on('click', '.toggle-shares', toggleShares)
				.on('click', '.axil-post-scroll-down', scrollPostDown)
				.on('click', '.axil-post-scroll-up', scrollPostUp)
				.on('click', '.nav-search-field-toggler', navSearchShow)
				.on('click', '.navbar-search-close', navSearchHide)
				.on('mouseenter', '.side-navigation li', sideNavHover)
				.on('mouseout', '.side-navigation', removeHoverEffect)
				.on('click', '#main-nav-toggler', openMainNav);
		},

		_click: function (e) {
			NEWS.b();
			NEWS.c();
		},

		b: function (e) { },
		c: function (e) { },
		isIE: function () {
			var ua = navigator.userAgent;
			var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

			return is_ie;
		},
		menuItemAnim: function (e) {
			$('.rotate-txt li').each(function () {
				var txt = $(this).find('> a').text();

				$(this).find(">a").attr('data-txt', txt);
			});
		},

		slickSync: function () {
			var _slickCont = $('.slick-slider'),
				_slickFor = $('.slick-slider-nav');

			if (_slickCont.length) {

				var _prevArrow = '<button type="button" class="slick-prev"><i class="feather icon-chevron-left"></i></button>',
					_nextArrow = '<button type="button" class="slick-next"><i class="feather icon-chevron-right"></i></button>';

				var _defaults = {
					items: 1,
					dots: false,
					arrows: false,
					infinite: true,
					centerMode: false,
					variableWidth: false
				}

				//vars
				var _items = _slickFor[0].hasAttribute("data-slick-items") ? _slickFor.data('slick-items') : _defaults.items,
					_dots = _slickFor[0].hasAttribute("data-slick-dots") ? _slickFor.data('slick-dots') : _defaults.dots,
					_loop = _slickFor[0].hasAttribute("data-slick-loop") ? _slickFor.data('slick-loop') : _defaults.infinite,
					_center = _slickFor[0].hasAttribute("data-slick-center") ? _slickFor.data('slick-center') : _defaults.centerMode,
					_autoWidth = _slickFor[0].hasAttribute("data-slick-autowidth") ? _slickFor.data('slick-autowidth') : _defaults.variableWidth,
					_arrows = _slickFor[0].hasAttribute("data-slick-arrows") ? _slickFor.data('slick-arrows') : _defaults.arrows;


				$('.slick-slider-for').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					fade: false,
					dots: true,
					asNavFor: '.slick-slider-nav,.banner-share-slider',
					adaptiveHeight: true,
					autoplaySpeed: 2000
				});
				$('.slick-slider-nav').slick({
					slidesToShow: _items,
					slidesToScroll: 1,
					asNavFor: '.slick-slider-for,.banner-share-slider',
					prevArrow: _prevArrow,
					nextArrow: _nextArrow,
					arrows: true,
					dots: false,
					infinite: _loop,
					centerMode: _center,
					centerPadding: "0",
					autoplaySpeed: 2000,
					responsive: [{
						breakpoint: 1024,
						settings: {
							slidesToShow: _items
						}
					},
					{
						breakpoint: 991,
						settings: {
							slidesToShow: 1,
							centerMode: false
						}
					},
					{
						breakpoint: 767,
						settings: {
							slidesToShow: 1,
							centerMode: false
						}
					}
						// You can unslick at a given breakpoint now by adding:
						// settings: "unslick"
						// instead of a settings object
					]
				});

				$('.banner-share-slider').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: false,
					vertical: true,
					autoplaySpeed: 2000
				});

			}
		},



		perfectSquare: function () {
			var _square = $('.perfect-square');

			_square.each(function () {
				var squareWidth = $(this).width();
				$(this).height(squareWidth);
			});
		},

		_masonryInit: function () {

			var _masonryGrid = $('.masonry-grid');

			if (_masonryGrid.length) {
				_masonryGrid.isotope({
					itemSelector: '.grid-item',
					percentPosition: true,
					masonry: {
						columnWidth: '.grid-item'
					}
				});
			}

		},

		//isotope initialization
		_isotopInit: function () {
			var _axilIsoGrid = $('.axil-iso-grid'),
				_filterBtnGrp = $('.axil-filter-button-group');

			if (_axilIsoGrid.length) {
				_axilIsoGrid.each(function () { });
				var $grid = _axilIsoGrid.isotope({
					// options
					itemSelector: '.iso-grid-item',
					layoutMode: 'masonry'
				});
			}

			// filter items on button click

			_filterBtnGrp.each(function () {
				$(this).on('click', '.filter-btn', function () {
					var filterValue = $(this).attr('data-filter');
					$grid.isotope({
						filter: filterValue
					});
				});
			});


			_filterBtnGrp.each(function (i, buttonGroup) {
				var $buttonGroup = $(buttonGroup);
				$buttonGroup.on('click', '.filter-btn', function () {
					$buttonGroup.find('.is-checked').removeClass('is-checked');
					$(this).addClass('is-checked');
				});
			});
		},

		magnificPopup: function () {
			if (NEWS.videoPopup.length) {
				NEWS.videoPopup.magnificPopup({
					type: 'iframe',
					mainClass: 'mfp-fade',
					iframe: {
						markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + '</div>',
						patterns: {
							youtube: {
								index: 'youtube.com/',
								id: 'v=',
								src: '//www.youtube.com/embed/%id%?autoplay=1'
							}
						},
						srcAction: 'iframe_src'
					},
					gallery: {
						enabled: true
					},
					zoom: {
						enabled: true,
						duration: 300, // don't foget to change the duration also in CSS
						opener: function (element) {
							return element.find('img');
						}
					}
				});
			}

			if (NEWS.zoomGallery.length) {
				NEWS.zoomGallery.magnificPopup({
					delegate: 'a',
					type: 'image',
					closeOnContentClick: false,
					closeBtnInside: false,
					mainClass: 'mfp-with-zoom mfp-img-mobile',
					image: {
						verticalFit: true
					},
					gallery: {
						enabled: true
					},
					zoom: {
						enabled: true,
						duration: 300, // don't foget to change the duration also in CSS
						opener: function (element) {
							return element.find('img');
						}
					}

				});
			}
		},

		shapeLoaded: function () {
			var _shape1 = $('.axil-shape-circle'),
				_shape2 = $('.axil-shape-circle__two');

			if (_shape1.length && _shape2.length) {
				_shape1.addClass('shape-loaded');
				_shape2.addClass('shape-loaded');
			}
		},
		niceScrollInit: function () {
			NEWS.niceScrollContainer.niceScroll({
				cursorcolor: "#D3D7DA",
				cursorborderradius: "0"
			});
		},

		yScrollInit: function () {
			if (NEWS._window.width() > 991) {
				NEWS.yScrollContainer.niceScroll({
					cursorcolor: "#D3D7DA",
					cursorborderradius: "0",
					horizrailenabled: false
				});
			}
		},
		animPostBannerContent: function () {
			var _loadAnimWrapper = $('.load-anim-wrapper');
			_loadAnimWrapper.each(function () {
				$(this).find('.load-anim').each(function (index) {
					$(this).delay(200 * index)
						.animate({
							opacity: "1",
							top: '0'
						}, 800);
				});
			});
		},

		initContactForm: function () {
			$('.axil-contact-form').on('submit', function (e) {
				e.preventDefault();
				var _self = $(this);
				var __selector = _self.closest('input,textarea');
				_self.closest('div').find('input,textarea').removeAttr('style');
				_self.find('.error-msg').remove();
				_self.closest('div').find('button[type="submit"]').attr('disabled', 'disabled');
				var data = $(this).serialize();
				$.ajax({
					url: 'assets/scripts/email.php',
					type: "post",
					dataType: 'json',
					data: data,
					success: function (data) {
						_self.closest('div').find('button[type="submit"]').removeAttr('disabled');
						if (data.code == false) {
							_self.closest('div').find('[name="' + data.field + '"]');
							_self.find('.btn-primary').after('<div class="error-msg"><p>*' + data.err + '</p></div>');
						} else {
							$('.error-msg').hide();
							$('.form-group').removeClass('focused');
							_self.find('.btn-primary').after('<div class="success-msg"><p>' + data.success + '</p></div>');
							_self.closest('div').find('input,textarea').val('');

							setTimeout(function () {
								$('.success-msg').fadeOut('slow');
							}, 5000);
						}
					}
				});
			});
		}
	};
	NEWS.i();

})(window, document, jQuery);

// Custom JS For App

document.getElementById('currentYear').textContent = new Date().getFullYear();

// Function to get the current date in the desired format
function getCurrentDate() {
	const date = new Date(); // Get the current date

	// Array of abbreviated day names
	const abbreviatedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const dayName = abbreviatedDays[date.getDay()]; // Get abbreviated day name

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	const formattedDate = date.toLocaleDateString('en-US', options);
	// Format the date

	// Combine the abbreviated day name with the formatted date
	return `${dayName}, ${formattedDate}`;
}

// Set the current date in the HTML element
document.getElementById('current-date').textContent = getCurrentDate();

// Scroll Navbar Fixed
window.addEventListener('scroll', function () {
	const navbar = document.querySelector('.navbar');
	const scrollHeight = window.scrollY;

	if (scrollHeight > 300) {
		if (!navbar.classList.contains('fixed-top')) {
			navbar.classList.add('fixed-top', 'animate__animated',
				'animate__fadeIn');
		}
	} else {
		navbar.classList.remove('fixed-top', 'animate__animated',
			'animate__fadeIn');
	}
});

// Fetch data from the /api/navbar/ endpoint
fetch('/api/navbar/')
	.then(response => response.json())
	.then(data => {
		// Target the UL element where the nav items should be added
		const navLinksContainer = document.getElementById('nav-links');

		// Clear any existing links
		navLinksContainer.innerHTML = '';

		// Loop through the fetched data and generate the nav links
		data.forEach(navItem => {
			const listItem = document.createElement('li');
			listItem.innerHTML = `<a href="/${navItem.url}">${navItem.name}</a>`;
			navLinksContainer.appendChild(listItem);
		});
	})
	.catch(error => console.error('Error fetching nav data:', error));


// Show the button when the user scrolls past 300px
window.onscroll = function () {
	const goTopBtn = document.getElementById('goTopBtn');
	if (document.body.scrollTop > 300 ||
		document.documentElement.scrollTop > 300) {
		goTopBtn.style.display = "block";
	} else {
		goTopBtn.style.display = "none";
	}
};

// Function to scroll to the top
function goToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Google Translater
function googleTranslateElementInit() {
	new google.translate.TranslateElement({
		pageLanguage: 'en',
		includedLanguages: 'en,gu,hi,ml,ur,ar,mr,bn,te',
		layout: google.translate.TranslateElement.InlineLayout.SIMPLE
	}, 'google_translate_element');

	// Hide the loading message once Google Translate is ready
	document.getElementById('loading_message').style.display = 'none';

	// Set default language to Gujarati after Google Translate loads
	setTimeout(function () {
		var select = document.querySelector('.skiptranslate select');
		if (select) {
			select.value = 'gu'; // Set Gujarati as selected language
			select.dispatchEvent(new Event('change')); // Trigger change event to apply translation
		} else {
			console.error("Language selector not found");
		}
	}, 500); // Increase timeout to 500 ms for reliability
}