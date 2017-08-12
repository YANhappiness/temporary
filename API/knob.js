// 旋钮脚本
var sigmdown = false;
var sigmover = false;
var sigmwheel = 0;
var sigtarget = 0;
var power = 1;  //1,open  2,close
var hold = true;


var sigknobp0 = {
    x: 0,
    y: 0,
    tan: 0
};
var sigknobp1 = {
    x: 0,
    y: 0,
    tan: 0
}


$(function() {
    function sigonMouseDown(event) {
        sigmdown = true;
        sigknobp0.x = event.pageX - $(".sigknobp", $(this)).offset().left;
        sigknobp0.y = event.pageY - $(".sigknobp", $(this)).offset().top;
        sigknobp0.tan = sigknobp0.y / sigknobp0.x;
    };

    function sigonMouseUp(event) {
        sigmdown = false;
    };

    function sigonMouseMove(event) {
        if (sigmdown) {
            sigknobp1.x = event.pageX - $(".sigknobp", $(this)).offset().left;
            sigknobp1.y = event.pageY - $(".sigknobp", $(this)).offset().top;
            sigknobp1.tan = sigknobp1.y / sigknobp1.x;
            if (sigknobp1.x * sigknobp0.x > 0) {
                if (sigknobp1.tan > sigknobp0.tan)
                    sigmwheel = 1;
                else if (sigknobp1.tan < sigknobp0.tan)
                    sigmwheel = -1;
            } else if (sigknobp1.x * sigknobp0.x < 0) {
                if (sigknobp1.tan > sigknobp0.tan)
                    sigmwheel = -1;
                else if (sigknobp1.tan < sigknobp0.tan)
                    sigmwheel = 1;
            }
            sigknobp0.x = sigknobp1.x;
            sigknobp0.y = sigknobp1.y;
            sigknobp0.tan = sigknobp1.tan;
            sigsetWheelPosition(-sigmwheel, $(this).attr("id"));

        }
    };

    function sigsetWheelPosition(value, id) {
    	
        if(id == "sigkn1"){
			var val = document.getElementById("text1").innerHTML;
			if(val <= 0 ){
				if(value > 0){
					document.getElementById("text1").innerHTML = (Math.round(val) + value).toFixed(2);
				}else{
					document.getElementById("text1").innerHTML = "0.00";
				}
			}else{
				document.getElementById("text1").innerHTML = (Math.round(val) + value).toFixed(2);
			}
		}

		if(id == "sigkn2"){
			var val = document.getElementById("text2").innerHTML;
			if(val <= 0 ){
				if(value > 0){
					document.getElementById("text2").innerHTML = (Math.round(val) + value).toFixed(2);
				}else{
					document.getElementById("text2").innerHTML = "0.00";
				}
			}else{
				document.getElementById("text2").innerHTML = (Math.round(val) + value).toFixed(2);
			}
		}

		if(id == "sigkn3"){
			var val = document.getElementById("text3").innerHTML;
			if(val <= 0 ){
				if(value > 0){
					document.getElementById("text3").innerHTML = (Math.round(val) + value).toFixed(2);
				}else{
					document.getElementById("text3").innerHTML = "0.00";
				}
			}else{
				document.getElementById("text3").innerHTML = (Math.round(val) + value).toFixed(2);
			}
		}


		if(id == "sigkn4"){
			var val = document.getElementById("text4").innerHTML;
			if(val <= 0 ){
				if(value > 0){
					document.getElementById("text4").innerHTML = (Math.round(val) + value).toFixed(2);
				}else{
					document.getElementById("text4").innerHTML = "0.00";
				}
			}else{
				document.getElementById("text4").innerHTML = (Math.round(val) + value).toFixed(2);
			}
		}

    }

    $(".sigknob").each(function() {
        $(this).on("mousedown", sigonMouseDown);
        $(this).on("mousemove", sigonMouseMove);
        $("body").on("mouseup", sigonMouseUp);
        $(this).get(0).addEventListener("mousewheel", function() {

            event = event || window.event;
            if (event.wheelDelta > 0 || event.detail < 0) {
                //向上滚
                sigmwheel = -1;
            }
            if (event.wheelDelta < 0 || event.detail > 0) {
                //向下滚
                sigmwheel = 1;
            }
            sigsetWheelPosition(-sigmwheel, $(this).attr("id"));
        });
        $(this).get(0).addEventListener("DOMMouseScroll", function() {

            event = event || window.event;
            if (event.wheelDelta > 0 || event.detail < 0) {
                //向上滚
                sigmwheel = -1;
            }
            if (event.wheelDelta < 0 || event.detail > 0) {
                //向下滚
                sigmwheel = 1;
            }
            sigsetWheelPosition(-sigmwheel, $(this).attr("id"));
        });
    });



    // power电源效果

    $(".power").on("click",function(){
    	powerToggle();
    })
    function powerToggle(){
    	if(power == 1){ //开机状态
    		close();
    	}else{
    		open()
    	}
    }

    function close(){
    	$(".display").attr({
    		fill: 'rgb(85, 85, 85)',
    	});

    	$(".light").attr({
    		fill: '#9e958d',
    	});
    	$(".text").attr({
    		fill: 'transparent',
    	});
    	$(".text").html("0.00");
    	power = 2;
    }

    function open(){
    	$(".display").attr({
    		fill: '#d0cc5a',
    	});

    	$(".light").attr({
    		fill: '#fead97',
    	});

    	$(".text").attr({
    		fill: 'black',
    	});

    	power = 1;
    }

    // 二路独立、串联、并联控制开关

   $(".hold").on("click",function(){
   		if(hold){
   			$(this).attr({
   				fill: '#99F099',
   			});
   			hold = false;
   		}else{
   			$(this).attr({
   				fill: '#d6d0c5',
   			});
   			hold = true;
   		}
   		
   })

})
