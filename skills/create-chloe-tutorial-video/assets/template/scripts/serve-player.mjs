import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {parseArgs} from 'node:util';

const {values}=parseArgs({options:{port:{type:'string',default:'3030'}}});
const port=Number(values.port);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Port must be an integer between 1 and 65535.');
const root=path.resolve(import.meta.dirname,'../dist');
if(!fs.existsSync(path.join(root,'index.html')))throw new Error('Build the player first: npm run build:player');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.m4a':'audio/mp4','.mp3':'audio/mpeg','.wav':'audio/wav','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(file,(error,stat)=>{
    if(error||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache'});
    if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
  });
}).listen(port,'127.0.0.1',()=>console.log(`Review player: http://localhost:${port}`));
