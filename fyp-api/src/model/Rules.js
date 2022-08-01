const Rules = {};
const { query } = require('../db');
const Helper = require('../util/helper');
const time = require('../util/time');

const db_rules = 'rules';

const parseSelectResult = (result) => {
  if (result.condition) result.condition = JSON.parse(result.condition).display;
  if (result.action) {
    const actionJson = JSON.parse(result.action);
    result.action = [actionJson['display_marks'], actionJson['display_catgroup'], actionJson['display_attribute']];
  }
  return result;
};

Rules.selectAll = async () => {
  const result = await query(`SELECT * FROM ${db_rules}`);
  return result.map(el => el = parseSelectResult(el));
};

Rules.findById = async (id) => {
  const result = await query(`SELECT * FROM ${db_rules} WHERE id = ?`, [id]);
  return parseSelectResult(result[0]);
};

const parseUpdateData = (data) => {
  data['input'] = JSON.stringify(data);
  const oprDisplay = (opr) => {
    switch (opr) {
      case "==":
        return "=";
      case "!=":
        return "≠";
      case ">=":
        return "≥";
      case "<=":
        return "≤";
      case "*":
        return "×";
      case "/":
        return "÷";
      default:
        return opr;
    }
  }

  // condition convertor
  if (data.metrics == 'no') {
    data.metrics = null;
    data.condition = null;
  } else {
    data.condition['factor1'] = '$' + data.metrics;
    if (["weekday", "weekend"].includes(data.condition['operator'])) {
      data.condition['display'] = `is ${data.condition['operator']}`;
      data.condition['factor2'] = 5;
      data.condition["modifier1"] = [{ "operator": "weekday" }];
      data.condition['operator'] = data.condition['operator'] == "weekday" ? "<" : ">=";
    } else {
      const unit = (data['metrics'] === "duration") ? " Seconds" : "";
      const factor2 = (data['metrics'] === "timestamp") ? time.convert(data.condition['factor2'], 'HH:mm') : data.condition['factor2'];
      data.condition['display'] = `${oprDisplay(data.condition['operator'])} ${factor2}${unit}`;
    }
    data.condition = JSON.stringify(data.condition);
  }

  // action convertor
  if (data.action['group']) {
    if (data.action['group'] === '{all}') {
      data.action['display_catgroup'] = "";
    } else if (data.action['group'] === '{n/a}') {
      data.action['display_catgroup'] = null;
    } else {
      data.action['display_catgroup'] = data.action['group'];
    }
  }

  if (data.action['attribute']) {
    if (data.action['attribute'] === '{all}') {
      data.action['display_attribute'] = "";
    } else if (data.action['attribute'] === '{n/a}') {
      data.action['display_attribute'] = null;
    } else {
      data.action['display_attribute'] = data.action['attribute'];
    }
  }

  if (data.action['value'] == '$marks') {
    data.action['value'] = data.action['modifier'][0]['value'];
    delete data.action['modifier'];
    data.action['display_marks'] = `${oprDisplay(data.action['operator'])} ${data.action['value']}`;
  } else {
    data.action['display_marks'] = `${oprDisplay(data.action['operator'])} (${data.action['value'].substring(1)} ${oprDisplay(data.action['modifier'][0]['operator'])} ${data.action['modifier'][0]['value']})`;
  }

  data.action = JSON.stringify(data.action);

  return [
    data.rule_name,
    data.data_source,
    data.metrics,
    data.condition,
    data.action,
    data.marks_upper_limit,
    data.input
  ];
};

Rules.create = async (data) => {
  const stmt = Helper.genInsert(db_rules, [
    'rule_name', 'data_source', 'metrics', 'condition', 'action', 'marks_upper_limit', 'input'
  ]);

  return await query(stmt, parseUpdateData(data));
};

Rules.update = async (data) => {
  const stmt = Helper.genUpdate(db_rules, [
    'rule_name', 'data_source', 'metrics', 'condition', 'action', 'marks_upper_limit', 'input'
  ]) + " WHERE id = ?";

  return await query(stmt, [...parseUpdateData(data), data.id]);
};

Rules.delete = async (id) => {
  const stmt = `DELETE FROM ${db_rules} WHERE id = ?`;

  return await query(stmt, id);
};

module.exports = Rules;
