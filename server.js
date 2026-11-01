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

async function askLukko(prompt){
  const key = process.env.GEMINI_API_KEY;
  if(!key) return "LUKKO LIVE! But key missing on Render.";
  try{
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
    });
    const data = await res.json();
    if(data.candidates && data.candidates[0]){
      return data.candidates[0].content.parts[0].text;
    } else {
      return "LUKKO: " + JSON.stringify(data).slice(0,300);
    }
  }catch(e){
    return "LUKKO Error: " + e.message;
  }
}

app.post("/api/chat", async (req,res)=>{
  const msg = req.body.message || req.body.prompt || "Hello";
  const reply = await askLukko(msg);
  res.json({reply:reply, answer:reply, ok:true});
});

app.post("/chat", async (req,res)=>{
  const msg = req.body.message || req.body.prompt || "Hello";
  const reply = await askLukko(msg);
  res.json({reply:reply, answer:reply, ok:true});
});

app.get("/health", (req,res)=>res.json({status:"LUKKO LIVE", hasKey:!!process.env.GEMINI_API_KEY}));

app.get("/", (req,res)=>res.sendFile(path.join(__dirname,"index.html")));

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log("LUKKO LIVE WORLDWIDE ON "+PORT));
