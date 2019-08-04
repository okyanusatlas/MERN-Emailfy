const _ = require('lodash');
const {Path} = require('path-parser');
const {URL} = require('url');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const mongoose = require('mongoose');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('survey');

const createRecipientsArray = recipients => {
    return recipients.split(",").map(email => {
        return {email: email.trim()}
    });
};

const createSurveyObject = ({title, subject, body, recipients}, {id}) => {
    return new Survey({
        title,
        subject,
        body,
        recipients: createRecipientsArray(recipients),
        _user: id,
        dateSent: Date.now()
    })
};

const updateSurvey = ({surveyId, email, choice}) => {
    Survey.updateOne({
        _id: surveyId,
        recipients: {
            $elemMatch: {email: email, responded: false}
        }
    }, {
        $inc: {[choice]: 1},
        $set: {'recipients.$.responded': true},
        lastResponded: new Date()
    }).exec();
};

module.exports = app => {

    app.get('/api/surveys', requireLogin, async (req, res) => {
        try {
            const surveys = await Survey.find({_user: req.user.id})
              .select({recipients: false});
            res.send(surveys)
        } catch (err) {
            res.status(422).send(err)
        }

    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');

        req.body
          .map(({email, url}) => {
              const match = p.test(new URL(url).pathname);
              if (match) return {email, surveyId: match.surveyId, choice: match.choice};
          })
          .filter(event => Boolean(event))
          .forEach((event) => updateSurvey(event));

        res.send({});
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const survey = createSurveyObject(req.body, req.user);
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();
            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }
    });
};