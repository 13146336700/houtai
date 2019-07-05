//
// <div class="left">
//     <p onclick="down()" class="down">PNMI邮宝指数<img class="icons" src="../images/sj.png" alt="向下箭头" /></p>
//     <p onclick="dapan()" class="yb dpzs">PNMI邮票大盘指数</p>
//     <p onclick="danpin()" class="yb dpzs1">热门邮票单品指数</p>
//
//     <p onclick="qianbi()" class="yb qbzs">PNMI钱币大盘指数</p>
//     <p onclick="qbdp()" class="yb qbdp">热门钱币单品指数</p>
//     <p onclick="jyb()" class="qb qbdp">金银币</p>
//     <p onclick="zbc()" class="qb qbdp">纸币钞</p>
//     <p onclick="fenlei()" class="yb flzs">热门分类指数</p>
//     <div onclick="userlist()" class="userList yhlb">用户列表</div>
// </div>




var menus = '<div class="left">' + '<p onclick="down()" class="down">PNMI邮票指数<img class="icons" src="images/sj.png" alt="向下箭头" />' + '</p>' + '<p onclick="dapan()" class="yb dpzs">PNMI邮票大盘指数</p>' + '<p onclick="danpin()" class="yb dpzs1">热门邮票单品指数</p>' + '<p onclick="fenlei()" style=" letter-spacing: 1px !important;padding-left: 35px !important;" class="yb flzs">热门分类指数</p>' + '<p onclick="downqb()" class="down">PNMI钱币指数<img class="iconsqb" style="width: 15px;height: 15px;" src="images/sj.png" alt="向下箭头" />' + '</p>' + '<p onclick="zbc()" style=" letter-spacing: 1px !important;padding-left: 35px !important;" class="qb zbc">纸币钞指数</p>' + '<p style=" letter-spacing: 1px !important;padding-left: 35px !important;" onclick="jyb()" class="qb jyb">金银纪念币指数</p>' + '<p onclick="qbdp()" style=" letter-spacing: 1px !important;padding-left: 35px !important;" class="qb qbdp">热门钱币单品指数</p>' + '<div onclick="userlist()" class="userList yhlb">用户列表</div>' +'<div onclick="pubList()" class="pubList ">特邀商家商品发布</div>'+'<div onclick="youbaoList()" class="youbaoList qb">活动初始化</div>'+'<div onclick="live_stream()" class="live_stream qb">直播管理</div>'+'</div>';
$(".center").prepend(menus);

function dapan() {
    window.location.href = 'index.html';
}

function danpin() {
    window.location.href = 'html/danpin.html';
}

function fenlei() {
    window.location.href = 'html/fenlei.html';
}
function qianbi(){
    window.location.href = 'html/qianbi.html';
}

function userlist() {
    window.location.href = 'html/userstatement.html';
}
function qbdp() {
    window.location.href = 'html/qbdp.html';
}
function actiList() {
    window.location.href = 'html/activity.html';
}
function jyb() {
    window.location.href = 'html/jinyinbi.html';
}
function zbc() {
    window.location.href = 'html/zhibichao.html';
}
function pubList() {
    window.location.href = 'html/goodsList.html';
}
function youbaoList() {
    window.location.href = 'html/youbao.html';
}
function Personal_center() {
    window.location.href = 'html/Personal_center.html';
}
function live_stream() {
    window.location.href = 'html/live_stream.html';
}
if(sessionStorage.getItem("userNames") == null) {
    window.location.href = "html/login.html"
}

function down() {
    if($(".yb").css("display") == "block") {
        $(".yb").hide();
        $(".icons").css("transform", "rotate(-90deg)")
    } else {
        $(".yb").show();
        $(".icons").css("transform", "rotate(0deg)")
    }
}
function downqb() {
    if($(".qb").css("display") == "block") {
        $(".qb").hide();
        $(".iconsqb").css("transform", "rotate(-90deg)")
    } else {
        $(".qb").show();
        $(".iconsqb").css("transform", "rotate(0deg)")
    }
}

function closes() {
    window.location.href = 'html/login.html';
}

function userName() {
    if($(".seleName").css("display") == "none") {
        $(".seleName").show();
        $(".iconss").css("transform", "rotate(0deg)")
    } else {
        $(".seleName").hide();
        $(".iconss").css("transform", "rotate(-90deg)")
    }
}