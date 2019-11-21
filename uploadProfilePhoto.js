const path = require('path');
const multer = require('multer');
const bodyParser= require('body-parser')
const db = require('./database/db');
const uuid = require('uuid/v4');
const cors = require('cors');
module.exports = (app) => {
  app.use(cors())
   // // SET STORAGE
   var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        console.log("fiflfd", file)
        cb(null, 'D:\\DBMS Project\\dbms-client\\public\\images')
      },
      filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + ".jpg")
        cb(null , uuid() + path.extname(file.originalname))
      }
    })
     
  var upload = multer({ storage: storage })
  app.use(bodyParser.urlencoded({extended: true}))

  app.post("/uploadSaleSinglePhoto/:id/:imageNo", upload.single('myFile'), (req, res, next) => {
    var id = req.params.id
    var imageNo = req.params.imageNo;
    var file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

    var qu = `UPDATE buyitems SET image${imageNo} = ? WHERE item_id = ?`
    db.query(qu,[file.filename, id], function(error, result) {
        if(error) {
          console.log(error);
          res.send(error);
        } else {
          console.log(result, file)
          res.send(file); 
        }}
      )}
  );

  app.post("/uploadfile/:id", upload.single('myFile'), (req, res, next) => {
   const id = req.params.id
   const file = req.file
  //  console.log("single" ,file);
   if (!file) {
     const error = new Error('Please upload a file')
     error.httpStatusCode = 400
     return next(error)
   }
    db.query("UPDATE users SET userImage = ? WHERE id = ?",[file.filename, id], function(error, result) {
      if(error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(file);
      }
   });
  })

   app.post("/uploadSaleItemImage/:id", upload.array('myFiles', 1000), (req, res, next) => {
      const files = req.files
      const id = req.params.id;
      // console.log("chekc id;",req.params.id)
      // console.log("checking files", files)
      const imageUpload = {}
      if(files[0]) imageUpload.image1 = files[0].filename;
      if(files[1]) imageUpload.image2 = files[1].filename;
      if(files[2]) imageUpload.image3 = files[2].filename; 
      if(files[3]) imageUpload.image4 = files[3].filename;
      if(files[4]) imageUpload.image5 = files[4].filename;
      if(files[5]) imageUpload.image6 = files[5].filename;
      console.log("chekcing file names", imageUpload)
      if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
      }
    db.query("UPDATE buyitems SET ? WHERE item_id = ?",[imageUpload, id], function(error, result) {
        if(error) {
          console.log(error);
          res.send(error);
        } else {
          res.send(files);
        }
   });
  });

  app.post("/uploadRentItemImage/:id", upload.array('myFiles', 1000), (req, res, next) => {
    const files = req.files
    const id = req.params.id;
    // console.log("chekc id;",req.params.id)
    // console.log("checking files", files)
    const imageUpload = {}
    if(files[0]) imageUpload.image1 = files[0].filename;
    if(files[1]) imageUpload.image2 = files[1].filename;
    if(files[2]) imageUpload.image3 = files[2].filename; 
    if(files[3]) imageUpload.image4 = files[3].filename;
    if(files[4]) imageUpload.image5 = files[4].filename;
    if(files[5]) imageUpload.image6 = files[5].filename;
    console.log("chekcing file names", imageUpload)
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
    }
  db.query("UPDATE rentitems SET ? WHERE item_id = ?",[imageUpload, id], function(error, result) {
      if(error) {
        console.log("chchchchchc", error);
        res.send(error);
      } else {
        res.send(files);
      }
 });
});

  
}