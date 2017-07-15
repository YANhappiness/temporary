
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
		fill:"transparent",
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
				fill:"transparent",
				stroke:"black"
			})
	})

//创建触点间连线
var lineState = 0; //连线状态{0:"未连接状态",1:"移动",2:"结束"}
var logicColor = ["#d6d630","#888834","#32BF32","#525252","#1D83D1","#35C235","#525252","#DA3434"];
var eleEachPos = {x:"",y:""};     //当前(32个)触点位置
var onchangePt,onchangeLine,onchangeLine1;//变化中的点和线
var startPt,endPt = "";          //两点确定一条直线
var $_bg = $(".bg");              //svg画布
var $_circuitPt = $(".circuitPt"); //电机触点
var $_eleEachPt=$(".eleEachPt");    //32个电路图触点
var $_logicPt = $(".logicPt");    //逻辑分析仪触点   8个
 

//禁用右键菜单
document.oncontextmenu = function(){
	return false;
}


//鼠标移动连线跟随
$_bg.each(function(){
	$(this).mousemove(function(){    
		if(lineState != 0){
			var bgOffset = {x:$_bd.offset().left,y:$_bg.offset().top};
			var x1 = event.pageX - bgOffset.x;
			var y1 = event.pageY - bgOffset.y;

			if(y1<eleEachPos.y){    //判断Q(x1,y1)点的偏移量是在左还是右
				y1+=4;   //设置超出鼠标点Y值
				onchangePt = startPt+" Q "+eleEachPos.x+" "+(eleEachPos.y-30)+","+(x1 + eleEachPos.x)/2+" "+(y1 + eleEachPos.y)/2+" Q "+x1+" "+(y1+30)+","+x1+" "+y1;
			}else if(y1 >= eleEachPos.y){
				y1 -=4;
				onchangePt = startPt+" Q "+eleEachPos.x+" "+(eleEachPos.y+30)+","+(x1 + eleEachPos.x)/2+" "+(y1 + eleEachPos.y)/2+" Q "+x1+" "+(y1-30)+","+x1+" "+y1;
			}

			onchangeLine.attr("d",onchangePt);
			onchangeLine1.attr("d",onchangePt);
		}
	})

	//重置右键功能
	$(this).mousedown(function(e){
		if(e.button == 2 && lineState != 0){  //点击了右键且不是未连接状态
			onchangePt.remove();  
			lineState = 0;
			onchangePath = "";
		}
	})
})

//32接线点
$_eleEachPt.each(function(){  
	$(this).click(function(e){
		var $this = $(this);
		var ms = parseInt($this.attr("ms"));
		if(lineState == 0){  //未连线状态
	
			console.log({"x":eleEachPos.x,"y":eleEachPos.y});   //即32个触点的坐标

			lineState = 1;
			onchangePath = "M " +eleEachPos.x + " " + eleEachPos.y;
			path = d3.select($_bg).append("g").attr({"class":"line","ms":ms});
			onchangeLine1 = path.append("path")
				.attr({"stroke":"black","fill":"none","stroke-width":"6","d",onchangePath});

			onchangeLine = path.append("path")
				.attr("stroke",function(){return "#9c0"})	
				.attr({"fill":"none","stroke-width":"5","d":path});
		}else if(lineState == 2){
			endPt.x = $this.parent().left - $_bg.offset().left+parseInt($(this).attr("cx"));
			endPt.y = $this.parent().top - $_bg.offset().top+parseInt($(this).attr("cy"));
			if(eleEachPos.y > endPt.y){

			}
 		}	
	})
})