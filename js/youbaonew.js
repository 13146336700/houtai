var qrcode = sessionStorage.getItem("qrcode");
var userNames = sessionStorage.getItem("userNames");
var USerId = sessionStorage.getItem("userId");

var url = "http://39.97.176.41:8080/YBSys/ybws/user/json/"; //线上的
// var url = "http://192.168.1.182:8090/YBSys/ybws/user/json/"; //朱哥本机的

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
	var imgpash = [];
	var imgpashBeijing = [];
	let channelType = "";
	let channelTypeName = "";
	let channelId = "";
	
	function getUrlParam(name) {

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象

        var r = window.location.search.substr(1).match(reg);  //匹配目标参数

        if (r != null) return unescape(r[2]);

        return null; //返回参数值

    };

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
	// 获取下拉框的数据  新增页面里面的
	$.ajax({
        type:"post",
        url:url+"getChannelInfor",
        // url:"http://192.168.1.181:8080/YbSys/User/select",
        dataType: 'json',
        success:function(data){
			console.log(data);
			if(data.code == "10000"){
				// let myData = data.resultList;
				// if(Array.isArray(myData) && myData.length){
				// 	let Nokongzhi = myData.filter((item)=>{ //不要name字段为空的
				// 		return item.name !== "";
				// 	})
				// 	addOptions(Nokongzhi);
				// }
				 for (var i = 0; i < data.resultList.length; i++) {
				    // $("#myselect").append("<option disabled=disabled  data-id="+data.resultList[i].id+" value=" + data.resultList[i].type+">" + data.resultList[i].name +"</option>");   
					$("#myselect").append("<option  data-id="+data.resultList[i].id+" value=" + data.resultList[i].type+">" + data.resultList[i].name +"</option>");
				    form.render('select');
				}
			}
			
		}
    });
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
	
	
	
	
	
	
	
	
	// ---------------------------------------------------------------------------------------------
	//初级版本
	// let imgArr = [];
	//  var preview = document.querySelector('#test-image-preview');
 //            var eleFile = document.querySelector('#test-image-file');//商家logo
 //            var eleFileBeing = document.querySelector('#test-image-file-beijing');//活动背景图
 //            eleFile.addEventListener('change', function() {
 //                var file = this.files[0];                
 //                // 确认选择的文件是图片                
 //                // if(file.type.indexOf("image") == 0) {
 //                    var reader = new FileReader();
 //                    reader.readAsDataURL(file);                    
	// 			console.log(reader);
 //                    reader.onload = function(e) {
 //                        // 图片base64化
 //                        var newUrl = this.result;
	// 					imgArr.push({
	// 						img:newUrl
	// 					});
	// 					// addimg(imgArr);
	// 					addimg("#test-image-preview",imgArr);
 //                        // preview.style.backgroundImage = 'url(' + newUrl + ')';
 //                    };
 //                // }
 //            });
	// 		//背景图片
	// 		eleFileBeing.addEventListener('change', function() {
	// 				var file = this.files[0];                
	// 				// 确认选择的文件是图片                
	// 				// if(file.type.indexOf("image") == 0) {
	// 					var reader = new FileReader();
	// 					reader.readAsDataURL(file);                    
	// 					reader.onload = function(e) {
	// 						// 图片base64化
	// 						var newUrl = this.result;
	// 						imgArr.push({
	// 							img:newUrl
	// 						});
	// 						// addimg(imgArr);
	// 						addimg("#test-image-preview-beijing",imgArr);
	// 						// preview.style.backgroundImage = 'url(' + newUrl + ')';
	// 					};
	// 				// }
	// 			});
	// 
	// function verificationPicFile(file) {
	//     var filePath = file.value;
	//     if(filePath){
	//         //读取图片数据
	//         var filePic = file.files[0];
	//         var reader = new FileReader();
	//         reader.onload = function (e) {
	//             var data = e.target.result;
	//             //加载图片获取图片真实宽度和高度
	//             var image = new Image();
	//             image.onload=function(){
	//                 var width = image.width;
	//                 var height = image.height;
	// 				console.log(width);
	// 				console.log(height);
	//                 if (width == 720 | height == 1280){
	//                     alert("文件尺寸符合！");
	//                 }else {
	//                     alert("文件尺寸应为：720*1280！");
	//                     file.value = "";
	//                     return false;
	//                 }
	//             };
	//             image.src= data;
	//         };
	//         reader.readAsDataURL(filePic);
	//     }else{
	//         return false;
	//     }
	// }
	var ACtId = "";
	if (sessionStorage.getItem("actId")) {
	    var actId = sessionStorage.getItem("actId");
		console.log("我是编辑进来的呢");
		$("#addTian").text("确认");
		$("#ChangeName").text("编辑");
		
		$("#formNameS").hide();
		$("#mingziS").show();
		ACtId = sessionStorage.getItem("actId");
	    $.ajax({
	        url: url + "getActivityInfor",
	        data: {
	            actId: actId
	        },
	        dataType: "json",
	        type: "post",
	        success: function (data) {
				let Mydata = data.resultObject;
				$("#name").val(Mydata.name);
				$("#content").val(Mydata.content);
				// console.log(Mydata.createTime.slice(0,11));
				$("#share_title").val(Mydata.shareTitle);
				$("#test1").val(Mydata.createTime.slice(0,10));
				imgpash.push(Mydata.bussinessLog);
				imgpashBeijing.push(Mydata.coverImg);
				$("#mingziS").val(Mydata.actTypeName);
				channelType = Mydata.actType;
				channelTypeName = Mydata.actTypeName;
				channelId = Mydata.channelId;
				
				  setTimeout(function () {
					  // $("#myselect").val(Mydata.actTypeName);
					  // $("#myselect option:selected").text(Mydata.actTypeName);
				    // $("#danwei option:selected").html(unitName);
				    // $("#danwei option:selected").val(unitCode);
				    // $("#type option:selected").html(categoryName);
				    // $("#type option:selected").val(categoryCode);
				    // $("#pinxiang option:selected").html(conditionName);
				    // $("#pinxiang option:selected").val(conditionCode);
				    // $("#searchType option:selected").html(dealWayName);
				    // $("#searchType option:selected").val(dealWay);
						$("#myselect").val(Mydata.actType);
						$("#myselect option:selected").text(Mydata.actTypeName);
						// form.render('select');
				}, 300)
				
			
	            // var desc = data.resultObject.desc;
	    //         for (let i = 0; i < imgpash.length; i++) {
					// console.log(imgpash[i])
	    //             var img = '<div class="imgb">' + '<img class="image" />' + '</div>';
	    //             $(".imgs").append(img);
	    //             $(".image").eq(i).attr("src", imgpash[i]);
					// $(".image").attr("src", Mydata.bussinessLog);
					// 
	    //         }
			//log
					for (let i = 0; i < imgpash.length; i++) {
						var img = '<div class="imgb">' +
							'<div class="drop-left">' + '</div>' +
							'<img class="image" draggable="true" />' +
							'<div class="drop-right">' +
							'</div>' + '</div>';
						$("#test-image-preview").append(img);
						$(".image").eq(i).attr("src", imgpash[i]);
					};
					
			//Beijing 
					for (let j = 0; j < imgpashBeijing.length; j++) {
						var img = '<div class="imgb">' +
							'<div class="drop-left">' + '</div>' +
							'<img class="imageBei" draggable="true" />' +
							'<div class="drop-right">' +
							'</div>' + '</div>';
						$("#test-image-preview-beijing").append(img);
						$(".imageBei").eq(j).attr("src", imgpashBeijing[j]);
					};
					// for (let i = 0; i < imgpashBeijing.length; i++) {
					// 	var img = '<div class="imgb">' +
					// 		'<div class="drop-left">' + '</div>' +
					// 		'<img class="image" draggable="true" />' +
					// 		'<div class="drop-right">' +
					// 		'</div>' + '</div>';
					// 	$("#test-image-preview").append(img);
					// 	$(".image").eq(i).attr("src", imgpashBeijing[i]);
					// };
	            // for (let i = 0; i < imgpashs.length; i++) {
	            //     var img = '<div class="imgbs">' + '<img class="images" />' + '</div>';
	            //     $(".imgss").append(img);
	            //     $(".images").eq(i).attr("src", imgpashs[i]);
	            // }
	        }
	    });
	}else{
		$("#ChangeName").text("新增活动");
		$("#addTian").text("确认添加");
		$("#mingziS").hide();
		// channelType = "";
		// channelTypeName = "";
		// channelId = "";
	}
	
	if(getUrlParam("status") == 2){
		$("#addTian").text("确认");
		$("#ChangeName").text("编辑");
		$("#formNameS").hide();
		$("#mingziS").show();
	}else if(getUrlParam("status") == 1){
		$("#ChangeName").text("新增活动");
		$("#addTian").text("确认添加");
		$("#mingziS").hide();
	}
	
	
	
	//改造版本
	
	
	$('#updata').on("change", function () {
		if(imgpash.length == 0){
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
					if (width == 58 || height == 58){
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
						                    success: function (res) {
						                        window.location = window.location;
						                    }
						                });
						            }
						        };
						        var subscription = observable.subscribe(observer) // 上传开始
						    }
						});
					}else {
					    alert("图片应该尺寸：58*58");
					    // file.value = "";
						$('#updata')[0].value = "";
					    return;
					}
					
				};
			}
			reader.readAsDataURL(file);
			
		}else{
			alert("最多一次上传一张，请删除重试");
			$('#updata')[0].value = "";
			 return;
		}
		
	});
	
	//背景的
	// var imgpashBeijing = [];
	
	$('#test-image-file-beijing').on("change", function () {
		if(imgpashBeijing.length == 0){
			   var file = $('#test-image-file-beijing')[0].files[0];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			console.log(reader);
			var myReg = /^[\u4e00-\u9fa5]+$/;
			var this_content = $('#test-image-file-beijing')[0].files[0].name.split(".")[0];
			for (var i = 0; i < this_content.length; i++) {
			    if (myReg.test(this_content[i])) {
			        alert("不能含有中文");
			        return
			    }
			}
			afile = $('#test-image-file-beijing')[0].files[0];
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
			                imgpashBeijing.push('http://image.ybk008.com/' + res.key);
			                $("#test-image-preview-beijing").html("")
			                for (let i = 0; i < imgpashBeijing.length; i++) {
			                    var img = '<div class="imgb">' +
			                        '<div class="drop-left">' + '</div>' +
			                        '<img class="imageBei" draggable="true" />' +
			                        '<div class="drop-right">' +
			                        '</div>' + '</div>';
			                    $("#test-image-preview-beijing").append(img);
			                    $(".imageBei").eq(i).attr("src", imgpashBeijing[i]);
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
			                    success: function (res) {
			                        window.location = window.location;
			                    }
			                });
			            }
			        };
			        var subscription = observable.subscribe(observer) // 上传开始
			    }
			});
		}else{
			alert("最多一次上传一张，请删除重试");
			$('#test-image-file-beijing')[0].value = "";
			 return;
		}
	});
	console.log(Array.prototype);
	Array.prototype.indexOf = function (val) {
	    for (var i = 0; i < this.length; i++) {
	        if (this[i] == val) return i;
	    }
	    return -1;
	};
	Array.prototype.remove = function (val) {
		console.log(val);
		console.log(this);
	    var index = this.indexOf(val);
	    if (index > -1) {
	        this.splice(index, 1);
	    }
	};
	console.log(Array.prototype);
	$("#test-image-preview").on('click', '.image', function () {
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
	$("#test-image-preview-beijing").on('click', '.imageBei', function () {
	    var message = confirm("确定删除该图片吗?");
	    if (message == true) {
	        $(this).remove();
	        imgpashBeijing.remove(this.currentSrc);
	        $(".imgs").html("");
	        for (let i = 0; i < imgpashBeijing.length; i++) {
	            var img = '<div id="test-image-preview">' +
	                '<div class="drop-left">' + '</div>' + '<img class="imageBei" draggable="true" />' +
	                '<div class="drop-right">' + '</div>' +
	                '</div>';
	            $(".imgs").append(img);
	            $(".imageBei").eq(i).attr("src", imgpashBeijing[i]);
	        };
	    };
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
	function addimg(ID,project) {
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
            '<c-button  id="btn-del" class="btn btnchang btn-default">下载活动二维码</c-button>',
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



		$("#addTian").click(()=>{
			channelType = "";
			channelTypeName = "";
			channelId = "";
				let tijian = `${$("#test1").val()} 00:00:00`;//时间
			//login的图片
			//背景的图片
			// console.log($("#test-image-preview-beijing").find("img").attr("src"));
			if($("#name").val() == "" || $("#name").val() == undefined || $("#name").val() == null){
				alert("活动名称不得为空")
				return;
			}else if($("#content").val() == "" || $("#content").val() == undefined || $("#content").val() == null){
				alert("活动标题不得为空")
				return;
			}else if($("#test1").val() == "" || $("#test1").val() == undefined || $("#test1").val() == null){
				alert("活动日期不得为空")
				return;
			}else if($("#share_title").val() == "" || $("#share_title").val() == undefined || $("#share_title").val() == null){
				alert("分享链接标题不得为空");
				return;
			}else if(imgpash.length == 0){
				alert("商家logo不得为空")
				return;
			}else if(imgpashBeijing.length == 0){
				alert("活动背景图不得为空")
				return;
			}
		
			if($("#name").val().length>7){
				alert("最多7个字")
				return;
			}
			// channelType = Mydata.channelType;
			// channelTypeName = Mydata.channelTypeName;
			// channelId = Mydata.channelId;	
			if(channelType == ""){
				channelType = $("#myselect").val();
			}
			 if(channelTypeName == ""){
				channelTypeName = $("#myselect option:selected").text();
			}
			if(channelId == ""){
				channelId = $("#myselect").find("option:selected").attr("data-id") 
			}
			 $.ajax({
			    type:"post",
			    url:url+"saveChannelAct",
				 data: {
					 	name:$("#name").val(),
					 	content:$("#content").val(),
					 	channelType:channelType,
					 	channelTypeName:channelTypeName,
					 	timeStr:tijian,
					 	bussinessLog:imgpash.join(","),
					 	coverImg:imgpashBeijing.join(","),// 封面 imgpashBeijing
					 	qrCode:"",// 二维码
					 	channelId:channelId,// 登录时候返回的id
						actId:ACtId,
						shareTitle:$("#share_title").val()
					 	// name:$("#name").val(),
					 },
			    // url:"http://192.168.1.181:8080/YbSys/User/select",
			    dataType: 'json',
			    success:function(data){
					console.log(data);
					//刷新一下table
					if(data.code == "10000"){
						 window.location.href = 'youbao.html';
					}
				}
			});
			
			// console.log(data);
		})
	//点击跳转新增页面
	$("#addFun").click(()=>{
		  window.location.href = 'youbaonew.html';
	})
	//搜索按钮
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