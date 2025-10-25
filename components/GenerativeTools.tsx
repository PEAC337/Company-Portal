import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { WandIcon } from './icons/WandIcon';
import { WarningIcon } from './icons/WarningIcon';
import { KeyIcon } from './icons/KeyIcon';

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
            <p className="text-slate-400 mb-4">Create high-quality images from text descriptions using the Imagen 2 model.</p>
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
                        <img src={generatedImage} alt="Generated image" className="rounded-lg shadow-lg mx-auto max-h-96" />
                    </div>
                )}
            </div>
        </div>
    );
};

const ImageEditor: React.FC<{ onKeyInvalid: () => void }> = ({ onKeyInvalid }) => {
    const [originalImage, setOriginalImage] = useState<{ file: File, dataUrl: string } | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage({ file, dataUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
            setEditedImage(null);
        }
    };

    const handleEdit = async () => {
        if (!originalImage) {
            setError('Please upload an image first.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please enter an editing prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const base64Data = await blobToBase64(originalImage.file);

            const imagePart = {
                inlineData: {
                    mimeType: originalImage.file.type,
                    data: base64Data,
                },
            };
            const textPart = { text: prompt };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    setEditedImage(imageUrl);
                    return;
                }
            }
            throw new Error("No image data found in response.");

        } catch (err) {
            setError(handleApiError(err, onKeyInvalid));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-4">
                <WandIcon className="h-8 w-8 text-amber-500 mr-3" />
                <h3 className="font-brand text-2xl font-bold text-slate-100 tracking-wider">Image Editing</h3>
            </div>
            <p className="text-slate-400 mb-4">Upload an image and use a text prompt to modify it with Gemini.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-1">1. Upload Image</label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
                    />
                </div>
                {originalImage && (
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-300 mb-2">Original</p>
                            <img src={originalImage.dataUrl} alt="Original" className="rounded-lg shadow-md max-h-64" />
                        </div>
                        {editedImage && (
                             <div className="flex-1">
                                <p className="text-sm font-medium text-slate-300 mb-2">Edited</p>
                                <img src={editedImage} alt="Edited" className="rounded-lg shadow-md max-h-64" />
                            </div>
                        )}
                    </div>
                )}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="2. Enter editing instructions... e.g., Add a retro filter"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={2}
                    disabled={isLoading || !originalImage}
                />
                 <button
                    onClick={handleEdit}
                    disabled={isLoading || !originalImage || !prompt.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading && <SpinnerIcon className="h-5 w-5 mr-2" />}
                    {isLoading ? 'Editing...' : 'Edit Image'}
                </button>
                {error && <p className="text-red-400 text-sm flex items-center"><WarningIcon className="h-4 w-4 mr-2" />{error}</p>}
            </div>
        </div>
    );
}

const ApiKeyManager: React.FC<{ children: (onKeyInvalid: () => void) => React.ReactNode }> = ({ children }) => {
    const [hasApiKey, setHasApiKey] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

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
            // Assume success to handle race condition where hasSelectedApiKey is not immediately true
            setHasApiKey(true);
        } catch (e) {
            console.error("Failed to open API key selection", e);
        }
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
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-900/50">
                        <KeyIcon className="h-8 w-8 text-amber-400" />
                    </div>
                </div>
                <h3 className="font-brand text-2xl font-bold text-slate-100 tracking-wider">Connect to AI Services</h3>
                <p className="text-slate-400 mt-2 mb-6 max-w-md mx-auto">
                    To use the generative AI tools, please connect your API key. This is required for authentication and billing purposes.
                </p>
                <button
                    onClick={handleConnect}
                    className="inline-flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors"
                >
                    Connect API Key
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

    return <>{children(() => setHasApiKey(false))}</>;
};


const GenerativeTools: React.FC = () => {
    return (
        <ApiKeyManager>
            {(onKeyInvalid) => (
                <div className="space-y-12">
                    <ImageGenerator onKeyInvalid={onKeyInvalid} />
                    <ImageEditor onKeyInvalid={onKeyInvalid} />
                </div>
            )}
        </ApiKeyManager>
    );
};

export default GenerativeTools;
