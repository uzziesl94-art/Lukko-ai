import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.post("/api/chat", async (req,res)=>{
 try{
  const m = req.body.message || req.body.prompt;
  const r = await ai.models.generateContent({ model:"gemini-1.5-flash", contents:[{ role:"user", parts:[{text:m}]}] });
  res.json({ reply: r.text, answer: r.text, ok:true });
 }catch(e){ res.json({ reply:"Error: "+e.message, ok:false }); }
});
app.post("/chat", async (req,res)=>{
 try{
  const m = req.body.message || req.body.prompt;
  const r = await ai.models.generateContent({ model:"gemini-1.5-flash", contents:[{ role:"user", parts:[{text:m}]}] });
  res.json({ reply: r.text, answer: r.text, ok:true });
 }catch(e){ res.json({ reply:"Error: "+e.message, ok:false }); }
});
app.get("/status", (req,res)=>res.json({ status: process.env.APP_STATUS || "LUKKO WORLD LIVE" }));
app.get("/", (req,res)=>res.sendFile(path.join(__dirname,"index.html")));
const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log("LUKKO WORLD LIVE ON "+PORT));
