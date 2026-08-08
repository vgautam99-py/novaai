import React from 'react';
import { Github, Linkedin, Globe, Instagram, Facebook, Youtube, Link } from 'lucide-react';

const getSocialIcon = (platform, className = "h-3 w-3") => {
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

const TimelineSidebarTemplate = ({ data = {} }) => {
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
    <div className="bg-white text-stone-850 shadow-lg border border-stone-200 min-h-[11in] w-full text-left leading-relaxed text-xs md:text-sm grid grid-cols-12">
      {/* Left Column Sidebar */}
      <div className={`col-span-4 p-6 ${c.bgLight} border-r border-stone-150 flex flex-col gap-6`}>
        {/* Profile Circle Placeholder (Image 1 Style 1) */}
        <div className="flex flex-col items-center text-center">
          {personalInfo.photo ? (
            <img 
              src={personalInfo.photo} 
              alt="Profile" 
              className={`w-20 h-20 rounded-full object-cover border-2 ${c.border} shadow-sm`}
            />
          ) : (
            <div className={`w-20 h-20 rounded-full border-2 ${c.border} bg-white flex items-center justify-center shadow-inner`}>
              <span className={`text-xl font-bold uppercase ${c.text}`}>
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-1 mb-2.5">Contact</h2>
          <div className="space-y-2 text-stone-600 text-[11px]">
            {personalInfo.phone && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Phone</span>{personalInfo.phone}</p>}
            {personalInfo.email && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Email</span>{personalInfo.email}</p>}
            {(personalInfo.location || personalInfo.zipCode || personalInfo.country) && (
              <p>
                <span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Address</span>
                {[personalInfo.location, personalInfo.zipCode, personalInfo.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        {socials && socials.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-1 mb-2.5">Social Profiles</h2>
            <div className="space-y-2">
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
                    className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors text-[11px]"
                  >
                    {getSocialIcon(social.platform, `h-3 w-3 ${c.text}`)}
                    <span className="truncate">{handleId}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Education block */}
        {education.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-1 mb-2.5">Education</h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[11px]">
                  <p className="font-semibold text-stone-850">{edu.degree}</p>
                  <p className="text-stone-500 font-light">{edu.school}</p>
                  <p className="text-[9px] text-stone-400 font-medium">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-1 mb-2.5">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <span key={idx} className={`text-[10px] font-semibold ${c.text} bg-white border border-stone-200 px-2 py-0.5 rounded shadow-sm`}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-1 mb-2">Languages</h2>
            <div className="space-y-1 text-[11px]">
              {languages.map((lang, idx) => (
                <p key={idx} className="font-semibold text-stone-700">• {lang.name}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column Core Details */}
      <div className="col-span-8 p-6 md:p-8 flex flex-col gap-6">
        {/* Name and Job Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight uppercase font-sans">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className={`text-xs font-semibold uppercase tracking-widest ${c.text} mt-1`}>
              {personalInfo.jobTitle}
            </p>
          )}
          
          {/* Metadata Block under Title */}
          {(personalInfo.dateOfBirth || personalInfo.gender || personalInfo.maritalStatus || personalInfo.industry) && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-stone-400 mt-2 italic">
              {personalInfo.dateOfBirth && <span>DOB: {personalInfo.dateOfBirth}</span>}
              {personalInfo.gender && <span>Gender: {personalInfo.gender}</span>}
              {personalInfo.maritalStatus && <span>Status: {personalInfo.maritalStatus}</span>}
              {personalInfo.industry && <span>Industry: {personalInfo.industry}</span>}
            </div>
          )}
        </div>

        {/* Executive summary */}
        {summary && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-2">Profile</h2>
            <p className="text-stone-600 font-light leading-relaxed text-xs">{summary}</p>
          </div>
        )}

        {/* Work Experience with Timeline indicators */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-4">Experience</h2>
            <div className="relative pl-5 border-l border-stone-200 space-y-5 ml-2.5">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 ${c.marker}`}></div>
                  
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-xs md:text-sm font-bold text-stone-900">{exp.position}</h3>
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

        {/* Projects Section */}
        {projects.length > 0 && shouldShowProjects(personalInfo.industry) && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-4">Projects</h2>
            <div className="relative pl-5 border-l border-stone-200 space-y-4 ml-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 ${c.marker}`}></div>
                  
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-xs md:text-sm font-bold text-stone-900">{proj.title}</h3>
                    <span className="text-[10px] text-stone-400 font-semibold shrink-0">{proj.startDate}</span>
                  </div>
                  {proj.role && <p className="text-[11px] font-semibold text-stone-500 italic mt-0.5">{proj.role}</p>}
                  {proj.technologies && (
                    <p className={`text-[10px] ${c.text} uppercase tracking-wider font-semibold mt-0.5`}>
                      Technologies: {proj.technologies}
                    </p>
                  )}
                  {proj.description && <p className="text-stone-600 text-xs mt-1.5 font-light leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Block */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-3">Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-xs bg-stone-50 border border-stone-200/50 p-2 rounded-lg">
                  <p className="font-semibold text-stone-800">{cert.name}</p>
                  <p className="text-[10px] text-stone-500">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineSidebarTemplate;
