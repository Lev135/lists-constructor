module.exports = (Models) => {
  const ThemeService = require('../services/tag-service')(Models.tags.Theme),
        SourceService = require('../services/tag-service')(Models.tags.Source);

  return{
    getTagTree: async (req, res) => {
      try {
        const type = req.query.type;
        if (!type) {
          throw {message: "в запросе не указан тип тэгов"};
        }
        let obj = {};
        if (type == 'themes') {
          obj = await ThemeService.allToObjects();
        }
        else if (type == 'sources') {
          obj = await SourceService.allToObjects();
        }
        else {
          throw({message: `не распознан тип тэгов: ${type}`});
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(obj));
      }
      catch (err) {
        console.error(err);
        res.send(`Ошибка при обработке запроса на получение дерева тэгов: ${err.message}`);
      }
    }
  };
};
