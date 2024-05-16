import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

// Create object with info where the uploaded files should be stored and how those files should be named on disk.
const mutlerConfig = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (_, file, cb) {
    // Devide name of file from its extension nature  and  .jpg
    const exname = path.extname(file.originalname); // .JPG
    const basename = path.basename(file.originalname, exname);
    const uniqueId = crypto.randomUUID();

    cb(null, `${basename}-${uniqueId}${exname}`);
  },
});

// Create middleware to save files in specified folder and keep the orig name
const upload = multer({ storage: mutlerConfig });

export default upload;
