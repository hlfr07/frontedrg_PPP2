class MisionController {
  
    showHome(req, res) {
      // Imprimir la ruta en la consola
      const ruta = req.originalUrl;
      console.log(`Ruta actual: ${req.originalUrl}`);
      
      res.render('mision', { ruta });
    }
  }
  
  module.exports = new MisionController();