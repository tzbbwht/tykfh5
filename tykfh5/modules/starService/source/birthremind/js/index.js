$(function(){
    var userInfo = $.parseJSON($.util.getParameter("ReqParam"));
    console.log(userInfo);
    var str = navigator.userAgent.toLowerCase(),
        ver = str.match(/cpu iphone os (.*?) like mac os/),
        ip = location.protocol + "//" + location.host + "/",
        starval, growval;

    var html = document.documentElement,
        hWidth = html.getBoundingClientRect().width;
    html.style.fontSize = hWidth / 24 + 'px';

    //广西用户 1-4星级 399M   5-7 999M
        if ( userInfo.userLevel >= '11' && userInfo.userLevel <= '14' ) {
            $(".traffic").html("399M");
       }else if( userInfo.userLevel >= '15' && userInfo.userLevel <= '17' ){
            $(".traffic").html("999M");
       }
        $(".queryBtn").click(function(){
            if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
               location.href = '../../../businessHandling/queryFlow/index.html?ReqParam=' + JSON.stringify(userInfo);
            } else {
               HGPlugins.openTitleWebView( ip + 'tykfh5/modules/businessHandling/queryFlow/index.html?ReqParam=' + encodeURIComponent(JSON.stringify(userInfo)), '星级服务', 'happygo');
            }
        });
    });