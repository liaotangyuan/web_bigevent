// 我们每次调用$.get()/$.post()/$.ajax()时系统会然调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    // 在真正发起Ajax请求之前，统一拼接上请求的根路径
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;
    
})