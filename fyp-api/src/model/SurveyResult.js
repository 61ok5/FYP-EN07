const SurveyResult = {};
const { query } = require('../db');
const SurveyTemplate = require('../model/SurveyTemplate');

SurveyResult.create = async (data) => {
  const { userId, surveyId, result } = data;
  const { questions } = await SurveyTemplate.findById(surveyId);

  if(!questions) {
    throw `unable to find SurveyTemplate by id=${surveyId}`
  }

  let tagMarks = result.reduce((acc, cur) => {
    let question = questions.find(el => el.id === cur.id);
    if(question) {
      for(let idx of cur.selected) {
        for(let tag of question.options[idx].tags) { // with [{id: #, weight: #}]
          let tagMark = acc.find(el1 => el1.id === tag.id);
          if(tagMark) {
            tagMark.weight += tag.weight;
          } else {
            acc.push(tag);
          }
        }
      }
    } else {
      console.warn(`unable to find question id=${el.id} for surveyId=${surveyId}`);
    }
    return acc;
  }, []);

  const stmt = 'INSERT INTO survey_result (user_id, survey_id, tag_marks, data) VALUES (?, ?, ?, ?)'

  return await query(stmt, [userId, surveyId, JSON.stringify(tagMarks), JSON.stringify(result)]);
};

SurveyResult.selectAll = async function () {
  const stmt = `SELECT *
                  FROM survey_result`
                  
  const result = await query(stmt);
  return result;
}

module.exports = SurveyResult;
