$(document).ready(function () {
    $("#btnSubmit").click(function (event) {                
        event.preventDefault(); //stop submit the form, we will post it manually.
        var form = $('#fileUploadForm')[0]; // Get form                
        var data = new FormData(form); // Create an FormData object  
        $("#btnSubmit").prop('value', 'Wait...');
        $("#btnSubmit").prop("disabled", true); // disabled the submit button

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/celebrity",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                $("#result").html(data);
                console.log("SUCCESS : ", data);
                $("#btnSubmit").prop("disabled", false);
                $("#btnSubmit").prop('value', 'Find celebrity!');
            },
            error: function (e) {
                $("#result").html(e.responseText);
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", false);
                $("#btnSubmit").prop('value', 'Find celebrity!');
            }
        });

    });

    }
); 