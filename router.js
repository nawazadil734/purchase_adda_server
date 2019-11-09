const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const jwt = require('jwt-simple');
const keys = require('./config');
const db = require('./database/db');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });



module.exports = function(app) {
    // check it out
    // app.get("/fetchUserSaleRentItem/:id", (req, res) => {
    //     var id = req.params.id;
    //     db.query("SELECT * from buyitems WHERE user_id = ?", id, function(error, result) {
    //         var result1 = result[0];
    //         db.query("SELECT * from rentitems WHERE user_id = ?", id , function(error, results) {
    //             var result2 = results[0];
    //             res.send({...result1, result2});
    //         })
    //     })
    // });

    app.get("/fetchUserSaleItem/:id", (req, res) => {
        var id = req.params.id;
        db.query("select * from buyitems where user_id = ?", id, function(error, result) {
            if(error) {
                console.log("i am error", error);
                return error;
            }
            console.log("sale", result);
            res.send(result)
        })
    })

    app.get("/fetchUserRentItem/:id", (req, res) => {
        var id = req.params.id;
        db.query("select * from rentitems where user_id = ?", id, function(error, result) {
            if(error) {
                console.log("i am error", error);
                return error;
            }
            console.log("rent", result);
            res.send(result)
        })
    })

    app.get("/fetchUserwtbItem/:id", (req, res) => {
        var id = req.params.id;
        db.query("select * from wtbitems where user_id = ?", id, function(error, result) {
            if(error) {
                console.log("i am error", error);
                return error;
            }
            console.log("wtb", result);
            res.send(result)
        })
    })

    app.get("/fetchUserwtrItem/:id", (req, res) => {
        var id = req.params.id;
        db.query("select * from wtritems where user_id = ?", id, function(error, result) {
            if(error) {
                console.log("i am error", error);
                return error;
            }
            console.log("wtr", result);
            res.send(result)
        })
    })

    app.get("/fetchMessage/:curr/:owner", (req, res) => {
        // console.log("adil" ,req.params.curr);
        // console.log("mc", req.params.owner);
        db.query(`SELECT * FROM messaging WHERE sender_id = ${req.params.curr} AND reciever_id = ${req.params.owner} OR sender_id = ${req.params.owner} AND reciever_id = ${req.params.curr}`, function(error, result) {
            if(error) {
                console.log("mememe", error);
                return error;
            }
            // console.log(result);
            res.send(result);
        })
    })

    app.post("/sendMessage", (req, res) => {
        console.log(req.body);
        const messageBody = {}
        messageBody.sender_id = req.body.currentUser;
        messageBody.reciever_id = req.body.owner;
        messageBody.message = req.body.message;
        messageBody.msg_time = new Date();
        db.query("INSERT INTO messaging SET ?", messageBody, function(error, result) {
            if(error) {
                console.log("message error", error);
                return error;
            }
            res.send("message inserted");
        })
    })

    app.get('/api/userid', requireAuth , function(req, res) {
        const encodedJwt = req.headers.authorization;
        const decoded = jwt.decode(encodedJwt, keys.secret);
        res.send({userId: decoded.sub});
    });

    app.post('/api/userdata', function(req, res) {
        db.query("SELECT * FROM users WHERE id = ?", [req.body.id], function(error, results, fields) {
            if(error) { return next(error);}
            res.send(results[0])
    });
    });

    app.get("/fetchSingleSaleItem/:id", (req, res) => {
        itemId = req.params.id;
        db.query("SELECT * FROM buyitems WHERE item_id = ?", itemId, function(error, result) {
            if (error) {
                console.log(error);
                return error;
            }
            res.send(result[0]);
        })
    })

    app.get("/fetchSingleSaleOwner/:id", (req, res) => {
        ownerId = req.params.id;
        db.query("SELECT * FROM users WHERE id = ?", ownerId, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result[0]);
        })
    })

    app.get("/fetchSingleRentItem/:id", (req, res) => {
        itemId = req.params.id;
        db.query("SELECT * FROM rentitems WHERE item_id = ?", itemId, function(error, result) {
            if (error) {
                console.log(error);
                return error;
            }
            res.send(result[0]);
        })
    })

    app.get("/fetchSingleRentOwner/:id", (req, res) => {
        ownerId = req.params.id;
        db.query("SELECT * FROM users WHERE id = ?", ownerId, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result[0]);
        })
    })

    app.get("/fetchOwnerProfile/:id", (req, res) => {
        ownerId = req.params.id;
        db.query("SELECT * FROM users WHERE id = ?", ownerId, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result[0]);
        })
    })

    app.get("/fetchSaleItems", (req, res) => {
        db.query("SELECT * FROM buyitems", function (error, result) {
          if(error) {
            console.log("queue", error);
            return error;
          }
          res.send(result);
        })
      })

      app.get("/fetchRentItems", (req, res) => {
        db.query("SELECT * FROM rentitems", function (error, result) {
          if(error) {
            console.log("queue", error);
            return error;
          }
          res.send(result);
        })
      })
      
      app.get("/fetchReqItems", (req, res) => {
        db.query("SELECT * FROM  wtbitems", function (error, result) {
          if(error) {
            console.log("queue", error);
            return error;
          }
          res.send(result);
        })
      })

    app.post('/uploadSaleItem', function(req, res) {
        const {
            itemName,
            itemCategory,
            itemDescription,
            itemPurDate,
            itemPrice,
            id
        } = req.body;

        var saleItem = {}
        saleItem.user_id = id;
        saleItem.item_name = itemName;
        saleItem.item_category = itemCategory;
        saleItem.item_desc = itemDescription;
        saleItem.item_price = itemPrice;
        saleItem.item_dop = itemPurDate;
        db.query("INSERT INTO buyItems SET ?" ,saleItem , function(error, results) {
            if(error) {
                console.log(error); 
                return error;
            }
            db.query("SELECT * FROM buyitems WHERE item_id= ?", [results.insertId], function(errors, result) {
                res.send({itemId: result[0].item_id});
            })
        })
    })

    app.post('/uploadRentItem', (req, res) => {
        const {
            user_id,
            item_name,
            item_category,
            item_desc,
            item_dop,
            rent_rate,
            rent_duration_days,
            rent_duration_hours
        } = req.body;

        const rentItemUpload = {
            user_id:user_id,
            item_name: item_name,
            item_category: item_category,
            item_desc: item_desc,
            item_dop: item_dop,
            rent_rate: rent_rate,
            rent_duration_days: rent_duration_days,
            rent_duration_hours: rent_duration_hours
        };
        db.query("INSERT INTO rentitems SET ?", rentItemUpload, function(error, result) {
            if(error) {
                console.log(error); 
                return error;
            }
            db.query("SELECT * FROM rentitems WHERE item_id= ?", [result.insertId], function(errors, result) {
                res.send({itemId: result[0].item_id});
            })
        })
    })

    app.post('/uploadReqBuy', (req, res) => {
        const formValues = req.body;
        const reqBuyItem = {
            user_id: formValues.id,
            item_name: formValues.itemName,
            item_category: formValues.itemCategory,
            item_desc: formValues.buyDescription,
            item_price: formValues.itemPrice
        }
        db.query("INSERT into wtbitems SET ?", reqBuyItem, function(error, result) {
            if(error) {
                console.log("iam here" ,error);
                return error;
            }
            res.send({sdad: "dssf"});
        })
    })

    app.post("/uploadReqRent", (req, res) => {
        const formValues = req.body;
        const reqRentItem = {
            user_id: formValues.id,
            item_name: formValues.itemName,
            item_category: formValues.itemCategory,
            item_desc: formValues.itemDescription,
            rent_rate: formValues.itemRate,
            rent_duration_days: formValues.itemRentDurLimitDays,
            rent_duration_hours: formValues.itemRentDurLimitHours
        }
        db.query("INSERT into wtritems SET ?", reqRentItem, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send({sdad: "dssf"});
        })
    })


    app.post('/updateprofileinfo', function(req, res){ 
        const { 
            userName,
            firstName,
            lastName,
            streetNo,
            city,
            state,
            phoneNumber,
            email,
            id
        } = req.body;
        const updatedUser = {}
        if(userName) updatedUser.userName = userName
        if(firstName) updatedUser.firstName = firstName
        if(lastName) updatedUser.lastName = lastName
        if(streetNo) updatedUser.streetNo = streetNo
        if(city) updatedUser.city = city
        if(state) updatedUser.state = state
        if(phoneNumber) updatedUser.phoneNumber = phoneNumber
        if(email) updatedUser.email = email
        
        db.query("UPDATE users set ? WHERE id = ?", [updatedUser,id], function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        })

    }) 
    app.post('/api/signin', requireSignin, Authentication.signin);
    app.post('/api/signup', Authentication.signup);
};