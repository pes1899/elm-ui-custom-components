customElements.define('auto-complete', class extends HTMLElement {

  /* #region [Constructor] */

  constructor() {
    super();
    this._autocomplete = null;
    this._data = null;
    this._label = null;
    this._value = null;
    this._magicKey = null;
    this._inputNode = null;

    this._html =
      (label) =>
        `<div class="input-field">
          <i class="material-icons prefix">search</i>
          <input type="text" id="autocomplete-input" class="autocomplete">
          <label for="autocomplete-input">${label}</label>
        </div>`;

    /**
     * Debounce function.
     * Used for input event handler.
     * 
     * @param {number} delay Delay in ms.
     * @param {function} fn Function to debounce.
     */
    this._debounced = function (delay, fn) {
      let timerId;
      return function (...args) {
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
          fn(...args);
          timerId = null;
        }, delay);
      }
    }
  }

  /* #endregion [Constructor] */


  /* #region [Properties] */

  /**
   * Return autocomplete data.
   */
  get data() {
    return this._data;
  }


  /**
   * Sets and updates autocomplete data.
   */
  set data(value) {
    this._data = value;
    if (!value || value.length < 0) {
      return;
    }

    var update = {}
    for (var i = 0, len = value.length; i < len; i++) {
      update[value[i].text] = null;
    }

    this._autocomplete.updateData(update);
  }


  /**
   * Return label of autocomplete input.
   */
  get label() {
    return this._label;
  }


  /**
   * Sets label of autocomplete input.
   */
  set label(value) {
    this._label = value;
  }


  /**
   * Return value of autocomplete input.
   */
  get value() {
    return this._value;
  }


  /**
   * Sets value of autocomplete input.
   */
  set value(value) {
    this._value = value;
  }


  /**
   * Return magicKey of autocompleted item.
   */
  get magicKey() {
    return this._magicKey;
  }


  /**
   * Sets magicKey of autocompleted item.
   */
  set magicKey(value) {
    this._magicKey = value;
  }

  /* #endregion [Properties] */


  /* #region [Event handlers] */

  /**
   *  Event handler for autocomplete input.
   *  Sets value property and dispatches event.
   * 
   *  @param {object} Event arguments.
   */
  _on_input(e) {
    if (!(e && e.target && e.target.value)) {
      return;
    }

    this._value = e.target.value;
    var that = this
    function dispatch() {
      that.dispatchEvent(new CustomEvent("onInput"));
    }
    // Need to delay or Elm doesn't call view.
    window.setTimeout(dispatch, 1);
  };


  /**
   *  Event handler for autocompleted event.
   *  Sets magicKey property and dispatches event.
   * 
   *  @param {object} Event arguments.
   */
  _on_autocomplete(value) {
    this._magicKey = null;
    for (var i = 0, len = this.data.length; i < len; i++) {
      if (this.data[i].text === value) {
        this._magicKey = this.data[i].magicKey;
        break;
      }
    }

    if (!this._magicKey) {
      return;
    }

    var that = this
    function dispatch() {
      that.dispatchEvent(new CustomEvent("onAutocomplete"));
    }
    // Need to delay or Elm doesn't call view.
    window.setTimeout(dispatch, 1);
  };

  /* #endregion [Event handlers] */


  /* #region [Callback] */

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    // Set element innerHtml
    this.innerHTML = this._html(this.label);
    this._inputNode = this.querySelector("input");
    // Init autocomplete
    this._autocomplete = M.Autocomplete.init(this._inputNode, {
      onAutocomplete: this._on_autocomplete.bind(this)
    });

    // Set input eventhandler function
    this._inputNode.addEventListener("input", this._debounced(300, this._on_input.bind(this)), false);
  }

  /* #endregion [Callback] */
})