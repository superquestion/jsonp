		_serialize = (obj)-> 
			a = []
			for k of obj 
				 val = obj[k] 
				 if val.constructor == Array
				  for i in val 
				   a.push "#{k}=#{encodeURIComponent i}"
				 else
				   a.push "#{k}=#{encodeURIComponent val}"
			return a	
		ajax = (url,option) ->
		 fn = () ->
		 option = option || {}
		 async = option.async || false
		 method = option.method || "GET"
		 type = option.type || "text"
		 encode = option.encode || "UTF-8"
		 timeout = option.timeout || 0
		 data = option.data || null
		 success = option.success || fn
		 failure = option.failure || fn
		 method = method.toUpperCase()
		 
		 if data && typeof data is "object"
		  data = _serialize data
		  
		 if method is "GET" && data
		  temp = if  url.indexOf("?") is -1 then "?" else "&" 
		  url =temp + data
		  data=null
		 #创建xmlHttpRequest对象
		 xhr = () ->
				try 
					return new XMLHttpRequest()
				catch e
					try
						return new ActiveXObjdect("Xsml2.XMLHTTP")
					catch e
						try
							return new ActiveXObject("Microsoft.XMLHTTP")
						catch e
							alert("create xhr failed")
		  
		 if ! xhr
		  return false
		 #xhr请求超时 
		 isTimeout = false
		 if aysnc && timeout > 0
		  timer = setTimeout -> 
				   isTimeout = true
				   xhr.abort()
				  ,timeout
		 		  
		 #监听xhr状态
		 _onStateChange = (xhr,type,success,failure) ->
		  s=xhr.status
		  if s == 200
		   switch type
		     when "json" then result = () -> return (new Function("return"+xhr.responseText))
		     when "xml" then result = xhr.responseXML
		     when "text" then result = xhr.responseText
		     else
		   success result 
		  else if s is 0
		   faliure xhr,'requset timeout'
		  else
		   faliure xhr,xhr.status
		  
			 
		  return null	 
			
			 
				
		 
		 xhr.onreadystatechange = () ->
		  if  xhr.readyState == 4 && ! isTimeout
		   _onStateChange xhr,type,success,failure
		   clearTimeout timer
		 #发送请求
		 xhr.open method,url,async	
		 if method is "POST"
		  xhr.setRequsetHeader("Content-type","application/x-www-form-urlencoded;charset"+ encode)
		 xhr.send data
		 return xhr
		 
		_Ajax = (url,option) ->
         return new ajax(url,option)
        Dance = @Dance = {}
        Dance._Ajax = ajax	
