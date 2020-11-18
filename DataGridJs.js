var DataGridJs = (function () {
    var _tbldata;   
    var _btnAdd;
    var _btnEdit;
    var _btnDelete;    
    var _UserID;
	var _name;
	var _email;
	//popup controls
	var  _txtid;
    var  _txtname;
    var  _txtemail;
	var  _btnSave;
    var  _btnCancel;      
    
    var _LoadGrid = function () {       
        _tbldata= $("#tbldata");       
        _btnAdd = $("#btnAdd");
        _btnEdit = $("#btnEdit");		 
        _btnDelete = $("#btnDelete");
	    _btnEdit.prop('disabled', true);
        LoadData();
        LoadEvents();
		//FormValidation();
    }   
    var LoadData = function () {
        $.ajax({
				type: 'GET',
				url: 'https://jsonplaceholder.typicode.com/posts/1/comments',                   
				contentType: 'application/json; charset=utf-8',
				contentType: 'application/json',
				beforeSend: function () {
					// $("#progress").show();
				},
				success: function (data) {                       				        
					var body = ""
					$.each(data, function (i, data) {
						body += "<tr>";
						body += "<td>" +'<input type="checkbox" class="chkrow SelectedChecks" id="chkcommentid" Data-id="' + data.id + '" Data-Name="' + data.name + '" Data-Email="' + data.email + '"  name="chkid">' + "</td>";
						body += "<td>" + data.id + "</td>";
						body += "<td>" + data.name + "</td>";
						body += "<td>" + data.email + "</td>";						
						body += "</tr>";
					});
					_tbldata.append(body);
				},
				error: function (err) {
					//  $("#progress").hide();
					alert(err);
				}
			});                
    }   
	
    var LoadEvents = function () {	
	    
		 _tbldata.on('click', 'tbody td .chkrow', function () {    
			  var row = $(this).closest("tr");
		      if (row.find("input[name='chkid']").is(":checked")){
				_UserID= $(this).attr("Data-id");
				_name = $(this).attr("Data-name");
				_email = $(this).attr("Data-email");					    
			  }      
		    EnableEditbutton();						
        });
		
        _btnAdd.on("click", function () {
            LoadAddPopUp();
        });
        _btnEdit.on("click", function () {				 
			// $.ajax({
				// url: "",
				// type: "GET",
				// data: JSON.stringify({ id: _id }),
				// contentType: "application/json",
				// success: function (MsgData) {
					//get data from server                      
				// },
				// error: function (jqxhr, status, error) {                                
					// alert("e :" + status + " " + error);
				// },
				// complete: function (data) {
					
				// }
			// });              
          LoadeditPopUpcontrols();
        });
		_btnDelete.on("click", function () {
            
			var _IsData = false;
            $("#messageDisplay").hide();
            $("#tbldata tbody tr").each(function (row) {
                if ($(this).find("input[name='chkid']").is(":checked")) {
					
                    var _DeleteData = {};
                    _UserID = $(this).find("input[name='chkid']").attr("Data-id");                  
                    _DeleteData.id = $(this).find("input[name='chkid']").attr("Data-id");
                        //call api for delete
						//$('#r2').remove();						
                        _IsData = true;
				    $(this).closest("tr").remove();
                }                
               
            }); 
			 if (!_IsData) {                   
                    alert("Check at least one check box");
                }			
        });
		
	var LoadAddPopUp= function(){
		$("#divRequestAction").show();
		LoadAddPopUpControlles();
	}	
		
	
    var LoadAddPopUpControlles = function () {
		$("#HeaderTitle").text("");
        $("#HeaderTitle").text("New User Details");
		_txtid = $("#txtid");
        _txtname = $("#txtname");
        _txtemail = $("#txtemail");
		_btnSave = $("#btnsave");
        _btnCancel = $("#btnCancel");      
         LoadAddItemEvents();
         FormValidation();
    }

    var LoadAddItemEvents = function () {        
        _btnSave.on("click", function () {
            var IsValid = $("#dataform").valid();
            if (IsValid) {
               var id = _txtid.val();
               var name = _txtname.val();
               var email = _txtemail.val();
                 $.ajax({
                     url: "https://jsonplaceholder.typicode.com/posts/1/comments",
                     type: "POST",
                     data: JSON.stringify({userId: 1, id: id, name: name, email: email}),
                     contentType: "application/json",                   
                     dataType: 'json',
                    // beforeSend: function () {
                        // loading saving data div
                    // },
                     success: function (data) {
						 if(data){
								var body = "";
								body += "<tr>";
								body += "<td>" +'<input type="checkbox" class="chkrow SelectedChecks" onclick="chkselet(this)" id="chkcommentid" Data-id="' + data.id + '" Data-Name="' + data.name + '" Data-Email="' + data.email + '"  name="chkid">' + "</td>";
								body += "<td>" + id + "</td>";
								body += "<td>" + data.name + "</td>";
								body += "<td>" + data.email + "</td>";						
								body += "</tr>";
							_tbldata.append(body);
							alert("data is saved....");
							$("#divRequestAction").hide();
						 }else{
							 alert("error whihle save data");
						 }                        
                     },
                     error: function (err) {
                         alert(err.statusText);
                     },
                    // complete: function (data) {
                        // //close saving data div
                    // }
                 });
            }
        });
		$(".close").on('click', function () {
            $("#divRequestAction").hide();
        }) 
        _btnCancel.on('click', function () {
            $("#divRequestAction").hide();
        }) 
	
    }
	
	var LoadeditPopUpcontrols= function(){
		$("#divRequestAction").show();
		$("#HeaderTitle").text("");
        $("#HeaderTitle").text("Edit User Details");
		_txtid = $("#txtid");
        _txtname = $("#txtname");
        _txtemail = $("#txtemail");
		_btnUpdate = $("#btnupdate");
		_btnAdd=$("#btnsave").hide();
        _btnCancel = $("#btnCancel");      
         
		 _txtid.val(_UserID);
		 _txtname.val(_name);
		 _txtemail.val(_email);
		 
		LoadeditEvents();		 
		
	}	
	
	var LoadeditEvents =function(){
		_btnUpdate.on("click", function () {
            var IsValid = $("#dataform").valid();
            if (IsValid) {
               var id = _txtid.val();
               var name = _txtname.val();
               var email = _txtemail.val();
                 $.ajax({
                     url: "https://jsonplaceholder.typicode.com/posts/1/comments",
                     type: "POST",
                     data: JSON.stringify({userId: 1, id: id, name: name, email: email}),
                     contentType: "application/json",                   
                     dataType: 'json',                    
                     success: function (data) {
						 if(data){
							$("#divRequestAction").hide();
							LoadGrid();
						 }else{
							 alert("error whihle save data");
						 }                        
                     },
                     error: function (err) {
                         alert(err.statusText);
                     }
                 });
            }
        });
		$(".close").on('click', function () {
            $("#divRequestAction").hide();
        }) 
        _btnCancel.on('click', function () {
            $("#divRequestAction").hide();
        }) 
	}

    var FormValidation = function () {
        $("#dataform").validate({
            // Specify validation rules
            rules: {
                txtid: "required",
                txtname: "required",
            },
            // Specify validation error messages
            messages: {
                txtid: "id is Required",
                txtname: "name is required",
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
    }	

        $("#tbldata thead tr th input:checkbox").click(function () {
            var checkedStatus = this.checked;
            if (checkedStatus) {
                $("#selectAll input:checkbox").prop("checked", true);
            } else {
                $("#selectAll input:checkbox").prop("checked", false);	
				_btnEdit.prop('disabled', true);
            }
            $(".SelectedChecks").each(function () {
                this.checked = checkedStatus;
            });
            $(".SelectedChecks").click(function () {
                if ($(".SelectedChecks").length == $(".SelectedChecks:checked").length) {
                    $("#tbldata thead tr th input:checkbox").prop("checked", true);
                } else {
                    $("#tbldata thead tr th input:checkbox").prop("checked", false);
					EnableEditbutton();
                }				
            });				   			
        });		
		
		
	var EnableEditbutton= function(){
		if($(".SelectedChecks:checked").length==1){
			_btnEdit.prop('disabled', false);
		}
		else
		{
			_btnEdit.prop('disabled', true);
		}
	  }
	}
		
    return { LoadGrid: _LoadGrid }
})();

