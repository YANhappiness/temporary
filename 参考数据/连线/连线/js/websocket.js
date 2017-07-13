var ws = null;
// console.log(document.location);
// var url= 'ws://'+document.location.host+'/web/websocket/ebox';
var url= 'ws://10.10.10.133:8008/web/websocket/2/3';
// var url= 'ws://localhost';
function websend_fpga(addr,val){
  ws.send(new Int8Array([0xff,0x04,0x00,0x0b,0x00,0x5a,0xa5,0x00,0x30,0xbb,((addr >> 8) & 0xff),(addr & 0xff),((val >> 8) & 0xff),(0xff & val),0x00,0x00]));
}
var getData = new Array();
var getTmp = new Array();

var getVal = new Array();

var serverstate = 0; //服务器当前状态标识 {0:实验主界面;1:文件上传;2:逻辑分析仪显示;3:示波器显示;}
var di = 0,dk = 0;
var ex_index = 0; //实验目录 {1:lcd,2:电机,3:key,4:adda,5:io}
//创建和服务器的WebSocket 链接  
function createSocket(onSuccess) {  
  ws = new WebSocket(url); 
  ws.binaryType = "arraybuffer"; 
  // console.log(ws);
  ws.onopen = function () {  
      ws.send(new Int8Array([0xff,0x00]));
      fileuping = 1;
      serverstate = 1;
      console.log('connected成功');  
      if (onSuccess)  
          onSuccess();  
      // alert("正在下载FPGA文件！请勿操作！");
  }  
  
  ws.onmessage = function (e) {
    // console.log(e);
    getData = new Uint8Array(e.data);
    console.log("getData.length: "+getData.length);
    // console.log("getData: "+getData);
    var dend = 0; //是否到达数据结尾标志
    di = 0;
    // console.log((getData[0] & 0xff),0xfe,getData[1]);
    if(serverstate == 2){
      if((getData[di] == 0xfe) && (getData[di+1] == 0x00))
      {
        // console.log(2);
        di += 2;
        if(di == getData.length)
          dend = 1;
        while(dend != 1){ //未到数据末尾继续执行
          if(getTmp.length < 2048)  //数据接收缓冲未达到2048长度,继续填充
          {
            // console.log(5);
            while((dk != 2048) && (dend != 1))
            {
              if(getTmp.length == 0)
              {
                // console.log(0);
                if((getData[di] == 0x7e) && (getData[di+1] == 0xe7) && (getData[di+2] == 0xe7) && (getData[di+3] == 0x01)){
                  // console.log(3);
                  datastyle = 1;
                  di += 4;
                  dk = getTmp.length;
                  for(;(dk < 2048) && (di < getData.length);di++,dk++)
                  {
                    getTmp[dk] = getData[di] ;
                  }
                  // console.log(di,getData.length);
                  if(di == getData.length)
                  {
                    getData = new Array();
                    di = 0;
                    dend = 1;
                  }
                }else{
                  if(di < getData.length-3)
                    di++;
                  else
                    {di=0;dend = 1;}
                }
              }
              else
              {
                dk = getTmp.length;
                for(;(dk < 2048) && (di < getData.length);di++,dk++)
                {
                  getTmp[dk] = getData[di] ;
                }
                if(di == getData.length)
                {
                  getData = new Array();
                  di = 0;
                  dend = 1;
                }
              }
            }
          }
          if(getTmp.length == 2048) //数据接收缓冲达到2048长度,显示
          {
            // console.log(6);
            getVal = new Array();
            for(var s = 0,m = 0;m < 1024;s+=2,m++)
              getVal[m] = (getTmp[s]) + (getTmp[s+1] << 8);
            
            // console.log(getVal);
            getTmp = new Array();
            dk = 0;

            switch(serverstate){
              case 0:
                
              break;
              case 1:
              break;
              case 2:
                if(logicpause == 1)break;
                // console.log("接收到数据");
                logicdrawline();
                if(ex_index == 5){
                  // console.log("收到逻分数据：0x%s",getVal[100].toString(16));
                  $(".s51_led").each(function(){
                    var i = parseInt($(this).attr("i"));
                    if(iopsetted[i+16] == 0){$(this).attr("fill","transparent");return;}
                    var k = (getVal[100] >> (8+i)) & 1;
                    if(k == 0){
                      $(this).attr("fill","transparent");
                    }else{
                      $(this).attr("fill","red");
                    }
                  });
                }else if(ex_index == 3){
                  // console.log("收到逻分数据：0x%s",getVal[100].toString(16));
                  $(".s51_led").each(function(){
                    var i = parseInt($(this).attr("i"));
                    if(keypsetted[i+9] == 0){return;}
                    var k = (getVal[100] >> (8+i)) & 1;
                    if(k == 0){
                      $(this).attr("fill","transparent");
                    }else{
                      $(this).attr("fill","red");
                    }
                  });
                }else if(ex_index == 4){
                  // console.log("收到逻分数据：0x%s",getVal[100].toString(16));
                  ledshow("s51_led1",((getVal[100] >> 8) & 0x0f) & parseInt(""+addapsetted[10]+""+addapsetted[9]+""+addapsetted[8]+""+addapsetted[7],2));
                  ledshow("s51_led2",(getVal[100] >> 12) & parseInt(""+addapsetted[14]+""+addapsetted[13]+""+addapsetted[12]+""+addapsetted[11],2));
                }
              break;
              // case 3:
              //   oscdrawline();
              //   console.log("接受到数据");
              //   // console.log(getVal);
              // break;
            }
          }
        }
        return;
      }
      else if((getData[di] == 0xfe) && (getData[di+1] == 0xff)){
        di += 4;
        switch((getData[di+1]&0xFF)){
          case 0xF1:
            alert("上传文件有问题");
          break;
          case 0xF9:
            alert("之前下载未完成");
          break;
          case 0xFA:
            alert("实验箱下载超时");
          break;
          case 0xFB:
            alert("发送数据有误");
          break;
          case 0xFC:
            alert("文件丢失");
          break;
          case 0xFD:
            alert("实验箱下载中断");
          break;
          case 0xFE:
            alert("实验箱断开");
          break;
          case 0xFF:
            alert("实验箱异常");
          break;
        }
      }
    }else if(serverstate == 1){
      // console.log(11);
      // FE 0F 00 06      XX      PP   文件下载进度
      //  头   长度   底板编号  进度%
      if(((getData[di] & 0xff) == 0xfe) && ((getData[di+1] & 0xff) == 0x0F) && ((getData[di+2] & 0xff) == 0x00) && ((getData[di+3] & 0xff) == 0x06))
      {
        // console.log(1);
        di += 4;
        // document.getElementById("Status").innerText = "下载中：" + getData[di+1] + "%";
        // document.getElementById("progressOne").value = getData[di+1];
      }
      // FE 01 00 05    XX        文件下载完成
      //  头   长度  底板编号
      else if(((getData[di] & 0xff) == 0xfe) && ((getData[di+1] & 0xff) == 0x01) && ((getData[di+2] & 0xff) == 0x00) && ((getData[di+3] & 0xff) == 0x05))
      {
        di += 4;
        // console.log(12);
        // document.getElementById("Status").innerText = "下载完成!";
        fileuping = 0;
        if(getData[di] == 0){
          $(".md02_t1").text("配置完成");
          setTimeout(function(){$("#module02").modal('hide');},500);
        }else{
          switch(ex_index){
            case 2:
            case 5:
              $(".fileprg").attr("width",120);
              $(".filetext").text("下载中  "+100+"%");
            break;
            case 1:
            case 3:
            case 4:
              $(".fileprg").attr("height",120);
              $(".filetext").text(100);
            break;
          }
          $(".fdl").each(function(){$(this).removeAttr("disabled").val("");});
          alert("下载完成");
          $(".fpc").hide();
          switch(ex_index){
            case 2:
            case 5:
              $(".fileprg").attr("width",0);
              $(".filetext").text("下载中  "+0+"%");
            break;
            case 1:
            case 3:
            case 4:
              $(".fileprg").attr("height",0);
              $(".filetext").text(0);
            break;
          }
          if(ex_index == 3 || ex_index == 5 || ex_index == 4){serverstate = 2}
          clearInterval(setIntsign);
          filepercent = 0;
          websend_fpga(0x1001,0x0001);
        }
      }
      // FE FF LL LL     YY          XX       异常
      //  头   长度  异常状态号   底板编号
      else if(((getData[di] & 0xff) == 0xFE) && ((getData[di+1] & 0xff) == 0xFF)){
        di += 4;
        switch((getData[di]&0xFF)){
          case 0xF1:
            $(".md02_t1").text("上传文件有问题...请刷新重试");
          break;
          case 0xF9:
            $(".md02_t1").text("之前下载未完成...请刷新重试");
          break;
          case 0xFA:
            $(".md02_t1").text("实验箱下载超时...请刷新重试");
          break;
          case 0xFB:
            $(".md02_t1").text("发送数据有误...请刷新重试");
          break;
          case 0xFC:
            $(".md02_t1").text("文件丢失...请刷新重试");
          break;
          case 0xFD:
            $(".md02_t1").text("实验箱下载中断...请刷新重试");
          break;
          case 0xFE:
            $(".md02_t1").text("实验箱断开...请刷新重试");
          break;
          case 0xFF:
            $(".md02_t1").text("实验箱异常...请刷新重试");
          break;
        }
        filestop();
        // document.getElementById("progressOne").value = 0;
        // document.getElementById("Status").innerText = "下载失败!";
        fileuping = 0;
        filepercent = 0;
        // $("#file_ms").removeAttr("disabled");
        $(".fdl").removeAttr("disabled");
      }
      di = 0;
      
    }else if(serverstate == 3){
      if((getData[di] == 0xfe) && (getData[di+1] == 0x00))
      {
        // console.log(2);
        di += 2;
        if(di == getData.length)
          dend = 1;
        while(dend != 1){ //未到数据末尾继续执行
          if(getTmp.length < 2048)  //数据接收缓冲未达到2048长度,继续填充
          {
            // console.log(5);
            while((dk != 2048) && (dend != 1))
            {
              if(getTmp.length == 0)
              {
                // console.log(0);
                if((getData[di] == 0x7e) && (getData[di+1] == 0xe7) && (getData[di+2] == 0xe7) && (getData[di+3] == 0x02)){
                  // console.log(3);
                  datastyle = 1;
                  di += 4;
                  dk = getTmp.length;
                  for(;(dk < 2048) && (di < getData.length);di++,dk++)
                  {
                    getTmp[dk] = getData[di] ;
                  }
                  // console.log(di,getData.length);
                  if(di == getData.length)
                  {
                    getData = new Array();
                    di = 0;
                    dend = 1;
                  }
                }else{
                  if(di < getData.length-3)
                    di++;
                  else
                    {di=0;dend = 1;}
                }
              }
              else
              {
                dk = getTmp.length;
                for(;(dk < 2048) && (di < getData.length);di++,dk++)
                {
                  getTmp[dk] = getData[di] ;
                }
                if(di == getData.length)
                {
                  getData = new Array();
                  di = 0;
                  dend = 1;
                }
              }
            }
          }
          if(getTmp.length == 2048) //数据接收缓冲达到2048长度,显示
          {
            // console.log(6);
            getVal = new Array();
            for(var s = 0;s < 1024;s++)
              getVal[s] = getTmp[s];
            
            // console.log(getVal);
            getTmp = new Array();
            dk = 0;
            switch(ex_index){ 
              case 4:  //51 adda
                oscdrawline_1();
              break;
            }
          }
        }
        return;
      }
      else if((getData[di] == 0xfe) && (getData[di+1] == 0xff)){
        di += 4;
        switch((getData[di+1]&0xFF)){
          case 0xF1:
            alert("上传文件有问题");
          break;
          case 0xF9:
            alert("之前下载未完成");
          break;
          case 0xFA:
            alert("实验箱下载超时");
          break;
          case 0xFB:
            alert("发送数据有误");
          break;
          case 0xFC:
            alert("文件丢失");
          break;
          case 0xFD:
            alert("实验箱下载中断");
          break;
          case 0xFE:
            alert("实验箱断开");
          break;
          case 0xFF:
            alert("实验箱异常");
          break;
        }
      }
    }else{

    }
  }  

  ws.onclose = function (e) { 
    getVal = new Array();
    di = 0;
    switch(serverstate){
      case 0:
      break;
      case 1:
        alert("链接断开，请重新连接！");
      break;
      case 2:
      break;
      case 3:
      break;
    }
    console.log('链接断开');  
  }
  
  ws.onerror = function (e) {  
    getVal = new Array();
    di = 0;
    switch(serverstate){
      case 0:
      break;
      case 1:
        filestop();
      break;
      case 2:
      break;
      case 3:
      break;
    } 
    console.info(e);  
    alert("服务器链接异常，已断开链接");
  }  
}  

