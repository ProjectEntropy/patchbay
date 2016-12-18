var plugs = require('../plugs')
var h = require('hyperscript')

module.exports = {
  needs: {screen_view: 'first'},
  gives: 'app',
  create: function (api) {
    return function () {

      document.head.appendChild(h('link', {rel: "stylesheet", href:"dev-style.css"}))

      document.head.appendChild(h('link', {rel: "stylesheet", href:"https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css"}))

      document.head.appendChild(h('script', {src: "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"}))
      document.head.appendChild(h('script', {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"}))

      document.head.appendChild(h('style', require('../style.css.json')))

      window.addEventListener('error', window.onError = function (e) {
        document.body.appendChild(h('div.error',
          h('h1', e.message),
          h('big', h('code', e.filename + ':' + e.lineno)),
          h('pre', e.error ? (e.error.stack || e.error.toString()) : e.toString())))
      })

      function hash() {
        return window.location.hash.substring(1)
      }

      console.log(hash() || 'tabs')
      var view = api.screen_view(hash() || 'tabs')

      var sidebar = h("div#sidebar.column.col-sm-2.col-xs-1.sidebar-offcanvas",
                    [ h("ul.nav", [
                        h("li", [ h("a.visible-xs.text-center", {"attributes":{"href":"#"},"dataset":{"toggle":"offcanvas"}}, [ h("i.glyphicon.glyphicon-chevron-right") ]) ]) ]),
                          h("ul#lg-menu.nav.hidden-xs", [
                            h("li.active", [ h("a", {"attributes":{"href":"#featured"}}, [ h("i.glyphicon.glyphicon-list-alt"), " Featured" ]) ]),
                            h("li", [ h("a", {"attributes":{"href":"#stories"}}, [ h("i.glyphicon.glyphicon-list"), " Stories" ]) ]),
                            h("li", [ h("a", {"attributes":{"href":"#"}}, [ h("i.glyphicon.glyphicon-paperclip"), " Saved" ]) ]),
                            h("li", [ h("a", {"attributes":{"href":"#"}}, [ h("i.glyphicon.glyphicon-refresh"), " Refresh" ]) ]) ]),
                          h("ul#sidebar-footer.list-unstyled.hidden-xs",
                            [ h("li", [ h("a", {"attributes":{"href":"http://ssbc.github.io"}}, [ h("h3", [ "SSBC Patchbay" ]), " "]) ]) ]),

                          h("ul#xs-menu.nav.visible-xs", [ "\t",
                            h("li", [ h("a.text-center", {"attributes":{"href":"#featured"}}, [ h("i.glyphicon.glyphicon-list-alt") ]) ]),
                            h("li", [ h("a.text-center", {"attributes":{"href":"#stories"}}, [ h("i.glyphicon.glyphicon-list") ]) ]), "\t",
                            h("li", [ h("a.text-center", {"attributes":{"href":"#"}}, [ h("i.glyphicon.glyphicon-paperclip") ]) ]),
                            h("li", [ h("a.text-center", {"attributes":{"href":"#"}}, [ h("i.glyphicon.glyphicon-refresh") ]) ]) ]) ])

      var screen = h('div.screen.column.col-sm-10.col-xs-11', view)

      window.onhashchange = function (ev) {
        var _view = view
        view = api.screen_view(hash() || 'tabs')

        if(_view) screen.replaceChild(view, _view)
        else      document.body.appendChild(view)
      }

      document.body.appendChild(sidebar)
      document.body.appendChild(screen)

      return screen
    }
  }
}
