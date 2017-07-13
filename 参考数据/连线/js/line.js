
//连线

// 创建电机触点
d3.select("#circuit")
	.append("g")
	.attr("class","circuitWrap")
	.attr("transform","translate(0,100)")
	.selectAll("circle")
	.data([{cx:146,cy:11},{cx:200,cy:11}])
	.enter()
	.append("circle")
	.attr({
		class:"circuitPt",
		ms:function(d,i){return i},
		cx:function(d,i){return d.cx},
		cy:function(d,i){return d.cy},
		r:10,
		fill:"red",
		stroke:"black"
	});
 
