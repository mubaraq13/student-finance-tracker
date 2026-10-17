"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateFinancialAdvice(summaryData: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return { 
        error: "API Key Gemini belum dikonfigurasi. Pastikan GEMINI_API_KEY sudah ada di .env.local dan server telah di-restart." 
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // KITA GUNAKAN MODEL TERBARU SESUAI PERMINTAAN SERVER GOOGLE
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `
      Kamu adalah seorang penasihat keuangan pribadi yang cerdas, ramah, dan empatik. Target audiensmu adalah seorang mahasiswa.
      
      Berikut adalah ringkasan data keuangan mahasiswa tersebut pada periode ini:
      ${summaryData}

      Tugasmu:
      1. Berikan analisis singkat tentang kondisi keuangannya (apakah surplus/defisit, sehat/boros).
      2. Berikan saran praktis yang spesifik berdasarkan pengeluaran terbesarnya.
      3. Gunakan bahasa Indonesia yang santai, suportif, tidak kaku, dan seperti teman (selalu gunakan kata sapaan "kamu").
      4. Format jawaban dalam 2 atau 3 paragraf pendek saja. JANGAN gunakan format list/bullet point yang terlalu panjang.
      5. Gunakan format Markdown standar untuk menebalkan kata yang penting (seperti **ini**).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { advice: text };
  } catch (error: any) {
    console.error("Error generating AI advice:", error);
    return { 
      error: `Gagal menghubungi AI. Detail: ${error.message}` 
    };
  }
}