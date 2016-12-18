var lightbox = require('hyperlightbox')
var h = require('hyperscript')
var u = require('../util')
var self_id = require('../keys').id
//publish or add

var plugs = require('../plugs')

exports.needs = {
  publish: 'first', message_content: 'first', avatar: 'first',
  message_meta: 'map'
}

exports.gives = 'message_confirm'

//var publish = plugs.first(exports.sbot_publish = [])
//var message_content = plugs.first(exports.message_content = [])
//var avatar = plugs.first(exports.avatar = [])
//var message_meta = plugs.map(exports.message_meta = [])
//
exports.create = function (api) {
  return function (content, cb) {

    cb = cb || function () {}

    var lb = lightbox()
    document.body.appendChild(lb)

    var msg = {
      key: "DRAFT",
      value: {
        author: self_id,
        previous: null,
        sequence: null,
        timestamp: Date.now(),
        content: content
      }
    }

    var okay = h('button.btn.btn-primary', 'Send', {onclick: function () {
      lb.remove()
      api.publish(content, cb)
    }})

    var cancel = h('button.btn.btn-default', 'Cancel', {onclick: function () {
      lb.remove()
      cb(null)
    }})

    okay.addEventListener('keydown', function (ev) {
      if(ev.keyCode === 27) cancel.click() //escape
    })

    lb.show(h('div.column.message-confirm',
      h('div.panel.panel-default',
        h('div.panel-heading',
          h('div.message_meta.pull-right', api.message_meta(msg)),
          h('div.avatar', api.avatar(msg.value.author, 'avatar'))
        ),
        h('div.panel-body', api.message_content(msg)
          || h('pre', JSON.stringify(msg, null, 2)))
      ),
      h('div.btn-group', okay, cancel)
    ))

    okay.focus()
  }
}
