import React, { useState } from 'react';
import { AppStep, ContentPlan, MediaType } from './types';
import { generateContentPlan, generatePosterImage, generateVideo } from './services/geminiService';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { BookOpen, Camera, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [plan, setPlan] = useState<ContentPlan | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (place: string, emotion: string, contentType: string) => {
    setStep(AppStep.PLANNING);
    setError(null);
    setPlan(null);
    setMediaUrl(null);

    const isVideo = contentType === "애니메이션";
    setMediaType(isVideo ? 'video' : 'image');

    try {
      // API Key Check for Video Generation
      if (isVideo && window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setLoadingMessage("비디오 생성을 위해 API 키 선택이 필요합니다...");
          await window.aistudio.openSelectKey();
          // Assuming successful selection if promise resolves
        }
      }

      // 1. Plan Content & Get History
      setLoadingMessage(`부산의 역사를 검색하고 '${contentType}' 기획을 시작합니다...\n(역사적 사실과 감정을 연결하고 있어요)`);
      const generatedPlan = await generateContentPlan(place, emotion, contentType);
      setPlan(generatedPlan);

      // 2. Generate Media (Image or Video)
      if (isVideo) {
        setLoadingMessage("Veo가 애니메이션 영상을 생성하고 있습니다...\n(동영상 생성은 1~2분 정도 소요됩니다. 잠시만 기다려주세요!)");
        const videoUrl = await generateVideo(generatedPlan.visualPrompt);
        setMediaUrl(videoUrl);
      } else {
        setLoadingMessage("나노바나나가 포스터 이미지를 그리고 있습니다...\n(거의 다 됐어요!)");
        const imageUrl = await generatePosterImage(generatedPlan.visualPrompt);
        setMediaUrl(imageUrl);
      }

      setStep(AppStep.RESULT);
    } catch (err) {
      console.error(err);
      setError("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStep(AppStep.ERROR);
    }
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setPlan(null);
    setMediaUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <MapPin size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">부산 스토리텔러</h1>
              <p className="text-xs text-slate-500 hidden sm:block">역사와 감성을 잇는 문화 콘텐츠 기획</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl p-4 flex-grow flex flex-col items-center justify-center">
        
        {step === AppStep.INPUT && (
          <InputForm onSubmit={handleStart} />
        )}

        {step === AppStep.PLANNING && (
          <div className="text-center animate-pulse">
            <LoadingSpinner />
            <p className="mt-6 text-lg font-medium text-slate-700 whitespace-pre-wrap">{loadingMessage}</p>
          </div>
        )}

        {step === AppStep.RESULT && plan && mediaUrl && (
          <PlanDisplay plan={plan} posterUrl={mediaUrl} mediaType={mediaType} onReset={handleReset} />
        )}

        {step === AppStep.ERROR && (
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <div className="text-red-500 mb-4 flex justify-center">
              <Camera size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">오류가 발생했어요</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-50 py-6 text-center text-slate-400 text-sm">
        <p>© 2025 Busan Culture Planner. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;