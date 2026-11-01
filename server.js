import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const GEMINI_KEY = process.env.GEMINI_API_KEY;

app.get("/health", (req,res)=>{
  res.json({status:"LUKKO LIVE", hasKey: !!GEMINI_KEY, source:"1ce-fixed"});
});

app.post("/api/chat", async (req,res)=>{
  try{
    const prompt = req.body.message || req.body.prompt || "";
    if(!prompt) return res.json({response:"Send message"});
    if(!GEMINI_KEY) return res.json({response:"API KEY missing in Render"});

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    
    const r = await fetch(url, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
    });
    
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if(text) return res.json({response:text});
    return res.json({response:"LUKKO: "+JSON.stringify(data).slice(0,500)});
  }catch(e){
    console.error(e);
    res.json({response:"Error: "+e.message});
  }
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"index.html")));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', ()=>console.log("LUKKO READY on "+PORT));
