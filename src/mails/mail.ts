const nodemailer = require('nodemailer');

export default class Mail {
    getTransport() {
      return nodemailer.createTransport({
          host: 'smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: 'acb50aa70b1f77',
            pass: '7ba1f9eb0307ab'
          }
      });
  }
}
