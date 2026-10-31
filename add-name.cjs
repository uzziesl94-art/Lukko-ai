const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const nameCode = `
<div id="nameModal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;">
<div style="background:#1a1a20;padding:30px;border-radius:15px;text-align:center;max-width:320px;border:1px solid #a855f7;">
<h2 style="color:#a855f7;margin:0;">Welcome to LUKKO AI</h2><p>What is your name? LUKKO will remember you</p>
<input id="userNameInput" placeholder="Enter your name" style="padding:12px;width:90%;border-radius:8px;border:none;margin:10px 0;">
<button onclick="saveName()" style="padding:12px 25px;background:#a855f7;border:none;border-radius:8px;color:#fff;width:100%;font-weight:bold;">Start Chatting</button>
</div></div>
<script>
function saveName(){
  const name = document.getElementById('userNameInput').value.trim();
  if(!name){ alert('Please enter name'); return; }
  const deviceId = localStorage.getItem('lukko_deviceId') || 'dev_'+Math.random().toString(36).substr(2,9);
  localStorage.setItem('lukko_deviceId', deviceId);
  localStorage.setItem('lukko_userName', name);
  fetch('/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name, deviceId})}).catch(()=>{});
  document.getElementById('nameModal').style.display='none';
}
(function(){
  const saved = localStorage.getItem('lukko_userName');
  if(saved){ const m=document.getElementById('nameModal'); if(m) m.style.display='none'; }
})();
</script>
`;
html = html.replace('</body>', nameCode + '</body>');
fs.writeFileSync('index.FULL.html', html);
console.log('SUCCESS: index.FULL.html created with name tracking!');
