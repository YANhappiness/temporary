
//连线

// 创建电机触点
d3.select("#circuit")
	.append("g")
	.attr("class","circuitWrap")
	.attr("transform","translate(0,100)")
	.selectAll("circle")
	.data([{cx:220,cy:28},{cx:461,cy:28},{cx:78,cy:154},{cx:116,cy:154},{cx:154,cy:154},{cx:308,cy:154},{cx:346,cy:154},{cx:384,cy:154},{cx:422,cy:154}])
	.enter()
	.append("circle")
	.attr({
		class:"circuitPt",
		ms:function(d,i){return i},
		cx:function(d,i){return d.cx},
		cy:function(d,i){return d.cy},
		r:11,
		fill:"white",
		stroke:"black"
	});


// 创建电路板触点  32
d3.select("#circuit")
	.append('g')
	.attr("class","eleWrap")   
	.attr("transform","translate(75,413)")
	.selectAll("g")
	.data(new Array(4))
	.enter()
	.append("g")
	.attr("class",function(d,i){
		return "eleWrap"+i;
	})
	.attr("transform",function(d,i){
		var t = ["(0,0)","(0,120)","(192,0)","(192,120)"];    
		return "translate"+t[i]
	})
	.each(function(d,i){
		var _i = i;
		d3.select(this)
			.selectAll("circle")
			.data(new Array(8))
			.enter()
			.append("circle")
			.attr({
				i:function(d,i){return i},
				class:"eleEachPt",           //32个电路图触点
				ms:function(d,i){return i},
				cy:7,
				cx:function(d,i){return 7+i*19.1},
				r:8,
				fill:"white",
				stroke:"black"
			})
	})

//创建触点间连线
var lineState = 0; //连线状态{0:"未连接状态",1:"移动",2:"结束"}
var logicColor = ["#d6d630","#888834","#32BF32","#525252","#1D83D1","#35C235","#525252","#DA3434"];
var eleEachPos = {x:"",y:""};     //当前(32个)触点位置
var onchangePt,onchangeLine,onchangeLine1;//变化中的点和线
var startPt = {"x":"","y":""}
var endPt = {"x":"","y":""};          //两点确定一条直线
var ptState = false;              //当前触点的连接状态
var $_bg = $(".bg");              //svg画布
var $_circuitPt = $(".circuitPt"); //电机触点
var $_eleEachPt=$(".eleEachPt");    //32个电路图触点
var $_logicPt = $(".logicPt");    //逻辑分析仪触点   8个
var move = {"x":"","y":""}
var ptM = ""

//禁用右键菜单
document.oncontextmenu = function(){
	return false;
}


//鼠标移动连线跟随
$_bg.each(function(){
	$(this).mousemove(function(){    
		if(lineState != 0){
			var bgOffset = {x:$_bg.offset().left,y:$_bg.offset().top};
			move.x = event.pageX - bgOffset.x;
			move.y = event.pageY - bgOffset.y;

			//console.log("move.x:%s,move.y:%s",move.x,move.y)    //移动的坐标点
			if(move.y<startPt.y){    //判断Q(x1,y1)点的偏移量是在左还是右
				move.y+=4;   //设置超出鼠标点Y值
				onchangePt = ptM+" Q "+startPt.x+" "+(startPt.y-30)+","+(startPt.x+move.x)/2+" "+(startPt.y+move.y)/2+" T"+move.x+" "+move.y;
			}else if(move.y >= startPt.y){
				move.y-=4;
				onchangePt = ptM+" Q "+startPt.x+" "+(startPt.y+30)+","+(startPt.x+move.x)/2+" "+(startPt.y+move.y)/2+" T"+move.x+" "+move.y;
			}
			onchangeLine.attr("d",onchangePt);
			onchangeLine1.attr("d",onchangePt);
			// console.log(onchangePt)
		}
	})

	//重置右键功能
	$(this).mousedown(function(e){
		if(e.button == 2 && lineState != 0){  //点击了右键且不是未连接状态
			$(this).attr("ms");
			lineWrap.remove();
			lineState = 0;
		}
	})
})

//逻辑分析仪接线点
$_logicPt.each(function(){
	$(this).on("click",function(){
		var index = $(this).attr("ms");
		if(lineState == 0 && ptState == false){
			startPt.x = $(this).parent().offset().left - $_bg.offset().left + parseInt($(this).attr("cx"));
			startPt.y = $(this).parent().offset().top - $_bg.offset().top + parseInt($(this).attr("cy"));
			console.log("startPt.x:%s,startPt.y:%s",startPt.x,startPt.y);    //避免了使用pageX的多点状态
			ptM = "M "+startPt.x + " " + startPt.y;
			//创建逻辑分析仪连线
			lineState = 3;
			lineWrap = d3.select(".bg").append("g").attr("class","lineWrap")
			onchangeLine = lineWrap.append("path")
				.attr({"stroke":"black","fill":"none","stroke-width":6,"d":ptM,"class":function(d,i){return "logicLine"+(i+1)}});
			onchangeLine1 = lineWrap.append("path")
				.attr({"stroke":function(d,i){return logicColor[index]},"fill":"none","stroke-width":5,
							"d":ptM,"class":function(d,i){return "logicLine"+(i+1)}});
			 $(this).attr("ms");
		}
	})
})


//32接线点
$_eleEachPt.each(function(){  
	$(this).click(function(e){
		var ms = parseInt($(this).attr("ms"));
		
		if(lineState == 0){  //未连线状态

			startPt.x = $(this).parent().offset().left - $_bg.offset().left+parseInt($(this).attr("cx"));
			startPt.y = $(this).parent().offset().top - $_bg.offset().top+parseInt($(this).attr("cy"));
			console.log({"x":startPt.x,"y":startPt.y});   //即32个触点的坐标

			lineState = 2;   //变成点击后的状态
			ptM = "M " +startPt.x + " " + startPt.y;
			lineWrap = d3.select(".bg").append("g").attr({"class":"line","ms":ms});

			onchangeLine1 = lineWrap.append("path")
				.attr({"stroke":"black","fill":"none","stroke-width":"6","d":ptM});

			onchangeLine = lineWrap.append("path")
				.attr("stroke",function(){return "#9c0"})	
				.attr({"fill":"none","stroke-width":"5","d":ptM});

		}else if(lineState == 3){
			eleEachPos.x = $(this).parent().offset().left - $_bg.offset().left+parseInt($(this).attr("cx"));
			eleEachPos.y = $(this).parent().offset().top - $_bg.offset().top+parseInt($(this).attr("cy"));
			if(startPt.y > eleEachPos.y){
				onchangePt = ptM+" Q "+startPt.x+" "+(startPt.y-30)+","+(startPt.x+eleEachPos.x)/2+" "+(startPt.y+eleEachPos.y)/2+" T"+eleEachPos.x+" "+eleEachPos.y;
			}else if(startPt.y < eleEachPos.y){
				onchangePt = ptM+" Q "+startPt.x+" "+(startPt.y+30)+","+(startPt.x+eleEachPos.x)/2+" "+(startPt.y+eleEachPos.y)/2+" T"+eleEachPos.x+" "+eleEachPos.y;
			}
			lineState = 0  //允许重复连线
			onchangeLine.attr("d",onchangePt);
			onchangeLine1.attr("d",onchangePt);

			$.contextMenu({
				selector:".lineWrap",
				callback:function(key,options) {
					if(key == 'delete'){
						$(this).remove();
					}
					if(key == "deleteAll"){
						$(".line").remove();
						$(".lineWrap").remove();
					}
				},
				items:{
					"delete":{name:"删除连线",icon:"delete"},
					"deleteAll":{name:"删除所有连线",icon:"delete"},
				}
			})
		}

	})
})

//电机接线点
$_circuitPt.each(function(){
	$(this).click(function(){
		if(lineState == 2){   
			endPt.x = $(this).parent().offset().left - $_bg.offset().left + parseInt($(this).attr("cx"))-68;   //数据有偏差
			endPt.y = $(this).parent().offset().top - $_bg.offset().top + parseInt($(this).attr("cy"))-20; 
			
			console.log($(this).parent().offset().left+","+$_bg.offset().left+","+parseInt($(this).attr("cx")))

			if(startPt.y > endPt.y){
				onchangePt = ptM+" Q "+startPt.x+" "+(startPt.y-30)+","+(startPt.x+endPt.x)/2+" "+(startPt.y+endPt.y)/2+" T"+endPt.x+" "+endPt.y;
			}else if(start.y <= endPt.y){
				onchangePt = ptM+" Q "+startPt.x+" "+(startPt.y+30)+","+(startPt.x+endPt.x)/2+" "+(startPt.y+endPt.y)/2+" T"+endPt.x+" "+endPt.y;
			}
			lineState = 0;
			onchangeLine.attr("d",onchangePt);
			onchangeLine1.attr("d",onchangePt);
			onchangePt = "";

			$.contextMenu({
				selector:".line",
				callback:function(key,options) {
					if(key == 'delete'){
						$(this).remove();
					}
					if(key == "deleteAll"){
						$(".line").remove();
						$(".lineWrap").remove();
					}
				},
				items:{
					"delete":{name:"删除连线",icon:"delete"},
					"deleteAll":{name:"删除所有连线",icon:"delete"},
				}
			})

		}
	})
})
