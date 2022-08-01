var pointInPolygon = require('point-in-polygon');
const { query } = require('../db');

class District {
  constructor() {
    // const stmt = `SELECT district.*, district_coordinates.coordinates FROM district_coordinates INNER JOIN district ON district_coordinates.district_id = district.id WHERE type = 'district'`;
    // this.district_coord = query(stmt).then(result => {
    //   result = result.map(el => {
    //     el['category'] = JSON.parse(el['category']);
    //     const coords = JSON.parse(el['coordinates']);
    //     delete el['coordinates'];
    //     return { "info": { ...el }, "coordinates": coords };
    //   });
    //   this.district_coord = result;
    // });
  }

  coordToDistrict(lon, lat) {
    for (const dist_k in this.district_coord) {
      for (const polygon_k in this.district_coord[dist_k]['coordinates']) {
        if (pointInPolygon([lon, lat], this.district_coord[dist_k]['coordinates'][polygon_k])) {
          return this.district_coord[dist_k]['info'];
        }
      }
    }
    return;
  }
}

module.exports = District;