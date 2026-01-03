// routes/upload.js
/* import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; */
const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'temp/' }); // stockage temporaire local

cloudinary.config({
  cloud_name: 'dxfucm0ko',
  api_key: '336687136336724',
  api_secret: 'v3efmy6dvxkGPFpyKTBeETBShgA',
});



router.post('/', upload.single('photo'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'babyssiters',
    });

    fs.unlinkSync(filePath); // on supprime le fichier temporaire après upload
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Erreur Cloudinary :', err.message);
    res.status(500).json({ error: 'Échec upload image' });
  }
});

module.exports = router;
