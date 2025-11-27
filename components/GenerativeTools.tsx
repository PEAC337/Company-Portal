import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { WarningIcon } from './icons/WarningIcon';
import { KeyIcon } from './icons/KeyIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';
import { VideoIcon } from './icons/VideoIcon';


const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const handleApiError = (err: any, onKeyInvalid: () => void) => {
    console.error(err);
    if (err instanceof Error && err.message.includes("Requested entity was not found.")) {
        onKeyInvalid();
        return 'Connection failed. Please re-select your API key and try again.';
    }
    return 'An unexpected error occurred. Please try again.';
}

const ImageAnalyzer: React.FC<{ onKeyInvalid: () => void }> = ({ onKeyInvalid }) => {
    const [image, setImage] = useState<{ file: File, dataUrl: string } | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage({ file, dataUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
            setResponse(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please enter a prompt to ask about the image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const base64Data = await blobToBase64(image.file);

            const imagePart = {
                inlineData: {
                    mimeType: image.file.type,
                    data: base64Data,
                },
            };
            const textPart = { text: prompt };

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
            });
            setResponse(result.text);

        } catch (err) {
            setError(handleApiError(err, onKeyInvalid));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-4">
                <AnalyzeIcon className="h-8 w-8 text-amber-500 mr-3" />
                <h3 className="font-brand text-2xl font-bold text-slate-100 tracking-wider">Image Analyzer</h3>
            </div>
            <p className="text-slate-400 mb-4">Upload an image and ask Gemini a question about it.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="analyzer-file-upload" className="block text-sm font-medium text-slate-300 mb-1">1. Upload Image</label>
                    <input
                        id="analyzer-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
                    />
                </div>
                {image && (
                    <div>
                        <img src={image.dataUrl} alt="Upload preview" className="rounded-lg shadow-md max-h-64 mx-auto" />
                    </div>
                )}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="2. Ask a question about the image..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={2}
                    disabled={isLoading || !image}
                />
                 <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !image || !prompt.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading && <SpinnerIcon className="h-5 w-5 mr-2" />}
                    {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
                {error && <p className="text-red-400 text-sm flex items-center"><WarningIcon className="h-4 w-4 mr-2" />{error}</p>}
                {response && (
                    <div className="mt-4 border-t border-slate-700 pt-4">
                        <h4 className="font-brand text-lg text-amber-400 mb-2 tracking-wider">Analysis Result</h4>
                        <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-wrap">{response}</div>
                    </div>
                )}
            </div>
        </div>
    );
};


const VideoGeneratorFromImage: React.FC<{ onKeyInvalid: () => void }> = ({ onKeyInvalid }) => {
    const [image, setImage] = useState<{ file: File, dataUrl: string } | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

    // Clean up object URL when component unmounts or video changes
    useEffect(() => {
        return () => {
            if (generatedVideoUrl) {
                URL.revokeObjectURL(generatedVideoUrl);
            }
        };
    }, [generatedVideoUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage({ file, dataUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
            setGeneratedVideoUrl(null);
            setError(null);
        }
    };

    const handleGenerate = async () => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please enter a prompt to describe the video.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);
        setLoadingMessage('Initializing video generation...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const base64Data = await blobToBase64(image.file);
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: {
                    imageBytes: base64Data,
                    mimeType: image.file.type,
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio,
                }
            });

            setLoadingMessage('Generating video... This may take a few minutes. Please wait.');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            setLoadingMessage('Finalizing video...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("Video generation succeeded, but no download link was found.");
            }
            
            const response = await fetch(downloadLink, {
                headers: {
                    'x-goog-api-key': process.env.API_KEY!,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to download video: ${response.statusText}`);
            }

            const videoBlob = await response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);

        } catch (err) {
            setError(handleApiError(err, onKeyInvalid));
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-4">
                <VideoIcon className="h-8 w-8 text-amber-500 mr-3" />
                <h3 className="font-brand text-2xl font-bold text-slate-100 tracking-wider">Video Generation</h3>
            </div>
            <p className="text-slate-400 mb-4">Upload a starting image and generate a short video with Veo.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="video-file-upload" className="block text-sm font-medium text-slate-300 mb-1">1. Upload Starting Image</label>
                    <input
                        id="video-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
                    />
                </div>
                {image && (
                    <div>
                        <img src={image.dataUrl} alt="Upload preview" className="rounded-lg shadow-md max-h-64 mx-auto" />
                    </div>
                )}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="2. Describe the video scene..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={2}
                    disabled={isLoading || !image}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1">
                        <label htmlFor="video-aspect-ratio" className="block text-sm font-medium text-slate-300 mb-1">3. Aspect Ratio</label>
                        <select
                            id="video-aspect-ratio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled={isLoading}
                        >
                            <option value="16:9">Landscape (16:9)</option>
                            <option value="9:16">Portrait (9:16)</option>
                        </select>
                    </div>
                     <button
                        onClick={handleGenerate}
                        disabled={isLoading || !image || !prompt.trim()}
                        className="w-full sm:w-auto self-end inline-flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading && <SpinnerIcon className="h-5 w-5 mr-2" />}
                        Generate Video
                    </button>
                </div>
                 {isLoading && <p className="text-amber-300 text-sm flex items-center"><SpinnerIcon className="h-4 w-4 mr-2" />{loadingMessage}</p>}
                {error && <p className="text-red-400 text-sm flex items-center"><WarningIcon className="h-4 w-4 mr-2" />{error}</p>}
                {generatedVideoUrl && (
                    <div className="mt-4 border-t border-slate-700 pt-4">
                        <video src={generatedVideoUrl} controls autoPlay loop className="rounded-lg shadow-lg mx-auto max-h-96" />
                    </div>
                )}
            </div>
        </div>
    );
};


const ImageGenerator: React.FC<{ onKeyInvalid: () => void }> = ({ onKeyInvalid }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
                },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setGeneratedImage(imageUrl);
        } catch (err) {
            setError(handleApiError(err, onKeyInvalid));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-4">
                <PhotoIcon className="h-8 w-8 text-amber-500 mr-3" />
                <h3 className="font-brand text-2xl font-bold text-slate-100 tracking-wider">Image Generation</h3>
            </div>
            <p className="text-slate-400 mb-4">Create high-quality images from text descriptions using the Imagen 4.0 model.</p>
            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A photorealistic image of an astronaut riding a horse on Mars"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    disabled={isLoading}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                    <div className="flex-1">
                        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-slate-300 mb-1">Aspect Ratio</label>
                        <select
                            id="aspect-ratio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled={isLoading}
                        >
                            <option value="1:1">Square (1:1)</option>
                            <option value="4:3">Landscape (4:3)</option>
                            <option value="16:9">Widescreen (16:9)</option>
                            <option value="3:4">Portrait (3:4)</option>
                            <option value="9:16">Tall (9:16)</option>
                        </select>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full sm:w-auto self-end inline-flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading && <SpinnerIcon className="h-5 w-5 mr-2" />}
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm flex items-center"><WarningIcon className="h-4 w-4 mr-2" />{error}</p>}
                {generatedImage && (
                    <div className="mt-4 border-t border-slate-700 pt-4">
                        <img src={generatedImage} alt="Generated" className="rounded-lg shadow-lg mx-auto max-h-96" />
                    </div>
                )}
            </div>
        </div>
    );
};

const ApiKeyManager: React.FC<{ children: (onKeyInvalid: () => void) => React.ReactNode }> = ({ children }) => {
    const [hasApiKey, setHasApiKey] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isKeyInvalid, setIsKeyInvalid] = useState(false);

    const checkApiKey = async () => {
        setIsChecking(true);
        try {
            // @ts-ignore
            if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                setHasApiKey(true);
            } else {
                setHasApiKey(false);
            }
        } catch (e) {
            console.error("Failed to check for API key", e);
            setHasApiKey(false);
        } finally {
            setIsChecking(false);
        }
    };
    
    useEffect(() => {
        checkApiKey();
    }, []);

    const handleConnect = async () => {
        try {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            // Assume success to handle race condition and reset invalid state
            setHasApiKey(true);
            setIsKeyInvalid(false);
        } catch (e) {
            console.error("Failed to open API key selection", e);
        }
    };

    const onKeyInvalid = () => {
        setHasApiKey(false);
        setIsKeyInvalid(true);
    };

    if (isChecking) {
        return (
            <div className="flex justify-center items-center p-8">
                <SpinnerIcon className="h-8 w-8 text-amber-500" />
            </div>
        );
    }

    if (!hasApiKey) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 sm:p-8 text-center">
                {isKeyInvalid && (
                    <div className="mb-6 text-red-300 bg-red-900/40 border border-red-700/50 rounded-lg p-4 text-sm flex items-start space-x-3 text-left">
                        <WarningIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-400" />
                        <div>
                            <p className="font-bold text-red-200">Connection Failed</p>
                            <p className="mt-1">
                                Your previously selected API key is invalid or could not be found. Please re-select your key to continue.
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-900/50">
                        <KeyIcon className="h-8 w-8 text-amber-400" />
                    </div>
                </div>
                <h3 className="font-brand text-2xl font-bold text-slate-100 tracking-wider">
                    {isKeyInvalid ? 'API Key Invalid' : 'Connect to AI Services'}
                </h3>
                <p className="text-slate-400 mt-2 mb-6 max-w-md mx-auto">
                    {isKeyInvalid
                        ? 'Please re-select your API key to restore connection to the generative AI tools.'
                        : 'To use the generative AI tools, please connect your API key. This is required for authentication and billing purposes.'
                    }
                </p>
                <button
                    onClick={handleConnect}
                    className="inline-flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors"
                >
                    {isKeyInvalid ? 'Re-select API Key' : 'Connect API Key'}
                </button>
                <p className="text-xs text-slate-500 mt-4">
                    For more information on billing, see the{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">
                        Gemini API documentation
                    </a>.
                </p>
            </div>
        );
    }

    return <>{children(onKeyInvalid)}</>;
};

const GenerativeTools: React.FC = () => {
    return (
        <ApiKeyManager>
            {(onKeyInvalid) => (
                <div className="space-y-12">
                    <ImageAnalyzer onKeyInvalid={onKeyInvalid} />
                    <VideoGeneratorFromImage onKeyInvalid={onKeyInvalid} />
                    <ImageGenerator onKeyInvalid={onKeyInvalid} />
                </div>
            )}
        </ApiKeyManager>
    );
};

export default GenerativeTools;