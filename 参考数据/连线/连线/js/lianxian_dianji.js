// 创建51连线点
d3.select("#pic_s51")
  .append("g")
  .attr("class","51poonts")
  .attr("transform","translate(53,383)")
  .selectAll("g")
  .data(new Array(4))
  .enter()
  .append("g")
  .attr("class",function(d,i){
    return "51pg"+i;
  })
  .attr("transform",function(d,i){
    var t = ["(19,0)","(0,113)","(220,0)","(164,113)"];
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
        cy:7,
        cx:function(d,i){return 7+i*18.3;},
        r:7,
        fill:"transparent",
        stroke:"black"
      })
  });

//创建电机连线点
d3.select("#pic_s51")
  .append("g")
  .attr("class","dianjipoints")
  .attr("transform","translate(62.5,100)")
  .selectAll("circle")
  .data([{cx:146,cy:11},{cx:377,cy:11},{cx:230.5,cy:132},{cx:267,cy:132},{cx:304,cy:132},{cx:340,cy:132},{cx:47.6,cy:132},{cx:84.2,cy:132},{cx:11,cy:132}])
  .enter()
  .append("circle")
  .attr({
    class:"pt1",
    addr:function(d,i){return "0x"+(0x2011+i).toString(16)},
    ms:function(d,i){return i;},
    val:function(d,i){return i;},
    cx:function(d,i){return d.cx},
    cy:function(d,i){return d.cy},
    r:11,
    fill:"transparent",
    stroke:"black"
  });

//连线
var maplinelock = 0;   //连线状态 {0：普通状态,1-8：连线状态}
var settedpoints = "",onchangept = "";
var stpoints = {x:"",y:""};
var edpoints = {x:"",y:""};
var onchangeg,onchangeline,onchangeline2;
var s51psetted = new Array(),ledpsetted = new Array(),oscp01setted = new Array(),logpsetted = new Array(),
    s51_setsign = 0,osc_setsign = 0,log_setsign = 0;
var log_lcolor = ["#d6d630","#888834","#32BF32","#525252","#1D83D1","#35C235","#525252","#DA3434"];

for(var i=0 ;i < 32;i++){s51psetted[i] = 0;}
for(var i=0 ;i < 11;i++){ledpsetted[i] = 0;}
for(var i=0 ;i < 4;i++){oscp01setted[i] = 0;}
for(var i=0 ;i < 8;i++){logpsetted[i] = 0;}

// console.log(s51psetted,ledpsetted);
//禁用网页自带右键菜单
document.oncontextmenu = function(){
  return false;
}

// console.log(window);
var $_table = $(".bd");      //svg背景
var $_djp_01 = $(".pt1");     //电机圆点
var $_51p_01 = $(".pt0");    //32个接线板
var $_oscp_01 = $(".osc_lp_01");
var $_logp_01 = $(".log_lp");     //逻辑分析仪接线点

$_table.each(function(){
  $(this).mousemove(function(){   //鼠标移动连线跟随
    if(maplinelock != 0)
    {
      var x1,y1,mapoffset={x:$_table.offset().left,y:$_table.offset().top};
      x1 = event.pageX - mapoffset.x;    //即当前点击的位置 x
      y1 = event.pageY - mapoffset.y;
      // console.log(x1,y1);
      if(y1 < stpoints.y){  //stpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
        y1 += 4;    
        onchangept = settedpoints+" Q "+stpoints.x+" "+(stpoints.y-30)+","+(x1 + stpoints.x)/2+" "+(y1 + stpoints.y)/2+" T "+x1+" "+y1;
      }else if(y1 >= stpoints.y){
        y1 -= 4;
        onchangept = settedpoints+" Q "+stpoints.x+" "+(stpoints.y+30)+","+(x1 + stpoints.x)/2+" "+(y1 + stpoints.y)/2+" T "+x1+" "+y1;
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
    }
  });
});

$_51p_01.each(function(){     //32个接线点

  $(this).click(function(e){

    var t = $(this);
    var s = parseInt(t.attr("ms"));
    var tpc = t.parent().attr("class")  //父节点class为51pg0、1、2、3
    // alert(tpc)
    s51_setsign = s;

    if(maplinelock == 0 && s51psetted[s] == 0)   // 32个接线点的ms值 ==0    连线状态==0
    {
      // console.log(t);  //接线点位置
      stpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));   //32个接线点的位置
      stpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));

      console.log("p.offsetLeft:%s,bg.offsetleft:%s,cx:%s",t.parent().offset().left,$_table.offset().left,parseInt($(this).attr("cx")))


      maplinelock = 2;
      settedpoints = "M " + stpoints.x + " " + stpoints.y;
      onchangeg = d3.select(".bd").append("g").attr("class","mapline").attr("ms",s);
      onchangeline2 = onchangeg.append("path")
        .attr("stroke","black")
        .attr("fill","none")
        .attr("stpoint","51pdata")
        .attr("stroke-width","6")
        .attr("d",settedpoints);

      onchangeline = onchangeg.append("path")
        .attr("stroke",function(){
          return "#9c0";
        })
        .attr("fill","none")
        .attr("stroke-width","5")
        .attr("d",settedpoints);

    }
    else if(maplinelock == 3){   //连线已经存在
      edpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      edpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));
      if(stpoints.y > edpoints.y )
        settedpoints = settedpoints+" Q "+stpoints.x+" "+(stpoints.y-30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" T "+edpoints.x+" "+edpoints.y;
      else if(stpoints.y <= edpoints.y)
        settedpoints = settedpoints+" Q "+stpoints.x+" "+(stpoints.y+30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" T "+edpoints.x+" "+edpoints.y;
      maplinelock = 0;
      onchangeline.attr("d",settedpoints);
      onchangeline2.attr("d",settedpoints);
      settedpoints = "";

      $.contextMenu({
          selector: '.mapline_log',
          callback: function(key, options) {
              if(key == "delete"){
                $(this).remove();
                logpsetted[parseInt($(this).attr("ms"))] = 0;
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
          }
      });

      logpsetted[log_setsign] = 1;
      // console.log(deviceId);
      // websend_fpga((0x1010+parseInt($(".log_lp[ms="+log_setsign+"]").attr("ms"))+1),((t.attr("val")) & 0xff));
      console.log("addr: 0x%s,val: 0x%s",(0x1010+parseInt($(".log_lp[ms="+log_setsign+"]").attr("ms"))+1).toString(16),((t.attr("val")) & 0xff).toString(16));
    }

  });

});

$_logp_01.each(function(){   //逻辑分析仪接线点

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
      settedpoints = "M " + stpoints.x + " " + stpoints.y ;
      onchangeg = d3.select(".bd").append("g").attr("class","mapline_log").attr("ms",""+s).attr("addr",t.attr("addr"));
      onchangeline2 = onchangeg.append("path")
        .attr("stroke","black")
        .attr("fill","none")
        .attr("stroke-width","6")
        .attr("d",settedpoints);

      onchangeline = onchangeg.append("path")
        .attr("stroke",function(){
          return log_lcolor[s];
        })
        .attr("fill","none")
        .attr("stroke-width","5")
        .attr("d",settedpoints);

      // $(".A2_table").css("cursor","url('myimages/111.cur')");
    }

  });

});


$_djp_01.each(function(){    //电机圆点

  $(this).click(function(){
    var t = $(this);
    var m = parseInt(t.attr("m"));
    if(maplinelock == 2)
    {
      edpoints.x = t.parent().offset().left - $_table.offset().left + parseInt($(this).attr("cx"));
      edpoints.y = t.parent().offset().top - $_table.offset().top + parseInt($(this).attr("cy"));

      if(stpoints.y > edpoints.y )
        settedpoints = settedpoints+" Q "+stpoints.x+" "+(stpoints.y-30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" T "+edpoints.x+" "+edpoints.y;
      else if(stpoints.y <= edpoints.y)
        settedpoints = settedpoints+" Q "+stpoints.x+" "+(stpoints.y+30)+","+(edpoints.x + stpoints.x)/2+" "+(stpoints.y+edpoints.y)/2+" T "+edpoints.x+" "+edpoints.y;
      maplinelock = 0;
      onchangeg.attr("addr",t.attr("addr"));
      onchangeline.attr("d",settedpoints);
      onchangeline2.attr("d",settedpoints);
      settedpoints = "";


      $.contextMenu({
          selector: '.mapline',
          callback: function(key, options) {
              if(key == "delete"){
                $(this).remove();
                s51psetted[parseInt($(this).attr("ms"))] = 0;
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
                // websend_fpga(0x2000,0x00);
                console.log("addr: 0x2000,val: 0x00");
              }
          },
          items: {
              "delete": {name: "删除连线", icon: "delete"},
              "deleteAll": {name: "删除所有连线", icon: "delete"},
          }
      });

      s51psetted[s51_setsign] = 1;
      console.log('addr: 0x%s,val: 0x%s',(0x2010+parseInt(t.attr("val"))+1).toString(16),(parseInt($(".pt0[ms="+s51_setsign+"]").attr("val")) & 0xff).toString(16));
    }

  });

});
