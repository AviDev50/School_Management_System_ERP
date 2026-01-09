import multer from "multer";
import path from "path";
import fs from "fs";

const baseDir = "uploads/teachers";

function ensureFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const map = {
      teacher_photo: "teacher_photo",
      aadhar_card: "aadhar_card"
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

export const teacherUpload = multer({ storage }).fields([
  { name: "teacher_photo", maxCount: 1 },
  { name: "aadhar_card", maxCount: 1 }
]);
