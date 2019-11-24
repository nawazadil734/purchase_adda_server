const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const jwt = require('jwt-simple');
const keys = require('./config');
const db = require('./database/db');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });



module.exports = function(app) {

    app.get("/sellerRating/:id", (req, res) => {
        const id = req.params.id;
        db.query("select sum(rating)/count(rating) as rate from seller_review where sellerId = ?", id, function(error, result) {
            if (error) {
                console.log(error);
                return error;
            }
            if (!result[0].rate) {
                res.send("0");
            } else {
            console.log(result[0].rate);
            res.send(result[0]);
            }
        })
    })

    app.post("/sellerReview", (req, res) => {
        const {
            reviewerId,
            Rating,
            Title,
            Description,
            sellerId
        } = req.body;

        const review = {};

        review.reviewerId = reviewerId;
        review.sellerId = sellerId;
        review.rating = Rating;
        review.title = Title;
        review.comment = Description;
        

        db.query("INSERT into seller_review SET ?", review, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        });

    })

    app.post("/rentReview", (req, res) => {
        const {
            itemId,
            reviewerId,
            Rating,
            Title,
            Description
        } = req.body;

        const review = {};
        review.itemId = itemId;
        review.reviewerId = reviewerId;
        review.rating = Rating;
        review.title = Title;
        review.comment = Description;

        db.query("INSERT into rent_review SET ?", review, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        });
    })


    app.post("/updateReqSaleItem", (req, res) => {
        const {
            buyDescription,
            itemCategory,
            itemId,
            itemName,
            itemPrice
        } = req.body;
        const reqSale = {}
        if(buyDescription) reqSale.item_desc  = buyDescription; 
        if (itemCategory) reqSale.item_category = itemCategory;
        if(itemName) reqSale.item_name = itemName;
        if (itemPrice) reqSale.item_price = itemPrice;

        db.query("UPDATE wtbitems SET  ? WHERE item_id = ?", [reqSale, itemId], function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        })
    })

    app.post("/updateReqRentItem", (req, res) => {

        const {
            itemCategory,
            itemDescription,
            itemId,
            itemName,
            itemRate,
            itemRentDurLimitDays,
            itemRentDurLimitHours
        } = req.body;

        const reqRent = {}

        if(itemCategory) reqRent.item_category = itemCategory;
        if(itemDescription) reqRent.item_desc = itemDescription;
        if(itemName) reqRent.item_name = itemName;
        if(itemRate) reqRent.rent_rate = itemRate;
        if(itemRentDurLimitDays) reqRent.rent_duration_days = itemRentDurLimitDays;
        if(itemRentDurLimitHours) reqRent.rent_duration_hours = itemRentDurLimitHours;

        db.query("UPDATE wtritems SET  ? WHERE item_id = ?", [reqRent, itemId], function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        })
        
    })


    app.get("/fetchSingleReqWtb/:itemid", (req ,res) => {
        const itemId = req.params.itemid;
        // console.log("item id", itemId);
        db.query("SELECT * FROM wtbitems WHERE item_id = ?", itemId, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }

            console.log("item" ,result[0]);
            res.send(result[0]);
        })
    });

    app.get("/fetchSingleReqWtbOwner/:ownerid", (req, res) => {
        const ownerId = req.params.ownerid;
        db.query("SELECT * FROM users WHERE id = ?", ownerId, function(error, result) {
            if (error) {
                console.log(error);
                return error;
            }
            console.log("owner" ,result[0]);
            res.send(result[0]);
        })

        // res.send("done");
    });

    app.get("/fetchSingleReqWtr/:itemid", (req ,res) => {
        const itemId = req.params.itemid;
        // console.log("item id", itemId);
        db.query("SELECT * FROM wtritems WHERE item_id = ?", itemId, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }

            console.log("wtr i" ,result[0]);
            res.send(result[0]);
        })
    });

    app.get("/fetchSingleReqWtrOwner/:ownerid", (req, res) => {
        const ownerId = req.params.ownerid;
        db.query("SELECT * FROM users WHERE id = ?", ownerId, function(error, result) {
            if (error) {
                console.log(error);
                return error;
            }
            console.log("wtr owner" ,result[0]);
            res.send(result[0]);
        })

        // res.send("done");
    });


    app.post("/updateSaleItemDetail", (req ,res) => {
        const details = req.body;

        const {
            itemName,
            itemCategory,
            itemDescription,
            item_dop,
            itemPrice,
            id
        } = req.body;

        var saleItem = {}

        if(itemName) saleItem.item_name = itemName;
        if(itemCategory) saleItem.item_category = itemCategory;
        if(itemDescription) saleItem.item_desc = itemDescription;
        if(item_dop) saleItem.item_dop = item_dop;
        if(itemPrice) saleItem.item_price = itemPrice;

        db.query("UPDATE buyitems set ? WHERE item_id = ?", [saleItem,id], function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        })
    })

    app.post("/updateRentItemDetail", (req ,res) => {
        const details = req.body;
        console.log("curr details", details)

        const {
            itemName,
            itemCategory,
            itemDescription,
            itemPurDate,
            itemRentRate,
            itemRentDurLimitDays,
            itemRentDurLimitHours,
            id
        } = req.body;

        var rentItem = {}

        if(itemName) rentItem.item_name = itemName;
        if(itemCategory) rentItem.item_category = itemCategory;
        if(itemDescription) rentItem.item_desc = itemDescription;
        if(itemPurDate) rentItem.item_dop = itemPurDate;
        if(itemRentRate) rentItem.rent_rate = itemRentRate;
        if(itemRentDurLimitDays) rentItem.rent_duration_days = itemRentDurLimitDays;
        if(itemRentDurLimitHours) rentItem.rent_duration_hours = itemRentDurLimitHours;

        db.query("UPDATE rentitems set ? WHERE item_id = ?", [rentItem,id], function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        })
    })

    app.delete("/deleteSaleItem/:id", (req, res) => {
        const id = req.params.id;
        db.query("delete from buyitems where item_id = ?", id, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send("Deleted");
        })
    })

    app.delete("/deleteRentItem/:id", (req, res) => {
        const id = req.params.id;
        db.query("delete from rentitems where item_id = ?", id, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send("Deleted");
        })
    })

    app.delete("/deletewtbItem/:id", (req, res) => {
        const id = req.params.id;
        db.query("delete from wtbitems where item_id = ?", id, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send("Deleted");
        })
    })

    app.delete("/deletewtrItem/:id", (req, res) => {
        const id = req.params.id;
        db.query("delete from wtritems where item_id = ?", id, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send("Deleted");
        })
    })

    app.get("/fetchUserSaleItem/:id", (req, res) => {
        var id = req.params.id;
        db.query("select * from buyitems where user_id = ?", id, function(error, result) {
            if(error) {
                console.log("i am error", error);
                return error;
            }
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


    // I am currently here
    app.post("/fetchSaleItems", (req, res) => {
        console.log("i am body", req.body);
        var category = req.body.category
        var minPrice = req.body.minPrice
        var maxPrice = req.body.maxPrice;
        if(category === '') category = "category"
        if(minPrice === '') minPrice = -1
        if(maxPrice === '') maxPrice = -1
        db.query(`call filterSaleItems("${category}",${minPrice}, ${maxPrice})`,["%", minPrice, maxPrice] ,function(error, result) {
            if(error) {
                    console.log("queue", error);
                    return error;
                  }
                  res.send(result[0]);
        })
        // db.query(`select * from buyitems where item_category like "${category}" and item_price between ${minPrice} and ${maxPrice}`,["%", minPrice, maxPrice] ,function(error, result) {
        //     if(error) {
        //             console.log("queue", error);
        //             return error;
        //           }
        //           res.send(result);
        // })
        // db.query("SELECT * FROM buyitems", function (error, result) {
        //   if(error) {
        //     console.log("queue", error);
        //     return error;
        //   }
        //   res.send(result);
        // })
      })

      app.post("/fetchRentItems", (req, res) => {
        console.log("i am body", req.body);
        var category = req.body.category
        var minPrice = req.body.minPrice
        var maxPrice = req.body.maxPrice;
        var minRating = req.body.minRating;
        if(category === '') category = "category"
        if(minPrice === '') minPrice = -1
        if(maxPrice === '') maxPrice = -1
        if(minRating === '') minRating = -1

        db.query(`call filterRentItems("${category}",${minPrice}, ${maxPrice}, ${minRating})`,["%", minPrice, maxPrice, minRating] ,function(error, result) {
            if(error) {
                    console.log("queue", error);
                    return error;
                  }
                  console.log("nanan", result)
                  res.send(result[0]);
        })
        // db.query("SELECT * FROM rentitems", function (error, result) {
        //   if(error) {
        //     console.log("queue", error);
        //     return error;
        //   }
        //   res.send(result);
        // })
      })
      
      app.post("/fetchReqWTBItems", (req, res) => {

        console.log("i am body", req.body);
        var category = req.body.category
        var minPrice = req.body.minPrice
        var maxPrice = req.body.maxPrice;
        var sort = req.body.sort;
        if(category === '') category = "category"
        if(minPrice === '') minPrice = -1
        if(maxPrice === '') maxPrice = -1
        if(sort === '') sort = "default"

        db.query(`call filterWTBItems("${category}",${minPrice}, ${maxPrice}, "${sort}")`,["%", minPrice, maxPrice, sort] ,function(error, result) {
            if(error) {
                    console.log("queue", error);
                    return error;
                  }
                  console.log("nanan", result)
                  res.send(result[0]);
        })
      })

      app.post("/fetchReqWTRItems", (req, res) => {

        console.log("i am body", req.body);
        var category = req.body.category
        var minPrice = req.body.minPrice
        var maxPrice = req.body.maxPrice;
        var sort = req.body.sort;
        if(category === '') category = "category"
        if(minPrice === '') minPrice = -1
        if(maxPrice === '') maxPrice = -1
        if(sort === '') sort = "default"

        db.query(`call filterWTRItems("${category}",${minPrice}, ${maxPrice}, "${sort}")`,["%", minPrice, maxPrice, sort] ,function(error, result) {
            if(error) {
                    console.log("queue", error);
                    return error;
                  }
                  console.log("nanan", result)
                  res.send(result[0]);
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
            res.send("wtbitems uploaded");
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

    app.post("/searchQuery", (req, res) => {
        console.log("query", req.body.query);
        db.query(`call searchQuery("%${req.body.query}%")`, req.body.query, function(error, result) {
            if(error) {
                console.log(error);
                return error;
            }
            res.send(result);
        })
    })
};