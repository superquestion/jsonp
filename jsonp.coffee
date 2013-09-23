	jsonp = (option,callbackName) ->
		return false if !option.url || !callbackName
		data = option.data || {}
		jsc = new Date().getTime()
		data[callbackName] = 'XD' + jsc
		window[data[callback]] = (data) ->
			option.callback(data)
		param = (obj) ->
			for name of obj
				pair = encodeURIComponent(name) + "=" + encodeURIComponent(obj[name])
				pairs=pair.replace("/%20/g", "+")
			pairs.join("&")
		del = () ->
			try 
				delete window[data[callbackName]]
			catch e
				window[data[callbackName]] = null
		getScript = (url,callback) ->
			doc = document
			script = doc.createElement("script")
			script.src = url
			script.onload = script.onreadystatechange = () ->
				if !@readyState || @readyState == "loaded" || @readyState == "complete"
					@onload = this.onreadystatechange = null;
					callback()
					doc.getElementsByTagName('head')[0].removeChild(@);
			doc.getElementsByTagName('head')[0].appendChild(script);	
		url = option.url + param(data)	
		getScript(url,del)	
		@
		
	_jsonp = (option,callbackName) ->
		new jsonp(option,callbackName)
	Dance = Dance = {}
	Dance._jsonp = jsonp
                       
	
