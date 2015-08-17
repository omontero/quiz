// MW de autorizaci�n de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
    if (req.session.user) {
    		// Comprobamos si ha caducado la sesi�n
    		var fechaActual = new Date();
    		var miliSecActual = fechaActual.getTime();
    		var difMiliSec = miliSecActual - req.session.miliSecInicio;
    		// Si la diferencia es mayor a 120000 (2 minutos), borramos la sesi�n
    		if (difMiliSec > 120000) {
    			delete req.session.user;
    			res.redirect('/login');
    		}
    		else {
    			next();
      	}
    } else {
        res.redirect('/login');
    }
};

// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // si hay error retornamos mensajes de error de sesi�n
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");        
            return;
        }

        // Crear req.session.user y guardar campos   id  y  username
        // La sesi�n se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username};

				// Almacenamos en session la marca de tiempo que permitir� determinar el logout autom�tico
				var fechaInicial = new Date();
				req.session.miliSecInicio = fechaInicial.getTime();

        res.redirect(req.session.redir.toString());// redirecci�n a path anterior a login
    });
};

// DELETE /logout   -- Destruir sesion 
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};
