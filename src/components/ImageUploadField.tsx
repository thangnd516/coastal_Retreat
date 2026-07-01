"use client";

import { useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";
import { createClient } from "@/lib/supabase/client";

export default function ImageUploadField({
  name,
  folder,
  defaultValue,
}: {
  name: string;
  folder: "rooms" | "products" | "events" | "blogs";
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("coastal-retreat")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("coastal-retreat").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload thất bại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {url ? (
        <Box sx={{ position: "relative", mb: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="preview"
            style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 4 }}
          />
        </Box>
      ) : null}

      <Button
        size="small"
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={14} /> : <UploadIcon fontSize="small" />}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {url ? "Đổi ảnh" : "Tải ảnh lên"}
      </Button>

      {error && (
        <Typography sx={{ mt: 0.5, fontSize: 12, color: "error.main" }}>{error}</Typography>
      )}
    </Box>
  );
}
