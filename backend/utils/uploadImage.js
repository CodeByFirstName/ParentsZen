import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Dossier contenant les images à uploader
const imagesDir = path.join(__dirname, 'photos'); // place tes images dans ce dossier

fs.readdir(imagesDir, async (err, files) => {
  if (err) {
    console.error('Erreur lors de la lecture du dossier d\'images', err);
    return;
  }

  for (const file of files) {
    const filePath = path.join(imagesDir, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'babyssiters', // optionnel : crée un dossier dans Cloudinary
      });

      console.log(`${file} => ${result.secure_url}`);
      // TODO: ici tu peux mettre à jour la base MongoDB avec le `secure_url` (voir plus bas)

    } catch (uploadErr) {
      console.error(`Erreur upload de ${file}`, uploadErr);
    }
  }
});
