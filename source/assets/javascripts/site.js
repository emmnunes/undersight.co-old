/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * Modified by Eduardo Nunes to use vanilla JS, instead of jQuery
 * http://www.undersight.co
 * ======================================================================== */
 //= require sizzle/dist/sizzle.js
 //= require pixi.js/dist/pixi.js
 //= require scrollmagic/scrollmagic/minified/ScrollMagic.min.js
 //= require helpers.js
 //= require thumbnails.js

// Use this variable to set up the common and page specific functions. If you
// rename this variable, you will also need to rename the namespace below.
const UNDERSIGHT = {
  // All pages
  'common': {
    init: function() {

    },
    finalize: function() {
      const links = Sizzle('a');

      links.forEach(function(el) {

        el.onclick = function(e) {
          e.preventDefault();
          const loader = Sizzle('.loader')[0];
          loader.className = "loader out";

          let href = el.getAttribute('href');
          setTimeout(function() {
            window.location = href;
          }, 400);
        }
      });

      setTimeout(function() {
        var controller = new ScrollMagic.Controller();
        const scrollables = Sizzle('.scrolling');

        scrollables.forEach(function(el) {

          new ScrollMagic.Scene({
              triggerElement: el,
              triggerHook: 0.9
            })
            .setClassToggle(el, 'visible')
          	.addTo(controller); // assign the scene to the controller
        });
      }, 600);

      return !!window.WebGLRenderingContext &&
        !!document.createElement('canvas').getContext(
            'experimental-webgl',
            {antialias: false});
    }
  },

  // Home page
  'index': {
    init: function() {

    },
    finalize: function() {
      window.onscroll = function() {
        let scrollPos = document.body.scrollTop;
        let opacity = scrollPos.map(0, 300, 1.000, 0.015);
        let transformY = scrollPos.map(0, 300, 0, 50);
        let rotateX = scrollPos.map(0, 300, 0, 2);
        let header = Sizzle('.index__header')[0];

        header.style.opacity = opacity;
        header.style.transform = "translateX(-50%) translateY(-" + transformY + "px) skewX(-" + rotateX + "deg)";
      };

      const elements = Sizzle('.project__thumbnail');
      elements.forEach(function(el) {
        setupThumbnails.circle.init(
          el,
          el.getAttribute('data-type'),
          el.getAttribute('data-background'),
          el.getAttribute('data-foreground'),
          el.getAttribute('data-orientation'),
          el.getAttribute('data-map')
        );
      });

      const loader = Sizzle('.loader')[0];

      setTimeout(function() {
        loader.className += " loaded";
      }, 100);
    }
  },

  // Project single page
  'project': {
    init: function() {
    },
    finalize: function() {
      const loader = Sizzle('.loader')[0];
      const projectContent = Sizzle('.project__wrapper')[0];
      const projectImages = Sizzle('.project__images')[0];

      setTimeout(function() {
        loader.className += " loading";
      }, 100);
      setTimeout(function() {
        projectContent.className += " visible";
        loader.className += " loaded";
      }, 2500);
      setTimeout(function() {
        projectImages.className += " visible";
      }, 3000);
    }
  }
};

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
const UTIL = {
  fire: function(func, funcname, args) {
    var fire;
    var namespace = UNDERSIGHT;
    funcname = (funcname === undefined) ? 'init' : funcname;
    fire = func !== '';
    fire = fire && namespace[func];
    fire = fire && typeof namespace[func][funcname] === 'function';

    if (fire) {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    // Fire common init JS
    UTIL.fire('common');

    // Fire page-specific init JS, and then finalize JS
    let bodyClasses = document.body.className.replace(/-/g, '_').split(/\s+/);
    bodyClasses.forEach(function(classnm) {
      UTIL.fire(classnm);
      UTIL.fire(classnm, 'finalize');
    });

    // Fire common finalize JS
    UTIL.fire('common', 'finalize');
  }
};

// Load Events
docReady(UTIL.loadEvents);
