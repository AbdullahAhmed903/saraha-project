import nodeoutlook  from 'nodejs-nodemailer-outlook'
export function myEmail(dest,subject,message)
{
nodeoutlook.sendEmail({
    auth: {
        user: process.env.senderEmail,
        pass: process.env.senderEmailpassword
    },
    from: process.env.senderEmail,
    to: dest,
    subject:subject,
    html:message,
   
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i)
}
);
}