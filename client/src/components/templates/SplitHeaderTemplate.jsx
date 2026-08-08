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
  'down-earth': { text: 'text-down-earth-text', border: 'border-down-earth-border/30', bgSide: 'bg-down-earth-light/40', bgHeader: 'bg-down-earth-text/10', line: 'border-down-earth-border/40' },
  'soph-pink': { text: 'text-soph-pink-text', border: 'border-soph-pink-border/30', bgSide: 'bg-soph-pink-light/40', bgHeader: 'bg-soph-pink-text/10', line: 'border-soph-pink-border/40' },
  'forest-hues': { text: 'text-forest-hues-text', border: 'border-forest-hues-border/30', bgSide: 'bg-forest-hues-light/40', bgHeader: 'bg-forest-hues-text/10', line: 'border-forest-hues-border/40' },
  'blue-orange': { text: 'text-blue-orange-text', border: 'border-blue-orange-border/30', bgSide: 'bg-blue-orange-light/40', bgHeader: 'bg-blue-orange-text/10', line: 'border-blue-orange-border/40' },
  'navy-gold': { text: 'text-navy-gold-text', border: 'border-navy-gold-border/30', bgSide: 'bg-navy-gold-light/40', bgHeader: 'bg-navy-gold-text/10', line: 'border-navy-gold-border/40' },
  'red-gray': { text: 'text-red-gray-text', border: 'border-red-gray-border/30', bgSide: 'bg-red-gray-light/40', bgHeader: 'bg-red-gray-text/10', line: 'border-red-gray-border/40' },
  'bold-bright': { text: 'text-bold-bright-text', border: 'border-bold-bright-border/30', bgSide: 'bg-bold-bright-light/40', bgHeader: 'bg-bold-bright-text/10', line: 'border-bold-bright-border/40' },
  'minimalist': { text: 'text-minimalist-text', border: 'border-minimalist-border/30', bgSide: 'bg-minimalist-light/40', bgHeader: 'bg-minimalist-text/10', line: 'border-minimalist-border/40' },
  'orange-blue': { text: 'text-orange-blue-text', border: 'border-orange-blue-border/30', bgSide: 'bg-orange-blue-light/40', bgHeader: 'bg-orange-blue-text/10', line: 'border-orange-blue-border/40' },
  'warm-neutral': { text: 'text-warm-neutral-text', border: 'border-warm-neutral-border/30', bgSide: 'bg-warm-neutral-light/40', bgHeader: 'bg-warm-neutral-text/10', line: 'border-warm-neutral-border/40' },
  'royal-purple-blue': { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/30', bgSide: 'bg-royal-purple-blue-light/40', bgHeader: 'bg-royal-purple-blue-text/10', line: 'border-royal-purple-blue-border/40' },
  'rosy-charm': { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/30', bgSide: 'bg-rosy-charm-light/40', bgHeader: 'bg-rosy-charm-text/10', line: 'border-rosy-charm-border/40' },
  
  // Legacy Fallbacks
  blue: { text: 'text-navy-gold-text', border: 'border-navy-gold-border/30', bgSide: 'bg-navy-gold-light/40', bgHeader: 'bg-navy-gold-text/10', line: 'border-navy-gold-border/40' },
  slate: { text: 'text-minimalist-text', border: 'border-minimalist-border/30', bgSide: 'bg-minimalist-light/40', bgHeader: 'bg-minimalist-text/10', line: 'border-minimalist-border/40' },
  indigo: { text: 'text-royal-purple-blue-text', border: 'border-royal-purple-blue-border/30', bgSide: 'bg-royal-purple-blue-light/40', bgHeader: 'bg-royal-purple-blue-text/10', line: 'border-royal-purple-blue-border/40' },
  emerald: { text: 'text-forest-hues-text', border: 'border-forest-hues-border/30', bgSide: 'bg-forest-hues-light/40', bgHeader: 'bg-forest-hues-text/10', line: 'border-forest-hues-border/40' },
  rose: { text: 'text-rosy-charm-text', border: 'border-rosy-charm-border/30', bgSide: 'bg-rosy-charm-light/40', bgHeader: 'bg-rosy-charm-text/10', line: 'border-rosy-charm-border/40' },
  violet: { text: 'text-soph-pink-text', border: 'border-soph-pink-border/30', bgSide: 'bg-soph-pink-light/40', bgHeader: 'bg-soph-pink-text/10', line: 'border-soph-pink-border/40' },
  amber: { text: 'text-down-earth-text', border: 'border-down-earth-border/30', bgSide: 'bg-down-earth-light/40', bgHeader: 'bg-down-earth-text/10', line: 'border-down-earth-border/40' },
};

const SplitHeaderTemplate = ({ data = {} }) => {
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
    <div className="bg-white text-stone-800 shadow-lg border border-stone-200 min-h-[11in] w-full text-left leading-relaxed text-xs md:text-sm flex flex-col">
      {/* Split Header Block */}
      <div className="grid grid-cols-12 border-b border-stone-150">
        {/* Left header: picture frame placeholder */}
        <div className="col-span-4 p-6 flex items-center justify-center bg-stone-50 border-r border-stone-150">
          {personalInfo.photo ? (
            <img 
              src={personalInfo.photo} 
              alt="Profile" 
              className="w-24 h-24 border border-stone-300 object-cover shadow-sm rounded-xl"
            />
          ) : (
            <div className="w-24 h-24 border border-stone-300 bg-white flex items-center justify-center shadow-inner rounded-xl">
              <span className={`text-3xl font-extrabold uppercase ${c.text} opacity-40 font-mono`}>
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Right header: Name card with solid accent tint */}
        <div className={`col-span-8 p-6 ${c.bgHeader} flex flex-col justify-center gap-2`}>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight leading-none font-sans uppercase">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className={`text-xs font-bold uppercase tracking-widest ${c.text} mt-1.5`}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          {summary && (
            <p className="text-[11px] text-stone-655 font-light leading-relaxed truncate-3-lines mt-1">
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-grow grid grid-cols-12">
        {/* Left column sidebar */}
        <div className={`col-span-4 p-6 pt-6 ${c.bgSide} border-r border-stone-150 flex flex-col gap-6`}>
          {/* Contact Details */}
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-2.5">Contact</h2>
            <div className="space-y-2 text-[11px] text-stone-600">
              {personalInfo.phone && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Phone</span>{personalInfo.phone}</p>}
              {personalInfo.email && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Email</span>{personalInfo.email}</p>}
              {(personalInfo.location || personalInfo.zipCode || personalInfo.country) && (
                <p>
                  <span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Address</span>
                  {[personalInfo.location, personalInfo.zipCode, personalInfo.country].filter(Boolean).join(', ')}
                </p>
              )}
              {personalInfo.dateOfBirth && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Date of Birth</span>{personalInfo.dateOfBirth}</p>}
              {personalInfo.gender && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Gender</span>{personalInfo.gender}</p>}
              {personalInfo.maritalStatus && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Status</span>{personalInfo.maritalStatus}</p>}
              {personalInfo.industry && <p><span className="font-semibold block text-[9px] uppercase tracking-wider text-stone-400">Industry</span>{personalInfo.industry}</p>}
            </div>
          </div>

          {/* Social Icons */}
          {socials && socials.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-2.5">Links</h2>
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

          {/* Technical Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-2.5">Skills</h2>
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
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b border-stone-200 pb-1 mb-2">Languages</h2>
              <div className="space-y-1 text-xs">
                {languages.map((lang, idx) => (
                  <p key={idx} className="font-semibold text-stone-700">• {lang.name}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column details */}
        <div className="col-span-8 p-6 md:p-8 space-y-6">
          {/* Work Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className={`text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b ${c.line} pb-1 mb-3.5`}>
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-xs md:text-sm font-bold text-stone-900">{exp.position}</h3>
                      <span className={`text-[10px] font-bold ${c.text} shrink-0`}>
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

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className={`text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b ${c.line} pb-1 mb-3`}>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-xs md:text-sm font-bold text-stone-900">{edu.degree}</h3>
                      <span className="text-[10px] text-stone-400 font-medium shrink-0">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <p className="text-xs text-stone-500 font-light">{edu.school} {edu.location ? `• ${edu.location}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && shouldShowProjects(personalInfo.industry) && (
            <div>
              <h2 className={`text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b ${c.line} pb-1 mb-3`}>
                Key Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs md:text-sm font-bold text-stone-900">{proj.title}</h3>
                      <span className="text-[10px] text-stone-400 font-medium shrink-0">{proj.startDate}</span>
                    </div>
                    {proj.role && <p className="text-xs font-semibold text-stone-500 italic mt-0.5">{proj.role}</p>}
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

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className={`text-[10px] font-bold uppercase tracking-widest text-stone-850 border-b ${c.line} pb-1 mb-3`}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="text-xs font-light text-stone-600">
                    <p className="font-semibold text-stone-855">{cert.name}</p>
                    <p className="text-[10px] text-stone-500">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitHeaderTemplate;
