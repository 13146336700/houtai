var qrcode = sessionStorage.getItem("qrcode");
var userNames = sessionStorage.getItem("userNames");
var url = 'http://116.196.69.82:4080/YBSys/ybws/data/json/';
cola(function(model) {
	model.set("usernames",userNames);
	model.set({
		currentDate: new Date()
	})
	model.set("search", "1");
	model.set("starttime", "2018-03-01");
	model.set("endtime", "");
	model.set("dateType", "1");
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
    var weekstart = formatDate(weekstart)
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
					'searchName': "1",
					'startTime': model.get("starttime"),
					'endTime': model.get("endtime"),
					'dateType': model.get("dateType"),
                    'ctype': "pnmi"
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
						var list = data.resultObject.exponentList;
						var time = [];
						var num = [];
            if(model.get("dateType")==1||model.get("dateType")==2){
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
                    'searchName': "1",
                    'startTime': model.get("starttime"),
                    'endTime': model.get("endtime"),
                    'dateType': model.get("dateType"),
                    'ctype': "pnmi"
                  },
                  success: function (data) {
                    if(data.resultObject.exponentList == 0) {
                      alert("没有最近的数据！")
                    } else {
                      var list = data.resultObject.exponentList;
                      var time = [];
                      var num = [];
                      for(var i = 0; i < list.length; i++) {
                        var number = 0;
                        for(var j=0;j<time.length;j++){
                          if($("#test2").val()==""){
                            number = 0;
                          }else{
                            number = 1;
                          }
                        }
                        time.push(list[i-number].displayTime.substring(5));
                        num.push(list[i-number].exponent);
                        // console.log(time)
                        // console.log(num)
                        // console.log(time)
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
                          myChart.setOption({        //加载数据图表
                            dataZoom: [{
                              type: 'inside',
                              startValue:weekstart.substring(5),
                              throttle: '50',
                              minValueSpan: 4,
                              end: 100
                            }],
                            title: {
                              text: '邮票大盘 行情趋势',
                              textStyle: {
                                color: "#F4F3F5"
                              }
                            },
                            xAxis: {
                              data: time
                            },
                            yAxis:{
                              scale:true
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
            if(model.get("dateType")==4){
              inits()
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
      model.set("dateType", 4);
      btnCli1(4,weekend,weekend)
    },
    butcolor: function() {
        $(".jr").removeClass("basic").addClass("primary");
        $(".bz").addClass("basic");
        $(".by").addClass("basic");
        $(".xs").addClass("basic");
        model.set("dateType", 1)
        btnCli(1,'2018-03-01',weekend)
    },

		butcolor1: function() {
			$(".jr").addClass("basic");
			$(".bz").removeClass("basic").addClass("primary");
			$(".by").addClass("basic");
      $(".xs").addClass("basic");
			model.set("dateType", 2)
      btnCli(2,'2018-03-01',weekend)
		},
		butcolor2: function() {
			$(".jr").addClass("basic");
			$(".bz").addClass("basic");
			$(".by").removeClass("basic").addClass("primary");
      $(".xs").addClass("basic");
			model.set("dateType", 3)
      btnCli(3,'2018-03-01',weekend)
		}
	});
	var myChart = echarts.init(document.getElementById('line'));

	option = {
		backgroundColor: '#232D46',
		dataZoom: [{
			type: 'inside',
			disabled:false,
			throttle: '50',
			minValueSpan: 4,
			start: 0,
			end: 100
		}],
		title: {
			text: '邮票大盘 行情趋势',
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
			left: '-3%',
			right: '1%',
			bottom: '0%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: true,
			data: [],
			axisLabel: {
                // interval:0,//横轴信息全部显示
				show: true,
				textStyle: {
					color: '#F4F3F5'
				}
			}
		}],

		yAxis: [{
			type: 'value',
			scale:true,
			axisLabel: {
				show: false,
				textStyle: {
					color: '#F4F3F5'
				}
			},
			 splitLine: {
	            show: true,
	            lineStyle: {
	                color: '#32346c ',
	            }
        	}
		}],
		series: [{
			name: 'PNMI大盘指数',
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
                        }]),//折线颜色
                    }
                }
            },
			label: {
                normal: {
                    show: true,
                    position: 'top',
                    color:"while",
                },
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
					}]),
				}
			},
			          data:[]
		}]
	};

  
  function inits() {
    $.ajax({
      type: "post",
      url: url+"searchProductTrend",
      data:{
        'searchName': "1",
        'startTime': weekend,
        'endTime': weekend,
        'dateType': "4",
        'channelType':qrcode,
        'ctype': "pnmi"
      },
      success: function(data) {
        model.set("imgsrc",data.resultObject.channelUrl)
        $(".imge").attr("src",model.get("imgsrc"))
        if(data.resultObject.exponentList.length==0){
          alert("没有最近的数据！")
        }else{
          var list = data.resultObject.exponentList;
          var time = [];
          var num = [];
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
            myChart.setOption({        //加载数据图表
              title: {
                text: '邮票大盘  行情趋势',
                textStyle: {
                  color: "#F4F3F5"
                }

              },
              dataZoom: [{
                type: 'inside',
                throttle: '50',
                minValueSpan: 5,
                start: 0,
                end: 100
              }],
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
  // inits();
    $(".jr").removeClass("basic").addClass("primary");
    $(".bz").addClass("basic");
    $(".by").addClass("basic");
    $(".xs").addClass("basic");
    model.set("dateType", 1)
    btnCli(1,'2018-03-01',weekend)
  function btnCli(num,start,end){
    $.ajax({
      type: "post",
      url: url+"searchProductTrend",
      data:{
        'searchName': "1",
        'startTime': start,
        'endTime': end,
        'dateType': num,
        'channelType':qrcode,
        'ctype': "pnmi"
      },
      success: function(data) {
        model.set("imgsrc",data.resultObject.channelUrl)
        $(".imge").attr("src",model.get("imgsrc"))
        if(data.resultObject.exponentList.length==0){
          alert("没有最近的数据！")
        }else{
          var list = data.resultObject.exponentList;
          var time = [];
          var num = [];
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
              title: {
                text: '邮票大盘  行情趋势',
                textStyle: {
                  color: "#F4F3F5"
                }

              },
              dataZoom: [{
                type: 'inside',
                startValue:weekstart.substring(5),
                throttle: '50',
                minValueSpan: 4,
                end: 100
              }],
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
  function btnCli1(num,start,end){
    $.ajax({
      type: "post",
      url: url+"searchProductTrend",
      data:{
        'searchName': "1",
        'startTime': start,
        'endTime': end,
        'dateType': num,
        'channelType':qrcode,
        'ctype': "pnmi"
      },
      success: function(data) {
        model.set("imgsrc",data.resultObject.channelUrl)
        $(".imge").attr("src",model.get("imgsrc"))
        if(data.resultObject.exponentList.length==0){
          alert("没有最近的数据！")
        }else{
          var list = data.resultObject.exponentList;
          var time = [];
          var num = [];
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
              title: {
                text: '邮票大盘  行情趋势',
                textStyle: {
                  color: "#F4F3F5"
                }

              },
              dataZoom: [{
                type: 'inside',
                throttle: '50',
                startValue: weekstart,
                minValueSpan: 4,
                start: 0,
                end: 100
              }],
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



