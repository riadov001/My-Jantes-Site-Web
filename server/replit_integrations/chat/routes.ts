import type { Express, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { chatStorage } from "./storage";

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de MyJantes, l'expert de la jante alu basé à Liévin (62800) dans les Hauts-de-France.

Ton rôle est d'aider les clients avec :
- Des informations sur les prestations : rénovation, peinture, soudure, sablage, dévoi­lage, usinage (diamantage sur tour numérique), tribofinition, hydrodipping, personnalisation
- Des questions sur les tarifs (rénovation à partir de 109 €, soudure à partir de 90 €, etc.)
- Des conseils sur l'entretien et la rénovation des jantes alu
- La prise de contact et les devis gratuits
- Les horaires : Lundi–Vendredi 9h–12h30 / 13h30–18h
- L'adresse : 46 rue de la Convention, 62800 Liévin
- Le téléphone : 03 21 40 80 53
- WhatsApp : 06 71 37 04 18
- L'espace client : https://pwapp.myjantes.fr

Règles importantes :
- Réponds toujours en français
- Sois professionnel, chaleureux et concis
- Pour les devis précis, invite toujours le client à envoyer des photos via le formulaire de contact ou WhatsApp
- Ne donne pas de prix ferme sans avoir vu les jantes — précise que c'est une estimation
- Si on te demande autre chose que la jante/véhicule/MyJantes, redirige poliment vers ta spécialité
- N'utilise pas de jargon technique excessif avec les clients
- Tu peux utiliser des emojis avec modération 🔧`;

function getAI() {
  return new GoogleGenAI({
    apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
    httpOptions: {
      apiVersion: "",
      baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
    },
  });
}

export function registerChatRoutes(app: Express): void {
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "Nouvelle conversation");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id as string);
      const { content } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({ error: "Message content required" });
      }

      await chatStorage.createMessage(conversationId, "user", content);

      const messages = await chatStorage.getMessagesByConversation(conversationId);

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : ("user" as "user" | "model"),
        parts: [{ text: m.content }],
      }));

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const ai = getAI();
      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Compris ! Je suis l'assistant MyJantes, comment puis-je vous aider ?" }] },
          ...history,
          { role: "user", parts: [{ text: content }] },
        ],
        config: { maxOutputTokens: 1024 },
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }

      await chatStorage.createMessage(conversationId, "assistant", fullResponse);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("[chat] Error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Erreur lors de la réponse" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });
}
