import Mail from './mail';

export class RegistrationMail extends Mail {
  send() {
    console.log("Called to send");
    const message = {
        from: 'elonmusk@tesla.com', // Sender address
        to: 'to@email.com',         // List of recipients
        subject: 'Design Your Model S | Tesla', // Subject line
        text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
    };

    return this.getTransport().sendMail(message, function(
        err: object|null,
        info: string|null
    ) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
  }
}
