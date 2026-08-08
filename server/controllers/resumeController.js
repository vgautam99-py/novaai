import Resume from '../models/Resume.js';

// @desc    Get user's resumes
// @route   GET /api/resumes
// @access  Private
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Ownership check
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this resume' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      user: req.user._id,
    });

    const createdResume = await resume.save();
    res.status(201).json(createdResume);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Ownership check
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this resume' });
    }

    // Update fields
    const fieldsToUpdate = [
      'title',
      'personalInfo',
      'summary',
      'experience',
      'education',
      'projects',
      'skills',
      'certifications',
      'languages',
      'socials',
      'template',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error) {
    console.error('Update Resume error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Ownership check
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this resume' });
    }

    await Resume.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Resume removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
