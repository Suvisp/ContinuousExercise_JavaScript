var express = require('express');
var uuid = require('uuid/v4');
var router = express.Router();
var fs = require('fs');

var topiclist = [];

fs.readFile('topics.json', (err, data) => {
  // console.log('topics read');
  topiclist = JSON.parse(data);
  console.dir(topiclist);
})

/* GET /api/topic */
router.get('/', function (req, res, next) {
  res.json(topiclist);
});
// GET /api/topic/1
router.get('/:id', function (req, res, next) {
  let topic = topiclist.find(t => t.id == req.params.id);
  res.json(topic);
})
// POST
router.post('/', function (req, res, next) {
  console.dir(req.body);
  let newtopic = req.body;
  const uudenid = uuid()
  newtopic.id = uudenid;
  topiclist.push(newtopic)
  console.log(topiclist)
  fs.writeFile('topics.json', JSON.stringify(topiclist), () => { console.log("Topics saved") }) //tallettaa aiheet palvelimelle
  res.json(topiclist) //palauttaa arrayn! client puolelle
})
//PUT /api/topic/2
router.put('/:id', function (req, res, next) {
  let topicind = topiclist.findIndex(t => t.id == req.params.id);
  topiclist[topicind] = req.body
  fs.writeFile('topics.json', JSON.stringify(topiclist), () => { console.log("Topics updated") }) //tallettaa aiheet palvelimelle
  res.json({ message: topicind + " updated" });
})
//DELETE 
router.delete('/:id', function (req, res, next) {
  topiclist = topiclist.filter(t => t.id != req.params.id)
  console.log(req)
  res.json("{msg: 'Topic deleted'}");
  fs.writeFile("topics.json", JSON.stringify(topiclist), () => { console.log("Topics saved") });
  return;
  res.json({ message: "deleted: " + req.params.id })
})

module.exports = router;
