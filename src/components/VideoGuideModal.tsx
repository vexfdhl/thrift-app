import React from 'react';
import { X, Video, Award, CheckCircle, FileText, Sparkles, HelpCircle } from 'lucide-react';

interface VideoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const VideoGuideModal: React.FC<VideoGuideModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] w-full max-w-3xl rounded-3xl border-2 border-[#2E1F16]/20 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2E1F16]/10 flex items-center justify-between bg-[#F7E09A]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl sm:text-2xl text-[#2E1F16] font-bold leading-tight">
                Competition Video Presentation Script &amp; Rubric Guide
              </h2>
              <p className="text-xs text-[#2E1F16]/75">
                90-Second Congressional App Challenge &amp; Sustainability Showcase Script
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FBEFD9] hover:bg-white text-[#2E1F16] border border-[#2E1F16]/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close video guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Timing Outline */}
          <div className="space-y-3">
            <h3 className="font-editorial text-lg font-bold text-[#2E1F16] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EFAE6E]" />
              <span>Recommended 90-Second Walkthrough Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-[#2E1F16]/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EFAE6E] bg-[#2E1F16] px-2 py-0.5 rounded-full inline-block">
                  0:00 – 0:25 · The Hook
                </span>
                <h4 className="font-bold text-[#2E1F16]">The Fast Fashion Problem in Duval</h4>
                <p className="text-xs text-[#2E1F16]/75 leading-relaxed">
                  Fast fashion produces 85% textile waste in Duval landfills. Students want affordable style without high retail costs.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#2E1F16]/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16] bg-[#C1D7C2] px-2 py-0.5 rounded-full inline-block font-bold">
                  0:25 – 0:65 · The Tech Solution
                </span>
                <h4 className="font-bold text-[#2E1F16]">Campus Road Distances &amp; Verified Stalls</h4>
                <p className="text-xs text-[#2E1F16]/75 leading-relaxed">
                  Showcase the 24 high schools radius switcher, verified open dressing room filters, and interactive live outfit price battle.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#2E1F16]/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16] bg-[#F7E09A] px-2 py-0.5 rounded-full inline-block font-bold">
                  0:65 – 0:90 · The Impact
                </span>
                <h4 className="font-bold text-[#2E1F16]">Firestore Admin &amp; Student Impact</h4>
                <p className="text-xs text-[#2E1F16]/75 leading-relaxed">
                  Demonstrate the Teacher &amp; District Admin Portal with real-time Firestore database publishing and gallons of clean water saved.
                </p>
              </div>
            </div>
          </div>

          {/* Copy Script Button */}
          <div className="p-4 bg-[#F7E09A]/20 rounded-2xl border border-[#2E1F16]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-[#2E1F16]">Need the full word-for-word voiceover script?</div>
              <div className="text-[11px] text-[#2E1F16]/70">Includes intro, demo cues, and closing call-to-action for student presenters.</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Hi, I'm presenting ThriftFit DuvALL, a student sustainability app built for 24 Duval County high schools...`);
                onToast('Voiceover script copied to clipboard!');
              }}
              className="btn-clevr-brown text-xs px-4 py-2 shrink-0 cursor-pointer"
            >
              Copy Voiceover Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
