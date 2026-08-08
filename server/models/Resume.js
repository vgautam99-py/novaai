import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const educationSchema = new mongoose.Schema({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  technologies: { type: String, default: '' }, // Comma separated tags
});

const skillSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  level: { type: String, default: 'Intermediate' }, // Beginner, Intermediate, Expert
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
});

const languageSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  proficiency: { type: String, default: '' }, // Professional, Native, etc.
});

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, default: 'Website' },
  customName: { type: String, default: '' },
  url: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      photo: { type: String, default: '' },
      website: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      location: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
      dateOfBirth: { type: String, default: '' },
      maritalStatus: { type: String, default: '' },
      industry: { type: String, default: '' },
      gender: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    socials: [socialLinkSchema],
    template: { type: String, default: 'modern' },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
