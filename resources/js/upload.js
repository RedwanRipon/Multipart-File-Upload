
$('.addBtn').on('click',function () {
    let NewTableRow=
                "<tr>"+
                    "<td><input class='fileInput form-control' type='file'></td>"+
                    "<td class='fileSize'>File Size</td>"+
                    "<td><button class='btn btn-danger btn-sm cancelBtn'>Cancel</button></td>"+
                    "<td><button class='btn btn-primary btn-sm upBtn'>Upload</button></td>"+
                    "<td class='filesUpMB'>Uploaded(MB)</td>"+
                    "<td class='fileUpPercentage'>Uploaded(%)</td>"+
                    "<td class='fileStatus'>Status</td>"+
                "</tr>";
    $('.fileList').append(NewTableRow);

    //file size
    $('.fileInput').on('change',function () {
        let MyFile = $(this).prop('files');
        let MyFileSIze = ((MyFile[0].size)/(1024*1024)).toFixed(2);
        $(this).closest('tr').find('.fileSize').html(MyFileSIze+"MB");
    });

    //file uploading
    $('.upBtn').on('click',function (event) {
        let MyFile = $(this).closest('tr').find('.fileInput').prop('files');
        let filesUpMB = $(this).closest('tr').find('.filesUpMB');
        let fileUpPercentage = $(this).closest('tr').find('.fileUpPercentage');
        let fileStatus = $(this).closest('tr').find('.fileStatus');
        let upbtn = $(this);
        let formData = new FormData();
        formData.append('FileKey',MyFile[0]);
        onFileUpload(formData,filesUpMB,fileUpPercentage,fileStatus,upbtn);
        event.preventDefault();
        event.stopImmediatePropagation();
    });

    //Remove Row
    $('.cancelBtn').on('click',function () {
        $(this).parents('tr').remove();
    });
});

function onFileUpload(formData,filesUpMB,fileUpPercentage,fileStatus,upbtn) {

    fileStatus.html('Uploading...');
    upbtn.prop('disabled',true);
    let url = '/fileUp';
    let config = {
        headers:{'content-type':'multipart/form-data'},
        onUploadProgress:function (progressEvent) {
           let UpMB = (progressEvent.loaded/(1024*1024)).toFixed(2)+" MB";
           let UpPercent = ((progressEvent.loaded*100)/progressEvent.total).toFixed(2)+" %";
            filesUpMB.html(UpMB);
            fileUpPercentage.html(UpPercent);
        }
    };
    axios.post(url,formData,config)
        .then(function (response) {
            if (response.status==200){
                fileStatus.html('Success');
                upbtn.prop('disabled',false);
            }else {
                fileStatus.html('Fail');
                upbtn.prop('disabled',false);
            }

    }).catch(function (error) {
        fileStatus.html('Fail');
        upbtn.prop('disabled',false);
    });
}
