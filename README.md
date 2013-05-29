jsonp
=====

js对jsonp的封装

跨域这个问题的产生根本原因是浏览器的同源策略限制,同源策略是指阻止代码获得或者更改从另一个域名下获得的文件或者信息。
也就是说我们的请求地址必须和当前网站的地指相同。同源策略通过隔离来实现对资源的保护.

jsonp 利用动态的在页面添加标签的方法，解决跨域。

jsonp的执行步骤：
1.动态的添加script 标签。
2.向服务器请求数据。
3.生成数据如callback_something({1,2,3,4});
4.jsonp 通过widow[someting]=function(json){
    callback(json);
}
