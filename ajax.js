Ajax = function() {
			function request(url, opt) {
				function fn() {
				}

				opt = opt || {};
				var async = opt.async !== false, method = opt.method || 'GET', type = opt.type || 'text', encode = opt.encode || 'UTF-8', timeout = opt.timeout || 0, data = opt.data || null, success = opt.success || fn, failure = opt.failure || fn;
				method = method.toUpperCase();
				if(data && typeof data == 'object') {
					data = _serialize(data);
				}
				if(method == 'GET' && data) {
					url += (url.indexOf('?') == -1 ? '?' : '&') + data;
					data = null;
				}
				var xhr = function() {
					try {
						return new XMLHttpRequest();
					} catch(e) {
						try {
							return new ActiveXObject('Msxml2.XMLHTTP');
						} catch(e) {
							try {
								return new ActiveXObject('Microsoft.XMLHTTP');
							} catch(e) {
								failure(null, 'create xhr failed', e);
							}
						}
					}
				}();
				if(!xhr) {
					return;
				}
				var isTimeout = false, timer;
				if(async && timeout > 0) {
					timer = setTimeout(function() {
						xhr.abort();
						isTimeout = true;
					}, timeout);
				}
				xhr.onreadystatechange = function() {
					if(xhr.readyState == 4 && !isTimeout) {
						_onStateChange(xhr, type, success, failure);
						clearTimeout(timer);
					} else {
					}
				};
				xhr.open(method, url, async);
				if(method == 'POST') {
					xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
				}
				xhr.send(data);
				return xhr;
			}

			function _serialize(obj) {
				var a = [];
				for(var k in obj) {
					var val = obj[k];
					if(val.constructor == Array) {
						for(var i = 0, len = val.length; i < len; i++) {
							a.push(k + '=' + encodeURIComponent(val[i]));
						}
					} else {
						a.push(k + '=' + encodeURIComponent(val));
					}
				}
				return a.join('&');
			}

			function _onStateChange(xhr, type, success, failure) {
				var s = xhr.status, result;
				if(s >= 200 && s < 300) {
					switch(type) {
						case 'text':
							result = xhr.responseText;
							break;
						case 'json':
							result = function(str) {
								return (new Function('return ' + str))();
							}(xhr.responseText);
							break;
						case 'xml':
							result = xhr.responseXML;
							break;
					}
					success(result);
				} else if(s === 0) {
					failure(xhr, 'request timeout');
				} else {
					failure(xhr, xhr.status);
				}
				xhr = null;
			}

			return (function() {
				var Ajax = {
					request : request
				}, types = ['text', 'json', 'xml'];
				for(var i = 0, len = types.length; i < len; i++) {
					Ajax[types[i]] = function(i) {
						return function(url, opt) {
							opt = opt || {};
							opt.type = types[i];
							return request(url, opt);
						}
					}(i);
				}
				return Ajax;
			})();
		}();
