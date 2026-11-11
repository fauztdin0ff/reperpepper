/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
$(document).ready(function () {

   document.querySelectorAll('.ma a').forEach(makeMail);

   function makeMail(ma) {
      const m_name = ma.innerHTML;
      const m_a_i_l = m_name + '@reperpeper.ru';
      ma.innerHTML = m_a_i_l;
      ma.href = "mailto:" + m_a_i_l;
   }


   $('input,textarea').on('focus', function () {
      $(this).parent().addClass('ch');
   });
   $('input,textarea').on('focusout', function () {
      var pa = $(this).parent();
      if (!$(this).val().length) {
         pa.removeClass('ch');
         if (pa.hasClass('required')) pa.addClass('warning');
      } else {
         if (pa.hasClass('required')) pa.removeClass('warning');
      }
   });




   function submit_form() {
      var fData = $('form.reg').serialize();
      //console.log( 'fData:'+fData );
      var num_errors = 0;

      $('form.reg .field input').each(function (i, el) {
         //console.log( 'el ' + $(el).val() );
         var pa = $(el).parent();
         if (!$(el).val() && pa.hasClass('required')) {
            pa.addClass('warning');
            num_errors++;
         }
      });

      if (num_errors) return false;


      $.ajax({
         url: 'send.php',
         method: 'post',
         dataType: 'html',
         contentType: "application/x-www-form-urlencoded;charset=utf-8",
         data: { form_data: fData },
         success: function (response) {
            console.log('response:' + response);

            resp = Number.parseInt(response);
            if (resp > 0) {
               $('form.reg').hide();
               $('#thankyou').fadeIn();
            }
         },
         error: function (jqxhr, response, errorMsg) {
            console.log("response: " + response + " errorMsg: " + errorMsg);
         }
      });


      return false;
   }

   $('form.reg button[type=submit]').on('click', function (e) {
      console.log('CLICK form.reg button[type=submit]');
      submit_form();
      return false;
   });

   $('form.reg').off('submit');


   function check_OK() {
      if ($('#row_name').hasClass('ok') && $('#row_phone').hasClass('ok') && $('#row_email').hasClass('ok')) {
         $('form.reg button[type=submit]').prop('disabled', false);
      }
   }

   /*
   if (document.querySelector("input[name='phone']")) {
      Inputmask("+7 (999) 999-99-99", {
   
      }).mask("input[name='phone']");
   }	*/



   var cookiePermit = Cookies.get('cookiePermit');
   if (!cookiePermit) {
      console.log('!cookiePermit');
      $('#cookie').show();
      $('#cookie button').on('click', function () {
         Cookies.set('cookiePermit', 1, { expires: 365 });
         $('#cookie').hide();
      });
   }

});

function preloader() {
   const panel = document.querySelector("#preloader");
   if (!panel) return;

   const svg = panel.querySelector(".preloader__curve");
   const shape = panel.querySelector(".preloader__shape");
   const solid = panel.querySelector(".preloader__solid");

   const isInnerPage = panel.classList.contains("preloader--inner");

   let frame = null;

   const pageLoaded = new Promise((resolve) => {
      if (document.readyState === "complete") {
         resolve();
      } else {
         window.addEventListener("load", resolve, {
            once: true,
         });
      }
   });

   const samples = 256;
   const table = new Float32Array(samples + 1);

   for (let i = 0; i <= samples; i++) {
      const x = i / samples;
      let lo = 0;
      let hi = 1;
      let t = 0;

      for (let j = 0; j < 18; j++) {
         t = (lo + hi) / 2;

         const value =
            3 * (1 - t) * (1 - t) * t * 0.76 +
            3 * (1 - t) * t * t * 0.24 +
            t * t * t;

         if (value < x) {
            lo = t;
         } else {
            hi = t;
         }
      }

      table[i] =
         3 * (1 - t) * t * t +
         t * t * t;
   }

   table[0] = 0;
   table[samples] = 1;

   function ease(x) {
      x = Math.max(0, Math.min(1, x)) * samples;

      const i = Math.floor(x);

      return i === samples
         ? 1
         : table[i] +
         (table[i + 1] - table[i]) * (x - i);
   }

   function setup() {
      const h = window.innerHeight;
      const w = window.innerWidth;
      const b = Math.min(300, h * 0.38);

      solid.style.height = `${h - b + 8}px`;
      svg.style.top = `${h - b}px`;
      svg.style.height = `${b * 2 + 2}px`;

      svg.setAttribute(
         "viewBox",
         `0 0 ${w} ${b * 2 + 2}`
      );

      return { h, b };
   }

   function draw(edge, bend, h, b) {
      const w = window.innerWidth;

      panel.style.transform = `translate3d(
         0,
         ${(edge - h).toFixed(2)}px,
         0
      )`;

      const prefix = `M0 0 H${w} V${b} Q${w / 2} `;
      const suffix = ` 0 ${b} Z`;

      shape.setAttribute(
         "d",
         `${prefix}${(b + bend).toFixed(2)}${suffix}`
      );
   }

   function animate(duration, callback) {
      return new Promise((resolve) => {
         const start = performance.now();

         function tick(now) {
            const progress = Math.min(
               (now - start) / duration,
               1
            );

            callback(ease(progress), progress);

            if (progress < 1) {
               frame = requestAnimationFrame(tick);
            } else {
               resolve();
            }
         }

         frame = requestAnimationFrame(tick);
      });
   }

   async function init() {
      const { h, b } = setup();

      panel.classList.add("active");

      if (isInnerPage) {
         draw(h + 2, 0, h, b);
      } else {
         draw(-b - 2, 0, h, b);

         await new Promise((resolve) => {
            requestAnimationFrame(() => {
               requestAnimationFrame(resolve);
            });
         });

         await new Promise((resolve) => {
            setTimeout(resolve, 200);
         });

         await animate(800, (eased, progress) => {
            draw(
               -b - 2 + (h + b + 4) * eased,
               -b * Math.sin(Math.PI * progress),
               h,
               b
            );
         });
      }

      await pageLoaded;

      document.body.classList.remove("is-loading");

      await new Promise((resolve) => {
         setTimeout(resolve, 150);
      });

      document.dispatchEvent(
         new CustomEvent("preloaderRevealStart")
      );

      await animate(900, (eased, progress) => {
         draw(
            h + 2 - (h + b + 4) * eased,
            b * Math.sin(Math.PI * progress),
            h,
            b
         );
      });

      panel.style.display = "none";
   }

   init();

   window.addEventListener("resize", () => {
      cancelAnimationFrame(frame);
   });
}

preloader();


document.addEventListener(
   "preloaderRevealStart",
   () => {
      const container = document.querySelector(".videoContainer");

      if (!container) return;

      const video = container.querySelector("video");

      if (!video) return;

      video.play()
         .then(() => {
            container.classList.add("video-is-playing");
         })
         .catch(() => {
         });
   },
   { once: true }
);


function initAnimations() {
   const elements = document.querySelectorAll('.fade-in-up');

   if (!elements.length) return;

   const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) return;

         entry.target.classList.add('is-visible');
         observer.unobserve(entry.target);
      });
   }, {
      threshold: 0,
      rootMargin: '0px 0px -20% 0px'
   });

   elements.forEach(element => {
      if (element.classList.contains('fade-imediate')) {
         element.classList.add('is-visible');
      } else {
         observer.observe(element);
      }
   });

   if (window.innerWidth <= 767) {
      const footerElements = document.querySelectorAll(
         '.footer aside.fade-in-up, .footer-logo .fade-in-up'
      );

      footerElements.forEach(element => {
         element.classList.add('is-visible');
         observer.unobserve(element);
      });
   }
}

initAnimations();


let hover = document.getElementsByClassName('hover-letter');
for (let i = 0; i < hover.length; i++) {
   //hover[i].innerHTML = hover[i].innerHTML.replace(/(.)/g, '<span>$1</span>');
   const spans = hover[i].innerHTML.replace(/(.)/g, '<span>$1</span>');

   hover[i].innerHTML = '<div><div>' + spans + '</div>' + '<div>' + spans + '</div></div>';
}



///////////////  2026  /////////////////////

var windowHeight = Math.min(document.documentElement.clientHeight, window.screen.height, window.innerHeight);
var windowWidth = window.innerWidth;


function initHeaderLogoVisible() {
   window.addEventListener('scroll', () => {
      if (windowWidth > 500) {
         if (window.scrollY > 500) {
            document.querySelectorAll('.logo').forEach(el => { el.classList.add('visible'); });
         } else {
            document.querySelectorAll('.logo').forEach(el => { el.classList.remove('visible'); });
         }
      }
   });
}



/*==========================================================================
Header catalog
============================================================================*/
function initCatalogToggle() {
   const buttons = document.querySelectorAll('header .header__toggle');
   const catalog = document.querySelector('nav');

   if (!buttons.length || !catalog) return;

   const ACTIVE_CLASS = 'active';

   const openCatalog = () => {
      buttons.forEach(button => {
         button.classList.add(ACTIVE_CLASS);
      });

      catalog.classList.add(ACTIVE_CLASS);
      lenis.stop();
   };

   const closeCatalog = () => {
      buttons.forEach(button => {
         button.classList.remove(ACTIVE_CLASS);
      });

      catalog.classList.remove(ACTIVE_CLASS);
      lenis.start();
   };

   const toggleCatalog = () => {
      const isOpen = catalog.classList.contains(ACTIVE_CLASS);

      isOpen ? closeCatalog() : openCatalog();
   };

   buttons.forEach(button => {
      button.addEventListener('click', (e) => {
         e.stopPropagation();
         toggleCatalog();
      });
   });

   document.addEventListener('click', () => {
      if (catalog.classList.contains(ACTIVE_CLASS)) {
         closeCatalog();
      }
   });
}

/*==========================================================================
hover arrow
============================================================================*/

document.querySelectorAll('#cases a.item').forEach(el => {
   el.addEventListener('mouseover', () => {
      document.querySelector('body').classList.add('special_hover');
   });
});

document.querySelectorAll('#cases a.item').forEach(el => {
   el.addEventListener('mouseout', () => {
      document.querySelector('body').classList.remove('special_hover');
   });
});













var MAIN = $('main');
var intro_block = $('#intro');
var color_block = $('#cases');
var mask_block = $('#intro .videoContainer em');
var who_block = $('.who');
var about_block = $('#about');
var services_block = $('#services');
var discuss_block = $('#discuss');
var face_block = $('.face-container');

function scrollReaction() {
   let scrY = window.scrollY;
   if (!intro_block.length) return;
   var maxxx = intro_block.outerHeight();
   var offff = maxxx * 0.3;
   var color_offset = MAIN.offset();
   var color_diff = scrY - offff - color_offset.top;
   var koef = color_diff / (0.5 * maxxx - offff);
   koef = Math.max(0, Math.min(1, koef));
   var pr5 = Math.round(247 - (247 * koef));
   var pr6 = Math.round(22 + (233 * koef));
   var who_koef = 0;

   if (who_block.length) {
      var who_offset = who_block.offset().top;
      var start = who_offset - window.innerHeight * 0.55;
      var end = who_offset - window.innerHeight * 0.45;
      who_koef = Math.max(0, Math.min(1, (scrY - start) / (end - start)));
   }

   var final_bg = Math.round(pr5 + ((247 - pr5) * who_koef));
   var final_color = Math.round(pr6 + ((22 - pr6) * who_koef));

   MAIN.css({
      'background-color': `rgb(${final_bg},${final_bg},${final_bg})`,
      'color': `rgb(${final_color},${final_color},${final_color})`
   });

   if (mask_block.length) {
      mask_block.css('background-color', `rgb(${final_bg},${final_bg},${final_bg})`);
      $('#intro aside > div em').css(
         'background-color',
         `rgb(${final_color},${final_color},${final_color})`
      );
      mask_block.css('display', color_diff >= 0 ? 'block' : 'none');
   }

   if (who_block.length) {
      var who_bg = Math.round(247 * who_koef);

      who_block.css(
         'background-color',
         `rgb(${who_bg},${who_bg},${who_bg})`
      );

      about_block.css(
         'background-color',
         `rgb(${who_bg},${who_bg},${who_bg})`
      );
   }

   // Третий переход
   if (services_block.length) {
      var services_offset = services_block.offset().top;
      var start = services_offset - window.innerHeight * 0.55;
      var end = services_offset - window.innerHeight * 0.45;
      var services_koef = (scrY - start) / (end - start);
      services_koef = Math.max(0, Math.min(1, services_koef));
      var services_bg = Math.round(247 - (247 * services_koef));
      var services_color = Math.round(22 + (233 * services_koef));
      var services_theme = {
         'background-color': `rgb(${services_bg},${services_bg},${services_bg})`,
         'color': `rgb(${services_color},${services_color},${services_color})`
      };
      $('#reviews').css(services_theme);
      services_block.css(services_theme);
   }

   // Четвертый переход
   if (discuss_block.length) {
      var discuss_offset = discuss_block.offset().top;
      var start = discuss_offset - window.innerHeight * 0.55;
      var end = discuss_offset - window.innerHeight * 0.45;
      var discuss_koef = (scrY - start) / (end - start);

      if (discuss_koef > 0) {
         discuss_koef = Math.min(1, discuss_koef);
         var discuss_bg = Math.round(247 * discuss_koef);
         var discuss_color = Math.round(255 - (233 * discuss_koef));
         var discuss_theme = {
            'background-color': `rgb(${discuss_bg},${discuss_bg},${discuss_bg})`,
            'color': `rgb(${discuss_color},${discuss_color},${discuss_color})`
         };
         services_block.css(discuss_theme);
         discuss_block.css(discuss_theme);
      }

      if (face_block.length) {
         face_block.css('opacity', discuss_koef >= 1 ? 1 : 0);
      }
   }
}








function resize() {
   windowHeight = Math.min(document.documentElement.clientHeight, window.screen.height, window.innerHeight);
   windowWidth = window.innerWidth;

   //var iw = document.querySelector('#intro .wrapper').clientWidth;
   //console.log( 'iw ' + iw );
   //document.querySelector('#intro video').style.width = Math.round( iw * 1920 / 1760 ) + 'px';

   scrollReaction();
}


$(window).on('load, resize', function () {
   resize();
});
$(window).on('scroll', function () {
   scrollReaction();
});


resize();
initHeaderLogoVisible();
initCatalogToggle();





var swiper = new Swiper('#teamSwiper', {
   loop: false,
   grabCursor: true,
   watchOverflow: true,
   spaceBetween: 20,
   slidesPerView: 1,
   /*autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },*/
   speed: 700,
   breakpoints: {
      560: { slidesPerView: 1.5, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      /*1024: { slidesPerView: 2.5, spaceBetween: 20 },
      1200: { slidesPerView: 3, spaceBetween: 24 }*/
      1024: { slidesPerView: 3, spaceBetween: 20 },
      1200: { slidesPerView: 3.5, spaceBetween: 24 },
      1400: { slidesPerView: 4, spaceBetween: 24 },
      1900: { slidesPerView: 5, spaceBetween: 24 },
   },
   mousewheel: {
      forceToAxis: true,
      releaseOnEdges: true,
   },
});




$(function () {
   'use strict';

   const geometry = {
      width: 1921,
      arrowWidth: 17.586,
      arrowHeight: 34,
      homeX: 357,
      leftLength: 354,
      rightX: 858,
      rightLength: 1063,
      tipOffset: 3,
      lineThickness: 3,
   };

   const timing = {
      exit: 130,
      return: 850,
   };

   const clamp = value => Math.max(0, Math.min(1, value));
   const easeOutCubic = value => 1 - Math.pow(1 - value, 3);
   const easeInOutSine = value => (1 - Math.cos(Math.PI * value)) / 2;

   const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
   );

   $('[data-projects]').each(function () {
      const $block = $(this);
      const $title = $block.find('.projects-more__title');
      const $baseline = $block.find('.projects-more__baseline');
      const $left = $block.find('[data-line-left]');
      const $right = $block.find('[data-line-right]');
      const $arrowA = $block.find('[data-arrow-a]');
      const $arrowB = $block.find('[data-arrow-b]');

      // Canvas используется только для измерения буквы «В»
      const measure = document.createElement('canvas').getContext('2d');

      let centerY = 65;
      let running = false;
      let progress = 0;

      function place($arrow, tipX, opacity) {
         $arrow.attr({
            transform: `translate(
               ${tipX - geometry.arrowWidth}
               ${centerY - geometry.arrowHeight / 2}
            )`,
            opacity: opacity,
         });
      }

      function drawLines(leftScale, rightScale, retractRight = false) {
         const rightStart = retractRight
            ? geometry.width - geometry.rightLength * rightScale
            : geometry.rightX;

         const rightEnd = retractRight
            ? geometry.width
            : geometry.rightX + geometry.rightLength * rightScale;

         const top = centerY - geometry.lineThickness / 2;

         $left.attr({
            y: top,
            width: geometry.leftLength * leftScale,
         });

         $right.attr({
            y: top,
            x: rightStart,
            width: rightEnd - rightStart,
         });
      }

      function reset() {
         drawLines(1, 1);

         place(
            $arrowA,
            geometry.homeX,
            1
         );

         place(
            $arrowB,
            0,
            0
         );
      }

      function render(elapsed) {
         if (elapsed < timing.exit) {
            const phase = easeOutCubic(
               clamp(elapsed / timing.exit)
            );

            const remaining = 1 - phase;

            drawLines(
               remaining,
               remaining,
               true
            );

            place(
               $arrowA,
               geometry.leftLength * remaining + geometry.tipOffset,
               1 - clamp((phase - 0.8) / 0.2)
            );

            place(
               $arrowB,
               0,
               0
            );

            return;
         }

         const phase = clamp(
            (elapsed - timing.exit) / timing.return
         );

         const startX = geometry.rightX + geometry.arrowWidth;

         const travel =
            geometry.width +
            geometry.homeX -
            startX;

         const tipX =
            startX +
            travel * easeInOutSine(phase);

         const opacity = clamp(phase * 10);

         place(
            $arrowA,
            tipX,
            opacity
         );

         place(
            $arrowB,
            tipX - geometry.width,
            opacity
         );

         drawLines(
            clamp(
               (tipX - geometry.width - geometry.tipOffset) /
               geometry.leftLength
            ),

            clamp(
               (tipX - geometry.tipOffset - geometry.rightX) /
               geometry.rightLength
            )
         );
      }

      function alignToLetter() {
         const scale = $block[0].clientWidth / geometry.width;

         if (!scale) return;

         const style = window.getComputedStyle(
            $title[0]
         );

         if (measure) {
            measure.font =
               `${style.fontWeight} ` +
               `${style.fontSize} ` +
               `${style.fontFamily}`;
         }

         const metrics = measure
            ? measure.measureText('В')
            : null;

         const descent =
            metrics?.actualBoundingBoxDescent || 0;

         const letterBottom =
            $baseline[0].getBoundingClientRect().top -
            $block[0].getBoundingClientRect().top +
            descent;

         centerY =
            letterBottom / scale -
            geometry.arrowHeight / 2;

         if (running) {
            render(progress);
         } else {
            reset();
         }
      }

      function play() {
         if (running || reducedMotion.matches) return;

         running = true;

         const start = performance.now();

         function frame(now) {
            progress = now - start;

            if (
               progress >= timing.exit + timing.return ||
               reducedMotion.matches
            ) {
               running = false;
               reset();

               return;
            }

            render(progress);

            requestAnimationFrame(frame);
         }

         frame(start);
      }

      // Инициализация
      reset();
      alignToLetter();

      // ResizeObserver
      const resizeObserver = new ResizeObserver(
         alignToLetter
      );

      resizeObserver.observe($block[0]);

      // После загрузки шрифтов
      if (document.fonts) {
         document.fonts.ready.then(alignToLetter);

         document.fonts.addEventListener(
            'loadingdone',
            alignToLetter
         );
      }

      // События
      $block.on('pointerenter', play);
      $title.on('click', play);
   });
});



window.VectorArtwork = (() => {
   'use strict';
   const instances = new WeakMap();
   const XLINK = 'http://www.w3.org/1999/xlink';
   let instanceId = 0;
   const defaults = {
      duration: 620, interval: 35, threshold: 0.65,
      repeatMin: 7000, repeatMax: 10000,
      amplitudeX: 18, amplitudeY: 12, smoothing: 140, trailDistance: 100,
   };
   const clamp = value => Math.max(-1, Math.min(1, value));


   /**
    * Image trail, по механике codepen.io/bigapplemonkey/pen/oNRodOJ.
    * Один пул из фотографий; движение/затухание выполняет Web Animations API.
    * Нет собственного бесконечного rAF, измерений картинок или новых узлов на mousemove.
    */
   function createPhotoTrail(scene, config) {
      const layer = scene.querySelector('[data-photo-trail]');
      const cards = layer ? Array.from(layer.children, node => {
         const image = node.querySelector('img');
         return {
            node, image, animations: [], token: 0, ready: false, active: false,
            naturalWidth: Number(image.getAttribute('width')),
            naturalHeight: Number(image.getAttribute('height')),
            width: 0, height: 0,
         };
      }) : [];
      let destroyed = false;
      let remainingCards = [];
      let previousCard = null;
      let order = 0;
      let anchored = false;
      let lastFactor = 0;
      // Каждое фото независимо получает наклон с вероятностью 40%.
      // Без повторяющихся серий; угол постоянен до исчезновения фотографии.
      function nextAngle() {
         if (Math.random() >= 0.4) return 0;
         return (15 + Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1);
      }
      const anchor = { x: 0, y: 0 };
      const cache = { x: 0, y: 0 };
      const supportsAnimation = cards.length && typeof cards[0].image.animate === 'function';

      cards.forEach(card => {
         const markReady = () => {
            if (!destroyed) card.ready = card.image.naturalWidth > 0;
         };
         if (card.image.complete) markReady();
         else if (card.image.decode) card.image.decode().then(markReady, () => { });
         else {
            card.onLoad = markReady;
            card.image.addEventListener('load', markReady, { once: true });
         }
      });
      function release(card) {
         card.token++;
         card.animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
         card.animations = [];
         card.active = false;
         card.node.style.visibility = 'hidden';
         card.node.style.removeProperty('will-change');
         card.image.style.removeProperty('will-change');
      }
      function reset() {
         cards.forEach(release);
         anchored = false;
         order = 0;
      }
      function resize(sceneScale) {
         // Общий масштаб сохраняет разницу в размерах исходных кадров.
         const factor = Math.min(1, sceneScale * 0.7) * 0.9;
         if (factor === lastFactor) return;
         lastFactor = factor;
         cards.forEach(card => {
            card.width = card.naturalWidth * factor;
            card.height = card.naturalHeight * factor;
            card.node.style.width = `${card.width}px`;
            card.node.style.height = `${card.height}px`;
         });
      }
      function spawn(x, y) {
         // На каждый проход перемешиваем готовые фотографии и выдаём их по одному разу.
         if (remainingCards.length === 0) {
            remainingCards = cards.filter(card => card.ready);
            const last = remainingCards.length - 1;
            for (let i = last; i > 0; i--) {
               const j = Math.floor(Math.random() * (i + 1));
               [remainingCards[i], remainingCards[j]] = [remainingCards[j], remainingCards[i]];
            }
            // Следующий проход не начинается с фотографии, которая только что появилась.
            if (last > 0 && remainingCards[last] === previousCard) {
               const j = Math.floor(Math.random() * last);
               [remainingCards[last], remainingCards[j]] = [remainingCards[j], remainingCards[last]];
            }
         }
         const card = remainingCards.pop();
         if (!card) return false;
         previousCard = card;
         release(card);
         const token = card.token;
         const angle = nextAngle();
         const fromX = cache.x - card.width / 2;
         const fromY = cache.y - card.height / 2;
         const toX = x - card.width / 2;
         const toY = y - card.height / 2;
         card.active = true;
         card.node.style.visibility = 'visible';
         card.node.style.zIndex = String(++order);
         card.node.style.willChange = 'transform';
         card.image.style.willChange = 'transform, opacity';
         const movement = card.node.animate([
            { transform: `translate3d(${fromX}px, ${fromY}px, 0) rotate(${angle}deg)` },
            { transform: `translate3d(${toX}px, ${toY}px, 0) rotate(${angle}deg)` },
         ], { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' });
         const fade = card.image.animate([{ opacity: 1 }, { opacity: 0 }], {
            delay: 400, duration: 1000, easing: 'cubic-bezier(0.5, 1, 0.89, 1)', fill: 'both',
         });
         const shrink = card.image.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.2)' }], {
            delay: 400, duration: 1000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both',
         });
         card.animations = [movement, fade, shrink];
         fade.onfinish = () => {
            if (destroyed || card.token !== token) return;
            release(card);
            if (!cards.some(item => item.active)) order = 0;
         };
         return true;
      }
      function update(x, y, delta) {
         if (!supportsAnimation || destroyed) return;
         if (!anchored) {
            anchor.x = cache.x = x;
            anchor.y = cache.y = y;
            anchored = true;
            return;
         }
         // 0.1 при 60 Гц, как в референсе; скорость не зависит от частоты монитора.
         const follow = 1 - Math.pow(0.9, delta / (1000 / 60));
         cache.x += (x - cache.x) * follow;
         cache.y += (y - cache.y) * follow;
         if (Math.hypot(x - anchor.x, y - anchor.y) > config.trailDistance && spawn(x, y)) {
            anchor.x = x;
            anchor.y = y;
         }
      }
      function dispose() {
         destroyed = true;
         reset();
         cards.forEach(card => {
            if (card.onLoad) card.image.removeEventListener('load', card.onLoad);
         });
      }
      return { resize, update, reset, leave: () => { anchored = false; }, dispose };
   }

   function mount(scene, options = {}) {
      if (instances.has(scene)) return instances.get(scene);
      const config = Object.assign({}, defaults, options);
      const trail = createPhotoTrail(scene, config);
      const pattern = scene.querySelector('.vector-scene__pattern');
      const phrase = scene.querySelector('[data-scramble]');
      if (!pattern || !phrase) { trail.dispose(); return () => { }; }
      const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      const mousePreference = window.matchMedia('(hover: hover) and (pointer: fine)');
      const cleanups = [];
      const sourceIds = new Map();
      const prefix = `vector-artwork-${++instanceId}`;

      // Уникальные ID позволяют размещать несколько блоков на одной странице.
      scene.querySelectorAll('[data-source]').forEach(node => {
         const key = node.getAttribute('data-source');
         node.id = `${prefix}-${key}`;
         sourceIds.set(key, `#${node.id}`);
      });
      function reference(node, href) {
         node.setAttribute('href', href);
         // Совместимость с движками, использующими xlink для SVG <use>.
         node.setAttributeNS(XLINK, 'xlink:href', href);
      }
      const glyphs = Array.from(phrase.querySelectorAll('[data-glyph]'), node => {
         const key = `letter-${node.getAttribute('data-glyph')}`;
         const href = sourceIds.get(key);
         reference(node, href);
         const box = node.getBBox(); // Единственное измерение буквы, при инициализации.
         return { node, href, box, previous: -1, locked: false, variants: [] };
      });
      const pool = [0, 4, 1, 2, 5, 9].map(index => glyphs[index]);
      for (let index = 0; index < 6; index++) {
         pool.push({
            href: sourceIds.get(`extra-${index}`),
            box: { x: 0, y: 0, width: 100, height: 100 },
         });
      }
      // Все матрицы готовятся один раз. Контуры d во время анимации не меняются.
      glyphs.forEach(glyph => {
         glyph.variants = pool.map(source => {
            const sx = glyph.box.width / source.box.width;
            const sy = glyph.box.height / source.box.height;
            const tx = glyph.box.x - source.box.x * sx;
            const ty = glyph.box.y - source.box.y * sy;
            return { href: source.href, transform: `matrix(${sx} 0 0 ${sy} ${tx} ${ty})` };
         });
      });
      const ordered = glyphs.slice().sort((a, b) => {
         const rowA = a.box.y + a.box.height / 2 < 500 ? 0 : 1;
         const rowB = b.box.y + b.box.height / 2 < 500 ? 0 : 1;
         return rowA - rowB || a.box.x - b.box.x;
      });
      ordered.forEach((glyph, index) => {
         glyph.lockAt = config.duration * (0.25 + 0.75 * (index + 1) / ordered.length);
      });

      let scrambleFrame = 0;
      let played = false;
      let disposed = false;
      let phraseVisible = false;
      let repeatTimer = 0;
      let observer = null;
      let resizeObserver = null;
      let visible = true;

      function clearRepeat() {
         clearTimeout(repeatTimer);
         repeatTimer = 0;
      }
      function canScramble() {
         return !disposed && visible && phraseVisible && !document.hidden && !motionPreference.matches;
      }
      function scheduleRepeat() {
         clearRepeat();
         if (!canScramble()) return;
         const delay = config.repeatMin + Math.random() * (config.repeatMax - config.repeatMin);
         repeatTimer = window.setTimeout(() => {
            repeatTimer = 0;
            playScramble();
         }, delay);
      }

      function restore(glyph) {
         if (glyph.locked) return;
         reference(glyph.node, glyph.href);
         glyph.node.removeAttribute('transform');
         glyph.locked = true;
      }
      function finishScramble() {
         cancelAnimationFrame(scrambleFrame);
         scrambleFrame = 0;
         glyphs.forEach(restore);
      }
      function playScramble() {
         if (!canScramble() || scrambleFrame) return;
         clearRepeat();
         played = true;
         glyphs.forEach(glyph => { glyph.locked = false; glyph.previous = -1; });
         const start = performance.now();
         let lastTick = -config.interval;
         function frame(now) {
            scrambleFrame = 0;
            const elapsed = now - start;
            if (elapsed >= config.duration || motionPreference.matches) {
               finishScramble();
               scheduleRepeat();
               return;
            }
            if (elapsed - lastTick >= config.interval) {
               lastTick = elapsed;
               const available = pool.map((_, index) => index);
               ordered.forEach(glyph => {
                  if (glyph.locked) return;
                  if (elapsed >= glyph.lockAt) { restore(glyph); return; }
                  const choices = available.filter(index =>
                     pool[index].href !== glyph.href && index !== glyph.previous);
                  const index = choices[Math.floor(Math.random() * choices.length)];
                  available.splice(available.indexOf(index), 1);
                  const variant = glyph.variants[index];
                  reference(glyph.node, variant.href);
                  glyph.node.setAttribute('transform', variant.transform);
                  glyph.previous = index;
               });
            }
            scrambleFrame = requestAnimationFrame(frame);
         }
         frame(start);
      }

      // Параллакс: события только запоминают координаты, один rAF выполняет запись.
      const current = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };
      const cursor = { x: 0, y: 0 };
      let parallaxFrame = 0;
      let lastTime = 0;
      let inside = false;
      let pointerDirty = false;
      let boundsDirty = true;
      let bounds = null;
      let scale = 1;
      const canMove = () => mousePreference.matches && !motionPreference.matches;

      function resetParallax() {
         cancelAnimationFrame(parallaxFrame);
         parallaxFrame = 0;
         lastTime = 0;
         inside = pointerDirty = false;
         current.x = current.y = target.x = target.y = 0;
         pattern.style.removeProperty('transform');
         pattern.style.removeProperty('will-change');
         trail.reset();
      }
      function scheduleParallax() {
         if (parallaxFrame || !canMove() || !visible) return;
         lastTime = 0;
         parallaxFrame = requestAnimationFrame(moveParallax);
      }
      function moveParallax(now) {
         parallaxFrame = 0;
         if (!canMove() || !visible) { resetParallax(); return; }
         // Чтение геометрии — до записей и только после её изменения/входа мыши.
         if (inside && pointerDirty) {
            if (boundsDirty || !bounds) {
               bounds = scene.getBoundingClientRect();
               boundsDirty = false;
               scale = Math.min(bounds.width / 1920, bounds.height / 970);
               trail.resize(scale);
            }
            if (bounds.width && bounds.height) {
               target.x = -clamp((cursor.x - bounds.left) / bounds.width * 2 - 1) * config.amplitudeX;
               target.y = -clamp((cursor.y - bounds.top) / bounds.height * 2 - 1) * config.amplitudeY;
            }
            pointerDirty = false;
         }
         const delta = lastTime ? Math.min(now - lastTime, 64) : 1000 / 60;
         lastTime = now;
         if (inside && bounds) trail.update(cursor.x - bounds.left, cursor.y - bounds.top, delta);
         const ease = 1 - Math.exp(-delta / config.smoothing);
         current.x += (target.x - current.x) * ease;
         current.y += (target.y - current.y) * ease;
         const settled = Math.hypot(target.x - current.x, target.y - current.y) < 0.02;
         if (settled) { current.x = target.x; current.y = target.y; }
         if (current.x === 0 && current.y === 0 && !inside) {
            pattern.style.removeProperty('transform');
            pattern.style.removeProperty('will-change');
         } else {
            // Отдельный слой: SVG-буквы и их контуры здесь не затрагиваются.
            if (pattern.style.willChange !== 'transform') pattern.style.willChange = 'transform';
            pattern.style.transform = `translate3d(${current.x * scale}px, ${current.y * scale}px, 0)`;
         }
         if (!settled) parallaxFrame = requestAnimationFrame(moveParallax);
      }

      function listen(targetNode, type, handler, options) {
         targetNode.addEventListener(type, handler, options);
         cleanups.push(() => targetNode.removeEventListener(type, handler, options));
      }
      function listenMedia(query, handler) {
         if (query.addEventListener) listen(query, 'change', handler);
         else {
            query.addListener(handler);
            cleanups.push(() => query.removeListener(handler));
         }
      }
      const hasPointer = 'PointerEvent' in window;
      function onMove(event) {
         if (!canMove() || (hasPointer && event.pointerType !== 'mouse')) return;
         if (!inside) boundsDirty = true;
         inside = pointerDirty = true;
         cursor.x = event.clientX;
         cursor.y = event.clientY;
         scheduleParallax();
      }
      listen(scene, hasPointer ? 'pointermove' : 'mousemove', onMove, { passive: true });
      listen(scene, hasPointer ? 'pointerleave' : 'mouseleave', () => {
         inside = pointerDirty = false;
         trail.leave();
         target.x = target.y = 0;
         scheduleParallax();
      });
      // Направление определяем без измерения DOM. Один повтор на проход вверх;
      // мелкие колебания тачпада (<24 px) не считаются новым проходом.
      let scrollY = window.scrollY;
      let scrollDirection = 0;
      let scrollTravel = 0;
      let upwardHandled = false;
      listen(window, 'scroll', () => {
         boundsDirty = true;
         const y = window.scrollY;
         const delta = y - scrollY;
         scrollY = y;
         if (!delta) return;
         const direction = delta > 0 ? 1 : -1;
         if (direction !== scrollDirection) { scrollDirection = direction; scrollTravel = 0; }
         scrollTravel += Math.abs(delta);
         if (scrollTravel >= 24) {
            if (direction > 0) upwardHandled = false;
            else if (!upwardHandled && canScramble()) {
               upwardHandled = true;
               playScramble();
            }
         }
         if (!observer) scheduleVisibilityCheck();
      }, { passive: true, capture: true });
      function onResize() {
         boundsDirty = true;
         if (inside) { pointerDirty = true; scheduleParallax(); }
         if (!observer) scheduleVisibilityCheck();
      }
      if ('ResizeObserver' in window) {
         resizeObserver = new ResizeObserver(onResize);
         resizeObserver.observe(scene);
      } else listen(window, 'resize', onResize, { passive: true });

      function updateVisibility(nextVisible, nextPhraseVisible) {
         const entered = nextPhraseVisible && !phraseVisible;
         visible = nextVisible;
         phraseVisible = nextPhraseVisible;
         if (!visible) resetParallax();
         if (!canScramble()) {
            clearRepeat();
            finishScramble();
         } else if (entered && (!played || scrollDirection < 0)) {
            if (scrollDirection < 0) upwardHandled = true;
            playScramble();
         } else if (!repeatTimer && !scrambleFrame) scheduleRepeat();
      }
      // Fallback: одно измерение за кадр только при scroll / resize.
      let visibilityFrame = 0;
      function scheduleVisibilityCheck() {
         if (visibilityFrame || disposed) return;
         visibilityFrame = requestAnimationFrame(() => {
            visibilityFrame = 0;
            const box = phrase.getBoundingClientRect();
            const sceneBox = scene.getBoundingClientRect();
            const right = document.documentElement.clientWidth;
            const bottom = document.documentElement.clientHeight * 0.92;
            const area = Math.max(0, Math.min(box.right, right) - Math.max(box.left, 0)) *
               Math.max(0, Math.min(box.bottom, bottom) - Math.max(box.top, 0));
            const ratio = box.width && box.height ? area / (box.width * box.height) : 0;
            updateVisibility(sceneBox.bottom > 0 && sceneBox.top < bottom,
               ratio > 0 && ratio >= config.threshold);
         });
      }
      if ('IntersectionObserver' in window) {
         observer = new IntersectionObserver(entries => {
            let nextVisible = visible;
            let nextPhraseVisible = phraseVisible;
            entries.forEach(entry => {
               if (entry.target === scene) {
                  nextVisible = entry.isIntersecting;
               } else {
                  nextPhraseVisible = entry.isIntersecting && entry.intersectionRatio >= config.threshold;
               }
            });
            updateVisibility(nextVisible, nextPhraseVisible);
         }, { threshold: [0, config.threshold], rootMargin: '0px 0px -8% 0px' });
         observer.observe(scene);
         observer.observe(phrase);
      } else scheduleVisibilityCheck();
      function preferenceChanged() {
         resetParallax();
         clearRepeat();
         if (motionPreference.matches) finishScramble();
         else if (canScramble()) {
            if (!played) playScramble();
            else scheduleRepeat();
         }
      }
      listenMedia(motionPreference, preferenceChanged);
      listenMedia(mousePreference, resetParallax);
      listen(window, 'blur', resetParallax);
      listen(window, 'pagehide', () => {
         clearRepeat();
         resetParallax();
         if (played) finishScramble();
      });
      listen(window, 'pageshow', () => {
         if (played) scheduleRepeat();
      });
      listen(document, 'visibilitychange', () => {
         if (document.hidden) {
            clearRepeat();
            resetParallax();
            if (played) finishScramble();
         } else if (canScramble()) {
            if (!played) playScramble();
            else scheduleRepeat();
         }
      });
      function dispose() {
         disposed = true;
         clearRepeat();
         cancelAnimationFrame(visibilityFrame);
         finishScramble();
         resetParallax();
         if (observer) observer.disconnect();
         if (resizeObserver) resizeObserver.disconnect();
         cleanups.forEach(cleanup => cleanup());
         trail.dispose();
         instances.delete(scene);
      }
      instances.set(scene, dispose);
      return dispose;
   }
   return { mount };
})();
document.querySelectorAll('[data-vector-scene]').forEach(scene => VectorArtwork.mount(scene));





(() => {
   const button = document.querySelector('[data-magnetic-button]');

   if (!button) return;

   const config = {
      pull: 0.6,
      rotation: 0.07,
      radius: 0.5,
      followDuration: 300,
      returnDuration: 700
   };

   const zone = button.closest('[data-magnet-zone]');
   const anchor = button.closest('[data-magnet-anchor]');
   const label = button.querySelector('.team-button__label');
   const surface = button.querySelector('.team-button__surface');

   if (!zone || !anchor || !label || !surface) return;

   const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
   const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

   const position = {
      x: 0,
      y: 0,
      r: 0
   };

   const pointer = {
      x: 0,
      y: 0
   };

   let frame = 0;
   let tween = null;
   let bounds = null;

   let dirtyBounds = true;
   let dirtyPointer = false;
   let insideZone = false;
   let active = false;

   const power2Out = t => 1 - Math.pow(1 - t, 3);

   const elasticOut = t =>
      t === 0 || t === 1
         ? t
         : 1 +
         Math.pow(2, -10 * t) *
         Math.sin((t - 0.075) * (2 * Math.PI) / 0.3);


   function updateTween(now) {
      if (!tween) return;

      const progress = Math.max(
         0,
         Math.min(
            1,
            (now - tween.start) / tween.duration
         )
      );

      const ratio = tween.ease(progress);

      ['x', 'y', 'r'].forEach(key => {
         position[key] =
            tween.from[key] +
            (tween.to[key] - tween.from[key]) * ratio;
      });

      if (progress === 1) {
         tween = null;
      }
   }


   function startTween(to, duration, ease, now) {
      tween = {
         from: { ...position },
         to,
         duration,
         ease,
         start: now
      };
   }


   function setActive(next) {
      if (active === next) return;

      active = next;

      button.classList.toggle('is-magnetic', active);

      if (active) {
         const contour = Array.from(
            { length: 4 },
            () => 35 + Math.floor(Math.random() * 11) * 3
         );

         const [a, b, c, d] = contour;

         surface.style.borderRadius =
            `${a}% ${100 - a}% ${b}% ${100 - b}% / ` +
            `${c}% ${d}% ${100 - d}% ${100 - c}%`;

      } else {
         surface.style.removeProperty('border-radius');
      }
   }


   function startReturn(now) {
      updateTween(now);

      setActive(false);

      startTween(
         {
            x: 0,
            y: 0,
            r: 0
         },
         config.returnDuration,
         elasticOut,
         now
      );
   }


   function requestFrame() {
      if (!frame) {
         frame = requestAnimationFrame(render);
      }
   }


   function render(now) {
      frame = 0;

      updateTween(now);


      // Вычисляем движение только внутри animation frame
      if (dirtyPointer && insideZone) {

         if (dirtyBounds || !bounds) {
            bounds = anchor.getBoundingClientRect();
            dirtyBounds = false;
         }

         const angle = position.r * Math.PI / 180;

         const cos = Math.abs(Math.cos(angle));
         const sin = Math.abs(Math.sin(angle));

         const extraX =
            (bounds.width * cos +
               bounds.height * sin -
               bounds.width) / 2;

         const extraY =
            (bounds.width * sin +
               bounds.height * cos -
               bounds.height) / 2;


         const dx =
            pointer.x -
            bounds.left -
            bounds.width / 2 -
            position.x +
            extraX;

         const dy =
            pointer.y -
            bounds.top -
            bounds.height / 2 -
            position.y +
            extraY;


         const inRange =
            Math.hypot(dx, dy) <
            bounds.width * config.radius;


         if (inRange) {

            setActive(true);

            startTween(
               {
                  x: dx * config.pull,
                  y: dy * config.pull,
                  r: dx * config.rotation
               },
               config.followDuration,
               power2Out,
               now
            );

         } else if (active) {

            startReturn(now);
         }


         dirtyPointer = false;
      }


      if (!tween && !active) {

         button.style.removeProperty('transform');
         button.style.removeProperty('will-change');

         label.style.removeProperty('transform');
         surface.style.removeProperty('transform');

      } else {

         button.style.willChange = 'transform';

         button.style.transform =
            `translate3d(${position.x}px, ${position.y}px, 0)
             rotate(${position.r}deg)`;

         label.style.transform =
            `rotate(${-position.r}deg)`;

         surface.style.transform =
            `rotate(${-position.r}deg)`;
      }


      if (tween) {
         frame = requestAnimationFrame(render);
      }
   }


   function onMove(event) {

      if (
         event.pointerType !== 'mouse' ||
         !finePointer.matches ||
         reducedMotion.matches
      ) {
         return;
      }


      if (!insideZone) {
         dirtyBounds = true;
      }


      insideZone = true;
      dirtyPointer = true;

      pointer.x = event.clientX;
      pointer.y = event.clientY;

      requestFrame();
   }


   function release() {

      insideZone = false;
      dirtyPointer = false;

      if (active) {
         startReturn(performance.now());
      }

      requestFrame();
   }


   function invalidateBounds() {

      dirtyBounds = true;

      if (insideZone) {
         dirtyPointer = true;
         requestFrame();
      }
   }


   zone.addEventListener(
      'pointermove',
      onMove,
      { passive: true }
   );

   zone.addEventListener(
      'pointerleave',
      release,
      { passive: true }
   );

   window.addEventListener(
      'scroll',
      invalidateBounds,
      {
         passive: true,
         capture: true
      }
   );

   window.addEventListener(
      'resize',
      invalidateBounds,
      { passive: true }
   );

})();



document.addEventListener('DOMContentLoaded', () => {
   const reviewsSwiper = new Swiper('.reviews__slider', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      speed: 400,
      autoHeight: true,
      effect: 'creative',
      creativeEffect: {
         prev: {
            translate: ['-20%', 0, -300],
            opacity: 0,
            scale: 0.9,
         },
         next: {
            translate: ['20%', 0, -300],
            opacity: 0,
            scale: 0.9,
         },
      },
   });

   const reviewsSection = document.querySelector('.reviews');
   const reviewsSlider = document.querySelector('.reviews__slider');
   const nextBtn = document.querySelector('.reviews__slider-next');
   const prevBtn = document.querySelector('.reviews__slider-prev');
   const headerOffset = 80;
   let isNavigating = false;

   const changeSlide = (direction) => {
      if (isNavigating) return;

      const switchSlide = () => {
         if (direction === 'next') {
            reviewsSwiper.slideNext();
         } else {
            reviewsSwiper.slidePrev();
         }
         isNavigating = false;
      };

      if (window.innerWidth > 999 || !reviewsSlider) {
         isNavigating = true;
         switchSlide();
         return;
      }

      const rect = reviewsSlider.getBoundingClientRect();

      if (rect.top < headerOffset) {
         isNavigating = true;
         const targetY =
            window.scrollY + rect.top - headerOffset;

         if (window.lenis) {
            window.lenis.scrollTo(targetY, {
               duration: 0.6,
               onComplete: () => {
                  switchSlide();
               },
            });
         } else {
            window.scrollTo({
               top: targetY,
               behavior: 'smooth',
            });
            setTimeout(switchSlide, 600);
         }
      } else {
         isNavigating = true;
         switchSlide();
      }
   };

   nextBtn?.addEventListener('click', () => {
      changeSlide('next');
   });
   prevBtn?.addEventListener('click', () => {
      changeSlide('prev');
   });


   if (reviewsSection) {
      reviewsSection.addEventListener('click', (event) => {
         const toggleBtn = event.target.closest(
            '.reviews__slide-button.-toggle'
         );

         if (!toggleBtn) return;

         const slide = toggleBtn.closest('.reviews__slide');
         const slideText = slide.querySelector('.reviews__slide-text');
         const textWrapper = slide.querySelector(
            '.reviews__slide-text-wrapper'
         );

         if (!slideText || !textWrapper) return;
         const isOpen = slideText.classList.toggle('is-open');
         toggleBtn.classList.toggle('is-active', isOpen);
         const toggleBtnText = toggleBtn.querySelector('span');
         if (toggleBtnText) {
            toggleBtnText.textContent = isOpen
               ? 'Свернуть отзыв'
               : 'Показать весь отзыв';
         }
         slideText.style.maxHeight = isOpen
            ? textWrapper.scrollHeight + 'px'
            : '0px';
         const interval = setInterval(() => {
            reviewsSwiper.updateAutoHeight();
            if (
               window.lenis &&
               typeof window.lenis.resize === 'function'
            ) {
               window.lenis.resize();
            }
         }, 30);

         setTimeout(() => {
            clearInterval(interval);
            reviewsSwiper.updateAutoHeight();
            if (
               window.lenis &&
               typeof window.lenis.resize === 'function'
            ) {
               window.lenis.resize();
            }
         }, 600);
      });
   }
});


document.addEventListener('DOMContentLoaded', () => {
   const items = document.querySelectorAll('.services__item');

   if (!items.length) return;

   const closeAllItems = () => {
      items.forEach(item => {
         const textBlock = item.querySelector('.services__item-text');
         const textWrapper = item.querySelector('.services__item-text-wrapper');
         const firstParagraph = textWrapper ? textWrapper.querySelector('p') : null;
         const image = item.querySelector('.services__item-image');

         item.classList.remove('active');

         if (window.innerWidth <= 999) {
            if (firstParagraph) firstParagraph.style.maxHeight = '0px';
            if (image) image.style.maxHeight = '0px';
         } else {
            if (textBlock) textBlock.style.maxHeight = '0px';
         }
      });
   };

   items.forEach(item => {
      const textBlock = item.querySelector('.services__item-text');
      const textWrapper = item.querySelector('.services__item-text-wrapper');
      const firstParagraph = textWrapper ? textWrapper.querySelector('p') : null;
      const image = item.querySelector('.services__item-image');

      if (!textWrapper) return;

      const openItem = () => {
         const isMobile = window.innerWidth <= 999;

         if (isMobile) {
            items.forEach(el => {
               if (el !== item) {
                  el.classList.remove('active');

                  const fp = el.querySelector('.services__item-text-wrapper p');
                  const img = el.querySelector('.services__item-image');

                  if (fp) fp.style.maxHeight = '0px';
                  if (img) img.style.maxHeight = '0px';
               }
            });
         }

         item.classList.add('active');

         requestAnimationFrame(() => {
            if (isMobile) {
               if (firstParagraph) {
                  firstParagraph.style.maxHeight =
                     firstParagraph.scrollHeight + 'px';
               }

               if (image) {
                  image.style.maxHeight = '230px';
               }
            } else {
               if (textBlock) {
                  textBlock.style.maxHeight =
                     (textWrapper.scrollHeight + 40) + 'px';
               }
            }
         });
      };

      const closeItem = () => {
         const isMobile = window.innerWidth <= 999;

         item.classList.remove('active');

         if (isMobile) {
            if (firstParagraph) firstParagraph.style.maxHeight = '0px';
            if (image) image.style.maxHeight = '0px';
         } else {
            if (textBlock) textBlock.style.maxHeight = '0px';
         }
      };

      item.addEventListener('click', () => {
         if (window.innerWidth <= 999) {
            item.classList.contains('active')
               ? closeItem()
               : openItem();
         }
      });

      item.addEventListener('mouseenter', () => {
         if (window.innerWidth > 999) {
            openItem();
         }
      });

      item.addEventListener('mouseleave', () => {
         if (window.innerWidth > 999) {
            closeItem();
         }
      });
   });


   const lastItem = items[items.length - 1];

   window.addEventListener('scroll', () => {
      const rect = lastItem.getBoundingClientRect();

      if (rect.top <= 0) {
         closeAllItems();
      }
   }, { passive: true });


   window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 999;

      items.forEach(item => {
         if (!item.classList.contains('active')) return;

         const textBlock = item.querySelector('.services__item-text');
         const textWrapper = item.querySelector('.services__item-text-wrapper');
         const firstParagraph = textWrapper
            ? textWrapper.querySelector('p')
            : null;
         const image = item.querySelector('.services__item-image');

         if (isMobile) {
            if (textBlock) textBlock.style.maxHeight = 'unset';

            if (firstParagraph) {
               firstParagraph.style.maxHeight =
                  firstParagraph.scrollHeight + 'px';
            }

            if (image) {
               image.style.maxHeight = '230px';
            }
         } else {
            if (firstParagraph) firstParagraph.style.maxHeight = 'unset';
            if (image) image.style.maxHeight = 'unset';

            if (textBlock && textWrapper) {
               textBlock.style.maxHeight =
                  (textWrapper.scrollHeight + 15) + 'px';
            }
         }
      });
   });
});

/******/ })()
;