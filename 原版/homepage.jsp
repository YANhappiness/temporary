<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- 标题图标 -->
  <link rel="shortcut icon" href="" type="image/png">

  <title>实验系统</title>

  <link rel="stylesheet" href="css/style.default.css" >
  
  <!-- d3波形样式 -->
  <link rel="stylesheet" href="css/d3-wavestyle.css" media="screen" type="text/css" />
	
	<!-- 右键菜单样式 -->
  <link rel="stylesheet" type="text/css" href="css/context.standalone.css">

  <link rel="stylesheet" href="css/figurecaptions.css" />

  <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!--[if lt IE 9]>
  <script src="js/html5shiv.js"></script>
  <script src="js/respond.min.js"></script>
  <![endif]-->
  <style type="text/css">
		html{
			
		}

	  body{
	  	background: linear-gradient(white, #4ab9a3);;
	  	/*background-repeat: no-repeat;
	  	background-size: 100% 100%;*/
	  	background-attachment: fixed;
	  	
	  }
		
		.enter,.entercover{
			position: absolute;
			height: 50px;
			width: 50px;
			text-align: center;
			border-radius: 10px;
			/*color: white;
			background-image: url('icon/ic01-1.png');
			background-repeat: no-repeat;
	  	background-size: 100% 100%;*/
		}
		
		.img{
			height: 50px;
			width: 50px;
			border-radius: 10px;
		}

		.enter_01,.entercover_01{
			left: 960px;
			top: 460px;
		}

		.enter_02,.entercover_02{
			left: 1040px;
			top: 460px;
		}

		.enter_03,.entercover_03{
			left: 1120px;
			top: 460px;
		}

		.enter_04,.entercover_04{
			left:1200px;
			top: 460px;
		}

		.entercover:hover{
			box-shadow: 0px 0px 10px 10px rgba(255,255,255,0.8);
		}

		.ss{
			height: 400px;
			width: 800px;
			padding: 0;
		}

		figure, .figurefx{
			z-index: 0;
		}

		.figurefx figcaption{
			font-size: 9px;
			zIndex:101;
			opacity:0.4;
			padding:14px 0px;
		}
		
		.modal-dialog{
      text-align:center;
		}

		.tt{
			font-size: 20pt;
			text-align: center;
			padding: 0px;
		}

		.dd{
			padding: 33px 0px;
		}
		
		
  </style>
</head>

<body style="">

<!-- 主界面 -->
<div class="cover" style="position: absolute;background-color: rgba(0,0,0,0);text-align: center;display: table-cell;vertical-align: middle;">
	<div style="position: absolute;padding-left: auto; ">
		<!-- <h1 style="text-align: center;color: yellow;font-size: 30pt;">欢迎使用远程实验系统</h1> -->
		<div class="enter enter_01"><img style="" class="img" id="i01" src="icon/ic01-1.png"></div>
		<div class="entercover entercover_01" id="1" style="color: transparent;z-index: 1000" data-toggle="modal" data-target="#ex1"></div>
		<div class="enter enter_02"><img style="" class="img" id="i02" src="icon/ic02-1.png"></div>
		<div class="entercover entercover_02" id="2" style="color: transparent;z-index: 1000" data-toggle="modal" data-target="#ex1"></div>
		<div class="enter enter_03"><img style="" class="img" id="i03" src="icon/ic03-1.png"></div>
		<div class="entercover entercover_03" id="3" style="color: transparent;z-index: 1000" data-toggle="modal" data-target="#ex1"></div>
		<div class="enter enter_04"><img style="" class="img" id="i04" src="icon/ic04-1.png"></div>
		<div class="entercover entercover_04" id="4" style="color: transparent;z-index: 1000" data-toggle="modal" data-target="#ex1"></div>
		<image style="width:1280px;height: 720px;vertical-align: middle;position: absolute;left: 161px;z-index: -1" src="mainback_2.png" />
		<!-- <button data-toggle="modal" data-target="#ex1">QQ</button> -->
		<div class="led1" ms="8" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 434px;background-color: red"></div>
		<div class="led1" ms="1" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 416px;background-color: red"></div>
		<div class="led1" ms="7" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 577px;background-color: red"></div>
		<div class="led1" ms="2" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 567px;background-color: red"></div>
		<div class="led1" ms="6" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 720px;background-color: red"></div>
		<div class="led1" ms="3" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 718px;background-color: red"></div>
		<div class="led1" ms="5" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 863px;background-color: red"></div>
		<div class="led1" ms="4" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 868px;background-color: red"></div>

		<div class="led" ms="8" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 359px;background-color: lime"></div>
		<div class="led" ms="1" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 338px;background-color: lime"></div>
		<div class="led" ms="7" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 503px;background-color: lime"></div>
		<div class="led" ms="2" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 489px;background-color: lime"></div>
		<div class="led" ms="6" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 647px;background-color: lime"></div>
		<div class="led" ms="3" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 640px;background-color: lime"></div>
		<div class="led" ms="5" style="position: absolute;height: 4px;width: 8px;top: 272px;left: 790px;background-color: lime"></div>
		<div class="led" ms="4" style="position: absolute;height: 4px;width: 8px;top: 449px;left: 790px;background-color: lime"></div>
	</div>
</div>


<!-- 物理实验 -->
<div class="modal fade" id="ex1" tabindex="-1" role="dialog"  aria-hidden="true" >
	<div class="modal-dialog ss"><div class="modal-content ss">
	<div class="modal-header" style="padding: 0">
		<div class="dd btn btn-black" id="0" style="height: 100px;width: 800px;">
				<span class="tt">原理实验</span>
			</div>
	</div>
	<div class="modal-body ss">		
		<div style="height: 400px;width: 800px;background-color: transparent;position: absolute;">
			<div class="dd btn btn-lightblue" id="1" style="height: 100px;width: 400px;position: absolute;top: 0px;left: 0px;">
				<span class="tt">信源编译码与时分复用实验</span>
			</div>
			<div class="dd btn btn-maroon" id="2" style="height: 100px;width: 400px;position: absolute;top: 0px;left: 400px;">
				<span class="tt">信道编译码实验</span>
			</div>
			<div class="dd btn btn-darkblue" id="3" style="height: 100px;width: 400px;position: absolute;top: 100px;left: 0px;">
				<span class="tt">二进制数字调制解调</span>
			</div>
			<div class="dd btn btn-warning" id="4" style="height: 100px;width: 400px;position: absolute;top: 100px;left: 400px;">
				<span class="tt">多进制调制解调</span>
			</div>
			<div class="dd btn btn-success" id="5" style="height: 100px;width: 400px;position: absolute;top: 200px;left: 0px;">
				<span class="tt">基带传输实验</span>
			</div>
			<div class="dd btn btn-brown" id="6" style="height: 100px;width: 400px;position: absolute;top: 200px;left: 400px;">
				<span class="tt">同步技术实验</span>
			</div>
			<div class="dd btn btn-orange" id="7" style="height: 100px;width: 400px;position: absolute;top: 300px;left: 0px;">
				<span class="tt">信道特性研究实验</span>
			</div>
			<div class="dd btn btn-danger" id="8" style="height: 100px;width: 400px;position: absolute;top: 300px;left: 400px;">
				<span class="tt">伪随机序列特性研究及扩频通信</span>
			</div>
		</div>	
	</div></div></div>
	
</div>

<!-- 过度动画 -->
<style type="text/css">
	@keyframes my_1
	{
		0%{transform: rotateX(0deg);}
		50%{transform: rotateX(180deg);}
		100%{transform: rotateX(360deg);}
	}

	@keyframes my_2
	{
		0%{transform: rotateX(360deg);}
		50%{transform: rotateX(180deg);}
		100%{transform: rotateX(0deg);}
	}
</style>

<!-- 示波器界面 -->







<!-- 文件上传界面 -->


<script src="js/d3.v3.min.js"></script>
<script src="js/jquery-1.11.1.min.js"></script>
<script src="js/jquery-migrate-1.2.1.min.js"></script>
<script src="js/bootstrap.js"></script>
<script src="js/modernizr.min.js"></script>
<script src="js/jquery.sparkline.min.js"></script>
<script src="js/toggles.min.js"></script>
<script src="js/retina.min.js"></script>
<script src="js/jquery.cookies.js"></script>
<script src="js/custom.js"></script>

<script src="js/jquery.focus-follow.js"></script>

<script src="js/TweenMax.min.js"></script>
<script src="js/figurecaptions.js"></script>
<script src="js/cookie.js"></script>

<script type="text/javascript">
  // 目录文本
  var dd_text = [["原理实验","信源编译码与时分复用实验","信道编译码实验","二进制数字调制解调","多进制调制解调","基带传输实验","同步技术实验","信道特性研究实验","伪随机序列特性研究及扩频通信"],
                ["信源编译码与时分复用实验","PAM调制与抽样定理实验","PCM编译码实验","增量调制（CVSD）编译码","时分复用/解复用（TDM）实验"],
                ["信道编译码实验","汉明码编译码及纠错性能验证","卷积码编译码及纠错性能验证","循环码编译码及纠错能力验证","交织编译码及纠错能力验证"],
                ["二进制数字调制解调","ASK调制解调","FSK调制解调","PSK调制解调","DPSK调制解调"],
                ["多进制调制解调","QPSK调制解调","OQPSK调制解调","DQPSK调制解调实验","QPSK成型调制解调","MSK调制解调","16QAM调制解调"],
                ["基带传输实验","码型变换","线路编译码","基带传输及眼图观测","基带成型与抽样判决实验"],
                ["同步技术实验","载波同步实验","位同步提取实验","帧同步实验"],
                ["信道特性研究实验","高斯白噪声信道特性研究","衰落信道特性研究","多径信道特性研究"],
                ["伪随机序列特性研究及扩频通信","伪随机序列产生及特性研究","扩频与解扩实验","码分多址(CDM)系统实验","跳频通信实验"]];

  // 目录链接
  var dd_link = [["","","","","","","","",""],
                ["","","exPCM.html","exCVSD.html","","","","",""],
                ["","ex2-1.html","ex2-2.html","","ex2-4.html","","","",""],
                ["","","","","","","","",""],
                ["","","","exDQPSK.html","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""]];
  var dd_msign_1 = 0; //目录层级
  var dd_sign_1 = 0; //第一层点击位置

  // 目录事件
  $(".dd").click(function(){
    // console.log(1,dd_msign_1);
    var i = parseInt($(this).attr("id"));
    if(i == 0){return;}
    var length = dd_text[i].length;
    console.log(length);
    if(dd_msign_1 == 0){
      // console.log(2);
      dd_msign_1 = 1;
      dd_sign_1 = i;
      $(".dd").each(function(){
        var _i = parseInt($(this).attr("id"));
        $(this).css("animation","my_1 1s");
        $(this).children("span").fadeOut(500,function(){$(this).text(function(){return (_i == 8) ? "返回" : ((_i >= length) ? "" : dd_text[i][_i])})});
        $(this).children("span").fadeIn(500);
        if(_i != 8){
          // console.log(_i);
          $(this).parent("a").attr("href","javascript:void(0)");
        }
      });
      return;
    }
    else if((dd_msign_1 == 1) && (i == 8) ){
      dd_msign_1 = 0;
      dd_sign_1 = 0;
      $(".dd").each(function(){
        var _i = parseInt($(this).attr("id"));
        $(this).css("animation","my_2 1s");
        $(this).children("span").fadeOut(500,function(){$(this).text(function(){return (_i > 8) ? "" : dd_text[0][_i]});});
        $(this).children("span").fadeIn(500); 
        $(this).parent("a").attr("href","javascript:void(0)");
        
      });

    }else if(dd_msign_1 == 1){
      if(dd_link[dd_sign_1][i] == ""){return;}
      location.href= dd_link[dd_sign_1][i];
    }
    return;

    // $(this).css("animation","my_2 2s");
    // $(this).animate({transform:'rotateX(+=180deg)'},2000);
    // // $(this).css("animation","");
  });
</script>



<!-- 页面初始和重置事件 -->
<script type="text/javascript">
$(function(){
	// 设置文字不可被选中
  document.onselectstart = function(){return false;}

	$(window).load(function(){
		// console.log($(document).height());
		$(".cover").css({"height":window.innerHeight,"width":window.innerWidth});

    // 实验页面返回时 接收参数判断打开哪个目录
    if(location.search != ""){  
      (function(){
        var i = location.search[4];
        $(".entercover_01").click();
        $(".dd[id="+i+"]").click();
      })();
    }

	});

	$(window).resize(function(){
		// console.log($(document).height());
		// console.log("window resize");
		$(".cover").css({"height":window.innerHeight,"width":window.innerWidth});
		
	});


});
var leddata = [{sstime:0,intervalid:0,index:1,state:0},{sstime:0,intervalid:0,index:2,state:0},
               {sstime:0,intervalid:0,index:3,state:0},{sstime:0,intervalid:0,index:4,state:0},
               {sstime:0,intervalid:0,index:5,state:0},{sstime:0,intervalid:0,index:6,state:0},
               {sstime:0,intervalid:0,index:7,state:0},{sstime:0,intervalid:0,index:8,state:0}];
function led(i){
    if(leddata[i-1].sstime == 0){
      $(".led[ms="+i+"]").css("background-color","gray");
      leddata[i-1].sstime = 1;
    }else{
      $(".led[ms="+i+"]").css("background-color","lime");
      leddata[i-1].sstime = 0;
    }
}

function ledset(){
  for(var i = 1;i <= 8;i++){
    if(leddata[i-1].state == 0){
      $(".led[ms="+i+"]").css("background-color","gray");
      $(".led1[ms="+i+"]").css("background-color","gray");
      clearInterval(leddata[i-1].intervalid);
    }else{
      $(".led1[ms="+i+"]").css("background-color","red");
      if(leddata[i-1].intervalid == 0)
        leddata[i-1].intervalid = setInterval(led,500,i);
    }
    // console.log(i,leddata[i-1]);
  }
}


</script>

<!-- websocket链接创建 -->
<script type="text/javascript">
  var ws = null;

  var url= 'ws://'+document.location.host+'${pageContext.request.contextPath}'+'/websocket/ycwx';
  
  setCookie('ws',url,24);
//  var url= 'ws://'+document.location.host+'/server/websocket/ycwx';
  var getData =new Array();

  function websend_fpga(addr,val){
    ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,((addr >> 8) & 0xff),(addr & 0xff),((val >> 8) & 0xff),(0xff & val),0x00,0x00]));
  }

  //创建和服务器的WebSocket 链接  

  function createSocket(onSuccess) { 
      ws = new WebSocket(url); 
      ws.binaryType = "arraybuffer"; 
      ws.onopen = function () {  
          console.log('connected成功');  
          if (onSuccess)  
              onSuccess();  
      }  

      ws.onmessage = function (e) {
        getData = new Int8Array(e.data);
        console.log(getData);
        var di = 0;
        if(getData[di] == -2 && getData[di+1] == -2){
          di += 5;
          for(var i = 0;di < getData.length;di++,i++){
            // console.log(i,di);
            leddata[i].state = getData[di];
          }
          // console.log(leddata);
          ledset();
        }
        // console.log(leddata);
      }  

      ws.onclose = function (e) { 
        console.log('链接断开');  
      } 
       
      ws.onerror = function (e) {  
        console.info(e);  
        alert("服务器链接异常，已断开链接");
      }  
  }
  createSocket();
</script>

<!-- WebSocket上传  -->

<!-- 示波器波形 -->

<!--  -->
<script type="text/javascript">
	$(function() {
		$(".entercover").each(function(){
			$(this).mouseover(function(){
				$("#i0"+$(this).attr("id")).mouseover();
			});
			$(this).mouseleave(function(){
				$("#i0"+$(this).attr("id")).mouseleave();
			});
		});

		$('#i01').addCaption({
			fx: 'dualpanels',
			caption: '原理实验',
			duration: 0.3
		});

		$('#i02').addCaption({
			fx: 'dualpanels',
			caption: '扩展实验',
			duration: 0.3
		});

		$('#i03').addCaption({
			fx: 'dualpanels',
			caption: '实验设置',
			duration: 0.3
		});

		$('#i04').addCaption({
			fx: 'dualpanels',
			caption: '退出实验',
			duration: 0.3
		});

		// $(".img").click(function(){
		// 	console.log("click img");
		// });

		// $(".enter").click(function(){
		// 	console.log("click enter");
		// });

		// $(".figurefx").click(function(){
		// 	console.log("click figurefx");

		// });
	});
</script>



</body>
</html>
