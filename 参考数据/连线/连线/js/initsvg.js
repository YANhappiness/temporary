/*
  创建实验操作台 容器 .maintable
 */

// 禁用文字选中
document.onselectstart = function(){return false;}

/*
 *实验模块设置标识 0：未设置 1：设置中 2：已设置 3：不可用 
 *
 *数组对应仪器从左到右：逻分 示波器 S51 待定 待定 待定 待定 待定 待定 待定 待定
 *
 */
var exmSetSign = [0,0,0,0,0,0,0,0,0,0,0]; 
var exmSign = 0xff; //当前在进行的设置 0xff为未选中 

if(document.getElementsByClassName('maintable')){
  d3.select(".maintable").append("svg")
    .attr({
      class:"extable",
      height:700,
      width:1400,
    })
    .each(function(){
      console.log("svg callback");

      $(this).mouseup(function(){
        if(exmSign != 0xff){
          exmSetSign[exmSign] = 0;
          exmSign = 0xff;
        }
        console.log("svg mouseup trigger! exmSign : %d ,exmSetSign: "+exmSetSign,exmSign);
      });

      var _this = d3.select(this);

      $(this).mousedown(function(e){
        // console.log(e);
        console.log("current position: x:%d , y:%d",e.offsetX,e.offsetY);
      });

      // 仪器框01
      _this.append("g")
        .attr({
          id:"instrument_01",
          transform:"translate(30,90)",
        })
        .each(function(){
          d3.select(this).append("rect")
            .attr({
              height:150,
              width:300,
              stroke:"black",
              "stroke-width":3,
              rx:5,
              fill:"transparent",
            });
        });

      // 仪器框02
      _this.append("g")
        .attr({
          id:"instrument_02",
          transform:"translate(30,380)",
        })
        .each(function(){
          d3.select(this).append("rect")
            .attr({
              height:150,
              width:300,
              stroke:"black",
              "stroke-width":3,
              rx:5,
              fill:"transparent",
            });
        });

      // 模块框
      _this.append("g")
        .attr({
          id:"module",
          transform:"translate(430,90)",
        })
        .each(function(){
          d3.select(this).append("rect")
            .attr({
              height:210,
              width:680,
              stroke:"black",
              "stroke-width":3,
              rx:5,
              fill:"transparent",
            });

          $(this).mouseup(function(){
            if(exmSign != 0 && exmSign != 1 && exmSign != 2 && exmSign != 0xff){
              switch(exmSign){
                case 3:
                  I2CCreate();
                break;
              }
              exmSetSign[exmSign] = 2;
              exmSign = 0xff;
            }
          });
        });

      // 芯片框
      _this.append("g")
        .attr({
          id:"chip",
          transform:"translate(560,400)",
        })
        .each(function(){
          d3.select(this).append("rect")
            .attr({
              height:135,
              width:380,
              stroke:"black",
              "stroke-width":3,
              rx:5,
              fill:"transparent",
            });

          $(this).mouseup(function(){
            if(exmSign == 2){
              s51Create();
              exmSetSign[exmSign] = 2;
              exmSign = 0xff;
            }
          });
        });
          
      //侧边栏绘制
      _this.append("g")
        .attr({
          transform:"translate(1200,0)",
        })
        .each(function(){
          var _this = d3.select(this);

          _this.append("path")
            .attr({
              d:"M0,0 L0,700",
              stroke:"black",
              "stroke-width":5,
            });

          _this.append("path")
            .attr({
              d:"M0,30 L200,30",
              stroke:"black",
              "stroke-width":5,
            });

          _this.append("text")
            .attr({
              "text-anchor":"middle",
              x:100,
              y:23,
              "font-size":"25px",
            })
            .text("仪器");

          _this.append("path")
            .attr({
              d:"M0,230 L200,230",
              stroke:"black",
              "stroke-width":5,
            });

          _this.append("path")
            .attr({
              d:"M0,260 L200,260",
              stroke:"black",
              "stroke-width":5,
            });

          _this.append("text")
            .attr({
              "text-anchor":"middle",
              x:100,
              y:254,
              "font-size":"25px",
            })
            .text("模块");

        });
      
      // 51标签
      _this.append("g")
        .attr({
          transform:"translate(1200,260)",
        })
        .each(function(){
          var _this = d3.select(this);

          _this.append("text")
            .attr({
              "text-anchor":"middle",
              x:100,
              y:25,
              "font-size":"25px",
            })
            .text("S51芯片模块");


          $(this).mousedown(function(){
            if(exmSetSign[2] == 0){
              exmSign = 2;
              exmSetSign[2] = 1;
            }
            console.log("exmSign : %d ,exmSetSign[exmSign]: %d",exmSign,exmSetSign[exmSign]);
          });

        });

      // I2C标签
      _this.append("g")
        .attr({
          transform:"translate(1200,300)",
        })
        .each(function(){
          var _this = d3.select(this);

          _this.append("text")
            .attr({
              "text-anchor":"middle",
              x:100,
              y:25,
              "font-size":"25px",
            })
            .text("I2C模块");

          

          $(this).mousedown(function(){
            if(exmSetSign[3] == 0){
              exmSign = 3;
              exmSetSign[3] = 1;
            }
            console.log("exmSign : %d ,exmSetSign[exmSign]: %d",exmSign,exmSetSign[exmSign]);
          });

        });

    });

}else{
  console.warn("Not found maintable!");
}