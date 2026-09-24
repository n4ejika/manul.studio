import {createDecipheriv,createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {readFileSync,writeFileSync,mkdirSync,chmodSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
export function unseal(envelope,key){
 if(envelope.version!==1||envelope.client!=='prokatmaxim'||!/^[0-9a-f]{64}$/.test(key??''))throw Error('invalid envelope');
 const decipher=createDecipheriv('aes-256-gcm',Buffer.from(key,'hex'),Buffer.from(envelope.iv,'base64'));decipher.setAAD(Buffer.from(envelope.client));decipher.setAuthTag(Buffer.from(envelope.tag,'base64'));
 const payload=JSON.parse(gunzipSync(Buffer.concat([decipher.update(Buffer.from(envelope.data,'base64')),decipher.final()]),{maxOutputLength:300000000}));
 if(payload.client!==envelope.client||typeof payload.password!=='string'||payload.password.length<24||!Array.isArray(payload.files))throw Error('invalid payload');
 const names=new Set();for(const f of payload.files){if(!/^(index\.html|report\.html|report\.json|captures\/[a-z0-9-]+\.json)$/.test(f.name)||names.has(f.name))throw Error('invalid path');names.add(f.name);if(createHash('sha256').update(Buffer.from(f.data,'base64')).digest('hex')!==f.sha256)throw Error('hash mismatch');}
 if(!names.has('index.html')||!names.has('report.html')||!names.has('report.json'))throw Error('missing reports');return payload;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const payload=unseal(JSON.parse(readFileSync(process.argv[2],'utf8')),process.env.CLIENT_REPORT_KEY);const out=resolve(process.argv[3]);mkdirSync(out,{recursive:true,mode:0o700});
 for(const f of payload.files){const p=resolve(out,'public',f.name);mkdirSync(dirname(p),{recursive:true,mode:0o755});chmodSync(resolve(out,'public'),0o755);chmodSync(dirname(p),0o755);writeFileSync(p,Buffer.from(f.data,'base64'),{mode:0o644});chmodSync(p,0o644);}
 writeFileSync(resolve(out,'password'),payload.password,{mode:0o600});console.log('Verified '+payload.files.length+' protected files');
}
