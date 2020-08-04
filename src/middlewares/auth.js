
exports.auth = (req,res,next) => {
    if(!req.session.email){return res.redirect('/login');}
    next()
}

exports.no_auth = (req,res,next) => {
    if(req.session.email){return res.redirect('/profile');}
    next()
}
