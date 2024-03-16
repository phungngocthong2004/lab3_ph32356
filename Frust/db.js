const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const uri = 'mongodb+srv://phungngocthong2004:15PagpYMDSGTN3G3@mydatabase.ctnpodf.mongodb.net/lab3';

const connect = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
        });
        console.log("Connected ");
    } catch (error) {
        console.error("Connection failed:", error);
    }
};

 module.exports= {connect} // Call the connect function to initiate connection
