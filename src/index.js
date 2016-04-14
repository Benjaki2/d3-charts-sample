import Visualization from './visualizations/visualization';
import groupedBarGraph from './visualizations/GroupedBarGraph';
import DOM from './dom/Dom';
import formatData from './dataFormatter';
import d3 from 'd3';
import Evemit from 'evemit';
import Spinner from 'spin';
// import textures from 'textures';

// keys
const rowfilters = [{'id': 'location_id', 'value': 102}, {'id': 'year', 'value': 2013}];
const xScalekey = ['15 to 19 yrs', '20 to 24 yrs', '25 to 29 yrs'];
const xGroupArra = ['male', 'female'];
const targetID = 'chart-case';

//modules
const ev = new Evemit();
const spinner = new Spinner();
const visualization = new Visualization(groupedBarGraph, [xScalekey, xGroupArra]);
const dom = new DOM(targetID);

// textures were ditched because they were hard on the eyes
// const femaleFill = textures.lines().orientation('3/8').size(6).strokeWidth(1).stroke('darkorange');
// const maleFill = textures.circles().size(10).radius(2);
const fills = [{'label':'male', 'fill': '#8A89A6'}, {'label':'female', 'fill': '#D0743C' }];


let data;

// Window OnLoad Inits DOM Class and starts spinner
window.onload = () => {
  let target = document.getElementById('spinner');
  spinner.spin(target);
};

// On Window Resize.. update()
dom.on('resize', function() {
  visualization.resize();
  visualization.updateData(data, visualization.dataType);
});

// After data loads...
// Spinner stops, toggle buttons are created
// Chart is created
ev.on('data-loaded', function(res, key){

  dom.init(targetID, 'obesity');

  data = formatData(res, rowfilters, fills); // make data global

  spinner.stop(); //remove spin

  visualization.init(targetID, fills);
  visualization.updateData(data, 'obesity');
});

// Update data on toggle
dom.on('toggle-data', function(key) {
  visualization.updateData(data, key);
  dom.toggleButtons(key);
});

// Pull data and emit when retrieved
d3.csv('/api/data.csv', function(error, res) {
  if (error) {
    throw error;
  }
  ev.emit('data-loaded', res);
});