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

module.exports = app => {

    app.get('/api/surveys/thanks', (req,res) => {
        res.send('Thanks for voting!')
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