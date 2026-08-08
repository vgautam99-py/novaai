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
  'down-earth': { text: 'text-down-earth-text', border: 'border-down-earth-border/40', bgLight: 'bg-down-earth-light', accent: 'bg-down-earth-accent', marker: 'border-down-earth-border' },
  'soph-pink': { text: 'text-soph-pink-text', border: 'border-soph-pink-border/40', bgLight: 'bg-soph-pink-light', accent: 'bg-soph-pink-accent', marker: 'border-soph-pink-border' },
  'forest-hues': { text: 'text-forest-hues-text', border: 'border-forest-hues-border/40', bgLight: 'bg-forest-hues-light', accent: 'bg-forest-hues-accent', marker: 'border-forest-hues-border' },
  'blue-orange': { text: 'text-blue-orange-text', border: 'border-blue-orange-border/40', bgLight: 'bg-blue-orange-light', accent: 'bg-blue-orange-accent', marker: 'border-blue-orange-border' },
  'navy-gold': { text: 'text-navy-gold-text', border: 'border-navy-gold-border/40', bgLight: 'bg-navy-gold-light', accent: 'bg-navy-gold-accent', marker: 'border-navy-gold-border' },
  'red-gray': { text: 'text-red-gray-text', border: 'border-red-gray-border/40', bgLight: 'bg-red-gray-light', accent: 'bg-red-gray-accent', marker: 'border-red-gray-border' },
  'bold-bright': { text: 'text-bold-bright-text', border: 'border-bold-bright-border/40', bgLight: 'bg-bold-bright-light', accent: 'bg-bold-bright-accent', marker: 'border-bold-bright-border' },
  'minimalist': { text: 'text-minimalist-text', border: 'border-minimalist-border/40', bgLight: 'bg-minimalist-light', accent: 'bg-minimalist-accent', marker: 'border-minimalist-border' },
  'orange-blue': { text: 'text-orange-blue-text', border: 'border-orange-blue-border/40', bgLight: 'bg-orange-blue-light', accent: 'bg-orange-blue-accent', marker: 'border-orange-blue-border' },
  'warm-neutral': { text: 'text-warm-neutral-text', border: 'border-warm-neutral-border/40', bgLight: 'bg-warm-neutral-light', accent: 'bg-warm-neutral-accent', marker: 'border-warm-neutral-border' },
  'royal-purple-blue': { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/40', bgLight: 'bg-royal-purple-blue-light', accent: 'bg-royal-purple-blue-accent', marker: 'border-royal-purple-blue-border' },
  'rosy-charm': { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/40', bgLight: 'bg-rosy-charm-light', accent: 'bg-rosy-charm-accent', marker: 'border-rosy-charm-border' },
  
  // Legacy Fallbacks
  blue: { text: 'text-navy-gold-text', border: 'border-navy-gold-border/40', bgLight: 'bg-navy-gold-light', accent: 'bg-navy-gold-accent', marker: 'border-navy-gold-border' },
  slate: { text: 'text-minimalist-text', border: 'border-minimalist-border/40', bgLight: 'bg-minimalist-light', accent: 'bg-minimalist-accent', marker: 'border-minimalist-border' },
  indigo: { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/40', bgLight: 'bg-royal-purple-blue-light', accent: 'bg-royal-purple-blue-accent', marker: 'border-royal-purple-blue-border' },
  emerald: { text: 'text-forest-hues-text', border: 'border-forest-hues-border/40', bgLight: 'bg-forest-hues-light', accent: 'bg-forest-hues-accent', marker: 'border-forest-hues-border' },
  rose: { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/40', bgLight: 'bg-rosy-charm-light', accent: 'bg-rosy-charm-accent', marker: 'border-rosy-charm-border' },
  violet: { text: 'text-soph-pink-text', border: 'border-soph-pink-border/40', bgLight: 'bg-soph-pink-light', accent: 'bg-soph-pink-accent', marker: 'border-soph-pink-border' },
  amber: { text: 'text-down-earth-text', border: 'border-down-earth-border/40', bgLight: 'bg-down-earth-light', accent: 'bg-down-earth-accent', marker: 'border-down-earth-border' },
};

const TimelineBannerTemplate = ({ data = {} }) => {
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
    <div className="bg-white text-stone-850 p-8 md:p-10 font-sans shadow-lg border border-stone-200 min-h-[11in] w-full text-left leading-relaxed text-xs md:text-sm">
      {/* Top Banner block with light colored background */}
      <div className={`${c.bgLight} border border-stone-200/50 p-6 rounded-xl mb-6 shadow-sm`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
          <div className="text-xs text-stone-500 space-y-1 md:text-right font-light">
            {personalInfo.email && <p><span className="font-semibold text-stone-700">Email:</span> {personalInfo.email}</p>}
            {personalInfo.phone && <p><span className="font-semibold text-stone-700">Phone:</span> {personalInfo.phone}</p>}
            {(personalInfo.location || personalInfo.zipCode || personalInfo.country) && (
              <p><span className="font-semibold text-stone-700">Address:</span> {[personalInfo.location, personalInfo.zipCode, personalInfo.country].filter(Boolean).join(', ')}</p>
            )}
            {socials && socials.length > 0 && (
              <div className="flex flex-wrap md:justify-end gap-x-3 gap-y-1 mt-2">
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
                      className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors text-[10px]"
                    >
                      {getSocialIcon(social.platform, "h-3.5 w-3.5 opacity-85")}
                      <span>{handleId}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile summary */}
      {summary && (
        <div className="mb-6">
          <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-2`}>Objective</h2>
          <p className="text-stone-655 font-light leading-relaxed text-xs">{summary}</p>
        </div>
      )}

      {/* Main Single Column Timeline Section */}
      <div className="space-y-6">
        
        {/* Experience Timeline */}
        {experience.length > 0 && (
          <div>
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-4`}>
              Work History
            </h3>
            <div className="relative pl-5 border-l border-stone-200 space-y-4 ml-2.5">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 ${c.marker}`}></div>
                  
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-xs md:text-sm font-bold text-stone-900">{exp.position}</h4>
                    <span className="text-[10px] text-stone-400 font-semibold shrink-0">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 italic mb-1.5">{exp.company} • {exp.location}</p>
                  <p className="text-stone-600 font-light text-xs whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Timeline */}
        {projects.length > 0 && shouldShowProjects(personalInfo.industry) && (
          <div>
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-4`}>
              Key Projects
            </h3>
            <div className="relative pl-5 border-l border-stone-200 space-y-4 ml-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 ${c.marker}`}></div>
                  
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-xs md:text-sm font-bold text-stone-900">{proj.title}</h4>
                    <span className="text-[10px] text-stone-400 font-semibold shrink-0">{proj.startDate}</span>
                  </div>
                  {proj.role && <p className="text-[11px] font-semibold text-stone-500 italic mt-0.5">{proj.role}</p>}
                  {proj.technologies && (
                    <p className={`text-[10px] ${c.text} uppercase tracking-wider font-semibold mt-0.5`}>
                      Tech stack: {proj.technologies}
                    </p>
                  )}
                  {proj.description && <p className="text-stone-600 text-xs mt-1.5 font-light leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Timeline */}
        {education.length > 0 && (
          <div>
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-4`}>
              Education
            </h3>
            <div className="relative pl-5 border-l border-stone-200 space-y-4 ml-2.5">
              {education.map((edu, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 ${c.marker}`}></div>
                  
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-xs md:text-sm font-bold text-stone-900">{edu.degree}</h4>
                    <span className="text-[10px] text-stone-400 font-semibold shrink-0">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <p className="text-xs text-stone-550 font-light">{edu.school} {edu.location ? `• ${edu.location}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills and Certifications side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-150 pt-4">
          {/* Skills Grid */}
          {skills.length > 0 && (
            <div>
              <h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.text} mb-3`}>
                Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-stone-700 text-[10px] font-semibold bg-stone-50 border border-stone-200 px-2.5 py-0.5 rounded shadow-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Languages */}
          <div className="space-y-4">
            {certifications.length > 0 && (
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.text} mb-3`}>
                  Certifications
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-semibold text-stone-850">{cert.name}</p>
                      <p className="text-[10px] text-stone-500">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.text} mb-2`}>
                  Languages
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {languages.map((lang, idx) => (
                    <span key={idx} className="font-semibold text-stone-700 text-xs">• {lang.name}</span>
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

export default TimelineBannerTemplate;
