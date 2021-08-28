import { readFile } from 'fs';
import { request as req } from 'https';
import { createServer } from 'http';

const secret = '';

createServer((request, response) => {
  if (request.url === '/') {
    readFile('./index.html', (error, html) => {
      if (error) { throw (error); }
      response.write(html);
      response.end();
    });
  }
  else if (request.url === '/main.js') {
    readFile('./main.js', (error, js) => {
      if (error) { throw (error); }
      response.write(js);
      response.end();
    });
  }
  else if (request.url === '/siteverify') {
    console.log("verifying");

    let body = [];
    request.on("data", chunk => {
      body.push(chunk);
    });
    request.on("end", () => {
      body = body.join("");

      req(`https://www.google.com/recaptcha/api/siteverify?secret=` +
        secret + `&response=` + body,
        { method: 'POST' },
        googleRes => {
          const chunks = []
          googleRes.on('data', chunk => {
            chunks.push(chunk);
          })
          googleRes.on('end', () => {
            response.end(JSON.stringify(chunks.join("")));
          });
        }).end();
    });
  }
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
}).listen(8080);
