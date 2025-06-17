class IndexController {
  
    showHome(req, res) {
      const ruta = req.originalUrl;
      res.render('index', { ruta });
    }
  }
  module.exports = new IndexController();