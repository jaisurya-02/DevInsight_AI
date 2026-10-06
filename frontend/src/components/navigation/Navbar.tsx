import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-bg-dark/90 backdrop-blur-md border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold text-txt-primary tracking-tight font-display">
            DevInsight <span className="text-primary font-mono font-bold">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-txt-secondary">
          <Link to="/analyze" className="hover:text-txt-primary transition-colors">
            Analyze Profile
          </Link>
          <Link to="/dashboard" className="hover:text-txt-primary transition-colors">
            Demo Dashboard
          </Link>
          <Link to="/skills" className="hover:text-txt-primary transition-colors">
            Skill Intelligence
          </Link>
          <Link to="/growth" className="hover:text-txt-primary transition-colors">
            Growth Analytics
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-bg-dark text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Analyze Profile <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
