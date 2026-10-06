import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Check, Loader2, ArrowRight, Cpu } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/layout/Footer';

export const AnalyzePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialUser = searchParams.get('user') || '';
  const [username, setUsername] = useState(initialUser);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();

  const analysisSteps = [
    'Fetching developer profile',
    'Inspecting repositories',
    'Analyzing technology exposure',
    'Processing activity metrics',
    'Preparing intelligence report',
  ];

  const handleStartAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetUser = username.trim() || 'alexjohnson';
    setUsername(targetUser);
    setIsAnalyzing(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (initialUser && !isAnalyzing) {
      handleStartAnalysis();
    }
  }, [initialUser]);

  useEffect(() => {
    if (isAnalyzing) {
      if (currentStep < analysisSteps.length) {
        const timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 450);
        return () => clearTimeout(timer);
      } else {
        // Finished steps -> navigate to dashboard
        const timer = setTimeout(() => {
          navigate('/dashboard');
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isAnalyzing, currentStep, navigate]);

  return (
    <div className="min-h-screen bg-bg-dark text-txt-primary flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="max-w-xl w-full bg-bg-surface border border-border-dark rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-txt-primary tracking-tight mb-2">
              Analyze a GitHub Developer
            </h1>
            <p className="text-xs text-txt-secondary leading-relaxed">
              Enter any public GitHub username to generate a developer intelligence report.
            </p>
          </div>

          {!isAnalyzing ? (
            <div>
              {/* Form Input */}
              <form onSubmit={handleStartAnalysis} className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-semibold text-txt-muted uppercase tracking-wider block mb-2">
                    GitHub Username
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-txt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. alexjohnson, octocat, torvalds"
                      className="w-full bg-bg-dark border border-border-dark rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-txt-primary placeholder:text-txt-muted/60 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                  Analyze Developer <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Checklist */}
              <div className="bg-bg-dark/60 border border-border-dark p-5 rounded-xl">
                <span className="text-xs font-semibold text-txt-muted uppercase tracking-wider block mb-3">
                  We'll analyze public GitHub signals:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-txt-secondary">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>Repositories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>Languages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>Technology exposure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>Development activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>Collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>Project growth</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Animated Progress Loading State */
            <div className="py-6 space-y-6">
              <div className="text-center mb-6">
                <span className="text-xs font-mono text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 inline-block mb-2">
                  ANALYZING @{username || 'alexjohnson'}
                </span>
                <h3 className="text-lg font-bold text-txt-primary">Generating Intelligence Report...</h3>
              </div>

              <div className="space-y-3 bg-bg-dark border border-border-dark p-5 rounded-xl">
                {analysisSteps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step} className="flex items-center gap-3 text-xs font-medium">
                      {isDone ? (
                        <span className="w-5 h-5 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : isCurrent ? (
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs animate-spin">
                          <Loader2 className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-border-dark text-txt-muted flex items-center justify-center text-[10px]">
                          ○
                        </span>
                      )}

                      <span
                        className={
                          isDone
                            ? 'text-txt-primary font-semibold'
                            : isCurrent
                            ? 'text-primary-light font-semibold'
                            : 'text-txt-muted'
                        }
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-bg-dark h-2 rounded-full overflow-hidden border border-border-dark">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round(((currentStep + 1) / analysisSteps.length) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
