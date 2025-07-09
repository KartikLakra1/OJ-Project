// src/hooks/useGeminiReview.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const useGeminiReview = () => {
  const genAI = new GoogleGenerativeAI(API_KEY);

  const reviewCode = async (code, language) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are an expert programming tutor. Please review the following ${language} code.
Give feedback on logic, efficiency, and improvements in less than 100 words.

\`\`\`${language}
${code}
\`\`\``;

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const response = await result.response;
      const text = await response.text();
      return text;
    } catch (err) {
      console.error("Gemini review error:", err);
      return "❌ Failed to generate code review.";
    }
  };

  return { reviewCode };
};

export default useGeminiReview;
