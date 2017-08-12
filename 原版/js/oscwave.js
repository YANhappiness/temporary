var oscMaxCH = 4;
var oscMd = 0; //示波器模式
var xMaxNum = 1024; //水平点数
var A1 = 1,A2 = 1,C1 = 0,C2 = 0,Dt = 0;
var BtA = [[16,1.526],[15,1.5],
          [14,1.221],[13,1.221],
          [12,1.221],[11,0.976],
          [10,0.976],[9,0.976],
          [8,0.781],[7,0.781],
          [6,0.781],[4,1.25],
          [3,1.25],[2,1.25],[1,1]],Bt = 1.221,alls = 3;

//旋钮变量
var oscmdown = false;
var oscmover = false;
var oscmwheel = 0;
var osctarget = 0;
var CH1s = 8,CH2s = 8;  //各通道垂直缩放档位
var allp = 0;  
var oscknobp0 = {
  x:0,
  y:0,
  tan:0
};
var oscknobp1 = {
  x:0,
  y:0,
  tan:0
}


var oscsvgmargin,oscwidth,oscheight,oscsvgx,oscsvgy,oscsvgxAxis,oscsvgyAxis,oscsvgzoom,oscsvg,oscwave,oscsvgline,osctext;
var oscdatalinecolors = [
  '#E7C331',
  "#00AED9",
  "#C319A0",
  "LawnGreen"
];

var data1;







//菜单变量
var oscstartknob,oscmenuknob,oscmenuA1,marrA1,mtextA1,oscmenuB1,marrB1,mtextB1,oscmenuB2,marrB2,mtextB2,oscmenuB3,marrB3,mtextB3;
var menuclose,fftmenuclose;  //自动关闭时钟ID
var mcTime = 5000;  //关闭定时
var oscmenustate = [0,0,0,0],oscmenustate = [0,0,0];  //{A1,B1,B2,B3}
var osc_stat = 0; //示波器运行暂停标志{1:run,0:stop}
//定时关闭
function msettc(){
  clearTimeout(menuclose);
  menuclose = setTimeout("mclose()",mcTime);
}

function mclose(){
  oscmenustate = [0,0,0,0];
  $(".oscmA").hide();
  $(".oscmB").hide();
}

function fftmsettc(){
  clearTimeout(fftmenuclose);
  fftmenuclose = setTimeout("fftmclose()",mcTime);
}

function fftmclose(){
  oscfftmenustate = [0,0,0];
  $(".oscfftmA").hide();
  $(".oscfftmB").hide();
}

$(function(){
  //波形界面
  {
    oscsvgmargin = {top: 80, right: 0, bottom: 0, left: 80},
      oscwidth = 570,
      oscheight = 352;

    oscsvgx = d3.scale.linear()
      .domain([0, xMaxNum])
      .range([0, oscwidth]);

    oscsvgy = d3.scale.linear()
      .domain([0, (255*4)])
      .range([oscheight,0]);
      
    oscsvgxAxis = d3.svg.axis()
      .scale(oscsvgx)
      .tickSize(-oscheight)
      // .tickValues([])
      .tickPadding(10)  
      .tickSubdivide(true)  
        .orient("bottom");
      
    oscsvgyAxis = d3.svg.axis()
      .scale(oscsvgy)
      .tickPadding(10)
      // .tickValues([])
      .tickSize(-oscwidth)
      .tickSubdivide(true)  
      .orient("left");

    oscsvg = d3.select("#osc").append("svg")
      .attr("class","oscsvg")
      .attr()
      // .call(oscsvgzoom)
      .attr("width", 1000)
      .attr("height", 500)

    oscwave = oscsvg.append("g")
        .attr("transform", "translate(" + oscsvgmargin.left + "," + oscsvgmargin.top + ")")
        .attr("width","400")
        .attr("height","400");

    oscwave.append("g")
      .attr("class", "x oscaxis")
      .attr("transform", "translate(0," + oscheight + ")")
      .call(oscsvgxAxis)
      .selectAll(".tick")
      .text("");
   
    oscwave.append("g")
        .attr("class", "y oscaxis")
        .call(oscsvgyAxis)
        .selectAll(".tick")
        .text(""); 
    
    // console.log(oscsvg);
    for(var i = 1;i <= 9;i++)
    {
      oscwave.append("line")
        .attr("x1",oscwidth/10*i)
        .attr("y1",0)
        .attr("x2",oscwidth/10*i)
        .attr("y2",oscheight)
        .attr("stroke","#bbb")
        .attr("stroke-dasharray","5,5")
        .attr("stroke-width","1")
        .attr("shape-rendering","crispEdges");
    }
     
    for(var i = 1;i <= 7;i++)
    {
      oscwave.append("line")
        .attr("x1",0)
        .attr("y1",oscheight/8*i)
        .attr("x2",oscwidth)
        .attr("y2",oscheight/8*i)
        .attr("stroke","#bbb")
        .attr("stroke-dasharray","5,5")
        .attr("stroke-width","1")
        .attr("shape-rendering","crispEdges");
    }

    oscwave.append("clipPath")
      .attr("id", "oscclip")
      .append("rect")
      .attr("width", oscwidth)
      .attr("height", oscheight);

    oscsvgline = d3.svg.line()
      .interpolate("linear") 
      .x(function(d) { return oscsvgx(d.x); })
      .y(function(d) { return oscsvgy(d.y); });
  }  

  //添加旋钮
  {
    // CH1 下
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn1")
      .attr("transform","translate(689,362)")
      .append("circle")
      .attr("class","knobA")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","30")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn1")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");

    // CH2 下
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn2")
      .attr("transform","translate(752,363)")
      .append("circle")
      .attr("class","knobB")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","30")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn2")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","1")
      .attr("fill","green")
      .attr("opacity","0");

    // CH1 上
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn3")
      .attr("transform","translate(698,241)")
      .append("circle")
      .attr("class","knobC")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","20")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn3")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");

    // CH2 上
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn4")
      .attr("transform","translate(761,241)")
      .append("circle")
      .attr("class","knobD")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","20")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn4")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","1")
      .attr("fill","green")
      .attr("opacity","0");

    // CH3 下
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn7")
      .attr("transform","translate(814,360)")
      .append("circle")
      .attr("class","knobF")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","30")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn7")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");

    // CH3 上
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn8")
      .attr("transform","translate(822,239)")
      .append("circle")
      .attr("class","knobG")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","20")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn8")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");

    // CH4 下
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn9")
      .attr("transform","translate(871,360)")
      .append("circle")
      .attr("class","knobH")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","30")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn9")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");

    // CH4 上
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn10")
      .attr("transform","translate(884,239)")
      .append("circle")
      .attr("class","knobI")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","20")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn10")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");  

    // 触发电平
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn11")
      .attr("transform","translate(899,166)")
      .append("circle")
      .attr("class","knobJ")
      .attr("cx","16")
      .attr("cy","16")
      .attr("r","16")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn11")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","16")
      .attr("cy","16")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0"); 


    // 时基
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn5")
      .attr("transform","translate(694,126)")
      .append("circle")
      .attr("class","knobE")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","30")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn5")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");

    // 偏移
    oscsvg.append("g")
      .attr("class","oscknob")
      .attr("id","kn6")
      .attr("transform","translate(801.5,135)")
      .append("circle")
      .attr("class","knobF")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","20")
      .attr("fill","red")
      .attr("opacity","0");

    d3.select("#kn6")
      .append("circle")
      .attr("class","oscknobp")
      .attr("cx","20")
      .attr("cy","20")
      .attr("r","0.1")
      .attr("fill","green")
      .attr("opacity","0");

  }

  //旋钮事件
  {


    function osconMouseDown(event) {
      oscmdown = true;
      oscknobp0.x = event.pageX - $(".oscknobp",$(this)).offset().left;
      oscknobp0.y = event.pageY - $(".oscknobp",$(this)).offset().top;
      oscknobp0.tan = oscknobp0.y/oscknobp0.x;
      // console.log(0,oscknobp0.y/oscknobp0.x);
      // console.log(0,(event.pageX - $(".oscknobp",$(this)).offset().left),(event.pageY - $(".oscknobp",$(this)).offset().top));
    };

    function osconMouseUp(event) {
      oscmdown = false;
    };

    function osconMouseMove(event) {
      if (oscmdown) {
        oscknobp1.x = event.pageX - $(".oscknobp",$(this)).offset().left;
        oscknobp1.y = event.pageY - $(".oscknobp",$(this)).offset().top;
        oscknobp1.tan = oscknobp1.y/oscknobp1.x;
        if(oscknobp1.x*oscknobp0.x > 0)
        {
          if(oscknobp1.tan > oscknobp0.tan)
            oscmwheel = 1;
          else if(oscknobp1.tan < oscknobp0.tan)
            oscmwheel = -1;
        }
        else if(oscknobp1.x*oscknobp0.x < 0)
        {
          if(oscknobp1.tan > oscknobp0.tan)
            oscmwheel = -1;
          else if(oscknobp1.tan < oscknobp0.tan)
            oscmwheel = 1;
        }
        oscknobp0.x = oscknobp1.x;
        oscknobp0.y = oscknobp1.y;
        oscknobp0.tan = oscknobp1.tan;
        oscsetWheelPosition(-oscmwheel,$(this).attr("id"));
        // console.log(1,(event.pageX - $(".oscknobp",$(this)).offset().left),(event.pageY - $(".oscknobp",$(this)).offset().top));
        // console.log(1,oscmwheel);
      }
    };

    function osconMouseOver(){
      // console.log(1);
      $("#module01").css({
        "overflow-y":"hidden"
      });
      
      oscmover = true;        
    }

    function osconMouseLeave(event) {
      $("#module01").css({
        "overflow-y":"scroll"
      });
      
      oscmover = false;
      oscmwheel = 0;
    };

    
    function oscsetWheelPosition(value,i) {
      // console.log(4,i);
      switch(i)
      {
        case "kn1":
          // console.log(1);
          CH1s += value;
          if(CH1s > 12){CH1s = 12;}
          else if(CH1s < 1){CH1s = 1;}
          else{
            switch(CH1s){
              case 1:
                A1 = 2/500;
              break;
              case 2:
                A1 = 5/500;
              break;
              case 3:
                A1 = 10/500;
              break;
              case 4:
                A1 = 20/500;
              break;
              case 5:
                A1 = 50/500;
              break;
              case 6:
                A1 = 100/500;
              break;
              case 7:
                A1 = 200/500;
              break;
              case 8:
                A1 = 500/500;
              break;
              case 9:
                A1 = 1000/500;
              break;
              case 10:
                A1 = 2000/500;
              break;
              case 11:
                A1 = 5000/500;
              break;
              case 12:
                A1 = 10000/500;
              break;
            }
          }
          // console.log(A1);
        break;
        case "kn2":
          // console.log(2);
          CH2s += value;
          if(CH2s > 12){CH2s = 12;}
          else if(CH2s < 1){CH2s = 1;}
          else{
            switch(CH2s){
              case 1:
                A2 = 2/500;
              break;
              case 2:
                A2 = 5/500;
              break;
              case 3:
                A2 = 10/500;
              break;
              case 4:
                A2 = 20/500;
              break;
              case 5:
                A2 = 50/500;
              break;
              case 6:
                A2 = 100/500;
              break;
              case 7:
                A2 = 200/500;
              break;
              case 8:
                A2 = 500/500;
              break;
              case 9:
                A2 = 1000/500;
              break;
              case 10:
                A2 = 2000/500;
              break;
              case 11:
                A2 = 5000/500;
              break;
              case 12:
                A2 = 10000/500;
              break;
            }
          }
          // console.log(A1);
        break;
        case "kn3":
          C1 += value;
        break;
        case "kn4":
          C2 += value;
        break;
        case "kn5":
          alls += value;
          alls = (alls > 12) ? 12 : ((alls < 0) ? 0 : alls);
          Bt = BtA[alls][1];
          console.log("档位："+BtA[alls][0]);
          ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x01,0x00,(0xff & BtA[alls][0]),0x00,0x00]));
        break;
        case "kn6":
          Dt += 50*value;
          if(Dt < 0)
            Dt = 0;
        break;
        case "kn11":

        break;
      }

      switch(serverstate){
        case 1:
        case 2:
        case 4:
        case 5:
        case 6:
          oscdrawline();
        break;
        
      }
    }

    // console.log(d3.selectAll(".oscknob"));
    $(".oscknob").each(function(){
      $(this).on("mousedown", osconMouseDown);
      $(this).on("mousemove", osconMouseMove);
      $(this).on("mouseover", osconMouseOver);
      $(this).on("mouseleave", osconMouseLeave);
      $("body").on("mouseup", osconMouseUp);
      $(this).get(0).addEventListener("mousewheel",function() {
        
        // event = event || window.event;
        if(event.wheelDelta > 0 || event.detail < 0){
          //向上滚

          // console.log("up");
          oscmwheel = -1;
        } 
        if(event.wheelDelta < 0 || event.detail > 0){
          //向下滚
          
          // console.log("down");
          oscmwheel = 1;
        }
        oscsetWheelPosition(-oscmwheel,$(this).attr("id"));
      });
      $(this).get(0).addEventListener("DOMMouseScroll",function() {
        
        // event = event || window.event;
        if(event.wheelDelta > 0 || event.detail < 0){
          //向上滚

          // console.log("up");
          oscmwheel = -1;
        } 
        if(event.wheelDelta < 0 || event.detail > 0){
          //向下滚
          
          // console.log("down");
          oscmwheel = 1;
        }
        oscsetWheelPosition(-oscmwheel,$(this).attr("id"));
      });
    });
  }

  //通道开关
  {
    var chse1 = oscsvg.append("g")
      .attr("class","oscchse")
      .attr("id","chse1")
      .attr("transform","translate(709,297)")
      .append("polygon")
      .attr("class","chseA")
      .attr("style","1")
      .attr("id","1")
      .attr("points","0,5 9,2 18,4 18,27 9,30 0,27")
      .attr("fill","#00Ff00")
      .attr("opacity","0.3");
  
    var chse2 = oscsvg.append("g")
      .attr("class","oscchse")
      .attr("id","chse2")
      .attr("transform","translate(771,297)")
      .append("polygon")
      .attr("class","chseB")
      .attr("style","1")
      .attr("id","2")
      .attr("points","0,5 9,2 18,4 18,27 9,30 0,27")
      .attr("fill","#00Ff00")
      .attr("opacity","0.3");
  
    var chse3 = oscsvg.append("g")
      .attr("class","oscchse")
      .attr("id","chse3")
      .attr("transform","translate(833,297)")
      .append("polygon")
      .attr("class","chseC")
      .attr("style","1")
      .attr("id","3")
      .attr("points","0,5 9,2 18,4 18,27 9,30 0,27")
      .attr("fill","#00Ff00")
      .attr("opacity","0.3");
  
    var chse4 = oscsvg.append("g")
      .attr("class","oscchse")
      .attr("id","chse4")
      .attr("transform","translate(895,297)")
      .append("polygon")
      .attr("class","chseD")
      .attr("style","1")
      .attr("id","4")
      .attr("points","0,5 9,2 18,4 18,27 9,30 0,27")
      .attr("fill","#00Ff00")
      .attr("opacity","0.3");
  }

  //通道显示选择
  $(".oscchse").each(function(){
    var c = $(this).children();
    $(this).click(function(){
      c.attr("style",""+ -parseInt(c.attr("style")));
      if(parseInt(c.attr("style")) == 1)
      {
        c.attr("opacity","0.3");
        $(".oscline[id='CH"+ c.attr("id") +"']").attr("visibility","visible");
      }
      else
      {
        c.attr("opacity","0");
        $(".oscline[id='CH"+ c.attr("id") +"']").attr("visibility","hidden");
      }
    });
  });

  //设置菜单
  {
    //创建菜单
    {
      //触发按钮设置
      
      oscmenuknob = oscsvg.append("g")
        .attr("class","oscmenuknob")
        .attr("id","oscmenuknob1")
        .attr("transform","translate(900,208)")
        .append("polygon")
        .attr("class","oscmk01")
        .attr("style","1")
        .attr("id","1")
        .attr("points","0,0 0,18 27,18 27,0")
        .attr("fill","transparent");
      

      //一级菜单
      oscmenuA1 = oscsvg.append("g")
        .attr("class","oscmA")
        .attr("id","oscmA1")
        .attr("transform","translate(570,165)");

      marrA1 = [0,1,2,1,2,1,2];
      mtextA1 = ["Trigger","触发模式","上升沿","触发通道","CH1","触发方式","自动"];

      oscmenuA1.append("rect")
        .attr({
          "height":"182",
          "width":"80",
          "fill":"black"
        });

      oscmenuA1.selectAll("g")
        .data(marrA1)
        .enter()
        .append("g")
        .attr("id",function(d,i){
          return "mgA1_"+i;
        })
        .attr("transform",function(d,i){
          return "translate(0,"+ (i*26) +")";
        })
        .append("rect")
        .attr("id",function(d,i){
          return "mrA1_"+i;
        })
        .attr({
          "height":"25",
          "width":"80",
          "rx":"2"
        })
        .attr("fill",function(d,i){
          return (d == 0) ? "silver" : ((d == 1) ? "#292929" : "black");
        });

      oscmenuA1.selectAll("g")
        .append("text")
        .data(mtextA1)
        .attr("id",function(d,i){
          return "mtA1_"+i;
        })
        .attr("transform",function(d,i){
          switch(i){
            case 0:
              return "translate(14.5,17)";
            break;
            case 1:
              return "translate(12,17)";
            break;
            case 2:
              return "translate(19,17)";
            break;
            case 3:
              return "translate(12,17)";
            break;
            case 4:
              return "translate(25.5,17)";
            break;
            case 5:
              return "translate(12,17)";
            break;
            case 6:
              return "translate(26,17)";
            break;
          }
        })
        .attr("fill",function(d,i){
          return (i == 0) ? "black" : "white";
        })
        .text(function(d){return d;});

      //二级菜单1
      
      oscmenuB1 = oscsvg.append("g")
        .attr("class","oscmB")
        .attr("id","oscmB1")
        .attr("transform","translate(490,217)");

      marrB1 = [0,1]
      mtextB1 = ["上升沿","下降沿"];

      oscmenuB1.append("rect")
        .attr({
          "height":"52",
          "width":"80",
          "fill":"black"
        });

      oscmenuB1.selectAll("g")
        .data(marrB1)
        .enter()
        .append("g")
        .attr("class","mgB1")
        .attr("id",function(d,i){
          return "mgB1_"+i;
        })
        .attr("index",function(d,i){
          return (i+1);
        })
        .attr("stat",function(d,i){
          return (i == 0) ? 1 : 0;
        })
        .attr("transform",function(d,i){
          return "translate(0,"+ (i*26) +")";
        })
        .append("rect")
        .attr("id",function(d,i){
          return "mrB1_"+i;
        })
        .attr({
          "height":"25",
          "width":"80",
          "rx":"2"
        })
        .attr("fill",function(d,i){
          return (d == 0) ? "silver" : ((d == 1) ? "#292929" : "black");
        });

      oscmenuB1.selectAll("g")
        .append("text")
        .data(mtextB1)
        .attr("id",function(d,i){
          return "mtB1_"+i;
        })
        .attr("transform",function(d,i){
          return "translate(19,17)";
        })
        .attr("fill",function(d,i){
          return (i == 0) ? "black" : "white";
        })
        .text(function(d){return d;});

      //二级菜单2
      
      oscmenuB2 = oscsvg.append("g")
        .attr("class","oscmB")
        .attr("id","oscmB2")
        .attr("transform","translate(490,269)");

      marrB2 = [0,1,1,1]
      mtextB2 = ["CH1","CH2","CH3","CH4"];

      oscmenuB2.append("rect")
        .attr({
          "height":"104",
          "width":"80",
          "fill":"black"
        });

      oscmenuB2.selectAll("g")
        .data(marrB2)
        .enter()
        .append("g")
        .attr("class","mgB2")
        .attr("id",function(d,i){
          return "mgB2_"+i;
        })
        .attr("index",function(d,i){
          return (i+1);
        })
        .attr("stat",function(d,i){
          return (i == 0) ? 1 : 0;
        })
        .attr("transform",function(d,i){
          return "translate(0,"+ (i*26) +")";
        })
        .append("rect")
        .attr("id",function(d,i){
          return "mrB2_"+i;
        })
        .attr({
          "height":"25",
          "width":"80",
          "rx":"2"
        })
        .attr("fill",function(d,i){
          return (d == 0) ? "silver" : ((d == 1) ? "#292929" : "black");
        });

      oscmenuB2.selectAll("g")
        .append("text")
        .data(mtextB2)
        .attr("id",function(d,i){
          return "mtB2_"+i;
        })
        .attr("transform",function(d,i){
          return "translate(25.5,17)";
        })
        .attr("fill",function(d,i){
          return (i == 0) ? "black" : "white";
        })
        .text(function(d){return d;});

      //二级菜单3
      
      oscmenuB3 = oscsvg.append("g")
        .attr("class","oscmB")
        .attr("id","oscmB3")
        .attr("transform","translate(490,321)");

      marrB3 = [0,1]
      mtextB3 = ["自动","单次"];

      oscmenuB3.append("rect")
        .attr({
          "height":"52",
          "width":"80",
          "fill":"black"
        });

      oscmenuB3.selectAll("g")
        .data(marrB3)
        .enter()
        .append("g")
        .attr("class","mgB3")
        .attr("id",function(d,i){
          return "mgB3_"+i;
        })
        .attr("index",function(d,i){
          return (i+1);
        })
        .attr("stat",function(d,i){
          return (i == 0) ? 1 : 0;
        })
        .attr("transform",function(d,i){
          return "translate(0,"+ (i*26) +")";
        })
        .append("rect")
        .attr("id",function(d,i){
          return "mrB3_"+i;
        })
        .attr({
          "height":"25",
          "width":"80",
          "rx":"2"
        })
        .attr("fill",function(d,i){
          return (d == 0) ? "silver" : ((d == 1) ? "#292929" : "black");
        });

      oscmenuB3.selectAll("g")
        .append("text")
        .data(mtextB3)
        .attr("id",function(d,i){
          return "mtB3_"+i;
        })
        .attr("transform",function(d,i){
          return "translate(26,17)";
        })
        .attr("fill",function(d,i){
          return (i == 0) ? "black" : "white";
        })
        .text(function(d){return d;});

      //开始暂停
      oscstartknob = oscsvg.append("rect")
        .attr({
          "class":"oscstknob",
          "x":"860",
          "y":"80",
          "fill":"transparent",
          "height":"27",
          "width":"49",
        });

      $(".oscstknob").click(function(){
        osc_stat = osc_stat ? 0 : 1;
        websend_fpga(0x8000,osc_stat);
      });

    }

    // 绑定事件
    { 
      mclose();
      
      //主按键
      $("#oscmenuknob1").click(function(){
        if(oscmenustate[0] == 0){
          $("#oscmA1").show();
          msettc(menuclose,mcTime);
          oscmenustate[0] = 1;
        } 
        else{
          clearTimeout(menuclose);
          mclose();
        }
      });

      // 一级菜单
      $("#mgA1_2").click(function(){
        clearTimeout(menuclose);
        msettc(menuclose,mcTime);

        if(oscmenustate[1] == 0){
          $(".oscmB").hide();
          for(var i = 1;i < 4;i++)
            oscmenustate[i] = 0;
          $("#oscmB1").show();
          oscmenustate[1] = 1;
        }
        else{
          oscmenustate[1] = 0;
          $("#oscmB1").hide();
        }
      });

      $("#mgA1_4").click(function(){
        clearTimeout(menuclose);
        msettc(menuclose,mcTime);
        
        if(oscmenustate[2] == 0){
          $(".oscmB").hide();
          for(var i = 1;i < 4;i++)
            oscmenustate[i] = 0;
          $("#oscmB2").show();
          oscmenustate[2] = 1;
        }
        else{
          oscmenustate[2] = 0;
          $("#oscmB2").hide();
        }
      });

      $("#mgA1_6").click(function(){
        clearTimeout(menuclose);
        msettc(menuclose,mcTime);
        
        if(oscmenustate[3] == 0){
          $(".oscmB").hide();
          for(var i = 1;i < 4;i++)
            oscmenustate[i] = 0;
          $("#oscmB3").show();
          oscmenustate[3] = 1;
        }
        else{
          oscmenustate[3] = 0;
          $("#oscmB3").hide();
        }
      });

      // 二级菜单
      $(".mgB1").each(function(){
        $(this).click(function(){
          clearTimeout(menuclose);
          msettc(menuclose,mcTime);

          var s = $(this).attr("stat");
          if(s != 1){
            var t = $(this);
            $(".mgB1[stat='1'] > rect").attr("fill","#292929");
            $(".mgB1[stat='1'] > text").attr("fill","white");
            t.children("rect").attr("fill","silver");
            t.children("text").attr("fill","black");
            $(".mgB1[stat='1']").attr("stat",0);
            t.attr("stat",1);
            $("#mtA1_2").text(function(){
              switch(t.attr("index")){
                case "1":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x04,0x00,0x00,0x00,0x00]));
                  return "上升沿";
                break;
                case "2":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x04,0x00,0x01,0x00,0x00]));
                  return "下降沿";
                break;
              }
            });
          }
          
        });
      });

      $(".mgB2").each(function(){
        $(this).click(function(){
          clearTimeout(menuclose);
          msettc(menuclose,mcTime);

          var s = $(this).attr("stat");
          if(s != 1){
            var t = $(this);
            $(".mgB2[stat='1'] > rect").attr("fill","#292929");
            $(".mgB2[stat='1'] > text").attr("fill","white");
            t.children("rect").attr("fill","silver");
            t.children("text").attr("fill","black");
            $(".mgB2[stat='1']").attr("stat",0);
            t.attr("stat",1);
            $("#mtA1_4").text(function(){
              switch(t.attr("index")){
                case "1":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x02,0x00,0x00,0x00,0x00]));
                  return "CH1";
                break;
                case "2":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x02,0x00,0x01,0x00,0x00]));
                  return "CH2";
                break;
                case "3":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x02,0x00,0x02,0x00,0x00]));
                  return "CH3";
                break;
                case "4":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x02,0x00,0x03,0x00,0x00]));
                  return "CH4";
                break;
              }
            });
          }
          
        });
      });

      $(".mgB3").each(function(){
        $(this).click(function(){
          clearTimeout(menuclose);
          msettc(menuclose,mcTime);

          var s = $(this).attr("stat");
          if(s != 1){
            var t = $(this);
            $(".mgB3[stat='1'] > rect").attr("fill","#292929");
            $(".mgB3[stat='1'] > text").attr("fill","white");
            t.children("rect").attr("fill","silver");
            t.children("text").attr("fill","black");
            $(".mgB3[stat='1']").attr("stat",0);
            t.attr("stat",1);
            $("#mtA1_6").text(function(){
              switch(t.attr("index")){
                case "1":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x05,0x00,0x01,0x00,0x00]));
                  return "自动";
                break;
                case "2":
                  ws.send(new Int8Array([0xff,0x04,0x00,0x0c,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x05,0x00,0x00,0x00,0x00]));
                  return "单次";
                break;
              }
            });
          }
          
        });
      });
    }

    //FFT菜单
    {
      //触发按钮设置
      
      oscfftmenuknob = oscsvg.append("g")
        .attr("class","oscfftmenuknob")
        .attr("id","oscfftmenuknob1")
        .attr("transform","translate(710,83)")
        .append("rect")
        .attr("class","oscfftmk01")
        .attr("style","1")
        .attr("id","1")
        .attr("width",47)
        .attr("height",24)
        .attr("fill","transparent");
      

      //一级菜单
      oscfftmenuA1 = oscsvg.append("g")
        .attr("class","oscfftmA")
        .attr("id","oscfftmA1")
        .attr("transform","translate(570,165)");

      fftmarrA1 = [0,1,2,1,2];
      fftmtextA1 = ["FFT","模式","关闭","通道","CH1"];

      oscfftmenuA1.append("rect")
        .attr({
          "height":"130",
          "width":"80",
          "fill":"black"
        });

      oscfftmenuA1.selectAll("g")
        .data(fftmarrA1)
        .enter()
        .append("g")
        .attr("id",function(d,i){
          return "fftmgA1_"+i;
        })
        .attr("transform",function(d,i){
          return "translate(0,"+ (i*26) +")";
        })
        .append("rect")
        .attr("id",function(d,i){
          return "fftmrA1_"+i;
        })
        .attr({
          "height":"25",
          "width":"80",
          "rx":"2"
        })
        .attr("fill",function(d,i){
          return (d == 0) ? "silver" : ((d == 1) ? "#292929" : "black");
        });

      oscfftmenuA1.selectAll("g")
        .append("text")
        .data(fftmtextA1)
        .attr("id",function(d,i){
          return "fftmtA1_"+i;
        })
        .attr("transform",function(d,i){
          switch(i){
            case 0:
              return "translate(25.5,17)";
            break;
            case 1:
              return "translate(25.5,17)";
            break;
            case 2:
              return "translate(25.5,17)";
            break;
            case 3:
              return "translate(25.5,17)";
            break;
            case 4:
              return "translate(25.5,17)";
            break;
          }
        })
        .attr("fill",function(d,i){
          return (i == 0) ? "black" : "white";
        })
        .text(function(d){return d;});

      //二级菜单1
      
      oscfftmenuB1 = oscsvg.append("g")
        .attr("class","oscfftmB")
        .attr("id","oscfftmB1")
        .attr("transform","translate(490,217)");

      fftmarrB1 = [1,0]
      fftmtextB1 = ["打开","关闭"];

      oscfftmenuB1.append("rect")
        .attr({
          "height":"52",
          "width":"80",
          "fill":"black"
        });

      oscfftmenuB1.selectAll("g")
        .data(fftmarrB1)
        .enter()
        .append("g")
        .attr("class","fftmgB1")
        .attr("id",function(d,i){
          return "fftmgB1_"+i;
        })
        .attr("index",function(d,i){
          return (i+1);
        })
        .attr("stat",function(d,i){
          return (i == 1) ? 1 : 0;
        })
        .attr("transform",function(d,i){
          return "translate(0,"+ (i*26) +")";
        })
        .append("rect")
        .attr("id",function(d,i){
          return "fftmrB1_"+i;
        })
        .attr({
          "height":"25",
          "width":"80",
          "rx":"2"
        })
        .attr("fill",function(d,i){
          return (d == 0) ? "silver" : ((d == 1) ? "#292929" : "black");
        });

      oscfftmenuB1.selectAll("g")
        .append("text")
        .data(fftmtextB1)
        .attr("id",function(d,i){
          return "fftmtB1_"+i;
        })
        .attr("transform",function(d,i){
          return "translate(25.5,17)";
        })
        .attr("fill",function(d,i){
          return (i == 1) ? "black" : "white";
        })
        .text(function(d){return d;});

      //二级菜单2
      
      oscfftmenuB2 = oscsvg.append("g")
        .attr("class","oscfftmB")
        .attr("id","oscfftmB2")
        .attr("transform","translate(490,269)");

      fftmarrB2 = [0,1,1,1]
      fftmtextB2 = ["CH1","CH2","CH3","CH4"];

      oscfftmenuB2.append("rect")
        .attr({
          "height":"104",
          "width":"80",
          "fill":"black"
        });

      oscfftmenuB2.selectAll("g")
        .data(fftmarrB2)
        .enter()
        .append("g")
        .attr("class","fftmgB2")
        .attr("id",function(d,i){
          return "fftmgB2_"+i;
        })
        .attr("index",function(d,i){
          return (i+1);
        })
        .attr("stat",function(d,i){
          return (i == 0) ? 1 : 0;
        })
        .attr("transform",function(d,i){
          return "translate(0,"+ (i*26) +")";
        })
        .append("rect")
        .attr("id",function(d,i){
          return "fftmrB2_"+i;
        })
        .attr({
          "height":"25",
          "width":"80",
          "rx":"2"
        })
        .attr("fill",function(d,i){
          return (d == 0) ? "silver" : ((d == 1) ? "#292929" : "black");
        });

      oscfftmenuB2.selectAll("g")
        .append("text")
        .data(fftmtextB2)
        .attr("id",function(d,i){
          return "fftmtB2_"+i;
        })
        .attr("transform",function(d,i){
          return "translate(25.5,17)";
        })
        .attr("fill",function(d,i){
          return (i == 0) ? "black" : "white";
        })
        .text(function(d){return d;});

    }

    // FFT绑定事件
    { 
      fftmclose();
      
      //主按键
      $("#oscfftmenuknob1").click(function(){
        if(oscfftmenustate[0] == 0){
          $("#oscfftmA1").show();
          fftmsettc();
          oscfftmenustate[0] = 1;
        } 
        else{
          clearTimeout(fftmenuclose);
          fftmclose();
        }
      });

      // 一级菜单
      $("#fftmgA1_2").click(function(){
        clearTimeout(fftmenuclose);
        fftmsettc();

        if(oscfftmenustate[1] == 0){
          $(".oscfftmB").hide();
          for(var i = 1;i < 3;i++)
            oscfftmenustate[i] = 0;
          $("#oscfftmB1").show();
          oscfftmenustate[1] = 1;
        }
        else{
          oscfftmenustate[1] = 0;
          $("#oscfftmB1").hide();
        }
      });

      $("#fftmgA1_4").click(function(){
        clearTimeout(fftmenuclose);
        fftmsettc();
        
        if(oscfftmenustate[2] == 0){
          $(".oscfftmB").hide();
          for(var i = 1;i < 3;i++)
            oscfftmenustate[i] = 0;
          $("#oscfftmB2").show();
          oscfftmenustate[2] = 1;
        }
        else{
          oscfftmenustate[2] = 0;
          $("#oscfftmB2").hide();
        }
      });

      // 二级菜单
      $(".fftmgB1").each(function(){
        $(this).click(function(){
          clearTimeout(fftmenuclose);
          fftmsettc();

          var s = $(this).attr("stat");
          if(s != 1){
            var t = $(this);
            $(".fftmgB1[stat='1'] > rect").attr("fill","#292929");
            $(".fftmgB1[stat='1'] > text").attr("fill","white");
            t.children("rect").attr("fill","silver");
            t.children("text").attr("fill","black");
            $(".fftmgB1[stat='1']").attr("stat",0);
            t.attr("stat",1);
            $("#fftmtA1_2").text(function(){
              switch(t.attr("index")){
                case "1":
                  serverstate = 3;
                  pcm_cvsd_sign = 11;
                  ws.send(new Int8Array([0xff,0x05,(deviceId & 0xff),0x0b,(parseInt($(".fftmgB2[stat='1']").attr("index")) - 1) & 0xff]));
                  oscsvg.selectAll('.oscline').remove();
                  return "打开";
                break;
                case "2":
                  serverstate = 1;
                  pcm_cvsd_sign = 0;
                  ws.send(new Int8Array([0xff,0x05,(deviceId & 0xff),0x00]));
                  oscsvg.selectAll('.oscline').remove();
                 return "关闭";
                break;
              }
            });
          }
          
        });
      });

      $(".fftmgB2").each(function(){
        $(this).click(function(){
          clearTimeout(fftmenuclose);
          fftmsettc();

          var s = $(this).attr("stat");
          if(s != 1){
            var t = $(this);
            $(".fftmgB2[stat='1'] > rect").attr("fill","#292929");
            $(".fftmgB2[stat='1'] > text").attr("fill","white");
            t.children("rect").attr("fill","silver");
            t.children("text").attr("fill","black");
            $(".fftmgB2[stat='1']").attr("stat",0);
            t.attr("stat",1);
            $("#fftmtA1_4").text(function(){
              switch(t.attr("index")){
                case "1":
                  ws.send(new Int8Array([0xff,0x05,(deviceId & 0xff),0x0b,0x00]));
                  return "CH1";
                break;
                case "2":
                  ws.send(new Int8Array([0xff,0x05,(deviceId & 0xff),0x0b,0x01]));
                  return "CH2";
                break;
                case "3":
                  ws.send(new Int8Array([0xff,0x05,(deviceId & 0xff),0x0b,0x02]));
                  return "CH3";
                break;
                case "4":
                  ws.send(new Int8Array([0xff,0x05,(deviceId & 0xff),0x0b,0x03]));
                  return "CH4";
                break;
              }
            });
          }
          
        });
      });
      
    }
  }

  //$(function)
});

function oscdrawline(){
  var i;
  var data1 = new Array();
  // console.log(A1,C1)
  for(var sign = 0;sign < oscMaxCH;sign++){
    data1[sign] = new Array();
    switch(sign){
      case 0:
        for(i = 0;(i) < getWaveData1.length ;i++){
          data1[sign][i] = {"x" : i*Bt,"y" : getWaveData1[i] & 0xff};
        }
      break;
      case 1:
        for(i = 0;(i) < getWaveData2.length ;i++){
          data1[sign][i] = {"x" : i*Bt,"y" : (getWaveData2[i] & 0xff) + 255};
        }
      break;
      case 2:
        for(i = 0;(i) < getWaveData3.length ;i++){
          data1[sign][i] = {"x" : i*Bt,"y" : (getWaveData3[i] & 0xff) + 255*2};
        }
      break;
      case 3:
        for(i = 0;(i) < getWaveData4.length ;i++){
          data1[sign][i] = {"x" : i*Bt,"y" : (getWaveData4[i] & 0xff) + 255*3};
        }
      break;
    }
    
  }
  
  // console.log(data1);
  // console.log(data);

  oscwave.selectAll('.oscline')
  // .attr("transform","translate(" + oscsvgmargin.left + "," + oscsvgmargin.top + ")")
  .data(data1)
  .enter()
  .append("path")
  .attr("class", "oscline")
  .attr("id",function(d,i){
    return "CH"+(i+1);
  })
  .attr("clip-path", "url(#oscclip)")
  .attr('stroke', function(d,i){      
    return oscdatalinecolors[i%oscdatalinecolors.length];
  })
  .attr("d", oscsvgline);

  oscwave.selectAll('path.oscline').attr('d', oscsvgline);

  // console.log(22);
}

