function keyLogin(){
  if (event.keyCode==13)  //回车键的键值为13
    login()
}
function login() {
	if($("#userName").val() && $("#passWord").val()) {
		$.ajax({
			type: "post",
            // url: "http://api.youbao360.com:8080/YBApp/ybws/market/json/channelUserLogin",
			url: "http://116.196.69.82:4080/YBSys/ybws/user/json/channelUserLogin",
			data: {
				userName: $("#userName").val(),
				upwd: $("#passWord").val()
			},
			dataType:"json",
			success: function(data) {
				debugger
				if(data.code == 10000) {
                    window.location.href = '../index.html';
                    sessionStorage.setItem("qrcode", data.resultObject.channelType);
					sessionStorage.setItem("userNames", data.resultObject.userName);
					sessionStorage.setItem("loginGoodsId", data.resultObject.pnum);
					sessionStorage.setItem("userId", data.resultObject.id);
				} else {
                    alert("用户名或密码错误");
				}
			}
		});
	} else {
		alert("请输入用户名或者密码")
	}
}
