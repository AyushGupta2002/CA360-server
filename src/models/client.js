const mongoose = require('mongoose');
const { enums } = require('../config/constant.js');

const contactsSchema = new mongoose.Schema({
  primaryMobile : {
    type : String,
    required : true
  },
  secondaryMobile : {
    type : String
  },
  primaryMail : {
    type: String,
    required : true
  },
  secondaryMail : {
    type : String
  },
  address : {
    type : String
  },
  whatsappTo : {
    type : String,
    required : true
  },
  whatsappGroupType : {
    type : String,
    enum : enums.whatsappGroupType,
    required : true
  }
});

const gstSchema = new mongoose.Schema({

  gstNumber : {
    type : String
  },
  gstUsername : {
    type : String
  },
  gstPassword : {
    type : String
  },
  ewayUsername : {
    type : String
  },
  ewayPassword : {
    type : String
  },
  filingType : {
    type : String,
    enum : enums.filingType
  },
  registeredState : {
    type : String,
    enum : enums.registeredState
  },
  verificationCode : {
    type : String,
    enum : enums.verificationCode
  },
  paymentMode : {
    type : String,
    enum : enums.paymentMode
  }
});

const itSchema = new mongoose.Schema({

   username : {
    type : String
  },
  password : {
    type : String
  }
});

const tdsSchema = new mongoose.Schema({


  tanNumber : {
    type : String
  },
  itUsername : {
    type : String
  },
  itPassword : {
    type : String
  },
  tracesUsername : {
    type : String
  },
  tracesPassword : {
    type : String
  }
});

const clientSchema = new mongoose.Schema({

  uniqueId : Number,
  dependent : {
    type : String,
    required : true
  },
  dateOfBirth : {
    type : Date,
    required : true
  },
  startDate : {
    type : Date,
    default : Date.now
  },
  aadhaar : {
    type : String,
    required : true
  },
  businessName : {
    type : String,
    required : true,
    unique: true
  },
  entityType : {
    type : String,
    enum : enums.entityType,
    required : true
  },
  natureOfBusiness : {
    type : [String],
    enum : enums.natureOfBusiness,
    required : true
  },
  notes : {
    type : String
  },
  contacts : contactsSchema,
  gst : gstSchema,
  it : itSchema,
  tds : tdsSchema

}
);

const Client = mongoose.model("client", clientSchema);
module.exports = Client;
