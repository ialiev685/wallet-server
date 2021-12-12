import sgMail from '@sendgrid/mail';

const sendMail = async data => {
  const { SENDGRID_API_KEY } = process.env;
  sgMail.setApiKey(SENDGRID_API_KEY);

  try {
    const mail = { ...data, from: 'wallet.service.auth@gmail.com' };
    await sgMail.send(mail);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default sendMail;
