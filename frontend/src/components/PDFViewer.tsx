import { Button } from "@mui/material";
import React from "react";
import IframeResizer from '@iframe-resizer/react'

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  return (
    // <IframeResizer 
    // license="GPLv3"
    <iframe
      src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
      className="w-full h-full"
    ></iframe>
  );
};

export default PDFViewer;