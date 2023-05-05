let dotenv = require('dotenv')
dotenv.config({path:".env"})

// module.exports = {
//     serviceID:'VA864d720027451b82f70f64f2a9467bd1',
//     accountSID:'AC1522d3bc241b9687414b5c50b7240958',
//     authToken:' 23ffd7e6b40ba9f33c32efb5c47faa87 '
// }


module.exports = {
    serviceID:process.env.serviceID,
    accountSID:process.env.accountSID,
    authToken:process.env.authToken

}