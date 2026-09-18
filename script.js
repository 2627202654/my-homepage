/* ==========================================================
 * 个人主页交互脚本（原生 JS，无第三方依赖）
 * 1. 页脚年份自动更新
 * 2. 移动端导航菜单开合
 * 3. 滚动时高亮当前区块对应的导航项（scroll spy）
 * ========================================================== */
(function () {
  'use strict';

  /* ---------- 1. 页脚年份 ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- 2. 移动端导航菜单 ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? '收起导航菜单' : '展开导航菜单');
    });

    // 点击任意导航链接后自动收起菜单
    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        closeMenu();
      }
    });

    // 点击菜单以外区域收起
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') &&
          !e.target.closest('.nav')) {
        closeMenu();
      }
    });
  }

  /* ---------- 3. 滚动高亮当前导航项 ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-link[href^="#"]')
  );
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + id
      );
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var visibleMap = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visibleMap[entry.target.id] = entry.isIntersecting;
        });

        // 优先选择页面中靠上且当前可见的区块
        var current = sections.find(function (sec) {
          return visibleMap[sec.id];
        });
        if (current) {
          setActive(current.id);
        }
      },
      {
        // 顶部固定导航占 64px，中部带状区域视为“当前”
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }
})();
