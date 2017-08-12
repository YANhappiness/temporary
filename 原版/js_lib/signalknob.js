var sig_modal = 0x00; //信源模式{0:SINE,1:SQU,2:TRI,3:HALF,4:WHOLE,5:TOOTH,6:复杂波形,7:音乐,8:FM,9:AM,10:DSB,11:SWEEP} 
var sig_km_1 = 1; //档位模式{1:X100,2:X1K,3:X10K}
var sig_km_2 = 1; //调节模式{1:频率,2:幅度}

var sig_unit_sign = 1; //有无K标志{有K为0}
var sig_textVal = [],sig_keyL = [];

var sigmdown = false;
var sigmover = false;
var sigmwheel = 0;
var sigtarget = 0;

var sigknobp0 = {
  x:0,
  y:0,
  tan:0
};
var sigknobp1 = {
  x:0,
  y:0,
  tan:0
}





$(function () {
  function sigonMouseDown(event) {
    sigmdown = true;
    sigknobp0.x = event.pageX - $(".sigknobp",$(this)).offset().left;
    sigknobp0.y = event.pageY - $(".sigknobp",$(this)).offset().top;
    sigknobp0.tan = sigknobp0.y/sigknobp0.x;
    // console.log(0,sigknobp0.y/sigknobp0.x);
    // console.log(0,(event.pageX - $(".sigknobp",$(this)).offset().left),(event.pageY - $(".sigknobp",$(this)).offset().top));
  };

  function sigonMouseUp(event) {
    sigmdown = false;
  };

  function sigonMouseMove(event) {
    if (sigmdown) {
      sigknobp1.x = event.pageX - $(".sigknobp",$(this)).offset().left;
      sigknobp1.y = event.pageY - $(".sigknobp",$(this)).offset().top;
      sigknobp1.tan = sigknobp1.y/sigknobp1.x;
      if(sigknobp1.x*sigknobp0.x > 0)
      {
        if(sigknobp1.tan > sigknobp0.tan)
          sigmwheel = 1;
        else if(sigknobp1.tan < sigknobp0.tan)
          sigmwheel = -1;
      }
      else if(sigknobp1.x*sigknobp0.x < 0)
      {
        if(sigknobp1.tan > sigknobp0.tan)
          sigmwheel = -1;
        else if(sigknobp1.tan < sigknobp0.tan)
          sigmwheel = 1;
      }
      sigknobp0.x = sigknobp1.x;
      sigknobp0.y = sigknobp1.y;
      sigknobp0.tan = sigknobp1.tan;
      sigsetWheelPosition(-sigmwheel,$(this).attr("id"));
      // console.log(1,(event.pageX - $(".sigknobp",$(this)).offset().left),(event.pageY - $(".sigknobp",$(this)).offset().top));
      // console.log(1,sigmwheel);
    }
  };

  function sigonMouseOver(){
    // console.log(1);
    $("#signal").css({
      "overflow-y":"hidden"
    });
    
    sigmover = true;        
  }

  function sigonMouseLeave(event) {
    $("#signal").css({
      "overflow-y":"scroll"
    });
      
    sigmover = false;
    sigmwheel = 0;
  };

  
  function sigsetWheelPosition(value,i) {
    // console.log(4,i);
    // if(value == 1){console.log("down");} 
    // else{console.log("up");}

    switch(i)
    {
      case "kn1":
        // console.log(1);
        if(sig_km_2 == 1){
          
          console.log(sig_textVal[deviceId][0],sig_keyL);
          sig_textVal[deviceId][0] = Math.round(sig_textVal[deviceId][0] + value * sig_keyL[deviceId]);
          
          if(sig_textVal[deviceId][0] < 0){
            sig_textVal[deviceId][0] = 0;
            $("#unit_1").hide();
            sig_unit_sign = 1; 
            document.getElementById("val").innerHTML = sig_textVal[deviceId][0];
          }else if(sig_textVal[deviceId][0] > 99999){
            $("#unit_1").show();
            sig_unit_sign = 0;
            document.getElementById("val").innerHTML = sig_textVal[deviceId][0] / 1000;
          }else if(sig_textVal[deviceId][0] > 200000){
            sig_textVal[deviceId][0] = 200000;
            $("#unit_1").show();
            sig_unit_sign = 0;
            document.getElementById("val").innerHTML = sig_textVal[deviceId][0] / 1000;
          }
          else{
            $("#unit_1").hide();
            sig_unit_sign = 1;
            document.getElementById("val").innerHTML = sig_textVal[deviceId][0];
          }
          sigsend_fre(sig_textVal[deviceId][0]);
        }
        else if(sig_km_2 == 2){
          sig_textVal[deviceId][1] += value;
          if(sig_textVal[deviceId][1] < 0){
            sig_textVal[deviceId][1] = 0;
            document.getElementById("val").innerHTML = 0;
          }else if(sig_textVal[deviceId][1] > 99){
            sig_textVal[deviceId][1] = 99;
            document.getElementById("val").innerHTML = 99;
          }else{
            document.getElementById("val").innerHTML = sig_textVal[deviceId][1];
          }

          sigsend(sig_textVal[deviceId][1]);
        }
        
      break;

    }

    
  }

  // console.log(d3.selectAll(".sigknob"));
  $(".sigknob").each(function(){
    $(this).on("mousedown", sigonMouseDown);
    $(this).on("mousemove", sigonMouseMove);
    $(this).on("mouseover", sigonMouseOver);
    $(this).on("mouseleave", sigonMouseLeave);
    $("body").on("mouseup", sigonMouseUp);
    $(this).get(0).addEventListener("mousewheel",function() {
      
      // event = event || window.event;
      if(event.wheelDelta > 0 || event.detail < 0){
        //向上滚

        // console.log("up");
        sigmwheel = -1;
      } 
      if(event.wheelDelta < 0 || event.detail > 0){
        //向下滚
        
        // console.log("down");
        sigmwheel = 1;
      }
      sigsetWheelPosition(-sigmwheel,$(this).attr("id"));
    });
    $(this).get(0).addEventListener("DOMMouseScroll",function() {
      
      // event = event || window.event;
      if(event.wheelDelta > 0 || event.detail < 0){
        //向上滚

        console.log("up");
        sigmwheel = -1;
      } 
      if(event.wheelDelta < 0 || event.detail > 0){
        //向下滚
        
        console.log("down");
        sigmwheel = 1;
      }
      sigsetWheelPosition(-sigmwheel,$(this).attr("id"));
    });
  });


  //按键事件
  
  


  $(".sig_key").each(function(){
    $(this).click(function(){
      // console.log(1);
      var s = parseInt($(this).attr("id"));
      if(sig_modal != s){
        // console.log($(".sig_key[id="+sig_modal+"]"));
        $(".sig_key[id='"+sig_modal+"']").find("text").attr("fill","silver");
        $(".sig_key[id='"+sig_modal+"']").find("path").attr("stroke","silver");
        sig_modal = s;
        $(this).find("text").attr("fill","lime");
        $(this).find("path").attr("stroke","lime");

        sigsend_mod();
      }
    });
  });

  $(".sig_key_1").each(function(){
    $(this).click(function(){
      // console.log(1);
      var s = parseInt($(this).attr("id"));
      if(sig_modal != s){
        $(".sig_key_1[id='"+sig_km_1+"']").find("text").attr("fill","silver");
        sig_km_1 = s;
        $(this).find("text").attr("fill","lime");
        sig_keyL[deviceId] = (sig_km_1 == 1) ? 100 : ((sig_km_1 == 2) ? 1000 : 10000);
        // sigsend_mod();
      }
    });
  });

  $(".sig_key_2").each(function(){
    $(this).click(function(){
      // console.log(1);
      var s = parseInt($(this).attr("id"));
      if(sig_modal != s){
        $(".sig_key_2[id='"+sig_km_2+"']").find("text").attr("fill","silver");
        sig_km_2 = s;
        $(this).find("text").attr("fill","lime");
        if(sig_km_2 == 1){
          $("#unit").show();
          if(sig_textVal[deviceId][0] < 0){
            sig_textVal[deviceId][0] = 0
            $("#unit_1").hide();
            sig_unit_sign = 1; 
            document.getElementById("val").innerHTML = sig_textVal[deviceId][0];
          }else if(sig_textVal[deviceId][0] > 99999){
            $("#unit_1").show();
            sig_unit_sign = 0;
            document.getElementById("val").innerHTML = sig_textVal[deviceId][0] / 1000;
          }else{
            $("#unit_1").hide();
            sig_unit_sign = 1;
            document.getElementById("val").innerHTML = sig_textVal[deviceId][0];
          }
        }else if(sig_km_2 == 2){
          console.log(sig_textVal);
          document.getElementById("val").innerHTML = sig_textVal[deviceId][1];
          $("#unit").hide();
          $("#unit_1").hide();
        }
      }

    });
  });

    
});

//发送

function sigsend(v){
  ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & deviceId),0x5a,0xa5,0x00,(0xd0 | sig_km_2),(0xff & deviceId),(0xff & v),0x00,0x00,0x00,0x00,0x00]));
}


function sigsend_mod(){
  ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & deviceId),0x5a,0xa5,0x00,0xd0,0x01,(0xff & sig_modal),0x00,0x00,0x00,0x00,0x00]));
}

function sigsend_fre(v){
  ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & deviceId),0x5a,0xa5,0x00,0xd1,(0xff & deviceId),(0xff & (v >> 24)),(0xff & (v >> 16)),(0xff & (v >> 8)),(0xff & v),0x02,0x00]));
}