const Model = require('./Model').default;

(() => {

  // ===== var
  const model = new Model;

  // ===== event
  let init = () => {
    model.init();
  }

  init();
})();
