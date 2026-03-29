'use client';

import { useState, useRef, useCallback } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    // 验证文件类型
    if (!selectedFile.type.match('image/(png|jpeg|jpg)')) {
      setError('请上传 JPG 或 PNG 格式的图片');
      return;
    }

    // 验证文件大小 (32MB)
    if (selectedFile.size > 32 * 1024 * 1024) {
      setError('图片大小不能超过 32MB');
      return;
    }

    setError(null);
    setFile(selectedFile);

    // 显示原图预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleRemoveBackground = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // 替换为您的 Cloudflare Worker URL
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `处理失败：${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      console.error('处理失败:', err);
      setError(err instanceof Error ? err.message : '处理失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    const a = document.createElement('a');
    a.href = processedImage;
    a.download = `background-removed-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [processedImage]);

  const handleReset = useCallback(() => {
    setFile(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            🤍 Image Background Remover
          </h1>
          <p className="text-lg md:text-xl opacity-95">
            AI 智能抠图 · 一键移除背景 · 透明 PNG 输出
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Upload Area */}
          {!originalImage && (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-indigo-500 rounded-xl m-6 p-12 text-center cursor-pointer transition-all duration-300 hover:border-purple-600 hover:bg-indigo-50 hover:-translate-y-1"
            >
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                拖拽图片到此处上传
              </h3>
              <p className="text-gray-600 mb-1">或点击选择文件</p>
              <p className="text-gray-400 text-sm mt-4">
                支持 JPG/PNG 格式，最大 32MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={onFileInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* Processing State */}
          {isLoading && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">正在处理中，请稍候...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-red-500 text-lg mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                重新上传
              </button>
            </div>
          )}

          {/* Preview Area */}
          {originalImage && !isLoading && (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Original Image */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    处理前
                  </h4>
                  <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
                    <img
                      src={originalImage}
                      alt="原图"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    处理后
                  </h4>
                  {processedImage ? (
                    <div className="rounded-lg overflow-hidden shadow-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZGRkIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNkZGQiLz48L3N2Zz4=')]">
                      <img
                        src={processedImage}
                        alt="抠图后"
                        className="w-full h-auto"
                      />
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100 h-64 flex items-center justify-center">
                      <p className="text-gray-400">点击"移除背景"开始处理</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!processedImage ? (
                  <button
                    onClick={handleRemoveBackground}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    ✨ 移除背景
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      ⬇️ 下载 PNG
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-gray-200 text-gray-800 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
                    >
                      🔄 再处理一张
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-white/80 mt-8 text-sm">
          <p>Powered by Remove.bg API | Next.js + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
