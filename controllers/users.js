const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');

}

module.exports.register = async (req, res, next) => {
    //--TEST--res.send(req.body)
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        //console.log(registeredUser);
        ///---hide and registeredUser  and not to login /put next router.post
        req.login(registeredUser, err => {
            if (err) return next(err);
            ///---add--name  + req.body.username
            req.flash('success', 'Welcome to dream-house!' + req.body.username);
            res.redirect('/houses');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
////---add--name  + req.body.username
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!' + req.body.username);
    ///--session
    const redirectUrl = req.session.returnTo || '/houses';
    ///--delete is to remove the returnTo: '/campgrounds/5fc154980aa0c8133c8fbb4d/edit'
    delete req.session.returnTo;
    //res.redirect('/houses');
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Your Logout!");
    res.redirect('/houses');
}