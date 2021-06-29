var express = require('express');
const getClient = require('.\\app\\client\\elasticsearch')
const app = express();

app.get('/', async (request, response) => {
    const client = getClient();
  
    const result = await client.index({
      index: 'elastic_teste',
          type: 'type_elastic_teste',
          body: {
              user: 'Thinh',
              pass: 'vanthinh133',
              email: 'ngovanthinh1617@gmail.com'
          }       
    })
  
    return response.json(result);
  })
  
//   async addData(Request, Response) {
//         try {
//             const client = getClient();
//             const url = 'mongodb://localhost:27017/';
//             // Database Name
//             const dbName = 'selling_projects';

//             // Connect URL
//             let db = await MongoClient.connect(url);

//             //Connect DB
//             let dbo = await db.db(dbName);
            
//             const data = await dbo.collection("users").find({}).toArray();
//             const dataUser = await data.forEach((element) => {
//                 client.index({
//                     index: 'elastic_teste',
//                     type: 'type_elastic_teste',
//                     body: {
//                         name: element.name,
//                         email: element.email,
//                         password: element.password,
//                         phone: element.phone,
//                         address: element.address,
//                         country: element.country,
//                         city: element.city,
//                         role: element.role,
//                         district: element.district,
//                         status: element.status,
//                         avatar: element.avatar,
//                     }
//                 });
//             });
            
//             const promiseAll = await Promise.all([
//                 data,
//                 dataUser
//             ]);

//             return response.json(promiseAll[0]);
//         } catch (error) {
//             console.log(error);
//         }
//     }


  app.listen(3333, () => console.log('Running'));