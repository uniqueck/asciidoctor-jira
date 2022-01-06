const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

module.exports = {
  add: (image) => {
    mkdirp.sync(image.relative)
    const filePath = path.format({ dir: image.relative, base: image.basename })
    fs.writeFileSync(filePath, image.contents, 'binary')
  },
  exists: (path) => {
    return fs.existsSync(path)
  },
  read: (path, encoding = 'utf8') => {
    return fs.readFileSync(path, encoding)
  }
}
