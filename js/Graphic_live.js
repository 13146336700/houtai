var qrcode = sessionStorage.getItem("qrcode");
var userNames = sessionStorage.getItem("userNames");
var USerId = sessionStorage.getItem("userId");
var MyUserId = null; //活动用户的id
var LotteryMyUserId = null; //摇奖的 活动用户的id
var nickName = null; //活动用户的昵称
var Urlws = null; //活动websocket
var LotteryUrlws = null; //摇奖的活动websocket
const log = console.log;
let url = null;
//线上 http://39.97.176.41
//线下 http://192.168.1.108
var huodongurlZhi = "http://39.97.176.41:8081/youbaoRoom/"; //直播间的 线上
const $WebSocketURLZhi = "39.97.176.41:20817/"; //直播间的 websocket 线上

const Shuaxin_url = "http://192.168.1.188:8090/YBSys/ybws/payment/json/";

var huodongurl = "http://39.97.176.41:8081/youbaoRoom3/"; //摇奖的 线上
const $WebSocketURL = "39.97.176.41:20819/"; //摇奖的 websocket 线上


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

	} else {

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


	$(function() {
		//刚进入页面调用的函数 登录的回去userId
		Just_entered();
		//获取历史记录
		//摇奖的
		// Lottery_Just_entered();
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
			$(this).attr("href", `Graphic_live.html?status=${getQueryString('status')}`);
		} else if ($(this).index() == 1) {
			$(this).attr("href", `Data_statistics.html?status=${getQueryString('status')}&num=2`);
		}
	})

	function Just_entered() {
		const log = console.log;
		$.ajax({
			type: "post",
			url: huodongurlZhi + "logins",
			data: {
				userName: "",
				roomid: 1
			},
			// url:"http://192.168.1.181:8080/YbSys/User/select",
			dataType: 'json',
			success: function(response) {
				log(response);
				if (response.result == "success") { //成功
					let myData = response;
					MyUserId = myData.user.userId;
					getMessageRecordBetweenUserAndGroup();

					nickName = myData.user.userNickName;
					websocket(myData.user.userId);
				} else {
					alert("连接服务器异常")
				}
				// MyUserId = 

			}
		})
	};




	function websocket(userId) {
		console.log(userId);
		const _this = this;
		Urlws = new WebSocket("ws://" + $WebSocketURLZhi + userId);
		console.log(Urlws.OPEN); //值为1，表示连接成功，可以通信了

		// 		setTimeout(() => {
		// 			if (Urlws.OPEN == 1) {
		// 				ajaxGetGroupById();
		// 
		// 			} else {
		// 				setTimeout(() => {
		// 					if (Urlws.OPEN == 1) {
		// 						ajaxGetGroupById();
		// 					}
		// 				}, 500)
		// 			}
		// 		}, 500)
		Urlws.addEventListener('open', function() {
			// socket.send(message)
			ajaxGetGroupById();
		});


		Urlws.onopen = () => {

			// Web Socket 已连接上，使用 send() 方法发送数据
			// var welcome = JSON.stringify({ //加入房间时的欢迎消息
			// 	nickname: nickName, //用户名
			// 	content: "", //消息内容
			// 	target: "room2", //推送到目标房间
			// 	flag: "chatroom"
			// }); //推送标识
			// this.Urlws.send(welcome);

			console.log('数据发送中...');
		}


		Urlws.onmessage = evt => {
			console.log('数据已接收...');
			// this.list.push(JSON.parse(evt.data));
			// if (!JSON.parse(evt.data).isSelf) {
			console.log("--------------我接受到数据")
			console.log(JSON.parse(evt.data));
			handleReceiveMessage(evt.data);
			// if(JSON.parse(evt.data).content != ""){
			// 	this.list.push({
			// 		content: JSON.parse(evt.data).content,
			// 		nickName: JSON.parse(evt.data).nickname,
			// 		people: 1
			// 	});
			// }
			// this.DOM_Bottom();
			// this.handleReceiveMessage(evt.data); ---------------------------------
			// }

			// _this.myData = arr;
			// _this.myData.push(JSON.parse(evt.data));
		}
	};
	let mygroup = null;

	function ajaxGetGroupById() {
		//获取用户列表的
		var group = null;
		var groups = {};
		groups.id = 1;
		$.ajax({
			type: "post",
			url: huodongurlZhi + "findGroupById",
			data: groups,
			dataType: 'json',
			success: function(response) {
				if (response.code === 0) {
					let Mydata = response.resoult;
					mygroup = Mydata;
					sendGroupMessagePre(Mydata);
				} else {
					alert("连接异常")
				}
			}
		});
	};

	function sendGroupMessagePre(group) {
		let id = 1;
		console.log(group);
		var textAreaId = id + 'messageTextGroup';
		var message = "";
		// if(message != ''){
		var toUsersIdString = new Array();
		toUsersIdString = (group.groupMembers).split(',');
		var toUsersId = new Array();
		for (var i = 0; i < toUsersIdString.length; i++) {
			// toUsersId[i] = parseInt(toUsersIdString[i]);
			toUsersId[i] = toUsersIdString[i];
		}
		// this.toUsersId = toUsersId;
		// console.log(this.content);
		sendMessage($("#concat").val(), toUsersId, 1);
		// this.content = "";
		$("#concat").val("");
	};

	function sendMessage(message, toUsersId, type) {
		//获取列表的
		// 	// Web Socket 已连接上，使用 send() 方法发送数据
		var welcome = JSON.stringify({ //加入房间时的欢迎消息
			from: MyUserId,
			to: toUsersId,
			content: message,
			type: type,
			time: getDateFull()
		}); //推送标识
		Urlws.send(welcome);
		console.log('数据发送中...');
	};
	//处理接收到的数据
	function handleReceiveMessage(message) {
		let messages = JSON.parse(message);
		//判断是否为上下线通知
		if (messages.type == 0 || messages.type == -1 || messages.type == 1) {
			showReceiveMessage(messages.content, messages.from, messages.to, messages.type, messages.time, message);
		}
	};

	function add0(m) {
		return m < 10 ? '0' + m : m
	};

	function format(shijianchuo) {
		//shijianchuo是整数，否则要parseInt转换
		var time = new Date(shijianchuo);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
	};
	//将消息显示在网页上
	function showReceiveMessage(content, from, to, type, time, message) {
		// console.log(content, from, to, type, time, message);
		// var times = time.split(' ');
		// var now = this.getDateFull();
		// var nows = now.split(' ');
		// var showTime = times[1];
		// if (nows[0] != times[0]) {
		// 	showTime = time;
		// };
		if (!content == "") {
			// this.myData.unshift({
			// 	// date: this.format(time.time),
			// 	date: (typeof time.time == "number") ? this.format(time.time) : time,
			// 	content: content
			// });
			let Timers = null;
			if (typeof time.time == "number") {
				Timers = format(time.time)
			} else {
				Timers = time;
			}
			var li = "<li><title>" + Timers + "</title><p>" + content + "</p>" + "<div class='changeBox'>" +
				'<span class="modificate">修改' + "</span><span class='delet'>删除</span></div></li>";
			$("#ul_todolist").prepend(li);
		}

		if (from == this.userId) {

		} else {

		}
	};

	//ajax获取单个用户与群组的聊天记录
	function getMessageRecordBetweenUserAndGroup() {
		var allMessages = null;
		var userGroup = {};
		userGroup.userId = MyUserId;
		userGroup.id = 1;
		$.ajax({
			type: "post",
			url: huodongurlZhi + "getMessageRecordBetweenUserAndGroup",
			data: userGroup,
			dataType: 'json',
			success: function(response) {
				if (response.code === 0) {
					let kozhi = response.resoult.filter((item) => {
						return item.content != "";
					})
					getJiLu(kozhi);
					// return response.data.resoult;
				} else {
					alert("连接异常");
				}
			}
		});
	};

	function getJiLu(allMessages) {
		//获取消息记录
		console.log(allMessages);
		for (var i = 0; i < allMessages.length; i++) {
			var usersId = new Array();
			usersId[0] = 1;
			usersId[1] = allMessages[i].to;
			var jsonMessage = JSON.stringify({
				from: allMessages[i].from,
				to: usersId,
				content: allMessages[i].content,
				type: allMessages[i].type,
				time: allMessages[i].time
			});
			showReceiveMessage(allMessages[i].content, allMessages[i].from, usersId, allMessages[i].type, allMessages[i].time,
				jsonMessage);
		}
	};



	// 摇奖的 ws  ---------------------------------------------------------------------------------------
	function Lottery_Just_entered() {
		const log = console.log;
		$.ajax({
			type: "post",
			url: huodongurl + "logins",
			data: {
				userName: "",
				roomid: 3
			},
			// url:"http://192.168.1.181:8080/YbSys/User/select",
			dataType: 'json',
			success: function(response) {
				log(response);
				if (response.result == "success") { //成功
					let myData = response;
					LotteryMyUserId = myData.user.userId;
					// nickName = myData.user.userNickName;
					Lotterywebsocket(myData.user.userId);
				} else {
					alert("连接服务器异常")
				}
				// MyUserId = 

			}
		})
	};




	function Lotterywebsocket(userId) {
		console.log(userId);
		const _this = this;
		LotteryUrlws = new WebSocket("ws://" + $WebSocketURL + userId);
		console.log(LotteryUrlws.OPEN); //值为1，表示连接成功，可以通信了

		// 		setTimeout(() => {
		// 			if (LotteryUrlws.OPEN == 1) {
		// 				LotteryajaxGetGroupById(1);
		// 
		// 			} else {
		// 				setTimeout(() => {
		// 					if (LotteryUrlws.OPEN == 1) {
		// 						LotteryajaxGetGroupById(1);
		// 					}
		// 				}, 500)
		// 			}
		// 		}, 500)
		LotteryUrlws.addEventListener('open', function() {
			// socket.send(message)
			LotteryajaxGetGroupById(1);
		});



		LotteryUrlws.onopen = () => {

			// Web Socket 已连接上，使用 send() 方法发送数据
			// var welcome = JSON.stringify({ //加入房间时的欢迎消息
			// 	nickname: nickName, //用户名
			// 	content: "", //消息内容
			// 	target: "room2", //推送到目标房间
			// 	flag: "chatroom"
			// }); //推送标识
			// this.Urlws.send(welcome);

			console.log('数据发送中...');
		}


		LotteryUrlws.onmessage = evt => {
			console.log('数据已接收...');
			// this.list.push(JSON.parse(evt.data));
			// if (!JSON.parse(evt.data).isSelf) {
			console.log("--------------我接受到数据")
			console.log(JSON.parse(evt.data));
			LotteryhandleReceiveMessage(evt.data);
			// if(JSON.parse(evt.data).content != ""){
			// 	this.list.push({
			// 		content: JSON.parse(evt.data).content,
			// 		nickName: JSON.parse(evt.data).nickname,
			// 		people: 1
			// 	});
			// }
			// this.DOM_Bottom();
			// this.handleReceiveMessage(evt.data); ---------------------------------
			// }

			// _this.myData = arr;
			// _this.myData.push(JSON.parse(evt.data));
		}
	};
	let Lotterymygroup = null;

	function LotteryajaxGetGroupById(num) {
		//获取用户列表的
		var group = null;
		var groups = {};
		groups.id = 3;
		$.ajax({
			type: "post",
			url: huodongurl + "findGroupById",
			data: groups,
			dataType: 'json',
			success: function(response) {
				if (response.code === 0) {
					let Mydata = response.resoult;
					Lotterymygroup = Mydata;
					if (num != 1) { //1 刚进入初始化的   2为点击开始抽奖按钮
						LotterysendGroupMessagePre(Mydata);
					}
				} else {
					alert("连接异常");
				}
			}
		});
	};

	function LotterysendGroupMessagePre(group) {
		let id = 1;
		console.log(group);
		var textAreaId = id + 'messageTextGroup';
		var message = "";
		// if(message != ''){
		var toUsersIdString = new Array();
		toUsersIdString = (group.groupMembers).split(',');
		var toUsersId = new Array();
		for (var i = 0; i < toUsersIdString.length; i++) {
			// toUsersId[i] = parseInt(toUsersIdString[i]);
			toUsersId[i] = toUsersIdString[i];
		}
		// this.toUsersId = toUsersId;
		// console.log(this.content);
		// LotterysendMessage("1", toUsersId, 6);
		LotterysendMessage($("#selector").val(), toUsersId, 6);
		// $("#concat").val("");
	};

	function LotterysendMessage(message, toUsersId, type) {
		//获取列表的
		// 	// Web Socket 已连接上，使用 send() 方法发送数据
		var welcome = JSON.stringify({ //加入房间时的欢迎消息
			from: LotteryMyUserId,
			to: toUsersId,
			content: message,
			type: type,
			time: getDateFull()
		}); //推送标识
		LotteryUrlws.send(welcome);
		console.log('数据发送中...');
	};
	//处理接收到的数据
	function LotteryhandleReceiveMessage(message) {
		console.log("进入------------------LotteryhandleReceiveMessage");
		let messages = JSON.parse(message);
		//判断是否为上下线通知
		if (messages.type == 0 || messages.type == -1 || messages.type == 1 || messages.type == 6) {
			LotteryshowReceiveMessage(messages.content, messages.from, messages.to, messages.type, messages.time, message);
		}
	};

	function add0(m) {
		return m < 10 ? '0' + m : m
	};

	function format(shijianchuo) {
		//shijianchuo是整数，否则要parseInt转换
		var time = new Date(shijianchuo);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
	};
	//将消息显示在网页上
	function LotteryshowReceiveMessage(content, from, to, type, time, message) {
		// console.log(content, from, to, type, time, message);
		// var times = time.split(' ');
		// var now = this.getDateFull();
		// var nows = now.split(' ');
		// var showTime = times[1];
		// if (nows[0] != times[0]) {
		// 	showTime = time;
		// };
		//摇奖码
		// if (content == "N") {
		// 	alert("该奖项已经抽完");
		// 	return;
		// }

		let mydata = content.split(",");
		// mydata[0] 摇奖码
		// mydata[1] 剩余名额
		// mydata[2] 此时几等奖
		// mydata[3]  直播间有多少人
		$("#prize_number").val(mydata[0]);
		$("#Quota").text(mydata[1]);

		//名额
		if (!content == "") {
			// this.myData.unshift({
			// 	// date: this.format(time.time),
			// 	date: (typeof time.time == "number") ? this.format(time.time) : time,
			// 	content: content
			// });
			// let Timers = null;
			// if(typeof time.time == "number"){
			// 	Timers = format(time.time)
			// }else{
			// 	Timers = time;
			// }
			//  var li = "<li><title>" + Timers + "</title><p>"+ content +"</p>" + "<div class='changeBox'>" + '<span class="modificate">修改' + "</span><span class='delet'>删除</span></div></li>";
			// $("#ul_todolist").append(li);
		}

		if (from == this.userId) {

		} else {

		}
	};
	//开始抽奖-------------------------------------------------------
	$(document).ready(function() {
		$(".awarding").click(() => {
			//抽奖为0的时候不让点击
			// if ($("#Quota").text() == 0) {
			// 	alert("该奖项已经抽完了");
			// } else {
			// 	LotteryajaxGetGroupById(2);
			// }
			setShuaxin();
			
		})
	});
	function setShuaxin(){
		$.ajax({
			url: Shuaxin_url + "updateDrawCode",
			type: "post",
			dataType: "json",
			data: {
				level: $("#selector").val(),
				ctype:"dr06070025"
			},
			success: function(data) {
				console.log(data);
				if(data.code === 10000){
					let jiang = null;
					if($("#selector").val() == 1){
						jiang = "一等奖";
					}else if($("#selector").val() == 2){
						jiang = "二等奖";
					}else if($("#selector").val() == 3){
						jiang = "三等奖";
					}else if($("#selector").val() == 4){
						jiang = "纪念奖";
					}
					
					alert(`已经开始抽奖${jiang}`)
				}
			}
		})
	};
	
	
	//切换的时候调取接口
	$("#selector").change(function() {
		// Just_enteredselector();
	});

	// Just_enteredselector();
	//刚进入页面调取一次接口
	function Just_enteredselector() {
		$.ajax({
			url: huodongurl + "luckydray/getLuckyCount",
			type: "post",
			dataType: "json",
			data: {
				appointCount: $("#selector").val()
			},
			success: function(data) {
				$("#Quota").html(data.msg.c);
			}
		})
	};




	function getDateFull() {
		var date = new Date();
		var currentdate = date.getFullYear() + "-" +
			appendZero(date.getMonth() + 1) + "-" +
			appendZero(date.getDate()) + " " +
			appendZero(date.getHours()) + ":" +
			appendZero(date.getMinutes()) + ":" +
			appendZero(date.getSeconds());
		return currentdate;
	};

	function appendZero(s) {
		return ("00" + s).substr((s + "").length);
	}; //补0函数
	$("#fasong").click(() => {
		if ($("#concat").val() == "") {
			alert("请输入内容")
			return;
		};
		ajaxGetGroupById(); // sendMessage 发送了一次
	});
	$("#concat").keyup(function(event) {
		if (event.keyCode == 13) {
			if ($("#concat").val() == "") {
				alert("请输入内容")
				return;
			};
			ajaxGetGroupById(); // sendMessage 发送了一次
		}
	});






	// 获取下拉框的数据  新增页面里面的
	// 	$.ajax({
	// 		type: "post",
	// 		url: url + "getChannelInfor",
	// 		// url:"http://192.168.1.181:8080/YbSys/User/select",
	// 		dataType: 'json',
	// 		success: function(data) {
	// 			console.log(data);
	// 			if (data.code == "10000") {
	// 				// let myData = data.resultList;
	// 				// if(Array.isArray(myData) && myData.length){
	// 				// 	let Nokongzhi = myData.filter((item)=>{ //不要name字段为空的
	// 				// 		return item.name !== "";
	// 				// 	})
	// 				// 	addOptions(Nokongzhi);
	// 				// }
	// 				for (var i = 0; i < data.resultList.length; i++) {
	// 					$("#myselect").append("<option value=" + data.resultList[i].type + ">" + data.resultList[i].name +
	// 						"</option>");
	// 					form.render('select');
	// 				}
	// 			}
	// 
	// 		}
	// 	});
	// let arr =[
	// 	{id:1,name:"参与用户",value:"Y"},
	// 	{id:2,name:"活动注册用户",value:"N"}
	// ];
	// setTimeout(()=>{
	// 	addOptions(arr);
	// },500)
	// var pro = $('#myselect');
	// var options = '';
	// arr.each(function() {
	// 	options += '<option value="' + this.value + '" >' + this.name + '</option>';
	// });

	// pro.append(options);




	//tab 切换的
	$('.ToDolist').click(function() {
		var i = $(this).index(); //下标第一种写法
		console.log(i);
		// $(this).addClass('active').siblings().removeClass('active');
		$('#tabHome #tab1').eq(i).show().siblings().hide();
	});

	// ---------------------------------------------------------------------------------------------
	let imgArr = [];
	var preview = document.querySelector('#test-image-preview');
	var eleFile = document.querySelector('#test-image-file'); //商家logo
	var eleFileBeing = document.querySelector('#test-image-file-beijing'); //活动背景图
	eleFile.addEventListener('change', function() {
		var file = this.files[0];
		// 确认选择的文件是图片                
		// if(file.type.indexOf("image") == 0) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		console.log(reader);
		reader.onload = function(e) {
			// 图片base64化
			var newUrl = this.result;
			imgArr.push({
				img: newUrl
			});
			// addimg(imgArr);
			addimg("#test-image-preview", imgArr);
			// preview.style.backgroundImage = 'url(' + newUrl + ')';
		};
		// }
	});
	//背景图片
	eleFileBeing.addEventListener('change', function() {
		var file = this.files[0];
		// 确认选择的文件是图片                
		// if(file.type.indexOf("image") == 0) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			// 图片base64化
			var newUrl = this.result;
			imgArr.push({
				img: newUrl
			});
			// addimg(imgArr);
			addimg("#test-image-preview-beijing", imgArr);
			// preview.style.backgroundImage = 'url(' + newUrl + ')';
		};
		// }
	});

















	// 　var fileInput = document.getElementById('test-image-file'),
	//       info = document.getElementById('test-file-info'),
	//       preview = document.getElementById('test-image-preview');
	// 监听change事件:
	//    fileInput.addEventListener('change', function() {
	//    　　// 清除背景图片:
	//       preview.style.backgroundImage = '';
	//       // 检查文件是否选择:
	//       if(!fileInput.value) {
	//            info.innerHTML = '没有选择文件';
	//                return;
	//       }                    
	//       // 获取File引用:
	//       var file = fileInput.files[0];
	//       //判断文件大小
	//       var size = file.size;
	//       if(size >= 1*1024*1024){
	//             alert('文件大于1兆不行!');
	//             return false;
	//       }
	//       // 获取File信息:
	// var fr = new FileReader();
	// fr.onload = function() {
	// console.log(fr);
	//  
	// }
	// 
	// console.log(file);
	//       info.innerHTML = '文件: ' + file.name + '<br>' +
	//                        '大小: ' + file.size + '<br>' +
	//                        '修改: ' + file.lastModifiedDate;
	//       if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
	//           alert('不是有效的图片文件!');
	//           return;
	//                 
	//       // 读取文件:
	//       var reader = new FileReader();
	//             reader.onload = function(e) {
	//             　　var
	//                  　　data = e.target.result; // 'data:image/jpeg;base64,/9j/4AAQSk...(base64编码)...}'            
	// 	 console.log(data);
	//                  　　preview.style.backgroundImage = 'url(' + data + ')';
	//            };
	//             // 以DataURL的形式读取文件:
	//             reader.readAsDataURL(file);
	//             console.log(file);
	//        };
	//  })
	// ---------------------------------------------------------------------------------------------
	// 	function addOptions(project) {
	// 
	// 	var pro = $('#myselect');
	// 
	// 	var options = '';
	// 	$(project).each(function() {
	// 		options += '<option value="' + this.type + '" >' + this.name + '</option>';
	// 	});
	// 
	// 	pro.append(options);
	// }
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
