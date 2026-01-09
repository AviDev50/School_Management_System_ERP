import multer from "multer";
import path from "path";
import fs from "fs";

const baseDir = "uploads/students";

function ensureFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const map = {
      student_photo: "student_photo",
      aadhar_card: "aadhar_card",
      father_photo: "father_photo",
      mother_photo: "mother_photo"
    };

    const folder = map[file.fieldname];
    const folderPath = path.join(baseDir, folder);

    ensureFolder(folderPath);
    cb(null, folderPath);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

export const studentUpload = multer({ storage }).fields([
  { name: "student_photo", maxCount: 1 },
  { name: "aadhar_card", maxCount: 1 },
  { name: "father_photo", maxCount: 1 },
  { name: "mother_photo", maxCount: 1 }
]);
