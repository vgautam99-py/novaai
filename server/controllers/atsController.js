import pdf from 'pdf-parse';
import Resume from '../models/Resume.js';
import { analyzeResumeATS, generateAICoverLetter } from '../services/geminiService.js';

// @desc    Analyze uploaded PDF resume against a Job Description
// @route   POST /api/ats/check
// @access  Private
export const checkATS = async (req, res) => {
  const { jobDescription } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a PDF resume file' });
  }
  if (!jobDescription) {
    return res.status(400).json({ success: false, message: 'Please provide a job description' });
  }

  try {
    // Parse PDF text from Buffer
    const parsedPdf = await pdf(req.file.buffer);
    const resumeText = parsedPdf.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Could not extract text from the PDF. Make sure it is not scanned or empty.' });
    }

    // Call Gemini ATS analysis service
    const report = await analyzeResumeATS(resumeText, jobDescription);
    
    // Save credit usage
    if (req.userModel) {
      req.userModel.aiCreditsUsed = (req.userModel.aiCreditsUsed || 0) + 1;
      await req.userModel.save();
    }
    
    res.json({ success: true, ...report });
  } catch (error) {
    console.error('ATS check error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate Cover Letter from a selected Resume details and Job Description
// @route   POST /api/ats/cover-letter
// @access  Private
export const generateCoverLetter = async (req, res) => {
  const { resumeId, jobDescription } = req.body;

  if (!resumeId || !jobDescription) {
    return res.status(400).json({ success: false, message: 'Please select a resume and paste a job description.' });
  }

  try {
    // Fetch resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Selected resume not found' });
    }

    // Ownership check
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to use this resume' });
    }

    // Compile resume details as a clean, text block for Gemini context
    const personal = resume.personalInfo || {};
    const summary = resume.summary || '';
    const experienceText = (resume.experience || [])
      .map(exp => `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'}): ${exp.description}`)
      .join('\n');
    const educationText = (resume.education || [])
      .map(edu => `${edu.degree} in ${edu.fieldOfStudy} at ${edu.school}`)
      .join('\n');
    const projectsText = (resume.projects || [])
      .map(proj => `${proj.title} (${proj.role}): ${proj.description}`)
      .join('\n');
    const skillsText = (resume.skills || []).map(s => s.name).join(', ');

    const resumeDetailsText = `
      Name: ${personal.fullName || 'Candidate'}
      Target Role: ${personal.jobTitle || ''}
      Summary: ${summary}
      Work History:
      ${experienceText}
      Education:
      ${educationText}
      Projects:
      ${projectsText}
      Skills: ${skillsText}
    `;

    // Call Gemini AI Cover Letter generator
    const coverLetter = await generateAICoverLetter(resumeDetailsText, jobDescription);
    
    // Save credit usage
    if (req.userModel) {
      req.userModel.aiCreditsUsed = (req.userModel.aiCreditsUsed || 0) + 1;
      await req.userModel.save();
    }
    
    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
