import sharp from 'sharp';

const convertor = {
  'avif': (path, from) => sharp(path(from)).toFormat('heif', { lossless: true, quality: 100, compression: 'av1' }).toFile(path('avif')),
  'webp': (path, from) => sharp(path(from)).webp({ lossless: true }).toFile(path('webp')),
};

const convertTo = (path, from, targetExtensions = ['webp', 'avif']) => targetExtensions.forEach((extension) => convertor[extension](path, from));

export default convertTo;