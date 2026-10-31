import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use((req,res,next)=>{ res.setHeader('X-Content-Type-Options','nosniff'); next(); });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.post("/chat", async (req,res)=>{
  try{
    const r = await ai.models.generateContent({
      model:"gemini-3.8-flash",
      contents:[{ role:"user", parts:[{text:req.body.message}] }],
    });
    res.json({ answer:r.text, ok:true });
  }catch(e){
    try{
      const r2 = await ai.models.generateContent({ model:"gemini-3.5-flash-lite", contents:[{ role:"user", parts:[{text:req.body.message}] }] });
      res.json({ answer:r2.text, ok:true });
    }catch(e2){ res.json({ answer:"ERROR", ok:false }); }
  }
});
app.get("/", (req,res)=>res.sendFile(path.join(__dirname,"index.html")));
app.listen(3000, ()=>console.log("LUKKO READY"));
