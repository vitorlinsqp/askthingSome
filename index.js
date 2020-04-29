const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");
const Answer = require("./database/Answer");

//Database
connection.authenticate().then(() => {
  console.log("Connect to the DATABASE")
}).catch((msg_err) => {
  console.log(msg_err);
})


//setting express to use ejs as view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));

//body-parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.get("/", (req, res) => {
  //for new questions be move to top of questions - order by id
  Question.findAll({
    raw: true, order: [
      //setup desc date order to add new on top
      ['id', 'DESC']
    ]
  }).then(questions => {
    res.render('index', {
      questions: questions
    });
  });
});

app.get("/asking", (req, res) => {
  res.render("asking");
})

app.post("/saveask", (req, res) => {
  var title = req.body.title;
  var description = req.body.description;

  Question.create({
    title: title,
    description: description
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/asking/:id", (req, res) => {
  var id = req.params.id;
  Question.findOne({
    where: { id: id }
  }).then(question => {
    if (question != undefined) {  //question(id) founded

      Answer.findAll({
        where: { questionId: question.id },
        order: [['id', 'DESC']]
      }).then(answers => {
        res.render("ask", {
          question: question,
          answers: answers
        })
      });
    } else {  //id not founded
      res.redirect("/");
    }
  });
});

app.post("/answer", (req, res) => {
  var body = req.body.body;
  var questionId = req.body.question;

  Answer.create({
    body: body,
    questionId: questionId
  }).then(() => {
    res.redirect("/asking/" + questionId);
  });
});



app.listen(8080, () => {
  console.log("Things running ok  :))");
});