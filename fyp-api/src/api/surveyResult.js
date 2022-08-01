const express = require('express');
const router = express.Router();

const Permissions = require('../util/permission');
const SurveyResult = require('../model/SurveyResult');
const SurveyTemplate = require('../model/SurveyTemplate');

/**
 * @api {post} /surveyResult Insert survey record
 * @apiName InsertSurveyResult
 * @apiGroup Admin, User
 * @apiheader {String} Content-Type: application/json
 * @apiheader {String} Authorization Bearer &lt;TOKEN&gt;
 * @apiBody {JSON} data Submitted data in format {"surveyId": #, "result": [{"id: ####", "selected": [#, #, ...]}, ...]}
 * @apiExample {curl} Example usage:
 *     curl -X POST \
 *        -H "Authorization: Bearer <TOKEN>" \
 *        -H "Content-Type: application/json" \
 *        -d '{"surveyId":6,"result":[{"index":0,"id":"4b3131ef-97a5-459f-9b43-785b57c31fe0","selected":[0]},{"index":2,"id":"4fceaa9d-5760-4ff7-8fc9-2e7f7262728c","selected":[0,2]}]}' \
 *        "http://localhost:3000/api/surveyResult"
 * @apiSuccess {String} OK "OK" would be returned for successful insert
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "OK"
 * @apiError Error occurred      Any error occurred, please view log file for detail
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Error occurred"
 *     }
 */
router.post('/', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user) || Permissions.isEndUser(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    if ('surveyId' in req.body === false || 'result' in req.body === false) return res.status(400).json({ error: 'BAD_REQUEST' });

    const { surveyId, result } = req.body;

    await SurveyResult.create({ userId: req.user.id, surveyId, result });

    res.status(200).json('OK');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred'});
  }
});

router.get('/result', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user) || Permissions.isEndUser(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    let result = await SurveyResult.selectAll();
    result = await Promise.all(result.map(async (data) => {
      const { questions } = await SurveyTemplate.findById(data.survey_id); 

      data['answer'] = JSON.parse(data.data).map((element) => {
        let question = questions.find((el) => el.id == element.id)
        let answer = questions.find((el) => el.id == element.id).options
        if(question)
          element.title = {en: question.questionTextEn, tc: question.questionTextTc}
          element.selected = element.selected.map(ele => { return {en: answer[ele].optionTextEn, tc: answer[ele].optionTextTc, tags: answer[ele].tags} })
        return {index: parseInt(question.questionTextSc.slice(-1)), title: element.title, selected: element.selected} // not done 
      })

      return data
    }))

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred'});
  }
});

module.exports = router;
