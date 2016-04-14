import d3 from 'd3';
import Chart from './chart';

export default class GroupedBarChart extends Chart {
  /**
   * @constructor
   *
   * @param {el}
   * @return {void}
   */
  constructor(svg){
    super(svg);
    this.init();
  }
  /**
   * append group to svg
   *
   * @param {void}
   * @return {void}
   */
  init() {
    this.chart = this.svg.append('g')
      .attr('class', 'group grouped-bar-graph');
  }
  /**
   * create x scale for axis
   *
   * @param {void}
   * @return {void}
   */
  createScaleX(outter, inner) {
    let x = {};

    x.main = d3.scale.ordinal()
      .domain(outter)
      .rangeRoundBands([0, this.chartWidth], .3);

    x.bar = d3.scale.ordinal()
      .domain(inner)
      .rangeRoundBands([0, x.main.rangeBand()]);

    return x;
  }

  /**
   * create y scale for axis
   *
   * @param {number}
   * @return {obj} y-scale
   */
  createScaleY(max) {
    let y;
    y = d3.scale.linear()
      .range([this.chartHeight, 0]);

    y.domain([0, max]);

    return y;

  }

  /**
   * create axis
   *
   * @param {obj} scales
   * @return {obj} axis
   */
  createAxis(scales) {
    let axis = {};

    axis.y = d3.svg.axis()
      .scale(scales.y)
      .orient('left');

    axis.x = d3.svg.axis()
      .scale(scales.x.main)
      .orient('bottom');

    return axis;
  }
  /**
   * create cases for grouped bars
   *
   * @param {arra} bar-group data
   * @return {obj} x-axis scale
   */
  buildGroups(groups, xAxisScale) {
    groups = this.chart.selectAll('.age-group')
      .data(groups)
      .enter().append('g')
      .attr('class', 'age-group')
      .attr('transform', function(d) { return 'translate(' + xAxisScale(d[0].name) + ',0)'; });

    return groups;
  }

  /**
   * draw axis outline
   *
   * @param {obj} contains xy scales
   * @return {void}
   */
  buildChartOutline(axis) {
    this.chart
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('height', this.chartHeight)
      .attr('width', this.chartWidth);

    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (this.chartHeight + 10) + ')')
      .call(axis.x);

    this.chart.append('g')
      .attr('class', 'y axis')
      .call(axis.y);
  }
  /**
   * draw bars
   *
   * @param {obj} contains xy scales
   * @param {el} axis
   * @return {void}
   */
  buildBars(scales, groups) {
    groups.selectAll('rect')
      .data(function(d) { return d; })
      .enter().append('rect')
      .attr('class', function(d) {return d.sex;})
      .attr('width', scales.x.bar.rangeBand())
      .attr('x', function(d) { return scales.x.bar(d.sex); })
      .attr('y', function(d) { return scales.y(d.value); })
      .attr('height', (d) => { return this.chartHeight - scales.y(d.value); })
      .attr('fill', function(d) {return d.fill; });
  }
  /**
   * Get max value from nested arra
   *
   * @param {arra}
   * @return {number}
   */
  getMax(data) {
    return d3.max(
      data.map(function(arra) {
        return d3.max(
          arra.map(function(d) {
            return d.value;
          })
        );
      })
    );
  }
}