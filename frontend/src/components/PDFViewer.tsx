import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [pdf_url]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <CircularProgress />
        </div>
      )}
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(pdf_url)}&embedded=true`}
        className="w-full h-full"
        onLoad={handleLoad}
      ></iframe>
    </div>
  );
};

export default PDFViewer;
