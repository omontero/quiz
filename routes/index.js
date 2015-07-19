var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

// P�gina de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId

// Definici�n de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/author', function(req, res) {
	res.render('author', { name: 'Oscar', surname: 'Montero'});
});

module.exports = router;
