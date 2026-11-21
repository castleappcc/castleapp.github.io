/**
 * Castlee.cc Interactive UI Controller (main.js)
 * Features: Hero Slider (auto-play, touch swipe, keyboard), Lazy-Loader, Category Filter, Mobile Nav
 */
(function () {
  'use strict';

  function initMobileNav() {
    var btn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  function initLazyImages() {
    var lazyImgs = document.querySelectorAll('img.lazy-img');
    if (!lazyImgs.length) return;

    function revealImage(img) {
      var dataSrc = img.getAttribute('data-src');
      if (dataSrc && img.getAttribute('src') !== dataSrc) {
        img.setAttribute('src', dataSrc);
      }
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('loaded');
        }, { once: true });
        img.addEventListener('error', function () {
          img.classList.add('loaded');
        }, { once: true });
      }
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '250px 0px' });

      lazyImgs.forEach(function (img) {
        io.observe(img);
      });
    } else {
      lazyImgs.forEach(revealImage);
    }
  }

  function initHeroSlider() {
    var slider = document.getElementById('heroSlider');
    if (!slider) return;

    var slides = slider.querySelectorAll('.slide-item');
    var dots = slider.querySelectorAll('.slider-dot');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    if (!slides.length) return;

    var current = 0;
    var timer = null;
    var touchStartX = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, idx) {
        s.classList.toggle('active', idx === current);
      });
      dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === current);
        d.setAttribute('aria-selected', idx === current ? 'true' : 'false');
      });
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5500);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        showSlide(current - 1);
        startAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        showSlide(current + 1);
        startAuto();
      });
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        showSlide(idx);
        startAuto();
      });
    });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 45) {
        showSlide(diff < 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    startAuto();
  }

  function initPostFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.post-card[data-category]');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        cards.forEach(function (card) {
          var match = (cat === 'all') || (card.getAttribute('data-category') === cat);
          card.style.display = match ? 'flex' : 'none';
        });
      });
    });
  }

  function init() {
    initMobileNav();
    initLazyImages();
    initHeroSlider();
    initPostFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
