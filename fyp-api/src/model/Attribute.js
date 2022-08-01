const Attribute = {};
const { query } = require('../db');
const Helper = require('../util/helper');

const db_attribute = 'attribute';
const db_attribute_option = 'attribute_option';

const parseSelectResult = (result, options) => {
  if (result) {
    result.options = (options.constructor === Array) ? options : options[result.id] ?? [];
  }
  return result;
};

const optionsMapping = options => options.reduce((acc, el) => {
  if (!acc[el.attribute_id]) acc[el.attribute_id] = [];
  acc[el.attribute_id].push(el);
  return acc;
}, {});

Attribute.selectAll = async () => {
  const result = await query(`SELECT * FROM ${db_attribute}`);
  const options = optionsMapping(await query(`SELECT * FROM ${db_attribute_option}`));
  return result.map(el => el = parseSelectResult(el, options));
};

Attribute.selectAllNonScalar = async () => {
  const result = await query(`SELECT * FROM ${db_attribute} WHERE is_scalar = 0`);
  const options = optionsMapping(await query(`SELECT * FROM ${db_attribute_option}`));
  return result.map(el => el = parseSelectResult(el, options));
};

Attribute.findById = async (id) => {
  const result = await query(`SELECT * FROM ${db_attribute} WHERE id = ?`, [id]);
  const options = await query(`SELECT * FROM ${db_attribute_option} WHERE attribute_id = ?`, [id]);
  return parseSelectResult(result[0], options);
};

const parseUpdateData = (data) => [
  data.name,
  data.description,
  data.unit,
  data.is_boolean,
  data.is_scalar,
  data.range_min,
  data.range_max,
];

const parseUpdateOptionData = (data, attribute_id) => (data.options && data.options.length) ? [data.options.map(el => [
  el.id,
  attribute_id ? attribute_id : data.id,
  el.value,
])] : [];

Attribute.create = async (data) => {
  const stmt = Helper.genInsert(db_attribute, [
    'name', 'description', 'unit', 'is_boolean', 'is_scalar', 'range_min', 'range_max'
  ]);
  const stmt_options = Helper.genMultiRowInsert(db_attribute_option, [
    'id', 'attribute_id', 'value'
  ]);

  const p1 = parseUpdateData(data);
  const result = await query(stmt, p1);

  const p2 = parseUpdateOptionData(data, result.insertId);
  if (p2.length) await query(stmt_options, p2);

  return result;
};

Attribute.update = async (data) => {
  const stmt = Helper.genUpdate(db_attribute, [
    'name', 'description', 'unit', 'is_boolean', 'is_scalar', 'range_min', 'range_max'
  ]) + " WHERE id = ?";
  const stmt_options = Helper.genMultiRowInsert(db_attribute_option, [
    'id', 'attribute_id', 'value'
  ], [
    'attribute_id', 'value'
  ]);

  const p1 = parseUpdateData(data);
  const result = await query(stmt, [...p1, data.id]);

  const p2 = parseUpdateOptionData(data);
  const reusedOptionsId = p2[0].reduce((acc, el) => {
    if (el[0]) acc.push(el[0]);
    return acc;
  }, []);
  await query(`DELETE FROM ${db_attribute_option} WHERE attribute_id = ? ${reusedOptionsId.length ? "AND id NOT IN (?)" : ""}`, [data.id, reusedOptionsId]);
  if (p2.length) await query(stmt_options, p2);

  return result;
};

Attribute.delete = async (id) => {
  return await query(`DELETE FROM ${db_attribute} WHERE id = ?`, [id]);
};

module.exports = Attribute;
