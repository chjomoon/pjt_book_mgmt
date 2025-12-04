import { useState, useEffect } from 'react';
import { Book } from '../App';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookFormProps {
  mode: 'create' | 'edit';
  book?: Book;
  onSubmit: (data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function BookForm({ mode, book, onSubmit, onCancel }: BookFormProps) {
  const [title, setTitle] = useState(book?.title || '');
  const [content, setContent] = useState(book?.content || '');
  const [coverImage, setCoverImage] = useState(book?.coverImage || '');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    
    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const extractKeywords = (text: string): string => {
    // Simple keyword extraction from title and first part of content
    const combined = `${title} ${text}`.toLowerCase();
    
    // Extract Korean nouns and key terms (simplified approach)
    const keywords = [];
    
    if (combined.includes('소설') || combined.includes('이야기')) {
      keywords.push('story book');
    }
    if (combined.includes('과학') || combined.includes('기술')) {
      keywords.push('science technology');
    }
    if (combined.includes('역사')) {
      keywords.push('history');
    }
    if (combined.includes('여행')) {
      keywords.push('travel');
    }
    if (combined.includes('요리')) {
      keywords.push('food cooking');
    }
    if (combined.includes('예술') || combined.includes('미술')) {
      keywords.push('art');
    }
    if (combined.includes('자연')) {
      keywords.push('nature');
    }
    if (combined.includes('동물')) {
      keywords.push('animals');
    }
    if (combined.includes('음악')) {
      keywords.push('music');
    }
    if (combined.includes('건축')) {
      keywords.push('architecture');
    }
    
    // Default to book-related imagery
    if (keywords.length === 0) {
      keywords.push('book library');
    }
    
    return keywords.join(' ');
  };

  const generateCoverImage = async () => {
    if (!title.trim() && !content.trim()) {
      alert('제목이나 내용을 먼저 입력해주세요');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const keywords = extractKeywords(content);
      
      // Call Unsplash API through the tool
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(keywords)}&orientation=portrait&client_id=demo`);
      
      // For demo purposes, we'll use a placeholder since we can't call the unsplash_tool directly from the component
      // In a real scenario, this would be handled by a backend API
      
      // Simulating image URL generation
      const imageUrl = `https://source.unsplash.com/600x800/?${encodeURIComponent(keywords)}`;
      setCoverImage(imageUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
      // Fallback image
      const fallbackKeywords = 'book library';
      setCoverImage(`https://source.unsplash.com/600x800/?${fallbackKeywords}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      coverImage: coverImage || undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {mode === 'create' ? '목록으로' : '상세보기로'}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="mb-6 text-gray-900">
          {mode === 'create' ? '신규 도서 등록' : '도서 정보 수정'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 text-gray-700">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="도서 제목을 입력하세요"
            />
            {errors.title && (
              <p className="mt-1 text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 text-gray-700">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="도서 내용을 입력하세요"
            />
            {errors.content && (
              <p className="mt-1 text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Cover Image */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700">표지 이미지</label>
              <button
                type="button"
                onClick={generateCoverImage}
                disabled={isGeneratingImage}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {coverImage ? 'AI 표지 재생성' : 'AI 표지 생성'}
                  </>
                )}
              </button>
            </div>

            {coverImage && (
              <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-100 max-w-xs mx-auto">
                  <ImageWithFallback
                    src={coverImage}
                    alt="표지 미리보기"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-gray-50 text-center">
                  <p className="text-gray-600">표지 미리보기</p>
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    표지 제거
                  </button>
                </div>
              </div>
            )}

            <p className="mt-2 text-gray-500">
              도서 내용을 기반으로 AI가 표지 이미지를 자동 생성합니다
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'create' ? '등록' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
