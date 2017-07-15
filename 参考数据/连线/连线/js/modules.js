
// 加载svg创建js
document.write("<script src='js/initsvg.js'></script>");

// 禁用网页自带右键菜单
document.oncontextmenu = function(){
  return false;
}

/*
  51每个模块单独封装成一个组
 */

// S51芯片 使用图片s51.png height="380" width="135"

function s51Create(){
  if(document.getElementById('chip')){
    console.log("get #chip");
    var _this = d3.select("#chip").append("g").attr("class","md_s51");
    
    _this.append("image")
      .attr({
        height:135,
        width:380,
        "xlink:href":chip_img,
      });

    _this.append("g")
      .attr("class","51points")
      .attr("transform","translate(0,0)")
      .selectAll("g")
      .data(new Array(4))
      .enter()
      .append("g")
      .attr("class",function(d,i){
        return "51pg"+i;
      })
      .attr("transform",function(d,i){
        var t = ["(21,2)","(2,118)","(227,2)","(171,118)"];
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
            class:"pt0 ll",
            ms:function(d,i){return _i*8+i;},
            val:function(d,i){if(_i == 2){return (_i*16+(7-i));}return _i*16+i},
            cy:7.5,
            cx:function(d,i){return 7.5+i*18.8;},
            r:7.5,
            fill:"transparent",
            opacity:0.8,
            stroke:"black",
          });
      });

    
  }else{
    console.warn("Not found #chip");
    return ;
  }
}

$.contextMenu({
  selector: '.md_s51', 
  callback: function(key, options) {
    if(key == "delete"){
      // console.log(this);
      $(this).remove();
      exmSetSign[2] = 0;
      console.log(exmSetSign);
    }
  },
  items: {
    "delete": {name: "删除模块", icon: "delete"},
  }
});


// I2C实验模块 图片大小 680*210
function I2CCreate(){
  if(document.getElementById('module')){
    var _this = d3.select("#module").append("g").attr("class","md_I2C");
    
    _this.append("image")
      .attr({
        height:210,
        width:680,
        "xlink:href":"image/I2C.png",
      });

    _this.append("g")
      .attr({
        class:"I2Cpoints",
        transform:"translate(0,0)",
      })
      .append("g")
      .selectAll("circle")
      .data([{x:67,y:170,addr:0x2052},{x:123,y:170,val:1},{x:284,y:171,addr:0x2051},{x:340,y:171,val:2},{x:538,y:169,addr:0x2053},{x:595,y:168,val:4}])
      .enter()
      .append("circle")
      .attr({
        i:function(d,i){return i;},
        class:"pt1 ll",
        val:function(d,i){return d.val;},
        addr:function(d,i){return d.addr;},
        cy:function(d,i){return d.y;},
        cx:function(d,i){return d.x;},
        r:7.5,
        fill:"transparent",
        opacity:0.8,
        stroke:"black",
      });


  }else{
    console.warn("Not found #module");
    return ;
  }
}