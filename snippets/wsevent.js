var ws=new WebSocket('ws://82.157.123.54:9010/ajaxchattest');
ws.onsend=null;
addEventListener('onsend', (e)=>{if(ws.onsend instanceof Function) {return ws.onsend(e)}});
var _send=ws.send.bind(ws);
ws.send=function(data){var onsend = new CustomEvent('onsend',{detail:data});dispatchEvent(onsend);_send(data);}

ws.onsend=function(e){console.log(e.detail);console.log('end')};


var stack={};
ws.use=function(code, fn){stack[code]=fn};
ws.onmessage=function(e){var d = JSON.parse(e.data);if(stack.hasOwnProperty(d['msg_id'])){stack[d['msg_id']](d)}}
ws.send('{"msg_id":200}')