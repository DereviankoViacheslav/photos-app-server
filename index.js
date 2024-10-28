import http from 'http';
import fs from 'fs/promises';

const PORT = 3001;
// const PATH = './data/items.json';
const PATH = './data/items2.json';

const ROUTS = {
  main: '/'
};

async function getData(response) {
  try {
    const result = await fs.readFile(PATH, { encoding: 'utf8', flag: 'r' });
    response.end(result);
  } catch (error) {
    console.log('Error:', error.message);
    response.statusCode = 500;
    response.end(`Error: ${error.message}`);
  }
}

async function addData(response, item) {
  try {
    const oldFileData = await fs.readFile(PATH, {
      encoding: 'utf8',
      flag: 'r'
    });
    const {
      uploadFile,
      description,
      hashtags,
      scaleControl,
      effectLevel,
      effect
    } = item;
    const newFileData = JSON.parse(oldFileData);
    const newItem = {
      id: newFileData.data.length + 1,
      url: uploadFile,
      scaleControl,
      effectLevel,
      effect,
      hashtags,
      description,
      likes: 0,
      comments: []
    };
    newFileData.data.push(newItem);
    const result = await fs.writeFile(PATH, JSON.stringify(newFileData), {
      encoding: 'utf8',
      flag: 'w'
    });
    response.end(JSON.stringify(newItem));
  } catch (error) {
    console.log('Error:', error.message);
    response.statusCode = 500;
    response.end(`Error: ${error.message}`);
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { pathname } = url;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  switch (true) {
    case request.method === 'OPTIONS':
      response.end();
      break;

    case ROUTS.main === pathname && request.method === 'GET':
      getData(response);
      break;

    case ROUTS.main === pathname && request.method === 'POST':
      let item = '';
      request.on('data', (chunk) => {
        item += chunk.toString();
      });
      request.on('end', () => {
        const newItem = JSON.parse(item);
        addData(response, newItem);
      });
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
