export default function(req, res, next) {
    const d = req.session.user = 'd';
    console.log(d);
    next();
}
