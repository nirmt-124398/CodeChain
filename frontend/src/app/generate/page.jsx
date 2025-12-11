"use client";

import { useState } from "react";
import apiClient from "@/utils/apiClient";

export default function GenerateBannerPage() {
  const [productName, setProductName] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBannerUrl("");

    try {
      const response = await apiClient.post(
        "/generate/banner",
        {
          productName,
        },
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      setBannerUrl(url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!bannerUrl) return;

    const link = document.createElement("a");
    link.href = bannerUrl;
    link.download = `${productName || "banner"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>Generate Banner</h1>
      <form onSubmit={handleGenerate}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="productName"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Banner"}
        </button>
      </form>

      {error && <div style={{ marginTop: "1rem", color: "red" }}>{error}</div>}

      {bannerUrl && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Banner Preview</h2>
          <img
            src={bannerUrl}
            alt="Generated banner"
            style={{
              maxWidth: "100%",
              border: "1px solid #ccc",
              marginBottom: "1rem",
            }}
          />
          <div>
            <button
              onClick={handleDownload}
              style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
            >
              Download Banner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
