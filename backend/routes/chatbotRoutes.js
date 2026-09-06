const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `You are a friendly healthcare assistant for a rural healthcare platform called Rural Healthcare Connect.
Your job is to:
- Understand and reply in whatever language/style the user uses (Hindi, English, Hinglish, Marathi, or any other Indian language).
- If the user writes in Hinglish (Hindi words in English script), reply in the SAME Hinglish style, since many rural users are more comfortable reading that.
- Guide users on how to use the website: registering, checking symptoms, searching doctors, booking appointments.
- Give simple, non-diagnostic, general health guidance and always recommend seeing a real doctor for anything serious.
- Never claim to replace professional medical advice.
- Keep answers short, simple, and easy to understand for someone unfamiliar with technology.`;

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction,
      safetySettings,
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(message);

    // Check karo response mein actual text hai ya block ho gaya
    const candidates = result.response.candidates;
    if (!candidates || candidates.length === 0) {
      console.error('No candidates returned. Prompt feedback:', result.response.promptFeedback);
      return res.json({
        reply: 'Maaf kijiye, main is sawal ka jawab abhi nahi de saka. Kripya alag tarike se poochein ya doctor se seedha sampark karein.',
      });
    }

    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error details:', error.message || error);

    // Rate limit ya temporary overload ka case
    if (error.message && error.message.includes('429')) {
      return res.json({
        reply: 'Thoda intezaar karein, bahut zyada requests aa rahi hain. Kuch second baad dobara try karein.',
      });
    }

    res.status(500).json({ message: 'Chatbot error', error: error.message });
  }
});

module.exports = router;