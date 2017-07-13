// 创建51连线点

// var s51pdata = new Array(32);

d3.select("#pic_s51")
  .append("g")
  .attr("class","51poonts")
  .attr("transform","translate(172,170)")
  .selectAll("g")
  .data(new Array(4))
  .enter()
  .append("g")
  .attr("class",function(d,i){
    return "51pg"+i;
  })
  .attr("transform",function(d,i){
    var t = ["(106,17)","(0,0)","(106,205)","(0,154)"];
    return "translate"+t[i];
  })
  .each(function(d,i){
    var _i = i
    d3.select(this)
      .selectAll("circle")
      .data(new Array(8))
      .enter()
      .append("circle")
      .attr({
        i:function(d,i){return _i*8+i;},
        class:"pt0",
        ms:function(d,i){return _i*8+i;},
        val:function(d,i){if(_i == 2){return (_i*16+(7-i));}return _i*16+i},
        cx:7,
        cy:function(d,i){return 7+i*17.2;},
        r:7,
        fill:"transparent",
        stroke:"black"
      })
  });

//创建ADDA连线点
d3.select("#pic_s51")
  .append("g")
  .attr("class","addapoints")
  .attr("transform","translate(27,95)")
  .selectAll("circle")
  .data([{cx:97,cy:11},{cx:131.3,cy:11},{cx:165.5,cy:11},{cx:246,cy:9},{cx:272,cy:9},{cx:301,cy:9},{cx:331.5,cy:9},
        {cx:11,cy:254},{cx:35.5,cy:254},{cx:60,cy:254},{cx:84.5,cy:254},{cx:343.5,cy:254},{cx:368,cy:254},{cx:392.5,cy:254},{cx:417,cy:254}])
  .enter()
  .append("circle")
  .attr({
    class:"pt1",
    addr:function(d,i){if(i<7){return "0x"+(0x2041+i).toString(16);}else{return "0x"+(0x1019+i-7).toString(16);}},
    ms:function(d,i){return i;},
    val:function(d,i){return i;},
    cx:function(d,i){return d.cx},
    cy:function(d,i){return d.cy},
    r:11,
    fill:"transparent",
    stroke:"black"
  });

// 数码管
d3.select("#pic_s51")
  .append("g")
  .attr("class","s51_ledg")
  .selectAll("g")
  .data(["(41,228)","(373.3,228)"])
  .enter()
  .append("g")
  .attr({
    transform:function(d,i){return "translate"+d;},
    class:function(d,i){return "s51_led"+(i+1)},
  })
  .each(function(d,i){
    d3.select(this).selectAll("rect")
      .data([{x:12,y:0},{x:12,y:47},{x:12,y:92},{x:55,y:7},{x:55,y:52.5},{x:0,y:52.5},{x:0,y:7}])
      .enter()
      .append("rect")
      .attr({
        height:function(d,i){if(i < 3){return 11;}else{return 44;}},
        width:function(d,i){if(i < 3){return 43;}else{return 11;}},
        x:function(d,i){return d.x;},
        y:function(d,i){return d.y;},
        rx:4,
        fill:"white",
        stroke:"black",
        "stroke-width":0.5,
        i:function(d,i){return i;},
      });
  });

function ledshow(selector,val){
  // console.log("ledshow",selector,val);
  var arr = new Array(7);
  switch(val){
    case 0:
      arr = [1,0,1,1,1,1,1];
    break;
    case 1:
      arr = [0,0,0,1,1,0,0];
    break;
    case 2:
      arr = [1,1,1,1,0,1,0];
    break;
    case 3:
      arr = [1,1,1,1,1,0,0];
    break;
    case 4:
      arr = [0,1,0,1,1,0,1];
    break;
    case 5:
      arr = [1,1,1,0,1,0,1];
    break;
    case 6:
      arr = [1,1,1,0,1,1,1];
    break;
    case 7:
      arr = [1,0,0,1,1,0,0];
    break;
    case 8:
      arr = [1,1,1,1,1,1,1];
    break;
    case 9:
      arr = [1,1,1,1,1,0,1];
    break;
    case 10:
      arr = [1,1,0,1,1,1,1];
    break;
    case 11:
      arr = [0,1,1,0,1,1,1];
    break;
    case 12:
      arr = [0,1,1,0,0,1,0];
    break;
    case 13:
      arr = [0,1,1,1,1,1,0];
    break;
    case 14:
      arr = [1,1,1,0,0,1,1];
    break;
    case 15:
      arr = [1,1,0,0,0,1,1];
    break;
  }
  $("."+selector).children("rect").each(function(){
    var i = $(this).attr("i");
    if(arr[i] == 0){
      $(this).attr("fill","white");
    }else{
      $(this).attr("fill","red");
    }
  });
}

// for(i = 0;i < 16;i++){
//   setTimeout(ledshow,i*1000,"s51_led1",i); 
// }


// 拖拽
var svgdrag01 = d3.behavior.drag()
      .origin(function(d){
        return {x:d.x,y:d.y};
      })
      .on("drag",function(d){
        d3.select(this).attr("transform",function(){
          // console.log(d3.event);
          d.x = d3.event.x;
          d.y = d3.event.y;
          return "translate("+d3.event.x+","+d3.event.y+")";
        });
      });
// d3.select("#pic_s51").data([{x:500,y:20}]).call(svgdrag01);
// d3.select("#pic_lcd").data([{x:500,y:20}]).call(svgdrag01);

// 缩放
var svgzoom01 = d3.behavior.zoom()
      .center([0,0])
      .on("zoom",function(){
        // console.log(d3.event.scale,d3.event.translate);
        d3.select(this).attr("transform","scale("+d3.event.scale+")"+"translate("+d3.event.translate+")");
      });

// d3.select("#pic_ep").call(svgzoom01);

//连线
var maplinelock = 0;   //连线状态 {0：普通状态,1-8：连线状态}
var settedpoints = "",onchangept = "";
var stpoints = {x:"",y:""};
var edpoints = {x:"",y:""};
var onchangeg,onchangeline,onchangeline2;
var s51psetted = new Array(),addapsetted = new Array(),oscp01setted = new Array(),logpsetted = new Array(),
    s51_setsign = 0,osc_setsign = 0,log_setsign = 0;
var log_lcolor = ["#d6d630","#888834","#32BF32","#525252","#1D83D1","#35C235","#525252","#DA3434"];

for(var i=0 ;i < 32;i++){s51psetted[i] = 0;}
for(var i=0 ;i < 15;i++){addapsetted[i] = 0;}
for(var i=0 ;i < 4;i++){oscp01setted[i] = 0;}
for(var i=0 ;i < 8;i++){logpsetted[i] = 0;}

// 初始示波器线
$(".bd").append("g").each(function(){
  d3.select(this).append("path")
    .attr("stroke","black")
    .attr("fill","none")
    .attr("stpoint","51pdata")
    .attr("stroke-width","6")
    .attr("d","M218,507 C 230,620 340,620 360,507 S 340,200 420,200 S 775,210 790,180 Q 793,180 805,113");  
  
  d3.select(this).append("path")
    .attr("stroke","yellow")
    .attr("fill","none")
    .attr("stroke-width","4")
    .attr("d","M218,507 C 230,620 340,620 360,507 S 340,200 420,200 S 775,210 790,180 Q 793,180 805,113");

  
});


// console.log(s51psetted,ledpsetted);
//禁用网页自带右键菜单
document.oncontextmenu = function(){
  return false;
}
// console.log(window);
var $_table = $(".bd");
var $_addap_01 = $(".pt1");
var $_51p_01 = $(".pt0");
var $_oscp_01 = $(".osc_lp_01");
var $_logp_01 = $(".log_lp");

$_table.each(function(){
  $(this).mousemove(function(){
    if(maplinelock != 0)
    {
      // console.log(event.movementX,event.movementY);
      // console.log(event);
      var x1,y1,mapoffset={x:$_table.offset().left,y:$_table.offset().top};
      x1 = event.pageX - mapoffset.x;
      y1 = event.pageY - mapoffset.y;
      // console.log(x1,y1);
      
      if(y1 < stpoints.y){
        y1 += 4;
        onchangept = settedpoints+" Q "+stpoints.x+" "+(stpoints.y-30)+","+(x1 + stpoints.x)/2+" "+(y1 + stpoints.y)/2+" Q "+x1+" "+(y1+30)+","+x1+" "+y1;
      }else if(y1 >= stpoints.y){
        y1 -= 4;
        onchangept = settedpoints+" Q "+stpoints.x+" "+(stpoints.y+30)+","+(x1 + stpoints.x)/2+" "+(y1 + stpoints.y)/2+" Q "+x1+" "+(y1-30)+","+x1+" "+y1;
      }
      onchangeline.attr("d",onchangept);
      onchangeline2.attr("d",onchangept);
    }
  });

  //重设右键功能
  $(this).mousedown(function(e){
    // console.log(e);
    if(e.button == 2 && maplinelock != 0)
    {
      onchangeg.remove();
      maplinelock = 0;
      settedpoints = "";
      // console.log("你点了右键");
    }
  });
});

$_51p_01.each(function(){
  
  $(this).click(function(e){
    // console.log(e);
    // console.log("51p",maplinelock);
    var t = $(this);
    var s = parseInt(t.attr("ms"));
    var tpc = t.parent().attr("class")
    s51_setsign = s;
    if(maplinelock == 0 && s51psetted[s] == 0)
    {
      // console.log(t);
      stpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      stpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));

      // if(tpc == "51pg1" || tpc == "51pg2"){
      //   stpoints.x -= 7;
      // }else{
      //   stpoints.x += 7;
      // }
      // console.log(stpoints);
      maplinelock = 2;
      settedpoints += "M " + stpoints.x + " " + stpoints.y ;
      onchangeg = d3.select(".bd").append("g").attr("class","mapline").attr("ms",""+s);
      onchangeline2 = onchangeg.append("path")
        .attr("stroke","black")
        .attr("fill","none")
        .attr("stpoint","51pdata")
        .attr("stroke-width","6")
        .attr("d",settedpoints+"");

      onchangeline = onchangeg.append("path")
        .attr("stroke",function(){
          return "#9c0";
        })
        .attr("fill","none")
        .attr("stroke-width","4")
        .attr("d",settedpoints+"");

    }else if(maplinelock == 1){
      edpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      edpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));
      // if(tpc == "51pg1" || tpc == "51pg2"){
      //   edpoints.x -= 7;
      // }else{
      //   edpoints.x += 7;
      // }
      if(stpoints.y > edpoints.y )
        settedpoints += settedpoints+" Q "+stpoints.x+" "+(stpoints.y-30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" Q "+edpoints.x+" "+(edpoints.y+30)+","+edpoints.x+" "+edpoints.y;
      else if(stpoints.y <= edpoints.y)
        settedpoints += settedpoints+" Q "+stpoints.x+" "+(stpoints.y+30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" Q "+edpoints.x+" "+(edpoints.y-30)+","+edpoints.x+" "+edpoints.y;
      maplinelock = 0;
      onchangeline.attr("d",settedpoints+"");
      onchangeline2.attr("d",settedpoints+"");
      settedpoints = "";
      
      // console.log($());
      $.contextMenu({
          selector: '.mapline_osc', 
          callback: function(key, options) {
              if(key == "delete"){
                $(this).remove();
                oscp01setted[parseInt($(this).attr("ms"))] = 0;
                websend_fpga(parseInt($(this).attr("addr")),0xffff);
                console.log("addr: %s,val: %s",$(this).attr("addr"),(0xffff).toString(16));
              }
              if(key == "deleteAll"){
                $(".mapline").remove();
                $(".mapline_log").remove();
                $(".mapline_osc").remove();
                for(var i=0 ;i < 32;i++){s51psetted[i] = 0;}
                for(var i=0 ;i < 4;i++){oscp01setted[i] = 0;}
                for(var i=0 ;i < 8;i++){logpsetted[i] = 0;}
                websend_fpga(0x2000,0x00);
                console.log("addr: 0x2000,val: 0x00");
              }
          },
          items: {
              "delete": {name: "删除连线", icon: "delete"},
              "deleteAll": {name: "删除所有连线", icon: "delete"},
              // "sep1": "---------",
              // "quit": {name: "Quit", icon: function(){
              //     return 'context-menu-icon context-menu-icon-quit';
              // }}
          }
      });
     
      oscp01setted[osc_setsign] = 1;
      // console.log(deviceId);
      websend_fpga((0x8010+parseInt($(".osc_lp_01[ms="+osc_setsign+"]").attr("ms"))+1),((t.attr("val")) & 0xff));
      console.log("addr: 0x%s,val: 0x%s",(0x8010+parseInt($(".osc_lp_01[ms="+osc_setsign+"]").attr("ms"))+1).toString(16),((t.attr("val")) & 0xff).toString(16));
    }else if(maplinelock == 3){
      edpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      edpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));
      if(stpoints.y > edpoints.y )
        settedpoints += settedpoints+" Q "+stpoints.x+" "+(stpoints.y-30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" Q "+edpoints.x+" "+(edpoints.y+30)+","+edpoints.x+" "+edpoints.y;
      else if(stpoints.y <= edpoints.y)
        settedpoints += settedpoints+" Q "+stpoints.x+" "+(stpoints.y+30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" Q "+edpoints.x+" "+(edpoints.y-30)+","+edpoints.x+" "+edpoints.y;
      maplinelock = 0;
      onchangeline.attr("d",settedpoints+"");
      onchangeline2.attr("d",settedpoints+"");
      settedpoints = "";
      
      // console.log($());
      $.contextMenu({
          selector: '.mapline_log', 
          callback: function(key, options) {
              if(key == "delete"){
                $(this).remove();
                logpsetted[parseInt($(this).attr("ms"))] = 0;
                websend_fpga(parseInt($(this).attr("addr")),0xffff);
                console.log("addr: %s,val: %s",$(this).attr("addr"),(0xffff).toString(16));
                // console.log("mapline_log delete",parseInt($(this).attr("ms")),log_setsign);
              }
              if(key == "deleteAll"){
                $(".mapline").remove();
                $(".mapline_log").remove();
                $(".mapline_osc").remove();
                for(var i=0 ;i < 32;i++){s51psetted[i] = 0;}
                for(var i=0 ;i < 4;i++){oscp01setted[i] = 0;}
                for(var i=0 ;i < 8;i++){logpsetted[i] = 0;}
                websend_fpga(0x2000,0x00);
                console.log("addr: 0x2000,val: 0x00");
              }
          },
          items: {
              "delete": {name: "删除连线", icon: "delete"},
              "deleteAll": {name: "删除所有连线", icon: "delete"},
              // "sep1": "---------",
              // "quit": {name: "Quit", icon: function(){
              //     return 'context-menu-icon context-menu-icon-quit';
              // }}
          }
      });
     
      logpsetted[log_setsign] = 1;
      // console.log(deviceId);
      websend_fpga((0x1010+parseInt($(".log_lp[ms="+log_setsign+"]").attr("ms"))+1),((t.attr("val")) & 0xff));
      console.log("addr: 0x%s,val: 0x%s",(0x1010+parseInt($(".log_lp[ms="+log_setsign+"]").attr("ms"))+1).toString(16),((t.attr("val")) & 0xff).toString(16));
    }
    
  });

});

$_oscp_01.each(function(){
  
  $(this).click(function(){
    // console.log("oscp01",maplinelock);
    var t = $(this);
    var s = parseInt(t.attr("ms"));
    osc_setsign = s;
    if(maplinelock == 0 && oscp01setted[s] == 0)
    {
      stpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      
      stpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));
      // console.log(stpoints);
      maplinelock = 1;
      settedpoints += "M " + stpoints.x + " " + stpoints.y ;
      onchangeg = d3.select(".bd").append("g").attr("class","mapline_osc").attr("ms",""+s).attr("addr",t.attr("addr"));
      onchangeline2 = onchangeg.append("path")
        .attr("stroke","black")
        .attr("fill","none")
        .attr("stroke-width","6")
        .attr("d",settedpoints+"");

      onchangeline = onchangeg.append("path")
        .attr("stroke",function(){
          // console.log(t);
          switch(s){
            case 0:
              return "#E7C331";
            break;
            case 1:
              return "#00AED9";
            break;
            case 2:
              return "#C319A0";
            break;
            case 3:
              return "#00288A";
            break;
          }
        })
        .attr("fill","none")
        .attr("stroke-width","4")
        .attr("d",settedpoints+"");

      // $(".A2_table").css("cursor","url('myimages/111.cur')");  
    }
    
  });

});

$_logp_01.each(function(){
  
  $(this).click(function(){
    // console.log("logp01",maplinelock);
    var t = $(this);
    var s = parseInt(t.attr("ms"));
    log_setsign = s;
    if(maplinelock == 0 && logpsetted[s] == 0)
    {
      stpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      
      stpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));
      // console.log(stpoints);
      maplinelock = 3;
      settedpoints += "M " + stpoints.x + " " + stpoints.y ;
      onchangeg = d3.select(".bd").append("g").attr("class","mapline_log").attr("ms",""+s).attr("addr",t.attr("addr"));
      onchangeline2 = onchangeg.append("path")
        .attr("stroke","black")
        .attr("fill","none")
        .attr("stroke-width","6")
        .attr("d",settedpoints+"");

      onchangeline = onchangeg.append("path")
        .attr("stroke",function(){
          return log_lcolor[s];
        })
        .attr("fill","none")
        .attr("stroke-width","4")
        .attr("d",settedpoints+"");

      // $(".A2_table").css("cursor","url('myimages/111.cur')");  
    }
    
  });

});


$_addap_01.each(function(){
  
  $(this).click(function(){
    var t = $(this);
    var m = parseInt(t.attr("ms"));
    var val = parseInt(t.attr("val"));
    if(maplinelock == 2)
    {
      edpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      edpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));

      if(stpoints.y > edpoints.y )
        settedpoints += settedpoints+" Q "+stpoints.x+" "+(stpoints.y-30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" Q "+edpoints.x+" "+(edpoints.y+30)+","+edpoints.x+" "+edpoints.y;
      else if(stpoints.y <= edpoints.y)
        settedpoints += settedpoints+" Q "+stpoints.x+" "+(stpoints.y+30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" Q "+edpoints.x+" "+(edpoints.y-30)+","+edpoints.x+" "+edpoints.y;
      maplinelock = 0;
      onchangeg.attr("addr",t.attr("addr"));
      onchangeline.attr("d",settedpoints+"");
      onchangeline2.attr("d",settedpoints+"");
      settedpoints = "";
      
      // console.log($());
      $.contextMenu({
          selector: '.mapline', 
          callback: function(key, options) {
              if(key == "delete"){
                $(this).remove();
                s51psetted[parseInt($(this).attr("ms"))] = 0;
                websend_fpga(parseInt($(this).attr("addr")),0xffff);
                console.log("addr: %s,val: %s",$(this).attr("addr"),(0xffff).toString(16));
                // console.log("51linedelete",parseInt($(this).attr("ms")));
              }
              if(key == "deleteAll"){
                $(".mapline").remove();
                $(".mapline_log").remove();
                $(".mapline_osc").remove();
                for(var i=0 ;i < 32;i++){s51psetted[i] = 0;}
                for(var i=0 ;i < 4;i++){oscp01setted[i] = 0;}
                for(var i=0 ;i < 8;i++){logpsetted[i] = 0;}
                websend_fpga(0x2000,0x00);
                console.log("addr: 0x2000,val: 0x00");
              }
          },
          items: {
              "delete": {name: "删除连线", icon: "delete"},
              "deleteAll": {name: "删除所有连线", icon: "delete"},
              // "sep1": "---------",
              // "quit": {name: "Quit", icon: function(){
              //     return 'context-menu-icon context-menu-icon-quit';
              // }}
          }
      });
     
      s51psetted[s51_setsign] = 1;
      addapsetted[m] = 1;
      // console.log(deviceId);
      if(m < 7){
        websend_fpga((0x2041+val),(parseInt($(".pt0[ms="+s51_setsign+"]").attr("val")) & 0xff));
        console.log('addr: 0x%s,val: 0x%s',(0x2041+val).toString(16),(parseInt($(".pt0[ms="+s51_setsign+"]").attr("val")) & 0xff).toString(16));
      }else{
        websend_fpga((0x1019+val-7),(parseInt($(".pt0[ms="+s51_setsign+"]").attr("val")) & 0xff));
        console.log('addr: 0x%s,val: 0x%s',(0x1019+val-7).toString(16),(parseInt($(".pt0[ms="+s51_setsign+"]").attr("val")) & 0xff).toString(16));
      }
    }

  });
 
});

