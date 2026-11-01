import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/chat", async (req,res)=>{
  try{
    const r = await ai.models.generateContent({
      model:"gemini-1.5-flash",
      contents:[{ role:"user", parts:[{text:req.body.message}] }]
    });
    res.json({ answer: r.text, ok:true });
  }catch(e){
    try{
      const r2 = await ai.models.generateContent({
        model:"gemini-1.5-flash",
        contents:[{ role:"user", parts:[{text:req.body.message}] }]
      });
      res.json({ answer:r2.text, ok:true });
    }catch(e2){
      res.json({ answer:"Server busy, try again: "+e.message, ok:false });
    }
  }
});

app.get("/status", (req,res)=>{ res.json({ status: process.env.APP_STATUS || "ON", owner: process.env.OWNER_NAME || "Thomas" }); });
app.get('/', (req,res)=>res.sendFile(path.join(__dirname,"index.html")));
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("LUKKO WORLD on "+PORT));
