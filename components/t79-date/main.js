if(!window.t79) window.t79 = {}
if(!t79.date) t79.date = {}

t79.date.selections = {
  default : "local",
}

/**
 * the <tailor-date> component
 */
t79.date.T79Date = class extends HTMLElement{
  constructor(){
    super();
  }

  connectedCallback(){
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
    const shadowRoot = this.attachShadow({mode : "closed"})
    const timeSpan = document.createElement("span")
    const selections = t79.date.selections;
    timeSpan.innerText = this.utctime.setLocale().toLocaleString(luxon.DateTime[this.format])
    shadowRoot.append(timeSpan)
  }
}



customElements.define("t79-date", t79.date.T79Date);
