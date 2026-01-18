import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styles from "./scanner.module.css";
import {
  CheckCircle,
  XCircle,
  Camera,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import api from "../../../api/axios";

/* 🔊 Beep sound */
const beep = new Audio("/beep1.mp3");

export default function Scanner() {
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const retryTimeoutRef = useRef(null);

  const [status, setStatus] = useState(
    "idle" // idle | confirm | loading | success | error | denied
  );
  const [message, setMessage] = useState("");
  const [pendingToken, setPendingToken] = useState(null);

  /* 📱 iOS Safari fix */
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");
    startScanner();

    return () => {
      clearTimeout(retryTimeoutRef.current);
      safeStopScanner();
    };
  }, []);

  /* ▶️ Start scanner */
  const startScanner = async () => {
    try {
      if (!scannerRef.current) return;

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1,
          disableFlip: true, // 📱 iOS stability
        },
        async (decodedText) => {
          if (!isScanningRef.current) return;

          isScanningRef.current = false;
          beep.play().catch(() => {});
          await safeStopScanner();
          setPendingToken(decodedText);
          setStatus("confirm");
        }
      );

      isScanningRef.current = true;
    } catch (err) {
      console.error(err);
      setStatus("denied");
      setMessage("Camera access denied or unavailable");
    }
  };

  /* ⏹ Stop safely */
  const safeStopScanner = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
    } catch {
      // ignore
    } finally {
      isScanningRef.current = false;
    }
  };

  /* 🔍 Verify QR */
  const verifyQR = async (token) => {
    try {
      setStatus("loading");

      const res = await api.post("/food/scan", { token });

      if (res.data.success) {
        setStatus("success");
      } else {
        throw new Error("Invalid QR");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Invalid QR");

      retryTimeoutRef.current = setTimeout(() => {
        handleScanNext();
      }, 2000);
    }
  };

  /* ✅ Confirm scan */
  const handleConfirm = async () => {
    if (!pendingToken) return;
    await verifyQR(pendingToken);
    setPendingToken(null);
  };

  /* ❌ Cancel scan */
  const handleCancel = async () => {
    setPendingToken(null);
    setStatus("idle");
    await startScanner();
  };

  /* 🔄 Scan next */
  const handleScanNext = async () => {
    clearTimeout(retryTimeoutRef.current);
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Food QR Scanner</h1>
        <p className={styles.subtitle}>Scan participant food QR</p>

        {/* 📷 Scanner */}
        {status === "idle" && (
          <>
            <div id="qr-reader" className={styles.scanner} />
            <div className={styles.hint}>
              <Camera size={16} /> Point camera at QR code
            </div>
          </>
        )}

        {/* 🔔 Confirmation */}
        {status === "confirm" && (
          <div className={styles.confirm}>
            <AlertTriangle size={80} />
            <h2>Confirm Scan</h2>
            <p>Do you want to validate this QR code?</p>

            <div className={styles.actions}>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirm}
              >
                Confirm
              </button>

              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ⏳ Loading */}
        {status === "loading" && (
          <div className={styles.loading}>
            <AlertTriangle size={80} />
            <h2>Verifying…</h2>
            <p>Please wait</p>
          </div>
        )}

        {/* ✅ Success */}
        {status === "success" && (
          <div className={styles.success}>
            <CheckCircle size={80} />
            <h2>Access Granted</h2>
            <button className={styles.nextBtn} onClick={handleScanNext}>
              <RotateCcw size={16} /> Scan Next QR
            </button>
          </div>
        )}

        {/* ❌ Error */}
        {status === "error" && (
          <div className={styles.error}>
            <XCircle size={80} />
            <h2>Invalid</h2>
            <p>{message}</p>
            <p className={styles.autoHint}>Resuming scanner…</p>
          </div>
        )}

        {/* 📴 Camera denied */}
        {status === "denied" && (
          <div className={styles.error}>
            <AlertTriangle size={80} />
            <h2>Camera Required</h2>
            <p>{message}</p>
            <p className={styles.autoHint}>
              Allow camera access & reload page
            </p>
          </div>
        )}
      </div>
    </div>
  );
}