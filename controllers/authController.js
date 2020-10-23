const { db } = require('../connections')
const { 
    transporter,
    encrypt,
    otp,
    authorization,
    createJWTToken
} = require('../helpers')
const fs = require('fs')
const handlebars = require('handlebars');
const { beginTransaction } = require('../connections/mysqldb');

module.exports = {
    getalluser: (req,res) => {
        // let dt=new Date()
        // let test = dt.setMinutes(dt.getMinutes()+5)
        let sql = `SELECT * FROM users`;
        db.query( sql, (error,datausers) => { 
            if(error) return res.status(500).send({message:"error select all data users"});
            return res.status(200).send(datausers);
        });
    },
    register: (req,res) => {
        const {
            username,
            password,
            email
        } = req.body;
        let sql = `SELECT * FROM users WHERE username = ${db.escape(username)}`;
        db.query(sql,(err,datauser)=>{
            if(err) return res.status(500).send({message:`register.a ${error.message}`});
            if(datauser.length){
                return res.status(400).send({message:"username sudah digunakan"});
            }else{
                let regisdata = {
                    username    : username,
                    email       : email,
                    password    : encrypt(password),
                    lastlogin   : new Date()
                };
                // beginTransaction()
                sql = `INSERT INTO users SET ?`;
                db.query( sql, regisdata, (err,result) => {
                    if(err) return res.status(500).send({message:`register.b ${error.message}`});
                    sql = `SELECT * FROM users WHERE id = ${db.escape(result.insertId)}`;
                    db.query(sql,(err,regisuser)=>{
                        const token = createJWTToken({
                            id      :regisuser[0].id,
                            username:regisuser[0].username
                        });
                        // const link          = `http://localhost:3000/verified?token=${token}`;
                        const htmlrender    = fs.readFileSync('./templates/regis.html','utf-8');
                        const template      = handlebars.compile(htmlrender);
                        console.log(otp)
                        const htmlemail     = template({ 
                            name:regisuser[0].username, 
                            // link, 
                            otp});
                        transporter.sendMail({
                            from    : "be14exam_fitrah <fdtests@gmail.com>",
                            to      : regisuser[0].email,
                            subject : "Verify your account",
                            html    : htmlemail
                        },(error)=>{
                            if(error) return res.status(500).send({message:`register.c ${error.message}`});
                            regisuser[0].token=token
                            return res.status(200).send(regisuser[0])
                        });
                    });
                });   
            };
        });     
    },
    login: (req,res) => {
        const {
            username,
            password
        } = req.body;
        console.log(username, encrypt(password))
        let sql = `SELECT * FROM users WHERE username = ${db.escape(username)} AND password = ${db.escape(encrypt(password))}`;
        db.query(sql,(error,loginuser)=>{
            if(error) return res.status(500).send({message:`login.a ${error.message}`});
            if(!loginuser.length) return res.status(500).send({message:`user tidak terdaftar`});
            let dataedit = {
                lastlogin : new Date()
            };
            sql = `UPDATE users SET ? WHERE id = ${db.escape(loginuser[0].id)}`;
            db.query(sql, dataedit, (error)=>{
                if(error) return res.status(500).send({message:`login.b ${error.message}`});
                const token=createJWTToken({id:loginuser[0].id,username:loginuser[0].username});
                loginuser[0].token=token;
                return res.status(200).send(loginuser[0]);
            });
        })
    },
    requestOTP: (req,res) => {
        const {
            username,
            password
        } = req.body;
        let sql = `SELECT * FROM users WHERE 
                   username = ${db.escape(username)} AND
                   password = ${db.escape(encrypt(password))}`
        // beginTransaction()
        db.query(sql,(error,datauser)=>{
            if(error) return res.status(500).send({message:`requestOTP.a ${error.message}`});
            if(!datauser.length) res.status(500).send({message:`account not registered`}) ;// --> depends on frontend
            if(datauser[0].statusver === 'verified') return res.status(500).send({message:`account already verified`});
            let dataupdate={
                lastlogin:new Date,
                otp
            }
            console.log(otp)
            sql = `UPDATE users SET ? WHERE id = ${db.escape(datauser[0].id)}`;
            db.query(sql, dataupdate, (error,result)=>{
                if(error) return res.status(500).send({message:`requestOTP.b ${error.message}`});
                console.log(result[0])
                const htmlrender    = fs.readFileSync('./templates/regis.html','utf-8');
                const template      = handlebars.compile(htmlrender);
                const htmlemail     = template({ 
                    name:datauser[0].username, 
                    otp});
                transporter.sendMail({
                    from    : "be14exam_fitrah <fdtests@gmail.com>",
                    to      : datauser[0].email,
                    subject : "Verify your account",
                    html    : htmlemail
                },(error)=>{
                    if(error) return res.status(500).send({message:`requestOTP.b ${error.message}`});
                    return res.status(200).send({message:"OTP sent to your registered email"});
                });
            })
        })
    },
    verifOTP: (req,res) => {
        const {
            id,
            otp
        } = req.body;
        let sql = `SELECT * FROM users WHERE id = ${db.escape(id)}`;
        db.query(sql, (error,datauser)=>{
            if(error) return res.status(500).send({message:`verifOTP.a ${error.message}`});
            if(!datauser.length) res.status(500).send({message:`account not registered`});
            if(datauser[0].otp !== otp) return res.status(500).send({message:`OTP did not match`})
            if(new Date().getTime()>datauser[0].lastlogin.setMinutes(datauser[0].lastlogin.getMinutes()+5)) 
            return res.status(500).send({message:`Timeout 1 minute, please request another OTP`})
            let dataupdate = {
                statusver:'verified',
                otp:null,
            };
            sql = `UPDATE users SET ? WHERE id = ${db.escape(datauser[0].id)}`;
            db.query(sql,dataupdate,(error)=>{
                if(error) return respond.status(500).send({message:`verifOTP.b ${error.message}`})
                return res.status(200).send({message:"account verified"})
            })

        })
    }
};
