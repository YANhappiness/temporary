var oscMaxCH = 4;
var oscMd = 0; //示波器模式
var xMaxNum = 1024; //水平点数
var yMaxNum = 1024; //垂直点数
var Dt = 0;
var BtA = [[8,0.5,"500.0us"],[7,1,"1.000ms"],
          [6,2,"2.000ms"],[4,4,"5.000ms"],
          [3,8,"10.00ms"]],Bt = 1,alls = 1;//时基档位
var oscvdif = [128,384,640,896]; //各通道垂直位移
var oscvscale = [3,3,3,3],oscvsdata = [10,4,2,1,0.4],oscvstext = ["200mV","500mV","1.00V","2.00V","5.00V"];  //各通道垂直缩放档位
var oscchdata = [{ch:1},
                 {ch:2},
                 {ch:3},
                 {ch:4}];  //通道信息
var knobdata = [{id:"osckn1",ch:"1",position:"(689,362)",coc:{x:"30",y:"30"},r:"30",cr:"0.1",note:"ch1vscale"},
                {id:"osckn2",ch:"2",position:"(752,363)",coc:{x:"30",y:"30"},r:"30",cr:"0.1",note:"ch2vscale"},
                {id:"osckn3",ch:"3",position:"(814,360)",coc:{x:"30",y:"30"},r:"30",cr:"0.1",note:"ch3vscale"},
                {id:"osckn4",ch:"4",position:"(871,360)",coc:{x:"30",y:"30"},r:"30",cr:"0.1",note:"ch4vscale"},
                {id:"osckn5",ch:"1",position:"(698,241)",coc:{x:"20",y:"20"},r:"20",cr:"0.1",note:"ch1vpositon"},
                {id:"osckn6",ch:"2",position:"(761,241)",coc:{x:"20",y:"20"},r:"20",cr:"0.1",note:"ch2vpositon"},
                {id:"osckn7",ch:"3",position:"(822,239)",coc:{x:"20",y:"20"},r:"20",cr:"0.1",note:"ch3vpositon"},
                {id:"osckn8",ch:"4",position:"(884,239)",coc:{x:"20",y:"20"},r:"20",cr:"0.1",note:"ch4vpositon"},
                {id:"osckn9",ch:"0",position:"(694,126)",coc:{x:"30",y:"30"},r:"30",cr:"0.1",note:"allhscale"},
                {id:"osckn10",ch:"0",position:"(801.5,135)",coc:{x:"20",y:"20"},r:"20",cr:"0.1",note:"allhposition"},
                {id:"osckn11",ch:"0",position:"(899,166)",coc:{x:"16",y:"16"},r:"16",cr:"0.1",note:"trigger"}];  //旋钮数据数组
//旋钮变量
var oscmdown = false;
var oscmover = false;
var oscmwheel = 0;
var osctarget = 0;
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

var data1,data5;

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
      .domain([0, yMaxNum])
      .range([oscheight,0]);

    oscsvg = d3.select("#osc").append("svg")
      .attr("class","oscsvg")
      .attr()
      .attr("width", 1000)
      .attr("height", 500)

    oscwave = oscsvg.append("g")
        .attr("transform", "translate(" + oscsvgmargin.left + "," + oscsvgmargin.top + ")");
        

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

    //边框线
    var linepath = d3.svg.line();
    oscwave.append("path")
      .attr("d",linepath([[0,0],[0,oscheight],[oscwidth,oscheight],[oscwidth,0],[0,0]]))
      .attr("stroke","white")
      .attr("fill","none")
      .attr("stroke-width","1px");
  
    //CH游标
    
    oscsvg.append("g")
      .attr("class","oscg_02")
      .attr("transform","translate(60,74)")
      .selectAll("g")
      .data(oscchdata)
      .enter()
      .append("g")
      .attr("class","osccursor")
      .attr("ch",function(d,i){
        return d.ch;
      })
      .attr("transform",function(d,i){
        return "translate(0,"+(oscvdif[3-i]/yMaxNum*oscheight)+")";
      })
      .each(function(d,i){
        d3.select(this)
          .append("path")
          .attr("d",linepath([[0,0],[14,0],[19,6],[14,12],[0,12],[0,0]]))
          .attr("fill",function(){
            return oscdatalinecolors[i];
          });

        d3.select(this)
          .append("text")
          .attr("fill","black")
          .attr("text-anchor","middle")
          .attr("font-size","10px")
          .attr("x","8")
          .attr("y","0")
          .attr("dy","1em")
          .text(d.ch);
      });
    
    //CH电压档显示 
    oscsvg.append("g")
      .attr("class","oscg_03")
      .attr("transform","translate(80,432)")
      .selectAll("g")
      .data(oscchdata)
      .enter()
      .append("g")
      // .attr("class","chvtext")
      .attr("transform",function(d,i){
        return "translate("+i*100+",0)";
      })
      .each(function(d,i){
        d3.select(this)
          .append("text")
          .attr("fill",function(){
            return oscdatalinecolors[i];
          })
          .attr("text-anchor","start")
          .attr("font-size","15px")
          .attr("dy","1em")
          .text(function(){
            return "CH"+d.ch+"：";
          });

        d3.select(this)
          .append("text")
          .attr("class","chvtext")
          .attr("ch",function(){
            return i+1;
          })
          .attr("fill",function(){
            return oscdatalinecolors[i];
          })
          .attr("text-anchor","end")
          .attr("font-size","15px")
          .attr("x","85")
          .attr("dy","1em")
          .text(function(){
            return oscvstext[oscvscale[i]];
          });
      });

    //时基显示
    oscsvg.append("g")
      .attr("class","oscg_04")
      .attr("transform","translate(480,432)")
      .selectAll("g")
      .data(["Time"])
      .enter()
      .append("g")
      .each(function(d,i){
        d3.select(this)
          .append("text")
          .attr("fill","white")
          .attr("text-anchor","start")
          .attr("font-size","15px")
          .attr("dy","1em")
          .text(function(){
            return d;
          });

        d3.select(this)
          .append("text")
          .attr("class","oscTimetext")
          .attr("fill","white")
          .attr("text-anchor","end")
          .attr("font-size","15px")
          .attr("x","95")
          .attr("dy","1em")
          .text(function(){
            return BtA[alls][2];
          });
      });
  }  

  //添加旋钮
  {
    oscsvg.insert("g")
      .attr("class","oscg_01")
      .selectAll("g")
      .data(knobdata)
      .enter()
      .append("g")
      .attr("class","oscknob")
      .attr("id",function(d,i){
        return d.id;
      })
      .attr("ch",function(d,i){
        return d.ch;
      })
      .attr("transform",function(d,i){
        return "translate"+d.position;
      })
      .each(function(){
        d3.select(this).append("circle")
          .attr("cx",function(d,i){
            return d.coc.x;
          })
          .attr("cy",function(d,i){
            return d.coc.y;
          })
          .attr("r",function(d,i){
            return d.r;
          })
          .attr("fill","red")
          .attr("opacity","0");

        d3.select(this).append("circle")
          .attr("class","oscknobp")
          .attr("cx",function(d,i){
            return d.coc.x;
          })
          .attr("cy",function(d,i){
            return d.coc.y;
          })
          .attr("r","0.1")
          .attr("fill","green")
          .attr("opacity","0");  
      });
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
        "overflow-y":"auto"
      });
      
      oscmover = false;
      oscmwheel = 0;
    };

    
    function oscsetWheelPosition(value,i) {
      // console.log(4,i);
      switch(i)
      {
        //电压档
        case "osckn1":
        case "osckn2":
        case "osckn3":
        case "osckn4":
          var k = parseInt($("#"+i).attr("ch")) - 1;
          oscvscale[k] += value;
          oscvscale[k] = (oscvscale[k] > 4) ? 4 : (oscvscale[k] < 0) ? 0 : oscvscale[k];
          $(".chvtext[ch="+(k+1)+"]").text(oscvstext[oscvscale[k]]);
        break;
        // 垂直位移
        case "osckn5":
        case "osckn6":
        case "osckn7":
        case "osckn8":
          var k = parseInt($("#"+i).attr("ch")) - 1;
          oscvdif[k] += value*5;
          oscvdif[k] = (oscvdif[k] > yMaxNum) ? yMaxNum : (oscvdif[k] < 0) ? 0 : oscvdif[k]; 
          $(".osccursor[ch="+(k+1)+"]").attr("transform","translate(0,"+((1-oscvdif[k]/yMaxNum)*oscheight)+")")
        break;
        // 时基
        case "osckn9":
          alls += value;
          alls = (alls > 4) ? 4 : ((alls < 0) ? 0 : alls);
          Bt = BtA[alls][1];
          // $(".oscTimetext").text(BtA[alls][2]);
          // console.log("档位："+BtA[alls][0]);
          // ws.send(new Int8Array([0xff,0x04,0x00,0x0b,(0xff & deviceId),0x5a,0xa5,0x00,0x30,0xbb,0x80,0x01,0x00,(0xff & BtA[alls][0]),0x00,0x00]));
        break;
        // 水平位移
        case "osckn10":
          Dt += 50*value;
          if(Dt < 0)
            Dt = 0;
        break;
        // 触发电平
        case "osckn11":

        break;
      }

      oscdrawline();
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


    // 关闭按钮
    oscsvg.append("g")
      .attr("class","oscclose")
      .attr("data-dismiss","modal")
      .attr("transform","translate(890,25)")
      .append("rect")
      .attr("width","50")
      .attr("height","30")
      .attr("fill","transparent");
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
          data1[sign][i] = {"x" : i*Bt,"y" : ((getWaveData1[i] & 0xff) - 128)*oscvsdata[oscvscale[sign]] + oscvdif[sign]};
        }
      break;
      case 1:
        for(i = 0;(i) < getWaveData2.length ;i++){
          data1[sign][i] = {"x" : i*Bt,"y" : ((getWaveData2[i] & 0xff) - 128)*oscvsdata[oscvscale[sign]] + oscvdif[sign]};
        }
      break;
      case 2:
        for(i = 0;(i) < getWaveData3.length ;i++){
          data1[sign][i] = {"x" : i*Bt,"y" : ((getWaveData3[i] & 0xff) - 128)*oscvsdata[oscvscale[sign]] + oscvdif[sign]};
        }
      break;
      case 3:
        for(i = 0;(i) < getWaveData4.length ;i++){
          data1[sign][i] = {"x" : i*Bt,"y" : ((getWaveData4[i] & 0xff) - 128)*oscvsdata[oscvscale[sign]] + oscvdif[sign]};
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
  .attr("fill","transparent")
  .attr("clip-path", "url(#oscclip)")
  .attr('stroke', function(d,i){      
    return oscdatalinecolors[i%oscdatalinecolors.length];
  })
  .attr("d", oscsvgline);

  oscwave.selectAll('path.oscline').attr('d', oscsvgline);

  // console.log(22);
}

//fft
function oscdrawline5(){
  // console.log("oscdrawline5");
  var i;
  var data5 = [[]];
  for(i = 0;i < getWaveData1.length ;i++){
    data5[0][i] = {"x" : i*2,"y" : (getWaveData1[i] & 0xff)*3 + 128};
  }

  oscwave.selectAll('.oscline')
  // .attr("transform","translate(" + oscsvgmargin.left + "," + oscsvgmargin.top + ")")
  .data(data5)
  .enter()
  .append("path")
  .attr("class", "oscline")
  .attr("fill","none")
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

// 51 adda
function oscdrawline_1(){
  var data1 = new Array();
  data1[0] = new Array();

  for(var i = 0;(i) < getVal.length ;i++){
    data1[0][i] = {"x" : i*Bt,"y" : ((getVal[i] & 0xff) - 128)*oscvsdata[oscvscale[0]] + oscvdif[0]};
  }
  oscwave.selectAll('.oscline')
    .data(data1)
    .enter()
    .append("path")
    .attr("class", "oscline")
    .attr("id",function(d,i){
      return "CH"+(i+1);
    })
    .attr("fill","transparent")
    .attr("clip-path", "url(#oscclip)")
    .attr('stroke', function(d,i){      
      return oscdatalinecolors[i%oscdatalinecolors.length];
    })
    .attr("d", oscsvgline);

  oscwave.selectAll('path.oscline').attr('d', oscsvgline);

  // console.log(22);
}
