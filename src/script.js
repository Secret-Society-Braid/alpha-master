$(function(){
    function fileToImage(file, cb) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function() {
            var image = new Image()
            image.src = reader.result
            image.onload = function() {
                cb(image)
            }
        }
    }
    $("#start").click(function(){
        // 画像を取得
        var imageFiles = $("#selectFileInput").get(0).files;
        var fileLength = $("#selectFileInput").get(0).files.length;
        console.log(fileLength + " Files selected");
        var rgb = $("#chromaKey").val().split(",")
        var canvas = $("#canvas").get(0)
        var sikii = $("#sikii").val()-0
        var context = canvas.getContext("2d")
        for(var j = 0; j < fileLength; j++){
            const fileData = imageFiles[j];
            fileToImage(imageFiles[j], function(image) {
                console.log(fileData);
                canvas.width = image.width
                canvas.height = image.height
                context.drawImage(image, 0, 0)
                var imageData = context.getImageData(0, 0, image.width, image.height)
                var data = imageData.data
                for(var x = 0; x<image.width; x++) {
                    for(var y = 0; y<image.height; y++) {
                        var i = ((y*canvas.width) + x)*4
                        var r = Math.abs(data[i+0] - rgb[0])
                        var g = Math.abs(data[i+1] - rgb[1])
                        var b = Math.abs(data[i+2] - rgb[2])
                        data[i+3] = (r+g+b) > sikii ? 255 : 0
                    }
                }
                context.putImageData(imageData, 0, 0)
                $("#results").append('<span>' + fileData.name + '</span><br><img name="result" src="' + canvas.toDataURL() + '"><br />');
                context.clearRect(0,0,context.canvas.clientWidth,context.canvas.clientHeight);
                console.log("Canvas Reset.");
            })
        }
        console.log("Compeleted.");
    })
    $("#selectFile").click(function() {
        $("#selectFileInput").click()
    })
    $("#reset").click(() => {
        location.reload();
    });
})