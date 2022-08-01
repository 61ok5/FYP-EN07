const Health = {};
const { locolla_query, query } = require('../db');

const db_ridelist = 'bc_1100_ridelist';
const db_ridelocation = 'ride_location';


Health.selectHealth = async function (weight, id) {
    var list = [];
    await Promise.all(id.map(async (elements) => {
        try {
            const stmt = `SELECT * 
            FROM  ${db_ridelocation}
            WHERE ${db_ridelocation}.ride_id = ${elements}`;
            const result = await query(stmt);
            console.log("this is try: ", result);
            list.push(calculation_rideID(weight, result));
        }
        catch {
            const stmt = `SELECT * 
            FROM  ${db_ridelist}
            WHERE ${db_ridelist}.id = ${elements}`;
            const result = await locolla_query(stmt);
            console.log("this is catch: ", result);
            list.push(calculation(weight, result));
        }
    }));
    return list;
}

function calculation_rideID(weight, result) {
    var pre_lon = result[0].lon;
    var pre_lat = result[0].lat;
    var distance = 0;
    const diff = Math.abs(result[0].created_at - result[result.length - 1].created_at);
    result.map((elements) => {
        const val = elements[0]
        distance = distanceCal(pre_lat, pre_lon, elements.lat, elements.lon) + distance;
        pre_lat = elements.lat;
        pre_lon = elements.lon;
    });

    const velocityInMPH = (diff == 0) ? 0 : (distance / (diff / 3600000));
    const mets = (velocityInMPH == 0) ? 0 : getMets(velocityInMPH);
    var calorie = weight * mets * 0.0175 * (diff / 60000);

    const json = {
        id: result[0].ride_id,
        userID: result[0].user_id,
        distance_In_meter: distance * 1000 / 0.621371,
        velocity_In_kph: velocityInMPH * 1.609344,
        velocity_In_mph: velocityInMPH,
        METs_value: mets,
        calorie: calorie,
        startTime: result[0].created_at,
        endTime: result[result.length - 1].created_at
    };
    return json;
}
function calculation(weight, result) {
    const locker_start_lat = result[0].start_lat;
    const locker_start_lon = result[0].start_lon;
    const locker_end_lat = result[0].end_lat;
    const locker_end_lon = result[0].end_lon;
    const phone_start_lat = result[0].lat;
    const phone_start_lon = result[0].lon;
    const phone_end_lat = result[0].end_phone_lat;
    const phone_end_lon = result[0].end_phone_lon;
    const locker_distance = distanceCal(locker_start_lat, locker_start_lon, locker_end_lat, locker_end_lon);
    const phone_distance = distanceCal(phone_start_lat, phone_start_lon, phone_end_lat, phone_end_lon);
    const diff = Math.abs(result[0].time_start - result[0].time_end);
    console.log(diff);
    const distance = (phone_distance == 0) ? locker_distance : phone_distance;
    const velocityInMPH = (diff == 0) ? 0 : (distance / (diff / 3600000));
    const mets = (velocityInMPH == 0) ? 0 : getMets(velocityInMPH);
    var calorie = weight * mets * 0.0175 * (diff / 60000);
    const json = {
        id: result[0].id,
        userID: result[0].user_id,
        distance_In_meter: distance * 1000 / 0.621371, //IN meters
        velocity_In_kph: velocityInMPH * 1.609344, // IN km/hr
        velocity_In_mph: velocityInMPH,
        METs_value: mets,
        calorie: calorie,
        startTime: result[0].time_start,
        endTime: result[0].time_end
    };
    return json;
}

function distanceCal(lat1, lon1, lat2, lon2) {
    if (lat1 == 0 || lon1 == 0 || lat2 == 0 || lon2 == 0 || lat1 == "" || lon1 == "" || lat2 == "" || lon2 == "") {
        return 0;
    }
    const R = 6371;
    const lantitude1 = lat1 * Math.PI / 180;
    const lantitude2 = lat2 * Math.PI / 180;
    const phi = (lat2 - lat1) * Math.PI / 180;
    const lambda = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(phi / 2) * Math.sin(phi / 2) +
        Math.cos(lantitude1) * Math.cos(lantitude2) *
        Math.sin(lambda / 2) * Math.sin(lambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 0.621371;
}

function getMets(mph) {
    return Math.abs(0.8857 * mph - 3.1143)
}
module.exports = Health;