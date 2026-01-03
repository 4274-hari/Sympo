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

    Tesseract.recognize(
      file,
      "eng",
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      setRawText(text);
      setLoading(false);

      // 🔍 Extract UID using regex
      const uidMatch = text.match(/UPI transaction ID[:\s]*([A-Za-z0-9\-]+)/i);
      if (uidMatch) {
        setUid(uidMatch[1]);
      } else {
        setUid("UID not found");
      }
    });
  };

  console.log(uid);
  

  return (
    <div className="flex justify-center w-full h-[100vh] items-center">
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