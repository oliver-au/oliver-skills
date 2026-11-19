#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';

const {values}=parseArgs({options:{out:{type:'string'},help:{type:'boolean',default:false}}});
if(values.help){console.log('Usage: node scripts/scaffold.mjs --out ./chloe-video\nCopies the editable template into a new or empty directory. Does not install packages.');process.exit(0);}
if(!values.out)throw new Error('Pass --out with a new or empty project directory.');
const source=path.resolve(import.meta.dirname,'../assets/template');
const target=path.resolve(values.out);
if(target===source||target.startsWith(source+path.sep))throw new Error('Choose an output directory outside the skill template.');
if(fs.existsSync(target)){
  if(fs.lstatSync(target).isSymbolicLink()||!fs.statSync(target).isDirectory())throw new Error('Output must be a real directory, not a link or file.');
  if(fs.readdirSync(target).length)throw new Error('Output directory is not empty. No files changed.');
}
fs.mkdirSync(target,{recursive:true});
fs.cpSync(source,target,{recursive:true,errorOnExist:true,force:false});
console.log(`Created ${target}\nNext: install the package.json dependencies, then run npm run dev.\nThe reference lessons are silent drafts until narration is prepared.`);
