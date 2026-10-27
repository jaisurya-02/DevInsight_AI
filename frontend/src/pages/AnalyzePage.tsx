import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Check, Loader2, ArrowRight, Cpu, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/layout/Footer';
import { analyzeDeveloper } from '../services/api';

export const AnalyzePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialUser = searchParams.get('user') || '';
  const [username, setUsername] = useState(initialUser);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const analysisSteps = [
    'Fetching developer profile',
    'Inspecting repositories & dependencies',
    'Analyzing technology exposure',
    'Processing commit & collaboration metrics',
    'Preparing intelligence report',
  ];

  const handleStartAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetUser = username.trim() || 'octocat';
    setUsername(targetUser);
    setIsAnalyzing(true);
    setCurrentStep(0);
    setErrorMessage(null);

    // Trigger real backend analysis API in parallel
    const analysisPromise = analyzeDeveloper(targetUser);

    let stepTimer: ReturnType<typeof setTimeout> | undefined;
    let stepCount = 0;

    const advanceStep = () => {
      stepCount += 1;
      setCurrentStep(stepCount);

      if (stepCount < analysisSteps.length - 1) {
        stepTimer = setTimeout(advanceStep, 450);
      } else {
        // Wait for backend analysis promise to resolve
        analysisPromise
          .then(() => {
            setCurrentStep(analysisSteps.length);
            setTimeout(() => {
              navigate(`/dashboard?user=${encodeURIComponent(targetUser)}`);
            }, 350);
          })
          .catch((err) => {
            console.error('Analysis error:', err);
            setErrorMessage(err.message || 'Failed to analyze GitHub developer.');
            setIsAnalyzing(false);
          });
      }
    };

    stepTimer = setTimeout(advanceStep, 400);
    // Cleanup reference
    void stepTimer;
  };

  useEffect(() => {
    if (initialUser && !isAnalyzing) {
      handleStartAnalysis();
    }
  }, [initialUser]);

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
            <h1 className="text-2xl font-bold text-txt-primary tracking-tight mb-2 font-display">
              Analyze a GitHub Developer
            </h1>
            <p className="text-xs text-txt-secondary leading-relaxed">
              Enter any public GitHub username to generate a developer intelligence report.
            </p>
          </div>

          {!isAnalyzing ? (
            <div>
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Analysis Notice</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleStartAnalysis} className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-mono font-semibold text-txt-muted uppercase tracking-wider block mb-2">
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
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-bg-dark text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                  Analyze Developer <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Checklist */}
              <div className="bg-bg-dark border border-border-dark p-5 rounded-xl">
                <span className="text-xs font-mono font-semibold text-txt-muted uppercase tracking-wider block mb-3">
                  We'll analyze public GitHub signals:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-txt-secondary">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Repositories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Languages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Technology exposure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Development activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
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
                <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block mb-2 font-bold">
                  ANALYZING @{username || 'alexjohnson'}
                </span>
                <h3 className="text-lg font-bold text-txt-primary font-display">Generating Intelligence Report...</h3>
              </div>

              <div className="space-y-3 bg-bg-dark border border-border-dark p-5 rounded-xl">
                {analysisSteps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step} className="flex items-center gap-3 text-xs font-medium">
                      {isDone ? (
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : isCurrent ? (
                        <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs animate-spin">
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
                  className="bg-primary h-full rounded-full transition-all duration-300"
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
