const app = require("./src/app");
require('dotenv').config();

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
    console.log(`backend work! port ${PORT}`)
});

// process.on(`SIGINT`, () =>{
//     server.close( () => console.log(`closed backend`))
// });