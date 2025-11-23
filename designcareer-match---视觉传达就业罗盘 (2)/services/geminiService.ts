
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Answer, AnalysisResult, TestMode } from "../types";
import { getQuestionsForMode } from "../constants";

const getJobAnalysisPrompt = (answers: Answer[], mode: TestMode) => {
  const questions = getQuestionsForMode(mode);
  
  const userProfile = answers.map(a => {
    const q = questions.find(q => q.id === a.questionId);
    if (!q) return '';
    const scoreDesc = ["非常不符合", "比较不符合", "一般", "比较符合", "非常符合"][a.value - 1];
    return `- [${q.module}] ${q.text}: ${scoreDesc} (${q.category})`;
  }).join("\n");

  // RADAR CHART SUBJECTS CONSTRAINT
  const radarConstraint = `
    **STRICT CONSTRAINT**: 
    The 'abilityRadar' array MUST strictly contain exactly these 6 subjects in this order:
    ['创意审美', '逻辑思维', '软件技法', '商业闭环', '沟通协作', '用户共情'].
    Full mark is 100.
  `;

  // BASIC MODE: LITE PROMPT
  if (mode === 'basic') {
    return `
      Role: Design Mentor.
      Context: Basic assessment for a student. 
      Output simplified JSON with 'jobTitle', 'matchScore', 'tags', 'description', 'fitReason', 'dailyWork'. 
      Leave other deep fields empty or null.
      
      ${radarConstraint}

      Based on:
      ${userProfile}
      
      JSON Output Requirements (Simplified Chinese):
      - userPersona: String.
      - marketAnalysis: String (Short summary).
      - topMatches: Array of 3 objects (Only basic fields required).
      - abilityRadar: Array of objects {subject, A, fullMark}.
    `;
  }

  // PRO MODES: FULL PROMPT
  return `
    Role: Senior Design Career Consultant & HR Director (China Market Expert).
    Context: You are generating a **HIGH-VALUE PAID CONSULTING REPORT** for a Chinese Visual Communication Design student.
    
    **CRITICAL DATA SOURCE**: 
    Base analysis strictly on current **2025-2026** recruitment trends from **BOSS Zhipin**, **Liepin**, **Maimai**, **Zcool**, and **Xiaohongshu**.

    User Answers:
    ${userProfile}

    Task:
    1. **Persona**: Deep psychological profile.
    2. **Market**: Real 2026 outlook.
    3. **Top 3 Matches**: Best-fit roles.
    4. **Radar**: Assess the 6 fixed dimensions based on answers.
    
    ${radarConstraint}

    **DEEP DIVE REQUIREMENTS (Be specific, no fluff):**
    - **Daily Work**: The *real* grind. Details on meetings, software used, overtime expectations.
    - **Curriculum**: Specific university courses to focus on vs. ignore.
    - **Internship**: Specific company types (e.g., "ByteDance/Tencent for UI", "Ogilvy for Brand", "Local Print Shop for Packaging").
    - **Portfolio**: Exact project types needed (e.g., "Redesign of a real app", "Physical packaging sample").
    - **Wealth & Side Hustles**: 
      - List specific platforms to find freelance work (e.g., "Mihuashi" for illustration, "Tezign" for UI, "ZhubaJie" for cheap logos).
      - How to make extra money?
    - **Pain Points (The Ugly Truth)**: 
      - Be brutal. Mention "35-year-old crisis", "Occupational diseases (cervical spondylosis)", "Unpaid overtime", "Client demands", "AI replacement risk".
    - **Involution Index**: High/Med/Low + Context (e.g., "High - 100 applicants per seat").

    JSON Output Requirements (Simplified Chinese):
    - **userPersona**: String.
    - **marketAnalysis**: String.
    - **topMatches**: Array of 3 objects:
      - **jobTitle**: String.
      - **matchScore**: Number.
      - **tags**: String[].
      - **description**: String.
      - **fitReason**: String.
      - **dailyWork**: String.
      - **curriculumFocus**: String[].
      - **softwareStack**: String[].
      - **selfStudyGoals**: String[].
      - **portfolioFocus**: String.
      - **internshipPath**: String.
      - **salaryRange**: String.
      - **salaryCompetitiveness**: Number.
      - **involutionIndex**: String (e.g. "极高 - 供远大于求").
      - **futureOutlook**: String.
      - **careerGrowth**: String.
      - **sideHustleChannels**: String[] (Specific platforms/methods).
      - **painPoints**: String[] (Specific negatives).
      - **educationFit**: Object { vocational, college, bachelor, master }.
  `;
};

// Helper to remove Markdown code blocks if AI adds them
const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();
  // Remove ```json and ``` 
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned.trim();
};

export const generateCareerAnalysis = async (answers: Answer[], mode: TestMode): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Retry mechanism: Try up to 3 times
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: getJobAnalysisPrompt(answers, mode),
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              userPersona: { type: Type.STRING },
              marketAnalysis: { type: Type.STRING },
              topMatches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    jobTitle: { type: Type.STRING },
                    matchScore: { type: Type.NUMBER },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    description: { type: Type.STRING },
                    fitReason: { type: Type.STRING },
                    dailyWork: { type: Type.STRING },
                    curriculumFocus: { type: Type.ARRAY, items: { type: Type.STRING } },
                    softwareStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                    selfStudyGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
                    portfolioFocus: { type: Type.STRING },
                    internshipPath: { type: Type.STRING },
                    salaryRange: { type: Type.STRING },
                    salaryCompetitiveness: { type: Type.NUMBER },
                    involutionIndex: { type: Type.STRING },
                    futureOutlook: { type: Type.STRING },
                    careerGrowth: { type: Type.STRING },
                    sideHustleChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
                    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    educationFit: {
                      type: Type.OBJECT,
                      properties: {
                        vocational: { type: Type.STRING },
                        college: { type: Type.STRING },
                        bachelor: { type: Type.STRING },
                        master: { type: Type.STRING }
                      },
                      required: ["vocational", "college", "bachelor", "master"]
                    }
                  },
                  required: ["jobTitle", "matchScore", "tags", "description", "fitReason", "dailyWork"]
                },
              },
              abilityRadar: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    A: { type: Type.NUMBER },
                    fullMark: { type: Type.NUMBER }
                  },
                  required: ["subject", "A", "fullMark"]
                }
              },
            },
            required: ["userPersona", "marketAnalysis", "topMatches", "abilityRadar"]
          }
        }
      });

      if (!response.text) {
        throw new Error("No response from AI");
      }

      // Clean and parse
      const cleanedText = cleanJsonOutput(response.text);
      return JSON.parse(cleanedText) as AnalysisResult;

    } catch (error) {
      console.warn(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      // Simple backoff
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Failed to generate analysis after multiple attempts");
};
