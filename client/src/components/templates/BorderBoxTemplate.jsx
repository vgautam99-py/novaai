import React from 'react';
import { Github, Linkedin, Globe, Instagram, Facebook, Youtube, Link } from 'lucide-react';

const getSocialIcon = (platform, className = "h-3.5 w-3.5") => {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'website':
      return <Globe className={className} />;
    default:
      return <Link className={className} />;
  }
};

const formatSocialHandle = (platform, url) => {
  if (!url) return '';
  let cleanUrl = url.trim().replace(/\/$/, '');
  
  if (platform === 'Website' || platform === 'Others') {
    return cleanUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
  }
  
  const parts = cleanUrl.split('/');
  return parts[parts.length - 1] || cleanUrl;
};

const shouldShowProjects = (industry) => {
  if (!industry) return true;
  const showList = [
    'IT & Software',
    'Manufacturing & Automation',
    'Education & Training',
    'Sales & Marketing'
  ];
  return showList.includes(industry);
};

const colorsMapping = {
  // New Themes
  'down-earth': { text: 'text-down-earth-text', border: 'border-down-earth-border/40', bgLight: 'bg-down-earth-light', line: 'border-down-earth-border/30' },
  'soph-pink': { text: 'text-soph-pink-text', border: 'border-soph-pink-border/40', bgLight: 'bg-soph-pink-light', line: 'border-soph-pink-border/30' },
  'forest-hues': { text: 'text-forest-hues-text', border: 'border-forest-hues-border/40', bgLight: 'bg-forest-hues-light', line: 'border-forest-hues-border/30' },
  'blue-orange': { text: 'text-blue-orange-text', border: 'border-blue-orange-border/40', bgLight: 'bg-blue-orange-light', line: 'border-blue-orange-border/30' },
  'navy-gold': { text: 'text-navy-gold-text', border: 'border-navy-gold-border/40', bgLight: 'bg-navy-gold-light', line: 'border-navy-gold-border/30' },
  'red-gray': { text: 'text-red-gray-text', border: 'border-red-gray-border/40', bgLight: 'bg-red-gray-light', line: 'border-red-gray-border/30' },
  'bold-bright': { text: 'text-bold-bright-text', border: 'border-bold-bright-border/40', bgLight: 'bg-bold-bright-light', line: 'border-bold-bright-border/30' },
  'minimalist': { text: 'text-minimalist-text', border: 'border-minimalist-border/40', bgLight: 'bg-minimalist-light', line: 'border-minimalist-border/30' },
  'orange-blue': { text: 'text-orange-blue-text', border: 'border-orange-blue-border/40', bgLight: 'bg-orange-blue-light', line: 'border-orange-blue-border/30' },
  'warm-neutral': { text: 'text-warm-neutral-text', border: 'border-warm-neutral-border/40', bgLight: 'bg-warm-neutral-light', line: 'border-warm-neutral-border/30' },
  'royal-purple-blue': { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/40', bgLight: 'bg-royal-purple-blue-light', line: 'border-royal-purple-blue-border/30' },
  'rosy-charm': { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/40', bgLight: 'bg-rosy-charm-light', line: 'border-rosy-charm-border/30' },
  
  // Legacy Fallbacks
  blue: { text: 'text-navy-gold-text', border: 'border-navy-gold-border/40', bgLight: 'bg-navy-gold-light', line: 'border-navy-gold-border/30' },
  slate: { text: 'text-minimalist-text', border: 'border-minimalist-border/40', bgLight: 'bg-minimalist-light', line: 'border-minimalist-border/30' },
  indigo: { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/40', bgLight: 'bg-royal-purple-blue-light', line: 'border-royal-purple-blue-border/30' },
  emerald: { text: 'text-forest-hues-text', border: 'border-forest-hues-border/40', bgLight: 'bg-forest-hues-light', line: 'border-forest-hues-border/30' },
  rose: { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/40', bgLight: 'bg-rosy-charm-light', line: 'border-rosy-charm-border/30' },
  violet: { text: 'text-soph-pink-text', border: 'border-soph-pink-border/40', bgLight: 'bg-soph-pink-light', line: 'border-soph-pink-border/30' },
  amber: { text: 'text-down-earth-text', border: 'border-down-earth-border/40', bgLight: 'bg-down-earth-light', line: 'border-down-earth-border/30' },
};

const BorderBoxTemplate = ({ data = {} }) => {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    socials = [],
    themeColor = 'blue',
  } = data;

  const c = colorsMapping[themeColor] || colorsMapping.blue;

  return (
    <div className="bg-white text-stone-850 p-6 md:p-8 font-sans shadow-lg border border-stone-200 min-h-[11in] w-full text-left leading-relaxed text-xs md:text-sm">
      {/* Outer rounded border layout */}
      <div className="border border-stone-200 rounded-2xl p-6 md:p-8 min-h-[calc(11in-64px)] flex flex-col justify-between">
        
        {/* Header Block */}
        <div className="border-b border-stone-150 pb-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              {personalInfo.photo && (
                <img 
                  src={personalInfo.photo} 
                  alt="Profile" 
                  className={`w-16 h-16 rounded-full object-cover border-2 ${c.border} shadow-sm`}
                />
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                {personalInfo.jobTitle && (
                  <p className={`text-xs font-bold uppercase tracking-widest ${c.text} mt-1.5`}>
                    {personalInfo.jobTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Top Right Address Card */}
            <div className="text-left md:text-right text-xs text-stone-500 space-y-1">
              {personalInfo.email && <p><span className="font-semibold text-stone-700">Email:</span> {personalInfo.email}</p>}
              {personalInfo.phone && <p><span className="font-semibold text-stone-700">Phone:</span> {personalInfo.phone}</p>}
              {(personalInfo.location || personalInfo.zipCode || personalInfo.country) && (
                <p><span className="font-semibold text-stone-700">Address:</span> {[personalInfo.location, personalInfo.zipCode, personalInfo.country].filter(Boolean).join(', ')}</p>
              )}
            </div>
          </div>

          {/* Social handle badges under name */}
          {socials && socials.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {socials.map((social, sIdx) => {
                if (!social.url) return null;
                const handleId = formatSocialHandle(social.platform, social.url);
                const hrefUrl = social.url.startsWith('http') ? social.url : `https://${social.url}`;
                return (
                  <a
                    key={sIdx}
                    href={hrefUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-md text-[10px] text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors"
                  >
                    {getSocialIcon(social.platform, "h-3 w-3")}
                    <span>{handleId}</span>
                  </a>
                );
              })}
            </div>
          )}

          {/* Core metadata details */}
          {(personalInfo.dateOfBirth || personalInfo.gender || personalInfo.maritalStatus || personalInfo.industry) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-stone-450 mt-3 font-medium uppercase tracking-wider">
              {personalInfo.dateOfBirth && <span>DOB: {personalInfo.dateOfBirth}</span>}
              {personalInfo.gender && <span>Gender: {personalInfo.gender}</span>}
              {personalInfo.maritalStatus && <span>Status: {personalInfo.maritalStatus}</span>}
              {personalInfo.industry && <span>Industry: {personalInfo.industry}</span>}
            </div>
          )}
        </div>

        {/* Profile Summary text */}
        {summary && (
          <div className="mb-6">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-2`}>Executive Summary</h2>
            <p className="text-stone-600 font-light leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Split grid columns */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left core column (Experience, Education, Projects) */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-150 pb-1 mb-4`}>
                  Professional History
                </h2>
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-xs md:text-sm font-bold text-stone-900">{exp.position}</h3>
                        <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider shrink-0">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 italic mb-1.5">{exp.company} • {exp.location}</p>
                      <p className="text-stone-600 font-light text-xs whitespace-pre-line leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && shouldShowProjects(personalInfo.industry) && (
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-150 pb-1 mb-4`}>
                  Key Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs md:text-sm font-bold text-stone-900">{proj.title}</h3>
                        <span className="text-[10px] text-stone-400 font-semibold shrink-0">{proj.startDate}</span>
                      </div>
                      {proj.role && <p className="text-xs font-semibold text-stone-500 italic mt-0.5">{proj.role}</p>}
                      {proj.technologies && (
                        <p className={`text-[10px] ${c.text} uppercase tracking-wider font-semibold mt-0.5`}>
                          Tech: {proj.technologies}
                        </p>
                      )}
                      {proj.description && <p className="text-stone-600 text-xs mt-1 font-light leading-relaxed">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column sidebar */}
          <div className="col-span-12 md:col-span-4 space-y-6 border-t md:border-t-0 md:border-l border-stone-150 pt-6 md:pt-0 md:pl-6">
            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} pb-1 mb-3`}>
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold text-stone-900">{edu.degree}</h3>
                      <p className="text-xs text-stone-600 mt-0.5">{edu.school}</p>
                      <p className="text-[10px] text-stone-400 font-medium">{edu.startDate} – {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} pb-1 mb-3`}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="text-stone-700 text-[10px] font-semibold bg-stone-50 border border-stone-200 px-2.5 py-0.5 rounded shadow-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} pb-1 mb-3`}>
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-semibold text-stone-850">{cert.name}</p>
                      <p className="text-[10px] text-stone-500">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} pb-1 mb-3`}>
                  Languages
                </h2>
                <div className="space-y-1 text-xs">
                  {languages.map((lang, idx) => (
                    <p key={idx} className="font-semibold text-stone-700">• {lang.name}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BorderBoxTemplate;
