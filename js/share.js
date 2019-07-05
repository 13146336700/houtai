var qrcode = sessionStorage.getItem("qrcode");
var userNames = sessionStorage.getItem("userNames");
var USerId = sessionStorage.getItem("userId");
var url = "http://39.97.176.41:8080/YBSys/ybws/user/json/"; //线上的
let urlhongdong = "http://39.97.176.41:8081/youbaoRoom3/shareConfig/";
// var url = "http://192.168.1.182:8090/YBSys/ybws/user/json/"; //朱哥本机的
console.log(USerId);

cola(function(model) {
	laydate.render({
		elem: '#test1', //指定元素
		// type:'datetime'
	});
	laydate.render({
		elem: '#test2', //指定元素
		// type:'datetime'
	});

	//按钮什么时候显示的问题
	if (USerId == "zxl-201804031112yb") {
		$("#addFun").show();
	} else {
		$("#addFun").hide();
	}

	$(".bbsx").on("click", "span", function(event) {
		var target = $(event.target);
		target.css("color", "#1C90F3").siblings().css("color", "#666666");
		model.set("bbsx", target.html());
		if (target.html() == "全部") {
			model.set("bbsx", "");
		}
	})
	model.set("weeks", 1);
	model.set("bbsx", "");
	model.set("itemValue", ""); //输入文本框的value



	$(".weeks").on("click", "span", function(event) {
		var target = $(event.target);
		target.css("color", "#1C90F3").siblings().css("color", "#666666");
		if (target.html() == "按天") {
			model.set("weeks", 1);
		}
		if (target.html() == "按周") {
			model.set("weeks", 2);
		}
		if (target.html() == "按月") {
			model.set("weeks", 3);
		}
	});
	//友盟Android自3-1到今天的数据
	layui.use('form', function() {
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
		type: "post",
		url: "http://116.196.69.82:7090/YbSys/User/select",
		// url:"http://192.168.1.181:8080/YbSys/User/select",
		dataType: 'json',
		success: function(data) {
			//总计
			var listAll = data.data;
			var count = 0;
			var register = 0;
			var auth = 0;
			var silver = 0;
			var gold = 0;
			var registerall = 0;
			for (var i = 0; i < listAll.length; i++) {
				if (listAll[i].count == undefined || listAll[i].register == undefined || listAll[i].auth == undefined ||
					listAll[i].silver == undefined || listAll[i].gold == undefined) {
					listAll[i].count = 0;
					listAll[i].register = 0;
					listAll[i].auth = 0;
					listAll[i].silver = 0;
					listAll[i].gold = 0;
				}
				listAll[i].registerall = listAll[i].auth + listAll[i].silver + listAll[i].gold;
				count += listAll[i].count;
				register += listAll[i].register;
				auth += listAll[i].auth;
				silver += listAll[i].silver;
				gold += listAll[i].gold;
				//认证总数量
				registerall += listAll[i].auth + listAll[i].silver + listAll[i].gold;
			}
			var all = {
				name: "总计",
				count: count,
				register: register,
				registerall: registerall,
				auth: auth,
				silver: silver,
				gold: gold,
			}
			listAll.unshift(all)
			// console.log(listAll);
			model.set("employees", listAll);
		}
	});
	let imgpash = []; //图片保存的位置
	// ---------------------------------------------------
	$('#updata').on("change", function() {
		if (imgpash.length == 0) {
			var file = $('#updata')[0].files[0];
			var filePath = $('#updata')[0].value;
			// if(filePath){
			// 	console.log(file);
			// 	var reader = new FileReader();
			// }
			var reader = new FileReader();
			// console.log(readerTwo)

			reader.onload = function(e) {
				let dataList = e.target.result;
				var image = new Image();
				image.src = dataList;
				image.onload = function() {
					var width = image.width;
					var height = image.height;
					if (width == 58 || height == 58) {
						alert("图片尺寸符合！");
						var myReg = /^[\u4e00-\u9fa5]+$/;
						var this_content = $('#updata')[0].files[0].name.split(".")[0];
						for (var i = 0; i < this_content.length; i++) {
							if (myReg.test(this_content[i])) {
								alert("不能含有中文");
								return
							}
						}
						afile = $('#updata')[0].files[0];
						console.log(afile);
						key = afile.name.split('.')[0] + new Date().getTime();
						console.log(key);
						//	上传文件到七牛
						var num = 0;
						$.ajax({
							type: "post",
							url: 'http://api.youbao360.com:8080/YBApp/ybws/data/json/getQiNiuToken',
							dataType: 'json',
							async: false,
							data: {},
							success: function(res) {
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
										$("#test-image-preview").html("")
										for (let i = 0; i < imgpash.length; i++) {
											var img = '<div class="imgb">' +
												'<div class="drop-left">' + '</div>' +
												'<img class="image" draggable="true" />' +
												'<div class="drop-right">' +
												'</div>' + '</div>';
											$("#test-image-preview").append(img);
											$(".image").eq(i).attr("src", imgpash[i]);
											console.log(qiniu);
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
											success: function(res) {
												window.location = window.location;
											}
										});
									}
								};
								var subscription = observable.subscribe(observer) // 上传开始
							}
						});
					} else {
						alert("图片应该尺寸：58*58");
						// file.value = "";
						$('#updata')[0].value = "";
						return;
					}

				};
			}
			reader.readAsDataURL(file);

		} else {
			alert("最多一次上传一张，请删除重试");
			$('#updata')[0].value = "";
			return;
		}

	});

	//获取浏览的参数
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	};
	$(".a_href").click(function() {
		if ($(this).index() == 0) {
			$(this).attr("href", `Setting.html?status=${getQueryString('status')}`);
		} else if ($(this).index() == 1) {
			$(this).attr("href", `Award.html?status=${getQueryString('status')}`);
		} else if ($(this).index() == 2) {
			$(this).attr("href", `share.html?status=${getQueryString('status')}`);
		} else if ($(this).index() == 3) {
			$(this).attr("href", `Data_statistics.html?status=${getQueryString('status')}&num=1`);
		}
	})

	let _id = null;
	//获取分享的信息
	function shareConfig() {
		$.ajax({
			type: "post",
			url: urlhongdong + "getShareConfig",
			dataType: 'json',
			async: true,
			data: {
				id: getQueryString('status')
			},
			success: function(res) {
				if (res.code === 0) {
					if (res.msg.title == "" || res.msg.title == null || res.msg.title == undefined) {
						$("#Mysubmitlive_streamNew").show();
						$("#Two__Mysubmitlive_streamNew").hide();
					} else {
						$("#Mysubmitlive_streamNew").hide();
						$("#Two__Mysubmitlive_streamNew").show();
					}
					$("#shareTitle").val(res.msg.title);
					$("#shareContent").val(res.msg.descs);
					_id = res.msg.id;
					imgpash.push(res.msg.imgUrl);
					// $("#test-image-preview").html("")
					for (let i = 0; i < imgpash.length; i++) {
						var img = '<div class="imgb">' +
							'<div class="drop-left">' + '</div>' +
							'<img class="image" draggable="true" />' +
							'<div class="drop-right">' +
							'</div>' + '</div>';
						$("#test-image-preview").append(img);
						$(".image").eq(i).attr("src", imgpash[i]);
						console.log(qiniu);
					};








				}
				console.log(res);

			}
		});
	}
	shareConfig();





	$("#Mysubmitlive_streamNew").click(() => {
		console.log("分享图片" + imgpash[0]);
		console.log("分享标题" + $("#shareTitle").val());
		console.log("分享内容" + $("#shareContent").val());
		if (!$("#shareTitle").val()) {
			alert("请输入分享标题");
			return;
		}
		if (!$("#shareContent").val()) {
			alert("请输入分享内容");
			return;
		}
		if (imgpash.length == 0) {
			alert("请选择分享图片");
			return;
		}


		$.ajax({
			type: "post",
			url: urlhongdong + "addShareConfig",
			dataType: 'json',
			async: true,
			data: {
				title: $("#shareTitle").val(),
				imgUrl: imgpash[0],
				descs: $("#shareContent").val()
			},
			success: function(res) {

			}
		});
	});


	$("#Two__Mysubmitlive_streamNew").click(() => {
		console.log("分享图片" + imgpash[0]);
		console.log("分享标题" + $("#shareTitle").val());
		console.log("分享内容" + $("#shareContent").val());
		if (!$("#shareTitle").val()) {
			alert("请输入分享标题");
			return;
		}
		if (!$("#shareContent").val()) {
			alert("请输入分享内容");
			return;
		}
		if (imgpash.length == 0) {
			alert("请选择分享图片");
			return;
		}

		$.ajax({
			type: "post",
			url: urlhongdong + "updateShareConfig",
			dataType: 'json',
			async: true,
			data: {
				id: _id,
				title: $("#shareTitle").val(),
				imgUrl: imgpash[0],
				descs: $("#shareContent").val()
			},
			success: function(res) {

			}
		});
	});









	//删除图片
	Array.prototype.remove = function(val) {
		console.log(val);
		console.log(this);
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};

	$("#test-image-preview").on('click', '.image', function() {
		var message = confirm("确定删除该图片吗?");
		if (message == true) {
			$(this).remove();
			imgpash.remove(this.currentSrc);
			$(".imgs").html("");
			for (let i = 0; i < imgpash.length; i++) {
				var img = '<div id="test-image-preview">' +
					'<div class="drop-left">' + '</div>' + '<img class="image" draggable="true" />' +
					'<div class="drop-right">' + '</div>' +
					'</div>';
				$(".imgs").append(img);
				$(".image").eq(i).attr("src", imgpash[i]);
			};
		};
	});















	// ---------------------------------------------------
	function addimg(ID, project) {
		console.log(ID);
		var pro = $(ID);

		var img = '';
		$(project).each(function() {
			// img += '<option value="' + this.value + '" >' + this.name + '</option>';
			img = '<img src="' + this.img + '" />';
		});
		pro.append(img);
		// pro.html(img);
	}
	// function addimg(project) {
	// 
	// 	var pro = $('#test-image-preview');
	// 
	// 	var img = '';
	// 	$(project).each(function() {
	// 		// img += '<option value="' + this.value + '" >' + this.name + '</option>';
	// 		img = '<img src="' + this.img + '" />';
	// 	});
	// 	// pro.append(img);
	// 	pro.html(img);
	// }


	$(function() {
		//1.初始化Table
		var oTable = new TableInit();
		oTable.Init();
	});
	var TableInit = function() {
		var oTableInit = new Object();
		//初始化Table
		oTableInit.Init = function() {
			$('#ArbetTable').bootstrapTable({
				// url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
				// url: url + 'getChannelUserList',         //请求后台的URL（*）
				url: url + 'getChannelActList', //请求后台的URL（*）
				// url: 'http://192.168.1.181:8080/yb_controller/User/findByPage',         //请求后台的URL（*）
				method: 'post', //请求方式（*）
				toolbar: '#toolbar', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				sortable: true,
				// sortOrder: "asc",                   //排序方式
				queryParams: oTableInit.queryParams, //传递参数（*）
				//【其它设置】
				locale: 'zh-CN', //中文支持
				pagination: true, //是否开启分页（*）
				pageNumber: 1, //初始化加载第一页，默认第一页
				pageSize: 10, //每页的记录行数（*）
				pageList: [10], //可供选择的每页的行数（*）
				sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
				showRefresh: true, //刷新按钮
				// search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
				contentType: "application/x-www-form-urlencoded",
				striped: true, //是否显示行间隔色
				// strictSearch: true,
				showColumns: true, //是否显示所有的列
				showRefresh: true, //是否显示刷新按钮
				minimumCountColumns: 2, //最少允许的列数
				clickToSelect: true, //是否启用点击选中行
				height: "", //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId: "no", //每一行的唯一标识，一般为主键列
				showToggle: true, //是否显示详细视图和列表视图的切换按钮
				cardView: false, //是否显示详细视图
				detailView: false, //是否显示父子表
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
						"total": 0, //总页数
						"rows": res.resultList //数据
					};
				},
				columns: [{
						field: 'SerialNumber',
						title: '编号',
						align: "center",
						formatter: function(value, row, index) {
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
						field: 'content',
						align: "center",
						title: '分享内容',
					},
					// {
					//     field: 'imgUrl',
					//     align: "center",
					//     title: '活动链接',
					// },
					{
						title: '活动链接',
						align: "center",
						events: XIAZAIoperateEvents,
						formatter: XIANZAIoperateFormatter //自定义方法，添加操作按钮
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
		//下载图片的
		function XIANZAIoperateFormatter(value, row, index) { //赋予的参数
			return [
				// '这是第' + str(i) + '次打印')
				'<c-button  id="btn-xiazai" class="btn btn-default">下载二维码</c-button><div class="XIZAIqrcode"></div>'
				// '<c-button  id="btn-xiazai" class="btn btn-default">下载二维码</c-button><div class="XIZAIqrcode"><img src='+row.imgUrl+' style="display:none"/></div>' 
				// '<a  id="btn-code" class="btn btnchang btn-default" href="http://image.ybk008.com/login_two1557235591694" download>二维码</c-button>',
			].join('');
		};

		function operateFormatter(value, row, index) { //赋予的参数
			return [
				'<c-button  id="btn-edit" class="btn btn-default">详情</c-button>',
				'<c-button  id="btn-bianji" class="btn btn-default">编辑</c-button>',
				// '<a  id="btn-code" class="btn btnchang btn-default" href="http://image.ybk008.com/login_two1557235591694" download>二维码</c-button>',
			].join('');
		};
		//下载
		window.XIAZAIoperateEvents = {
			"click #btn-xiazai": function(e, value, row, index) {
				console.log(e);
				console.log(row);
				console.log(index);

				var qrcode = new QRCode(document.getElementsByClassName("XIZAIqrcode")[index], {
					text: row.imgUrl, //你想要填写的文本
					width: 300, //生成的二维码的宽度
					height: 300, //生成的二维码的高度
					colorDark: "#000000", // 生成的二维码的深色部分
					colorLight: "#ffffff", //生成二维码的浅色部分
					correctLevel: QRCode.CorrectLevel.H
				});
				// setTimeout(()=>{
				// document.getElementsByClassName("XIZAIqrcode")[index].getElementsByTagName('img')[0].style.display="none";
				// },5)
				// console.log(document.getElementsByClassName("XIZAIqrcode")[index].getElementsByTagName('img')[0]);
				//        let yuansu = document.getElementsByClassName("XIZAIqrcode")[index];
				setTimeout(() => {
					var qrcode = document.getElementsByClassName("XIZAIqrcode")[index];
					var img = qrcode.getElementsByTagName('img')[0];
					var link = document.createElement("a");
					var url = img.getAttribute("src");
					link.setAttribute("href", url);
					link.setAttribute("download", "share.png");
					link.click();
				}, 500)
			},
		}
		//用户详情
		window.operateEvents = {

			"click #btn-edit": function(e, value, row, index) {
				var id = row.id;
				console.log(e);
				console.log(row);
				console.log(index);
				var pubUserid = row.pubUserid;
				localStorage.setItem("ctype", row.ctype);
				// sessionStorage.setItem("goodsId", id);
				// sessionStorage.setItem("goodsPubUserid", pubUserid);
				window.location.href = 'activityNew.html';
			},
			//编辑活动
			"click #btn-bianji": function(e, value, row, index) {
				//增加两个字段
				//  var id = row.id;
				// var pubUserid = row.pubUserid;
				let actId = row.actId;
				console.log(row);
				sessionStorage.setItem("actId", actId);
				// sessionStorage.setItem("youbaoUserid", 1);
				window.location.href = 'youbaonew.html?status=2';
				// var id = row.id;
				// var pubUserid = row.pubUserid;
				// var mymessage = confirm("确定直接删除吗？");
				// if (mymessage == true) {
				//     $.ajax({
				//         url: url + "updateDisk",
				//         type: "post",
				//         dataType: "json",
				//         data: {
				//             goodsId: id,
				//             pubUserid: pubUserid,
				//             updateType: 2
				//         },
				//         success: function (data) {
				//             if (data.code == 10000) {
				//                 $('#ArbetTableAList').bootstrapTable('refresh');
				//                 alert("删除成功！")
				//             }
				//         }
				//     })
				// }
			},
			//二维码
			"click #btn-code": function(e, value, row, index) {
				// var id = row.id;
				// var pubUserid = row.pubUserid;
				// var mymessage = confirm("确定直接删除吗？");
				// if (mymessage == true) {
				//     $.ajax({
				//         url: url + "updateDisk",
				//         type: "post",
				//         dataType: "json",
				//         data: {
				//             goodsId: id,
				//             pubUserid: pubUserid,
				//             updateType: 2
				//         },
				//         success: function (data) {
				//             if (data.code == 10000) {
				//                 $('#ArbetTableAList').bootstrapTable('refresh');
				//                 alert("删除成功！")
				//             }
				//         }
				//     })
				// }
			},
		}
		// 	var Base64 = {
		// 	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		// 	encode: function(e) {
		// 		var t = "";
		// 		var n, r, i, s, o, u, a;
		// 		var f = 0;
		// 		e = Base64._utf8_encode(e);
		// 		while (f < e.length) {
		// 			n = e.charCodeAt(f++);
		// 			r = e.charCodeAt(f++);
		// 			i = e.charCodeAt(f++);
		// 			s = n >> 2;
		// 			o = (n & 3) << 4 | r >> 4;
		// 			u = (r & 15) << 2 | i >> 6;
		// 			a = i & 63;
		// 			if (isNaN(r)) {
		// 				u = a = 64
		// 			} else if (isNaN(i)) {
		// 				a = 64
		// 			}
		// 			t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
		// 		}
		// 		return t
		// 	},
		// 	decode: function(e) {
		// 		var t = "";
		// 		var n, r, i;
		// 		var s, o, u, a;
		// 		var f = 0;
		// 		e = e.replace(/[^A-Za-z0-9+/=]/g, "");
		// 		while (f < e.length) {
		// 			s = this._keyStr.indexOf(e.charAt(f++));
		// 			o = this._keyStr.indexOf(e.charAt(f++));
		// 			u = this._keyStr.indexOf(e.charAt(f++));
		// 			a = this._keyStr.indexOf(e.charAt(f++));
		// 			n = s << 2 | o >> 4;
		// 			r = (o & 15) << 4 | u >> 2;
		// 			i = (u & 3) << 6 | a;
		// 			t = t + String.fromCharCode(n);
		// 			if (u != 64) {
		// 				t = t + String.fromCharCode(r)
		// 			}
		// 			if (a != 64) {
		// 				t = t + String.fromCharCode(i)
		// 			}
		// 		}
		// 		t = Base64._utf8_decode(t);
		// 		return t
		// 	},
		// 	_utf8_encode: function(e) {
		// 		e = e.replace(/rn/g, "n");
		// 		var t = "";
		// 		for (var n = 0; n < e.length; n++) {
		// 			var r = e.charCodeAt(n);
		// 			if (r < 128) {
		// 				t += String.fromCharCode(r)
		// 			} else if (r > 127 && r < 2048) {
		// 				t += String.fromCharCode(r >> 6 | 192);
		// 				t += String.fromCharCode(r & 63 | 128)
		// 			} else {
		// 				t += String.fromCharCode(r >> 12 | 224);
		// 				t += String.fromCharCode(r >> 6 & 63 | 128);
		// 				t += String.fromCharCode(r & 63 | 128)
		// 			}
		// 		}
		// 		return t
		// 	},
		// 	_utf8_decode: function(e) {
		// 		var t = "";
		// 		var n = 0;
		// 		var r = c1 = c2 = 0;
		// 		while (n < e.length) {
		// 			r = e.charCodeAt(n);
		// 			if (r < 128) {
		// 				t += String.fromCharCode(r);
		// 				n++
		// 			} else if (r > 191 && r < 224) {
		// 				c2 = e.charCodeAt(n + 1);
		// 				t += String.fromCharCode((r & 31) << 6 | c2 & 63);
		// 				n += 2
		// 			} else {
		// 				c2 = e.charCodeAt(n + 1);
		// 				c3 = e.charCodeAt(n + 2);
		// 				t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
		// 				n += 3
		// 			}
		// 		}
		// 		return t
		// 	}
		// };



		$("#addTian").click(() => {
			//login的图片
			console.log($("#test-image-preview").find("img").attr("src"));
			//背景的图片
			// console.log($("#test-image-preview-beijing").find("img").attr("src"));
			if ($("#name").val() == "" || $("#name").val() == undefined || $("#name").val() == null) {
				alert("活动名称不得为空")
				return;
			} else if ($("#content").val() == "" || $("#content").val() == undefined || $("#content").val() == null) {
				alert("活动标题不得为空")
				return;
			} else if ($("#test1").val() == "" || $("#test1").val() == undefined || $("#test1").val() == null) {
				alert("活动日期不得为空")
				return;
			}
			let tijian = `${$("#test1").val()} 00:00:00`; //时间
			let data = {
				name: $("#name").val(),
				content: $("#content").val(),
				channelType: "JIYOUZHE",
				channelTypeName: "集邮者",
				timeStr: tijian,
				bussinessLog: $("#test-image-preview").find("img").attr("src"),
				coverImg: $("#test-image-preview-beijing").find("img").attr("src"), // 封面
				qrCode: "https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=83799442,632438677&fm=85&s=CC722CC443F38BD444E9B8160300B0C3", // 二维码
				channelId: USerId, // 登录时候返回的id
				// name:$("#name").val(),
			};
			$('#ArbetTable').bootstrapTable('refreshOptions', {
				// url: 'http://192.168.1.181:8080/yb_controller/User/findByPage',         //请求后台的URL（*）
				// url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
				url: url + 'getChannelActList',
				queryParams: oTableInit.queryParams,
				pageNumber: 1
			});
			$.ajax({
				type: "post",
				url: url + "saveChannelAct",
				data: data,
				// url:"http://192.168.1.181:8080/YbSys/User/select",
				dataType: 'json',
				success: function(data) {
					console.log(data);
					//刷新一下table

				}
			});

			console.log(data);
		})
		//点击跳转新增页面
		$("#addFun").click(() => {
			//删除两个字段 供编辑方便
			sessionStorage.removeItem("actId");
			window.location.href = 'youbaonew.html?status=1';
		})
		//搜索按钮
		$("#eachFu").click(() => {
			let text = $("#text_ID").val();
			if (text == "" || text == null || text == undefined) {
				model.set("itemValue", "");
			} else {
				model.set("itemValue", text);
			}
			$('#ArbetTable').bootstrapTable('refreshOptions', {
				// url: 'http://192.168.1.181:8080/yb_controller/User/findByPage',         //请求后台的URL（*）
				// url: 'http://116.196.69.82:7090/YbSys/User/findByPage',         //请求后台的URL（*）
				url: url + 'getChannelActList',
				queryParams: oTableInit.queryParams,
				pageNumber: 1
			});

		});
		$(".btn").on("click", function() {
			if ($("#test1").val() == "") {
				$("#test1").val("2018-03-01")
			}
			if ($("#test2").val() == "") {
				var ymds = new Date().format("yyyy-MM-dd");
				$("#test2").val(ymds)
			}
			$('#ArbetTable').bootstrapTable('refreshOptions', {
				url: 'http://116.196.69.82:7090/YbSys/User/findByPage', //请求后台的URL（*）
				queryParams: oTableInit.queryParams,
				pageNumber: 1
			});
			// }
		});
		$("#NewAdd").click(() => {
			window.location = "live_streamNew.html";
		})




		//得到查询的参数
		oTableInit.queryParams = function(params) {
			var temp = {
				cname: model.get("itemValue"), //搜索的名字
				channelId: USerId
			};

			return temp;
		};
		return oTableInit;
	};
})
