const { db } = require('../connections') 

module.exports={
    bestProduct:(req,res)=>{
        let sql=
        `
            SELECT 
                p.image as image,
                pj.namatoko as nama_penjual,
                p.nama as nama_product,
                p.informasiproduct as description
            FROM transaksi t
            JOIN products p
                ON t.productid=p.id
            JOIN penjual pj
                ON p.penjualid=pj.id
            GROUP BY p.nama
            ORDER BY COUNT(*) DESC
            LIMIT 6
        `
        db.query(sql,(error,bestproduct)=>{
            if(error) return res.status(500).send({message:"Server error: Cannot get Best Products"})
            return res.status(200).send(bestproduct)
        })
    }
}