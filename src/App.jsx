import React, { useState, useEffect, useRef, useMemo } from 'react';
import publicationsData from './data/publications.json';
import { Github, BookOpen, ExternalLink, Mail, Linkedin, Terminal, ChevronDown, Video, Cpu, Globe, Award, Briefcase, GraduationCap, FileText, Calendar, Bell, ArrowLeft, ArrowRight } from 'lucide-react';

/* --- LOSS SURFACE BACKGROUND COMPONENT ---
  Simulates a dynamic neural network loss surface / manifold using a 3D grid.
  Rendered on HTML5 Canvas.
*/
const LossSurfaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Use a fixed color for the grid lines
    const primaryColor = "13, 148, 136"; // RGB for teal-600

    // Canvas sizing state
    let width = canvas.width;
    let height = canvas.height;

    // Grid configuration
    const gridCols = 100; // Increased density
    const gridRows = 50;
    const scale = 20; // Reduced scale for tighter grid

    // const gridCols = 60; // Wider span
    // const gridRows = 30; // Shorter depth
    // const scale = 30;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    const project = (x, y, z) => {
      // Isometric-ish projection
      const offsetX = width / 2;
      const offsetY = height / 2;

      const isoX = (x - y) * Math.cos(Math.PI / 6);
      const isoY = (x + y) * Math.sin(Math.PI / 6) - z;

      return {
        x: offsetX + isoX * scale,
        y: offsetY + isoY * scale * 0.5, // Flattened Y
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 0.8;

      // Calculate grid centers
      const centerCol = (gridCols - 1) / 2;
      const centerRow = (gridRows - 1) / 2;

      // Compute points
      const points = [];

      for (let i = 0; i < gridCols; i++) {
        points[i] = [];
        for (let j = 0; j < gridRows; j++) {
          // Center the coordinate system
          const x = i - centerCol;
          const y = j - centerRow;

          // Loss landscape function: Multi-modal function
          const dist = Math.sqrt(x * x + y * y);
          const maxDist = Math.max(gridCols, gridRows) * 0.5;

          // Enhanced non-convex function
          const z =
            Math.sin(dist * 0.5 - time * 1.2) * 4.0 + // Increased from 2.0
            Math.cos(x * 0.4 + time * 0.4) * 2.0 +    // Increased from 1.5
            Math.sin(y * 0.4 + time * 0.4) * 2.0 +    // Increased from 1.5
            Math.sin((x - y) * 0.3) * 2.0;            // Increased from 1.0

          // Attenuate edges to blend into background
          const alpha = Math.max(0, 1 - (dist / maxDist) * 1.2);

          points[i][j] = { ...project(x, y, z), alpha };
        }
      }

      // Draw Wireframe
      for (let i = 0; i < gridCols; i++) {
        for (let j = 0; j < gridRows; j++) {
          const p1 = points[i][j];

          // Draw Horizontal lines
          if (i < gridCols - 1) {
            const p2 = points[i + 1][j];
            const alpha = (p1.alpha + p2.alpha) / 2;
            if (alpha > 0.01) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${primaryColor}, ${alpha * 0.5})`;
              ctx.stroke();
            }
          }

          // Draw Vertical lines
          if (j < gridRows - 1) {
            const p2 = points[i][j + 1];
            const alpha = (p1.alpha + p2.alpha) / 2;
            if (alpha > 0.01) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${primaryColor}, ${alpha * 0.5})`;
              ctx.stroke();
            }
          }
        }
      }
    };

    const animate = () => {
      time += 0.005; // Adjust speed
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize(); // Initial resize
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-slate-50 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Overlay for depth fading at edges if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 opacity-60 pointer-events-none"></div>
    </div>
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
      <h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">Key Contributions</h3>
      <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-600">
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
    role: "Postdoc in Machine & Deep Learning",
    org: "Harokopio University of Athens",
    period: "2026 - Present",
    desc: "Dissertation: Representation Learning Algorithms for Out-of-Distribution Generalization",
    sup: "Supervisor: Christos Diou"
  },
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
    // grade: "Panhellenic Exams: 18.305",
  }
];

const WORK_EXPERIENCE = [
  {
    role: "ML & DL Postdoctoral Researcher",
    org: "Harokopio University of Athens",
    period: "2026 - Present",
    desc: "Researcher in projects focusing on representation learning for out-of-distribution generalization and integration of AI in healthcare."
  },
  {
    role: "ML & DL Research Associate",
    org: "Harokopio University of Athens",
    period: "2021 - 2025",
    desc: "Researcher in HORIZON Europe projects (REBECCA, RELEVIUM, MELIORA), focusing on leveraging Artificial Intelligence and Real-World Data to support clinical research and behavior change."
  },
  {
    role: "Systems Engineer",
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
const SELECTED_PUBLICATIONS = publicationsData.filter(pub => pub.selected);

// FULL PUBLICATION LIST (For dedicated page)
const ALL_PUBLICATIONS = publicationsData;


/* --- COMPONENTS --- */

const NewsDetailView = ({ newsItem, onBack }) => {
  if (!newsItem) return null;

  return (
    <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Back button and header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to News
        </button>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-3">
          <Calendar className="w-4 h-4" />
          {newsItem.date}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{newsItem.title}</h1>
      </div>

      {/* Image */}
      <div className="w-full h-64 md:h-96 bg-slate-100 rounded-xl overflow-hidden mb-8 border border-slate-200">
        <img
          src={newsItem.image}
          alt={newsItem.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none text-slate-600 prose-headings:text-slate-900 prose-a:text-teal-600"
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
    return Object.entries(groups).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));
  }, []);

  return (
    <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white hover:bg-teal-600 hover:text-white text-slate-600 transition-colors shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Full Publication List</h1>
      </div>

      <div className="space-y-12">
        {groupedPubs.map(([year, pubs]) => (
          <div key={year}>
            <h2 className="text-2xl font-bold text-teal-600 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> {year}
            </h2>
            <div className="space-y-4">
              {pubs.map((pub, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-lg hover:border-teal-500/50 hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${pub.type === 'Journal'
                          ? 'bg-purple-50 text-purple-600 border-purple-200'
                          : 'bg-teal-50 text-teal-600 border-teal-200'
                          }`}>
                          {pub.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {pub.title}
                      </h3>
                      <p className="text-slate-500 text-sm italic">{pub.venue}</p>
                    </div>

                    <div className="flex flex-wrap items-start gap-3 shrink-0 mt-2 md:mt-0">
                      {pub.arxiv && (
                        <a href={pub.arxiv} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded transition-colors">
                          <FileText className="w-3 h-3" /> ArXiv
                        </a>
                      )}
                      {pub.github && (
                        <a href={pub.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-2 rounded transition-colors">
                          <Github className="w-3 h-3" /> Code
                        </a>
                      )}
                      {pub.link !== '#' && (
                        <a href={pub.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 bg-teal-50 border border-teal-100 px-3 py-2 rounded transition-colors">
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

    const navigateAndScroll = () => {
      const element = document.getElementById(link.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (currentView !== 'home') {
      setCurrentView('home');
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
    <div className="min-h-screen text-slate-700 font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden">
      <LossSurfaceBackground />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter text-teal-600 cursor-pointer" onClick={() => scrollTo('hero')}>
            Home
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={`text-sm font-medium transition-colors uppercase tracking-widest ${link.isExternal
                  ? 'px-4 py-2 bg-teal-50 text-teal-600 border border-teal-200 rounded hover:bg-teal-600 hover:text-white'
                  : 'text-slate-500 hover:text-teal-600'
                  }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-600"
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
          <div className="md:hidden bg-white border-b border-slate-200 absolute w-full px-6 py-4 flex flex-col space-y-4 shadow-lg">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="text-left text-sm font-medium text-slate-600 hover:text-teal-600 uppercase tracking-widest"
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
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="profile.jpg"
                  alt="Aristlotelis Ballas"
                  className="relative w-40 h-40 rounded-full border-4 border-white object-cover shadow-xl"
                />
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Aristotelis Ballas <br />
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                I am a Postdoctoral Deep Learning Researcher, focusing on out-of-distribution robustness, domain generalization and AI in healthcare. <br />
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => {
                  setCurrentView('publications');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-teal-500/30">
                  Publications
                </button>
                <button onClick={() => scrollTo('contact')} className="px-8 py-3 border border-slate-300 hover:border-teal-600 text-slate-600 hover:text-teal-600 rounded-full transition-all bg-white/50 backdrop-blur-sm">
                  Contact Me
                </button>
              </div>
            </div>

            <div className="absolute bottom-10 animate-bounce cursor-pointer" onClick={() => scrollTo('news')}>
              <ChevronDown className="w-8 h-8 text-teal-600 opacity-70" />
            </div>
          </section>

          {/* --- NEWS SECTION --- */}
          <section id="news" className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Bell className="w-6 h-6 text-teal-600" />
                Latest News
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {NEWS_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNewsClick(item)}
                    className="group bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-lg hover:border-teal-500/50 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-teal-600 text-sm font-bold mb-3 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                    <div className="mt-auto flex items-center gap-2 text-sm text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform">
                      Read More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- ABOUT & BIO --- */}
          <section id="about" className="py-20 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

                {/* Philosophy Column */}
                <div className="h-full">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-teal-600" />
                    Philosophy
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                      My work is driven by the conviction that Artificial Intelligence should be <strong> robust, and human-centric</strong>.
                      As a proud member of the HUA Robust AI Group, under the supervision of Prof. <a href="https://diou.github.io/" className="text-teal-600 hover:underline"> Christos Diou</a>, I am interested in developing methods that can be leveraged in critical domains like Healthcare.
                    </p>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Key Competencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {RESEARCH_INTERESTS.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-slate-100 text-teal-700 text-xs rounded-md border border-slate-200 font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Timeline Column */}
                <div className="h-full">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-teal-600" />
                    Academia
                  </h3>
                  <div className="space-y-8 border-l border-slate-300 ml-3 pl-8 relative">
                    {ACADEMIC_EXPERIENCE.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[39px] top-1 w-5 h-5 bg-white border-2 border-teal-500 rounded-full"></span>
                        <h4 className="text-lg font-semibold text-slate-800">{exp.role}</h4>
                        <p className="text-teal-600 text-xs font-medium mb-1">{exp.org} | {exp.period}</p>
                        {exp.sup && <p className="text-teal-600 text-xs font-medium mb-1">{exp.sup}</p>}
                        {exp.grade && <p className="text-teal-600 text-xs font-medium mb-1">{exp.grade}</p>}
                        <p className="text-slate-500 text-xs leading-relaxed">{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience Column */}
                <div className="h-full">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-teal-600" />
                    Work Experience
                  </h3>
                  <div className="space-y-8 border-l border-slate-300 ml-3 pl-8 relative">
                    {WORK_EXPERIENCE.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[39px] top-1 w-5 h-5 bg-white border-2 border-purple-500 rounded-full"></span>
                        <h4 className="text-lg font-semibold text-slate-800">{exp.role}</h4>
                        <p className="text-purple-600 text-xs font-medium mb-1">{exp.org} | {exp.period}</p>
                        <p className="text-slate-500 text-xs leading-relaxed">{exp.desc}</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-teal-600" />
                  Selected Publications
                </h2>
                <button
                  onClick={() => {
                    setCurrentView('publications');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4 md:mt-0 flex items-center gap-2 text-teal-600 font-bold hover:text-teal-800 transition-colors"
                >
                  View Full List <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {SELECTED_PUBLICATIONS.map((pub, idx) => (
                  <div key={idx} className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-lg hover:border-teal-500/50 hover:shadow-md transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-600 border border-teal-200">
                          {pub.type}
                        </span>
                        <span className="text-slate-400 text-sm">{pub.year}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-slate-500 text-sm">{pub.venue}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-wrap items-center gap-4">

                      {/* ArXiv Link */}
                      {pub.arxiv && (
                        <a href={pub.arxiv} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">
                          <FileText className="w-4 h-4" /> ArXiv
                        </a>
                      )}

                      {/* GitHub Link */}
                      {pub.github && (
                        <a href={pub.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                          <Github className="w-4 h-4" /> Code
                        </a>
                      )}

                      {/* Main Link */}
                      <a href={pub.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-800 hover:underline">
                        Read Paper <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a href="https://scholar.google.com/citations?user=7dfMirEAAAAJ&hl=en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors border-b border-transparent hover:border-teal-500 pb-1">
                  View Full List on Google Scholar <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          {/* --- PROJECTS --- */}
          <section id="projects" className="py-20 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Project Involvement</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROJECTS.map((project, idx) => (
                  <div key={idx} className="group relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-teal-50 rounded-lg">
                        {project.title.includes("CI/CD") ? <Terminal className="w-6 h-6 text-teal-600" /> : <Briefcase className="w-6 h-6 text-teal-600" />}
                      </div>
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-teal-600 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors">{project.title}</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{project.role} • {project.period}</p>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-4 leading-relaxed">
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
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
          <section id="teaching" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-teal-600" />
                Courses Taught
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-l-4 border-blue-500 shadow-sm border-t border-r border-b border-slate-200 h-full">
                  <h4 className="text-xl font-semibold text-slate-800">Deep Learning</h4>
                  <p className="text-sm text-blue-600 font-medium mt-1">Graduate Level • Teaching Assistant • Spring 2025, 2026</p>
                  <p className="text-slate-600 mt-4 leading-relaxed">
                    A comprehensive course covering modern architecture design, from basic Neural Networks to state-of-the-art architectures including Convolutional Neural Networks, Recurrent Neural Networks, and Transformers. Includes practical implementation using popular deep learning frameworks.
                  </p>
                </div>
                <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-l-4 border-teal-500 shadow-sm border-t border-r border-b border-slate-200 h-full">
                  <h4 className="text-xl font-semibold text-slate-800">Artificial Intelligence and its Applications on the Internet of Things</h4>
                  <p className="text-sm text-teal-600 font-medium mt-1">Postgraduate Level • Teaching Assistant • Spring 2025</p>
                  <p className="text-slate-600 mt-4 leading-relaxed">
                    This course explores how signals and data streams produced by IoT devices can be used to develop artificial intelligence applications, with a focus on training classification and regression models in IoT environments.
                  </p>
                </div>
                <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-l-4 border-purple-500 shadow-sm border-t border-r border-b border-slate-200 h-full">
                  <h4 className="text-xl font-semibold text-slate-800">Data Management II - Intro to AI</h4>
                  <p className="text-sm text-purple-600 font-medium mt-1">Postgraduate Level • Teaching Assistant • Spring 2023, 2024, 2025</p>
                  <p className="text-slate-600 mt-4 leading-relaxed">
                    Provides an introduction to basic concepts and definitions related to Machine Learning. Topics include data preparation, Ordinary and Multiple Linear Regression, Logistic Regression, Decision Trees and Ensemble methods, as well as Fully Connected Neural Networks and CNNs. Students are introduced to well-known ML libraries like Scikit-Learn, Keras, and Tensorflow.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Let's Collaborate</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            I am always open to discussing new research opportunities, consulting projects in the AI space, or educational workshops.
          </p>

          <div className="flex justify-center gap-6">
            <a href="mailto:email@example.com" className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all shadow-md shadow-teal-500/20">
              <Mail className="w-5 h-5" /> Send Email
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all border border-slate-300 shadow-sm">
              <Linkedin className="w-5 h-5" /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-8 text-slate-400 mb-4">
            <a href="https://github.com/jenkinsci/jenkins" target="_blank" rel="noreferrer" className="hover:text-teal-600 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://scholar.google.com/citations?user=7dfMirEAAAAJ&hl=en" target="_blank" rel="noreferrer" className="hover:text-teal-600 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-teal-600 transition-colors">
              <Globe className="w-6 h-6" />
            </a>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Aristotelis Ballas. All rights reserved. <br />
            Built with React & Canvas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainApp;