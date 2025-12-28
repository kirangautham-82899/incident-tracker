import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MediaUpload = ({ onUploadComplete, maxFiles = 5 }) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    }, []);

    const handleFiles = (newFiles) => {
        const imageFiles = newFiles.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));

        if (files.length + imageFiles.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setFiles(prev => [...prev, ...imageFiles]);

        // Create previews
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => [...prev, {
                    id: file.name + file.size,
                    url: e.target.result,
                    type: file.type,
                    name: file.name,
                    size: file.size
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'incident_tracker'); // You'll need to set this in Cloudinary
        formData.append('cloud_name', 'your_cloud_name'); // Replace with your Cloudinary cloud name

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/your_cloud_name/upload`, // Replace with your cloud name
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            return {
                url: data.secure_url,
                type: file.type.startsWith('image/') ? 'image' : 'video'
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const uploadFiles = async () => {
        if (files.length === 0) {
            toast.error('No files selected');
            return;
        }

        setUploading(true);
        const uploadedMedia = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

                // Simulate upload progress (replace with real progress tracking)
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
                    }));
                }, 200);

                // For demo: just use local preview URLs instead of Cloudinary
                // In production, uncomment the uploadToCloudinary call
                // const media = await uploadToCloudinary(file);
                const media = {
                    url: previews[i].url,
                    type: file.type.startsWith('image/') ? 'image' : 'video'
                };

                clearInterval(progressInterval);
                setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
                uploadedMedia.push(media);
            }

            toast.success(`${uploadedMedia.length} file(s) uploaded successfully!`);

            if (onUploadComplete) {
                onUploadComplete(uploadedMedia);
            }

            // Clear files after successful upload
            setFiles([]);
            setPreviews([]);
            setUploadProgress({});
        } catch (error) {
            toast.error('Upload failed. Please try again.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${dragActive
                        ? 'border-blue-500 bg-blue-500/10 scale-105'
                        : 'border-white/20 bg-slate-900/50 hover:border-white/40'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                    disabled={uploading}
                />

                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                >
                    <div className={`mb-4 p-4 rounded-full ${dragActive ? 'bg-blue-500/20' : 'bg-slate-800/50'} transition-all`}>
                        <Upload className={`w-12 h-12 ${dragActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-lg font-bold text-white mb-2">
                        {dragActive ? 'Drop files here' : 'Upload Media'}
                    </p>
                    <p className="text-sm text-gray-400 text-center">
                        Drag and drop or click to select<br />
                        <span className="text-xs">Images or videos (max {maxFiles} files)</span>
                    </p>
                </label>

                {dragActive && (
                    <div className="absolute inset-0 bg-blue-500/5 rounded-2xl pointer-events-none animate-pulse"></div>
                )}
            </div>

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                            Selected Files ({previews.length})
                        </h3>
                        {!uploading && (
                            <button
                                onClick={uploadFiles}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload {previews.length} file{previews.length > 1 ? 's' : ''}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={preview.id} className="relative group">
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                                    {preview.type.startsWith('image/') ? (
                                        <img
                                            src={preview.url}
                                            alt={preview.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={preview.url}
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    {/* Upload Progress Overlay */}
                                    {uploading && uploadProgress[preview.name] !== undefined && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                            {uploadProgress[preview.name] === 100 ? (
                                                <CheckCircle className="w-8 h-8 text-green-400" />
                                            ) : (
                                                <div className="text-center">
                                                    <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                                                    <span className="text-white text-sm font-bold">
                                                        {uploadProgress[preview.name]}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="mt-2">
                                    <p className="text-xs text-gray-400 truncate">{preview.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(preview.size)}</p>
                                </div>

                                {/* Remove Button */}
                                {!uploading && (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                )}

                                {/* Type Badge */}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                                    <span className="text-xs font-bold text-white uppercase">
                                        {preview.type.startsWith('image/') ? '📷' : '🎥'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload State */}
            {uploading && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center gap-3">
                        <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                        <span className="text-sm text-blue-300 font-medium">Uploading files...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaUpload;
