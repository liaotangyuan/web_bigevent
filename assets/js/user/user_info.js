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
                console.log(res);
                // 逐一为为表单赋值(逐一id也需要，因为后续提交时需要用到id)
                $('[name=id]').val(res.data.id)
                $('[name=username]').val(res.data.username)
                $('[name=nickname]').val(res.data.nickname)
                $('[name=email]').val(res.data.email)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', () => initUserInfo() // 重新初始化一次用户信息即可
    )

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        var formVal = $(this).serialize()
        console.log(formVal);
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: formVal,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                // 调用父页面index.html中的方法重新渲染用户信息
                window.parent.getUserInfo();
                initUserInfo();
            }
        })
    })

})