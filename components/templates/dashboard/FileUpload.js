'use client';

import { UploadDropzone } from '@/app/api/uploadthing/uploadthing';
import toast from 'react-hot-toast';

function FileUpload({ onchange, endpoint }) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onchange(res?.[0].url);
      }}
      onUploadError={(error) => {
        toast.error(`Upload failed: ${error.message}`);
      }}
    />
  );
}

export default FileUpload;
