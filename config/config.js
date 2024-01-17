const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
module.exports = {
  
  mongoose: {
    url: process.env.MONGODB_URL + (process.env.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  notion:{
    skillDB:"39fcebcda36149aebe77b7b4428c87dd",
    personalInfoDD:"4123edab4ef140a78c14114c75ac2a86",
    socialLinksDB:"70704f0302f24302b0859729884657eb",
    projectsDB:"5d92a033716f4f6ea8ddc806ac6232a6",
    honersAwardsDB:"750dc96ef1634658a24e29f269a3c05f",
    workExperiencesDB:"aa7ebab4fa4c4df08990ede7e38a7322",
    educationDB:"b80a38cd459b48768e4dd8be80cdddde"


  },
  notionAPI:process.env.NOTION_API_KEY,
};
