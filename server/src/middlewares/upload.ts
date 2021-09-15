import multer from 'multer';
import * as path from 'path';

import { storageTypes } from '../config/multer';

const configMulter = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes.s3,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb (null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
}

const upload = multer(configMulter);

export { upload };