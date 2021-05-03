const express = require('express')
const sql = require('mssql')
const app = express()
const config = require('./config')
const path = require('path')
app.use(express.urlencoded({extended: true}))
app.listen(3000, ()=> {
    console.log('Listening on port 3000')

})
app.use(express.static('public'))
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '/public/index.html'))

// })
app.get('/form', (req, res) => {
    var dbcon = new sql.ConnectionPool(config)
    dbcon.connect()
    sql.connect(config, (err) => {
        if (err) console.log(err)
        var request = new sql.Request()
        request.query('select * from dbo.Form', (err, recordset) => {
            if (err) console.log(err)
            res.send(recordset.recordsets[0])
        })
    })
})
app.get('/form/:id', (req, res) => {
    var dbcon = new sql.ConnectionPool(config)
    dbcon.connect()
    sql.connect(config, (err) => {
        if (err) console.log(err)
        var request = new sql.Request()
        request.query(`SELECT Id,FirstName, LastName FROM dbo.Form WHERE Id= ${req.params.id}`, (err, recordset) => {
            res.send(recordset.recordset[0])
    })
})
})
app.put('/form/:id/:first/:last', (req, res) => {
     const pool = new sql.ConnectionPool(config)
     pool.connect()
     sql.connect(config, () => {
        const request = new sql.Request()
        return request.query`UPDATE dbo.FORM SET FirstName = ${req.params.first}, LastName = ${req.params.last} WHERE Id = ${req.params.id}`
    })
     res.end()

}) 
app.post('/submit',(req, res)=> {
    console.log(req.body)
    var dbcon = new sql.ConnectionPool(config)
    dbcon.connect()
    sql.connect(config, (err) => {
        if (err) console.log(err)
        const table = new sql.Table('Form')
        table.create = false;
        table.columns.add('FirstName', sql.NVarChar(255), { nullable: true })
        table.columns.add('LastName', sql.NVarChar(255), { nullable: true })
        table.rows.add(req.body.First, req.body.Last)
        const request = new sql.Request()
        request.bulk(table, (err, result) => {
            if (err) console.log(err)
            console.log(result)
        })
        res.end();
    })
    


})
app.delete('/form/:first/:last', (req, res) => {
     var first = req.params.first
     var last = req.params.last
     const pool = new sql.ConnectionPool(config)
     pool.connect()
     sql.connect(config, () => {
        const request = new sql.Request()
        return request.query`DELETE FROM dbo.FORM WHERE FirstName = ${first} AND LastName = ${last}`
    })
     res.end()

 })
