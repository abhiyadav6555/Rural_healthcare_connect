import { useState, useRef, useEffect } from 'react';

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const startCamera = async () => {
  setError('');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
    });
    streamRef.current = stream;
    setIsCameraOpen(true);
  } catch (err) {
    setError('Camera access nahi mil paya. Permission check karein ya file upload use karein.');
  }
};

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      onCapture(file);
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const retake = () => {
    setPreviewUrl(null);
    onCapture(null);
    startCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onCapture(file);
    }
  };

  useEffect(() => {
    return () => stopCamera(); // component hatate waqt camera band kar do
  }, []);
  useEffect(() => {
  if (isCameraOpen && streamRef.current && videoRef.current) {
    videoRef.current.srcObject = streamRef.current;
  }
}, [isCameraOpen]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Photo</label>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* Preview after capture */}
      {previewUrl && !isCameraOpen && (
        <div className="flex flex-col items-center gap-2">
          <img src={previewUrl} alt="Captured" className="w-32 h-32 object-cover rounded-full border" />
          <button
            type="button"
            onClick={retake}
            className="text-sm text-blue-600 hover:underline"
          >
            Retake Photo
          </button>
        </div>
      )}

      {/* Live camera view */}
      {isCameraOpen && (
        <div className="flex flex-col items-center gap-2">
          <video
            ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-48 h-48 object-cover rounded-lg border"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={capturePhoto}
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              📸 Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="bg-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Initial buttons - camera or file */}
      {!isCameraOpen && !previewUrl && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startCamera}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
          >
            📷 Take Photo
          </button>
          <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 cursor-pointer">
            Upload File
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CameraCapture;