$(function () {
    var layer = layui.layer
    refThisUserAvatar();
    // 获取当前用户的头像设置到头像框中
    function refThisUserAvatar() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // 原本此处添加请求头的代码已经全部移到了baseAPI.js中统一处理了
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取原头像信息失败！')
                }
                // 获取到当前用户的头像
                var imgURL = res.data.user_pic
                // 重新初始化裁剪区域
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', imgURL)     // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            },

        })
    }


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 为“上传”按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        //  代码触发真正的上传按钮的点击
        $('#file').click();
    })

    // 监听选择图片的input框的change事件
    $('#file').on('change', function (e) {
        var fileList = e.target.files
        if (fileList.length === 0) {
            return layer.msg('请选择图片！')
        }

        // 1.拿到用户选择的文件
        var file = fileList[0]
        // 2.将文件转换为路径
        var imgURL = URL.createObjectURL(file)
        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 为“上传头像”按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 1.要拿到用户裁剪之后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.调用接口把图片上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                // 重新渲染index.html中的用户数据
                refThisUserAvatar();
                window.parent.getUserInfo();
            }
        })

    })
})