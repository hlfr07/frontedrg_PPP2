class VisionController {
  
    showHome(req, res) {
        const ruta = req.originalUrl;
      res.render('vision', { ruta });
    }
  }
  module.exports = new VisionController();