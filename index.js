import http from 'http';
import fs from 'fs';

const PORT = 3000;

const ROUTS = {
  getAllItems: '/',
  getItemById: '/id'
};
async function getStaticFile(response, path) {
  fs.readFile(path, { encoding: 'utf8', flag: 'r' }, (error, data) => {
    if (error) {
      response.statusCode = 500;
      response.end();
    } else {
      response.end(data);
    }
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { pathname } = url;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  switch (true) {
    case ROUTS.getAllItems === pathname && request.method === 'GET':
      getStaticFile(response, './data/items.json');
      break;

    case ROUTS.getAllItems === pathname && request.method === 'POST':
      // to do
      getStaticFile(response, './data/items.json');
      break;

    default:
      console.log('404');
      response.end('404');
      break;
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
