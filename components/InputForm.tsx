import React, { useState } from 'react';
import { Sparkles, Map, Heart, Clapperboard } from 'lucide-react';

interface InputFormProps {
  onSubmit: (place: string, emotion: string, contentType: string) => void;
}

const CONTENT_TYPES = [
  "단편 영화",
  "웹툰(애니메 그림체)",
  "전시회",
  "애니메이션",
  "오디오 드라마"
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [place, setPlace] = useState('');
  const [emotion, setEmotion] = useState('');
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (place.trim() && emotion.trim() && contentType) {
      onSubmit(place, emotion, contentType);
    }
  };

  return (
    <div className="w-full max-w-lg animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h2 className="text-2xl font-bold relative z-10 mb-2">안녕하세요! 👋</h2>
          <p className="text-blue-100 relative z-10">
            저는 <strong>부산 역사 스토리텔링 기획자</strong>입니다.<br/>
            여러분의 감정을 담은 특별한 이야기를 만들어드릴게요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Map size={18} className="text-blue-500" />
              어떤 장소를 생각하고 계신가요?
            </label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="예: 40계단, 영도다리, 감천문화마을"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Heart size={18} className="text-pink-500" />
              그곳에서 느끼는 감정은 무엇인가요?
            </label>
            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="예: 그리움, 희망, 쓸쓸함, 따뜻함"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Clapperboard size={18} className="text-purple-500" />
              어떤 형식의 콘텐츠를 만들까요?
            </label>
            <div className="relative">
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white appearance-none cursor-pointer"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!place || !emotion || !contentType}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]
              ${place && emotion && contentType
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <Sparkles size={20} />
            콘텐츠 기획 시작하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;