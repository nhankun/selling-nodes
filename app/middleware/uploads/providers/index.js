const util = require("util");
const multer = require("multer");
const path = require("path");

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
// const storage = require('../../config/storage');
let storage = multer.diskStorage({
  // Định nghĩa nơi file upload sẽ được lưu lại
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../../../public/images/uploadResults`));
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    // Tên của file thì mình nối thêm một cái nhãn thời gian để tránh bị trùng tên file.
    let filename = `${Date.now()}-nhandex-${file.originalname}`;
    callback(null, filename);
  }
});

// const upload = multer({dest: 'uploads/'});
let uploadFile = multer({storage: storage}).fields([{ name: 'banner', maxCount: 1 }, { name: 'icon', maxCount: 1 }, { name: 'images[]', maxCount: 12 }]);
const uploadMiddleware = util.promisify(uploadFile);
module.exports = {
    uploadMiddleware, uploadMiddleware
};