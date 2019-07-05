var qrcode = sessionStorage.getItem("qrcode");
var userNames = sessionStorage.getItem("userNames");
var USerId = sessionStorage.getItem("userId");
var url = "http://39.97.176.41:8080/YBSys/ybws/user/json/";
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
        var target = $(event.target);
        target.css("color", "#1C90F3").siblings().css("color", "#666666");
        model.set("bbsx", target.html());
        if(target.html()=="全部"){
            model.set("bbsx", "");
        }
    })
    model.set("weeks", 1);
    model.set("bbsx", "");
	model.set("itemValue", "");//输入文本框的value
	
	
	
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
                // url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
				 // url: url + 'getChannelUserList',         //请求后台的URL（*）
				 url: url + 'getChannelActList',         //请求后台的URL（*）
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
				// let mydata = res.resultObject.dataList;
				// for(var i=0;i<mydata.length;i++){
				// 	if(mydata[i].userType == 1){
				// 		mydata[i].userTypeName = "普通会员";
				// 	}else if(mydata[i].userType == 2){
				// 		mydata[i].userTypeName = "认证会员";
				// 	}else if(mydata[i].userType == 3){
				// 		mydata[i].userType = "银牌会员";
				// 	}else if(mydata[i].userTypeName == 4){
				// 		mydata[i].userTypeName = "金牌会员";
				// 	}else if(mydata[i].userType == 5){
				// 		mydata[i].userTypeName = "钻石会员";
				// 	}
				// }
                    return {
                        // "total": res.total,//总页数
                        // "rows": res.rows   //数据
						 "total": 0,//总页数
						"rows": res.resultList   //数据
                    };
                },
                columns: [
					   {
                    field: 'SerialNumber',
                    title: '编号',
                    align: "center",
                    formatter: function (value, row, index) {
                        var pageSize = $('#ArbetTable').bootstrapTable("getOptions").pageSize;
                        var pageNumber = $('#ArbetTable').bootstrapTable("getOptions").pageNumber;
                        return pageSize * (pageNumber - 1) + index + 1;
                    }
                },
                {
                    field: 'name',
                    align: "center",
                    title: '活动名称',
                },
                {
                    field: 'ctype',
                    align: "center",
                    title: '活动标题',
                },
                {
                    field: 'actTime',
                    align: "center",
                    title: '活动日期',
                },
                {
                    field: 'attendCount',
                    align: "center",
                    title: '活动参与人数',
                },
                {
                    field: 'registerCount',
                    align: "center",
                    title: '新增注册人数',
                },
				{
				    field: 'authCount',
				    align: "center",
				    title: '新增认证人数',
				},
                {
                    title: '操作',
                    align: "center",
                    events: operateEvents,
                    formatter: operateFormatter //自定义方法，添加操作按钮
                }
				],
            });
        };
	 function operateFormatter(value, row, index) {//赋予的参数
        return [
            '<c-button  id="btn-edit" class="btn btn-default">用户详情</c-button>',
            '<a  id="btn-del" href="row.imgUrl" class="btn btnchang btn-default" download>下载活动二维码</a>',
            // '<c-button  id="btn-del" class="btn btn-default">下载活动二维码</c-button>',
			// <a :href="'/qinghe/files/'+item.Files" download>
        ].join('');
    };
	 window.operateEvents = {
        //编辑价格
        "click #btn-edit": function (e, value, row, index) {
            var id = row.id;
			console.log(e);
			console.log(row);
			console.log(index);
            var pubUserid = row.pubUserid;
			localStorage.setItem("ctype",row.ctype);
            // sessionStorage.setItem("goodsId", id);
            // sessionStorage.setItem("goodsPubUserid", pubUserid);
            window.location.href = 'activityNew.html';
        },
        //删除价格
        "click #btn-del": function (e, value, row, index) {
            var id = row.id;
            var pubUserid = row.pubUserid;
            // var mymessage = confirm("确定下载二维码吗？");
            if (mymessage == true) {
                // $.ajax({
                //     url: url + "updateDisk",
                //     type: "post",
                //     dataType: "json",
                //     data: {
                //         goodsId: id,
                //         pubUserid: pubUserid,
                //         updateType: 2
                //     },
                //     success: function (data) {
                //         if (data.code == 10000) {
                //             $('#ArbetTableAList').bootstrapTable('refresh');
                //             alert("删除成功！")
                //         }
                //     }
                // })
            }
        },
    }
	
	
	
	
		$("#eachFu").click(()=>{
			let text = $("#text_ID").val();
			if(text == "" || text == null || text == undefined){
				model.set("itemValue", "");
			}else{
				model.set("itemValue",text);
			}
		$('#ArbetTable').bootstrapTable('refreshOptions', {
			    // url: 'http://192.168.1.181:8080/yb_controller/User/findByPage',         //请求后台的URL（*）
			    // url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
				 url: url + 'getChannelActList',
			    queryParams: oTableInit.queryParams,
			    pageNumber:1
			});
			
		});
        $(".btn").on("click",function(){
            if($("#test1").val()==""){
                $("#test1").val("2018-03-01")
            }
            if($("#test2").val()==""){
                var ymds = new Date().format("yyyy-MM-dd");
                $("#test2").val(ymds)
            }
            $('#ArbetTable').bootstrapTable('refreshOptions', {
                url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
                queryParams: oTableInit.queryParams,
                pageNumber:1
            });
            // }
        });

        //得到查询的参数
        oTableInit.queryParams = function (params) {
			var temp = {
				cname:model.get("itemValue"),//搜索的名字
				channelId:USerId
			};

            return temp;
        };
        return oTableInit;
    };
})