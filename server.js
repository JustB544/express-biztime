/** Server startup for BizTime. */


const app = require("./app");
// require('dotenv').config();


app.listen(3000, function () {
  console.log("Listening on 3000");
});