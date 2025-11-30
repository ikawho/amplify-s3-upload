// src/components/FileUpload.tsx
import { useRef, useState, ChangeEvent } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

// HIER deine echte API-URL eintragen:
const API_BASE_URL =
  "https://oyqeqcxjq9.execute-api.eu-west-1.amazonaws.com/prod";

export function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>(
    "App successfully hosted. Try uploading a file instead of creating todos."
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setStatus("Hole Token & Upload-URL …");

      // 1) Aktuelle Session + JWT holen
      const session = await fetchAuthSession();
      const jwt = session.tokens?.idToken?.toString(); // oder accessToken, wenn du willst

      if (!jwt) {
        setStatus("Fehler: Konnte keinen JWT über fetchAuthSession bekommen.");
        console.error("fetchAuthSession() hat keine tokens.idToken geliefert:", session);
        return;
      }

      // 2) Presigned URL von deiner API holen
      const res = await fetch(`${API_BASE_URL}/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setStatus(`Fehler beim Holen der Presigned URL: ${res.status} – ${text}`);
        return;
      }

      const { uploadUrl, objectKey } = (await res.json()) as {
        uploadUrl: string;
        objectKey: string;
      };

      setStatus("Lade Datei nach S3 hoch …");

      // 3) Datei nach S3 hochladen
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (!putRes.ok) {
        const text = await putRes.text();
        setStatus(`Upload fehlgeschlagen: ${putRes.status} – ${text}`);
        return;
      }

      setStatus(`Upload erfolgreich. S3-Key: ${objectKey}`);
    } catch (err) {
      console.error(err);
      setStatus("Unerwarteter Fehler beim Upload (Details in der Konsole).");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <button type="button" onClick={handleButtonClick} disabled={isUploading}>
        {isUploading ? "Uploading…" : "+ upload file"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <hr />

      <p>{status}</p>
    </>
  );
}
