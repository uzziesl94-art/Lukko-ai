const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

app.get('/health', (req,res)=>{
  res.json({status:"LUKKO LIVE", hasKey: !!KEY, source:"1ce-final"});
});

app.post('/api/chat', async (req,res)=>{
  try{
    const prompt = req.body.message || req.body.prompt || "Hello";
    if(!KEY) return res.json({reply:"No API Key set in Render"});
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;
    const r = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
    });
    const data = await r.json();
    if(data.error) return res.json({reply:"Google Error: "+data.error.message});
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from AI";
    res.json({reply:text});
  }catch(e){
    console.error(e);
    res.json({reply:"Server Error: "+e.message});
  }
});

app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', ()=>console.log("LUKKO READY on "+PORT));
