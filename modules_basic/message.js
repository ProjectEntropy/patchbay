var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')

//var plugs = require('../plugs')
//
//var message_content = plugs.first(exports.message_content = [])
//var message_content_mini = plugs.first(exports.message_content_mini = [])
//
//var avatar = plugs.first(exports.avatar = [])
//var avatar_name = plugs.first(exports.avatar_name = [])
//var avatar_link = plugs.first(exports.avatar_link = [])
//var message_meta = plugs.map(exports.message_meta = [])
//var message_action = plugs.map(exports.message_action = [])
//var message_link = plugs.first(exports.message_link = [])
//
//var sbot_links = plugs.first(exports.sbot_links = [])

exports.needs = {
  message_content: 'first',
  message_content_mini: 'first',
  avatar: 'first',
  avatar_name: 'first',
  avatar_link: 'first',
  avatar_image_link: 'first',
  message_meta: 'map',
  message_action: 'map',
  message_link: 'first',
//  sbot_links: 'first'
}

exports.gives = 'message_render'

function message_content_mini_fallback(msg)  {
  return h('code', msg.value.content.type)
}

exports.create = function (api) {

  function mini(msg, el) {
    var div = h('div.message.message--mini',
      h('div.col-md-12',
        h('div',
          api.avatar(msg.value.author, 'avatar-small'),
          h('span.message_content', el)),
        h('div.message_meta.pull-right.text-muted', api.message_meta(msg))
      )
    )
    div.setAttribute('tabindex', '0')
    return div
  }

  return function (msg, sbot) {
    var el = api.message_content_mini(msg)
    if(el) return mini(msg, el)

    var el = api.message_content(msg)
    if(!el) return mini(msg, message_content_mini_fallback(msg))

    var links = []
    for(var k in CACHE) {
      var _msg = CACHE[k]
      if(Array.isArray(_msg.content.mentions)) {
        for(var i = 0; i < _msg.content.mentions.length; i++)
          if(_msg.content.mentions[i].link == msg.key)
          links.push(k)
      }
    }

    var backlinks = h('div.backlinks')
    if(links.length)
      backlinks.appendChild(h('label', 'backlinks:',
        h('div', links.map(function (key) {
          return api.message_link(key)
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
        api.avatar_image_link(msg.value.author, 'media-object.avatar')
      ),
      h('div.media-body',
        h('h4.media-heading',
          h('a', {href:'#'+msg.value.author}, api.avatar_name(msg.value.author)),
          h('small.pull-right.text-muted', api.message_meta(msg))
        ),
        el,
      h('div.message_actions',
        h('div.actions', api.message_action(msg), ' ',
          h('a', {href: '#' + msg.key}, 'Reply')
        )
      )),
      backlinks,
      {onkeydown: function (ev) {
        //on enter, hit first meta.
        if(ev.keyCode == 13) {

          // unless in an input
          if (ev.target.nodeName === 'INPUT'
            || ev.target.nodeName === 'TEXTAREA') return

          msg.querySelector('.enter').click()
        }
      }}

    )))

    // ); hyperscript does not seem to set attributes correctly.
    msg.setAttribute('tabindex', '0')

    return msg
  }
}
