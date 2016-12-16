var plugs = require('../plugs')
var h = require('hyperscript')

module.exports = {
  needs: {menu_items: 'map'},
  gives: {connection_status: true, menu: true},
  create: function (api) {

    var menu_items = api.menu_items //plugs.map(exports.menu_items = [])

    var status = h('div.status.error') //start off disconnected
    var dropdown_menu = h("ul.dropdown-menu")
    var list = h('li.dropdown',
                 h("a.dropdown-toggle",
                   {
                      "href":"#",
                      "role":"button",
                      "aria-haspopup":"true",
                      "aria-expanded":"false",
                      "data-toggle":"dropdown",
                      "haspopup": "true",
                      "aria-expanded": "false"
                    },
                    status
                  ),
                  dropdown_menu
                )

    var menu = h('ul.nav.navbar-nav.navbar-right', list)

    setTimeout(function () {
      menu_items().forEach(function (el) {
        if(el)
          dropdown_menu.appendChild(h("ul", el))
      })
    }, 0)

    return {
      connection_status: function (err) {
        if(err) status.classList.add('error')
        else    status.classList.remove('error')
      },
      menu: function () {
        return menu
      }
    }
  }
}
