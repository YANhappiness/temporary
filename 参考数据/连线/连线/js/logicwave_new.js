document.write("<script src='js/jquery.mousewheel.js'></script>");

var logicMaxCH = 9;  //通道数
var logicNowCH = logicMaxCH; //当前的通道数
var logicpause = 0;
// var logicdatalinecolors = [
//   'Aqua',
//   'Fuchsia',
//   'Yellow',
//   'LawnGreen',
// ];
var logicdatalinecolors = [
  '#7FDBFF',
  '#2ECC40',
  '#FFDC00',
  '#FF4136',
  '#39CCCC',
  '#01FF70',
  '#FF851B',
  '#F012BE',
];

var logicsvgline,logicsvgline2;
var log_trigger_element;
// 创建svg
$(function(){
  var logicsvgmargin = {top: 20, right: 30, bottom: 50, left: 50},
  logicwidth = 1150,
  logicheight = 600;

  /*
   *结构
    <svg> -- logicsvg
      <rect></rect> -- 内框线
      <text></text> -- 逻分标题
      <linearGradient></linearGradient> -- 线性渐变 #l-g_01
      
      <g> -- 主界面组 log_g_main
        <rect></rect> -- 背景框

        <g> -- 波形部分 log_g_wave
          <g></g> -- 标题 .wavetitle
          <g></g> -- 通道界面 .wavechannel
          <g></g> -- 合波界面 .mixwave
          <g></g> -- 波形显示 .log_g_waveline
        </g>

        <g> -- 交互部分 
        </g>
      </g>

    </svg>
   */

  // 主svg
  var logicsvg = d3.select("#logic_analyzer").append("svg")
    .attr("width", logicwidth)
    .attr("height", logicheight);

  // 内框线
  logicsvg.append("rect").attr({
    fill:"transparent",
    stroke:"black",
    "stroke-width":2,
    height:590,
    width:1140,
    rx:15,
    x:5,
    y:5,
  });

  // 标题
  logicsvg.append("text").attr({
    "text-anchor":"start",
    "font-size":"25px",
    x:30,
    y:35,
    fill:"white",
  }).text("逻辑分析仪");

  // 电源开关
  logicsvg.append('g').attr({
    'transform':'translate(1030,10)',
  })
  .each(function(){
    d3.select(this).append('rect')
      .attr({
        height:40,
        width:80,
        fill:'transparent',
        rx:5,
      });

    d3.select(this).append('circle')
      .attr({
        cx:40,
        cy:20,
        r:12,
        fill:'transparent',
        stroke:'red',
        'stroke-width':5,
      });

    d3.select(this).append('rect')
      .attr({
        height:20,
        width:10,
        fill:'#434343',
        x:35,
        y:3,
      })

    d3.select(this).append('path')
      .attr({
        d:'M40 3 L 40 23',
        stroke:'red',
        'stroke-width':5,
      });

    $(this).click(function(){
      $('#logicboard').modal('hide');
    });
  })

  //创建线性渐变 #l-g_01  #888 - #000
  logicsvg.append("linearGradient")
    .attr({
      id:"l-g_01",
      x1:"0%",
      x2:"0%",
      y1:"0%",
      y2:"100%",  
    })
    .selectAll("stop").data(new Array(2)).enter().append("stop")
    .attr({
      offset:function(d,i){return 100*i+"%";},
      "stop-color":function(d,i){if(i == 0){return "#888";}else{return "#000";}},
      "stop-opacity":1,
    });

  // 主界面组
  var log_g_main = logicsvg.append("g")
    .attr({
      class:"log_g_main",
      "transform":"translate(20,50)",
    });

  // 主区域
  log_g_main.append("rect")
    .attr({
      height:530,
      width:1100,
      fill:"black",  
    });

  // 波形部分
  var log_g_wave = log_g_main.append("g").attr({class:"log_g_wave",transform:"translate(20,10)"});

  // 标题
  log_g_wave.append("g")
    .attr({
      class:"wavetitle",
      transform:"translate(0,0)",
    })
    .selectAll("g")
    .data(["(0,0)","(110,0)"])
    .enter()
    .append("g")
    .attr("transform",function(d,i){return "translate" + d;})
    .each(function(d,i){
      d3.select(this).append("rect")
        .attr({
          height:40,
          width:function(){if(i==0){return 100;}else{return 150;}},
          fill:"url(#l-g_01)",
        });

      d3.select(this).append("text")
        .attr({
          "text-anchor":"middle",
          x:function(){if(i==0){return 50;}else{return 75;}},
          y:"1.3em",
          "font-size":"20px",
          fill:"white",
        })
        .text(function(){return (i == 0) ? "通道" : "触发设置";});
    });

  // 8个通道 + 时钟
  log_g_wave.append("g")
    .attr({
      class:"wavechannel",
      transform:"translate(0,40)",
    })
    .selectAll("g")
    .data(["(0,0)","(0,30)","(0,60)","(0,90)","(0,120)","(0,150)","(0,180)","(0,210)","(0,240)"])
    .enter()
    .append("g")
    .attr({
      transform:function(d,i){return "translate"+d;},
      ch:function(d,i){return (i+1);},
    })
    .each(function(d,i){
      var _i = i;

      // 背景
      d3.select(this).append("rect")
        .attr({
          height:30,
          width:1050,
          fill:"url(#l-g_01)",
        });

      // 色块
      d3.select(this).append("rect")
        .attr({
          height:22,
          width:15,
          fill:function(){return logicdatalinecolors[i%logicdatalinecolors.length];},
          x:5,
          y:4,
        })

      // 通道名
      d3.select(this).append("text")
        .attr({
          "text-anchor":"middle",
          fill:"white",
          "font-family":"Museo",
          "font-size":"20px",
          x:60,
          y:"1.1em",
        })
        .text(function(){if(i < 8){return "CH"+(i+1);}else{return "CLK";}});

      // 第一个分割线
      d3.select(this).append("path")
        .attr({
          d:"M0,5 L 0,25",
          transform:"translate(105,0)",
          stroke:"white",
          "stroke-width":1.5,
        });

      // 四种触发方式 .tristy
      d3.select(this).append("g")
        .attr({
          trisign:0,
        })
        .selectAll("g")
        .data([{pos:"(120,5)",d:"M4,16 L10,16 L10,4 L16,4 M6,12 L10,8 L14,12"},{pos:"(155,5)",d:"M4,4 L16,4"},
              {pos:"(190,5)",d:"M4,4 L10,4 L10,16 L16,16 M6,8 L10,12 L14,8"},{pos:"(225,5)",d:"M4,16 L16,16"}])
        .enter()
        .append("g")
        .attr({
          transform:function(d,i){return "translate"+d.pos;},
          i:function(d,i){return (i+1);},
        })
        .each(function(d,i){
          d3.select(this).append("rect")
            .attr({
              height:20,
              width:20,
              fill:"white",
            });

          d3.select(this).append("path")
            .attr({
              d:function(){return d.d;},
              stroke:"black",
              "stroke-width":2,
              fill:"none",
            });

          // console.log(_i);
          if(_i == 0 && i == 0){
            log_trigger_element = this;
            $(log_trigger_element).children('rect').attr('fill','#daa520');
            // console.log(log_trigger_element);
          }
            
          $(this).click(function(){
            var t = $(this);  //当前选择的触发方式
            var p = t.parent(); //当前通道触发方式所在组
            var _p = p.parent();  //当前通道组
            var t_i = parseInt(t.attr("i"));  //当前触发方式号
            var p_t = parseInt(p.attr("trisign"));  //当前通道触发方式
            var _p_ch = parseInt(_p.attr("ch")); //当前通道号
            if(_p_ch > 8){
              return 0;
            }
            if(t_i == p_t){ //当前已经为选中状态
              // t.children("rect").attr("fill","white");
              // p.attr("trisign",0);

            }else{
              // if(p_t == 0){
              //   t.children("rect").attr("fill","#daa520");
              //   p.attr("trisign",t_i);
              //   if(_p_ch <= 8){
              //     websend_fpga(0x1003,(t_i << 8) + _p_ch-1);
              //     console.log("addr: 0x1003, val : 0x%s",((t_i << 8) + _p_ch-1).toString(16));
              //   }
              // }else{
              //   p.children("g[i="+p_t+"]").children("rect").attr("fill","white");
              //   t.children("rect").attr("fill","#daa520");
              //   p.attr("trisign",t_i);
              //   if(_p_ch <= 8){                
              //     websend_fpga(0x1003,(t_i << 8) + _p_ch-1);
              //     console.log("addr: 0x1003, val : 0x%s",((t_i << 8) + _p_ch-1).toString(16));
              //   }
              // }
              
              $(log_trigger_element).children('rect').attr('fill','white');
              $(this).children("rect").attr("fill","#daa520");
              log_trigger_element = this;
              websend_fpga(0x1003,(t_i << 8) + _p_ch-1);
              console.log("addr: 0x1003, val : 0x%s",((t_i << 8) + _p_ch-1).toString(16));

            }
          });

        });

      // 第二个分割线
      d3.select(this).append("path")
        .attr({
          d:"M0,5 L 0,25",
          transform:"translate(259,0)",
          stroke:"white",
          "stroke-width":1.5,
        });

      // 波形背景
      d3.select(this).append("rect")
        .attr({
          height:22,
          width:770,
          x:270,
          y:4,
          fill:"#222222",
        });
    });

  // 合波
  log_g_wave.append("g")
    .attr({
      class:"mixwave",
      transform:"translate(0,310)",
    })
    .each(function(){
      // 背景
      d3.select(this).append("rect")
        .attr({
          height:140,
          width:1050,
          fill:"url(#l-g_01)",
        });

      // 名称
      d3.select(this).append("text")
        .attr({
          "text-anchor":"middle",
          fill:"white",
          "font-family":"Museo",
          "font-size":"20px",
          x:50,
          y:70,
        })
        .text("Wave");

      // 第一个分割线
      d3.select(this).append("path")
        .attr({
          d:"M0,5 L 0,135",
          transform:"translate(105,0)",
          stroke:"white",
          "stroke-width":1.5,
        });

      // 第二个分割线
      d3.select(this).append("path")
        .attr({
          d:"M0,5 L 0,135",
          transform:"translate(259,0)",
          stroke:"white",
          "stroke-width":1.5,
        });

      // 波形背景
      d3.select(this).append("rect")
        .attr({
          height:100,
          width:770,
          x:270,
          y:4,
          fill:"#222222",
        });

      // 波形缩略背景
      d3.select(this).append("rect")
        .attr({
          height:25,
          width:770,
          x:270,
          y:110,
          fill:"#444444",
        });

      // 波形缩略区域显示 .waveshowarea
      d3.select(this).append("rect")
        .attr({
          class:"waveshowarea",
          height:25,
          width:375.98,
          x:270,
          y:110,
          stroke:"#00bfff",
          "stroke-width":2,
          fill:"rgba(0,255,255,0.2)",
        });
    });

  // 波形
  {
    var logwaveheight = 374,logwavewidth = 770;
    var logxMax = 500; // 初始同屏显示点数
    var logdatalength = 1024; //数据长度

    // x方向比例尺
    var logxscale = d3.scale.linear()
      .domain([-250, logxMax-250])
      .range([0, logwavewidth]);

    // y方向比例尺 应用于合波
    var logyscale = d3.scale.linear()
      .domain([0, 255])
      .range([374,274]);

    // x坐标轴
    var logxaxis = d3.svg.axis()
      // .tickValues([-250,-200,-150,-100,-50,0,50,100,150,200,250])
      .scale(logxscale)
      .orient("top");

    var logicdrag = d3.behavior.drag().on("drag",log_dragcall); //定义drag事件
    var logtx = [logwavewidth/2,0]; //游标位置数组
    var logicsvgzoom = d3.behavior.zoom() //定义zoom事件
      .x(logxscale) 
      .scaleExtent([1,20])
      .on("zoom", log_zoomcall);
   
    // drag回调
    function log_dragcall(){
      var i = d3.select(this).attr("ms");
      if(d3.event.x < 0)
        logtx[i-1] = 0;
      else if(d3.event.x > logwavewidth)
        logtx[i-1] = logwavewidth;
      else
        logtx[i-1] = d3.event.x;
      d3.select(this).attr("transform","translate("+ logtx[i-1] +",0)");
      // console.log(x,logicsvgzoom.translate()[0],logicwidth,logicsvgzoom.scale());
      $(".logt1[ms="+i+"]").text(Math.round((logtx[i-1]-logicsvgzoom.translate()[0])/logicsvgzoom.scale()/(logwavewidth/500))-250);
    }

    // zoom回调
    function log_zoomcall() {
      //一倍缩放下的
      var dx = logwavewidth/logxMax; //间隔像素
      var xl = dx*logdatalength; //总长
      if(logicsvgzoom.translate()[0] > 0)
      {
        logicsvgzoom.translate([0,0]);
      }
      if(logicsvgzoom.translate()[0] < logwavewidth - xl*logicsvgzoom.scale()){
        logicsvgzoom.translate([logwavewidth - logdatalength*dx*logicsvgzoom.scale(),0]);
      }
      for(var i = 1;i<3;i++){
        // console.log(logtx[i-1],logicsvgzoom.translate()[0],logicsvgzoom.scale());
        $(".logt1[ms="+i+"]").text(Math.round((logtx[i-1]-logicsvgzoom.translate()[0])/logicsvgzoom.scale()/(logwavewidth/500))-250);
      }
      // console.log(logicsvgzoom.translate(),logicsvgzoom.scale());
      // console.log($(".logline").attr("width"));
      $(".waveshowarea").attr({
        width:logxMax/logdatalength*logwavewidth/logicsvgzoom.scale(),
        x:270-logicsvgzoom.translate()[0]/logicsvgzoom.scale()/dx/logdatalength*logwavewidth,
      });
      d3.select(".waveline").call(logxaxis);
      d3.select(".waveline").selectAll("path.logline").attr("d", logicsvgline);
      d3.select(".waveline").selectAll("path.mixline").attr("d", logicsvgline2);  
    }

    //标准线生成器
    var linepath = d3.svg.line(); 

    // 线生成器 step-after 方波插值模式
    logicsvgline = d3.svg.line()
      .interpolate("step-after") 
      .x(function(d) { return logxscale(d.x); })
      .y(function(d) { return d.y; });

    // 线生成器 linear 折线插值模式
    logicsvgline2 = d3.svg.line()
      .interpolate("linear") 
      .x(function(d) { return logxscale(d.x); })
      .y(function(d) { return logyscale(d.y); });

    // 波形显示组
    var log_g_waveline = log_g_wave.append("g")
          .attr({
            class:"log_g_waveline",
            transform:"translate(270,40)",
          });

    // 初始化波形线
    log_g_waveline.append("g")
      .attr("class","waveline")
      .call(logicsvgzoom)
      .call(logxaxis)
      .each(function(){
        // 明确区域
        d3.select(this).append("rect")
          .attr({
            height:logwaveheight,
            width:logwavewidth,
            fill:"transparent",
          });

        // 遮罩 #clip
        d3.select(this).append("clipPath")
          .attr("id","clip")
          .append("rect")
          .attr({height:logwaveheight,width:logwavewidth,});

        // 8通道+时钟
        d3.select(this).selectAll('.logline')
          .data(new Array(9))
          .enter()
          .append("path")
          .attr({
            "class":"logline",
            fill:"transparent",
            "clip-path":"url(#clip)",
            "stroke":function(d,i){return logicdatalinecolors[i%logicdatalinecolors.length];},
          });
        
        // 合波
        d3.select(this).selectAll('mixline')
          .data(new Array(1))
          .enter()
          .append("path")
          .attr({
            "class": "mixline",
            fill:"transparent",
            "clip-path": "url(#clip)",
            stroke: "yellow",
          }); 
      });

    // 游标
    log_g_waveline.append("g")
      .attr("transform", "translate(0,0)")
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
      .attr("transform",function(d,i){
        return "translate("+ logtx[i] +",0)";
      })
      .each(function(d,i){
        d3.select(this)
          .append("path")
          .attr("d","M0,0L0,374")
          .attr("stroke",function(){return "white";})
          .attr("stroke-width","2");

        d3.select(this)
          .append("path")
          .attr("d",linepath([[0,0],[-3,-3],[-3,-10],[3,-10],[3,-3],[0,0]]))
          .attr("fill","white");

        d3.select(this)
          .append("text")
          .attr({
            "text-anchor":"middle",
            y:-11,
            "font-size":"8px",
            fill:"white",
          })
          .text(function(){
            return "T"+(i+1);
          });
      });
  }

  // 交互区域
  var log_g_interact = log_g_main.append("g")
    .attr({
      class:"log_g_interact",
      transform:"translate(20,470)",
    });

  // 控制区
  log_g_interact.append("g")
    .attr({
      transform:"translate(0,0)"
    })
    .each(function(){
      // 开始暂停
      d3.select(this).append("g")
        .attr({
          state:1,
          transform:"translate(20,5)",
        })
        .each(function(){
          d3.select(this).append("rect")
            .attr({
              fill:"white",
              height:40,
              width:80,
              rx:10,          
            });

          d3.select(this).append("polygon")
            .attr({
              class:"logrunbt",
              fill:"black",
              points:"35,5 35,35 55,20 35,5",
            });

          d3.select(this).append("polygon")
            .attr({
              class:"logstopbt",
              fill:"black",
              points:"35,5 30,5 30,35 35,35 35,5 45,5 50,5 50,35 45,35 45,5",
            });

          $(".logstopbt").hide();
          //绑定事件
          $(this).click(function(){
            var i = parseInt($(this).attr("state"));
            if(i == 1){
              $(".logrunbt").hide();
              $(".logstopbt").show();
              $(this).children("rect").attr("fill","red");
              $(this).attr("state","0");
              logicstop(); //网页逻分停止刷新数据
              websend_fpga(0x1001,0); //底层逻分数据停止发送
            }else{
              $(".logstopbt").hide();
              $(".logrunbt").show();
              $(this).children("rect").attr("fill","white");
              $(this).attr("state","1");
              logicrun(); //网页逻分开始刷新数据
              websend_fpga(0x1001,1); //底层逻分数据继续发送
            }
          });
        
        });

      //采样率选择
      d3.select(this).append("g")
        .attr({
          transform:"translate(150,0)",
        })
        .each(function(){
          d3.select(this).append("text")
            .attr({
              "text-anchor":"start",
              "font-size":"20px",
              fill:"white",
              y:32,
            })
            .text("采样率：");

          //采样率显示框
          d3.select(this).append("g")
            .attr({
              class:"log_sf_tri",
              transform:"translate(80,10)",
              state:0,
            })
            .each(function(){
              d3.select(this).append("rect")
                .attr({
                  fill:"white",
                  height:25,
                  width:120,
                  rx:3,
                });

              d3.select(this).append("text")
                .attr({
                  "text-anchor":"middle",
                  x:60,
                  y:20,
                  fill:"black",
                  "font-size":"20px",
                })
                .text("4K/s");

              $(this).click(function(){
                var s = parseInt($(this).attr("state"));
                if(s == 0){
                  logsfopen();
                }else{
                  logsfclose();
                }
              });

            });
          
          d3.select(this).append("clipPath")
            .attr("id","logsfclip")
            .append("rect")
            .attr({
              height:100,
              width:120,
              rx:3,
            });

          //采样率选择菜单
          d3.select(this).append("g")
            .attr({
              class:" ",
              transform:"translate(80,-90)",
              "clip-path":"url(#logsfclip)",
            })
            .append("g")
            .attr("class","log_g_sf")
            .selectAll("g")
            .data(["2M/s","1M/s","512K/s","256K/s","128K/s","64K/s","32K/s","16K/s","8K/s","4K/s"])
            .enter()
            .append("g")
            .attr({
              class:"log_sfcho",
              transform:function(d,i){return "translate(0,"+ 25*i +")"},
              i:function(d,i){return 11-i;},
            })
            .each(function(d,i){
              d3.select(this).append("rect")
                .attr({
                  fill:"white",
                  height:25,
                  width:120,
                  stroke:"black",
                  "stroke-width":1,
                });

              d3.select(this).append("text")
                .attr({
                  "text-anchor":"middle",
                  x:60,
                  y:20,
                  fill:"black",
                  "font-size":"20px",
                })
                .text(function(){return d});

              $(this).click(function(){
                // console.log(d);
                var i = parseInt($(this).attr("i"));
                $(".log_sf_tri").children("text").text(function(){return d});
                websend_fpga(0x1002,i);
                console.log("addr: 0x1002, val: "+i);
                logsfclose();
              });
            });

            $(".log_g_sf").hide();

            function logsfopen(){
              $(".log_g_sf").show();
              $(".log_g_sf").attr("transform","translate(0,0)");
              $(".log_sf_tri").attr("state","1");
            }

            function logsfclose(){
              $(".log_g_sf").attr("transform","translate(0,-80)");
              $(".log_g_sf").hide();
              $(".log_sf_tri").attr("state","0");
            }

            $(".log_g_sf").mousewheel(function(event,delta){
              var p = $(this).attr("transform").match(/[-]?\d+/g);
              p[1] = parseInt(p[1]) + delta*25;
              if(p[1] > 0){p[1] = 0;}
              else if(p[1] < -150){p[1] = -150;}
              $(this).attr("transform","translate("+p[0]+","+p[1]+")");
            });


        });

      // 单次
      d3.select(this).append("g")
        .attr({
          "transform":"translate(400,10)",
        })
        .each(function(){
          var _this  = d3.select(this);

          _this.append('g')
            .attr({
              id:'trig_btn',
              m:1,
            })
            .each(function(){
              d3.select(this).append('rect')
                .attr({
                  height:30,
                  width:100,
                  fill:"white",
                  rx:5,
                  stroke:"black",
                });

              d3.select(this).append('text')
                .attr({
                  "text-anchor":"middle",
                  fill:"black",
                  x:50,
                  y:20,
                  "font-size":"20px",
                })
                .text("普通");


              $(this).click(function(){
                var m = parseInt($(this).attr("m"));
                if(m == 1){
                  $("text",this).text("单次");
                  websend_fpga(0x1004,1);
                  console.log("addr: 0x1004, val: 1");
                  $(this).attr("m","2");
                }
                if(m == 2){
                  $("text",this).text("普通");
                  websend_fpga(0x1004,0);
                  console.log("addr: 0x1004, val: 0");
                  $(this).attr("m","1");
                }
              });
            });

          _this.append('g')
            .attr({
              transform:'translate(110,0)',
            })
            .each(function(){
              d3.select(this).append('rect')
                .attr({
                  height:30,
                  width:50,
                  fill:'white',
                  stroke:'black',
                  rx:2,
                });

              d3.select(this).append('text')
                .attr({
                  "text-anchor":"middle",
                  "font-size":"20px",
                  x:25,
                  y:20,
                  fill:'black',
                })
                .text("触发");

              $(this).click(function(){
                var m = parseInt($("#trig_btn").attr("m"));
                if(m == 2){
                  websend_fpga(0x1005,0);
                  console.log("addr: 0x1005, val: 0");
                }
              });
            })
        })

    });

  // 游标文字
  log_g_interact.append("g")
    .attr({
      transform:"translate(500,0)"
    })
    .each(function(){
      d3.select(this).append("text")
        .attr({
          "text-anchor":"start",
          x:150,
          y:30,
          "font-size":"20px",
          fill:"white",
        })
        .text("T1:");

      d3.select(this).append("text")
        .attr({
          class:"logt1",
          ms:1,
          "text-anchor":"end",
          x:230,
          y:30,
          "font-size":"20px",
          fill:"white",
        })
        .text("0");

      d3.select(this).append("text")
        .attr({
          "text-anchor":"start",
          x:300,
          y:30,
          "font-size":"20px",
          fill:"white",
        })
        .text("T2:");

      d3.select(this).append("text")
        .attr({
          class:"logt1",
          ms:2,
          "text-anchor":"end",
          x:380,
          y:30,
          "font-size":"20px",
          fill:"white",
        })
        .text("-250");
    });

});

//取数据的第sign位
function getbit(val,sign){
  return (0x1 & (val >> (sign)));
}

//绘制数据线
function logicdrawline(){
  var i,y,sign;
  var data = new Array();
  var data2 = [[]];
  // console.log(getVal);
  var arrlength = getVal.length;

  for(sign = 0;sign < 8;sign++){
    data[sign] = new Array();
    for(i = 0;i < arrlength;i++){
      y = getbit(getVal[i],sign);
      data[sign][i] = {x:i-250,y:5+sign*30 + (1-y)*22};
    }
  }

  data[8] = new Array();
  for(i = 0;i < arrlength;i++){
    data[8][2*i] = {x:i-250,y:245};
    data[8][2*i+1] = {x:i-250+0.5,y:267};
  }

  for(i = 0;i<arrlength;i++){
    data2[0][i] = {x:i-250,y:getVal[i] & 0xff};
  }
  
  d3.select(".waveline").selectAll('path.logline').data(data).attr('d', logicsvgline);
  d3.select(".waveline").selectAll("path.mixline").data(data2).attr("d", logicsvgline2);
  
}

function logicstop(){
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
function logicrun(){
  if(logicpause == 1)
  {
    logicpause = 0;
  }
}


