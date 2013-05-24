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
                    
                    // ��g�[��̎�� script ���d�������¼�
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
                    // �]��url���ŷ���Ҫ���callbackName�ͽY��
                    if(!option.url || !callbackName) {
                        return;
                    }
                    var data = option.data || {};
                    
                    // �������r�ĺ�ʽ
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
                    		//408 ����ʱ
                    	//}
                        option.callback(json);
                    };
                    var url = option.url + '?' + param(data);
                    
                    // ȡ�� script �n��
                    getScript(url, function() {
                         // script ���d�K���������Ƴ����r�ĺ�ʽ
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