var userName = sessionStorage.getItem("userNames");
$(".userNames").html(userName);
var imgpash = [];
var imgpashs = [];
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
$(document).on('click', '.image', function () {
    var message = confirm("确定删除该图片吗?");
    if (message == true) {
        $(this).remove();
        imgpash.remove(this.currentSrc);
        $(".imgs").html("");
        for (let i = 0; i < imgpash.length; i++) {
            var img = '<div class="imgb">' + '<img class="image" />' + '</div>';
            $(".imgs").append(img);
            $(".image").eq(i).attr("src", imgpash[i]);
        }
        ;
    }
    ;
});
$(document).on('click', '.images', function () {
    var message = confirm("确定删除该图片吗?");
    if (message == true) {
        $(this).remove();
        imgpash.remove(this.currentSrc);
        $(".imgss").html("");
        for (let i = 0; i < imgpash.length; i++) {
            var img = '<div class="imgbs">' + '<img class="images" />' + '</div>';
            $(".imgss").append(img);
            $(".images").eq(i).attr("src", imgpashs[i]);
        }
        ;
    }
    ;
});
layui.use('laydate', function () {
    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#cont', //指定元素
    });
});
layui.use('form', function () {
    form = layui.form;
});
form.on('select(type)', function (data) {
    alert("请谨慎修改分类！")
});
var unitName;
var categoryName;
var unitNames;
var categoryNames;
var sessId;
var sessPub;
var pudName;
// var url = "https://www.youbao360.com/YBSys/ybws/";
var url = "http://116.196.69.82:4080/YBSys/ybws/";
// var url = "http://192.168.1.181:8090/YBSys/ybws/";
sessId = sessionStorage.getItem("goodsAddId");
if (sessionStorage.getItem("goodsId") && sessionStorage.getItem("goodsPubUserid")) {
    sessPub = sessionStorage.getItem("goodsPubUserid");
    sessId = sessionStorage.getItem("goodsId");
    var goodsId = sessionStorage.getItem("goodsId");
    var goodsPubUserid = sessionStorage.getItem("goodsPubUserid");
    $.ajax({
        url: url + "data/json/getReturnGoods",
        data: {
            goodsId: goodsId,
            pubUserid: goodsPubUserid,
        },
        dataType: "json",
        type: "post",
        success: function (data) {
            var pudName = data.resultObject.pubUsername;
            // 分类
            var categoryName = data.resultObject.categoryName;
            var categoryCode = data.resultObject.categoryCode;
            // 品相
            var conditionName = data.resultObject.conditionName;
            var conditionCode = data.resultObject.conditionCode;
            // 名称
            var name = data.resultObject.name;
            // 交易单位
            var unitName = data.resultObject.unitName;
            var unitCode = data.resultObject.unitCode;
            // 交易数量
            var dealCnt = data.resultObject.dealCnt;
            // 交易单价
            var dealPrice = data.resultObject.dealPrice;
            // 交易方式
            var dealWayName = data.resultObject.dealWayName;
            var dealWay = data.resultObject.dealWay;
            // 最小数量
            var dealMin = data.resultObject.dealMin;
            // 有效期
            var validDay = data.resultObject.validDay;
            //图片上
            imgpash = data.resultObject.picUrlList;
            //图片下
            imgpashs = data.resultObject.picUrls.split('&');
            debugger
            //藏品描述
            var desc = data.resultObject.desc;
            for (let i = 0; i < imgpash.length; i++) {
                var img = '<div class="imgb">' + '<img class="image" />' + '</div>';
                $(".imgs").append(img);
                $(".image").eq(i).attr("src", imgpash[i]);
            }
            for (let i = 0; i < imgpashs.length; i++) {
                var img = '<div class="imgbs">' + '<img class="images" />' + '</div>';
                $(".imgss").append(img);
                $(".images").eq(i).attr("src", imgpashs[i]);
            }
            $("#name").val(name);
            $("#num").val(dealCnt);
            $("#price").val(dealPrice);
            $("#mixNum").val(dealMin);
            $("#dataw").val(validDay);
            $("#desc").val(desc);
            setTimeout(function () {
                $("#danwei option:selected").html(unitName);
                $("#danwei option:selected").val(unitCode);
                $("#type option:selected").html(categoryName);
                $("#type option:selected").val(categoryCode);
                $("#pinxiang option:selected").html(conditionName);
                $("#pinxiang option:selected").val(conditionCode);
                $("#searchType option:selected").html(dealWayName);
                $("#searchType option:selected").val(dealWay);
                form.render('select');
            }, 30)

            // $(".list").hide();
        }
    });
}
var imgpash = [];
$('#updata').on("change", function () {
    var file = $('#updata')[0].files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var myReg = /^[\u4e00-\u9fa5]+$/;
    var this_content = $('#updata')[0].files[0].name.split(".")[0];
    for (var i = 0; i < this_content.length; i++) {
        if (myReg.test(this_content[i])) {
            alert("不能含有中文");
            return
        }
    }
    afile = $('#updata')[0].files[0];
    key = afile.name.split('.')[0] + new Date().getTime();
    //	上传文件到七牛
    var num = 0;
    $.ajax({
        type: "post",
        url: 'http://api.youbao360.com:8080/YBApp/ybws/data/json/getQiNiuToken',
        dataType: 'json',
        async: false,
        data:{},
        success: function (res) {
            token = res.resultObject.token;
            var putExtra = {
                fname: "",
                params: {},
                mimeType: [] || null
            };
            var config = {
                useCdnDomain: true,
                disableStatisticsReport: false,
                retryCount: 6,
                region: qiniu.region.z2
            };
            var observable = qiniu.upload(afile, key, token, putExtra, config);
            var observer = {
                next(res) {
                    if (res.total.percent == 100) {
                        alert("图片上传成功")
                    };
                },
                error(err) {},
                complete(res) {
                    // imgpash.push('http://osbi8mkpn.bkt.clouddn.com/' + res.key);
                    imgpash.push('http://image.ybk008.com/' + res.key);
                    $(".imgs").html("")
                    for (let i = 0; i < imgpash.length; i++) {
                        var img = '<div class="imgb">' +
                            '<div class="drop-left">' + '</div>' +
                            '<img class="image" draggable="true" />' +
                            '<div class="drop-right">' +
                            '</div>' + '</div>';
                        $(".imgs").append(img);
                        $(".image").eq(i).attr("src", imgpash[i]);
                    };

                    $.ajax({
                        type: "post",
                        // url: "http://osbi8mkpn.bkt.clouddn.com",
                        url: "http://image.ybk008.com",
                        dataType: 'json',
                        async: true,
                        data: {},
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            window.location = window.location;
                        }
                    });
                }
            };
            var subscription = observable.subscribe(observer) // 上传开始
        }
    });
});
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
$(".imgb").on('click', '.image', function () {
    var message = confirm("确定删除该图片吗?");
    if (message == true) {
        $(this).remove();
        imgpash.remove(this.currentSrc);
        $(".imgs").html("");
        for (let i = 0; i < imgpash.length; i++) {
            var img = '<div class="imgb">' +
                '<div class="drop-left">' + '</div>' + '<img class="image" draggable="true" />' +
                '<div class="drop-right">' + '</div>' +
                '</div>';
            $(".imgs").append(img);
            $(".image").eq(i).attr("src", imgpash[i]);
        };
    };
});
$(document).ready(function () {
    // 正在拖动的图片的父级DIV
    var $srcImgDiv = null;
    // 开始拖动
    $(document).on('dragstart', '.image', function () {
        $srcImgDiv = $(this).parent();
    });
    // 拖动到.drop-left,.drop-right上方时触发的事件
    $(document).on('dragover', '.drop-left,.drop-right', function (event) {
        // 必须通过event.preventDefault()来设置允许拖放
        event.preventDefault();
    });
    // 结束拖动放开鼠标的事件
    $(document).on('drop', '.drop-left', function (event) {
        event.preventDefault();
        if ($srcImgDiv[0] != $(this).parent()[0]) {
            $(this).parent().before($srcImgDiv);
        }
        imgpash = [];
        for (var i = 0; i <= $(".imgb img").length - 1; i++) {
            imgpash.push($(".imgb img")[i].src);
        }
    });
    $(document).on('drop', '.drop-right', function (event) {
        event.preventDefault();
        if ($srcImgDiv[0] != $(this).parent()[0]) {
            $(this).parent().after($srcImgDiv);
        }
        imgpash = [];
        for (var i = 0; i <= $(".imgb img").length - 1; i++) {
            imgpash.push($(".imgb img")[i].src);
        }
    });
});

var imgpashs = [];
$('#updatas').on("change", function () {
    var file = $('#updatas')[0].files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var myReg = /^[\u4e00-\u9fa5]+$/;
    var this_content = $('#updatas')[0].files[0].name.split(".")[0];
    for (var i = 0; i < this_content.length; i++) {
        if (myReg.test(this_content[i])) {
            alert("不能含有中文");
            return
        }
    }
    afile = $('#updatas')[0].files[0];
    key = afile.name.split('.')[0] + new Date().getTime();
    //	上传文件到七牛
    var num = 0;
    $.ajax({
        type: "post",
        url: 'http://api.youbao360.com:8080/YBApp/ybws/data/json/getQiNiuToken',
        dataType: 'json',
        async: false,
        data:{},
        success: function (res) {
            token = res.resultObject.token;
            var putExtra = {
                fname: "",
                params: {},
                mimeType: [] || null
            };
            var config = {
                useCdnDomain: true,
                disableStatisticsReport: false,
                retryCount: 6,
                region: qiniu.region.z2
            };
            var observable = qiniu.upload(afile, key, token, putExtra, config);
            var observer = {
                next(res) {
                    if (res.total.percent == 100) {
                        alert("图片上传成功")
                    };
                },
                error(err) {},
                complete(res) {
                    // imgpashs.push('http://osbi8mkpn.bkt.clouddn.com/' + res.key);
                    imgpashs.push('http://image.ybk008.com/' + res.key);
                    $(".imgss").html("")
                    for (let i = 0; i < imgpashs.length; i++) {
                        var img = '<div class="imgbs">' +
                            '<div class="drop-lefts">' + '</div>' +
                            '<img class="images" draggable="true" />' +
                            '<div class="drop-rights">' +
                            '</div>' + '</div>';
                        $(".imgss").append(img);
                        $(".images").eq(i).attr("src", imgpashs[i]);
                    };

                    $.ajax({
                        type: "post",
                        // url: "http://osbi8mkpn.bkt.clouddn.com",
                        url: "http://image.ybk008.com",
                        dataType: 'json',
                        async: true,
                        data: {},
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            window.location = window.location;
                        }
                    });
                }
            };
            var subscription = observable.subscribe(observer) // 上传开始
        }
    });
});
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
$(".imgbs").on('click', '.images', function () {
    var message = confirm("确定删除该图片吗?");
    if (message == true) {
        $(this).remove();
        imgpash.remove(this.currentSrc);
        $(".imgss").html("");
        for (let i = 0; i < imgpash.length; i++) {
            var img = '<div class="imgbs">' +
                '<div class="drop-lefts">' + '</div>' + '<img class="images" draggable="true" />' +
                '<div class="drop-rights">' + '</div>' +
                '</div>';
            $(".imgss").append(img);
            $(".images").eq(i).attr("src", imgpash[i]);
        };
    };
});
$(document).ready(function () {
    // 正在拖动的图片的父级DIV
    var $srcImgDiv = null;
    // 开始拖动
    $(document).on('dragstart', '.images', function () {
        $srcImgDiv = $(this).parent();
    });
    // 拖动到.drop-left,.drop-right上方时触发的事件
    $(document).on('dragover', '.drop-lefts,.drop-rights', function (event) {
        // 必须通过event.preventDefault()来设置允许拖放
        event.preventDefault();
    });
    // 结束拖动放开鼠标的事件
    $(document).on('drop', '.drop-lefts', function (event) {
        event.preventDefault();
        if ($srcImgDiv[0] != $(this).parent()[0]) {
            $(this).parent().before($srcImgDiv);
        }
        imgpashs = [];
        for (var i = 0; i <= $(".imgbs img").length - 1; i++) {
            imgpash.push($(".imgbs img")[i].src);
        }
    });
    $(document).on('drop', '.drop-rights', function (event) {
        event.preventDefault();
        if ($srcImgDiv[0] != $(this).parent()[0]) {
            $(this).parent().after($srcImgDiv);
        }
        imgpashs = [];
        for (var i = 0; i <= $(".imgbs img").length - 1; i++) {
            imgpash.push($(".imgbs img")[i].src);
        }
    });
});
$.ajax({
    type: "post",
    url: url + "data/json/getDataList/categoryList",
    dataType: "json",
    data: {},
    success: function (data) {
        for (var i = 0; i < data.resultList.length; i++) {
            $("#type").append("<option value=" + data.resultList[i].ccode + ">" + data.resultList[i].cname + "</option>");
            form.render('select');
        }
    }
});
$.ajax({
    type: "post",
    url: url + "data/json/getDataList/conditionList",
    dataType: "json",
    data: {},
    success: function (data) {
        for (var i = 0; i < data.resultList.length; i++) {
            $("#pinxiang").append("<option value=" + data.resultList[i].ccode + ">" + data.resultList[i].cname + "</option>");
            form.render('select');
        }
    }
});
$.ajax({
    type: "post",
    url: url + "data/json/getDataList/unitList",
    dataType: "json",
    data: {},
    success: function (data) {
        for (var i = 0; i < data.resultList.length; i++) {
            $("#danwei").append("<option value=" + data.resultList[i].ccode + ">" + data.resultList[i].cname + "</option>");
            form.render('select');
        }
    }
});
$.ajax({
    type: "post",
    url: url + "data/json/getDataList/dealwayList",
    dataType: "json",
    data: {},
    success: function (data) {
        for (var i = 0; i < data.resultList.length; i++) {
            $("#searchType").append("<option value=" + data.resultList[i].ccode + ">" + data.resultList[i].cname + "</option>");
            form.render('select');
        }
    }
});

$(".list").hide();
layui.use('form', function () {
    form = layui.form;
});
$("#name").on("keyup", function () {
    //渠道类型接口
    $.ajax({
        type: "post",
        url: url + "data/json/getAssociateCollector",
        dataType: "json",
        data: {
            cname: $("#name").val(),
            pageSize: 10,
            pageIndex: 1
        },
        success: function (data) {
            $(".list").html("");
            var res = data.resultList;
            for (var i = 0; i < res.length; i++) {
                var lists = '<p>' + res[i].name + '</p>';
                $(".list").append(lists)
                $(".list").show();
            }
        }
    });
});
// 志号
var this_code;
// 行情商品id
var this_oid;
// 标识
var this_tag;
// 行情别名
var this_otherName;
$(".list").on("click", "p", function (event) {
    $("#name").val($(this).html());
    $.ajax({
        type: "post",
        url: url + "data/json/getAssociateCollector",
        dataType: "json",
        data: {
            cname: $("#name").val(),
            pageSize: 10,
            pageIndex: 1
        },
        success: function (data) {
            if (data.resultList.length != 1) {
                $.ajax({
                    type: "post",
                    url: url + "data/json/getAssociateCollector",
                    dataType: "json",
                    data: {
                        cname: $("#name").val(),
                        pageSize: 10,
                        pageIndex: 1
                    },
                    success: function (data) {
                        $(".list").html("");
                        var res = data.resultList;
                        for (var i = 0; i < res.length; i++) {
                            var lists = '<div class="lists">' + '<span>' + res[i].code + '</span>' + '<span>' + res[i].name + '</span>' + '<span>' + res[i].price + '</span>' + '</div>';
                            $(".list").append(lists);
                            $(".list").show();
                        }
                    }
                });
            } else {
                // 志号
                this_code = data.resultList[0].code;
                // 行情商品id
                this_oid = data.resultList[0].oid;
                // 标识
                this_tag = data.resultList[0].tag;
                // 行情别名
                this_otherName = data.resultList[0].otherName;
                // 单位
                unitName = data.resultList[0].unitName;
                unitNames = data.resultList[0].unitCode;
                // 分类
                categoryName = data.resultList[0].categoryName;
                categoryNames = data.resultList[0].categoryCode;
                var price = data.resultList[0].price;
                $("#price").val(price);
                for (var i = 0; i < data.resultList.length; i++) {
                    $("#danwei option:selected").html(unitName);
                    $("#danwei option:selected").val(unitNames);
                    $("#type option:selected").html(categoryName);
                    $("#type option:selected").val(categoryNames);
                    form.render('select');
                }
                $(".list").hide();
            }
        }
    });
    $(".list").hide();
});
$(".list").on("click", "div", function (event) {
    $("#name").val($(this).children().eq(1).html());
    $(".list").hide();
    $.ajax({
        type: "post",
        url: url + "data/json/getAssociateCollector",
        dataType: "json",
        data: {
            cname: $("#name").val(),
            pageSize: 10,
            pageIndex: 1
        },
        success: function (data) {
            if (data.resultList == 1) {
                // 志号
                this_code = data.resultList[0].code;
                // 行情商品id
                this_oid = data.resultList[0].oid;
                // 标识
                this_tag = data.resultList[0].tag;
                // 行情别名
                this_otherName = data.resultList[0].otherName;
                // 单位
                unitName = data.resultList[0].unitName;
                unitNames = data.resultList[0].unitCode;
                // 分类
                categoryName = data.resultList[0].categoryName;
                categoryNames = data.resultList[0].categoryCode;
                var price = data.resultList[0].price;
                $("#price").val(price);
                for (var i = 0; i < data.resultList.length; i++) {
                    $("#danwei option:selected").html(unitName);
                    $("#danwei option:selected").val(unitNames);
                    $("#type option:selected").html(categoryName);
                    $("#type option:selected").val(categoryNames);
                    form.render('select');
                }
            } else {
                $(".list").on("click", "div", function (event) {
                    $("#name").val($(this).children().eq(1).html());
                    $(".list").hide();
                    $.ajax({
                        type: "post",
                        url: url + "data/json/getAssociateCollector",
                        dataType: "json",
                        data: {
                            token: 'h5768234das723',
                            timestamp: times,
                            sign: secondEncryption,
                            cname: $("#name").val(),
                            pageSize: 10,
                            pageIndex: 1
                        },
                        success: function (data) {
                            // 志号
                            this_code = data.resultList[0].code;
                            // 行情商品id
                            this_oid = data.resultList[0].oid;
                            // 标识
                            this_tag = data.resultList[0].tag;
                            // 行情别名
                            this_otherName = data.resultList[0].otherName;
                            // 单位
                            unitName = data.resultList[0].unitName;
                            unitNames = data.resultList[0].unitCode;
                            // 分类
                            categoryName = data.resultList[0].categoryName;
                            categoryNames = data.resultList[0].categoryCode;
                            var price = data.resultList[0].price;
                            $("#price").val(price);
                            for (var i = 0; i < data.resultList.length; i++) {
                                $("#danwei option:selected").html(unitName);
                                $("#danwei option:selected").val(unitNames);
                                $("#type option:selected").html(categoryName);
                                $("#type option:selected").val(categoryNames);
                                form.render('select');
                            }
                        }
                    })
                });
            }
        }
    });
});
var this_id = sessionStorage.getItem("loginGoodsId");

function putGoods() {
    // checkeds = [];
    // var dealPattern_num = 0;
    // $("input:checkbox:checked").each(function () {
    //     dealPattern_num = 0;
    //     checkeds.push($(this)[0].name)
    //     dealPattern_num = eval(checkeds.join('+'));
    // });
    // console.log(dealPattern_num)
    debugger
    if (imgpash == "") {
        imgpash = [];
    }
    if (imgpash != "" && imgpash.length < 10) {
        imgpash = imgpash.join(",");
    }
    if (imgpashs == "") {
        imgpashs = [];
    }
    if (imgpashs != "" && imgpashs.length < 10) {
        imgpashs = imgpashs.join(",");
    }
    // imgpash = imgpash.join(",");
    // imgpashs = imgpashs.join(",");

 
    // var name = $.trim($("#name").val());//藏品名称
    var type = $.trim($("#type").val());//藏品分类
    var pinxiang = $.trim($("#pinxiang").val());//藏品品相
    var danwei = $.trim($("#danwei").val()); //交易单位
    var num = $.trim($("#num").val()); //交易数量
    var price = $.trim($("#price").val()); //交易单价
    var mixNum = $.trim($("#mixNum").val()); //>最小数量
    var dataw = $.trim($("#dataw").val()); //有效期
    var name = $.trim($("#name").val()); //藏品名称
    var desc = $.trim($("#desc").val()); //藏品名称
    // var num = $.trim($("#num").val());

    if (name.length < 1) {
        alert("藏品名称不能为空");
        return;
    }
    if (pinxiang.length < 1) {
        alert("藏品分类不能为空");
        return;
    }
    if (danwei.length < 1) {
        alert("交易单位不能为空");
        return;
    }
    if (num.length < 1) {
        alert("交易数量不能为空");
        return;
    }
    if (price.length < 1) {
        alert("交易单价不能为空");
        return;
    }
    if (mixNum.length < 1) {
        alert("最小数量不能为空");
        return;
    }
    if (dataw.length < 1) {
        alert("有效期不能为空");
        return;
    } else if (dataw > 30) {
        alert("有效期在30天以内！");
        return;
    }
    if (desc.length < 1) {
        alert("藏品描述不能为空！");
        return;
    } else if (desc.length > 100) {
        alert("藏品描述不能超过100字！");
        return;
    }
    // if (name.length < 1) {
    //     alert("藏品名称不能为空");
    //     return;
    // }
    // if (name.length < 1) {
    //     alert("藏品名称不能为空");
    //     return;
    // }
    // if (name.length < 1) {
    //     alert("藏品名称不能为空");
    //     return;
    // }


    if ($("#num").val() && $("#price").val() && $("#mixNum").val() && $("#dataw").val() && $("#name").val()) {
        var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if ($("#num").val() && $("#price").val() && $("#mixNum").val() && $("#dataw").val()) {
            if (reg.test($("#num").val()) && reg.test($("#price").val()) && reg.test($("#mixNum").val()) && reg.test($("#dataw").val())) {
                if ($("#desc").val().length > 100) {
                    alert("藏品描述不能超过100字！");
                } else {
                    if ($("#dataw") > 30) {
                        alert("有效期在30天以内！");
                    } else {
                        if (imgpash && imgpashs) { //dealPattern_num != 0
                            if (sessionStorage.getItem("goodsId") && sessionStorage.getItem("goodsPubUserid")) {
                                $.ajax({
                                    type: "post",
                                    url: url + "data/json/updateGoods",
                                    dataType: "json",
                                    data: {
                                        // dealPattern: dealPattern_num,
                                        dealPattern: 3,
                                        recPicUrl: imgpashs,
                                        isRecommend: "Y",
                                        type: 4,         //  1 买  2 卖  3 闪买  4 闪卖
                                        title: $("#name").val(),       //  标题
                                        name: $("#name").val(),          //  标题
                                        color: 0,       //  颜色   0
                                        categoryName: $("#type option:selected").text(),
                                        categoryCode: $("#type option:selected").val(),    //  分类code
                                        conditionCode: $("#pinxiang option:selected").val(),   //  品相  code
                                        unitCode: $("#danwei option:selected").val(),       //  单位code
                                        dealCnt: $("#num").val(),    //   发布数量
                                        dealPrice: $("#price").val(),   //  发布价格
                                        dealWay: $("#searchType option:selected").val(),    // 交割方式
                                        dealMin: $("#mixNum").val(),   //  最小交易数量
                                        isAnon: "N",    //  是否匿名   Y  匿名  N  不匿名
                                        desc: $("#desc").val(),      //  商品描述
                                        validDay: $("#dataw").val(),    // 有效天数
                                        picUrls: imgpash,     //  上传图片 逗号拼接
                                        pubUserid: sessPub,
                                        goodsId: sessId,
                                        receiveAddr: "",  //   s收货地址
                                        receiveName: "",   //  收货人号码
                                        receivePhone: "",   // 接收人号码
                                        dealUser: "",      //   代理人id
                                        cAppVersion: '2.0.7',   //  版本号
                                        pubUsername: pudName,
                                    },
                                    success: function (data) {



                                        debugger;   

                                        if (data.code == 10000) {
                                            alert("修改成功!");
                                            window.location.href = 'goodsList.html';
                                        }
                                    }
                                });
                            } else {
                                $.ajax({
                                    type: "post",
                                    url: url + "user/json/saveGoods",
                                    dataType: "json",
                                    data: {
                                        // dealPattern: dealPattern_num,
                                        dealPattern: 3,
                                        recPicUrl: imgpashs,
                                        isRecommend: "Y",
                                        type: 4,         //  1 买  2 卖  3 闪买  4 闪卖
                                        title: $("#name").val(),       //  标题
                                        name: $("#name").val(),          //  标题
                                        color: 0,       //  颜色   0
                                        category: $("#type option:selected").val(),    //  分类code
                                        condition: $("#pinxiang option:selected").val(),   //  品相  code
                                        unit: $("#danwei option:selected").val(),       //  单位code
                                        dealCnt: $("#num").val(),    //   发布数量
                                        dealPrice: $("#price").val(),   //  发布价格
                                        dealWay: $("#searchType option:selected").val(),    // 交割方式
                                        dealMin: $("#mixNum").val(),   //  最小交易数量
                                        isAnon: "N",    //  是否匿名   Y  匿名  N  不匿名
                                        desc: $("#desc").val(),      //  商品描述
                                        validDay: $("#dataw").val(),    // 有效天数
                                        picUrls: imgpash,     //  上传图片 逗号拼接
                                        userId: this_id,      //  当前用户id
                                        receiveAddr: "",  //   s收货地址
                                        receiveName: "",   //  收货人号码
                                        receivePhone: "",   // 接收人号码
                                        dealUser: "",      //   代理人id
                                        cAppVersion: '2.0.7',   //  版本号
                                        sysInfo: 'h5',       //  h5
                                        code: this_code,          //   行情志号
                                        sid: this_oid,         //    行情商品id
                                        tag: this_tag,          //   标识  stamp  coin  magcard
                                        otherName: this_otherName,   //    行情别名
                                    },
                                    success: function (data) {
                                        if (data.code == 10000) {
                                            alert("修改成功!");
                                            window.location.href = 'goodsList.html';
                                        }
                                    }
                                })
                            }
                        } else {
                            alert("请上传图片或者填写交易方式");
                        }
                    }
                }
            } else {
                alert("请输入数字");
                return false;
            }
        }
    } else {
        alert("请填写藏品名称、交易数量、交易单价、最小数量或有效期！")
    }
};