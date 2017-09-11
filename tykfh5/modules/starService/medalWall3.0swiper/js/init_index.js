$(document).ready(function() {
    //	使用rem:针对宽度为640px的设计稿换算，1rem = 20px;
    var html = document.documentElement,
        hWidth = html.getBoundingClientRect().width;
    html.style.fontSize = hWidth / 16 + 'px';
    var encodingRedirectUrlForClientUni = function(redirectUrl, jsonp) {
        var l = window.location;
        var _p = l.protocol + '//' + l.host + "" + l.pathname.replace(/^(\/[^\/]+).*/, "$1/") + "services/dispatch.jsp?" + (jsonp === true ? 'wrapJsonP=true&callback=?' : '') + '&dispatchUrl=ClientUni' + encodeURIComponent(redirectUrl);
        return _p;
    };
    var userInfo = $.parseJSON($.util.getParameter("ReqParam"));
    if(userInfo == null) {
        alert("ReqParam参数错误!");
        return;
    }
    //省公司需要这些参数：设备类型 mobileType： 0000000 客户类型0000001 客户卡1000000 帐户类型2000001 固话（产品类型）2000002 宽带（产品类型）2000003 小灵通（产品类型）2000004 手机（产品类型）2000005 网厅注册帐号2000006 公话  登陆来源 loginSrc ：0手机访问 1：pc访问
    userInfo.mobileType = '2000004';
    userInfo.loginSrc = '0';
    var province = userInfo.province;
    //入库
    $.util.postJump('062', '', '', '功勋墙');
    //处理ios8能力打开页面不能用
    var str = navigator.userAgent.toLowerCase(),
        ver = str.match(/cpu iphone os (.*?) like mac os/),
        ip = location.protocol + "//" + location.host + "/",
        starval, growval,
        /**
         * 活动地址
         * */
        activityUrlList = {
            "url0":ip+"tykfh5/modules/starService/anniversary/index.html?",
            "url":ip+"tykfh5/modules/starService/source/activity/"
        };
    /**
     * 把统一接口星级转换方法
     * 0 普通
     * 11   1星
     * 12   2星
     * 13   3星
     * 14   4星
     * 15   5星
     * 16   6星
     * 17  7星
     */
    var starLv = function av(str) {
        if(str == '0') {
            return '0'
        } else if(str == '11') {
            return '1'
        } else if(str == '12') {
            return '2'
        } else if(str == '13') {
            return '3'
        } else if(str == '14') {
            return '4'
        } else if(str == '15') {
            return '5'
        } else if(str == '16') {
            return '6'
        } else if(str == '17') {
            return '7'
        }
    }
    //1：第一次进首页，2：从行权页面进首页
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds(),
        timestamp = year + '' + month + '' + day + '' + hour + '' + minute + '' + second,
        unique = sessionStorage.getItem(userInfo.mobile + 'unique_value'),
        mobile = userInfo.mobile,
        AjaxTimeout = 150000; //ajax超时时间
    //6位随机数
    function MathRand() {
        var num = "";
        for(var i = 0; i < 6; i++) {
            num += Math.floor(Math.random() * 10);
        }
        return num;
    }

    //补0
    function p(s) {
        return s < 10 ? '0' + s : s;
    }
    //取缓存接口数据
    var tyjkdatas = localStorage.getItem(userInfo.mobile + 'tyjkdata');
    tyjkdatas = JSON.parse(tyjkdatas);

    if(tyjkdatas != null && tyjkdatas != undefined && tyjkdatas != "") {
        //星级，传给子页面的时候 把reqparam里面的userlevel去掉 替换成starval ，给第三方页面 传  不要处理星级还是（11，12，13，14...）
        growthPoint = tyjkdatas.growthpoint;
        growval = tyjkdatas.growthpoint;
        starval = tyjkdatas.membershipLevel;
        userInfo.userLevel = starval;
        userInformation(tyjkdatas);
        salesInfoList(tyjkdatas, true);
        starBuy();
        ywtctx();
        starUp();
        if(starval == '0') {
            //普通用户
            //头像
            $('#Starhead').attr({
                'src': 'images/Ordinaryface.png'
            });
            ptyh(0);
            $('.zkzqbox').hide();
            $('.hbzqbox').hide();
            $('.bdzq').hide();
            $('.pttsy').show();
        } else if(starval > 0 && starval < 40) {
            //星级用户
            //头像
            $('#Starhead').attr({
                'src': 'images/Starhead.png'
            });
            picList(starval);
            hblist(starval);
            zklist(starval);
            bdlist(starval)
        }
    }
    //统一平台接口
    qryStarLevelAndIconList3();

    function qryStarLevelAndIconList3() {
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            url: encodingRedirectUrlForClientUni('/clientuni/services/starLevel/qryStarLevelAndIconList3?' +
                'reqParam={"clientNbr":"' + userInfo.mobile + '","channelCode":"H5002018","osType":"1","id":"1150","commercalSign":"3","token":"' + userInfo.token + '"}'),
            success: function(datas) {
                if(datas.resCode == '200' && JSON.stringify(datas) != JSON.stringify(tyjkdatas)) {
                    //星级，传给子页面的时候 把reqparam里面的userlevel去掉 替换成starval ，给第三方页面 传  不要处理星级还是（11，12，13，14...）
                    growthPoint = datas.growthpoint;
                    growval = datas.growthpoint;
                    starval = datas.membershipLevel;
					userInfo.userLevel = starval;
                    userInformation(datas);
                    salesInfoList(datas, true);
                    starBuy();
                    ywtctx();
                    starUp();
                    if(starval > 0) {
                        //星级用户
                        //头像
                        $('#Starhead').attr({
                            'src': 'images/Starhead.png'
                        });
                        picList(starval);
                        hblist(starval);
                        zklist(starval);
                        bdlist(starval)
                    } else {
                        //普通用户
                        //头像
                        $('#Starhead').attr({
                            'src': 'images/Ordinaryface.png'
                        });
                        ptyh(0);
                        $('.zkzqbox').hide();
                        $('.hbzqbox').hide();
                        $('.bdzq').hide();
                        $('.pttsy').show();
                    }
                    localStorage.setItem(userInfo.mobile + 'tyjkdata', JSON.stringify(datas));
                }
            }
        })

    }
    /**
     *  星级用户
     *  调用内容平台销售品列表查询
     *  主要获取主页面的图标和名称
     *  目前只配置上海,湖南数据,江苏，20151203
     */
    function salesInfoList(datas, OpenpicList) {
        //内容平台的公共参数（给行权页面）
        var parmsjson = {},
            params,
            //用集合存储 用户有那些权益 在去内容平台换头像，换跳转地址
            pointitemidarr = [];
        if(datas.items != null && datas.items.length > 0) {
            for(var i = 0; i < datas.items.length; i++) {
                //权益编码
                if(datas.items[i].pointItemID != "" && datas.items[i].pointItemID != null) {
                    pointitemidarr.push((datas.items[i].pointItemID).substring(0, 4));

                }

            }
        }
        var reqTime = localStorage.getItem('reqTime')
        if(reqTime == null) {
            reqTime = '';
        }
        var channelCode = 'H5002018';
        var d = new Date(),
            year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds();
        var transactionId = '1000020001' + year + '' + p(month) + '' + p(day) + '' + p(hour) + '' + p(minute) + '' + p(second) + parseInt(Math.random() * 1000000);
        var reqParam = {
            "transactionId": transactionId,
            "channelCode": channelCode,
            "token": userInfo.token,
            "type": 1
        };
        var sign = $.util.getsign(reqParam);
        //省市
        var city = userInfo.city;
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            async: false,
            url: $.util.encodingRedirectUrl('/public/sjkf/salesinfo/salesInfoList.jspx?provinceType=2&type=2&isbuy=1&starLevel=' + starLv(starval) + '&transactionId=' + transactionId + '&channelCode=' + channelCode + '&mobile=' + userInfo.mobile + '&sign=' + sign + '&province=' + encodeURIComponent(encodeURIComponent(province)) + '&city=' + encodeURIComponent(encodeURIComponent(city)) + '&reqTime=' + reqTime),
            success: function(data) {

                if(data.resCode == '200') {
                    $('.floorbg').attr('src', data.xzqBackImg)
                    //存全视图背景
                    localStorage.setItem(userInfo.province + 'qstBackImg', JSON.stringify(data.qstBackImg));
                    //存行权介绍页背景
                    localStorage.setItem(userInfo.province + 'xqBackImg', JSON.stringify(data.xqBackImg));
                    var fivedr = [];
                    $.each(datas.items, function(j, itemq) {
                        $.each(data.salesInfoList, function(i, item) {
                            //权益可享条件
                            if(itemq.pointItemID != undefined && item.prepNo.substring(0, 4) == itemq.pointItemID.substring(0, 4)) {
                                fivedr.push('<div class="clic swiper-slide" saleid="' + item.salesId + '" prepNo="' + item.prepNo + '" hasChild="' + item.hasChild + '" isNetAction="' + item.isNetAction + '" interfaceType="' + item.interfaceType + '" num="' + j + '">' +
                                    '<img src="' + item.ownerIcon + '" class="imgclass" />' +
                                    '<div class="textclass">' + item.salesName + '</div>' +
                                    '</div>');
                                return false;
                                //权益不可享
                            } else if(item.prepNo.substring(0, 4) == itemq.appId.substring(0, 4)) {
                                fivedr.push('<div class="clic swiper-slide" saleid="' + item.salesId + '" prepNo="' + item.prepNo + '" hasChild="' + item.hasChild + '" isNetAction="' + item.isNetAction + '" interfaceType="' + item.interfaceType + '" num="' + j + '">' +
                                    '<img src="' + item.icon + '" class="imgclass" />' +
                                    '<div class="textclass">' + item.salesName + '</div>' +
                                    '</div>');
                                return false;
                            }
                        })
                    })
                    $('#Fixedequity').html(fivedr.join(''));
                    //固定权益效果
                    var swiper = new Swiper('.autoplay', {
                        slidesPerView: 4.5,
                        paginationClickable: true,
//						loop: true,
//						loopAdditionalSlides: 1,
                        spaceBetween: 0,
                        freeMode: true,
                        freeModeSticky: true,
                        onTap: function(swiper) {
                            var i = swiper.clickedSlide.getAttribute('num');
                            //跳转子权益需要的内容平台参数
                            var saleid = swiper.clickedSlide.getAttribute('saleid');
                            var prepNo = swiper.clickedSlide.getAttribute('prepNo');
                            var hasChild = swiper.clickedSlide.getAttribute('hasChild');
                            var isNetAction = swiper.clickedSlide.getAttribute('isNetAction');
                            var interfaceType = swiper.clickedSlide.getAttribute('interfaceType');

                            if(prepNo != undefined && prepNo != null && prepNo != "") {
                                prepNo = prepNo.substring(0, 4);
                            }
                            var texts = $(swiper.clickedSlide).text();

                            //权益可享条件
                            if($.inArray(prepNo, pointitemidarr) != -1) {
                                //绑定事件
                                params = "?ReqParam=" + encodeURIComponent(encodeURIComponent(JSON.stringify(userInfo))) + '&multiple=' + data.multiple + '&hasChild=' + hasChild + '&isNetAction=' + isNetAction + '&interfaceType=' + interfaceType + '&pointItemID=' + swiper.clickedSlide.getAttribute('prepNo') + '&salesId=' + saleid;
                                parmsjson[prepNo] = params;

                                //alert('勋章墙跳行权')
                                $.util.postJump('107', datas.items[i].appId, '', '勋章墙跳行权-' + datas.items[i].pointItemName);
                                //0不加密，1，默认加密  ，2第三方应用加密
                                if(datas.items[i] != null && datas.items[i].encryptType == '0') {
                                    //跳转
                                    if((datas.items[i].childappWapaddr).indexOf('?') > -1) {
                                        var a = parmsjson[(datas.items[i].appId).substring(0, 4)] + "&itemId=" + datas.items[i].id;
                                        var b = a.replace('?', '&');

                                        if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                            location.href = datas.items[i].childappWapaddr + b
                                        } else {
                                            HGPlugins.openTitleWebView(datas.items[i].childappWapaddr + b, '星级服务', 'happygo');
                                        }

                                    } else {
                                        if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                            location.href = datas.items[i].childappWapaddr + parmsjson[(datas.items[i].appId).substring(0, 4)] + "&itemId=" + datas.items[i].id;
                                        } else {
                                            HGPlugins.openTitleWebView(datas.items[i].childappWapaddr + parmsjson[(datas.items[i].appId).substring(0, 4)] + "&itemId=" + datas.items[i].id, '星级服务', 'happygo');
                                        }
                                    }
                                } else if(datas.items[i] != null && datas.items[i].encryptType == '2') {
                                    //加密参数
                                    $.ajax({
                                        type: "POST",
                                        url: '/tykfh5/services/businessHandlingServer/getDES3.jsp?skey=' + encodeURIComponent(datas.items[i].skey) + '&ivstr=' + encodeURIComponent(datas.items[i].ivstr) + '&encryptStr=' + encodeURIComponent(encodeURIComponent(JSON.stringify(userInfo))),
                                        dataType: "json",
                                        success: function(data2) {
                                            if(data2.resCode == '200') {
                                                if((datas.items[i].childappWapaddr).indexOf('?') > -1) {
                                                    if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                                        location.href = datas.items[i].childappWapaddr + '&ReqParam=' + data2.encryptStr;
                                                    } else {
                                                        HGPlugins.openTitleWebView(datas.items[i].childappWapaddr + '&ReqParam=' + data2.encryptStr, '星级服务', 'happygo');
                                                    }

                                                } else {
                                                    if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                                        location.href = datas.items[i].childappWapaddr + '?ReqParam=' + data2.encryptStr;
                                                    } else {
                                                        HGPlugins.openTitleWebView(datas.items[i].childappWapaddr + '?ReqParam=' + data2.encryptStr, '星级服务', 'happygo');
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                                //权益不可享
                            } else {
                                //											alert('跳转权益解释页面')
                                $.util.postJump('107', prepNo, '', '勋章墙跳介绍-' + texts);
                                if(texts.indexOf('国漫') > -1) {
                                    if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                        location.href = '../rightsExplain/indexRoaming.html?salesId=' + saleid + '&ReqParam=' + JSON.stringify(userInfo);
                                    } else {
                                        HGPlugins.openTitleWebView(ip + 'tykfh5/modules/starService/rightsExplain/indexRoaming.html?salesId=' + saleid + '&ReqParam=' + encodeURIComponent(encodeURIComponent(JSON.stringify(userInfo))), '星级服务', 'happygo');
                                    }
                                } else {

                                    if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                        location.href = '../rightsExplain/index.html?salesId=' + saleid + '&ReqParam=' + JSON.stringify(userInfo);
                                    } else {
                                        HGPlugins.openTitleWebView(ip + 'tykfh5/modules/starService/rightsExplain/index.html?salesId=' + saleid + '&ReqParam=' + encodeURIComponent(encodeURIComponent(JSON.stringify(userInfo))), '星级服务', 'happygo');
                                    }

                                }

                            }
                        }
                    });
                }
            }
        })

    }
    //精彩活动模块
    /**
     * 星级用户调活动接口
     * channel  pc(pc001001)写死     app(从地址栏上取)
     */

    function picList(starlevel) {
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            url: encodingRedirectUrlForClientUni('/clientuni/services/marketing/equityActivityList?reqParam={"token":"' + userInfo.token + '","channel":"' + userInfo.channel + '","type":"1","userLevel":"' + starlevel + '","deviceType":"2000004","loginSrc":"0","unique":"1"}&fresh=' + Math.random()),
            success: function(data) {
                if(data.resCode == '200' && data.activityList.length > 0) {
                    var tpl = [];
                    $.each(data.activityList, function(i, item) {
                        var locationhref;
                        if((item.activityDtlUrl).indexOf('?') > -1) {
                            locationhref = item.activityDtlUrl + '&channel=' + userInfo.channel;
                        } else {
                            locationhref = item.activityDtlUrl + '?channel=' + userInfo.channel;
                        }
                        tpl.push('<div class="clic1 swiper-slide" id="Activity' + i + '">' +
                            '<img src="' + item.activityImgURL + '?v=1" class="imgclass1" />' +
                            '</div>');

                        $(document).on("click", '#Activity' + i, function() {
                            if(item.activityDtlUrl.indexOf('anniversary') > -1) {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    location.href = item.activityDtlUrl + '?ReqParam=' + JSON.stringify(userInfo) + '&starval=' + starval;
                                } else {
                                    HGPlugins.openTitleWebView(item.activityDtlUrl + '?ReqParam=' + encodeURIComponent(JSON.stringify(userInfo)) + '&starval=' + starval, '星级服务', 'happygo')
                                }

                            } else {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    $.util.standardPost(locationhref, {
                                        activityId: item.activityId,
                                        token: userInfo.token,
                                        deviceType: '2000004',
                                        loginSrc: '0',
                                        userLevel: starlevel
                                    });
                                } else {
                                    if((locationhref).indexOf('?') > -1) {
                                        HGPlugins.openTitleWebView(locationhref + "&activityId=" + item.activityId + "&token=" + userInfo.token + '&deviceType=2000004&loginSrc=0&userLevel=' + starlevel, '星级服务', 'happygo');
                                    } else {
                                        HGPlugins.openTitleWebView(locationhref + "?activityId=" + item.activityId + "&token=" + userInfo.token + '&deviceType=2000004&loginSrc=0&userLevel=' + starlevel, '星级服务', 'happygo');
                                    }

                                }
                            }

                        });
                    });
                    $('.center').html(tpl.join(''));
                    if(data.activityList.length > 2) {
                        //精彩活动效果swiper
                        var swiper = new Swiper('.swiper-container', {
                            effect: 'coverflow',
                            grabCursor: true,
                            loop: true,
                            loopAdditionalSlides: 1,
                            centeredSlides: true,
                            slidesPerView: 1.2,
                            coverflow: {
                                rotate: 0,
                                stretch: -30,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }
                        });
                    } else if(data.activityList.length == 2) {
                        //精彩活动效果swiper
                        var swiper = new Swiper('.swiper-container', {
                            effect: 'coverflow',
                            grabCursor: true,
                            centeredSlides: true,
                            slidesPerView: 1.2,
                            coverflow: {
                                rotate: 0,
                                stretch: -30,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }
                        });
                    } else {
                        //精彩活动效果swiper
                        var swiper = new Swiper('.swiper-container', {
                            effect: 'coverflow',
                            grabCursor: true,
                            centeredSlides: true,
                            slidesPerView: 1.2,
                            coverflow: {
                                rotate: 0,
                                stretch: -30,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }
                        });
                        swiper.detachEvents(); //禁止滑动
                    }

                } else {
                    $('.jchdbox').hide();
                }

            },
            error: function() {
                $('.jchdbox').hide();
            }
        })
    }
    /**
     * 普通用户调活动接口
     * channel  pc(pc001001)写死     app(从地址栏上取)
     */

    function ptyh(starlevel) {
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            url: encodingRedirectUrlForClientUni('/clientuni/services/marketing/equityActivityList?reqParam={"token":"' + userInfo.token + '","channel":"' + userInfo.channel + '","type":"1","userLevel":"' + starlevel + '","deviceType":"2000004","loginSrc":"0","unique":"1"}&fresh=' + Math.random()),
            success: function(data) {

                if(data.resCode == '200' && data.activityList.length > 0) {
                    var tpl = [];
                    $.each(data.activityList, function(i, item) {
                        tpl.push('<div class="clic1 swiper-slide gran">' +
                            '<img src="' + item.activityImgURL + '?v=1" class="imgclass1" />' +
                            '</div>');
                    });
                    $('.center').html(tpl.join(''));
                    if(data.activityList.length > 2) {
                        //精彩活动效果swiper
                        var swiper = new Swiper('.swiper-container', {
                            effect: 'coverflow',
                            grabCursor: true,
                            loop: true,
                            loopAdditionalSlides: 1,
                            centeredSlides: true,
                            slidesPerView: 1.2,
                            coverflow: {
                                rotate: 0,
                                stretch: -30,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }
                        });
                    } else if(data.activityList.length == 2) {
                        //精彩活动效果swiper
                        var swiper = new Swiper('.swiper-container', {
                            effect: 'coverflow',
                            grabCursor: true,
                            centeredSlides: true,
                            slidesPerView: 1.2,
                            coverflow: {
                                rotate: 0,
                                stretch: -30,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }
                        });
                    } else {
                        //精彩活动效果swiper
                        var swiper = new Swiper('.swiper-container', {
                            effect: 'coverflow',
                            grabCursor: true,
                            centeredSlides: true,
                            slidesPerView: 1.2,
                            coverflow: {
                                rotate: 0,
                                stretch: -30,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }
                        });
                        swiper.detachEvents(); //禁止滑动
                    }
                } else {
                    $('.jchdbox2').hide();
                }

            },
            error: function() {
                $('.jchdbox2').hide();
            }
        })
    }
    //用户信息模块
    function userInformation(datas) {
        //用户姓名
        if(datas.custName != undefined && datas.custName != null && datas.custName != "") {
            $('#usersname').html(datas.custName);
        } else {
            $('#usersname').html('异常数据');
        }
        //用户星级
        if(datas.membershipLevel != undefined && datas.membershipLevel != null && datas.membershipLevel != "" && datas.membershipLevel > 0) {
            $('.star').html(starLv(datas.membershipLevel) + '星');
        } else if(datas.membershipLevel != undefined && datas.membershipLevel != null && datas.membershipLevel != "" && datas.membershipLevel == 0) {
            $('.star').html('普通用户');
        } else {
            $('.star').html('数据异常');
        }
        //成长值
        if(datas.growthpoint != undefined && datas.growthpoint != null && datas.growthpoint != "") {
            $('.czzvulue').html(datas.growthpoint);
        } else {
            $('.czzvulue').html('异常数据');
        }

    }

    //星级列表,成长值(星级参数为0时,可取到所有星级区间的成长值,不为0,只能取到俩星级的区间成长值),
    //星级参数不同,只影响星级成长值区间值个数,不影响权益列表数据,星级参数默认为0

    function starBuy() {
        //星级列表接口请求
        var transactionId = '1000020001' + timestamp + '' + MathRand();
        var reqParam = {
            "transactionId": transactionId,
            "channelCode": 'H5002018',
            "token": userInfo.token,
            "type": 1
        };
        var sign = $.util.getsign(reqParam);
        $.ajax({
            type: 'post', //' + starLv(userInfo.userLevel) + '
            url: $.util.encodingRedirectUrl('/public/sjkf/salesinfo/salesInfoList.jspx?transactionId=' + transactionId + '&channelCode=H5002018&mobile=' + mobile + '&sign=' + sign + '&provinceType=2&isbuy=2&starLevel=0&province=' + encodeURIComponent(encodeURIComponent(userInfo.province)) + '&city=' + encodeURIComponent(encodeURIComponent(userInfo.city)) + ''),
            timeout: 15000,
            dataType: "json",
            success: function(data) {

                //进度条下的成长值
                if(data.resCode == "200" && data.starValList.length > 0) {
                    growthPointShow(data.starValList);
                } else {
                    growthPointError()
                }
            },
            error: function() {
                //接口异常
                growthPointError()
            }

        });
    }
    //进度条下的成长值显示
    var growthPointShow = function(fd) {
        if((starLv(userInfo.userLevel) == '6' || starLv(userInfo.userLevel) == '7')) {
            $('.xingleft .xingfz').html('5星').next('div').html(fd[2].starvalue + '分');
            $('.xingcenter .xingfz').html('6星').next('div').html(fd[1].starvalue + '分');
            $('.xingright .xingfz').html('7星').next('div').html(fd[0].starvalue + '分');
        } else if(starLv(userInfo.userLevel) == '5') {
            $('.xingleft .xingfz').html('4星').next('div').html(fd[3].starvalue + '分');
            $('.xingcenter .xingfz').html('5星').next('div').html(fd[2].starvalue + '分');
            $('.xingright .xingfz').html('6星').next('div').html(fd[1].starvalue + '分');
        } else if(starLv(userInfo.userLevel) == '4') {
            $('.xingleft .xingfz').html('3星').next('div').html(fd[4].starvalue + '分');
            $('.xingcenter .xingfz').html('4星').next('div').html(fd[3].starvalue + '分');
            $('.xingright .xingfz').html('5星').next('div').html(fd[2].starvalue + '分');
        } else if(starLv(userInfo.userLevel) == '3') {
            $('.xingleft .xingfz').html('2星').next('div').html(fd[5].starvalue + '分');
            $('.xingcenter .xingfz').html('3星').next('div').html(fd[4].starvalue + '分');
            $('.xingright .xingfz').html('4星').next('div').html(fd[3].starvalue + '分');
        } else if(starLv(userInfo.userLevel) == '2') {
            $('.xingleft .xingfz').html('1星').next('div').html(fd[6].starvalue + '分');
            $('.xingcenter .xingfz').html('2星').next('div').html(fd[5].starvalue + '分');
            $('.xingright .xingfz').html('3星').next('div').html(fd[4].starvalue + '分');
        } else if((starLv(userInfo.userLevel) == '1') || starLv(userInfo.userLevel) == '0') {
            $('.xingleft .xingfz').html('0星').next('div').html('0分');
            $('.xingcenter .xingfz').html('1星').next('div').html(fd[6].starvalue + '分');
            $('.xingright .xingfz').html('2星').next('div').html(fd[5].starvalue + '分');
        }
        growthPointCalculate(fd);
    }

    //进度条
    var growthPointCalculate = function(fd) {
        var width = 5.21;
        $('.jintinabox').css({
            'width': '5.21rem'
        });
        if(starLv(userInfo.userLevel) == '7') {
            $('.jintinabox').css({
                'width': '10rem'
            });
        } else if(starLv(userInfo.userLevel) == '6') {
            if(parseInt(growthPoint) >= parseInt(fd[1].starvalue) && parseInt(growthPoint) < parseInt(fd[0].starvalue)) {
                width = 5.21 + (growthPoint - fd[1].starvalue) / (fd[0].starvalue - fd[1].starvalue) * 4;
            }
        } else if(starLv(userInfo.userLevel) == '5') {
            if(parseInt(growthPoint) >= parseInt(fd[2].starvalue) && parseInt(growthPoint) < parseInt(fd[1].starvalue)) {
                width = 5.21 + (growthPoint - fd[2].starvalue) / (fd[1].starvalue - fd[2].starvalue) * 4;
            }
        } else if(starLv(userInfo.userLevel) == '4') {
            if(parseInt(growthPoint) >= parseInt(fd[3].starvalue) && parseInt(growthPoint) < parseInt(fd[2].starvalue)) {
                width = 5.21 + (growthPoint - fd[3].starvalue) / (fd[2].starvalue - fd[3].starvalue) * 4;
            }
        } else if(starLv(userInfo.userLevel) == '3') {
            if(parseInt(growthPoint) >= parseInt(fd[4].starvalue) && parseInt(growthPoint) < parseInt(fd[3].starvalue)) {
                width = 5.21 + (growthPoint - fd[4].starvalue) / (fd[3].starvalue - fd[4].starvalue) * 4;
            }
        } else if(starLv(userInfo.userLevel) == '2') {
            if(parseInt(growthPoint) >= parseInt(fd[5].starvalue) && parseInt(growthPoint) < parseInt(fd[4].starvalue)) {
                width = 5.21 + (growthPoint - fd[5].starvalue) / (fd[4].starvalue - fd[5].starvalue) * 4;
            }
        } else if(starLv(userInfo.userLevel) == '1') {
            if(parseInt(growthPoint) >= parseInt(fd[6].starvalue) && parseInt(growthPoint) < parseInt(fd[5].starvalue)) {
                width = 5.21 + (growthPoint - fd[6].starvalue) / (fd[5].starvalue - fd[6].starvalue) * 4;
            }
        } else if(starLv(userInfo.userLevel) == '0') {
            width = 0.6;
            if(parseInt(growthPoint) >= 0 && parseInt(growthPoint) < parseInt(fd[6].starvalue)) {
                width = 0.6 + (growthPoint / fd[6].starvalue) * 4;
            }
        }
        $('.jintinabox').css({
            'width': width + 'rem'
        });
        $('.czzvulue').css({
            'left': width + 'rem'
        });

    }

    //成长值接口异常时调用
    var growthPointError = function() {
        if(starLv(userInfo.userLevel) == '7') {
            $('.jintinabox').css({
                'width': '10rem'
            });
            $('.czzvulue').css({
                'left': '10rem'
            });
            $('.xingleft .xingfz').html('5星');
            $('.xingcenter .xingfz').html('6星');
            $('.xingright .xingfz').html('7星');
        } else if((starLv(userInfo.userLevel) == '6' || starLv(userInfo.userLevel) == '5' || starLv(userInfo.userLevel) == '4' || starLv(userInfo.userLevel) == '3' || starLv(userInfo.userLevel) == '2' || starLv(userInfo.userLevel) == '1')) {
            $('.jintinabox').css({
                'width': '5.21rem'
            });
            $('.czzvulue').css({
                'left': '5.21rem'
            });
            $('.xingleft .xingfz').html(starLv(userInfo.userLevel) - 1 + '星');
            $('.grow-up-value .grow-up-middle span').html(starLv(userInfo.userLevel) + '星');
            $('.grow-up-value .grow-up-right span').html(starLv(userInfo.userLevel) + 1 + '星');
        } else if(starLv(userInfo.userLevel) == '0') {
            $('.jintinabox').css({
                'width': '0.6rem'
            });
            $('.czzvulue').css({
                'left': '0.6rem'
            });

            $('.xingleft .xingfz').html('0星');
            $('.xingcenter .xingfz').html('1星');
            $('.xingright .xingfz').html('2星');
        }
    }
    //积分券
    voucher();

    function voucher() {
        var transactionId = '1000010021' + timestamp + '123456',
            reqParam = {
                "transactionId": transactionId,
                "channelCode": "H5002018",
                "token": userInfo.token,
                "type": 1
            },
            sign = $.util.getsign(reqParam);
        $.ajax({
            type: "POST",
            url: encodingRedirectUrlForClientUni('/clientuni/services/userManage/GetVoucher?' +
                'reqParam={"transactionId":"' + transactionId + '","channelCode":"H5002018","mobile":"' + userInfo.mobile + '","sign":"' + sign + '"}'),
            dataType: "json",
            timeout: 15000,
            success: function(data) {
                if(data.resCode == 200 || data.resCode == '200') {
                    $('#vouchers').html(isNaN(parseInt(data.voucherVal)) ? '暂无数据' : data.voucherVal)
                } else {
                    $('#vouchers').html('暂无数据');
                }
            }
        });
    }
    //当前可用积分
    curjf();

    function curjf() {
        var clientnbr = userInfo.mobile;
        var transactionId = '1000010015' + timestamp + parseInt(Math.random() * 1000000);
        var channelCode = 'H5002018';
        var reqParam = {
            "transactionId": transactionId,
            "channelCode": channelCode,
            "token": userInfo.token,
            "type": 2
        };
        var sign = $.util.getsign(reqParam);
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            url: encodingRedirectUrlForClientUni('/clientuni/services/starLevel/custStarLevelQuery?reqParam={"transactionId":"' + transactionId + '","clientNbr":"' + clientnbr + '","channelCode":"' + channelCode + '","deviceType":"1","prvince":"' + encodeURIComponent(encodeURIComponent(userInfo.province)) + '","sign":"' + sign + '"}'),
            success: function(data) {
                if(data.resCode == '200') {
                    var pointValue = data.custInfo.pointValue;
                    //当前可用积分
                    if(pointValue != '' && pointValue != null && typeof pointValue != 'undefined') {
                        $('#pointValue').html(pointValue)
                    } else {
                        $('#pointValue').html('数据异常')
                    }
                }
            }
        })
    }
    //  红包列表
    function hblist(starLevel) {
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            url: encodingRedirectUrlForClientUni('/clientuni/services/starLevel/discountOrRedPacketsList3?reqParam={"token":"' + userInfo.token + '","mobile":"' + userInfo.mobile + '","channelCode":"H5002018","channel":"' + userInfo.channel + '","osType":"3","starLevel":"' + starLevel + '","activityType":"' + 3 + '"}'),
            success: function(data) {
                if(data.resCode == '200' && data.redPacketsList.length > 0) {
                    var tpl = [];
                    $.each(data.redPacketsList, function(i, item) {
                        if(i > 9) {
                            return false;
                        }
                        tpl.push('<div class="swiper-slide hbslide" id="detail' + i + '">' +
                            '<img src="' + item.pricture + '?v=1" class="imgclass2" />' +
                            '<div class="hbhdtext">' + item.summary + '</div>' +
                            '</div>');
                        //点击图片跳活动详情
                        $("body").delegate('#detail' + i, 'click', function() {
                            //可以点击
                            userInfo.productNbr = item.productNbr;

                            //入库
                            $.util.postJump('120', item.activityId, '', item.title);

                            if(data.redPacketsList[i].jumpAddr.indexOf('?') > -1) {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    location.href = data.redPacketsList[i].jumpAddr + "&ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.redPacketsList[i].activityId + "&buttonStatus=" + data.redPacketsList[i].buttonStatus + "&couponIsReceive=" + data.redPacketsList[i].couponIsReceive + "&partner=" + data.redPacketsList[i].partner + "&repertory=" + data.redPacketsList[i].repertory + "&orderType=" + data.redPacketsList[i].orderType + "&productNbr=" + data.redPacketsList[i].productNbr + "&title=" + encodeURIComponent(data.redPacketsList[i].title);
                                } else {
                                    HGPlugins.openTitleWebView(data.redPacketsList[i].jumpAddr + "&ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.redPacketsList[i].activityId + "&buttonStatus=" + data.redPacketsList[i].buttonStatus + "&couponIsReceive=" + data.redPacketsList[i].couponIsReceive + "&partner=" + data.redPacketsList[i].partner + "&repertory=" + data.redPacketsList[i].repertory + "&orderType=" + data.redPacketsList[i].orderType + "&productNbr=" + data.redPacketsList[i].productNbr + "&title=" + encodeURIComponent(data.redPacketsList[i].title), '星级服务', 'happygo');
                                }

                            } else {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    location.href = data.redPacketsList[i].jumpAddr + "?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.redPacketsList[i].activityId + "&buttonStatus=" + data.redPacketsList[i].buttonStatus + "&couponIsReceive=" + data.redPacketsList[i].couponIsReceive + "&partner=" + data.redPacketsList[i].partner + "&repertory=" + data.redPacketsList[i].repertory + "&orderType=" + data.redPacketsList[i].orderType + "&productNbr=" + data.redPacketsList[i].productNbr + "&title=" + encodeURIComponent(data.redPacketsList[i].title);
                                } else {
                                    HGPlugins.openTitleWebView(data.redPacketsList[i].jumpAddr + "?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.redPacketsList[i].activityId + "&buttonStatus=" + data.redPacketsList[i].buttonStatus + "&couponIsReceive=" + data.redPacketsList[i].couponIsReceive + "&partner=" + data.redPacketsList[i].partner + "&repertory=" + data.redPacketsList[i].repertory + "&orderType=" + data.redPacketsList[i].orderType + "&productNbr=" + data.redPacketsList[i].productNbr + "&title=" + encodeURIComponent(data.redPacketsList[i].title), '星级服务', 'happygo');
                                }
                                //location.href=data.redPacketsList[i].jumpAddr+"?ReqParam="+JSON.stringify(userInfo)+'&activityId='+data.redPacketsList[i].activityId+"&buttonStatus="+data.redPacketsList[i].buttonStatus+"&couponIsReceive="+data.redPacketsList[i].couponIsReceive+"&partner="+data.redPacketsList[i].partner+"&repertory="+data.redPacketsList[i].repertory+"&orderType="+data.redPacketsList[i].orderType+"&productNbr="+data.redPacketsList[i].productNbr+"&title="+data.redPacketsList[i].title;

                            }

                        });
                    });
                    $('#hbzq').html(tpl.join(''));
                    if(data.redPacketsList.length > 10) {
                        //红包效果
                        var swiper = new Swiper('.hbzq', {
                            slidesPerView: 2.5,
                            paginationClickable: true,
                            spaceBetween: 0,
                            freeMode: true,
                            freeModeSticky: true,
                            onSlideChangeEnd: function(swiper) {
                                if(swiper.isEnd) {
                                    $('.hbzq').css({
                                        'width': '90%'
                                    });
                                    $('.hbslide').css({
                                        '-webkit-transform': 'translate(-25%,0)'
                                    });

                                    $('#gd1').fadeIn(800);
                                } else if(swiper.progress < 0.96) {
                                    $('#gd1').hide();
                                    $('.hbzq').css({
                                        'width': '100%'
                                    });
                                    $('.hbslide').css({
                                        '-webkit-transform': 'translate(0,0)'
                                    });

                                }
                            },
                            onProgress: function(swiper, progress) {
                                if(progress <= 0) {
                                    $('#gd1').hide();
                                    $('.hbzq').css({
                                        'width': '100%'
                                    });
                                    $('.hbslide').css({
                                        '-webkit-transform': 'translate(0,0)'
                                    });
                                }
                            }
                        });
                    } else if(data.redPacketsList.length > 3 && data.redPacketsList.length <= 10) {
                        //红包效果
                        var swiper = new Swiper('.hbzq', {
                            slidesPerView: 2.5,
                            paginationClickable: true,
                            loop: true,
                            loopAdditionalSlides: 1,
                            spaceBetween: 0,
                            freeMode: true,
                            freeModeSticky: true
                        });
                    } else {
                        var swiper = new Swiper('.hbzq', {
                            slidesPerView: 3,
                            paginationClickable: true,
                            spaceBetween: 0

                        });
                        swiper.detachEvents(); //禁止滑动
                    }
                } else {
                    $('.hbzqbox').hide();
                }
            },
            error: function() {
                $('.hbzqbox').hide();
            }
        })
    }
    //  折扣列表
    function zklist(starLevel) {
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            url: encodingRedirectUrlForClientUni('/clientuni/services/starLevel/discountOrRedPacketsList3?reqParam={"token":"' + userInfo.token + '","mobile":"' + userInfo.mobile + '","channelCode":"H5002018","channel":"' + userInfo.channel + '","osType":"3","starLevel":"' + starLevel + '","activityType":"' + 2 + '"}'),
            success: function(data) {
                if(data.resCode == '200' && data.discountList.length > 0) {
                    var tpl = [];
                    $.each(data.discountList, function(i, item) {
                        if(i > 9) {
                            return false;
                        }
                        tpl.push('<div class="swiper-slide zkslide" id="zktz' + i + '"><div class="zkzqon">' +
                            '<div class="zkzqtext">' + item.title + '</div>' +
                            '<img src="' + item.picture + '?v=1" class="zk" />' +
                            '</div></div>');
                        //绑定banner轮播点击
                        $("body").delegate('#zktz' + i, 'click', function() {
                            userInfo.productNbr = data.discountList[i].productNbr;

                            //入库
                            $.util.postJump('119', item.activityId, '', 'banner' + data.discountList[i].title);
                            if(data.discountList[i].jumpAddr.indexOf('?') > -1) {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    location.href = data.discountList[i].jumpAddr + "&ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.discountList[i].activityId;
                                } else {
                                    HGPlugins.openTitleWebView(data.discountList[i].jumpAddr + "&ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.discountList[i].activityId, '星级服务', 'happygo');
                                }

                            } else {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    location.href = data.discountList[i].jumpAddr + "?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.discountList[i].activityId;
                                } else {
                                    HGPlugins.openTitleWebView(data.discountList[i].jumpAddr + "?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + data.discountList[i].activityId, '星级服务', 'happygo');
                                }
                            }
                        });

                    });
                    $('#zkzq').html(tpl.join(''));
                    if(data.discountList.length > 10) {
                        //折扣红包效果
                        var swiper = new Swiper('.zkzq', {
                            slidesPerView: 3.5,
                            paginationClickable: true,
                            spaceBetween: 0,
                            freeMode: true,
                            freeModeSticky: true,
                            onSlideChangeEnd: function(swiper) {
                                if(swiper.isEnd) {
                                    $('.zkzq').css({
                                        'width': '90%'
                                    });
                                    $('.zkslide').css({
                                        '-webkit-transform': 'translate(-34%,0)'
                                    });

                                    $('#gd2').fadeIn(800);
                                } else if(swiper.progress < 0.96) {
                                    $('#gd2').hide();
                                    $('.zkzq').css({
                                        'width': '100%'
                                    });
                                    $('.zkslide').css({
                                        '-webkit-transform': 'translate(0,0)'
                                    });

                                }
                            },
                            onProgress: function(swiper, progress) {
                                if(progress <= 0) {
                                    $('#gd2').hide();
                                    $('.zkzq').css({
                                        'width': '100%'
                                    });
                                    $('.zkslide').css({
                                        '-webkit-transform': 'translate(0,0)'
                                    });
                                }

                            }
                        });
                    } else if(data.discountList.length > 3 && data.discountList.length <= 10) {

                        //折扣红包效果
                        var swiper = new Swiper('.zkzq', {
                            slidesPerView: 3.5,
                            paginationClickable: true,
                            loop: true,
                            loopAdditionalSlides: 1,
                            spaceBetween: 0,
                            freeMode: true,
                            freeModeSticky: true
                        });
                    } else {
                        //折扣红包效果
                        var swiper = new Swiper('.zkzq', {
                            slidesPerView: 3,
                            paginationClickable: true,
                            spaceBetween: 0

                        });
                        swiper.detachEvents(); //禁止滑动
                    }
                } else {
                    $('.zkzqbox').hide();
                }
            },
            error: function() {
                $('.zkzqbox').hide();
            }
        })
    }
    //  本地专区
    function bdlist(starLevel) {
        $.ajax({
            type: 'get',
            dataType: "json",
            timeout: 15000,
            url: encodingRedirectUrlForClientUni('/clientuni/services/starLevel/nativeList?reqParam={"token":"' + userInfo.token + '","mobile":"' + userInfo.mobile + '","channelCode":"H5002018","channel":"' + userInfo.channel + '","osType":"3","starLevel":"' + starLevel + '","activityType":"' + 4 + '"}'),
            success: function(data) {

                if(data.resCode == '200' && data.nativeList.length > 0) {
                    var tpl = [];
                    $.each(data.nativeList, function(i, item) {
                        tpl.push('<div class="clic2" id="bd' + i + '"><img src="' + item.picture + '?v=1" class="imgclass3" /></div>');
                        //绑定banner轮播点击
                        $("body").delegate('#bd' + i, 'click', function() {
                            userInfo.productNbr = item.productNbr;

                            //入库
                            $.util.postJump('121', item.activityId, '', '活动名：' + item.title);
                            if(item.jumpAddr.indexOf('?') > -1) {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    location.href = item.jumpAddr + "&ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + item.activityId;
                                } else {
                                    HGPlugins.openTitleWebView(item.jumpAddr + "&ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + item.activityId, '星级服务', 'happygo');
                                    //									location.href = item.jumpAddr + "&ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + item.activityId;
                                }

                            } else {
                                if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                                    location.href = item.jumpAddr + "?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + item.activityId;
                                } else {
                                    HGPlugins.openTitleWebView(item.jumpAddr + "?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + item.activityId, '星级服务', 'happygo');
                                    //									location.href = item.jumpAddr + "?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)) + '&activityId=' + item.activityId;
                                }
                            }
                        });

                    });
                    $('.bdzqhd').html(tpl.join(''));
                } else {
                    $('.bdzq').hide()
                }
            },
            error: function() {
                $('.bdzq').hide()
            }
        })
    }
    //登陆成功，点击星级的头像 进入全视图
    $('#Starhead').unbind();
    $('#Starhead').on('click', function() {
        userInfo.userLevel = starval;
        if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
            location.href = '../fullView/index.html?ReqParam=' + JSON.stringify(userInfo) + '&growthpoint=' + growval;
        } else {
            HGPlugins.openTitleWebView(ip + 'tykfh5/modules/starService/fullView/index.html?ReqParam=' + encodeURIComponent(JSON.stringify(userInfo)) + '&growthpoint=' + growval, '星级服务', 'happygo');
            //			location.href = '../fullView/index.html?ReqParam=' + encodeURIComponent(JSON.stringify(userInfo)) + '&growthpoint=' + growval;
        }
    });
    //小红包入口
    $('#gd1').unbind();
    $('#gd1').on('click', function() {
        if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
            location.href = '../redacketPList/index.html?ReqParam=' + JSON.stringify(userInfo);
        } else {
            //			location.href = '../redacketPList/index.html?ReqParam=' + JSON.stringify(userInfo);
            HGPlugins.openTitleWebView(ip + "tykfh5/modules/starService/redacketPList/index.html?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)), '星级服务', 'happygo');
        }

    });
    //折扣入口
    $('#gd2').unbind();
    $('#gd2').on('click', function() {
        if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
            location.href = '../favorableList/index.html?ReqParam=' + JSON.stringify(userInfo);
        } else {
            HGPlugins.openTitleWebView( ip + "tykfh5/modules/starService/favorableList/index.html?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)), '星级服务', 'happygo');
        }

    });

    //积分入口
    $(".jismallbox").on('click', function() {
        if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
            location.href = '../../businessHandling/curIntegral/index.html?ReqParam=' + JSON.stringify(userInfo);
        } else {
            HGPlugins.openTitleWebView( ip + "tykfh5/modules/businessHandling/curIntegral/index.html?ReqParam=" + encodeURIComponent(JSON.stringify(userInfo)), '星级服务', 'happygo');
        }

    });

    /**
     * 二期新增 生日弹窗提醒接口
     * */
    function ywtctx() {
           var transactionId = '1000010070' + timestamp + parseInt(Math.random() * 1000000),
            reqParam = {
                "transactionId": transactionId,
                "channelCode": 'H5002018',
                "token": userInfo.token,
                "type": 1
            },
            sign = $.util.getsign(reqParam),
            birth = {"transactionId": transactionId ,"channelCode":"H5002018","mobile":userInfo.mobile ,"columnSource":"1","sign":sign, "province":userInfo.province,"starLevel":userInfo.userLevel };
        $.ajax({
            type: 'GET',
            dataType: "JSON",
            timeout: AjaxTimeout,
            url: encodingRedirectUrlForClientUni('/clientuni/services/starLevel/qryHolidays?reqParam=' + JSON.stringify(birth)),
            success: function (response) {
                // response =
					// {
					// 	"resCode":"200","resDesc":"SUCCESS","status":"0","type":"1",
					// 	"isInteractive":"0","jumpType":"0",
					// 	"jumpUrl":"https://www.baidu.com/",
					// 	"configInfo":{"fullViewAddr":"/res/upload/zdfw/quanshituyuandan201612271523257.jpg","medalWallAddr":"/res/upload/zdfw/xuzhuangqiangyuandan201612271414256.jpg","rightsExplain":"/res/upload/zdfw/quanyijieshiyuandan201612271638259.jpg","exerciseAddr":"/res/upload/zdfw/xingquanyuandan201612271034258.jpg"}
                //    }
                if (response.resCode == '200') {
                	var flag = false;
    			//动画展示状态status（0-未展示 1-已展示）   节假日类型type 1-生日
                    if (response.status == '0' && response.type =='1') {
                        $('#iframedh').attr("src", "../source/happybirthday/index.html?ReqParam=" + JSON.stringify(userInfo)
                            + '&isInteractive=' + response.isInteractive + '&jumpType=' + response.jumpType+ '&jumpUrl=' + response.jumpUrl+ '&activityId=' + response.activityId);
                        $('#iframedh').show();

                        // if(ver && (ver[1].replace(/_/g, ".")).indexOf('8') > -1) {
                        //
                        //     location.href = "../source/happybirthday/index.html?ReqParam=" + JSON.stringify(userInfo) + '&isInteractive=' + response.isInteractive + '&jumpType=' + response.jumpType+ '&jumpUrl=' + response.jumpUrl+ '&activityId=' + response.activityId;
                        // }
                        // else {
                        //     HGPlugins.openTitleWebView( ip + 'tykfh5/modules/starService/source/happybirthday/index.html?&ReqParam=' + encodeURIComponent(JSON.stringify(userInfo))+ '&isInteractive=' + response.isInteractive + '&jumpType=' + response.jumpType+ '&jumpUrl=' + response.jumpUrl+ '&activityId=' + response.activityId, '星级服务', 'happygo');
                        // }
                        flag = true;
    			}

                    //元旦
                    if(response.type == '2' && response.status == '0') {
                        $('#iframedh').attr("src", "../source/newYearDay/index.html?v=201601");
                        $('#iframedh').show();
                        //满足显示活动，延迟1秒显示勋章墙
                        setTimeout(function() {
                            $('.bigbox').css({
                                'opacity': '1'
                            })
                        }, 3000);
                        flag = true;
                    }
                    //春节
                    if(response.type == '3' && response.status == '0') {
                        $('#iframedh').attr("src", "../source/spring/index.html?v=201601");
                        $('#iframedh').show();
                        //满足显示活动，延迟1秒显示勋章墙
                        setTimeout(function() {
                            $('.bigbox').css({
                                'opacity': '1'
                            })
                        }, 3000);
                        flag = true;
                    }
                    //端午节
                    if(response.type == '6' && response.status == '0') {
                        $('#iframedh').attr("src", "../source/dragonBoat/index.html?v=201705");
                        $('#iframedh').show();
                        //满足显示活动，延迟1秒显示勋章墙
                        setTimeout(function() {
                            $('.bigbox').css({
                                'opacity': '1'
                            })
                        }, 3000);
                        flag = true;
                    }
                    //4:春节无动画有背景,5:元宵节背景无动画
                    if(response.type == '4' || response.type == '5') {
                        //满足显示活动，延迟1秒显示勋章墙
                        setTimeout(function() {
                            $('.bigbox').css({
                                'opacity': '1'
                            })
                        }, 1000);
                        flag = true;
                    }
                    if(response.type == '1' || response.type == '2' || response.type == '3' || response.type == '4' || response.type == '5' || response.type == '6') {
                        $('.floorbg').attr('src', response.configInfo.medalWallAddr);
                          //缓存全视图背景
                        if(response.configInfo.fullViewAddr != null && response.configInfo.fullViewAddr != undefined || response.configInfo.fullViewAddr != "") {
                            localStorage.setItem(userInfo.province + 'qstBackImg', JSON.stringify(response.configInfo.fullViewAddr));
                            //full = sessionStorage.getItem(fullViewAddr + n);
                        }
                        //缓存权益解释页面rightsExplain
                        if(response.configInfo.rightsExplain != null && response.configInfo.rightsExplain != undefined || response.configInfo.rightsExplain != "") {
                            localStorage.setItem(userInfo.province + 'xqBackImg', JSON.stringify(response.configInfo.rightsExplain));
                            //full = sessionStorage.getItem(fullViewAddr + n);
                        }
                        //缓存行权页面背景
                        if(response.configInfo.exerciseAddr != null && response.configInfo.exerciseAddr != undefined || response.configInfo.exerciseAddr != "") {
                            localStorage.setItem(userInfo.province + 'xqBackImg', JSON.stringify(response.configInfo.exerciseAddr));
                            //exer = sessionStorage.getItem(exerciseAddr + n);
                        }
                    }
                    if(!flag){
                        recommendActivity();
    			}
                } else {
                    recommendActivity();
    		 }
            },
            error: function (response) {
                recommendActivity();
           }
        });
    }

    /**
     * 升星
     * */
    function starUp(){
        var starup = {"channelCode":"H5002018","mobile":userInfo.mobile ,"columnSource":"1","token":userInfo.token};
        $.ajax({
            type: 'GET',
            dataType: "JSON",
            timeout: AjaxTimeout,
            url: encodingRedirectUrlForClientUni('/clientuni/services/starLevel/risingStarEffect?reqParam=' + JSON.stringify(starup)),
            success: function (response) {
               // response={"resCode":"200","resDesc":"SUCCESS","status":"1"};
                if (response.resCode == '200' && response.status == '1') {
                    $.util.postJump('124', '50', '', '升星页面');
                    $(".sxnum").html(starLv(userInfo.userLevel));
                    $(".sxbox").slideDown(2000);
                    setTimeout(function() {
                        $('.sxbox').slideUp(2000)
                    }, 5000);
                }
            }
        });
      } //


    /**
     * 推介活动/一周年账单
     * */
    function recommendActivity(){
        var reqParam = {"token":userInfo.token,"channel":userInfo.channel,
                "channelCode":"H5002018","userLevel":userInfo.userLevel,"mobile":userInfo.mobile,"columnSource":"1"
            };
        $.ajax({
            type:"GET",
            dataType:"JSON",
            timeout:"15000",
            url:encodingRedirectUrlForClientUni('/clientuni/services/starLevel/activityRecommend?reqParam='+JSON.stringify(reqParam)),
            success:function(repText){
                /**
                 * status 1:弹 0：不弹
                 * activityUrl 弹窗中按钮地址
                 * effectType 0、1、2、3...对应动画页面,0:直接使用数据中的地址，1~n由h5指定
                 * jumpType 1-星级账单，2-活动 带入弹窗页面参数,1：H5指定，2：接口指定
                 * */
                  // repText = {"resCode":"200","status":"1","effectType":"0","jumpType":"1","activityId":"1150","activityUrl":"https://www.baidu.com/"};
                var reqParam ='',url = '',selector = '';
                if(parseInt(repText.resCode) == 200 && parseInt(repText.status) == 1){
                    repText.effectType = parseInt(repText.effectType);
                    userInfo.jumpType = repText.jumpType;
                    userInfo.activityId = repText.activityId;
                    userInfo.activityUrl = repText.activityUrl;
                    reqParam = '&ReqParam='+JSON.stringify(userInfo);
                    if(repText.effectType == 0){
                        selector = "#iframznq";
                        url = activityUrlList.url0;
                    }else{
                        selector = "#iframedh";
                        url = activityUrlList.url+repText.effectType+'.html?'
                    }
                    $('body iframe'+selector).attr('src',url+reqParam).show();
                }else{
                    businessWin();
                }
            }
            ,error:function(){
                businessWin();
            }
        });
    }

    /**
     * 业务弹窗提醒 文字/文字+按钮
     * */
    function businessWin(){
        var reqParam = {"token":userInfo.token,"channelCode":"H5002018",
                "mobile":userInfo.mobile,"columnSource":"1"
            };
        $.ajax({
            type:"GET",
            dataType:"JSON",
            timeout:"15000",
            url:encodingRedirectUrlForClientUni('/clientuni/services/starLevel/activeRemind?reqParam='+JSON.stringify(reqParam)),
            success:function(repText){
                // repText = {
                //    "resCode":"200","resDesc":"success",
                //    "status":"1","sceneId":"30","modelId":"B","buttonName":"流量查询",
                //    "content":"您好，您名下的18918589195于本月01日行使了手机紧急开机权益。",
                //    "jumpUrl":ip+"tykfh5/modules/businessHandling/queryFlow/index.html"
                // };
                if(parseInt(repText.resCode) == 200 && parseInt(repText.status) == 1){
                    var url = activityUrlList.url+'businessWin.html?',
                        activeParam ={
                            "sceneId":repText.sceneId,"modelId":repText.modelId,"content":repText.content,
                            "jumpUrl":repText.jumpUrl,"buttonName":repText.buttonName
                        };
                    $('body iframe#iframedh').attr('src',url+'ReqParam='+JSON.stringify(userInfo)+'&activeParam='+JSON.stringify(activeParam)).show();
                }
            }
            ,error:function(){}
        });
    }
});