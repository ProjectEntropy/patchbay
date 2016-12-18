var plugs = require('../plugs')
var h = require('hyperscript')

module.exports = {
  needs: {menu_items: 'map'},
  gives: {connection_status: true, menu: true},
  create: function (api) {

    var menu_items = api.menu_items //plugs.map(exports.menu_items = [])

    var status = h('div.status.error') //start off disconnected
    var dropdown_menu = h("ul.nav.navbar-nav")

    setTimeout(function () {
      menu_items().forEach(function (el) {
        if(el)
          dropdown_menu.appendChild(h("li", el))
      })
    }, 0)

    return {
      connection_status: function (err) {
        if(err) status.classList.add('error')
        else    status.classList.remove('error')
      },
      menu: function () {
        return dropdown_menu
      }
    }
  }
}
