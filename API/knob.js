// 旋钮脚本
var sigmdown = false;
var sigmover = false;
var sigmwheel = 0;
var sigtarget = 0;

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

    function sigonMouseOver() {
        // console.log(1);
        $("#signal").css({
            "overflow-y": "hidden"
        });

        sigmover = true;
    }

    function sigonMouseLeave(event) {
        $("#signal").css({
            "overflow-y": "scroll"
        });

        sigmover = false;
        sigmwheel = 0;
    };


    function sigsetWheelPosition(value, id) {
    	
        if(id == "sigkn1"){

			var val = document.getElementById("text1").innerHTML;

			if(val + value >= 0 ){
				document.getElementById("text1").innerHTML = (Math.round(val) + value).toFixed(2) ;
			}else{
				document.getElementById("text1").innerHTML = "0.00";
			}
			
		}

		if(id == "sigkn2"){
			var val = document.getElementById("text2").innerHTML;

			if(val + value >= 0 ){
				document.getElementById("text2").innerHTML = (Math.round(val) + value).toFixed(2) ;
			}else{
				document.getElementById("text2").innerHTML = "0.00";
			}
		}

		if(id == "sigkn3"){
			var val = document.getElementById("text3").innerHTML;

			if(val + value >= 0 ){
				document.getElementById("text3").innerHTML = (Math.round(val) + value).toFixed(2) ;
			}else{
				document.getElementById("text3").innerHTML = "0.00";
			}
		}


		if(id == "sigkn4"){
			var val = document.getElementById("text4").innerHTML;

			if(val + value >= 0 ){
				document.getElementById("text4").innerHTML = (Math.round(val) + value).toFixed(2) ;
			}else{
				document.getElementById("text4").innerHTML = "0.00";
			}
		}

    }

    // console.log(d3.selectAll(".sigknob"));
    $(".sigknob").each(function() {
        $(this).on("mousedown", sigonMouseDown);
        $(this).on("mousemove", sigonMouseMove);
        $(this).on("mouseover", sigonMouseOver);
        $(this).on("mouseleave", sigonMouseLeave);
        $("body").on("mouseup", sigonMouseUp);
        $(this).get(0).addEventListener("mousewheel", function() {

            // event = event || window.event;
            if (event.wheelDelta > 0 || event.detail < 0) {
                //向上滚

                // console.log("up");
                sigmwheel = -1;
            }
            if (event.wheelDelta < 0 || event.detail > 0) {
                //向下滚

                // console.log("down");
                sigmwheel = 1;
            }
            sigsetWheelPosition(-sigmwheel, $(this).attr("id"));
        });
        $(this).get(0).addEventListener("DOMMouseScroll", function() {

            // event = event || window.event;
            if (event.wheelDelta > 0 || event.detail < 0) {
                //向上滚

                console.log("up");
                sigmwheel = -1;
            }
            if (event.wheelDelta < 0 || event.detail > 0) {
                //向下滚

                console.log("down");
                sigmwheel = 1;
            }
            sigsetWheelPosition(-sigmwheel, $(this).attr("id"));
        });
    });



    // power电源效果

    

})
