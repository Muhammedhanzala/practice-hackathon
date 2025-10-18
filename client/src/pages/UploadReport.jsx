import React, { useState } from "react";
import "./UploadReport.css";

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/upload/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ File "${file.name}" uploaded successfully!\nURL: ${data.url}`);
        console.log("Uploaded File URL:", data.url);
      } else {
        alert(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading file!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Medical Report 📄</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadReport;