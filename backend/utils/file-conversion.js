// Necessary for converting chinese characters in file names to UTF-8

const convertToUTF8 = (fileName) => {
  return Buffer.from(fileName, 'latin1').toString('utf8') // Convert originalname to UTF-8
}

module.exports = convertToUTF8;