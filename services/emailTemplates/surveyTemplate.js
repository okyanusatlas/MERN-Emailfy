module.exports = survey => {
    return `
        <html>
            <body>
                <div style="text-align: center;">
                    <h3> Your opinion matters!</h3>
                    <p> Please answer following question</p>
                    <p> ${survey.body}</p>
                    <div>
                        <a href="http://localhost:3000/api/surveys/${survey.id}/yes"> Yes</a>
                        <a href="http://localhost:3000/api/surveys/${survey.id}/no"> No</a>
                    </div>
                </div>
            </body>
        </html>
    `
};