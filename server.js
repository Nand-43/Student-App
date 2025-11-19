const express = require("express")
const cors = require("cors")
const postgresPool = require("pg").Pool
const app = express()
const bodyParser = require("body-parser")
const port = process.env.PORT || 3005

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

app.listen(port,(err) =>{
    if(err) throw err;
    console.log(`Server is running successfully on port: ${port}`)
})


const pool= new postgresPool({
    user: "postgres",
    password: "1234",
    database: "student_db",
    host: "localhost",
    port: 5432,
    max: 10    
})

pool.connect((err, connection) => {
    if(err) throw err;
    console.log("Connected to Database Successfully")
})   

app.get("/students",(req,res) => {
    const sql = "Select * from student";
    pool.query(sql,(err,result) => {
        if(err) return res.json(err);
        return res.status(200).json(result.rows)
    })
})

app.get("/students/:studentId",(req,res) => {
    const stdId = Number(req.params.studentId);
    const sql = "Select * from student WHERE studentid= $1";
    pool.query(sql,[stdId],(err,result) => {
        if(err) return res.json(err);
        return res.status(200).json(result.rows[0])
    })
})

app.post("/students",(req,res) => {
    const {name,major,email}=req.body
    const sql = "Insert into student(name,major,email) values($1,$2,$3) Returning *";
    pool.query(sql,[name,major,email],(err,result) =>{
        if(err) return res.json(err);
        return res.status(201).json(result.rows[0])
    })
})

app.patch("/students/:studentId",(req,res) => {
    const stdId = Number(req.params.studentId);
    const {name,major,email}=req.body
    const sql = "Update student Set name=$1, major=$2, email=$3 where studentid=$4";
    pool.query(sql,[name,major,email,stdId],(err,result) => {
        if(err) return res.json(err);
        return res.status(200).send(`Student is Updated successfully for studentid: ${stdId}`)
    })
})

app.delete("/students/:studentId",(req,res) => {
    const stdId = Number(req.params.studentId);
    const sql = "Update student Set where studentid=$1";
    pool.query(sql,[stdId],(err,result) => {
        if(err) return res.json(err);
        return res.status(200).send(`Student is Delete successfully for studentid: ${stdId}`)
    })
})

