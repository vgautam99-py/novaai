import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini API client
const getGenAIModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

/**
 * @desc Generate a professional resume summary
 */
export const generateAISummary = async (jobTitle, experienceText, skillsText) => {
  const model = getGenAIModel();
  
  const prompt = `
    You are an expert resume writer. Write a compelling, high-impact professional summary for a resume.
    
    Target Job Title: ${jobTitle || 'Professional'}
    Recent Experience Details: ${experienceText || 'None provided'}
    Key Skills: ${skillsText || 'None provided'}
    
    Guidelines:
    - Write a short summary of UP TO 50 WORDS. This is a strict word limit constraint.
    - Do NOT include any soft skills (e.g. do not use words like "detail-oriented", "team player", "motivated", "collaborative", "passionate", "excellent communicator"). Focus strictly on hard/technical skills, domain expertise, and concrete achievements.
    - Use strong action verbs and professional vocabulary.
    - Focus on value added and key qualifications.
    - Write in the first-person implied (do not use "I", "my", or "me").
    - Return ONLY the paragraph summary text. Do not add formatting, intros, or descriptions.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

/**
 * @desc Polish work experience descriptions using the STAR method
 */
export const polishAIExperience = async (position, company, description) => {
  const model = getGenAIModel();

  const prompt = `
    You are an expert resume reviewer. Revise the following work experience descriptions/bullet points to be highly professional, impactful, and aligned with the STAR (Situation, Task, Action, Result) method.
    
    Job Position: ${position || 'Employee'}
    Company: ${company || 'Organization'}
    Current Bullet Points/Description:
    ${description || 'Worked on daily tasks.'}
    
    Guidelines:
    - Turn vague statements into accomplishment-focused bullet points.
    - Begin every bullet point with a strong, active verb (e.g. Architected, Streamlined, Spearheaded).
    - If metrics are not provided, inject realistic placeholders (e.g., "by 15%", "saving 10 hours weekly") and mark them clearly with brackets so the user knows to customize them.
    - Return ONLY the revised list of bullet points (each starting with a dash "-"). Do not add introduction or closing remarks.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

/**
 * @desc Suggest a list of matching skills for a job title
 */
export const suggestAISkills = async (jobTitle) => {
  const model = getGenAIModel();

  const prompt = `
    You are an expert technical recruiter. Suggest a list of exactly 8-10 highly relevant skills (both hard/technical skills and soft/professional skills) for a candidate targeting the following job title:
    
    Target Job Title: ${jobTitle || 'Software Engineer'}
    
    Guidelines:
    - Return ONLY a valid JSON array of strings containing the skills.
    - Do not use markdown blocks, code fence backticks (\`\`\`json), or explanatory text.
    - Example output format: ["React.js", "Node.js", "REST APIs", "Team Collaboration"]
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text().trim();
  
  let cleanText = rawText;
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error parsing Gemini skills output:', rawText);
    return ['Problem Solving', 'Communication', 'Technical Proficiency', 'Adaptability'];
  }
};

/**
 * @desc Compare parsed resume text with a job description and return an ATS report JSON
 */
export const analyzeResumeATS = async (resumeText, jobDescription) => {
  const model = getGenAIModel();

  const prompt = `
    You are an advanced Application Tracking System (ATS) algorithm and expert resume reviewer. 
    Analyze the following Resume Text against the provided Job Description.
    
    Resume Text:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Guidelines:
    - Assess how well the resume matches the qualifications, skills, and experience requested.
    - Identify missing key terms/keywords that are prominent in the Job Description but absent in the Resume.
    - Check grammar, structure, formatting, and readability.
    
    You MUST respond with ONLY a valid JSON object in the following format (do not include backticks, markdown markers, or other wrapper texts):
    {
      "score": 85,
      "missingKeywords": ["Kubernetes", "GraphQL", "Agile methodologies"],
      "grammarFeedback": "Overall grammar is excellent. Watch out for passive voice in company descriptions.",
      "readabilityFeedback": "Good flow, but consider increasing spacing between experience blocks.",
      "recommendations": [
        "Integrate Kubernetes in experience descriptions.",
        "Rephrase the product manager role bullet points to use the STAR method."
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text().trim();

  let cleanText = rawText;
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error parsing Gemini ATS report:', rawText);
    return {
      score: 50,
      missingKeywords: ['Failed to analyze keywords'],
      grammarFeedback: 'Error during grammar check.',
      readabilityFeedback: 'Error during readability check.',
      recommendations: ['Please try again. Make sure both resume and job description are filled.']
    };
  }
};

/**
 * @desc Generate custom tailored cover letter based on resume profile and job description
 */
export const generateAICoverLetter = async (resumeDetailsText, jobDescription) => {
  const model = getGenAIModel();

  const prompt = `
    You are an expert resume writer. Write a compelling, highly personalized Cover Letter (about 250-350 words) matching the candidate's details to the job requirements.
    
    Candidate Resume / Profile Details:
    ${resumeDetailsText}
    
    Target Job Description:
    ${jobDescription}
    
    Guidelines:
    - Use a professional, persuasive, yet humble tone.
    - Link the candidate's key project/experience achievements directly to the job needs.
    - Keep formatting standard for business letters.
    - Return ONLY the cover letter body text. Use standard placeholders for fields like Date, Hiring Manager Name, and Address. Do not add metadata wrappers, backticks, or intro texts.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

/**
 * @desc Review an uploaded resume PDF and provide feedback
 */
export const reviewAIResume = async (resumeText) => {
  const model = getGenAIModel();

  const prompt = `
    Review the following resume content and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Highlight formatting issues or layout suggestions.
    
    Resume Content:
    ${resumeText}
    
    Guidelines:
    - Provide a professional, detailed critique.
    - Format response in clear, clean markdown using subheadings, bullet points, and highlight sections.
    - Structure your review under: 
      1. Overall Impression
      2. Strengths (what is working well)
      3. Weaknesses & Improvement Areas
      4. Formatting & Style Feedback
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};
