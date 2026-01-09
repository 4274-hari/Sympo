import React, { useState } from "react";
import Tesseract from "tesseract.js";

function UploadAndExtractUID() {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    Tesseract.recognize(file, "eng", {
  logger: (m) => console.log(m),
}).then(({ data: { text } }) => {
  setLoading(false);

  const cleanText = text
    .replace(/\n/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  // 1️⃣ PRIORITY: UTR
  const utrMatch = cleanText.match(/utr[:\s]*([0-9]{10,18})/i);
  if (utrMatch) {
    setUid(utrMatch[1]);
    return;
  }

  // 2️⃣ FALLBACK: numeric UPI IDs
  const numbers = cleanText.match(/\b\d{10,18}\b/g) || [];

  const filtered = numbers.filter((num) => {
    if (/^[6-9]\d{9}$/.test(num)) return false;     // phone
    if (/^91[6-9]\d{9}$/.test(num)) return false;  // +91 phone
    return true;
  });

  setUid(filtered[0] || "UID not found");
});

  };

//   console.log(uid);
  

  return (
    <div className="flex justify-center w-full h-[100vh] items-center bg-white">
      <h2>Upload Transaction Screenshot</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {loading && <p>Reading image...</p>}

      {uid && (
        <p>
          <strong>Extracted UID:</strong> {uid}
        </p>
      )}

      {/* Optional: show raw OCR text for debugging */}
      {/* <pre style={{ whiteSpace: "pre-wrap" }}>{rawText}</pre> */}
    </div>
  );
}

export default UploadAndExtractUID;