var ws = null;
var url= 'ws://10.10.10.250:8008/server/websocket/ycwx';
// var url= 'ws://10.10.10.133:8018/server/websocket/ycwx';
var deviceId; //底板模块号
var getTmp = new Array();
var getVal = new Array();
var getData =new Uint8Array();
var getWaveData1 = new Array();
var getWaveData2 = new Array();
var getWaveData3 = new Array();
var getWaveData4 = new Array();

var serverstate = 0; //服务器当前状态标识 {0:主界面;1:示波器界面;2:信号源界面;3:PCM CVSD FFT;4:逻分;11:程序下载}
var di = 0,dk = 0,datach = 0;
var osc_time;
var datachV = new Array(),data_length = new Array(),osc_eye = new Array(),datastyle=[0,0,0,0];

var pcm_sp = 0;pcm_d = 0;

//发送函数{deviceId:底板模块号 addr:寄存器地址 val:值 }
function websend_fpga(addr,val){
  ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,((addr >> 8) & 0xff),(addr & 0xff),((val >> 8) & 0xff),(0xff & val),0x00,0x00]));
}
function websend_fpga_id(addr,val,id){
  ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & id),0x5a,0xa5,0x00,0x30,0xbb,((addr >> 8) & 0xff),(addr & 0xff),((val >> 8) & 0xff),(0xff & val),0x00,0x00]));
}

//创建和服务器的WebSocket 链接  

function createSocket(onSuccess) { 
    ws = new WebSocket(url); 
    ws.binaryType = "arraybuffer"; 
    ws.onopen = function () {  
        // ws.send(new Int8Array([0xff,0x00]));
        console.log('connected成功');  
        if (onSuccess)  
            onSuccess();  
    }  

    ws.onmessage = function (e) {
      getData = new Uint8Array(e.data);
      console.log(getData.length);

      switch(serverstate){
        case 1:
          // console.log(0);
          if(((getData[di] & 0xff) == 0xfe) && ((getData[di+1] & 0xff) == 0x02))
          {
            // console.log(1);
            di += 5;

            if(((getData[di] & 0xff) == 0xa6) && ((getData[di+1] & 0xff) == 0x00))
            {
              // console.log(2);
              di += 2;
              for(var i = 0;i < 1500 ;i++)
              {
                getWaveData1[i] = getData[di + i];
              }
              di += 1500;
            }

            if(((getData[di] & 0xff) == 0xa6) && ((getData[di+1] & 0xff) == 0x01))
            {
              // console.log(3);
              di += 2;
              for(var i = 0;i < 1500 ;i++)
              {
                getWaveData2[i] = getData[di + i];
              }
              di += 1500;
            }

            if(((getData[di] & 0xff) == 0xa6) && ((getData[di+1] & 0xff) == 0x02))
            {
              // console.log(4);
              di += 2;
              for(var i = 0;i < 1500 ;i++)
              {
                getWaveData3[i] = getData[di + i];
              }
              di += 1500;
            }

            if(((getData[di] & 0xff) == 0xa6) && ((getData[di+1] & 0xff) == 0x03))
            {
              // console.log(5);
              di += 2;
              for(var i = 0;i < 1500 ;i++)
              {
                getWaveData4[i] = getData[di + i];
              }
              di += 1500;
            }

            di = 0;
            // console.log("ws serverstate:1 oscMd_choose");
            switch(oscMd){
              case 0:
                if(osc_step_sign == 1){
                  $('.oscstknob').children('path').attr('fill','#FF0000');
                  $('#osc_knob_single').children('path').attr('fill','transparent');
                }
                oscdrawline();
              break;
              case 1:
              break;
              case 2:
                osceyeline();
              break;
              case 3:
                oscxyline();
              break;
            }

          }
          else{
            di = 0;
          }
        break;

        case 3:
          if(((getData[di] & 0xff) == 0xfe) && ((getData[di+1] & 0xff) == 0x03)){
            // console.log(1);

            di += 6;
            if(pcm_cvsd_sign == 1)
            {
              // console.log("PCM");
              $(".md3TT5").text("PCM调制");
              $(".md3TT2").attr("fill","lime").text("抽样信号");
              $(".md3TT3").text("量化信号");

              getWaveData1 = new Array();
              getWaveData2 = new Array();
              getWaveData3 = new Array();

              for(dk = 0;dk < 1024;dk++,di++)
              {
                getWaveData1[dk] = getData[di];
              }

              pcm_sp = getData[di];
              // console.log(pcm_sp);
              pcm_d = getData[di+1];
              di+=2;
              for(dk = 0;dk < 32;dk++,di++)
              {
                getWaveData2[dk] = getData[di];
              }

              for(dk = 0;dk < 32;dk++,di++)
              {
                getWaveData3[dk] = getData[di];
              }
              di = 0;
              dk = 0;
              oscdrawline4();
            }
            else if(pcm_cvsd_sign == 2){
              // console.log("CVSD");
              $(".md3T").text("");
              $(".md3T2").text("");
              $(".md3L").attr("y2",1731/4096*pcsdsvgheight);
              $(".md3TT5").text("CVSD调制");
              $(".md3TT2").attr("fill","rgb(104,104,104)").text("量化噪声");
              $(".md3TT3").text("本地译码");
              

              getWaveData1 = new Array();
              getWaveData2 = new Array();
              getWaveData3 = new Array();

              for(dk = 0;dk < 1024;dk++,di++)
              {
                getWaveData1[dk] = getData[di];
              }

              for(dk = 0;dk < 128;dk++,di++)
              {
                getWaveData2[dk] = getData[di];
              }

              for(dk = 0;dk < 32;dk++,di++)
              {
                getWaveData3[dk] = getData[di];
              }
              di = 0;
              dk = 0;
              oscdrawline3();
            }
            else if(pcm_cvsd_sign == 11){
              // console.log("FFT");
              getWaveData1 = new Array();
              getWaveData2 = new Array();
              getWaveData3 = new Array();

              // console.log(getData);

              for(dk = 0;dk < 512;dk++,di++)
              {
                getWaveData1[dk] = getData[di];
              }
              di = 0;
              dk = 0;
              oscdrawline5();
            }
          }
        break;
        
        case 4:
          if((getData[di] == 0xfe) && (getData[di+1] == 0x00))
          {
            // console.log(2);
            di += 5;
                  
            // console.log(0);
            if((getData[di] == 0x7e) && (getData[di+1] == 0xe7) && (getData[di+2] == 0xe7) && (getData[di+3] == 0x01)){
              // console.log(3);
              di += 4;
              for(dk = 0;di < getData.length;di++,dk++)
              {
                getTmp[dk] = getData[di] ;
              }

            }else{
              return;
            }
              
            // console.log(6);
            getVal = new Array();
            for(var s = 0,m = 0;m < 1024;s+=2,m++)
            getVal[m] = (getTmp[s]) + (getTmp[s+1] << 8);
            
            // console.log(getVal);
            getTmp = new Array();
            dk = 0;
            di = 0;
            logicdrawline();              
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
        break;

        case 11:
          // console.log(11);
          if(((getData[di] & 0xff) == 0xfe) && ((getData[di+1] & 0xff) == 0x0F) && ((getData[di+2] & 0xff) == 0x00) && ((getData[di+3] & 0xff) == 0x06))
          {
            // console.log(1);
            di += 4;
            // document.getElementById("Status").innerText = "下载中：" + getData[di+1] + "%";
            // document.getElementById("progressOne").value = getData[di+1];
          }
          else if(((getData[di] & 0xff) == 0xfe) && ((getData[di+1] & 0xff) == 0x01) && ((getData[di+2] & 0xff) == 0x00) && ((getData[di+3] & 0xff) == 0x05))
          {
            // console.log(12);
            // document.getElementById("Status").innerText = "下载完成!";
            fileuping = 0;

            // $("#file_ms").removeAttr("disabled");
            $(".fdl").each(function(){$(this).removeAttr("disabled").val("");});
            alert("下载完成");
          }
          else if(((getData[di] & 0xff) == 0xFE) && ((getData[di+1] & 0xff) == 0xFF)){
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
            filestop();
            // document.getElementById("progressOne").value = 0;
            // document.getElementById("Status").innerText = "下载失败!";
            fileuping = 0;
            // $("#file_ms").removeAttr("disabled");
            $(".fdl").removeAttr("disabled");
          }
          di = 0;
        break;
      }

    }  

    ws.onclose = function (e) { 
      
      switch(serverstate){
        case 0:
        break;
        case 1:
          
        break;
        case 2:
        break;
        case 3:
        break;
      }
      console.log('链接断开');  
    } 
     
    ws.onerror = function (e) {  
      
      switch(serverstate){
        case 0:
        break;
        case 1:
          
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