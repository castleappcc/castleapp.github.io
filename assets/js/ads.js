/**
 * Castlee.cc Official Ad Slot & Monetization Manager (ads.js)
 * Lazy-loads responsive ad placements via IntersectionObserver to preserve Core Web Vitals (CLS/LCP).
 * Ready for Google AdSense / Custom Ad Network integration.
 */
(function () {
  'use strict';

  var AD_CONFIG = {
    enabled: true,
    adsenseClientId: '', // 예: 'ca-pub-XXXXXXXXXXXXXXXX' 입력 시 자동 전환
    slots: {
      'header-top': {
        label: '스폰서 안내',
        title: '캐슬앱(Castle App) 최신 한글 패치 및 초고화질 스트리밍 가이드',
        desc: '안드로이드 스마트폰·스마트TV·PC 환경별 최적화 설정법을 지금 바로 확인하세요.',
        cta: '설치 가이드 보기',
        href: 'castle-app-apk-download-install.html'
      },
      'in-content': {
        label: '추천 리소스',
        title: '끊김 없는 1080p·4K 재생을 위한 버퍼링 완벽 해결 매뉴얼',
        desc: 'DNS 최적화, 하드웨어 가속 설정 및 캐시 관리로 재생 속도를 최대 2배 향상하세요.',
        cta: '최적화 방법 확인',
        href: 'castle-app-buffering-error-fix.html'
      },
      'sidebar-box': {
        label: '필수 체크',
        title: 'APK 보안 검증 체크리스트',
        desc: '공식 배포 파일 해시 확인 및 안전한 권한 관리 가이드',
        cta: '보안 가이드 이동',
        href: 'castle-app-security-privacy-safety.html'
      },
      'footer-banner': {
        label: '파트너 안내',
        title: '스마트 TV 및 대화면 미러링 완벽 연동하기',
        desc: '크롬캐스트·파이어스틱·안드로이드 TV 리모컨 인터페이스 세팅 총정리',
        cta: 'TV 연동 보기',
        href: 'castle-app-smart-tv-firestick-guide.html'
      }
    }
  };

  function renderSlot(el) {
    if (!AD_CONFIG.enabled || el.dataset.adLoaded === 'true') return;
    el.dataset.adLoaded = 'true';

    var slotKey = el.getAttribute('data-ad-slot') || 'in-content';
    var item = AD_CONFIG.slots[slotKey] || AD_CONFIG.slots['in-content'];

    if (AD_CONFIG.adsenseClientId && window.adsbygoogle) {
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', AD_CONFIG.adsenseClientId);
      ins.setAttribute('data-ad-slot', el.getAttribute('data-adsense-id') || '');
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      el.innerHTML = '';
      el.appendChild(ins);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
      return;
    }

    el.innerHTML =
      '<div class="ad-slot-label">' + item.label + '</div>' +
      '<div class="ad-banner-box">' +
        '<div class="ad-banner-text">' +
          '<strong>' + item.title + '</strong>' +
          '<span>' + item.desc + '</span>' +
        '</div>' +
        '<a class="ad-banner-cta" href="' + item.href + '" rel="nofollow">' + item.cta + ' &rarr;</a>' +
      '</div>';
  }

  function initAds() {
    var adContainers = document.querySelectorAll('[data-ad-slot]');
    if (!adContainers.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            renderSlot(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '220px 0px' });

      adContainers.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      adContainers.forEach(renderSlot);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }
})();
