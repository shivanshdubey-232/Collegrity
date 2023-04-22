const User = require('../models/user');

module.exports.rederRegister = (req, res) =>{
  res.render('users/register'); 
}
module.exports.register = async(req, res) => {
  try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registerUser = await User.register(user, password);
    req.login(registerUser, err => {
      if(err) return next(err);
      req.flash('success', 'Welcome to the Roveo !!!');
      res.redirect('/colleges');
    })
  } catch(e){  
    req.flash('error', e.message);
    res.redirect('register');
  }
}

module.exports.renderLogin = (req, res) =>{
  res.render('users/login');
}
module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.session.returnTo || '/colleges';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
}