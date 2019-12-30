import Mail from './mail';

export class RegistrationMail extends Mail {
  send(userObject: { email: string; name: string; }) {
    
    const {email, name} = userObject;
    const message = {
        from: 'support@dopelista.com',
        to: email,
        subject: 'Account Creation On DopeLista',
        html: `<h1 style="color: darkslategrey;font-style: italic"> Hello ${name}, Welcome to Doplista </h1>` // Plain text body
    };

    this.getTransport().sendMail(message, function( err: object|null ) {
        if (err) {
          console.log('An occured sending email', err);
        }
    });
  }
}
