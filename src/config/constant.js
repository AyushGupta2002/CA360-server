const secretToken = "Thisissecrettoken";
const mongoURL = "mongodb+srv://sudoboat:sudoboat@commoncluster.0m61t.mongodb.net/CA360?authSource=admin&replicaSet=atlas-3g85es-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
const enums = {
  whatsappGroupType: ['Income Tax', 'GST', 'Both(Income Tax and GST)', 'Others'],
  filingType: ['Monthly', 'Quarterly'],
  verificationCode: ['DSC', 'EVC'],
  paymentMode: ['e-pay (office)', 'e-pay (client)', 'neft/rtgs', 'others'],
  entityType: ['individual', 'firm', 'company', 'LLP', 'HUF', 'AOP', 'BOI', 'Trust'],
  natureOfBusiness: ['Salaried Employee', 'Manufacturing', 'Service', 'Trading'],
  role: ['Admin', 'Employee'],
  registeredState: ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
   "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]
}
module.exports = {
  mongoURL,
  secretToken,
  enums
};
