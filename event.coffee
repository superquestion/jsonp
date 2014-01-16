# author:yp
# time : 2012-01-16

Events = ->
  obj = {}
  _this = @
  listen = (key, fn) ->
    stack = obj[key] ?= []
    stack.push(fn)

  one = (key, fn) ->
    remove(key)
    listen(key, fn)

  remove = (key) ->
    obj[key]?.length = 0

  trigger = () ->
    key = Array.prototype.shift.call(arguments)
    stack = obj[key] ?= []
    for fn in stack
      return false if fn.apply(_this, arguments) is false

  {listen, one, remove, trigger}
