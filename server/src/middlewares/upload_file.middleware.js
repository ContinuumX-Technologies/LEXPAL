import multer from "multer";

const storage = multer.memoryStorage();

const uploader = multer({
    storage,
    limit: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files allowed"), false);
        }
        else {
            cb(null, true);
        }

    }
})

export default uploader;