var pcsdxMaxNum = 512,pcsdyMaxNum = 4095;
var pcsdsvgmargin,pcsdsvgwidth,pcsdsvgheight,pcsdsvgx,pcsdsvgy,pcsdsvg,pcsdsvg_g01,pcsdsvg_g02,pcsdsvgline,pcsdsvgtext;
var pcm_cvsd_sign = 0; //{1:pcm,2:cvsd,11:FFT}
var pcsd_sign01 = 0; //当前选择抽样点序号
var pcsddatalinecolors = [
  'yellow',
  'white',
  'red',
  'cyan',
  'rgb(104,104,104)'
];
var linepath = d3.svg.line(); //标准线段生成器
var data3,data4 = [[],[],[],[]];
var imgt;
$(function(){
  pcsdsvgmargin = {top: 10, right: 0, bottom: 0, left: 10},
  pcsdsvgwidth = 1024,
  pcsdsvgheight = 600;

  pcsdsvgx = d3.scale.linear()
    .domain([0, pcsdxMaxNum])
    .range([0, pcsdsvgwidth]);

  pcsdsvgy = d3.scale.linear()
    .domain([0,pcsdyMaxNum])
    .range([pcsdsvgheight,0]);

  pcsdsvg = d3.select("#pcmcvsd").append("svg")
    .attr("class","pcsdsvg")
    .attr()
    .attr("width", pcsdsvgwidth+176)
    .attr("height", pcsdsvgheight+20)

  pcsdsvg_g01 = pcsdsvg.append("g")
    .attr("transform", "translate(" + pcsdsvgmargin.left + "," + pcsdsvgmargin.top + ")")
    .attr("class","pcsdg_01");
  
  pcsdsvg_g02 = pcsdsvg.append("g")
    .attr("transform", "translate(" + pcsdsvgmargin.left + "," + pcsdsvgmargin.top + ")")
    .attr("class","pcsdg_02");
  
  //标线
  {
    
    pcsdsvg_g01.append("g")
      .selectAll("path")
      .data(new Array(9))
      .enter()
      .append("path")
      .attr("d",function(d,i){
        return linepath([[pcsdsvgwidth/10*(i+1),0],[pcsdsvgwidth/10*(i+1),pcsdsvgheight]]);
      })
      .attr("stroke","#bbb")
      .attr("stroke-dasharray","5,5")
      .attr("stroke-width","1")
      .attr("shape-rendering","crispEdges");
    
    pcsdsvg_g01.append("g")
      .selectAll("path")
      .data(new Array(7))
      .enter()
      .append("path")
      .attr("d",function(d,i){
        return linepath([[0,pcsdsvgheight/8*(i+1)],[pcsdsvgwidth,pcsdsvgheight/8*(i+1)]]);
      })
      .attr("stroke","#bbb")
      .attr("stroke-dasharray","5,5")
      .attr("stroke-width","1")
      .attr("shape-rendering","crispEdges");
    
    pcsdsvg_g01.append("path")
      .attr("d",linepath([[0,0],[0,pcsdsvgheight],[pcsdsvgwidth,pcsdsvgheight],[pcsdsvgwidth,0],[0,0]]))
      .attr("stroke","white")
      .attr("fill","none")
      .attr("stroke-width","1px");
  }

  // 初始化波形线
  {
    pcsdsvg_g01.append("clipPath")
      .attr("id", "oscclip2")
      .append("rect")
      .attr("width", pcsdsvgwidth)
      .attr("height", pcsdsvgheight);

    pcsdsvgline = d3.svg.line()
      .interpolate("linear") 
      .x(function(d) { return pcsdsvgx(d.x); })
      .y(function(d) { return pcsdsvgy(d.y); });

    pcsdsvg_g01.selectAll('.oscline2')
    .attr("transform","translate(" + pcsdsvgmargin.left + "," + pcsdsvgmargin.top + ")")
    .data(data4)
    .enter()
    .append("path")
    .attr("class", "oscline2")
    .attr("fill","none")
    .attr("id",function(d,i){
      return "CH"+(i+1);
    })
    .attr("clip-path", "url(#oscclip2)")
    .attr('stroke', function(d,i){      
      return pcsddatalinecolors[i%pcsddatalinecolors.length];
    });
  }
  

  //文本
  {
    //pcm文本
    pcsdsvg_g02.append("g")
      .selectAll("text")
      .data(new Array(16))
      .enter()
      .append("text")
      .attr("class","md3T")
      .attr("i",function(d,i){return i;})
      .attr("x", function(d,i){
        return (i*pcsdsvgwidth/16.5);
      })
      .attr("y", function(d,i){
        if(i%2 == 0){
          return 560;
        }
        else{
          return 580;
        }
      })
      .attr("fill","red")
      .attr("font-size","15");

    pcsdsvg_g02.append("g")
      .selectAll("text")
      .data(new Array(16))
      .enter()
      .append("text")
      .attr("class","md3T2")
      .attr("i",function(d,i){return i;})
      .attr("x", function(d,i){
        if(i == 0){return 0}
        else{return ((i*32+5)/512*pcsdsvgwidth - 20);}
      })
      .attr("y", 0)
      .attr("fill","cyan")
      .attr("font-size","20");

    pcsdsvg_g02.append("g")
      .selectAll("path")
      .data(new Array(16))
      .enter()
      .append("path")
      .attr("class","md3L")
      .attr("i",function(d,i){return i;})
      .attr("d",function(d,i){
        return linepath([[0,0],[0,0]]);
      })
      .attr("stroke","lime")
      .attr("stroke-width","3")
      .on("mouseover",function(d,i){
        if(i < 13){
          $(".md3I").show().attr("transform","translate("+event.offsetX+","+event.offsetY+")");
        }else{
          $(".md3I").show().attr("transform","translate("+(event.offsetX-400)+","+event.offsetY+")");
        }
        pcsd_sign01 = i;
        imgtchange(mmm,lll);
      })
      .on("mouseleave",function(d,i){
        $(".md3I").hide();
      });

    pcsdsvg_g02.append("g")
      .attr("class","md3TT")
      .each(function(){
        var ttdata = [{x:pcsdsvgwidth+90,y:300,color:"yellow",fs:35,text:"模拟信号"},
                     {x:pcsdsvgwidth+90,y:340,color:"rgb(104,104,104)",fs:35,text:"量化噪声"},
                     {x:pcsdsvgwidth+90,y:380,color:"cyan",fs:35,text:"本地译码"},
                     {x:pcsdsvgwidth+90,y:420,color:"red",fs:35,text:"编码信号"},
                     {x:pcsdsvgwidth+90,y:260,color:"white",fs:35,text:"CVSD调制"}];
        
        d3.select(this).selectAll("text")
          .data(ttdata)
          .enter()
          .append("text")
          .attr({
            class:function(d,i){return "md3TT"+(i+1)},
            "text-anchor":"middle",
            x:function(d,i){return d.x;},
            y:function(d,i){return d.y;},
            fill:function(d,i){return d.color;},
            "font-size":function(d,i){return d.fs;},
          })
          .text(function(d,i){return d.text;});

      });

    pcsdsvg_g02.append("g")
      .attr("class","md3I")
      .each(function(){
        d3.select(this)
          .append("image")
          .attr("xlink:href","images/pcm.png")
          .attr("height","200")
          .attr("width","400");

        var imgtp = [{x:220,y:35},{x:56,y:93},{x:177,y:93},{x:341,y:93},{x:173,y:120},{x:247,y:120},{x:361,y:120},{x:198,y:192}];    
        d3.select(this)
          .selectAll("text")
          .data(imgtp)
          .enter()
          .append("text")
          .attr({
            class:"imgt",
            "text-anchor":"middle",
            i:function(d,i){return i;},
            x:function(d,i){return d.x;},
            y:function(d,i){return d.y;},
          })
          .text("0");

        
      });

    $(".md3I").hide();
     
    

    //暂停开关
    pcsdsvg.append("g")
      .attr("class","rsk")
      .attr("sign","1")
      .attr("transform","translate("+(pcsdsvgwidth+50)+",190)")
      .append("rect")
      .attr("class","rsk_r")
      .attr("fill","red")
      .attr("width",100)
      .attr("height",40)
      .attr("rx",20);

    d3.selectAll(".rsk")
      .append("text")
      .attr("class","rsk_t")
      .attr("x",50)
      .attr("y",33)
      .attr("text-anchor","middle")
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

});



//cvsd
function oscdrawline3(){
  // console.log("oscdrawline3");
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
        data3[sign][1] = {"x" : pcsdxMaxNum,"y" : 2365};
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
                data3[sign][k] = {"x" : (i*8+j)*pcsdxMaxNum/128,"y" : ry*400 + 400};
                k++;
              }
            }
            data3[sign][k] = {"x" : (i*8+j)*pcsdxMaxNum/128,"y" : ny*400 + 400};
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

  pcsdsvg.selectAll('.oscline2')
  .attr("transform","translate(" + pcsdsvgmargin.left + "," + pcsdsvgmargin.top + ")")
  .data(data3)
  .enter()
  .append("path")
  .attr("class", "oscline2")
  .attr("fill","none")
  .attr("id",function(d,i){
    return "CH"+(i+1);
  })
  .attr("clip-path", "url(#oscclip2)")
  .attr('stroke', function(d,i){      
    return pcsddatalinecolors[i%pcsddatalinecolors.length];
  })
  .attr("d", pcsdsvgline);

  pcsdsvg.selectAll('path.oscline2').attr('d', pcsdsvgline);

  
}

var mmm = new Array(),nnn = new Array(),lll = new Array();
//pcm
function oscdrawline4(){
  // console.log("oscdrawline4");
  var i,k,arrlength1 = 512,arrlength2 = 16,arrlength3 = 16,ry,ny;
  data4 = new Array();
  
  
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
        data4[sign][1] = {"x" : pcsdxMaxNum,"y" : 2365};
      break;
      case 2:
        // console.log(getWaveData3);
        for(i = 0,k = 0;i < arrlength3;i++){
          mmm[i] = (getWaveData3[i*2+1]&0xff).toString(2);
          while(mmm[i].length < 8){
            mmm[i] = "0" + mmm[i];
          }
          console.log(mmm[i]);
          for(var j = 0;j < 8;j++,k++){
            // ny = (((getWaveData3[i*2+1] & 0xFF) >> (7-j)) & 0x01);
            ny = parseInt(mmm[i][j]);
            // mmm[i] = mmm[i] + "" + ny; 
            if(k > 0)
            {
              if(ry != ny)
              {
                data4[sign][k] = {"x" : (i*8+j)*pcsdxMaxNum/128,"y" : ry*400 + 400};
                k++;
              }
            }
            data4[sign][k] = {"x" : (i*8+j)*pcsdxMaxNum/128,"y" : ny*400 + 400};
            ry = ny;
          }
        }
        // console.log(mmm);
      break;
      case 3:

      break;
        
    }
    
  }
  // console.log(mmm,nnn,lll);

  $(".md3T").each(function(){
    $(this).text(mmm[parseInt($(this).attr("i"))]);
  });

  $(".md3T2").each(function(){
    var i = parseInt($(this).attr("i"));
	if(lll[i]>32767)
	{
		lll[i]=lll[i]-65535;
	}
    $(this).text(lll[i]);
    $(this).attr("y",function(){
      if(lll[i] > 0){
        return ((3096-((((getWaveData1[(i*pcm_d+pcm_sp)*2] & 0xFF) << 8) + (getWaveData1[(i*pcm_d+pcm_sp)*2+1] & 0xFF))/1.5))/4096*pcsdsvgheight - 30);
      }
      else{
        return ((3096-((((getWaveData1[(i*pcm_d+pcm_sp)*2] & 0xFF) << 8) + (getWaveData1[(i*pcm_d+pcm_sp)*2+1] & 0xFF))/1.5))/4096*pcsdsvgheight + 30);
      }
    })
    .attr("x",function(){
      if(i == 0){return 0}
      else{return ((i*pcm_d+pcm_sp)/512*pcsdsvgwidth - 20);}
    });
  });


  $(".md3L").each(function(){
    var i = parseInt($(this).attr("i"));
    var y2 = (3096-((((getWaveData1[(i*pcm_d+pcm_sp)*2] & 0xFF) << 8) + (getWaveData1[(i*pcm_d+pcm_sp)*2+1] & 0xFF))/1.5))/4096*pcsdsvgheight;
    var x1 = (pcm_sp+pcm_d*i)*(pcsdsvgwidth/512),x2 = (pcm_sp+pcm_d*i)*(pcsdsvgwidth/512),y1 = 1731/4096*pcsdsvgheight;
    $(this).attr("d",linepath([[x1,y1],[x2,y2]]));
    // $(this).attr("y2",""+(3096-((((getWaveData1[(i*pcm_d+pcm_sp)*2] & 0xFF) << 8) + (getWaveData1[(i*pcm_d+pcm_sp)*2+1] & 0xFF))/1.5))/4096*pcsdsvgheight);
    // $(this).attr("x1",""+ (pcm_sp+pcm_d*i)*(pcsdsvgwidth/512)).attr("x2",""+ (pcm_sp+pcm_d*i)*(pcsdsvgwidth/512))
  });

  imgtchange(mmm,lll);
  // imgt.selectAll("text").data(lh_data);


  // console.log(data);
  // 

  // pcsdsvg.selectAll('.oscline2')
  // .attr("transform","translate(" + pcsdsvgmargin.left + "," + pcsdsvgmargin.top + ")")
  // .data(data4)
  // .enter()
  // .append("path")
  // .attr("class", "oscline2")
  // .attr("fill","none")
  // .attr("id",function(d,i){
  //   return "CH"+(i+1);
  // })
  // .attr("clip-path", "url(#oscclip2)")
  // .attr('stroke', function(d,i){      
  //   return pcsddatalinecolors[i%pcsddatalinecolors.length];
  // })
  // .attr("d", pcsdsvgline);

  pcsdsvg.selectAll('path.oscline2').data(data4).attr('d', pcsdsvgline);

  
}

//PCM模式显示框数据设置函数
var duanhao = [[0,1],[16,1],[32,2],[64,4],[128,8],[256,16],[512,32],[1024,64]];
function imgtchange(mmm,lll){
  // console.log(mmm[pcsd_sign01]);
  var dlm = parseInt(mmm[pcsd_sign01].substring(1,4),2);
  // console.log(mmm[pcsd_sign01].substring(1,4),dlm);
  $(".imgt[i=0]").text(lll[pcsd_sign01]);
  $(".imgt[i=1]").text(mmm[pcsd_sign01][0]);
  $(".imgt[i=2]").text(mmm[pcsd_sign01].substring(1,4));
  $(".imgt[i=3]").text(mmm[pcsd_sign01].substring(4,8));
  $(".imgt[i=4]").text(dlm+1);
  $(".imgt[i=5]").text(duanhao[dlm][0]);
  $(".imgt[i=6]").text(duanhao[dlm][1]);
  $(".imgt[i=7]").text(mmm[pcsd_sign01]);
}




