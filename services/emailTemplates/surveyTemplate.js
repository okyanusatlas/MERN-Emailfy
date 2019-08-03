const keys = require('../../config/keys');

module.exports = survey => {
    return `
        <html>
            <body>
                <div style="text-align: center;">
                    <h3> Your opinion matters!</h3>
                    <p> Please answer following question</p>
                    <p> ${survey.body}</p>
                    <div>
                        <a href="${keys.redirectDomain}/api/surveys/thanks"> Yes</a>
                        <a href="${keys.redirectDomain}/api/surveys/thanks"> No</a>
                    </div>
                </div>
            </body>
        </html>
    `
};