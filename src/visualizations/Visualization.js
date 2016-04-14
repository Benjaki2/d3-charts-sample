import d3 from 'd3';

let barCache = {};

export default class Visualization  {
  /**
   * @constructor
   * @param {obj} chart module
   * @param {array} x scale key
   * @param {group} x scale key
   * @return {void}
   */
  constructor(vis, xScaleKey) {
    this.visType = vis;
    this.xScaleKey = xScaleKey;
  }

  /**
   * Appends a SVG and gives it dimensions
   *
   * @param {string} case for vizualization
   * @return {void}
   */
  init(caseID, fills) {
    let dimensions;

    this.vizCase = d3.select('#' + caseID);
    this.svg = this.vizCase.append('svg');
    this.svg.call(fills[0].fill);
    this.svg.call(fills[1].fill);

    dimensions = this.getDimensions(this.vizCase);
    this.setDimensions(this.svg, dimensions);
    this.renderChart(this.visType);
    this.createLegend(fills, dimensions[0]);
  }

  /**
   * Dimension Getter
   *
   * @param {el}
   * @return {array} Dimension array
   */
  getDimensions(el) {
    let width = parseFloat(el.style('width').replace(/px/, ''));
    let height = width * 0.6;

    return [width, height];
  }

  /**
   * Dimension Setter
   *
   * @param {el}
   * @param {array} width && height
   * @return {void}
   */
  setDimensions(el, dimensions) {
    el.attr('width', dimensions[0]).attr('height', dimensions[1]);
  }

  /**
   * Build Vizualization
   *
   * @param {obj} Vizualization Type module
   * @return {void}
   */
  renderChart(vizType) {
    this.viz = new vizType(this.svg);
  }

  /**
   * clears cache and
   * Sets new dimensions
   *
   * @param {void}
   * @return {void}
   */
  resize() {
    barCache = {};

    this.setDimensions(this.svg, this.getDimensions(this.vizCase));
    this.viz.getDimensions(this.viz.svg);
  }

  /**
   * create legends
   *
   * @param {array}
   * @param {string} width
   * @return {void}
   */
  createLegend(arra, width) {
    var legend = this.svg.selectAll('.legend')
      .data(arra.slice().reverse())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { return 'translate(0,' + i * 26 + ')'; });

    legend.append('rect')
      .attr('x', 90)
      .attr('y', 20)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', function(d){ return (d.fill.url()); });

    legend.append('text')
      .attr('x', 80)
      .attr('y', 30)
      .attr('dy', '.30em')
      .style('text-anchor', 'end')
      .text(function(d) { return d.label; });
  }
  /**
   *
   *
   * @param {obj} data
   * @param {string} obj key
   *
   * @return {void}
   */
  updateData(data, key) {
    let scales = {}, axis, groups;
    let chart = this.viz;

    this.dataType = key;

    if(!barCache[key]) {
      this.viz.chart.remove();
      this.viz.init();
      scales.y = chart.createScaleY(chart.getMax(data[key]));
      scales.x = chart.createScaleX(this.xScaleKey[0], this.xScaleKey[1]);
      axis = chart.createAxis(scales);

      groups = chart.buildGroups(data[key], scales.x.main);
      this.viz.buildChartOutline(axis);
      chart.buildBars(scales, groups);
      barCache[key] = this.chart;
    } else {
      this.viz.chart.remove();
      this.viz.chart = barCache[key];
      this.viz.svg.append(() => { return barCache[key].node();});
    }
  }
}