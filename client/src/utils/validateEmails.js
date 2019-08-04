const regExForEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default (emails = '') => {
    if (emails[emails.length-1] === ',') emails = emails.slice(0, -1);
    const invalidMails = emails
      .split(',')
      .map(email => email.trim())
      .filter(email => !regExForEmail.test(email));

    if (invalidMails.length) {
        return `Invalid Email(s): ${invalidMails}`
    }
};