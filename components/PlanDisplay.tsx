
import React from 'react';
import { ContentPlan, MediaType } from '../types';
import { ExternalLink, RefreshCw, PenTool, History, Share2, Heart, Download, MessageCircle, Send, Bookmark, Play } from 'lucide-react';

interface PlanDisplayProps {
  plan: ContentPlan;
  posterUrl: string;
  mediaType: MediaType;
  onReset: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, posterUrl, mediaType, onReset }) => {
  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      
      {/* Left Column: Planning Document */}
      <div className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <PenTool size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">문화 콘텐츠 기획안</h2>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-blue-600">{plan.place}</span> X <span className="font-semibold text-pink-500">{plan.emotion}</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                <History size={16} /> 역사적 사실
              </h3>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {plan.historyFacts}
              </p>
              {plan.groundingUrls && plan.groundingUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {plan.groundingUrls.map((url, idx) => (
                    <a 
                      key={idx} 
                      href={url.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline bg-blue-50 px-2 py-1 rounded"
                    >
                      <ExternalLink size={10} /> {url.title}
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                스토리 시놉시스
              </h3>
              <div className="text-slate-800 font-medium text-lg leading-relaxed">
                {plan.synopsis}
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-1">콘텐츠 형식</h4>
                <p className="text-indigo-900 font-semibold">{plan.contentType}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-pink-400 uppercase mb-1">타겟 관객</h4>
                <p className="text-pink-900 font-semibold">{plan.targetAudience}</p>
              </div>
            </div>

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                핵심 메시지
              </h3>
              <p className="text-slate-600 italic border-l-4 border-blue-500 pl-4 py-1">
                "{plan.keyMessage}"
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Right Column: Social Media Preview (Nano Banana Style) */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative">
          {/* Phone Status Bar Mock */}
          <div className="bg-white px-6 py-3 flex justify-between items-center text-xs font-bold text-slate-900 z-10 relative">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-full bg-black"></div>
              <div className="w-4 h-4 rounded-full border border-black"></div>
            </div>
          </div>

          {/* Social Media Post Interface */}
          <div className="relative pb-4">
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 ring-2 ring-white"></div>
              <div className="flex-1">
                <p className="text-sm font-bold">busan_story_official</p>
                <p className="text-xs text-gray-500">Sponsored</p>
              </div>
              <Share2 size={20} className="text-slate-800" />
            </div>

            {/* Generated Content (Image or Video) */}
            <div className={`w-full bg-gray-100 relative group ${mediaType === 'image' ? 'aspect-square' : 'aspect-[9/16]'}`}>
              {mediaType === 'video' ? (
                <video 
                  src={posterUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={posterUrl} 
                  alt="Generated Poster" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Always visible download button */}
              <a 
                href={posterUrl} 
                download={`busan_story_${plan.place.replace(/\s+/g, '_')}.${mediaType === 'video' ? 'mp4' : 'png'}`}
                className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 z-20"
              >
                <Download size={16} />
                <span>저장</span>
              </a>
              
              {mediaType === 'video' && (
                <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full text-white backdrop-blur-sm">
                  <Play size={12} fill="currentColor" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
               <Heart size={24} className="text-red-500 fill-current cursor-pointer hover:scale-110 transition-transform" />
               <MessageCircle size={24} className="text-slate-800 cursor-pointer hover:text-slate-600 transition-colors" />
               <Send size={24} className="text-slate-800 cursor-pointer hover:text-slate-600 transition-colors -rotate-12 mt-[-2px]" />
              </div>
              <Bookmark size={24} className="text-slate-800 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>

            {/* Caption (Nano Banana Style) */}
            <div className="px-4 pb-8">
              <p className="text-sm text-slate-800">
                <span className="font-bold mr-2">busan_story_official</span>
                {plan.socialCaption}
              </p>
              <p className="text-xs text-slate-400 mt-2">View all 40 comments</p>
              <p className="text-[10px] text-slate-300 mt-1 uppercase">2 hours ago</p>
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-3 bg-white text-slate-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={20} />
            새로운 기획하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;
