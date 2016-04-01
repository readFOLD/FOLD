var minWidthBeforeShrink = 435;
var minHeightBeforeShrink = 435;
var shrunkenWidth = 300;
var shrunkenHeight = 200;

var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};

var iterateOverFoldIFrames = function(cb){
  forEach(document.querySelectorAll('iframe[src*="//localhost:3000"]'), cb)
};

// from underscorejs.org
var throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

var resizeIFrames = function(){
  iterateOverFoldIFrames(function(i, iframe){
    iframe.style.maxHeight = '';
    iframe.style.maxWidth = '';
    if(iframe.offsetWidth < minWidthBeforeShrink || iframe.offsetHeight < minHeightBeforeShrink){
      iframe.style.maxHeight = shrunkenHeight + "px";
      iframe.style.maxWidth = shrunkenWidth + "px";
    }
  })
};

var throttledResize = throttle(resizeIFrames, 100);

window.addEventListener("load", function(event) {
  resizeIFrames();
  window.addEventListener('resize', throttledResize, true);
});
