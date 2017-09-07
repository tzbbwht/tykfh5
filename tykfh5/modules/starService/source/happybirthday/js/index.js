$(function () {
    var userInfo = $.parseJSON($.util.getParameter("ReqParam"));
    var isInteractive = $.util.getParameter("isInteractive");
    var jumpType = $.util.getParameter("jumpType");
    var jumpUrl = $.util.getParameter("jumpUrl");
    var activityId = $.util.getParameter("activityId");

    var str = navigator.userAgent.toLowerCase(),
        ver = str.match(/cpu iphone os (.*?) like mac os/),
        ip = location.protocol + "//" + location.host + "/",
        starval, growval;

    var html = document.documentElement,
        hWidth = html.getBoundingClientRect().width;
    html.style.fontSize = hWidth / 24 + 'px';

    //isInteractive 0否  1交互
    if (isInteractive == 1) {
        $(".detailsBtn").show();
        cBtn();
        $(".detailsBtn").click(function () {
            //入库
            $.util.postJump('122', '', '', '生日详情页');
            var aUrl = jumpUrl.indexOf("?") > -1 ? jumpUrl : jumpUrl + "?";
            //jumpType跳转类型  0 跳“广西”h5页面    1 且是 5-7星级 跳转"重庆"
            if ( jumpType == '0' && userInfo.province == '湖南') {
                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                    location.href = aUrl +'&ReqParam=' + JSON.stringify(userInfo);
                } else {
                  HGPlugins.openTitleWebView( aUrl + '&ReqParam=' + encodeURIComponent(JSON.stringify(userInfo)), '星级服务', 'happygo');
                }
                // location.href = "../../source/birthremind/index.html?&ReqParam=" +JSON.stringify(userInfo);
            } else if ( jumpType == '1' && userInfo.province == '重庆' && userInfo.userLevel >= '15' && userInfo.userLevel <= '17') {
                   if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                        location.href =  aUrl + "&activityId=" + activityId + "&token=" +
                        userInfo.token + "&channel=" + userInfo.channel + "&userLevel=" + userInfo.userLevel
                        + "&deviceType=2000004&loginSrc=0";
                    } else {
                        HGPlugins.openTitleWebView( aUrl + "&activityId=" + activityId + "&token=" +
                        userInfo.token + "&channel=" + userInfo.channel + "&userLevel=" + userInfo.userLevel
                          + "&deviceType=2000004&loginSrc=0", '星级服务', 'happygo');
                   }
            }
        });
      }else {
        setTimeout(function () {
            var close = parent.window.document.getElementById('iframedh');
            $(close).hide();
        }, 16000);
        // $(".guanbi").attr("display","none");
    }
    // document.addEventListener('touchmove', function(e) {
    //     e.preventDefault();
    // }, false);

    function cBtn(){
        var close = parent.window.document.getElementById('iframedh');
        setTimeout(function () {
            $(".guanbi").fadeIn(200);
        },13000);

        $(".guanbi").click(function () {
            $(close).fadeOut(200);
        });
    }
  });


