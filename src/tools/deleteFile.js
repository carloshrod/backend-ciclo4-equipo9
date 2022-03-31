const fs = require("fs")

export const deleteFile = (file) => {
    const fileToDelete = file.replace("http://192.168.1.65:8080/", '')
    if (fs.existsSync(`./src/storage/imgs/${fileToDelete}`)) fs.unlinkSync(`./src/storage/imgs/${fileToDelete}`)
}