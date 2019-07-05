var qrcode = sessionStorage.getItem("qrcode");
var userNames = sessionStorage.getItem("userNames");
cola(function(model){
    laydate.render({
        elem: '#test1', //指定元素
        // type:'datetime'
    });
    laydate.render({
        elem: '#test2', //指定元素
        // type:'datetime'
    });
    $(".bbsx").on("click", "span", function(event) {
		alert("我在执行咯111")
        var target = $(event.target);
        target.css("color", "#1C90F3").siblings().css("color", "#666666");
        model.set("bbsx", target.html());
        if(target.html()=="全部"){
            model.set("bbsx", "");
        }
    })
    model.set("weeks", 1);
    model.set("bbsx", "");
    $(".weeks").on("click", "span", function(event) {
        var target = $(event.target);
        target.css("color", "#1C90F3").siblings().css("color", "#666666");
        if(target.html()=="按天"){
            model.set("weeks", 1);
        }
        if(target.html()=="按周"){
            model.set("weeks", 2);
        }
        if(target.html()=="按月"){
            model.set("weeks", 3);
        }
    });
//友盟Android自3-1到今天的数据
    layui.use('form', function(){
        form = layui.form;
    });
//渠道类型接口
    // $.ajax({
    //     type: "post",
    //     url: "http://116.196.69.82:7090/YbSys/User/findAllChannel",
    //     // url: "http://192.168.1.181:8080/YbSys/User/findAllChannel",
    //     dataType:"json",
    //     success: function (data) {
    //         model.set("languages",data.data);
    //         for (var i = 0; i < data.data.length; i++) {
    //             $("#sele").append("<option value="+data.data[i].id+">" + data.data[i].cName + "</option>");
    //             form.render('select')
    //         }
    //     }
    // });
//页面上面统计数据的接口
    $.ajax({
        type:"post",
        url:"http://116.196.69.82:7090/YbSys/User/select",
        // url:"http://192.168.1.181:8080/YbSys/User/select",
        dataType: 'json',
        success:function(data){
            //总计
            var listAll = data.data;
            var count = 0;
            var register = 0;
            var auth = 0;
            var silver = 0;
            var gold = 0;
            var registerall = 0;
            for(var i = 0;i<listAll.length;i++){
                if(listAll[i].count==undefined||listAll[i].register==undefined||listAll[i].auth==undefined||listAll[i].silver==undefined||listAll[i].gold==undefined){
                    listAll[i].count=0;
                    listAll[i].register=0;
                    listAll[i].auth=0;
                    listAll[i].silver=0;
                    listAll[i].gold=0;
                }
                listAll[i].registerall = listAll[i].auth+listAll[i].silver+listAll[i].gold;
                count += listAll[i].count;
                register += listAll[i].register;
                auth += listAll[i].auth;
                silver += listAll[i].silver;
                gold += listAll[i].gold;
                //认证总数量
                registerall +=listAll[i].auth+listAll[i].silver+listAll[i].gold;
            }
            var all = {
                name:"总计",
                count:count,
                register:register,
                registerall:registerall,
                auth:auth,
                silver:silver,
                gold:gold,
            }
            listAll.unshift(all)
            // console.log(listAll);
            model.set("employees",listAll);
        }
    });

    $(function () {
        //1.初始化Table
        var oTable = new TableInit();
        oTable.Init();
    });
    var TableInit = function () {
        var oTableInit = new Object();
        //初始化Table
        oTableInit.Init = function () {
            $('#ArbetTable').bootstrapTable({
                url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
                // url: 'http://192.168.1.181:8080/yb_controller/User/findByPage',         //请求后台的URL（*）
                method: 'post',                      //请求方式（*）
                toolbar: '#toolbar',                //工具按钮用哪个容器
                striped: true,                      //是否显示行间隔色
                cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,                   //是否显示分页（*）
                sortable: true,
                // sortOrder: "asc",                   //排序方式
                queryParams: oTableInit.queryParams,//传递参数（*）
                //【其它设置】
                locale:'zh-CN',//中文支持
                pagination: true,//是否开启分页（*）
                pageNumber:1,//初始化加载第一页，默认第一页
                pageSize: 10,//每页的记录行数（*）
                pageList: [10],//可供选择的每页的行数（*）
                sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
                showRefresh:true,//刷新按钮
                // search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                contentType: "application/x-www-form-urlencoded",
                striped: true,      //是否显示行间隔色
                // strictSearch: true,
                showColumns: true,                  //是否显示所有的列
                showRefresh: true,                  //是否显示刷新按钮
                minimumCountColumns: 2,             //最少允许的列数
                clickToSelect: true,                //是否启用点击选中行
                height: "",                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "no",                     //每一行的唯一标识，一般为主键列
                showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
                cardView: false,                    //是否显示详细视图
                detailView: false,                  //是否显示父子表
                responseHandler: function(res) {
                    // for(var i=0;i<res.rows.length;i++){
                    //   if(res.rows[i].count==undefined){
                    //     res.rows[i].count=0
                    //   }
                    //   if(res.rows[i].downIos==undefined){
                    //     res.rows[i].downIos=0
                    //   }
                    //   lista.push(res.rows[i].count+res.rows[i].downIos);
                    //   res.rows[i].lista = lista[i];
                    // }

                    return {
                        "total": res.total,//总页数
                        "rows": res.rows   //数据
                    };
                },
                columns: [
                    // {
                    //   field:'name',
                    //   title:'渠道'
                    // },
                    {
                        field: 'dateTime',
                        title: '日期',
                        align: 'center'
                    },
                    //   {
                    //       field: 'lista',
                    //       title: '下载量'
                    //   },
                    // {
                    //   field: 'count',
                    //   title: '安卓下载量'
                    // },
                    // {
                    //   field: 'downIos',
                    //   title: 'IOS下载量'
                    // },
                    {
                        field: 'register',
                        title: '注册量',
                        align: 'center'
                    },
                    {
                        field: 'androidRegister',
                        title: '安卓注册量',
                        align: 'center'
                    },
                    {
                        field: 'iosRegister',
                        title: 'IOS注册量',
                        align: 'center'
                    },
                    {
                        field: 'auth',
                        title: '普通会员',
                        align: 'center'
                    },
                    {
                        field: 'silver',
                        title: '银牌会员数',
                        align: 'center'
                    },
                    {
                        field: 'gold',
                        title: '金牌会员数',
                        align: 'center'
                    },
                    // {
                    //     field: '',
                    //     title: '钻石会员数'
                    // },
                ],
            });
        };
        $(".btn").on("click",function(){
            // if($("select option:checked").text()==""){
            //   alert("请选择渠道")
            // }else{
            if($("#test1").val()==""){
                $("#test1").val("2018-03-01")
            }
            if($("#test2").val()==""){
                var ymds = new Date().format("yyyy-MM-dd");
                $("#test2").val(ymds)
            }
            $('#ArbetTable').bootstrapTable('refreshOptions', {
                // url: 'http://192.168.1.181:8080/yb_controller/User/findByPage',         //请求后台的URL（*）
                url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
                queryParams: oTableInit.queryParams,
                pageNumber:1
            });
            // }
        });




        //得到查询的参数
        oTableInit.queryParams = function (params) {
			console.log("我执行了");
            Date.prototype.format = function (format) {
                var args = {
                    "M+": this.getMonth() + 1,
                    "d+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                    "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
                    "S": this.getMilliseconds()
                };
                if (/(y+)/.test(format))
                    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var i in args) {
                    var n = args[i];
                    if (new RegExp("(" + i + ")").test(format))
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
                }
                return format;
            };
            var ymd = new Date().format("yyyy-MM-dd");
            var num = params.offset/10+1;
            model.set("num",num);

            var temp = {
                "pageSize": params.limit,
                "pageNumber":num,
                "edition":model.get("bbsx"),
                "channel":sessionStorage.getItem('userId'),
                "typedate":model.get("weeks"),
                "startTime":'2018-03-01 00:00:00',
                "endTime":ymd+' 23:59:59'
            };


            // if($("#sele").val()==""){
            //     var temp = {
            //         "pageSize": params.limit,
            //         "pageNumber":num,
            //         "edition":model.get("bbsx"),
            //         "channel":sessionStorage.getItem('userid'),
            //         "typedate":model.get("weeks"),
            //         "startTime":'2018-03-01 00:00:00',
            //         "endTime":ymd+' 23:59:59'
            //     };
            // }else{
            //     var temp = {
            //         "pageSize": params.limit,
            //         "pageNumber":num,
            //         "edition":model.get("bbsx"),
            //         "channel":$("select option:checked").val(),
            //         "typedate":model.get("weeks"),
            //         "startTime":'2018-03-01 00:00:00',
            //         "endTime":ymd+' 23:59:59'
            //     };
            // }

            return temp;
        };
        return oTableInit;
    };
})