import { GoogleGenerativeAI } from "@google/generative-ai";
import Creation from "../models/Creation.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import pdf from "pdf-parse";
import fs from "fs";

// Initialize native Google Generative AI
const getGenAIModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

// 1. GENERATE ARTICLE
export const generateArticle = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    const model = getGenAIModel();
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    // Create creation record in MongoDB
    const creation = await Creation.create({
      user: req.user._id,
      prompt,
      content,
      type: 'article',
    });

    // Increment user credits used
    if (req.userModel) {
      req.userModel.aiCreditsUsed = (req.userModel.aiCreditsUsed || 0) + 1;
      await req.userModel.save();
    }

    res.json({ success: true, content, creationId: creation._id });
  } catch (error) {
    console.error("Article Generation Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 2. GENERATE BLOG TITLE
export const generateBlogTitle = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.json({ success: false, message: "Prompt/topic is required" });
    }

    const model = getGenAIModel();
    const systemPrompt = `You are a creative blog copywriter. Suggest 5 catchy, SEO-friendly headlines for: "${prompt}". Respond in markdown bullet points.`;
    const result = await model.generateContent(systemPrompt);
    const content = result.response.text();

    const creation = await Creation.create({
      user: req.user._id,
      prompt,
      content,
      type: 'blog-title',
    });

    if (req.userModel) {
      req.userModel.aiCreditsUsed = (req.userModel.aiCreditsUsed || 0) + 1;
      await req.userModel.save();
    }

    res.json({ success: true, content, creationId: creation._id });
  } catch (error) {
    console.error("Blog Title Generation Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 3. GENERATE IMAGE
export const generateImage = async (req, res) => {
  try {
    const { prompt, publish } = req.body;
    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    // Call Pollinations.ai API to generate image
    const response = await axios.get(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`,
      { responseType: "arraybuffer" }
    );

    // Convert response buffer to Base64
    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;

    // Upload to Cloudinary
    let secure_url;
    try {
      const uploadResult = await cloudinary.uploader.upload(base64Image);
      secure_url = uploadResult.secure_url;
    } catch (cloudinaryError) {
      console.warn("Cloudinary upload failed, falling back to direct Pollinations.ai URL:", cloudinaryError.message);
      secure_url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
    }

    // Save creation record in MongoDB
    const creation = await Creation.create({
      user: req.user._id,
      prompt,
      content: secure_url,
      type: 'image',
      publish: publish ?? false,
    });

    if (req.userModel) {
      req.userModel.aiCreditsUsed = (req.userModel.aiCreditsUsed || 0) + 1;
      await req.userModel.save();
    }

    res.json({ success: true, content: secure_url, creationId: creation._id });
  } catch (error) {
    console.error("Image Generation Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 4. REMOVE BACKGROUND
export const removeImageBackground = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.json({ success: false, message: "Please upload an image file" });
    }

    let secure_url;
    try {
      // Upload using Cloudinary background removal effect transformation
      const uploadResult = await cloudinary.uploader.upload(image.path, {
        transformation: [
          {
            effect: "background_removal",
            background_removal: "remove_the_background"
          }
        ]
      });
      secure_url = uploadResult.secure_url;
    } catch (uploadError) {
      console.warn("Cloudinary background removal transform failed, falling back to local base64:", uploadError.message);
      // Clean fallback if Cloudinary add-on is disabled (converts local file to base64)
      const fileBuffer = fs.readFileSync(image.path);
      secure_url = `data:${image.mimetype};base64,${fileBuffer.toString('base64')}`;
    }

    // Save creation record
    const creation = await Creation.create({
      user: req.user._id,
      prompt: 'Remove background from image',
      content: secure_url,
      type: 'image',
    });

    if (req.userModel) {
      req.userModel.aiCreditsUsed = (req.userModel.aiCreditsUsed || 0) + 1;
      await req.userModel.save();
    }

    // Clean up local temp file if it exists
    if (image.path && fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }

    res.json({ success: true, content: secure_url, creationId: creation._id });
  } catch (error) {
    console.error("Background Removal Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 5. RESUME REVIEW
export const resumeReview = async (req, res) => {
  try {
    const resume = req.file;
    if (!resume) {
      return res.json({ success: false, message: "Please upload a resume PDF file" });
    }

    // Parse PDF text content
    const parsedPdf = await pdf(resume.buffer);
    const pdfText = parsedPdf.text;

    if (!pdfText || pdfText.trim().length === 0) {
      return res.json({ success: false, message: "Could not parse text from PDF file. Make sure it is not scanned or empty." });
    }

    const model = getGenAIModel();
    const systemPrompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, formatting, and areas for improvement. Format your response in clean markdown.\n\nResume Content:\n${pdfText}`;
    
    const result = await model.generateContent(systemPrompt);
    const content = result.response.text();

    const creation = await Creation.create({
      user: req.user._id,
      prompt: 'Review uploaded resume PDF',
      content,
      type: 'resume-review',
    });

    if (req.userModel) {
      req.userModel.aiCreditsUsed = (req.userModel.aiCreditsUsed || 0) + 1;
      await req.userModel.save();
    }

    res.json({ success: true, content, creationId: creation._id });
  } catch (error) {
    console.error("Resume Review Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 6. GET USER CREATIONS
export const getUserCreations = async (req, res) => {
  try {
    const creations = await Creation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 7. GET PUBLISHED CREATIONS (Community image feed)
export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await Creation.find({ publish: true, type: 'image' })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 8. TOGGLE LIKE ON CREATION
export const toggleLikeCreation = async (req, res) => {
  try {
    const { id } = req.body;
    const userIdStr = req.user._id.toString();

    const creation = await Creation.findById(id);
    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    creation.likes = updatedLikes;
    await creation.save();

    res.json({ success: true, message, likes: updatedLikes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
