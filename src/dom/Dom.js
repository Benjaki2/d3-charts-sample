import Evemit from 'evemit';
import d3 from 'd3';


export default class Dom extends Evemit {
  /**
   * @constructor
   *
   * @param {void}
   * @return {void}
   */
  constuctor() {}

  /**
   * sets window resize emitter
   *
   * @param {string} id for case
   * @param {el}  text for current Chart header
   * @return {void}
   */
  init(visCaseId, text) {
    this.visCase = this.appendCaseToBody(visCaseId);
    this.createHeader(this.visCase, text);
    this.buildToggle(this.visCase);
    window.onresize = () =>{ this.emit('resize');};
  }

  /**
   * Creates element in body
   *
   * @param {string} id & class
   * @return {el}
   */
  appendCaseToBody(id) {
    let body = document.getElementsByTagName('body')[0];
    let visCase = document.createElement('div');

    visCase.className = id;
    visCase.id = id;
    body.appendChild(visCase);
    return visCase;
  }
  /**
   * Creates header in case
   *
   * @param {el}
   * @param {string} text of the element
   * @return {void}
   */
  createHeader(el, text) {
    let chartHeader;

    chartHeader = document.createElement('h3');
    chartHeader.className = 'chart-header-text';
    chartHeader.innerHTML = text + ' (pct)';

    el.appendChild(chartHeader);
  }
  /**
   * Creats two toggle buttons
   *
   * @param {el}
   * @return {void}
   */
  buildToggle(el) {
    let btnObese, btnOverweight, buttonCase;

    buttonCase = document.createElement('div');
    buttonCase.className = 'toggle-btn-case';

    btnObese = document.createElement('button');
    btnObese.className = 'data-toggle-btn active';
    btnObese.id =  'obesity-btn';
    btnObese.innerHTML = 'Obesity';
    btnObese.onclick = (e) => this.emit('toggle-data',  'obesity');

    btnOverweight = document.createElement('button');
    btnOverweight.className = 'data-toggle-btn';
    btnOverweight.id =  'overweight-btn';
    btnOverweight.innerHTML = 'Overweight';
    btnOverweight.onclick = (e) => this.emit('toggle-data', 'overweight');

    buttonCase.appendChild(btnObese);
    buttonCase.appendChild(btnOverweight);

    el.appendChild(buttonCase);
  }

  /**
   * Toggle
   *
   * @param {string}
   * @return {void}
   */
  toggleButtons(key) {
    d3.select('.chart-header-text').text(key + ' (pct)');
    d3.selectAll('.data-toggle-btn').attr('class', 'data-toggle-btn');
    d3.selectAll('#' + key + '-btn').attr('class', 'data-toggle-btn active');
  }
}