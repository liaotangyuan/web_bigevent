$(function () {
    // 实例化layui对象
    var layer = layui.layer
    var form = layui.form

    initArtCateList();

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类信息失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加分类按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })

    // 通过事件代理为弹出添加分类的form表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败:' + res.message)
                }
                layer.msg(res.message)
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    })

    // 通过事件代理为编辑按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类信息',
            content: $('#dialog-edit').html()
        });

        // 1.获取到被点击的该条数据的data-Id值
        var id = $(this).attr('data-id')
        // 2.发起get请求根据数据的id获取到该条数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function(res) {
                // 将获取到的数据渲染到弹出层中
                form.val('form-edit', res.data)
            }
        })

    })

    // 通过事件代理为弹出编辑分类的form表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })
    // 通过事件代理为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-del', function(e) {
        // 先获取该条数据的id值
        var id = $(this).prev('#btn-edit').attr('data-id')
        // 弹出询问框
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArtCateList();
                }
            })
            
          });
        
    })
})