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
 //= require jquery/dist/jquery.min.js
 //= require pixi.js/dist/pixi.js
 //= require gsap/src/minified/TweenMax.min.js
 //= require scrollmagic/scrollmagic/minified/ScrollMagic.min.js
 //= require scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js
 //= require helpers.js
 //= require thumbnails.js

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  const UNDERSIGHT = {
    // All pages
    'common': {
      init: function() {
      },
      finalize: function() {
        const links = $('a');

        $('a').click(function(event) {
          var href = this.href;
          event.preventDefault();
          const loader = $('body');
          loader.addClass('out');

          setTimeout(function() {
            window.location = href;
          }, 400);
        });

        setTimeout(function() {
          var controller = new ScrollMagic.Controller();

          $('.scrolling').each(function(index) {
            new ScrollMagic.Scene({
                triggerElement: this,
                triggerHook: 0.9
              })
              .setTween(this, 0.1, {
                opacity: 1,
                y: "0px"
              })
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
          /*
          let scrollPos = document.body.scrollTop;
          let opacity = scrollPos.map(0, 200, 1.000, 0.015);
          let transformY = scrollPos.map(0, 200, 0, 50);
          let rotateX = scrollPos.map(0, 200, 0, 2);
          let header = $('.index__header');

          TweenMax.to(header, 0.1, {
            opacity: opacity,
            y: -transformY,
            rotateX: rotateX
          });
          */
        };

        $('.project__thumbnail').each(function(index) {
          setupThumbnails.circle.init(
            $(this),
            $(this).attr('data-type'),
            $(this).attr('data-background'),
            $(this).attr('data-foreground'),
            $(this).attr('data-orientation'),
            $(this).attr('data-map')
          );
        });

        const loader = $('body');

        setTimeout(function() {
          loader.addClass('loaded');
        }, 100);
      }
    },

    // Project single page
    'project': {
      init: function() {
      },
      finalize: function() {
        const loader = $('body.project');
        const projectContent = $('.project__wrapper');
        const projectImages = $('.project__images');

        setTimeout(function() {
          loader.addClass('loading');
        }, 100);
        setTimeout(function() {
          projectContent.addClass("visible");
          loader.addClass("loaded");
        }, 900);
        setTimeout(function() {
          projectImages.addClass("visible");
        }, 1400);
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
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
