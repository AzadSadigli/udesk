const fs = require('fs');

let configs = JSON.parse(fs.readFileSync('./config/config.json'));
let locals = {project_name: configs.project_name};


exports.getHome = (req, res) => {
    locals = Object.assign(locals,{
        title: 'Home',
        link: 'home',
        description: 'Page Description',
        header: 'Page Header'
      });
    res.render('index',locals)
}

exports.getTable = (req, res) => {
  locals = Object.assign(locals,{
      title: 'Table',
      link: 'table',
      description: 'Page Description',
      header: 'Page Header'
    });
  res.render('table',locals)
}

exports.getSales = (req, res) => {
  locals = Object.assign(locals,{
      title: 'Sales',
      link: 'sales',
      description: 'Page Description',
      header: 'Page Header'
    });
  res.render('sales/add',locals)
}


exports.getTabs = (req, res) => {
  locals = Object.assign(locals,{
      title: 'Tabs',
      link: 'tabs',
      description: 'Page Description',
      header: 'Page Header'
    });
  res.render('tabs',locals)
}