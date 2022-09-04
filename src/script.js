$(function(){
    function fileToImage(file, cb) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function() {
            let image = new Image()
            image.src = reader.result
            image.onload = function() {
                cb(image)
            }
        }
    }
    $("#start").click(function(){
        // 画像を取得
        let imageFiles = $("#selectFileInput").get(0).files;
        let fileLength = $("#selectFileInput").get(0).files.length;
        console.log(fileLength + " Files selected");
        let rgb = $("#chromaKey").val().split(",")
        let canvas = $("#canvas").get(0)
        let sikii = $("#sikii").val()-0
        let context = canvas.getContext("2d")
        for(let j = 0; j < fileLength; j++){
            const fileData = imageFiles[j];
            fileToImage(imageFiles[j], function(image) {
                console.log(fileData);
                canvas.width = image.width
                canvas.height = image.height
                context.drawImage(image, 0, 0)
                let imageData = context.getImageData(0, 0, image.width, image.height)
                let data = imageData.data
                for(let x = 0; x<image.width; x++) {
                    for(let y = 0; y<image.height; y++) {
                        let i = ((y*canvas.width) + x)*4
                        let r = Math.abs(data[i+0] - rgb[0])
                        let g = Math.abs(data[i+1] - rgb[1])
                        let b = Math.abs(data[i+2] - rgb[2])
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