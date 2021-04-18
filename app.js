require('dotenv').config({ path: __dirname + '/process.env' })
const express = require('express')
const app = express()
const sql = require('mssql')
const config = require('./config')
const port = process.env.AP_PORT;
const path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))

})
app.post('/submit', (req, res) => {
    var dbcon = new sql.ConnectionPool(config)
    dbcon.connect()
    sql.connect(config, (err) => {
        if (err) console.log(err)
        const table = new sql.Table('Forms')
        table.create = false;
        table.columns.add('FirstName', sql.NVarChar(50), { nullable: true })
        table.columns.add('LastName', sql.NVarChar(50), { nullable: true })
        table.rows.add(req.body.First, req.body.Last)
        const request = new sql.Request()
        request.bulk(table, (err, result) => {
            if (err) console.log(err)
            console.log(result)
        })
        res.end();
    })
})
app.get('/form', (req, res) => {
    var dbcon = new sql.ConnectionPool(config)
    dbcon.connect()
    sql.connect(config, (err) => {
        if (err) console.log(err)
        var request = new sql.Request()
        request.query('select * from dbo.Forms', (err, recordset) => {
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
        request.query('select * from dbo.Forms', (err, recordset) => {
            if (err) console.log(err)
            res.send(recordset.recordsets[0][req.params.id])
        })
    })
})


app.listen(port, (err) => {
    if (err) console.log(err)
    console.log(`Running on port ${port}`)
})