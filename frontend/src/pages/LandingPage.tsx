import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Eye,
  BarChart3,
  Brain,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/analyze?user=${encodeURIComponent(username.trim())}`);
    } else {
      navigate('/analyze');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-txt-primary flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Developer Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-txt-primary tracking-tight leading-[1.15] mb-6 font-display">
              Understand the developer behind the <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">GitHub profile</span>.
            </h1>

            <p className="text-base sm:text-lg text-txt-secondary leading-relaxed mb-8 font-medium">
              Turn public GitHub activity into meaningful insights about technology exposure, project activity, collaboration, growth, and potential role alignment.
            </p>

            {/* GitHub Username Input CTA */}
            <form onSubmit={handleAnalyze} className="max-w-xl mx-auto mb-6">
              <div className="bg-white border border-border-dark hover:border-border-hover focus-within:border-primary p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2 transition-all">
                <div className="flex items-center gap-2 px-3 text-txt-muted font-mono text-sm w-full sm:w-auto border-b sm:border-b-0 border-border-dark py-2 sm:py-0 font-medium">
                  <span>github.com/</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="octocat"
                  className="bg-transparent text-sm font-mono font-medium text-txt-primary placeholder:text-txt-muted/60 focus:outline-none flex-1 w-full px-2 py-2"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all shadow-sm shrink-0"
                >
                  Analyze Profile <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-4 text-xs text-txt-muted font-mono">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-secondary hover:underline flex items-center gap-1 font-bold"
              >
                Explore Live Interactive Demo →
              </button>
            </div>
          </div>

          {/* Hero Visual: Product Preview Card */}
          <div className="max-w-4xl mx-auto bg-white border border-border-dark rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-dark pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-danger/80" />
                <div className="w-3 h-3 rounded-full bg-accent-warning/80" />
                <div className="w-3 h-3 rounded-full bg-accent-success/80" />
                <span className="text-xs font-mono text-txt-muted ml-2 font-medium">Developer Intelligence Report</span>
              </div>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 font-bold">
                LIVE DEMO PREVIEW
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-bg-elevated border border-border-dark p-4 rounded-xl">
                <span className="text-xs text-txt-muted uppercase font-mono font-bold block mb-1">Repositories</span>
                <span className="text-2xl font-bold text-txt-primary font-display">24</span>
              </div>
              <div className="bg-bg-elevated border border-border-dark p-4 rounded-xl">
                <span className="text-xs text-txt-muted uppercase font-mono font-bold block mb-1">Activity Index</span>
                <span className="text-2xl font-bold text-primary font-display">82%</span>
              </div>
              <div className="bg-bg-elevated border border-border-dark p-4 rounded-xl">
                <span className="text-xs text-txt-muted uppercase font-mono font-bold block mb-1">Languages</span>
                <span className="text-2xl font-bold text-secondary font-display">8</span>
              </div>
              <div className="bg-bg-elevated border border-border-dark p-4 rounded-xl">
                <span className="text-xs text-txt-muted uppercase font-mono font-bold block mb-1">Collaboration</span>
                <span className="text-2xl font-bold text-accent-warning font-display">67%</span>
              </div>
            </div>

            {/* Model Role Prediction Preview */}
            <div className="bg-bg-elevated border border-border-dark p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-txt-muted font-mono font-medium block">Model-Predicted Role</span>
                  <span className="text-lg font-bold text-txt-primary font-display">Full Stack Developer</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20 font-bold">
                  82% Confidence
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Explanation Section (4 Steps) */}
      <section className="py-20 bg-white border-y border-border-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-txt-primary tracking-tight mb-4 font-display">
              How DevInsight AI Transforms GitHub Signals
            </h2>
            <p className="text-sm text-txt-secondary leading-relaxed font-medium">
              Our analysis pipeline parses documentation, repository activity, commits, and language breakdown to build transparent developer intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1: Observe */}
            <div className="bg-bg-dark border border-border-dark rounded-xl p-6 hover:border-primary/50 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-primary uppercase block mb-1">01 — Observe</span>
              <h3 className="text-lg font-bold text-txt-primary mb-2 font-display">Public Signal Collection</h3>
              <p className="text-xs text-txt-secondary leading-relaxed font-medium">
                Collect public GitHub activity including repositories, language usage, commit frequency, pull requests, issues, and README documentation.
              </p>
            </div>

            {/* Step 2: Analyze */}
            <div className="bg-bg-dark border border-border-dark rounded-xl p-6 hover:border-secondary/50 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-secondary uppercase block mb-1">02 — Analyze</span>
              <h3 className="text-lg font-bold text-txt-primary mb-2 font-display">Activity Transformation</h3>
              <p className="text-xs text-txt-secondary leading-relaxed font-medium">
                Transform raw activity observations into transparent indicators like coding consistency, technology exposure, and open-source contribution metrics.
              </p>
            </div>

            {/* Step 3: Understand */}
            <div className="bg-bg-dark border border-border-dark rounded-xl p-6 hover:border-accent-purple/50 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 text-accent-purple flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-accent-purple uppercase block mb-1">03 — Understand</span>
              <h3 className="text-lg font-bold text-txt-primary mb-2 font-display">ML Role Classification</h3>
              <p className="text-xs text-txt-secondary leading-relaxed font-medium">
                Evaluate language patterns, frameworks, and project complexity to provide explainable model-predicted role alignments.
              </p>
            </div>

            {/* Step 4: Improve */}
            <div className="bg-bg-dark border border-border-dark rounded-xl p-6 hover:border-accent-warning/50 transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-accent-warning/10 border border-accent-warning/20 text-accent-warning flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-accent-warning uppercase block mb-1">04 — Improve</span>
              <h3 className="text-lg font-bold text-txt-primary mb-2 font-display">Skill Gap & Recommendations</h3>
              <p className="text-xs text-txt-secondary leading-relaxed font-medium">
                Compare observed skills against target technical roles to generate prioritized, actionable learning recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Principle & Responsible AI Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 bg-white border border-border-dark rounded-2xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-txt-primary mb-3 font-display">Our Product Principle</h2>
          <p className="text-sm text-txt-secondary leading-relaxed max-w-2xl mx-auto mb-6 font-medium">
            GitHub activity does not objectively measure human intelligence, programming ability, personality, or professional worth. DevInsight AI presents transparent indicators and machine learning signals as observed activity patterns rather than definitive judgements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-txt-muted font-semibold">
            <span className="px-3 py-1 rounded-md bg-bg-elevated border border-border-dark">Activity Indicators</span>
            <span className="px-3 py-1 rounded-md bg-bg-elevated border border-border-dark">Observed Skills</span>
            <span className="px-3 py-1 rounded-md bg-bg-elevated border border-border-dark">Model-Predicted Roles</span>
            <span className="px-3 py-1 rounded-md bg-bg-elevated border border-border-dark">Skill Gap Analysis</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
