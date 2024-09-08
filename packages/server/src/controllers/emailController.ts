import nodemailder from "nodemailer";

const transporter = nodemailder.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: "1564235012@qq.com",
    pass: "kqfufiwcbmjahajd",
  },
});

export const sendEmail = async (to: string, code: string) => {
  await transporter.sendMail({
    from: '"dong" <1564235012@qq.com>',
    to,
    text: `test code: ${code}`,
  });
};
