<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

	<form onsubmit="return check();" id="upload">
		<select name="exp">
			<option value="1">实验1</option>
			<option value="2">实验2</option>
			<option value="3">实验3</option>
			<option value="4">实验4</option>
			<option value="5">实验5</option>
			<option value="6">实验6</option>
			<option value="7">实验7</option>
			<option value="8">实验8</option>
			<option value="9">实验9</option>
			<option value="10">实验10</option>
			<!-- 实验项目 -->
		</select> 
		<select name="info">
			<option value="1">实验目的</option>
			<option value="2">实验原理</option>
			<option value="3">实验步骤</option>
			<!-- 内容 -->
		</select> 
		<input type="file" name="file" />
		<button id="submit">提交</button>
	</form>
	<script src="js_lib/jQuery/jquery-1.11.1.min.js"></script>
	<script type="text/javascript">
		function check() {
			if ($("[name='file']").val() == null
					|| $("[name='file']").val() == "") {
				alert("请选择要上传的word文档");
				return false;
			}
			console.log("in check");
			var formData = new FormData($("#upload")[0]);
			console.log("before ajax");
			$.ajax({
				url : "upload",
				type : 'POST',
				data : formData,
				processData : false,
				contentType : false,
				beforeSend : function() {
					console.log($("[name=file]").val());
					if($("[name=file]").val()!=null&&$("[name=file]").val()!=undefined&&$("[name=file]").val()!="")
						alert("正在上传，请稍候");
				},
				success : function(data,status) {
					alert(data);
				},
				error : function(status,error) {
					alert("服务器异常");
				}
			});
			console.log("after ajax");
			return false;
		}
	</script>
</body>
</html>