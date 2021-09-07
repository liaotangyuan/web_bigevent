$(function () {

    // 自定义一个限制昵称长度的表单验证规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度只能在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo();

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用form.val()快速为表单赋值
                form.val('formUserInof', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click'), function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        initUserInfo(); // 重新初始化一次用户信息即可
    }

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                // 调用父页面index.html中的方法重新渲染用户信息
                window.parent.getUserInfo();
            }
        })
    })

})