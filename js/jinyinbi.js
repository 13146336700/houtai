
var url = 'http://116.196.69.82:4080/YBSys/ybws/data/json/';
var qrcode = sessionStorage.getItem("qrcode");
var userNames = sessionStorage.getItem("userNames");
cola(function(model) {
    model.set("usernames", userNames);
    model.set({
        currentDate: new Date()
    });
    model.set("search", "1");
    model.set("starttime", "");
    model.set("endtime", "");
    model.set("dateType", "4");

    var now = new Date();                    //当前日期
    var nowDayOfWeek = now.getDay();         //今天本周的第几天
    var nowDay = now.getDate();              //当前日
    var nowMonth = now.getMonth();           //当前月
    var nowYear = now.getYear();             //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0;  //

    var lastMonthDate = new Date();  //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();

    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth()+1;
        var myweekday = date.getDate();

        if(mymonth < 10){
            mymonth = "0" + mymonth;
        }
        if(myweekday < 10){
            myweekday = "0" + myweekday;
        }
        return (myyear+"-"+mymonth + "-" + myweekday);
    }
    function formmonth(date){
        var mymonth = date.getMonth()+1;
        var myweekday = date.getDate();

        if(mymonth < 10){
            mymonth = "0" + mymonth;
        }
        if(myweekday < 10){
            myweekday = "0" + myweekday;
        }
        return (mymonth + "-" + myweekday);
    }

    //获得今天的日期
    var getUpWeekStartDate = new Date(nowYear, nowMonth, nowDay);
    var getUpWeekStartDate =  formmonth(getUpWeekStartDate);

    //获得本周的结束日期
    var getUpWeekEndDate = new Date(nowYear, nowMonth, nowDay-6);
    var getUpWeekEndDate2 = new Date(nowYear, nowMonth, nowDay-1);
    var getUpWeekEndDate3 = new Date(nowYear, nowMonth, nowDay-2);
    var getUpWeekEndDate4 = new Date(nowYear, nowMonth, nowDay-3);
    var getUpWeekEndDate5 = new Date(nowYear, nowMonth, nowDay-4);
    var getUpWeekEndDate6 = new Date(nowYear, nowMonth, nowDay-5);
    var getUpWeekEndDate =  formmonth(getUpWeekEndDate);
    var getUpWeekEndDate2 =  formmonth(getUpWeekEndDate2);
    var getUpWeekEndDate3 =  formmonth(getUpWeekEndDate3);
    var getUpWeekEndDate4 =  formmonth(getUpWeekEndDate4);
    var getUpWeekEndDate5 =  formmonth(getUpWeekEndDate5);
    var getUpWeekEndDate6 =  formmonth(getUpWeekEndDate6);

    //本周开始和结束的年月日
    var weekstart =  new Date(nowYear, nowMonth, nowDay-6);
    var weekstart = formatDate(weekstart);
    var weekend =  new Date(nowYear, nowMonth, nowDay);
    var weekend = formatDate(weekend);
    layui.use('laydate', function(){
        var laydate = layui.laydate;

        //执行一个laydate实例
        laydate.render({
            elem: '#test1', //指定元素
            min:'2018-03-01',
            done: function(value, date, endDate){
                model.set("starttime",value);
            }
        });
        //执行一个laydate实例
        laydate.render({
            elem: '#test2', //指定元素
            min:'2018-03-01',
            done: function(value, date, endDate){
                model.set("endtime",value);
            }
        });
    });

    model.action({
        searchs: function() {
            if(model.get("starttime")){

            }else{
                model.set("starttime","2018-03-01")
            }
            if(model.get("endtime")){

            }else{
                model.set("endtime",weekend)
            }
            $.ajax({
                type: "post",
                url: url+"searchProductTrend",
                data: {
                    "categoryName": "金银币",
                    'startTime': model.get("starttime"),
                    'endTime': model.get("endtime"),
                    'dateType': model.get("dateType"),
                    'ctype':'category',
                    "sysInfo": "h5"
                },
                success: function(data) {
                    //格式化日期：yyyy-MM-dd
                    function formatdate(date) {
                        var myyear = date.getFullYear();
                        var mymonth = date.getMonth()+1;
                        var myweekday = date.getDate();

                        if(mymonth < 10){
                            mymonth = "0" + mymonth;
                        }
                        if(myweekday < 10){
                            myweekday = "0" + myweekday;
                        }
                        return (myyear+"-"+mymonth + "-" + myweekday);
                    }
                    var jintian = new Date(nowYear, nowMonth, nowDay);
                    var jintian =  formatdate(jintian);
                    var zuotian = new Date(nowYear, nowMonth, nowDay-1);
                    var zuotian =  formatdate(zuotian);
                    var qiantian = new Date(nowYear, nowMonth, nowDay-2);
                    var qiantian =  formatdate(qiantian);
                    if(data.resultObject.exponentList == 0) {
                        alert("没有最近的数据！")
                    } else {
                        // console.log(model.get("starttime"))
                        // console.log(model.get("endtime"))
                        var list = data.resultObject.exponentList;
                        var time = [];
                        var num = [];
                        for(var i = 0; i < list.length; i++) {
                            if(list[i].displayTime.length>5){
                                time.push(list[i].displayTime.substring(5));
                            }else{
                                time.push(list[i].displayTime);
                            }

                            num.push(list[i].exponent);
                            for(var k=0;k<time.length;k++){
                                if(time[k]==jintian.substring(5)){
                                    time[k]="今天"
                                }
                                if(time[k]==zuotian.substring(5)){
                                    time[k]="昨天"
                                }
                                if(time[k]==qiantian.substring(5)){
                                    time[k]="前天"
                                }
                            }
                            if(model.get("dateType")==1){
                                var weeks = " 今日"
                            }if(model.get("dateType")==2){
                                var weeks = " 本周"
                            }
                            if(model.get("dateType")==3){
                                var weeks = " 本月"
                            }
                            myChart.setOption({ //加载数据图表
                                dataZoom: [{
                                    type: 'inside',
                                    throttle: '50',
                                    minValueSpan: 5,
                                    startValue:weekstart.substring(5),
                                    end: 100
                                }],
                                title: {
                                    text: "金银纪念币 行情趋势",
                                    textStyle: {
                                        color: "#F4F3F5",
                                        fontWeight:"normal",
                                        fontSize:16
                                    }
                                },
                                xAxis: {
                                    data: time
                                },
                                series: [{
                                    // 根据名字对应到相应的系列
                                    name: '指数',
                                    data: num
                                }]
                            });
                        }
                    }
                }
            });
        },
        butcolor4: function () {
            $(".xs").removeClass("basic").addClass("primary");
            $(".jr").addClass("basic");
            $(".bz").addClass("basic");
            $(".by").addClass("basic");
            model.set("dateType", 4)
            btnCli1(4,weekend,weekend)
        },
        butcolor: function() {
            $(".jr").removeClass("basic").addClass("primary");
            $(".bz").addClass("basic");
            $(".by").addClass("basic");
            $(".xs").addClass("basic");
            model.set("dateType", 1)
            btnCli(1,weekstart,weekend)
        },
        butcolor1: function() {
            $(".jr").addClass("basic");
            $(".bz").removeClass("basic").addClass("primary");
            $(".by").addClass("basic");
            $(".xs").addClass("basic");
            model.set("dateType", 2);
            btnCli(2,'2018-03-01',weekend)
        },
        butcolor2: function() {
            $(".jr").addClass("basic");
            $(".bz").addClass("basic");
            $(".by").removeClass("basic").addClass("primary");
            $(".xs").addClass("basic");
            model.set("dateType", 3);
            btnCli(3,'2018-03-01',weekend)
        }
    });
    var myChart = echarts.init(document.getElementById('line'));

    option = {
        backgroundColor: '#232D46',
        dataZoom: [{
            type: 'inside',
            throttle: '50',
            minValueSpan: 5,
            start: 0,
            end: 100
        }],
        title: {
            text: '金银纪念币 行情趋势',
            textStyle: {
                color: "#F4F3F5",
                fontWeight:"normal",
                fontSize:16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#cccccc'
                }
            }
        },
        grid: {
            left: '-4%',
            right: '1%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: [getUpWeekEndDate,getUpWeekEndDate6,getUpWeekEndDate5,getUpWeekEndDate4,"前天","昨天","今天"],
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#F4F3F5'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            scale:true,
            //			boundaryGap: true,
            axisLabel: {
                show: false,
                textStyle: {
                    color: '#F4F3F5'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#32346c '
                }
            }
        }],
        series: [{
            name: 'PNMI邮币卡指数',
            type: 'line',
            smooth:true,
            stack: '总量',
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:1.5,//折线宽度
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2D315A'
                        }, {
                            offset: 1,
                            color: '#CB594E'
                        }])//折线颜色
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    color:"while"
                }
            },
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#2D315A'
            }, {
                offset: 1,
                color: '#CB594E'
            }]),
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2D315A'
                    }, {
                        offset: 1,
                        color: '#CB594E'
                    }])
                }
            },
            data: []
        }]
    };
    function inits() {
        $.ajax({
            type: "post",
            async: true,
            url: url+"searchProductTrend",
            data: {
                "categoryName": "金银币",
                'startTime': weekend,
                'endTime': weekend,
                "channelType": qrcode,
                'ctype':'category',
                'dateType':'4',
                "sysInfo": "h5"
            },
            success: function(data) {
                //格式化日期：yyyy-MM-dd
                function formatdate(date) {
                    var myyear = date.getFullYear();
                    var mymonth = date.getMonth()+1;
                    var myweekday = date.getDate();

                    if(mymonth < 10){
                        mymonth = "0" + mymonth;
                    }
                    if(myweekday < 10){
                        myweekday = "0" + myweekday;
                    }
                    return (myyear+"-"+mymonth + "-" + myweekday);
                }
                var jintian = new Date(nowYear, nowMonth, nowDay);
                var jintian =  formatdate(jintian);
                var zuotian = new Date(nowYear, nowMonth, nowDay-1);
                var zuotian =  formatdate(zuotian);
                var qiantian = new Date(nowYear, nowMonth, nowDay-2);
                var qiantian =  formatdate(qiantian);
                model.set("namec",data.resultObject.categoryList[0].name)
                model.set("imgsrc", data.resultObject.channelUrl)
                $(".imge").attr("src", model.get("imgsrc"))

                // if(data.resultObject.exponentList.length == 0) {
                //     alert("没有最近的数据！")
                // } else {
                //
                //     var list = data.resultObject.exponentList;
                //     var time = [];
                //     var num = [];
                //     for(var i = 0; i < list.length; i++) {
                //         time.push(list[i].displayTime);
                //         num.push(list[i].exponent);
                //         for(var k=0;k<time.length;k++){
                //             if(time[k]==jintian){
                //                 time[k]="今天"
                //             }
                //             if(time[k]==zuotian){
                //                 time[k]="昨天"
                //             }
                //             if(time[k]==qiantian){
                //                 time[k]="前天"
                //             }
                //         }
                //         myChart.hideLoading(); //隐藏加载动画
                //         myChart.setOption({
                //             dataZoom: [{
                //                 type: 'inside',
                //                 throttle: '50',
                //                 minValueSpan: 5,
                //                 start: 0,
                //                 end: 100
                //             }], //加载数据图表
                //             xAxis: {
                //                 data: time
                //             },
                //             series: [{
                //                 // 根据名字对应到相应的系列
                //                 name: '指数',
                //                 data: num
                //             }]
                //         });
                //     }
                // }

            }
        })
    }
    inits();
    $(".jr").removeClass("basic").addClass("primary");
    $(".bz").addClass("basic");
    $(".by").addClass("basic");
    $(".xs").addClass("basic");
    model.set("dateType", 1);
    btnCli(1,weekstart,weekend);
    function btnCli(num,start,end) {
        $.ajax({
            type: "post",
            async: true,
            url: url+"searchProductTrend",
            data: {
                "categoryName": "金银币",
                'startTime': "2018-03-01",
                'endTime': end,
                "channelType": qrcode,
                'ctype':'category',
                'dateType':num,
                "sysInfo": "h5"
            },
            success: function(data) {
                //格式化日期：yyyy-MM-dd
                function formatdate(date) {
                    var myyear = date.getFullYear();
                    var mymonth = date.getMonth()+1;
                    var myweekday = date.getDate();

                    if(mymonth < 10){
                        mymonth = "0" + mymonth;
                    }
                    if(myweekday < 10){
                        myweekday = "0" + myweekday;
                    }
                    return (myyear+"-"+mymonth + "-" + myweekday);
                }
                var jintian = new Date(nowYear, nowMonth, nowDay);
                var jintian =  formatdate(jintian);
                var zuotian = new Date(nowYear, nowMonth, nowDay-1);
                var zuotian =  formatdate(zuotian);
                var qiantian = new Date(nowYear, nowMonth, nowDay-2);
                var qiantian =  formatdate(qiantian);
                model.set("namec",data.resultObject.categoryList[0].name);
                model.set("imgsrc", data.resultObject.channelUrl)
                $(".imge").attr("src", model.get("imgsrc"))
                var arrl = []

                var leibie = data.resultObject.categoryList;
                for(var i = 0; i < leibie.length; i++) {
                    arrl.push(leibie[i].name);
                }
                if(data.resultObject.exponentList.length == 0) {
                    alert("没有最近的数据！")
                } else {

                    var list = data.resultObject.exponentList;
                    var time = [];
                    var num = [];
                    for(var i = 0; i < list.length; i++) {
                        time.push(list[i].displayTime.substring(5));
                        num.push(list[i].exponent);
                        for(var k=0;k<time.length;k++){
                            if(time[k]==jintian.substring(5)){
                                time[k]="今天"
                            }
                            if(time[k]==zuotian.substring(5)){
                                time[k]="昨天"
                            }
                            if(time[k]==qiantian.substring(5)){
                                time[k]="前天"
                            }
                        }
                        myChart.setOption({
                            dataZoom: [{
                                type: 'inside',
                                throttle: '50',
                                startValue:weekstart.substring(5),
                                minValueSpan: 5,
                                end: 100
                            }], //加载数据图表
                            xAxis: {
                                data: time
                            },
                            series: [{
                                // 根据名字对应到相应的系列
                                name: '指数',
                                data: num
                            }]
                        });
                    }
                }

            }
        })
    }
    function btnCli1(num,start,end) {
        $.ajax({
            type: "post",
            async: true,
            url: url+"searchProductTrend",
            data: {
                "categoryName": "金银币",
                'startTime': "2018-03-01",
                'endTime': end,
                "channelType": qrcode,
                'ctype':'category',
                'dateType':num,
                "sysInfo": "h5"
            },
            success: function(data) {
                //格式化日期：yyyy-MM-dd
                function formatdate(date) {
                    var myyear = date.getFullYear();
                    var mymonth = date.getMonth()+1;
                    var myweekday = date.getDate();

                    if(mymonth < 10){
                        mymonth = "0" + mymonth;
                    }
                    if(myweekday < 10){
                        myweekday = "0" + myweekday;
                    }
                    return (myyear+"-"+mymonth + "-" + myweekday);
                }
                var jintian = new Date(nowYear, nowMonth, nowDay);
                var jintian =  formatdate(jintian);
                var zuotian = new Date(nowYear, nowMonth, nowDay-1);
                var zuotian =  formatdate(zuotian);
                var qiantian = new Date(nowYear, nowMonth, nowDay-2);
                var qiantian =  formatdate(qiantian);
                model.set("namec",data.resultObject.categoryList[0].name)
                model.set("imgsrc", data.resultObject.channelUrl)
                $(".imge").attr("src", model.get("imgsrc"))
                var arrl = []

                var leibie = data.resultObject.categoryList;
                for(var i = 0; i < leibie.length; i++) {
                    arrl.push(leibie[i].name);
                }
                if(data.resultObject.exponentList.length == 0) {
                    alert("没有最近的数据！")
                } else {

                    var list = data.resultObject.exponentList;
                    var time = [];
                    var num = [];
                    for(var i = 0; i < list.length; i++) {
                        time.push(list[i].displayTime);
                        num.push(list[i].exponent);
                        for(var k=0;k<time.length;k++){
                            if(time[k]==jintian.substring(5)){
                                time[k]="今天"
                            }
                            if(time[k]==zuotian.substring(5)){
                                time[k]="昨天"
                            }
                            if(time[k]==qiantian.substring(5)){
                                time[k]="前天"
                            }
                        }
                        myChart.setOption({
                            dataZoom: [{
                                type: 'inside',
                                throttle: '50',
                                minValueSpan: 5,
                                start: 0,
                                end: 100
                            }], //加载数据图表
                            xAxis: {
                                data: time
                            },
                            series: [{
                                // 根据名字对应到相应的系列
                                name: '指数',
                                data: num
                            }]
                        });
                    }
                }

            }
        })
    }
    myChart.setOption(option);
});
