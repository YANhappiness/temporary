var xMaxNum2 = 512;
var oscsvgmargin2,oscwidth2,oscheight2,oscsvgx2,oscsvgy2,oscsvgxAxis2,oscsvgyAxis2,oscsvgzoom2,oscsvg2,oscwave2,oscsvgline2,osctext2;
var pcm_cvsd_sign = 0; //{2:cvsd,1:pcm}
var oscdatalinecolors2 = [
  'yellow',
  'white',
  'red',
  'cyan',
  'rgb(104,104,104)'
];

$(function(){
  oscsvgmargin2 = {top: 10, right: 0, bottom: 0, left: 10},
  oscwidth2 = 1024,
  oscheight2 = 600;

  oscsvgx2 = d3.scale.linear()
    .domain([0, xMaxNum2])
    .range([0, oscwidth2]);

  oscsvgy2 = d3.scale.linear()
    .domain([0,4095])
    .range([oscheight2,0]);
    
  oscsvgxAxis2 = d3.svg.axis()
    .scale(oscsvgx2)
    .tickSize(-oscheight2)
    // .tickValues([])
    .tickPadding(10)  
    .tickSubdivide(true)  
      .orient("bottom");
    
  oscsvgyAxis2 = d3.svg.axis()
    .scale(oscsvgy2)
    .tickPadding(10)
    // .tickValues([])
    .tickSize(-oscwidth2)
    .tickSubdivide(true)  
    .orient("left");

  oscsvg2 = d3.select("#pcmcvsd").append("svg")
    .attr("class","oscsvg2")
    .attr()
    // .call(oscsvgzoom)
    .attr("width", oscwidth2+176)
    .attr("height", oscheight2)

  oscwave2 = oscsvg2.append("g")
      .attr("transform", "translate(" + oscsvgmargin2.left + "," + oscsvgmargin2.top + ")");
      // .attr("width","400")
      // .attr("height","400");

  oscwave2.append("g")
    .attr("class", "x oscaxis2")
    .attr("transform", "translate(0," + oscheight2 + ")")
    .call(oscsvgxAxis2)
    .selectAll(".tick")
    .text("");
 
  oscwave2.append("g")
      .attr("class", "y oscaxis2")
      .call(oscsvgyAxis2)
      .selectAll(".tick")
      .text(""); 
  
  // console.log(oscsvg);
  for(var i = 1;i <= 9;i++)
  {
    oscwave2.append("line")
      .attr("x1",oscwidth2/10*i)
      .attr("y1",0)
      .attr("x2",oscwidth2/10*i)
      .attr("y2",oscheight2)
      .attr("stroke","#bbb")
      .attr("stroke-dasharray","5,5")
      .attr("stroke-width","1")
      .attr("shape-rendering","crispEdges");
  }
   
  for(var i = 1;i <= 7;i++)
  {
    oscwave2.append("line")
      .attr("x1",0)
      .attr("y1",oscheight2/8*i)
      .attr("x2",oscwidth2)
      .attr("y2",oscheight2/8*i)
      .attr("stroke","#bbb")
      .attr("stroke-dasharray","5,5")
      .attr("stroke-width","1")
      .attr("shape-rendering","crispEdges");
  }

  oscwave2.append("clipPath")
    .attr("id", "oscclip2")
    .append("rect")
    .attr("width", oscwidth2)
    .attr("height", oscheight2);

  oscsvgline2 = d3.svg.line()
    .interpolate("linear") 
    .x(function(d) { return oscsvgx2(d.x); })
    .y(function(d) { return oscsvgy2(d.y); });

 
  //文本
  {
    for(i = 0;i < 16;i++){
      oscwave2.append("text")
       .attr("class","md3T")
       .attr("id",""+i)
       .attr("x", function(){
          return (i*oscwidth2/16.5);
       })
       .attr("y", function(){
          if(i%2 == 0){
            return 560;
          }
          else{
            return 580;
          }
       })
       .attr("fill","red")
       .attr("font-size","15")

      oscwave2.append("text")
       .attr("class","md3T2")
       .attr("id",""+i)
       .attr("x", function(){
          if(i == 0){return 0}
          else{return ((i*32+5)/512*oscwidth2 - 20);}
       })
       .attr("y", 0)
       .attr("fill","cyan")
       .attr("font-size","20")



      oscwave2.append("line")
        .attr("class","md3L")
        .attr("id",""+i)
        .attr("x1",""+ (5+32*i)*(oscwidth2/512))
        .attr("x2",""+ (5+32*i)*(oscwidth2/512))
        .attr("y1",""+ 1731/4096*oscheight2 )
        .attr("y2",""+ 1731/4096*oscheight2 )
      
      $(".md3L").css({"stroke":"lime","stroke-width":"3"});  
    }

    oscsvg2.append("text")
      .attr("x",oscwidth2+20)
      .attr("y",300)
      .attr("fill","yellow")
      .attr("font-size","35")
      .text("模拟信号");

    oscsvg2.append("text")
      .attr("class","md3TT1")
      .attr("x",oscwidth2+20)
      .attr("y",340)
      .attr("fill","rgb(104,104,104)")
      .attr("font-size","35")
      .text("量化噪声");

    oscsvg2.append("text")
      .attr("class","md3TT2")
      .attr("x",oscwidth2+20)
      .attr("y",380)
      .attr("fill","cyan")
      .attr("font-size","35")
      .text("本地译码");

    oscsvg2.append("text")
      .attr("x",oscwidth2+20)
      .attr("y",420)
      .attr("fill","red")
      .attr("font-size","35")
      .text("编码信号");

    oscsvg2.append("text")
      .attr("class","md3T3")
      .attr("x",oscwidth2+15)
      .attr("y",260)
      .attr("fill","white")
      .attr("font-size","35")
      .text("CVSD调制");

    //暂停开关
    oscsvg2.append("g")
      .attr("class","rsk")
      .attr("sign","1")
      .attr("transform","translate("+(oscwidth2+15)+",190)")
      .append("rect")
      .attr("class","rsk_r")
      .attr("fill","red")
      .attr("width",100)
      .attr("height",40)
      .attr("rx",20);

    d3.selectAll(".rsk")
      .append("text")
      .attr("class","rsk_t")
      .attr("x",13)
      .attr("y",33)
      .attr("fill","black")
      .attr("font-size","35")
      .text("RUN");
    
   
    $(".rsk").click(function(){
      if($(this).attr("sign") == "1"){
        serverstate = 0;
        $(this).attr("sign","0");
        ws.send(new Int8Array([0xFF,0x05,(0xff & deviceId),0x00]));
        $(".rsk_t").text("STOP");
      }else if($(this).attr("sign") == "0"){
        serverstate = 3;
        $(this).attr("sign","1");
        ws.send(new Int8Array([0xFF,0x05,(0xff & deviceId),(0xff & pcm_cvsd_sign)]));
        $(".rsk_t").text("RUN");
      }
    });
    
  }

  // console.log(oscsvg);
  for(var i = 1;i <= 9;i++)
  {
    oscwave2.append("line")
      .attr("x1",oscwidth2/10*i)
      .attr("y1",0)
      .attr("x2",oscwidth2/10*i)
      .attr("y2",oscheight2)
      .attr("stroke","#bbb")
      .attr("stroke-dasharray","5,5")
      .attr("stroke-width","1")
      .attr("shape-rendering","crispEdges");
  }
    
  for(var i = 1;i <= 7;i++)
  {
    oscwave2.append("line")
      .attr("x1",0)
      .attr("y1",oscheight2/8*i)
      .attr("x2",oscwidth2)
      .attr("y2",oscheight2/8*i)
      .attr("stroke","#bbb")
      .attr("stroke-dasharray","5,5")
      .attr("stroke-width","1")
      .attr("shape-rendering","crispEdges");
  }

  // oscwave2.append("line")
  //   .attr("x1",0)
  //   .attr()


});

var data3,data4,data5;

//cvsd
function oscdrawline3(){
  var i,k,arrlength1 = 512,arrlength2 = 64,arrlength3 = 16,ry,ny;
  data3 = new Array();
  var mmm = new Array(),nnn = new Array(),lll = new Array();
  
  for(i = 0;i < 16;i++)
  {
    lll[i] = (getWaveData2[i*2] << 8) | (getWaveData2[i*2+1] & 0xFF);
    // console.log(getWaveData2);
  }

  // console.log(lll);

  for(var sign = 0;sign < 5;sign++){
    data3[sign] = new Array();

    switch(sign){
      case 0:
        for(i = 0;i < arrlength1;i++){
          data3[sign][i] = {"x" : ""+i,"y" : ((((getWaveData1[i*2] & 0xFF) << 8) + (getWaveData1[i*2+1] & 0xFF))/1.5) + 1000};
        }
        // console.log(getWaveData1);
        // console.log(data3);
      break;
      case 1:
        data3[sign][0] = {"x" : 0,"y" : 2365};
        data3[sign][1] = {"x" : xMaxNum2,"y" : 2365};
      break;
      case 2:
        // console.log(getWaveData3);
        for(i = 0,k = 0;i < arrlength3;i++){
          mmm[i] = "";
          for(var j = 0;j < 8;j++,k++){
            ny = (((getWaveData3[i*2+1] & 0xFF) >> (7-j)) & 0x01);
            mmm[i] = mmm[i] + "" + ny; 
            if(k > 0)
            {
              if(ry != ny)
              {
                data3[sign][k] = {"x" : (i*8+j)*xMaxNum2/128,"y" : ry*400 + 400};
                k++;
              }
            }
            data3[sign][k] = {"x" : (i*8+j)*xMaxNum2/128,"y" : ny*400 + 400};
            ry = ny;
          }
        }
        // console.log(mmm);
      break;
      case 3:
        for(i = 0,k = 0;i < arrlength2;i++)
        {
          data3[sign][k++] = {"x" : ""+i*8,"y" : ((((getWaveData2[i*2] & 0xFF) << 8) + (getWaveData2[i*2+1] & 0xFF))/1.5) + 1000};
          data3[sign][k++] = {"x" : ""+(i+1)*8,"y" : ((((getWaveData2[i*2] & 0xFF) << 8) + (getWaveData2[i*2+1] & 0xFF))/1.5) + 1000};
        }
      break;
      case 4:
        for(i = 0;i < arrlength1;i++){
          data3[sign][i] = {"x" : i,"y" : (((((getWaveData1[i*2] & 0xFF) << 8) + (getWaveData1[i*2+1] & 0xFF)) - (((getWaveData2[Math.floor(i/8)*2] & 0xFF) << 8) + (getWaveData2[Math.floor(i/8)*2+1] & 0xFF)))/1.5 + 2365)};
          }
      break;
        
    }
    
  }
  
  // console.log(data3[4]);
  // console.log(data);

  oscsvg2.selectAll('.oscline2')
  .attr("transform","translate(" + oscsvgmargin2.left + "," + oscsvgmargin2.top + ")")
  .data(data3)
  .enter()
  .append("path")
  .attr("class", "oscline2")
  .attr("id",function(d,i){
    return "CH"+(i+1);
  })
  .attr("clip-path", "url(#oscclip2)")
  .attr('stroke', function(d,i){      
    return oscdatalinecolors2[i%oscdatalinecolors2.length];
  })
  .attr("d", oscsvgline2);

  oscsvg2.selectAll('path.oscline2').attr('d', oscsvgline2);

  
}

//pcm
function oscdrawline4(){
  var i,k,arrlength1 = 512,arrlength2 = 16,arrlength3 = 16,ry,ny;
  data4 = new Array();
  var mmm = new Array(),nnn = new Array(),lll = new Array();
  
  for(i = 0;i < 16;i++)
  {
    lll[i] = (getWaveData2[i*2] << 8) | (getWaveData2[i*2 + 1] & 0xFF);
    // console.log(getWaveData2);
  }

  // console.log(lll);

  for(var sign = 0;sign < 5;sign++){
    data4[sign] = new Array();
    // console.log(getWaveData3);
    switch(sign){
      case 0:
        for(i = 0;i < arrlength1;i++){
          data4[sign][i] = {"x" : ""+i,"y" : ((((getWaveData1[i*2] & 0xFF) << 8) + (getWaveData1[i*2+1] & 0xFF))/1.5) + 1000};
        }
        // console.log(getWaveData1);
        // console.log(data3);
      break;
      case 1:
        data4[sign][0] = {"x" : 0,"y" : 2365};
        data4[sign][1] = {"x" : xMaxNum2,"y" : 2365};
      break;
      case 2:
        // console.log(getWaveData3);
        for(i = 0,k = 0;i < arrlength3;i++){
          mmm[i] = "";
          for(var j = 0;j < 8;j++,k++){
            ny = (((getWaveData3[i*2+1] & 0xFF) >> (7-j)) & 0x01);
            mmm[i] = mmm[i] + "" + ny; 
            if(k > 0)
            {
              if(ry != ny)
              {
                data4[sign][k] = {"x" : (i*8+j)*xMaxNum2/128,"y" : ry*400 + 400};
                k++;
              }
            }
            data4[sign][k] = {"x" : (i*8+j)*xMaxNum2/128,"y" : ny*400 + 400};
            ry = ny;
          }
        }
        // console.log(mmm);
      break;
      case 3:

      break;
        
    }
    
  }


  $(".md3T").each(function(){
    $(this).text(mmm[parseInt($(this).attr("id"))]);
  });

  $(".md3T2").each(function(){
    var i = parseInt($(this).attr("id"));
    $(this).text(lll[i]);
    $(this).attr("y",function(){
      if(lll[i] > 0){
        return ((3096-((((getWaveData1[(i*pcm_d+pcm_sp)*2] & 0xFF) << 8) + (getWaveData1[(i*pcm_d+pcm_sp)*2+1] & 0xFF))/1.5))/4096*oscheight2 - 30);
      }
      else{
        return ((3096-((((getWaveData1[(i*pcm_d+pcm_sp)*2] & 0xFF) << 8) + (getWaveData1[(i*pcm_d+pcm_sp)*2+1] & 0xFF))/1.5))/4096*oscheight2 + 30);
      }
    })
    .attr("x",function(){
      if(i == 0){return 0}
      else{return ((i*pcm_d+pcm_sp)/512*oscwidth2 - 20);}
    });
  });


  $(".md3L").each(function(){
    var i = parseInt($(this).attr("id"));
    $(this).attr("y2",""+(3096-((((getWaveData1[(i*pcm_d+pcm_sp)*2] & 0xFF) << 8) + (getWaveData1[(i*pcm_d+pcm_sp)*2+1] & 0xFF))/1.5))/4096*oscheight2);
    $(this).attr("x1",""+ (pcm_sp+pcm_d*i)*(oscwidth2/512)).attr("x2",""+ (pcm_sp+pcm_d*i)*(oscwidth2/512))
  });
  
  // console.log(data);
  // 

  oscsvg2.selectAll('.oscline2')
  .attr("transform","translate(" + oscsvgmargin2.left + "," + oscsvgmargin2.top + ")")
  .data(data4)
  .enter()
  .append("path")
  .attr("class", "oscline2")
  .attr("id",function(d,i){
    return "CH"+(i+1);
  })
  .attr("clip-path", "url(#oscclip2)")
  .attr('stroke', function(d,i){      
    return oscdatalinecolors2[i%oscdatalinecolors2.length];
  })
  .attr("d", oscsvgline2);

  oscsvg2.selectAll('path.oscline2').attr('d', oscsvgline2);

  
}

//fft
function oscdrawline5(){
  console.log(666);
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


