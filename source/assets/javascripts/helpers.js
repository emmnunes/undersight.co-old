(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);

function parallax(args) {
    "init" == args.action && args.target.each(function() {
        var $this = $(this);
        if ($this.data("offsetTop", $this.offset().top), args.factor) var factor = args.factor;
        else var factor = .04;
        if (verge.inViewport($this)) {
            var min = .4,
                max = 1,
                normalizedScroll = (max - min) / (_customScroll.limit.y - 1) * (1 - _customScroll.limit.y) + max,
                aux = Number($this.attr("data-parallax") * $this[0].getBoundingClientRect().top * factor * normalizedScroll);
            TweenMax.to($this, .5, {
                y: aux,
                force3D: !0
            })
        }
    }), "normal" == args.action && args.target.each(function() {
        var $this = $(this);
        if (args.factor) var factor = args.factor;
        else var factor = .04;
        if (verge.inViewport($this)) {
            var min = .4,
                max = 1,
                normalizedScroll = (max - min) / (args.scroll.limit.y - 0) * (args.scroll.offset.y - args.scroll.limit.y) + max,
                aux = Number($this.attr("data-parallax") * $this[0].getBoundingClientRect().top * factor * normalizedScroll);
            TweenMax.to($this, .5, {
                y: aux,
                force3D: !0
            })
        }
    }), "reverse" == args.action && args.target.each(function() {
        var $this = $(this);
        if (args.factor) var factor = args.factor;
        else var factor = .04;
        if (verge.inViewport($this.parent())) {
            var aux = Number($this.attr("data-parallax") * $this[0].getBoundingClientRect().top * factor);
            TweenMax.to($this, .1, {
                y: -aux,
                force3D: !0
            })
        }
    }), "function" == typeof args.onComplete && args.onComplete()
}

function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}
