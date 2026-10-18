const ImageKit = require('@imagekit/nodejs');

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile(file){
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "post_"+Date.now(),
        folder: "clg_lyf/posts"
    })

    return result;
}

module.exports = {uploadFile};
