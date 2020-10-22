const { db } = require('../connections')

module.exports = {
    getalluser: (req,res) => {
        let sql=`SELECT * FROM users`
        db.query(sql,(error,datausers)=>{
            if(error) return res.status(500).send({message:"error select all data users"})
            return res.status(200).send(datausers)
        })
    }
}