// HANDLE ADDING LISTENERS & BINDIGS
const attachActions = (elements, model, actionsMap, dispatcher) =>
  elements.forEach(el => {
    if (!el.id)
      throw new Error(`Error: 'Elements using data-on="..." are required to have valid id="...".'`);
    else if (!el.dataset.action)
      throw new Error(`Error: 'Elements using data-on="..." are required to have valid data-action="...".'`);

    const eventName = el.dataset.on;
    const funcName = el.dataset.action;
    const actionCb = actionsMap[funcName];

    el.addEventListener(eventName, function (e) {
      actionCb(e, model, dispatcher)
    })
  })

function mapStateToUi(elements, functionStore) {
  // TODO OPTIMALIZE selectors!
  elements.forEach((el) => {
    const dataStateProp = el.dataset.state
    // Is there script tag inserted?
    const script = el.querySelector("script")

    // If child is script tag
    if (script) {
      const parent = el
      // Pickup function with eval
      const f = eval(script.innerText)
      // We need to store function somewhere, to use it after render
      // Because this script tag will be overwritten
      functionStore[parent.id] = f
      // This element is rendered with function
      parent.dataset.stateF = true
      // render it straight away
      // parent.innerHTML = f(model[modelProp])
      // save script directly into element, cuz its erased now :(
      // parent.dataset.f = fStr
      // cache.funcs[modelProp] = f
    }
  })
}

function renderStateProps(elements, model, functionStore) {
  elements.forEach(el => {
    const dataStateProp = el.dataset.state;
    const dataStateFProp = el.dataset.stateF;
    const tagName = el.tagName.toLocaleLowerCase();

    if (
      tagName === 'input' ||
      tagName === 'select' ||
      tagName === 'textarea'
    ) {
      el.value = model[dataStateProp];
    }
    else if (dataStateFProp) {
      // Element has attached rendering function
      const f = functionStore[el.id];
      el.innerHTML = f(model[dataStateProp]);
    }
    else {
      // standart value-only binding, just bind it to innerHTML
      el.innerHTML = model[dataStateProp];
    }
  });
}

const initialize = (actions, initialState, handleStateChange, options) => {

  if (!window.DE) {
    // DEFINE MODEL/STATE
    let model = initialState;
    const cache = {
      funcs: {},
      listeners: {}
    }

    // CREATE DISPATCHER
    window.DE = function (event, data) {
      window.dispatchEvent(new CustomEvent('changeEvent', { detail: { event, payload: data } }));
    };

    const functionStore = {}

    // DO ONCE
    const scope = options ? option.scope : ''
    const dataStateElements = document.querySelectorAll(`${scope}*[data-state]`);
    const dataOnListners = document.querySelectorAll(`${scope}*[data-on]`)

    attachActions(dataOnListners, model, actions, window.DE);
    mapStateToUi(dataStateElements, functionStore);

    function changeState(e) {
      const { detail } = e;
      const { event, payload } = detail;
      const oldModel = Object.assign({}, model);
      // User's function passed
      model = handleStateChange(event, payload, oldModel);
      console.log(model)
      // Update all mapped states
      renderStateProps(dataStateElements, model, functionStore);
    }

    // DEFINE HOW IT WILL BE CHANGED ON EVENT DISPATCHED
    window.addEventListener('changeEvent', changeState)

    // Make first render after init
    window.onload = function () {
      renderStateProps(dataStateElements, initialState, functionStore);
    }
  }
}
