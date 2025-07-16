if(process.env.NODE_ENV==='production'){
    module.exports= require('./prod')
} else {
    module.exports = require('./dev')
    }

// module.exports={
//     MONGOURI:"mongodb+srv://chalamanchivadu:rXImNTUIwdLfw5t3@cluster0.l5s1kad.mongodb.net/",// --apiVersion 1 --username chalamanchivadu --password rXImNTUIwdLfw5t3
//     JWT_SECRET:"1234567890"
// }

