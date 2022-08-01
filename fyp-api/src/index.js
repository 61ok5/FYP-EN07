const { apiServer } = require('./app');
const apiPort = 5000

//listener
apiServer.listen(apiPort, () => {
  console.log(`API listening at https://localhost:${apiPort}`)
});