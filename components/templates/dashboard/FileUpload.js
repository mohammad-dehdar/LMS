'use client';

import { UploadDropzone } from '@/app/api/uploadthing/uploadthing';
import toast from 'react-hot-toast';

function FileUpload({ onchange, endpoint }) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res.length > 0) {
          onchange(res[0].url);
        } else {
          toast.error('No file uploaded. Please try again.');
        }
      }}
      onUploadError={(error) => {
        toast.error(`Upload failed: ${error.message}`);
      }}
    />
  );
}

export default FileUpload;
