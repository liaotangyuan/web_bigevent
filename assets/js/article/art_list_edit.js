$(function () {
    var form = layui.form
    var layer = layui.layer

    // 根据本地存储中的thisId值发起Ajax请求渲染文章信息
    var editId = localStorage.getItem('thisId');
    localStorage.removeItem('thisId')
    $.ajax({
        method: 'GET',
        url: '/my/article/' + editId,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章信息失败！')
            }
            form.val('form-edit', res.data)
            // 根据文件，创建对应的URL地址
            var newImgURL = 'http://api-breakingnews-web.itheima.net' + res.data.cover_img

            // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        }
    })

    initCate();

    // 初始化富文本编辑器
    initEditor()

    // 渲染文章可选类别的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                // 调用模板引擎渲染文章类别数据
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 记得要调用form.render()重新渲染页面
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)




    // 为选择文章封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 代码触发真正的文件上传框的点击事件
        $('#coverFile').click();
    })
    // 监听文件选择框的change事件
    $('#coverFile').on('change', function (e) {
        // 1.获取到文件的列表数组
        let files = e.target.files[0]
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 2.根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files)

        // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的默认提交状态为已发布
    var art_state = '已发布'
    // 当“存为草稿”被点击时将art_state修改为草稿
    $('#btn-caogao').on('click', function () {
        art_state = '草稿'
    })



    // var formStr = $('#form-pub').serialize();
    // formStr = formStr.split('&')
    // var formObj = {}
    // for(let i of formStr) {
    //     let arr = i.split('=');
    //     formObj[arr[0]] = arr[1];
    // }

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        // 2.基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0])   // 这个方法是原生js的方法
        // 3.将文章的发布状态存到fd对象中
        fd.append('state', art_state)
        // 4.将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 5.将文件对象存储到fd数据对象中
                fd.append('cover_img', blob)
                // 6.发起 Ajax 数据请求
                publishArticle(fd);
            })
    })

    // 封装发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章更新失败！')
                }
                layer.msg('文章更新成功！')
                // 发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })

    }
})
