var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')



var plugs = require('../plugs')
var message_content = plugs.first(exports.message_content = [])
var avatar = plugs.first(exports.avatar = [])
var avatar_name = plugs.first(exports.avatar_name = [])
var message_meta = plugs.map(exports.message_meta = [])
var message_action = plugs.map(exports.message_action = [])
var message_link = plugs.first(exports.message_link = [])

var sbot_links = plugs.first(exports.sbot_links = [])

exports.message_render = function (msg, sbot) {
  var el = message_content(msg)
  if(!el) return

  var links = []
  for(var k in CACHE) {
    var _msg = CACHE[k]
    if(_msg.content.type == 'post' && Array.isArray(_msg.content.mentions)) {
      for(var i = 0; i < _msg.content.mentions.length; i++)
        if(_msg.content.mentions[i].link == msg.key)
        links.push(k)
    }
  }

  var backlinks = h('div.backlinks')
  var author = msg.value.author

  if(links.length)
    backlinks.appendChild(h('label', 'backlinks:',
      h('div', links.map(function (key) {
        return message_link(key)
      }))
    ))


//  pull(
//    sbot_links({dest: msg.key, rel: 'mentions', keys: true}),
//    pull.collect(function (err, links) {
//      if(links.length)
//        backlinks.appendChild(h('label', 'backlinks:',
//          h('div', links.map(function (link) {
//            return message_link(link.key)
//          }))
//        ))
//    })
//  )
  var msg = h('div.panel.panel-default', h('div.panel-body', h('div.media',
    h('div.media-left',
      avatar(author, 'thumbnail media-object')
    ),
    h('div.media-body',
      h('h4.media-heading',
        h('a', {href:'#'+author}, avatar_name(author)),
        h('div.pull-right', message_meta(msg))
      ),
      el,
    h('div.message_actions',
      h('div.actions', message_action(msg), ' ',
        h('a', {href: '#' + msg.key}, 'Reply')
      )
    )),
    backlinks,
    {onkeydown: function (ev) {
      //on enter, hit first meta.
      if(ev.keyCode == 13) {
        msg.querySelector('.enter').click()
      }
    }}
  )))

  // ); hyperscript does not seem to set attributes correctly.
  msg.setAttribute('tabindex', '0')

  return msg
}
