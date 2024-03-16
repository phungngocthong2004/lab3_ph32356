const nodemailer=require('nodemailer');
const tranportster=nodemailer.createTransport({
service:"gmail",
auth:{
    user:"phungngocthong2004@gmail.com",
    pass:"ádfsdfsd"
}
});
module.exports=tranportster;