// 我们每次调用$.get()/$.post()/$.ajax()时系统会然调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在真正发起Ajax请求之前，统一拼接上请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    
    // 统一为有权限的接口，设置headers请求头
    if(options.url.indexOf('/my/') !== -1) {
        options.Headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // 在 complate 中可以使用 res.responseJSON 拿到服务器响应回来的数据
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token的值
            localStorage.removeItem('token')
            // 2.强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})