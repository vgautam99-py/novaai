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
  'down-earth': { text: 'text-down-earth-text', border: 'border-down-earth-border/40', bgHeader: 'bg-down-earth-light', line: 'border-down-earth-border/30' },
  'soph-pink': { text: 'text-soph-pink-text', border: 'border-soph-pink-border/40', bgHeader: 'bg-soph-pink-light', line: 'border-soph-pink-border/30' },
  'forest-hues': { text: 'text-forest-hues-text', border: 'border-forest-hues-border/40', bgHeader: 'bg-forest-hues-light', line: 'border-forest-hues-border/30' },
  'blue-orange': { text: 'text-blue-orange-text', border: 'border-blue-orange-border/40', bgHeader: 'bg-blue-orange-light', line: 'border-blue-orange-border/30' },
  'navy-gold': { text: 'text-navy-gold-text', border: 'border-navy-gold-border/40', bgHeader: 'bg-navy-gold-light', line: 'border-navy-gold-border/30' },
  'red-gray': { text: 'text-red-gray-text', border: 'border-red-gray-border/40', bgHeader: 'bg-red-gray-light', line: 'border-red-gray-border/30' },
  'bold-bright': { text: 'text-bold-bright-text', border: 'border-bold-bright-border/40', bgHeader: 'bg-bold-bright-light', line: 'border-bold-bright-border/30' },
  'minimalist': { text: 'text-minimalist-text', border: 'border-minimalist-border/40', bgHeader: 'bg-minimalist-light', line: 'border-minimalist-border/30' },
  'orange-blue': { text: 'text-orange-blue-text', border: 'border-orange-blue-border/40', bgHeader: 'bg-orange-blue-light', line: 'border-orange-blue-border/30' },
  'warm-neutral': { text: 'text-warm-neutral-text', border: 'border-warm-neutral-border/40', bgHeader: 'bg-warm-neutral-light', line: 'border-warm-neutral-border/30' },
  'royal-purple-blue': { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/40', bgHeader: 'bg-royal-purple-blue-light', line: 'border-royal-purple-blue-border/30' },
  'rosy-charm': { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/40', bgHeader: 'bg-rosy-charm-light', line: 'border-rosy-charm-border/30' },
  
  // Legacy Fallbacks
  blue: { text: 'text-navy-gold-text', border: 'border-navy-gold-border/40', bgHeader: 'bg-navy-gold-light', line: 'border-navy-gold-border/30' },
  slate: { text: 'text-minimalist-text', border: 'border-minimalist-border/40', bgHeader: 'bg-minimalist-light', line: 'border-minimalist-border/30' },
  indigo: { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/40', bgHeader: 'bg-royal-purple-blue-light', line: 'border-royal-purple-blue-border/30' },
  emerald: { text: 'text-forest-hues-text', border: 'border-forest-hues-border/40', bgHeader: 'bg-forest-hues-light', line: 'border-forest-hues-border/30' },
  rose: { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/40', bgHeader: 'bg-rosy-charm-light', line: 'border-rosy-charm-border/30' },
  violet: { text: 'text-soph-pink-text', border: 'border-soph-pink-border/40', bgHeader: 'bg-soph-pink-light', line: 'border-soph-pink-border/30' },
  amber: { text: 'text-down-earth-text', border: 'border-down-earth-border/40', bgHeader: 'bg-down-earth-light', line: 'border-down-earth-border/30' },
};

const HeaderOverlayTemplate = ({ data = {} }) => {
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
      {/* Header Overlay Block (Image 2 style: Jeremy Torres style but soft light themed) */}
      <div className={`${c.bgHeader} border border-stone-200/50 rounded-xl p-6 mb-6`}>
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Objective Summary & Name */}
          <div className="col-span-8 space-y-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight leading-none uppercase">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              {personalInfo.jobTitle && (
                <p className={`text-xs font-bold uppercase tracking-widest ${c.text} mt-1`}>
                  {personalInfo.jobTitle}
                </p>
              )}
            </div>
            {summary && <p className="text-[11px] text-stone-600 leading-relaxed font-light">{summary}</p>}
          </div>

          {/* Picture Box container overlapping right */}
          <div className="col-span-4 flex justify-end">
            {personalInfo.photo ? (
              <img 
                src={personalInfo.photo} 
                alt="Profile" 
                className="w-20 h-20 border border-stone-300 object-cover shadow rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 border border-stone-300 bg-white flex items-center justify-center shadow rounded-lg">
                <span className={`text-2xl font-bold uppercase ${c.text} opacity-35 font-mono`}>
                  {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'U'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact credentials in footer of header */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-stone-500 mt-4 border-t border-stone-200/60 pt-3">
          {personalInfo.email && <span className="flex items-center gap-1"><strong>Email:</strong> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><strong>Phone:</strong> {personalInfo.phone}</span>}
          {(personalInfo.location || personalInfo.zipCode || personalInfo.country) && (
            <span className="flex items-center gap-1"><strong>Address:</strong> {[personalInfo.location, personalInfo.zipCode, personalInfo.country].filter(Boolean).join(', ')}</span>
          )}
        </div>
      </div>

      {/* Two Column Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-4`}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-3 border-l-2 border-stone-200">
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
              <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-4`}>
                Projects & Portfolio
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="relative pl-3 border-l-2 border-stone-200">
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
                    {proj.description && <p className="text-stone-600 text-xs mt-1.5 font-light leading-relaxed">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3 width) */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-3`}>
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
              <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-3`}>
                Skills & Tools
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-stone-700 text-[10px] font-semibold bg-stone-50 border border-stone-200 px-2 py-0.5 rounded shadow-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social links */}
          {socials && socials.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-3`}>
                Links
              </h2>
              <div className="space-y-1.5">
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
                      {getSocialIcon(social.platform, `h-3.5 w-3.5 ${c.text}`)}
                      <span className="truncate">{handleId}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-3`}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-semibold text-stone-800">{cert.name}</p>
                    <p className="text-[10px] text-stone-450">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${c.text} border-b border-stone-200 pb-1 mb-3`}>
                Languages
              </h2>
              <div className="space-y-1 text-xs">
                {languages.map((lang, idx) => (
                  <p key={idx} className="font-semibold text-stone-750">• {lang.name}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderOverlayTemplate;
