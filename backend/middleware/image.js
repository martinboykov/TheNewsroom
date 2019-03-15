/* eslint-disable no-process-env*/
/* eslint-disable new-cap*/
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'thenewsroom-mean-app',
  keyFilename: path.join(__dirname, '..', 'TheNewsroom-dc506f317f19.json'),
});
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

const BUCKET_NAME = 'thenewsroom-images-storage-bucket';
const bucket = storage.bucket(BUCKET_NAME);

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
}

function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return next();
  }
  if (!MIME_TYPE_MAP[req.file.mimetype]) {
    throw new Error('invalid file type');
  }

  const originalName = req.file.originalname
    .replace(/[^a-z0-9\s-\.]/ig, '')
    .trim()
    .replace(/\s+|(jpg)|(png)|(jpeg)/ig, '')
    .toLowerCase();

  const gcsname = Date.now() + '_'
    + originalName
    + MIME_TYPE_MAP[req.file.mimetype];

  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
    resumable: false,
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      next();
    });
  });

  stream.end(req.file.buffer);
}

const deleteImg = async function(filename) {
  try {
    await storage
      .bucket(BUCKET_NAME)
      .file(filename)
      .delete();
    console.log(`gs://${bucket}/${filename} deleted.`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { multer, sendUploadToGCS, deleteImg };


