const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises; // Utiliser fs.promises pour les fonctions asynchrones

// Configuration de Multer pour le stockage des fichiers téléchargés
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware pour le téléchargement de l'image, le redimensionnement et le stockage
const imageMiddleware = async (req, res, next) => {
  try {
    if (!req.file) return next();
    // Redimensionnement de l'image avec Sharp
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 400 }) // Spécifier la largeur souhaitée
      .toFormat("webp") // Convertir en format WebP
      .toBuffer();

    // Génération d'un nom de fichier unique avec l'extension .webp
    const name = req.file.originalname.split(" ").join("_");
    const fileName = `${name + Date.now()}.webp`;
    const imagesFolder = __dirname+"/../images";
    // Verifie si le dossier "images" est accesible, si ce n'est pas le cas, crée un dossier "images"
    try {
      await fs.access(imagesFolder);
    } catch (error) {
      await fs.mkdir(imagesFolder);
    }

    // Définir le chemin où enregistrer l'image (à la racine du projet dans le dossier "images")
    const filePath = path.join(imagesFolder, fileName); // ".." pour revenir au répertoire parent
    // Écriture de l'image redimensionnée dans le dossier spécifié
    await fs.writeFile(filePath, resizedImageBuffer);

    // Ajouter le chemin de l'image dans la requête pour une utilisation ultérieure si nécessaire
    req.file.filename = fileName;
    next();
  } catch (error) {
    console.error("Erreur lors du traitement de l'image :", error);
    return res
      .status(500)
      .send("Une erreur est survenue lors du traitement de l'image.");
  }
};

// Export du middleware d'upload d'image
module.exports = {
  upload: upload.single("image"), // Middleware de téléchargement d'image
  imageMiddleware: imageMiddleware, // Middleware de redimensionnement et stockage d'image
};
