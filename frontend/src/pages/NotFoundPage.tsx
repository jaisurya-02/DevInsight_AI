import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/layout/Footer';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-dark text-txt-primary flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="max-w-md w-full bg-white border border-border-dark rounded-2xl p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-txt-primary mb-2 font-display">404</h1>
          <h2 className="text-lg font-bold text-txt-secondary mb-3">Page Not Found</h2>
          <p className="text-xs text-txt-muted mb-6 leading-relaxed font-medium">
            The page or report route you are looking for does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
