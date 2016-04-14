/**
 * Build the structure of Grouped Bar Data.
 *
 * @param {array} data
 * @param {obj} Filter key for data
 * @return {obj} containing two arrays
 */
export default function formatData(data, rowFilters, fills) {
  rowFilters.forEach(function(obj) {
    data = data.filter(function(row) {
      return row[obj.id] == obj.value;
    });
  });

  let obese = data.filter(function(row) { return row['metric'] == 'obese';});
  let overWeight =  data.filter(function(row) { return row['metric'] == 'overweight';});

  obese = isolateDataSections(obese, fills);
  overWeight = isolateDataSections(overWeight, fills);
  return {'obesity': obese, 'overweight': overWeight};
}
/**
 * Filters certain age groups out data
 * returns only the fields of interest
 *
 * @param {array}
 * @return {array}
 */
function isolateDataSections(arra, fills) {
  let data = ['8', '9', '10'].map(function(id) {
    return arra.filter(function(row){
      return row['age_group_id'] == id;
    });
  });
  return data.map(function(obj) {
    let arra = [];
    obj.forEach(function(innerObj) {
      ['1', '2'].forEach(function(sexType) {
        if(innerObj.sex_id == sexType) {
          let obj = {};
          obj.name = innerObj.age_group;
          obj.value = innerObj.mean * 100; // make it a percent %
          obj.sex = innerObj.sex;
          obj.metric = innerObj.metric;
          obj.fill = (sexType == 1 ? fills[0].fill.url() : fills[1].fill.url());
          arra.push(obj);
        }
      });
    });
    return arra;
  });
}

