export default class Chart {
  constructor(svg) {
    this.svg = svg;
    this.dimensions = this.getDimensions(this.svg);
  }
  getDimensions(el) {

    let height = parseFloat(el.style('height').replace(/px/, ''));
    let width = parseFloat(el.style('width').replace(/px/, ''));

    this.margin = {top: 100, right: 40, bottom: 60, left: 40};
    this.chartWidth = width - this.margin.left - this.margin.right;
    this.chartHeight = height - this.margin.top - this.margin.bottom;
  }
}