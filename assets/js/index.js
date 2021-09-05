// 入口函数
$(function() {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()

    // 实例化layer
    var layer = layui.layer
    // 给“退回”按钮绑定点击事件
    $('#btnLogout').on('click', function () {
        // 询问用户是否确认退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 当用户点击确定退出
            // 1.清空本地存储中的token值
            localStorage.removeItem('token')
            // 2.页面跳转到登录页面
            location.href = '/login.html'
            
            // 关闭 confirm 询问框
            layer.close(index);
          });
    })
});



// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 原本此处添加请求头的代码已经全部移到了baseAPI.js中统一处理了
        success: function (res) {
            if(res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvater 渲染用户头像
            renderAvater(res.data)
        },

        // 发起的请求无论成功还是失败最终都会调用complete函数(目前此函数已移至baseAPI.js文件)
        // complete: function (res) {...}
    })
}

// 渲染用户头像
function renderAvater(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('.welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 3.按需渲染头像
    if(user.user_pic !== null) {
        // 头像路径不为空则渲染头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        // 隐藏文字头像
        $('.text-avater').hide();
    } else {
        // 没有图片头像则渲染显示文字头像
        let first = name[0].toUpperCase()   // 拿到用户名的第一个字符转成大写
        $('.text-avater').html(first).show();
        // 隐藏图片头像
        $('.layui-nav-img').hide()
    }
}