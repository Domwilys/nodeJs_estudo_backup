module.exports = {
    checkAuthenticated: function (request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        };

        request.flash('error_msg', 'Login required');
        response.redirect('/user/login');
    }
};