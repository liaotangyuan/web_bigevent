$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;    // 分页效果

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        y = y < 10 ? '0' + y : y
        let m = dt.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = dt.getDate()
        d = d < 10 ? '0' + d : d
        let hh = dt.getHours()
        hh = hh < 10 ? '0' + hh : hh
        let mm = dt.getMinutes()
        mm = mm < 10 ? '0' + mm : mm
        let ss = dt.getSeconds()
        ss = ss < 10 ? '0' + ss : ss

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要按照它的要求请求服务器数据
    var q = {
        pagenum: '1',  // 页码值，默认第一页数据
        pagesize: 2,  // 每页显示几条数据，默认2条
        cate_id: '', // 文章分类的 Id，默认查看所有
        state: ''  // 文章的发布状态
    }

    initTable();    // 渲染表格数据
    initCate();     // 初始化文章分类可选信息

    // 发起ajax数据请求渲染页面数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }
                // 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 渲染完表格数据后重新渲染分页的结构
                renderPage(res.total)

            }
        })
    }

    // 初始化文章分类信息
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类信息失败!')
                }
                // 调用模板引擎将分类信息渲染到页面中
                let htmlStr = template('tpl-case', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域UI数据
                form.render();
            }
        })
    }

    // 为筛选表单区域的筛选按钮绑定submit事件
    $('.layui-btn').on('submit', function (e) {
        e.preventDefault();
        // 1.获取表单项中选择的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val();
        // 2.为查询的参数对象q的对应属性赋值
        q.cate_id = cate_id
        q.state = state
        // 3.根据最新的筛选条件重新渲染表格数据
        initTable();
    })

    // 封装一个渲染分页的函数
    function renderPage(total) {
        // 调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id(不加#)
            count: total, // 总数据条数
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 数据的项数分别代表分页区域渲染的结构
            limits: [2, 5, 10, 20],  // 每页可选择展示条数的规格
            
            // 1.分页发生切换时会触发jump回调函数
            // 2.只要调用了laypage.render()方法就会触发jump回调，这种方法触发的jump回调其内部形参first的值是true
            jump: function (obj, first) {
                // 把最新的页码值赋值给参数对象q
                q.pagenum = obj.curr

                //  把最新的条目数，赋值给参数对象q
                q.pagesize = obj.limit

                // 如果是第二种方式触发的jump则不调用initTable()函数，否则会成死循环
                if (!first) {
                    // 使用新的页码值重新渲染页面数据
                    initTable();
                }
            }
        });
    }

    // 通过事件代理给删除文章的按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 拿到当前页面表格中一共有的删除个数
        var len = $('.btn-delete').length
        // 先拿到被点击的该条数据的id
        var id = $(this).attr('data-id')
        // 调用layer.confirm()弹出询问框
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 这里要先判断我们当前执行了删除后页面上是否还有剩余的数据
                    // 如果当前页的数据删完了再调用initTable函数渲染页面前需先将页码值减1(第一页不减)
                    if(len === 1) {
                        // 如果当前已经在第一页了那页码就不能再减1了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
          });
    })

    // 通过事件代理给编辑文章的按钮绑定点击事件
    $('tbody').on('click', '#btn-edit', function() {
        // 拿到当前被点击的该条数据的id
        var id = $(this).next('.btn-delete').attr('data-id')
        // 将该数据id存储到本地存储中
        localStorage.setItem('thisId', id)
        console.log(id);
        // 跳转到文章编辑页面
        location.href = '/article/art_list_edit.html'
        
    })

    
})