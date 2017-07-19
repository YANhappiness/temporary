/* 
 * 测试WebSocket上传 
 * 本地浏览器上传速度测试单个文件，上传速度IE>FF>Google(Google浏览器慢相当多，原因：<a target=_blank href="http://www.cnblogs.com/tianma3798/p/5852475.html" target="_blank">点击查看</a>) 
 */

var fileBox = document.getElementById('file');
var filereader = null; //读取操作对象  
var filestep = 1024; //每次读取文件大小 ,字节数  
var filecuLoaded = 0; //当前已经读取总数  
var file = null; //当前读取的文件对象  
var fileenableRead = true; //标识是否可以读取文件  
var filetotal = 0; //记录当前文件总字节数  
var filestartTime = null; //标识开始上传时间  
var fileuploadsign = 0; //分段传输标号
var fileuping = 0; //文件传送中标志
var fileenable = 0; //选择文件是否能上传

$(".fdl").each(function() {
    $(this).change(function() {
        console.log("filechange");
        file = this.files[0];
        filetotal = file.size;
        if (file.size >= 0xffffff) {
            alert("上传文件过大，请重新选择");
            return;
        }

        console.info("文件大小：" + file.size);

        if (ws == null) {
            if (window.confirm('建立与服务器链接失败,确定重试链接吗')) {
                createSocket();
            }
            return;
        }
        fileuping = 1;
        $(this).attr("disabled", "disabled"); // 只能上传一次 禁用标签
        filebindReader();
    })
});


//绑定reader  
function filebindReader() {
    filecuLoaded = 0;
    fileuploadsign = 0;
    filestartTime = new Date();
    fileenableRead = true;

    //读取一段成功  
    filereader.onload = function(e) {
        console.info('读取总数：' + e.loaded);
        if (fileenableRead == false)
            return false;
        //根据当前缓冲区来控制客户端读取速度  
        if (ws.bufferedAmount > filestep * 10) { //已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。
            setTimeout(function() {
                //继续读取  
                console.log('--------------》进入等待');
                fileloadSuccess(e.loaded);
            }, 3);
        } else {
            //继续读取  
            fileloadSuccess(e.loaded); //当前加载了多少字符流
        }
    }
    //开始读取  
    filereadBlob();
}


// event.loaded表示当前加载了多少字节流，而event.total表示总共有多少字节流 

//读取成功后文件处理  
function fileloadSuccess(loaded) {
    //将分段数据上传到服务器  
    var blob = filereader.result;
    //使用WebSocket 服务器发送数据
    if (filecuLoaded == 0) // -->当前已经读取的总数
    {

        var a = 0xff & file.size; //255
        var b = 0xff & (file.size >> 8);
        var c = 0xff & (file.size >> 16);
        var d = 0xff & (file.size >> 24);
        ws.send(new Int8Array([0xff, 0x0e, 0x01, deviceId, d, c, b, a])); //

    }
    ws.send(blob);
    //如果没有读完，继续  
    filecuLoaded += loaded;
    if (filecuLoaded < filetotal) {
        filereadBlob();
    } else {
        console.log('总共上传：' + filecuLoaded + ',总共用时：' + (new Date().getTime() - filestartTime.getTime()) / 1000);
    }
    //显示结果进度  
    // var percent = (filecuLoaded / filetotal) * 100;  
    // console.log(1);
    // document.getElementById('Status').innerText = "上传中：" + percent + "%";  
    // document.getElementById('progressOne').value = percent;  
}

//指定开始位置，分块读取文件  
function filereadBlob() {
    //指定开始位置和结束位置读取文件  
    fileuploadsign++;
    var blob = file.slice(filecuLoaded, filecuLoaded + filestep);
    filereader.readAsArrayBuffer(blob);
}
//中止
function filestop() {
    //中止读取操作  
    console.info('中止，cuLoaded：' + filecuLoaded);
    fileenableRead = false;
    filereader.abort();
}