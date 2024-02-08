module.exports = {
    checkAdmin: function(request, response, next) {
        if(request.isAuthenticated() && request.user.admin == 1) {
            return next();
        }

        request.flash('error_msg', 'Exclusive for administrators');
        response.redirect('/');
    }
}