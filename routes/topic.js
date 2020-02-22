/*
    Muuta salasana alta oikeaksi!!
    (käyttää ympäristömuuttujaa, eli voit myös muokata .env tiedostoa)
*/
var express = require('express');
// var uuid = require('uuid/v4');
var router = express.Router();
require('dotenv').config(); // tämä lukee .env-tiedoston
const SALASANA = process.env.PGPASSWORD;
// var fs = require('fs');
const Pool = require('pg').Pool;

const conopts = {
  user: 'postgres',
  password: SALASANA,
  host: 'localhost',
  database: 'continuousproject',
} //port: 5432

const pool = new Pool(conopts);

router.get('/', function (req, res) {
  pool.query("SELECT * FROM topics", (error, data) => {
    console.log(data.rows);
    // res.json(data);
    res.json(data.rows);
  })
})
router.get('/:id', function (req, res) {
  const id = req.params.id
  pool.query("SELECT * FROM topics WHERE id = $1", [id], (error, data) => {
    console.log(data);
    // res.json(data);
    res.json(data.rows[0]);
  })
})
router.post('/', function (req, res) {
  const { title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate } = req.body
  pool.query("INSERT INTO topics (title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate], (err, data) => {
      // if (err) throw err;
      console.log(err);
      res.json({ message: "Success! Rowcount" });
    })
})
router.delete('/:id', function (req, response, next) {
  const id = req.params.id
  pool.query("DELETE FROM topics WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.json({ message: "Deleted!" });

  })
})
router.put('/:id', function (req, response, next) {
  const id = req.params.id
  const { title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate } = req.body
  pool.query("UPDATE topics SET title = $1, description = $2, timeToMaster = $3, timeSpent = $4, source = $5, startDate = $6, inProgress = $7, completionDate = $8 WHERE id = $9",
    [title, description, timeToMaster, timeSpent, source, startDate, inProgress, completionDate, id],
    (error, data) => {
      if (error) {
        console.dir(error)
        throw error
      }
      response.json({ message: "Changes made!" });
    }
  )
})
// //DELETE 
// router.delete('/:id', function (req, res, next) {
//   topiclist = topiclist.filter(t => t.id != req.params.id)
//   console.log(req)
//   res.json("{msg: 'Topic deleted'}");
//   fs.writeFile("topics.json", JSON.stringify(topiclist), () => { console.log("Topics saved") });
//   return;
//   res.json({ message: "deleted: " + req.params.id })
// })

module.exports = router;
