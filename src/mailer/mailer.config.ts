export const createMailerConfig = () => {
  const port = Number(process.env.SMTP_PORT) || 587;

  return {
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
};