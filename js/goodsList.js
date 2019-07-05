var userName = sessionStorage.getItem("userNames");
$(".userNames").html(userName);
layui.use('laydate', function () {
    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#cont' //指定元素
    });
});
// var url = "https://www.youbao360.com/YBSys/ybws/data/json/";
var url = "http://116.196.69.82:4080/YBSys/ybws/data/json/";
// var url = "http://192.168.1.181:8090/YBSys/ybws/data/json/";
$(function () {
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
});
var hxshopDesc;
var sessAddId;
//保存修改过的数据
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#ArbetTable').bootstrapTable({
            url: url + 'getUserGoods',         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: true,                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,
            // sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            // pageNumber: 1,                       //初始化加载第一页，默认第一页
            // pageSize: 20,                       //每页的记录行数（*）
            // pageList: [20],        //可供选择的每页的行数（*）
            contentType: "application/x-www-form-urlencoded",
            striped: true,      //是否显示行间隔色
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: "",                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "no",                     //每一行的唯一标识，一般为主键列
            showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,
            responseHandler: function (res) {
                for (var i = 0; i < res.resultObject.dataList.length; i++) {
                    if (res.resultObject.dataList[i].status >= 1) {
                        res.resultObject.dataList[i].status = '正常';
                    } else if (res.resultObject.dataList[i].status >= 2) {
                        res.resultObject.dataList[i].status = '撤贴';
                    } else if (res.resultObject.dataList[i].status >= 3) {
                        res.resultObject.dataList[i].status = '锁定';
                    } else if (res.resultObject.dataList[i].status >= 4) {
                        res.resultObject.dataList[i].status = '删除';
                    }
                    // res.resultObject.dataList[i].validSN = res.resultObject.dataList[i].createTime + ' -- ' + res.resultList[i].validTime;
                }
                hxshopDesc = res.resultObject.shopDesc;
                $(".shopName").html(res.resultObject.shopName)
                $(".shopDesc").val(res.resultObject.shopDesc)
                if (res.resultObject.dataList.length == 0) {
                    return {
                        "total": 0,//总页数
                        "rows": res.resultObject.dataList   //数据
                    };
                } else {
                    return {
                        "total": res.resultObject.rowCount,//总页数
                        "rows": res.resultObject.dataList   //数据
                    };
                }

            },
            columns: [
                {
                    field: 'SerialNumber',
                    title: '序号',
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
                    title: '藏品名',
                },
                {
                    field: 'dealPrice',
                    align: "center",
                    title: '单价',
                },
                {
                    field: 'dealCnt',
                    align: "center",
                    title: '交易数量',
                },
                {
                    field: 'timeStr',
                    align: "center",
                    title: '有效期',
                },
                {
                    field: 'status',
                    align: "center",
                    title: '商品状态',
                },
                // {
                //     field: 'isRaise',
                //     align: "center",
                //     title: '藏品排序',
                // },
                {
                    title: '操作',
                    align: "center",
                    events: operateEvents,
                    formatter: operateFormatter //自定义方法，添加操作按钮
                },
            ]
        });
    };
    function operateFormatter(value, row, index) {//赋予的参数
        return [
            '<c-button  id="btn-edit" class="btn btn-default">编辑</c-button>',
            '<c-button  id="btn-del" class="btn btn-default">删除</c-button>',
        ].join('');
    }
    window.operateEvents = {
        //编辑价格
        "click #btn-edit": function (e, value, row, index) {
            var id = row.id;
            var pubUserid = row.pubUserid;
			//增加两个字段
            sessionStorage.setItem("goodsId", id);
            sessionStorage.setItem("goodsPubUserid", pubUserid);
            window.location.href = 'newGoods.html';
        },
        //删除价格
        "click #btn-del": function (e, value, row, index) {
            var id = row.id;
            var pubUserid = row.pubUserid;
            var mymessage = confirm("确定直接删除吗？");
            if (mymessage == true) {
                $.ajax({
                    url: url + "updateDisk",
                    type: "post",
                    dataType: "json",
                    data: {
                        goodsId: id,
                        pubUserid: pubUserid,
                        updateType: 2
                    },
                    success: function (data) {
                        if (data.code == 10000) {
                            $('#ArbetTable').bootstrapTable('refresh');
                            alert("删除成功！")
                        }
                    }
                })
            }
        },
    }
    var this_id = sessionStorage.getItem("loginGoodsId");
    //得到查询的参数
oTableInit.queryParams = function (params) {

    var num = params.offset / 10 + 1;

    var temp = {

        userId: this_id,

        pageIndex: num,

        pageSize: 10,


    };
    
	return temp;

};
    return oTableInit;
};
//新增商品的时候删除两个值
function newGoods() {
    sessionStorage.removeItem("goodsId");
    sessionStorage.removeItem("goodsPubUserid");
    window.location.href = 'newGoods.html';
}
$("#saveShop").on("click",function () {
    if($(".shopDesc").val()==""){
        layer.alert("店铺说明不能为空");
        return
    }
    if($(".shopDesc").val().length>30){
        layer.alert("店铺说明不能超过30字符");
        return
    }
    if (hxshopDesc==$(".shopDesc").val()) {
        layer.alert("不需要重复保存");
        return
    }
    $.ajax({
        type: "post",
        url: url + "updateShopDesc",
        data: {
            userId:sessionStorage.getItem("loginGoodsId"),
            desc:$(".shopDesc").val()
        },
        dataType: "json",
        success: function (response) {
            if(response.code==10000){
                layer.alert("保存成功")
            }else{
                layer.alert("保存失败")
            }
        }
    });
});