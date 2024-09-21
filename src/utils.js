import multer from "multer";

//Dónde se almacenaran los archivos
const storage = multer.diskStorage({
  //Carpeta donde se va a guardar el archivo
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/img");
  },
  //Nombre final que contendrá el archivo
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

export const uploader = multer({ storage });
