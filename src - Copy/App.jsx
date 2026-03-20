import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Github, BookOpen, ExternalLink, Mail, Linkedin, Terminal, ChevronDown, Video, Cpu, Globe, Award, Briefcase, GraduationCap, FileText, Calendar, Bell, ArrowLeft, ArrowRight } from 'lucide-react';

/* --- PLEXUS BACKGROUND COMPONENT ---
  This component renders the interactive particle network (Plexus) effect.
  It uses HTML5 Canvas for high performance without video assets.
*/
const PlexusBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Configuration
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const mouseDistance = 200;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const mouse = { x: null, y: null };

    // Handle Resize
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    // Handle Mouse
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // Reduced velocity for slower animation
        this.vx = (Math.random() - 0.1) * 0.1;
        this.vy = (Math.random() - 0.1) * 0.1;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 1;
            const directionY = forceDirectionY * force * 1;

            this.vx -= directionX * 0.05;
            this.vy -= directionY * 0.05;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 255, 218, 0.7)'; // Cyan/Teal color
        ctx.fill();
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    function connectParticles() {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            opacityValue = 1 - (distance / connectionDistance);
            ctx.strokeStyle = 'rgba(100, 255, 218,' + opacityValue * 0.2 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-slate-900"
    />
  );
};

/* --- DATA & CONTENT --- */

const NAV_LINKS = [
  { name: 'About', href: '#about', isExternal: false },
  { name: 'News', href: '#news', isExternal: false },
  { name: 'Research', href: '#research', isExternal: false },
  { name: 'Projects', href: '#projects', isExternal: false },
  { name: 'Teaching', href: '#teaching', isExternal: false },
  { name: 'Contact', href: '#contact', isExternal: false },
  { name: 'CV', href: 'cv.pdf', isExternal: true },
];

const NEWS_ITEMS = [
  {
    id: 1,
    date: "Mar 2025",
    title: "Paper Accepted at CVPR 2025",
    desc: "Our 'Gradient-Guided Annealing for Domain Generalization' paper has been accepted in CVPR 2025!",
    image: "/api/placeholder/800/400",
    content: `
      <p class="mb-4">We are thrilled to announce that our latest work, "Gradient-Guided Annealing for Domain Generalization," has been accepted for publication at the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2025.</p>
      <p class="mb-4">Domain Generalization (DG) remains a critical challenge in deploying machine learning models to the wild. In this paper, we propose a novel optimization strategy that leverages gradient guidance to simulated annealing processes, effectively navigating the loss landscape to find flatter minima that generalize better across unseen domains.</p>
      <h3 class="text-xl font-bold text-white mt-6 mb-3">Key Contributions</h3>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-300">
        <li>A novel hybrid optimization algorithm combining SGD with simulated annealing concepts.</li>
        <li>Theoretical analysis proving convergence bounds in non-convex landscapes.</li>
        <li>State-of-the-art results on DomainBed, exceeding previous baselines by 2.4% on average.</li>
      </ul>
      <p>We look forward to presenting this work in person and discussing the future of robust AI systems.</p>
    `
  },
  {
    id: 2,
    date: "Dec 2024",
    title: "New Paper Accepted at IEEE Access",
    desc: "Our research paper named “On the Out-Of-Distribution Robustness of Self-Supervised Representation Learning for Phonocardiogram Signals” got accepted in IEEE Access.",
    image: "/api/placeholder/800/400",
    content: `
      <p class="mb-4">Our latest research on biosignals has been accepted in IEEE Access. The paper, titled “On the Out-Of-Distribution Robustness of Self-Supervised Representation Learning for Phonocardiogram Signals”, explores how self-supervised learning can improve the reliability of heart sound classification models.</p>
      <p>Phonocardiograms (PCGs) are often collected in noisy environments with varying recording devices. We demonstrate that standard supervised models fail to generalize to new hospitals or devices, whereas SSL pre-training provides robust feature representations that maintain performance even under significant distribution shifts.</p>
    `
  },
  {
    id: 3,
    date: "Sep 2024",
    title: "Paper presentation at SETN 2024",
    desc: "Recently presented our short-paper “CycleMix: Mixing Source Domains for Domain Generalization in Style-Dependent Data” in SETN 2024.",
    image: "/api/placeholder/800/400",
    content: `
      <p class="mb-4">I had the pleasure of presenting our work "CycleMix" at the 13th Hellenic Conference on Artificial Intelligence (SETN 2024). CycleMix addresses the problem of style-dependent domain shifts by mixing source domains in a cyclic consistency framework.</p>
      <p>The conference provided an excellent platform to discuss the nuances of domain adaptation vs. generalization with fellow researchers in the Greek AI community.</p>
    `
  },
  {
    id: 4,
    date: "Mar 2024",
    title: "Paper Accepted at IEEE TAI",
    desc: "Our paper “Multi-Scale and Multi-Layer Contrastive Learning for Domain Generalization”, got accepted and is now published at the IEEE Transactions on Artificial Intelligence journal.",
    image: "/api/placeholder/800/400",
    content: `
      <p class="mb-4">We are happy to share that our work on "Multi-Scale and Multi-Layer Contrastive Learning" is now published in IEEE Transactions on Artificial Intelligence. This journal paper consolidates our research on using contrastive losses at different layers of deep networks to enforce domain invariance.</p>
    `
  },
  {
    id: 5,
    date: "Jun 2023",
    title: "Paper Accepted at IEEE TETCI",
    desc: "Our paper, “Towards Domain Generalization for ECG and EEG Classification: Algorithms and Benchmarks”, has been accepted at IEEE Transactions on Emerging Topics in Computational Intelligence.",
    image: "/api/placeholder/800/400",
    content: `
      <p class="mb-4">This work establishes rigorous benchmarks for Domain Generalization in the context of 1D biosignals (ECG and EEG), a field often overlooked compared to 2D computer vision. We provide a standardized evaluation protocol and open-source datasets to facilitate future research.</p>
    `
  }
];

const RESEARCH_INTERESTS = [
  "Deep Learning", "Domain Generalization", "Representation Learning", "Computer Vision", "Biosignal Classification", "AI in Healthcare"
];

const ACADEMIC_EXPERIENCE = [
  {
    role: "PhD in Machine & Deep Learning",
    org: "Harokopio University of Athens",
    period: "2021 - 2025",
    grade: "Grade: 10/10",
    desc: "Dissertation: Representation Learning Algorithms for Out-of-Distribution Generalization",
    sup: "Supervisor: Christos Diou"
  },
  {
    role: "Diploma in Electrical and Computer Engineering",
    org: "National Technical University of Athens",
    period: "2014 - 2021",
    grade: "Grades: Diploma - 7.25/10, Thesis - 10/10",
    desc: "Diploma Thesis: Ωto_abR: A WebApp for the Visualization and Analysis of Click-Evoked Auditory Brainstem Responses"
  },
  {
    role: "High School Diploma (Apolytirion)",
    org: "2nd High School of Glyka Nera",
    grade: "Panhellenic Exams: 18.305",
  }
];

const WORK_EXPERIENCE = [
  {
    role: "ML & DL Researcher",
    org: "Harokopio University of Athens",
    period: "2021 - Present",
    desc: "Researcher in HORIZON Europe projects (REBECCA, RELEVIUM, MELIORA), focusing on leveraging Artificial Intelligence and Real-World Data to support clinical research and behavior change."
  },
  {
    role: "System Engineer",
    org: "Remote",
    period: "2017 - 2021",
    desc: "Provided remote IT consulting and support, overseeing the design, installation, configuration, and development of hardware and software infrastructure for a USA-based bank. Managed network, backup, and monitoring systems; designed and executed annual disaster recovery plans; and identified and mitigated high-risk security vulnerabilities."
  },
  {
    role: "Helpdesk Analyst",
    org: "Remote",
    period: "2016 - 2017",
    desc: "Provided front-line primary technical support to end users on various technical issues and problems related to hardware, software and peripherals, for a USA-based bank."
  }
];

const PROJECTS = [
  {
    title: "REBECCA",
    role: "Researcher",
    period: "2021-2025",
    desc: "Research on Breast Cancer induced chronic conditions supported by Causal Analysis of multi-source data. Developing AI models to predict quality of life trajectories.",
    tags: ["Healthcare AI", "Structural Causal Models", "Breast Cancer"],
    link: "https://rebeccaproject.eu/"
  },
  {
    title: "RELEVIUM",
    role: "Researcher",
    period: "2022 - Present",
    desc: "Advanced AI solutions for chronic pain management. Focusing on multimodal data fusion from wearable sensors and patient-reported outcomes.",
    tags: ["Wearables", "Pain Mgmt", "AI Patient Monitoring", "AI-assisted Palliative Care"],
    link: "https://www.releviumproject.eu/"
  },
  {
    title: "MELIORA",
    role: "Researcher",
    period: "2024 - Present",
    desc: "Leveraging AI and digital tools to empower women at risk of breast cancer, patients, and survivors, fostering sustainable behavior changes through personalized lifestyle interventions.",
    tags: ["AI-enabled Behavior Change"],
    link: "https://melioraproject.eu/"
  },
  {
    title: "HUA HPC Cluster",
    role: "Developer",
    period: "2023 - Present",
    desc: "Configured SLURM and deployed Nvidia GPU servers in cluster.",
    tags: ["HPC", "SLURM", "GPU"],
    link: ""
  },
  {
    title: "BEAM",
    role: "Researcher",
    period: "2023 - Present",
    desc: "Managing and collecting digital biomarkers and health insights from Real-World Data",
    tags: ["Wearables", "Pain Mgmt", "AI Patient Monitoring"],
    link: "https://beam.hua.gr/"
  }
];

// SELECTED PUBLICATIONS (For Homepage)
const SELECTED_PUBLICATIONS = [
  {
    title: "Gradient-Guided Annealing for Domain Generalization",
    venue: "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)",
    year: "2025",
    link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11093999",
    type: "Conference",
    github: "https://github.com/aristotelisballas/GGA",
    arxiv: "https://arxiv.org/abs/2502.20162"
  },
  {
    title: "Which Augmentation Should I Use? An Empirical Investigation of Augmentations for Self-Supervised Phonocardiogram Representation Learning",
    venue: "IEEE Access",
    year: "2024",
    link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10804781",
    type: "Journal",
    github: " https://github.com/aristotelisballas/listen2yourheart",
    arxiv: "https://arxiv.org/abs/2312.00502"
  },
  {
    title: "Adversarial Robustness in Clinical AI Systems",
    venue: "ICCV Workshop",
    year: "2021",
    link: "#",
    type: "Conference",
    arxiv: "https://arxiv.org/abs/2101.00000"
  }
];

// FULL PUBLICATION LIST (For dedicated page)
// Manually ordered from Newest (2025) to Oldest (2021)
const ALL_PUBLICATIONS = [
  {
    title: "Gradient-Guided Annealing for Domain Generalization",
    venue: "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)",
    year: "2025",
    link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11093999",
    type: "Conference",
    github: "https://github.com/aristotelisballas/GGA",
    arxiv: "https://arxiv.org/abs/2502.20162"
  },
  {
    title: "Which Augmentation Should I Use? An Empirical Investigation of Augmentations for Self-Supervised Phonocardiogram Representation Learning",
    venue: "IEEE Access",
    year: "2024",
    link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10804781",
    type: "Journal",
    github: " https://github.com/aristotelisballas/listen2yourheart",
    arxiv: "https://arxiv.org/abs/2312.00502"
  },
  {
    title: "CycleMix: Mixing Source Domains for Domain Generalization in Style-Dependent Data",
    venue: "SETN",
    year: "2024",
    link: "#",
    type: "Conference",
  },
  {
    title: "Multi-Scale and Multi-Layer Contrastive Learning for Domain Generalization",
    venue: "IEEE Transactions on Artificial Intelligence",
    year: "2024",
    link: "#",
    type: "Journal",
  },
  {
    title: "Towards Domain Generalization for ECG and EEG Classification: Algorithms and Benchmarks",
    venue: "IEEE Transactions on Emerging Topics in Computational Intelligence",
    year: "2023",
    link: "#",
    type: "Journal",
  },
  {
    title: "Adversarial Robustness in Clinical AI Systems",
    venue: "ICCV Workshop",
    year: "2021",
    link: "#",
    type: "Conference",
    arxiv: "https://arxiv.org/abs/2101.00000"
  }
];


/* --- COMPONENTS --- */

const NewsDetailView = ({ newsItem, onBack }) => {
  if (!newsItem) return null;

  return (
    <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Back button and header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-teal-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to News
        </button>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">
          <Calendar className="w-4 h-4" />
          {newsItem.date}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{newsItem.title}</h1>
      </div>

      {/* Image */}
      <div className="w-full h-64 md:h-96 bg-slate-800 rounded-xl overflow-hidden mb-8 border border-slate-700">
        <img
          src={newsItem.image}
          alt={newsItem.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-invert prose-lg max-w-none text-slate-300"
        dangerouslySetInnerHTML={{ __html: newsItem.content }}
      />
    </div>
  );
};

const AllPublicationsView = ({ onBack }) => {
  // Group by year and sort by year descending (Newest first)
  const groupedPubs = useMemo(() => {
    const groups = {};
    ALL_PUBLICATIONS.forEach(pub => {
      if (!groups[pub.year]) groups[pub.year] = [];
      groups[pub.year].push(pub);
    });

    // Explicitly sort by year descending using array sort
    return Object.entries(groups).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));
  }, []);

  return (
    <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-slate-800 hover:bg-teal-600 text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Full Publication List</h1>
      </div>

      <div className="space-y-12">
        {groupedPubs.map(([year, pubs]) => (
          <div key={year}>
            <h2 className="text-2xl font-bold text-teal-400 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> {year}
            </h2>
            <div className="space-y-4">
              {pubs.map((pub, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-lg hover:border-teal-500/50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${pub.type === 'Journal'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                          }`}>
                          {pub.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">
                        {pub.title}
                      </h3>
                      <p className="text-slate-400 text-sm italic">{pub.venue}</p>
                    </div>

                    <div className="flex flex-wrap items-start gap-3 shrink-0 mt-2 md:mt-0">
                      {pub.arxiv && (
                        <a href={pub.arxiv} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-900/50 px-3 py-2 rounded transition-colors">
                          <FileText className="w-3 h-3" /> ArXiv
                        </a>
                      )}
                      {pub.github && (
                        <a href={pub.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/50 px-3 py-2 rounded transition-colors">
                          <Github className="w-3 h-3" /> Code
                        </a>
                      )}
                      {pub.link !== '#' && (
                        <a href={pub.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 bg-teal-500/10 border border-teal-500/30 px-3 py-2 rounded transition-colors">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const MainApp = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'publications' | 'news-detail'
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll handler
  const handleNavClick = (link) => {
    if (link.isExternal) {
      window.open(link.href, '_blank');
      setIsMenuOpen(false);
      return;
    }

    // Logic for returning to home view if on separate page
    const navigateAndScroll = () => {
      const element = document.getElementById(link.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (currentView !== 'home') {
      setCurrentView('home');
      // Small timeout to allow DOM to render home view before scrolling
      setTimeout(navigateAndScroll, 100);
    } else {
      navigateAndScroll();
    }

    setIsMenuOpen(false);
  };

  const scrollTo = (id) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleNewsClick = (item) => {
    setSelectedNewsItem(item);
    setCurrentView('news-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      <PlexusBackground />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter text-teal-400 cursor-pointer" onClick={() => scrollTo('hero')}>
            Aristotelis <span className="text-slate-100">Ballas</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={`text-sm font-medium transition-colors uppercase tracking-widest ${link.isExternal ? 'px-4 py-2 bg-teal-500/10 text-teal-400 border border-teal-500/50 rounded hover:bg-teal-500 hover:text-slate-900' : 'text-slate-300 hover:text-teal-400'}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full px-6 py-4 flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="text-left text-sm font-medium text-slate-300 hover:text-teal-400 uppercase tracking-widest"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- CONDITIONAL RENDERING --- */}
      {currentView === 'publications' ? (
        <AllPublicationsView onBack={() => setCurrentView('home')} />
      ) : currentView === 'news-detail' ? (
        <NewsDetailView newsItem={selectedNewsItem} onBack={() => setCurrentView('home')} />
      ) : (
        <>
          {/* --- HERO SECTION --- */}
          <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-16 text-center">
            <div className="max-w-4xl z-10 animate-fade-in-up flex flex-col items-center">

              {/* Profile Picture */}
              <div className="mb-8 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="profile.jpg"
                  alt="Aristlotelis Ballas"
                  className="relative w-40 h-40 rounded-full border-4 border-slate-900 object-cover shadow-2xl"
                />
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Aristotelis Ballas <br />
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                I am a Postdoctoral Deep Learning Researcher, focusing on out-of-distribution robustness, domain generalization and AI in healthcare. <br />
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setCurrentView('publications')} className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold rounded-full transition-all transform hover:scale-105">
                  Publications
                </button>
                <button onClick={() => scrollTo('contact')} className="px-8 py-3 border border-slate-600 hover:border-teal-400 text-slate-300 hover:text-teal-400 rounded-full transition-all">
                  Contact Me
                </button>
              </div>
            </div>

            <div className="absolute bottom-10 animate-bounce cursor-pointer" onClick={() => scrollTo('news')}>
              <ChevronDown className="w-8 h-8 text-teal-400 opacity-70" />
            </div>
          </section>

          {/* --- NEWS SECTION --- */}
          <section id="news" className="py-20 px-6 bg-slate-900/30">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Bell className="w-6 h-6 text-teal-400" />
                Latest News
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {NEWS_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNewsClick(item)}
                    className="group bg-slate-800/40 border border-slate-700/50 p-6 rounded-lg hover:border-teal-500/30 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="flex items-center gap-2 text-teal-400 text-sm font-bold mb-3 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                    <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-teal-400 transition-colors">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                    <div className="mt-auto flex items-center gap-2 text-sm text-teal-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform">
                      Read More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- ABOUT & BIO --- */}
          <section id="about" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

                {/* Philosophy Column */}
                <div className="h-full">
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-teal-400" />
                    Philosophy
                  </h3>
                  <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
                    <p className="text-slate-300 mb-6 leading-relaxed text-sm">
                      My work is driven by the conviction that Artificial Intelligence should be <strong> robust, and human-centric</strong>.
                      As a proud member of the HUA Robust AI Group, under the supervision of Prof. <a href="https://diou.github.io/" className="text-teal-400 hover:underline"> Christos Diou</a>, I am interested in developing methods that can be leveraged in critical domains like Healthcare.
                    </p>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Competencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {RESEARCH_INTERESTS.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-slate-700/50 text-teal-300 text-xs rounded-md border border-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Timeline Column */}
                <div className="h-full">
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-teal-400" />
                    Academia
                  </h3>
                  <div className="space-y-8 border-l border-slate-700 ml-3 pl-8 relative">
                    {ACADEMIC_EXPERIENCE.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[39px] top-1 w-5 h-5 bg-slate-900 border-2 border-teal-500 rounded-full"></span>
                        <h4 className="text-lg font-semibold text-white">{exp.role}</h4>
                        <p className="text-teal-400 text-xs font-medium mb-1">{exp.org} | {exp.period}</p>
                        {exp.sup && <p className="text-teal-400 text-xs font-medium mb-1">{exp.sup}</p>}
                        {exp.grade && <p className="text-teal-400 text-xs font-medium mb-1">{exp.grade}</p>}
                        <p className="text-slate-400 text-xs leading-relaxed">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience Column */}
                <div className="h-full">
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-teal-400" />
                    Work Experience
                  </h3>
                  <div className="space-y-8 border-l border-slate-700 ml-3 pl-8 relative">
                    {WORK_EXPERIENCE.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[39px] top-1 w-5 h-5 bg-slate-900 border-2 border-purple-500 rounded-full"></span>
                        <h4 className="text-lg font-semibold text-white">{exp.role}</h4>
                        <p className="text-purple-400 text-xs font-medium mb-1">{exp.org} | {exp.period}</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* --- RESEARCH & SELECTED PUBLICATIONS --- */}
          <section id="research" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-teal-400" />
                  Selected Publications
                </h2>
                <button
                  onClick={() => setCurrentView('publications')}
                  className="mt-4 md:mt-0 flex items-center gap-2 text-teal-400 font-bold hover:text-white transition-colors"
                >
                  View Full List <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {SELECTED_PUBLICATIONS.map((pub, idx) => (
                  <div key={idx} className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-800/30 border border-slate-700/50 p-6 rounded-lg hover:border-teal-500/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {pub.type}
                        </span>
                        <span className="text-slate-500 text-sm">{pub.year}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{pub.venue}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-wrap items-center gap-4">

                      {/* ArXiv Link */}
                      {pub.arxiv && (
                        <a href={pub.arxiv} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
                          <FileText className="w-4 h-4" /> ArXiv
                        </a>
                      )}

                      {/* GitHub Link */}
                      {pub.github && (
                        <a href={pub.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                          <Github className="w-4 h-4" /> Code
                        </a>
                      )}

                      {/* Main Link */}
                      <a href={pub.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300 hover:underline">
                        Read Paper <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a href="https://scholar.google.com/citations?user=7dfMirEAAAAJ&hl=en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors border-b border-transparent hover:border-teal-500 pb-1">
                  View Full List on Google Scholar <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          {/* --- PROJECTS --- */}
          <section id="projects" className="py-20 px-6 bg-slate-900/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Project Involvement</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROJECTS.map((project, idx) => (
                  <div key={idx} className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-teal-500/10 rounded-lg">
                        {project.title.includes("CI/CD") ? <Terminal className="w-6 h-6 text-teal-400" /> : <Briefcase className="w-6 h-6 text-teal-400" />}
                      </div>
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">{project.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{project.role} • {project.period}</p>
                    <p className="text-slate-300 text-sm mb-6 line-clamp-4 leading-relaxed">
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- TEACHING ONLY (Full Width) --- */}
          <section id="teaching" className="py-20 px-6 bg-slate-900/30">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-teal-400" />
                Courses Taught
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-800/40 rounded-xl border-l-4 border-teal-500 h-full">
                  <h4 className="text-xl font-semibold text-slate-200">Deep Learning for Computer Vision</h4>
                  <p className="text-sm text-teal-400 font-medium mt-1">Graduate Level • Spring 2023, 2024</p>
                  <p className="text-slate-400 mt-4 leading-relaxed">
                    A comprehensive course covering modern architecture design, from basic CNNs to state-of-the-art Vision Transformers and Generative Adversarial Networks.
                    Includes practical labs on PyTorch and weekly project milestones.
                  </p>
                </div>
                <div className="p-6 bg-slate-800/40 rounded-xl border-l-4 border-purple-500 h-full">
                  <h4 className="text-xl font-semibold text-slate-200">Introduction to Machine Learning</h4>
                  <p className="text-sm text-purple-400 font-medium mt-1">Undergraduate Level • Fall 2022</p>
                  <p className="text-slate-400 mt-4 leading-relaxed">
                    Designed the curriculum for fundamental ML algorithms, statistical learning theory, and ethical considerations.
                    Emphasized mathematical foundations alongside practical Python implementation using Scikit-Learn.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- CONTACT / FOOTER --- */}
      <footer id="contact" className="py-20 px-6 border-t border-slate-800 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Let's Collaborate</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            I am always open to discussing new research opportunities, consulting projects in the AI space, or educational workshops.
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <a href="mailto:email@example.com" className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all">
              <Mail className="w-5 h-5" /> Send Email
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700">
              <Linkedin className="w-5 h-5" /> LinkedIn
            </a>
          </div>

          <div className="flex justify-center gap-8 text-slate-500">
            <a href="https://github.com/jenkinsci/jenkins" target="_blank" rel="noreferrer" className="hover:text-teal-400 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://scholar.google.com/citations?user=7dfMirEAAAAJ&hl=en" target="_blank" rel="noreferrer" className="hover:text-teal-400 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-teal-400 transition-colors">
              <Globe className="w-6 h-6" />
            </a>
          </div>

          <p className="mt-12 text-sm text-slate-600">
            © {new Date().getFullYear()} Aristotelis Ballas. All rights reserved. <br />
            Built with React & Canvas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainApp;