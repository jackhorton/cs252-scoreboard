import mailer from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid-transport';

const transport = mailer.createTransport(sendgrid({
    auth: {
        api_key: process.env.SENDGRID_API
    }
}));
const fromEmail = process.env.CS252_EMAIL;

export default function send(params) {
    return new Promise((resolve, reject) => {
        transport.sendMail({
            from: fromEmail,
            to: params.to,
            replyto: 'donotreply@kitchen.support',
            subject: params.subject,
            text: params.text
        }, (err, response) => {
            if (err) {
                return reject(err);
            }

            resolve(response);
        });
    });
};
