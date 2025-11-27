
import { GoogleGenAI } from "@google/genai";
import { ContentPlan } from "../types";

/**
 * Generates the cultural content plan using Gemini 2.5 Flash with Google Search Grounding.
 * Note: When using googleSearch, we cannot use responseMimeType: 'application/json'.
 * We must parse the text output manually.
 */
export const generateContentPlan = async (
  place: string,
  emotion: string,
  contentType: string
): Promise<ContentPlan> => {
  // Create a new instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    역할: 당신은 '부산 역사 스토리텔링 문화 콘텐츠 기획자'입니다.
    
    입력 정보:
    - 장소: ${place} (부산)
    - 감정 키워드: ${emotion}
    - 콘텐츠 형식: ${contentType}
    - 주인공: 여주인공 (Female Protagonist)

    수행해야 할 작업:
    1. **역사적 사실 검색**: 부산의 "${place}"와 관련된 역사적 사실, 사건, 인물을 검색하세요. 특히 "${emotion}"이라는 감정과 연결될 수 있는 사실에 집중하세요. (어조: 진지하고 신뢰감 있게)
    2. **콘텐츠 기획**: 검색된 역사적 사실과 사용자의 감정 키워드를 연결하여 문화 콘텐츠를 기획하세요. 
       - **형식**: 반드시 사용자가 선택한 **"${contentType}"** 형식으로 기획해야 합니다.
       - **주인공**: 이야기는 반드시 **여주인공(Female Protagonist)**을 중심으로 전개되어야 합니다.
       - 위로와 공감을 주는 시놉시스를 구상하세요. (어조: 창의적이고 따뜻하게)
    3. **나노바나나 스타일 포스트 작성**: 이 콘텐츠를 홍보하는 SNS 포스트를 '나노바나나' 스타일로 작성하세요.
       - **나노바나나 스타일 정의**: 한국의 젊은 세대(MZ)가 쓰는 언어, 유행어, 밈(Meme), 드립을 적극 활용합니다. 간결하고 재치 있으며, 이모지와 해시태그를 풍부하게 사용하세요. (예: "완전 럭키비키잔앙🍀", "폼 미쳤다", "~자나" 등)
    4. **시각적 프롬프트**: 이 콘텐츠의 포스터를 생성하기 위한 AI 이미지 생성 프롬프트를 **영어(English)로 상세하게** 작성하세요. 
       - **핵심 목표**: 요즘 유행하는 **트렌디하고 감성적인(Trendy & Aesthetic)** 스타일로 묘사해야 합니다. 촌스러운 느낌을 배제하고, 인스타그램이나 핀터레스트에서 인기 있을 법한 고퀄리티 비주얼을 지향하세요.
       - **스타일 가이드**:
         - 조명: Cinematic lighting, Soft ambient light, Golden hour, or Moody neon (장소와 감정에 맞게).
         - 색감: 감각적인 컬러 그레이딩 (Vibrant yet harmonious colors).
         - 구도: 시선을 사로잡는 영화 같은 구도.
       - **콘텐츠 형식 반영**: 선택한 콘텐츠 형식(${contentType})의 스타일을 반영하되, 세련되게 표현하세요. (예: 웹툰이면 고퀄리티 로판 웹툰 표지 느낌, 전시회면 모던한 아트 포스터 느낌, 애니메이션이면 신카이 마코토 스타일).
       - **필수 요소**: 포스터에는 반드시 **매력적인 여성 주인공(Female Protagonist)**이 등장하여, "${emotion}"의 감정을 섬세하게 표현하고 있어야 합니다. 배경은 부산의 "${place}"를 아름답게 재해석하여 묘사하세요.
       - **추가 키워드**: "Masterpiece, best quality, ultra-detailed, 8k, illustration, aesthetic" 등을 포함하세요.

    출력 형식:
    반드시 아래의 JSON 구조를 가진 마크다운 코드 블록(\`\`\`json ... \`\`\`)으로만 응답하세요. 다른 설명은 포함하지 마세요.
    {
      "historyFacts": "장소에 얽힌 역사적 사실 요약 (한국어)",
      "synopsis": "역사와 감정을 연결한 스토리 줄거리 (여주인공 중심, 한국어)",
      "contentType": "${contentType}",
      "keyMessage": "콘텐츠의 핵심 메시지와 정서적 효과",
      "targetAudience": "타겟 관객",
      "visualPrompt": "A highly detailed English description of the poster image featuring a female protagonist, following the trendy aesthetic guide...",
      "socialCaption": "나노바나나 스타일의 홍보 포스트 내용 (한국어, 이모지 포함)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract JSON from Markdown block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    let parsedData: any = {};
    
    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON directly", e);
        throw new Error("Failed to generate a valid plan format.");
      }
    }

    // Extract grounding URLs
    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri })) || [];

    return {
      place,
      emotion,
      historyFacts: parsedData.historyFacts || "역사적 정보를 찾을 수 없습니다.",
      synopsis: parsedData.synopsis || "줄거리를 생성할 수 없습니다.",
      contentType: parsedData.contentType || contentType,
      keyMessage: parsedData.keyMessage || "메시지 없음",
      targetAudience: parsedData.targetAudience || "모두",
      visualPrompt: parsedData.visualPrompt || `A trendy, cinematic poster of ${place} in Busan with a mood of ${emotion}, featuring a beautiful female protagonist, high quality, 8k, aesthetic`,
      socialCaption: parsedData.socialCaption || "콘텐츠를 확인해보세요!",
      groundingUrls
    };

  } catch (error) {
    console.error("Error generating content plan:", error);
    throw error;
  }
};

/**
 * Generates an image using the 'nano banana' model (gemini-2.5-flash-image).
 */
export const generatePosterImage = async (visualPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [{ text: visualPrompt }],
      },
      config: {}
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data returned from Nano Banana model.");
  } catch (error) {
    console.error("Error generating image:", error);
    return `https://picsum.photos/800/800?blur=2`; 
  }
};

/**
 * Generates a video using the Veo model.
 */
export const generateVideo = async (prompt: string): Promise<string> => {
  // Create a new instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Vertical video for social media post
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed or no URI returned.");

    // Fetch the video content using the API key
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
};
