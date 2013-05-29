"use strict";
function jsonp(option,callbackName){
    //没有url，函数结束
    if(!option.url || !callbackName){
        return false;
    }
    var data=option.data || {};
    //获得一个唯一的字符串
    var jsc = new Date().getTime();
    //建立暂时的函数式
    data[callbackName]='XD'+jsc++;
    window[data[callbackName]]=function(json){
        option.callback(json);
    }
    var url=option.url+'?'+param(data);
    //获得script
    getScript(url,function(){
        //执行后删除
        window[data[callbackName]]=undefined;
        try{
            delete window[data[callbackName]];

        }catch(e){};
    })
    //内部函数
    //格式化参数
    function param(obj) {
        var pairs = [];
        for(var name in obj) {
             var pair = encodeURIComponent(name) + '=' +  encodeURIComponent(obj[name]);
                 pairs.push(pair.replace('/%20/g', '+'));
            }
        return pairs.join('&');
    }
    function getScript(url, callback) {
        var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState ||
                    this.readyState === "loaded" || 
                    this.readyState === "complete") {
                    this.onload = this.onreadystatechange = null;
                    document.getElementsByTagName('head')[0].removeChild(this);
                        callback();
                        }
            };
        document.getElementsByTagName('head')[0].appendChild(script);
     }

}

window.onload=function(){
    jsonp({
            url :'http://caterpillar.onlyfun.net/Gossip/' 
             +'JavaScript/samples/JSONP-1.php',
            data     : {
                id   :1,
                },
            callback : function(data) {
                console.log(data);
            }
        }, 'jsoncallback');
}
