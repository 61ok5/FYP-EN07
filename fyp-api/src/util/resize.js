const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const path = require('path');

class Resize {
  constructor(folder, originalname, width) {
    this.folder = folder;
    this.originalname = originalname;
    this.width = parseInt(width, 10);
  }

  async save(buffer) {
    const filename = this.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .jpeg({ quality: 100, progressive: true, chromaSubsampling: '4:4:4' })
      .resize(this.width, null, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);

    return filename;
  }

  filename() {
    return `${uuid()}_${path.parse(this.originalname).name}.jpg`;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}
module.exports = Resize;
