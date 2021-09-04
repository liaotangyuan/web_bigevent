$(function () {
    // 点击“去注册”链接
    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击“去登录”链接
    $('#link-login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 自定义表单校验规则
    // 1.从layui中获取form对象
    var form = layui.form
    // 获取layui中的layer对象设置注册的提示效果
    var layer = layui.layer
    // 2.通过form.verify()函数校验规则
    form.verify({
        // 3.自定义了一个叫pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码输入是否一致
        repwd: function (value) {  // value是确认密码框中的值
            // pwd是输入密码框中的值
            var pwd = $('.reg-box [name=password]').val()
            // 判断两次密码值是否相等
            if(pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 这个url最终请求时是会经过baseAPI.js拼接完整的
        let url = '/api/reguser';
        let data = {username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}
        $.post(url, data, function (res) {
        if(res.status !== 0) {
            return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
        // 代码触发“去登录”链接的点击事件
        $('#link-login').click();

        })
    })

    // 监听登录按钮的提交事件
    $('#form_login').submit(function(e) {
        // 先阻止表单的默认提交行为
        e.preventDefault();
        // 这个url最终请求时是会经过baseAPI.js拼接完整的
        let url = '/api/login'
        // 快速获取表单数据
        let data = $(this).serialize();
        $.post(url, data, function(res) {
            if(res.status !== 0) {
                return layer.msg('登录失败！')
            }
            layer.msg('登录成功！')
            // 将登录成功得到的token字符串，保存到localStorage中，便于后续的使用
            localStorage.setItem('token', res.token)
            // 跳转到index主页
            location.href = '/index.html'
        })
    })


})