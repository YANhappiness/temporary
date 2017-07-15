var logicMaxCH = 9;  //通道数
var logicNowCH = logicMaxCH; //当前的通道数
var logicpause = 0;
var K;
var logicsvgmargin,logicwidth,logicheight,logicsvgx,logicsvgy,logicsvgxAxis,logicsvgyAxis,logicsvgzoom,logicsvg,logicsvgline;
var logicdatalinecolors = [
  'steelblue',
  'green',
  'red',
  'purple'
];
var logicsvg_g01;

// 逻分按键事件绑定
$(".log_btn").click(function(){
  var i = parseInt($(this).attr("ms"));
  if(i == 0){
    $(this).css("background-color","white");
    websend_fpga(0x1001,0x0001);
    console.log("addr: 0x1001,val: 0x0001");
    $(this).attr("ms","1");
  }else{
    $(this).css("background-color","red");
    websend_fpga(0x1001,0x0000);
    console.log("addr: 0x1001,val: 0x0000");
    $(this).attr("ms","0");
  }
});

$(".slideb_01").click(function(){
  var i = parseInt($(this).attr("ms"));
  if(i == 0){
    $(this).attr("ms",1);
    $(".slide_01").css("left","38px");
    $(".slidet_01").text("单次");
    $(".slidebtn_01").show();
    websend_fpga(0x1004,1);
    console.log("addr: 0x1004,val: 0x0001");
  }else if(i == 1){
    $(this).attr("ms",0);
    $(".slide_01").css("left","0px");
    $(".slidet_01").text("普通");
    $(".slidebtn_01").hide();
    websend_fpga(0x1004,0);
    console.log("addr: 0x1004,val: 0x0000");
  }
});

$(".slidebtn_01").click(function(){
  websend_fpga(0x1005,1);
  console.log("addr: 0x1005,val: 0x0001");
});



// 创建svg
$(function(){
  logicsvgmargin = {top: 20, right: 30, bottom: 50, left: 50},
    logicwidth = 800 - logicsvgmargin.left - logicsvgmargin.right,
    logicheight = 500 - logicsvgmargin.top - logicsvgmargin.bottom;

  logicsvgx = d3.scale.linear()
    .domain([0, 500])
    .range([0, logicwidth]);

  logicsvgy = d3.scale.linear()
    .domain([0, logicMaxCH*2])
    .range([logicheight,0]);
    
  var aa = d3.scale.ordinal()
    .domain(["时钟","通道1","通道2","通道3","通道4","通道5","通道6","通道7","通道8"])
    .range([logicheight*35/36,logicheight*31/36,logicheight*27/36,logicheight*23/36,logicheight*19/36,
      logicheight*15/36,logicheight*11/36,logicheight*7/36,logicheight*3/36]); 

  // var bb = d3.scale.linear()
  //   .domain([0,500])
  //   .range([0,logicwidth])

  logicsvgxAxis = d3.svg.axis()
    .scale(logicsvgx)
    .tickSize(-logicheight)
    // .tickValues([])
    .tickPadding(10)  
    .tickSubdivide(true)  
    .orient("bottom");  

  var yt = d3.svg.axis()
    .scale(aa)
    .tickPadding(10)
    .tickSize(0)
    .orient("left"); 

  var linepath = d3.svg.line();

  logicsvgyAxis = d3.svg.axis()
    .scale(logicsvgy)
    .tickSize(-logicwidth)
    .tickValues([])
    .orient("left");
    
  logicsvgzoom = d3.behavior.zoom()
    .x(logicsvgx)
    .scaleExtent([1,50])
    .on("zoom", logicsvgzoomed);

  logicsvg = d3.select("#logic_analyzer").append("svg")
    
    .attr("width", logicwidth + logicsvgmargin.left + logicsvgmargin.right)
    .attr("height", logicheight + logicsvgmargin.top + logicsvgmargin.bottom)

  logicsvg_g01 = logicsvg.append("g")
    .call(logicsvgzoom)
    .attr("transform", "translate(" + logicsvgmargin.left + "," + logicsvgmargin.top + ")");

  logicsvg_g01.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + logicheight + ")")
    .call(logicsvgxAxis);
 
  logicsvg_g01.append("g")
    .attr("class", "y axis")
    .call(logicsvgyAxis);

  var logicdrag = d3.behavior.drag().on("drag",ondrag);
  var logtx = new Array();
  function ondrag(){
    var i = d3.select(this).attr("ms");
    if(d3.event.x < 0)
      logtx[i-1] = 0;
    else if(d3.event.x > logicwidth)
      logtx[i-1] = logicwidth;
    else
      logtx[i-1] = d3.event.x;
    d3.select(this).attr("transform","translate("+ logtx[i-1] +",0)");
    // console.log(x,logicsvgzoom.translate()[0],logicwidth,logicsvgzoom.scale());
    $(".logt1[ms="+i+"]").text(Math.round((logtx[i-1]-logicsvgzoom.translate()[0])/logicsvgzoom.scale()/(logicwidth/500)));
  }

  logicsvg_g01.append("g")
    .call(yt);    

  logicsvg_g01.append("g")
    .append("rect")
    .attr("height",logicheight)
    .attr("width",logicwidth)
    .attr("fill","transparent");

  // 游标
  logicsvg.append("g")
    .attr("transform", "translate(" + logicsvgmargin.left + "," + logicsvgmargin.top + ")")
    .selectAll("g")
    .data(new Array(2))
    .enter()
    .append("g")
    .call(logicdrag)
    .attr("class",function(d,i){
      return "logsl"+(i+1);      
    })
    .attr("ms",function(d,i){
      return i+1;
    })
    // .call(logicsvgzoom)
    .each(function(d,i){
      d3.select(this)
        .append("path")
        .attr("d","M0,0L0,"+logicheight)
        .attr("stroke",function(){return "black";})
        .attr("stroke-width","2");

      d3.select(this)
        .append("path")
        .attr("d",linepath([[0,0],[-3,-3],[-3,-10],[3,-10],[3,-3],[0,0]]))
        .attr("fill","black");

      d3.select(this)
        .append("text")
        .attr({
          "text-anchor":"middle",
          y:-11,
          "font-size":"8px"
        })
        .text(function(){
          return "T"+(i+1);
        });
    });

  // logicsvg.append("g")
    // .attr("class","log_btn")
    // .attr("ms","1")
    // .attr("transform","translate(0,0)")
    // .each(function(){
    //   d3.select(this)
    //     .append("rect")
    //     .attr({
    //     height:30,
    //     width:45,
    //     rx:2,
    //     fill:"transparent",
    //     stroke:"black",
    //   });

    //   d3.select(this)
    //     .append("text")
    //     .text("STOP")
    //     .attr({
    //       dy:"1.5em",
    //       dx:2,
    //     });
    // });
    
  // $(".log_btn").click(function(){
  //   var i = parseInt($(this).attr("ms"));
  //   if(i == 0){
  //     $(this).children("rect").attr("fill","transparent");
  //     websend_fpga(0x1001,0x0001);
  //     $(this).attr("ms","1");
  //   }else{
  //     $(this).children("rect").attr("fill","red");
  //     websend_fpga(0x1001,0x0000);
  //     $(this).attr("ms","0");
  //   }
  // });

 
   
  logicsvg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", logicwidth)
    .attr("height", logicheight);

  logicsvgline = d3.svg.line()
    .interpolate("linear") 
    .x(function(d) { return logicsvgx(d.x); })
    .y(function(d) { return logicsvgy(d.y); });

  function logicsvgzoomed() {
    if(logicsvgzoom.translate()[0] > 0)
    {
      logicsvgzoom.translate([0,0]);
    }
    for(var i = 1;i<3;i++){
      // console.log(logtx[i-1],logicsvgzoom.translate()[0],logicsvgzoom.scale());
      $(".logt1[ms="+i+"]").text(Math.round((logtx[i-1]-logicsvgzoom.translate()[0])/logicsvgzoom.scale()/(logicwidth/500)));
    }
    // console.log(logicsvgzoom.translate(),logicsvgzoom.scale());
    logicsvg.select(".x.axis").call(logicsvgxAxis);
    logicsvg.selectAll('path.line').attr('d', logicsvgline);  
  }

  // 文本
  var logicsvg_g02 = logicsvg.append("g")
    .attr("transform","translate(80,490)");

  logicsvg_g02.append("text")
    .attr({
      x:0,
      y:0,
      fill:"black",
    })
    .text("T1：");    

  logicsvg_g02.append("text")
    .attr({
      class:"logt1",
      ms:1,
      "text-anchor":"end",
      x:60,
      y:0,
      fill:"black",
    })
    .text("0"); 

  logicsvg_g02.append("text")
    .attr({
      x:130,
      y:0,
      fill:"black",
    })
    .text("T2：");    

  logicsvg_g02.append("text")
    .attr({
      class:"logt1",
      ms:2,
      "text-anchor":"end",
      x:190,
      y:0,
      fill:"black",
    })
    .text("0");
    
  logicsvg_g02.append("text")
    .attr({
      x:280,
      y:0,
      fill:"black",
    })
    .text("采样率：");        

  logicsvg_g02.append("text")
    .attr({
      class:"logt2",
      ms:1,
      "text-anchor":"end",
      x:390,
      y:0,
      fill:"black",
    })
    .text("1/2K");

  
});



//取数据的第sign位
function getbit(val,sign){
  return (0x1 & (val >> (sign)));
}

//绘制数据线
function logicdrawline(){
  var i,k,my,ry,sign;
  var data = new Array();
  // console.log(getVal);
  var arrlength = getVal.length;
  for(var sign = 0;sign < logicMaxCH;sign++){
    data[sign] = new Array();
  }
  for(var sign = 0;sign < logicMaxCH;sign++){
    if(sign == 0){
      for(i = 0,k = 0;i < arrlength;i++){
        data[sign][k++] = {'x':i,'y':sign*2};
        data[sign][k++] = {'x':i,'y':sign*2+1};
        data[sign][k++] = {'x':i+0.5,'y':sign*2+1};
        data[sign][k++] = {'x':i+0.5,'y':sign*2};
      }
      
    }else{
      for(i = 0,k = 0;i < arrlength;i++){
        my = getbit(getVal[i],sign-1);
        if(my == ry){
          data[sign][k++] = {'x':i,'y':my+sign*2};
        }
        else{
          if(i > 0)
            data[sign][k++] = {'x':i,'y':ry+sign*2};
          data[sign][k++] = {'x':i,'y':my+sign*2};
        }
        ry = my;
      }
    }
  
  }
  // console.log(logicMaxCH);

  logicsvg_g01.selectAll('.line')
  .data(data)
  .enter()
  .append("path")
  .attr("class", "line")
  .attr("clip-path", "url(#clip)")
  .attr('stroke', function(d,i){      
    return logicdatalinecolors[i%logicdatalinecolors.length];
  })
  .attr("d", logicsvgline);

  logicsvg_g01.selectAll('path.line').attr('d', logicsvgline);
           
}

function logicstop(){
  // window.clearInterval(K);
  if(logicpause == 0)
  {
    logicpause = 1;
  }
}

function wsreconnect(){
  if(ws.readyState){
    alert("服务器已连接");
    return;
  }
  createSocket();
}

//间隔时间获取数据
function logiccontinue(){
  // K = window.setInterval("mygetdata()",250);
  if(logicpause == 1)
  {
    logicpause = 0;
  }
}


//旋钮事件
  {
    //旋钮变量
    var logkndeg = 0;
    var logmdown = false;
    var logmover = false;
    var logmwheel = 0;
    var logtarget = 0;
    var logknobp0 = {
      x:0,
      y:0,
      tan:0
    };
    var logknobp1 = {
      x:0,
      y:0,
      tan:0
    }

    function logonMouseDown(event) {
      logmdown = true;
      logknobp0.x = event.pageX - $(".logknobp",$(this)).offset().left;
      logknobp0.y = event.pageY - $(".logknobp",$(this)).offset().top;
      logknobp0.tan = logknobp0.y/logknobp0.x;
      // console.log(0,logknobp0.y/logknobp0.x);
      // console.log(0,(event.pageX - $(".logknobp",$(this)).offset().left),(event.pageY - $(".logknobp",$(this)).offset().top));
    };

    function logonMouseUp(event) {
      logmdown = false;
    };

    function logonMouseMove(event) {
      if (logmdown) {
        logknobp1.x = event.pageX - $(".logknobp",$(this)).offset().left;
        logknobp1.y = event.pageY - $(".logknobp",$(this)).offset().top;
        logknobp1.tan = logknobp1.y/logknobp1.x;
        if(logknobp1.x*logknobp0.x > 0)
        {
          if(logknobp1.tan > logknobp0.tan)
            logmwheel = 1;
          else if(logknobp1.tan < logknobp0.tan)
            logmwheel = -1;
        }
        else if(logknobp1.x*logknobp0.x < 0)
        {
          if(logknobp1.tan > logknobp0.tan)
            logmwheel = -1;
          else if(logknobp1.tan < logknobp0.tan)
            logmwheel = 1;
        }
        logknobp0.x = logknobp1.x;
        logknobp0.y = logknobp1.y;
        logknobp0.tan = logknobp1.tan;
        logsetWheelPosition(-logmwheel,$(this).attr("id"));
        // console.log(1,(event.pageX - $(".logknobp",$(this)).offset().left),(event.pageY - $(".logknobp",$(this)).offset().top));
        // console.log(1,logmwheel);
      }
    };

    function logonMouseOver(){
      // console.log(1);
      $("#logicboard").css({
        "overflow-y":"hidden"
      });
      
      logmover = true;        
    }

    function logonMouseLeave(event) {
      $("#logicboard").css({
        "overflow-y":"auto"
      });
      
      logmover = false;
      logmwheel = 0;
    };

    var logtime = 1; // 采样率档位
    var logtimedata = ["","1/2K","1/4K","1/8K","1/16K","1/32K","1/64K","1/128K","1/256K","1/512K","1/1.024M"];

    function logsetWheelPosition(value,i,t) {
      // console.log(4,i);
      switch(i)
      {
        //采样率
        case "logkn01":
          // console.log(value);
          logtime += value;
          logtime = (logtime < 1) ? 1 : (logtime > 10) ? 10 : logtime;
          logkndeg = (logtime-1)*30;
          t.css("transform"," rotate("+logkndeg+"deg)");
          websend_fpga(0x1002,logtime); //改采样率
          console.log("addr: 0x1002,val: 0x%s",logtime.toString(16));
          $(".logt2").text(logtimedata[logtime]);
        break;

      }

      logicdrawline();
    }

    // console.log(d3.selectAll(".logknob"));
    $(".logknob").each(function(){
      $(this).on("mousedown", logonMouseDown);
      $(this).on("mousemove", logonMouseMove);
      $(this).on("mouseover", logonMouseOver);
      $(this).on("mouseleave", logonMouseLeave);
      $("body").on("mouseup", logonMouseUp);
      $(this).get(0).addEventListener("mousewheel",function() {
        
        // event = event || window.event;
        if(event.wheelDelta > 0 || event.detail < 0){
          //向上滚

          // console.log("up");
          logmwheel = -1;
        } 
        if(event.wheelDelta < 0 || event.detail > 0){
          //向下滚
          
          // console.log("down");
          logmwheel = 1;
        }
        logsetWheelPosition(logmwheel,$(this).attr("id"),$(this));
      });
      $(this).get(0).addEventListener("DOMMouseScroll",function() {
        
        // event = event || window.event;
        if(event.wheelDelta > 0 || event.detail < 0){
          //向上滚

          // console.log("up");
          logmwheel = -1;
        } 
        if(event.wheelDelta < 0 || event.detail > 0){
          //向下滚
          
          // console.log("down");
          logmwheel = 1;
        }
        logsetWheelPosition(logmwheel,$(this).attr("id"),$(this));
      });
    });
  }