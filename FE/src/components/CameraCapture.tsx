import { useEffect, useRef, useState } from "react";

interface Props {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

/** Vista live della fotocamera (getUserMedia) con scatto che produce un File JPEG. */
export function CameraCapture({ onCapture, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
      } catch {
        if (!cancelled) {
          setError("Impossibile accedere alla fotocamera. Verifica i permessi del browser.");
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `foto-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
      },
      "image/jpeg",
      0.9
    );
  }

  return (
    <div className="card" style={{ padding: 14, overflow: "hidden" }}>
      {error ? (
        <p className="field-error">{error}</p>
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            width: "100%",
            maxHeight: 320,
            objectFit: "cover",
            borderRadius: "var(--radius-sm)",
            background: "#000",
            display: "block",
          }}
        />
      )}
      <div className="row" style={{ marginTop: 12 }}>
        <button type="button" className="btn btn-sm" disabled={!ready || !!error} onClick={capture}>
          📸 Scatta
        </button>
        <button type="button" className="btn btn-sm btn-secondary" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </div>
  );
}
