//create a transport
//compose a message
//send a mail
//nodemailer
const nodemailer=require('nodemailer')

let transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:'chrohankumar8504@gmail.com',
        pass:'grqz hyvr tgzw thtp'
    }
})

async function sendmails(toadress,username){
    try {
        let mailoptions={
            from: 'chrohankumar8504@gmail.com', // sender address
            to: toadress, // list of recipients
            subject: "ACCOUNT REGISTRATION", // subject line
            text: `Hi, ${username} your Account is created successfully `, // plain text body
            html: `Hi, ${username} your Account is created successfully`, // HTML body
          }
        let sendMail=await transport.sendMail(mailoptions)   
        console.log('email sent')
    } catch (error) {
        console.log(error)
    }   
  }

  module.exports=sendmails;