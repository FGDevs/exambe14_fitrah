const { db } = require('../connections') 

module.exports={
    pendapatan: (req,res) => {
        let sql =
        `
            SELECT 
                SUM(quantity*hargabeli)*0.1 as Total
            FROM transaksi
                WHERE status = 'Finished'
        `
        db.query(sql,(error,pendapatan) => {
            if(error) return res.status(500).send({message:"Server error: Cannot get Pendapatan"})
            sql = 
            `
                SELECT SUM(quantity*hargabeli)*0.1 as Total
                FROM transaksi;
        
            `
            db.query(sql,(error,pendapatanpotensial)=>{
                if(error) return res.status(500).send({message:"Server error: Cannot get Pendapatan Potensial"})
                return res.status(200).send({pendapatan:pendapatan[0], pendapatanpotensial:pendapatanpotensial[0] })
            })
        })
    },

    // ->> Jawaban 2.b
    penjualTerbaik: (req,res) => {
        let sql = 
        `
            SELECT 
               p.namatoko
            FROM penjual p
            JOIN transaksi t
               ON p.id = t.penjualid
                   WHERE t.status = 'Finished'
            GROUP BY p.namatoko
            ORDER BY Count(*)
            LIMIT 1
        `
        db.query(sql,(error,penjualterbaik)=>{
            if(error) return res.status(500).send({message:"Server error: Cannot get Penjual Terbaik"})
            return res.status(200).send(penjualterbaik[0])
        })
    },
    
    // ->> Jawaban 2.c
    categoryTerbaik: (req,res) => {
        let sql=
        `
            SELECT 
                cp.namacategory
            FROM products p
            JOIN transaksi t
                ON p.id = t.productid
            JOIN category_products cp
                ON p.categoryprodid = cp.id
                    WHERE t.status='Finished'
            GROUP BY cp.namacategory
            ORDER BY COUNT(*) DESC
            LIMIT 1
        `
        db.query(sql,(error,categoryterbaik)=>{
            if(error) return res.status(500).send({message:"Server error: Cannot get Category Terbaik"})
            return res.status(200).send(categoryterbaik[0])
        })
    },

    // Jawaban 2.d 
    totalUser:(req,res)=>{
        let sql =
        `
            SELECT COUNT(*) as User
            FROM users u
            LEFT JOIN penjual p
                ON u.id = p.id
                    WHERE p.id IS NULL
        `
        db.query(sql,(error,totaluser)=>{
            if(error) return res.status(500).send({message:"Server error: Cannot get Total User"})
            return res.status(200).send(totaluser[0])
        })
    }
    

}