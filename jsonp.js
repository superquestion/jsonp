window.onload = function() {
                function param(obj) {
                    var pairs = [];
                    for(var name in obj) {
                        var pair = encodeURIComponent(name) + '=' + 
                                   encodeURIComponent(obj[name]);
                        pairs.push(pair.replace('/%20/g', '+'));
                    }
                    return pairs.join('&');
                }
                
                function getScript(url, callback) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    
                    // 跨瀏覽器處理 script 下載完成後的事件
                    script.onload = script.onreadystatechange = function() {
                        if (!this.readyState ||
                            this.readyState === "loaded" || 
                            this.readyState === "complete") {
                            this.onload = this.onreadystatechange = null;
                            document.getElementsByTagName('head')[0]
                                    .removeChild(this);
                            callback();
                        }
                    };
                    
                    document.getElementsByTagName('head')[0]
                            .appendChild(script);
                }
                
                function jsonp(option,callbackName) {
                    // 沒有url或伺服端要求的callbackName就結束
                    if(!option.url || !callbackName) {
                        return;
                    }
                    var data = option.data || {};
                    
                    // 建立暫時的函式
                    data[callbackName] = 'XD' + jsonp.jsc++;
                   // 
                   window[data[callbackName]] = function(json) {
                    	//if(timeId){
                    	//	clearTimeout(timeId);
                    	//}
                    	
                    	//var flag=false;
                    	//setTimeout(function(){
                    		//if(!json){
                    			//flag=true;
                    		//}
                    	//},5000)
                    	//if(!flag){
                    		//json.code='408';
                    		//408 请求超时
                    	//}
                        option.callback(json);
                    };
                    var url = option.url + '?' + param(data);
                    
                    // 取得 script 檔案
                    getScript(url, function() {
                         // script 下載並執行完後移除暫時的函式
                         window[data[callbackName]] = undefined;
                         try {
                             delete window[data[callbackName]];
                         }
                         catch(e) {}
                    });
                }
                jsonp.jsc = new Date().getTime();
                
                document.getElementById('test').onclick = function() {
                	console.log('in')
                    jsonp({
                        url      : url
                        data     : {
                            id   : document.getElementById('id').value,
                        },
                        callback : function(person) {
                            document.getElementById('result').innerHTML = 
                                person.name + ',' + person.age;
                        }
                    }, 'jsoncallback');
                };
            };