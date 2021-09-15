import { S3 } from 'aws-sdk';
import * as crypto from 'crypto';
import multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as path from 'path';

const storageTypes = {
  local: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: function(req, file, cb) {
      crypto.randomBytes(8, (err, hash) => {
        if (err) 
          cb(err, null);
          
        file.filename = `${hash.toString("hex")}-${file.originalname}`;
        
        cb(null, file.filename);
      })
    }
  }),

  s3: multerS3.default({
    s3: new S3(),
    bucket: 'gamefy-profile-images',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(8, (err, hash) => {
        if (err) 
          cb(err, null);
          
        const filename = `${hash.toString("hex")}-${file.originalname}`;
        
        cb(null, filename);
      })
    }
  })

}

export { storageTypes };