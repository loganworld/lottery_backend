let mongoose = require('mongoose');
let express = require('express');
const multer = require('multer');
let router = express.Router();
const fs = require("fs");
let ReferralSchema = require('../../models/referral');

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}
let random = between(1,900000000)

router.route('/add-profit-to-referral').post((req,res,next)=>{
    console.log(req.body.publicKey);
    var pub = req.body.publicKey.toLowerCase();
    ReferralSchema.findOne({publicKey: pub})
    .then((check)=>{
        if(check){
            ReferralSchema.findOneAndUpdate({publicKey: pub},{$inc:{amount: req.body.amount}}, (error, data)=>{
                if(error){
                    console.log(error)
                }
                else{
                    res.json(data);
                }
            })
        }
        else{
            ReferralSchema.create(req.body, (error, data)=>{
                console.log("wowwowowowowow",data)
                if (error) {
                    console.log(error)
                }
                else
                    res.json(data);
            })
        }
    })

})
    

router.route('/get-referral-amount').post((req,res, next) =>{
    console.log(req.body.publicKey.toLowerCase());
    var pubKey = req.body.publicKey.toLowerCase();
    ReferralSchema.findOne({publicKey: pubKey })
    .then((check)=>{
        console.log(check);
        if(check){
           res.json(check);
        }
        else{
            res.json({amount: 0});
        }
    })
})

router.route('/withdraw').post((req,res, next) =>{
    console.log(req.body.publicKey.toLowerCase());
    var pubKey = req.body.publicKey.toLowerCase();
    ReferralSchema.findOneAndUpdate({publicKey: pubKey},{amount: 0}, (error, data)=>{
        if(error){
            console.log(error)
        }
        else{
            res.json(data);
        }
    })
})

router.route('/get-all-referral').post((req, res)=>{
    ReferralSchema.find((error, data)=>{
        if(error)
        console.log(error);
        else
        res.json(data);
    })
})

router.route('/delete-patient').post((req,res)=>{
    console.log(req.body)
    ReferralSchema.findByIdAndRemove(req.body.id, (error,data)=>{
        if(error){
            
        }
        else{
            res.json(data)
        }
    })
})

module.exports = router;