if(!window.t79) window.t79 = {}
if(!t79.date) t79.date = {}

t79.date.selections = {
  default : "local",
}

t79.date.setZone = (sel, timeZone) => {
  t79.date.selections[sel] = timeZone;
  const t79s = [...document.getElementsByTagName("t79-date")];

  for(let t79 of t79s){
    t79.refresh();
  }
}

/**
 * the <t79-date> component
 */
t79.date.T79Date = class extends HTMLElement{
  constructor(){
    super();
  }

  connectedCallback(){
    this.refresh()
  }

  refresh(){
    this._checkUTCTimeSpecified()
    this._checkDatetimeFormat()
    this._setTimeVisual()
  }

  /**
   * returns the time as utc
   * @returns {luxon.DateTime}
   */
  get utctime(){
    const timestr = this.getAttribute("time-utc");
    if(!timestr){
      console.log(this); // log so people can easily find the mentioned component
      throw console.error("timestr attribute missing <tailor-date> component !")
    }
    return luxon.DateTime.fromISO(timestr);
  }

  /**
   * returns the current format, defaults to `DATETIME_SHORT`, but this may be overridden
   * with the attribute `format`
   *
   * see : https://moment.github.io/luxon/docs/manual/formatting#presets
   * for an entire list of formats available
   *
   * @returns {string} the required format
   */
  get format(){
    return this.getAttribute("format")||"DATETIME_SHORT";
  }

  get sel(){
    return this.getAttribute("sel")||"default";
  }


  _checkUTCTimeSpecified(){
    if(!this.utctime) console.error("UTC time must be specified !");
  }


  /**
   * this function exists to prevent xss attacks (since this is set via html), help in debugging
   */
  _checkDatetimeFormat(){
    const allowedFormats = ["DATE_SHORT","DATE_MED","DATE_MED_WITH_WEEKDAY","DATE_FULL","DATETIME_SHORT","TIME_SIMPLE","TIME_WITH_SECONDS","TIME_WITH_SHORT_OFFSET","TIME_WITH_LONG_OFFSET","TIME_24_SIMPLE","TIME_24_WITH_SECONDS","TIME_24_WITH_SHORT_OFFSET","TIME_24_WITH_LONG_OFFSET","DATETIME_SHORT","DATETIME_MED","DATETIME_FULL","DATETIME_HUGE","DATETIME_SHORT_WITH_SECONDS","DATETIME_MED_WITH_SECONDS","DATETIME_FULL_WITH_SECONDS","DATETIME_HUGE_WITH_SECONDS"]

    const format = this.getAttribute("format");

    if(format && !allowedFormats.includes(format)) {
      throw console.error(`unknown format ${format}`)
    }
  }

  _setTimeVisual(){
    let newShadowRoot = false;
    if(!this.shadowRoot) {
      newShadowRoot = true;
      this.attachShadow({mode : "open"})
    }
    if(!this.timeSpan) this.timeSpan = document.createElement("span")
    const selections = t79.date.selections;
    this.timeSpan.innerText = this.utctime.setZone(selections[this.sel]).toLocaleString(luxon.DateTime[this.format])
    if(newShadowRoot) this.shadowRoot.append(this.timeSpan)
  }
}


/**
 * the t79-date-set component
 */
t79.date.T79DateSet = class extends HTMLElement{
  connectedCallback(){
    t79.date.setZone(this.sel, this.timezone);
  }

  get sel(){
    return this.getAttribute("sel")||"default"
  }

  get timezone(){
    return this.getAttribute("timezone")
  }
}


customElements.define("t79-date", t79.date.T79Date);
customElements.define("t79-date-set", t79.date.T79DateSet);
