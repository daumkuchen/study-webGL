const TweenMax = require('gsap');
const Sample = require('./Sample').default;

(() => {

  // ===== var
  let sample = new Sample;

  // ===== init
  let init = () => {
    sample.init();
  }

  init();

})();
