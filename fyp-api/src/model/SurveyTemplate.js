const SurveyTemplate = {};
const { query } = require('../db');

SurveyTemplate.selectAll = async () => {
  const stmt = 'SELECT id, title, question_cnt, tag_weight, questions, updated_at FROM survey_template ORDER BY id';

  const rows = await query(stmt)

  return rows.map(el => {
    const { questions, ...rest } = el
    let questionsJson = [];
    try {
      questionsJson = JSON.parse(questions);
    } catch(ex) {
    }
    let phases = questionsJson.reduce((acc, cur) => {
      for(let key1 in cur) {
        if(key1.startsWith('questionText')) {
          acc.push(cur[key1]);
        } else if(key1.startsWith('options')) {
          for(let key2 in cur[key1]) {
            if(key2.startsWith('optionText')) {
              acc.push(cur[key1][key2]);
            }
          }
        }
      }
      return acc
    }, []);
    return {
      ...rest,
      tag_weight: JSON.parse(rest.tag_weight),
      phases,
    }
  });
};

SurveyTemplate.findById = async (id) => {
  const stmt = 'SELECT title, questions FROM survey_template WHERE id = ?';

  const result = await query(stmt, [id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return {...result[0], questions: JSON.parse(result[0].questions)};
};

const insertUpdateCommon = (data) => {
  const { title, questions } = data;
  const question_cnt = questions.length;

  let tag_weight = []  // consists array of {id: xx, sumWeight: yy}
  for(const question of questions) {
    for(const opt of question.options) {
      for(const tag of opt.tags) {
        const { id, weight } = tag;
        let t = tag_weight.find(el => el.id === id);
        if(t) {
          t.weight += weight;
        } else {
          tag_weight.push({id, weight});
        }
      }
    }
  }
  return { title, questions, question_cnt, tag_weight };
};

SurveyTemplate.create = async (data) => {
  const { title, questions, question_cnt, tag_weight } = insertUpdateCommon(data);

  const stmt = 'INSERT INTO survey_template (title, question_cnt, tag_weight, questions) VALUES (?, ?, ?, ?)'

  return await query(stmt, [title, question_cnt, JSON.stringify(tag_weight), JSON.stringify(questions)]);
};

SurveyTemplate.update = async (id, data) => {
  const { title, questions, question_cnt, tag_weight } = insertUpdateCommon(data);

  const stmt = 'UPDATE survey_template SET title=?, question_cnt=?, tag_weight=?, questions=?, updated_at=current_timestamp() WHERE id = ?'

  return await query(stmt, [title, question_cnt, JSON.stringify(tag_weight), JSON.stringify(questions), id]);
};

SurveyTemplate.delete = async (id) => {
  const stmt = 'DELETE FROM survey_template WHERE id=?'

  return await query(stmt, id);
};

module.exports = SurveyTemplate;
