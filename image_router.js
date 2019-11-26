const path = require('path');
const multer = require('multer');
const bodyParser= require('body-parser')
const db = require('./database/db');
const uuid = require('uuid/v4');
const cors = require('cors');

module.exports = app => {
    app.use(cors())

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


    app.post("/uploadSaleSinglePhoto1/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        console.log("now i a ")
    
        var qu = "UPDATE buyitems SET image1 = ? WHERE item_id = ?"
        console.log("query ", qu)
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

    app.post("/uploadSaleSinglePhoto2/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        console.log("i am called");
        var qu = "UPDATE buyitems SET image2 = ? WHERE item_id = ?"
        console.log("query ", qu)
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

    app.post("/uploadSaleSinglePhoto3/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE buyitems SET image3 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadSaleSinglePhoto4/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE buyitems SET image4 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadSaleSinglePhoto5/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE buyitems SET image5 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadSaleSinglePhoto6/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE buyitems SET image6 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    /////////////////////////////////////////////////////////

    app.post("/uploadRentSinglePhoto1/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE rentitems SET image1 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadRentSinglePhoto2/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE rentitems SET image2 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadRentSinglePhoto3/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE rentitems SET image3 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadRentSinglePhoto4/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE rentitems SET image4 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadRentSinglePhoto5/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE rentitems SET image5 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    app.post("/uploadRentSinglePhoto6/:id", upload.single('myFile'), (req, res, next) => {
        var id = req.params.id
        var file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        var qu = `UPDATE rentitems SET image6 = ? WHERE item_id = ?`
        console.log("query ", qu)
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

    ////////////////////////////////////////////////////////////////////
    

}