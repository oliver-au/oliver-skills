import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';

const project=path.resolve(import.meta.dirname,'..');
const out=path.join(project,'dist');
fs.mkdirSync(out,{recursive:true});
await build({
  entryPoints:[path.join(project,'src/watch.tsx')],
  bundle:true,minify:true,sourcemap:false,
  outfile:path.join(out,'app.js'),
  jsx:'automatic',target:['safari16','chrome110'],
  define:{'process.env.NODE_ENV':'"production"'},
  loader:{'.woff2':'file'},logLevel:'info',
});
fs.cpSync(path.join(project,'public'),out,{recursive:true});
console.log('Review player built in',out);
