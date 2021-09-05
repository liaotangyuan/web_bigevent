$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        // pwd是三个输入框都需要执行的
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // samePwd新密码单独执行验证即可
        samePwd: function(value) {
            // 先获取到原密码的值
            let oldPwdVal = $('[name=oldPwd]').val()
            if(value === oldPwdVal) {
                return '新旧密码不能相同！'
            }
        },
        // rePwd是确认密码是执行验证的
        rePwd: function(value) {
            let newPwdVal = $('[name=newPwd]').val()
            if(newPwdVal !== value) {
                return '两次密码输入不一致！'
            }
        }
    })

    // 监听form表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新密码失败：'+res.message)
                }
                layer.msg('更新密码成功！')
                // 调用原生js的reset()方法将表单清空
                $('.layui-form')[0].reset();
            }
        })
    })
})