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
        var page=70;
		
		$.ajax({
				type: 'GET',
				url: 'https://gorest.co.in/public-api/users',                   
				contentType: 'application/json; charset=utf-8',
				beforeSend: function () {
					// $("#progress").show();
				},
				success: function (respose) {
					page=respose.meta.pagination.pages;	//meta":{"pagination	
				},
				error: function (err) {
					//  $("#progress").hide();
					alert(err);
				}
			});
		
        $.ajax({
				type: 'GET',
				url: 'https://gorest.co.in/public-api/users?page='+page,                   
				contentType: 'application/json; charset=utf-8',
				beforeSend: function () {
					// $("#progress").show();
				},
				success: function (respose) {
					var udata=respose.data;								
					var body = "";
					$.each(udata, function (i, data) {
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
                     Deletecall();  					
                    _IsData = true;
				    $(this).closest("tr").remove();
                }                
               
            }); 
			 if (!_IsData) {                   
                    alert("Check at least one check box");
                }			
        });
		
	var Deletecall = function (){
		 $.ajax({
			 url: "https://gorest.co.in/public-api/users/"+_UserID,
			 type: "DELETE",					 
			 headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Authorization": "Bearer ACCESS-TOKEN"
						},			 
			 contentType: "application/json; charset=UTF-8",                                       
			 beforeSend: function (xhr) {
				 xhr.setRequestHeader('Authorization', 'Bearer 78a1dd9c998bba6667e12b5550a517e089f30ff24bc9603e34a684a5aec7a2b4');
			 },
			 success: function (resdata) {
				 var res=resdata.data;				 
			 },
			 error: function (err) {
				 alert(err.statusText);
			 },
			complete: function (data) {								
			}
		 });
	}
	
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
		_btnUpdate = $("#btnupdate");
		_btnUpdate.hide();
		_btnAdd=$("#btnsave").show();
		 //ClearData();
         _btnSave.on("click", function () {
            var IsValid = $("#dataform").valid();
            if (IsValid) {
               var id = _txtid.val();
               var name = _txtname.val();
               var email = _txtemail.val();
                 $.ajax({
                     url: "https://gorest.co.in/public-api/users",
                     type: "POST",					 
					 headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								"Authorization": "Bearer ACCESS-TOKEN"
								},
                     data: {name: name, email: email, gender: "Male", status: "Active"},
                     contentType: "application/json; charset=UTF-8",                                       
                     beforeSend: function (xhr) {
                         xhr.setRequestHeader('Authorization', 'Bearer 78a1dd9c998bba6667e12b5550a517e089f30ff24bc9603e34a684a5aec7a2b4');
                     },
                     success: function (resdata) {
						 var res=resdata.data;
						 if(!res.message){
							alert("data is saved....");
							$("#divRequestAction").hide();							
						 }else{
							 alert("error whihle save data");
						 }                        
                     },
                     error: function (err) {
                         alert(err.statusText);
                     },
                    complete: function (data) {
						$("#tbldata > tbody").empty();
                        LoadData();
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
         FormValidation();
    }
    var ClearData = function(){
		_txtid.val('');
        _txtname.val('');
        _txtemail.val('');
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
		_btnUpdate=$("#btnupdate").show();
        _btnCancel = $("#btnCancel");      
         
		 _txtid.val(_UserID);
		 _txtname.val(_name);
		 _txtemail.val(_email);
		 
		GetLoadselectedUserdetails();
		LoadeditEvents();		 
		
	}	
	
	var GetLoadselectedUserdetails = function(){
		$.ajax({
				type: 'GET',
				url: 'https://gorest.co.in/public-api/users/'+_UserID,                   
				contentType: 'application/json; charset=utf-',
				beforeSend: function () {
					// $("#progress").show();
				},
				success: function (respose) {
					var udata=respose.data;													
					//alert(udata.id + udata.name +  udata.email );
				},
				error: function (err) {
					//  $("#progress").hide();
					alert(err);
				}
			});                
	}
	
	
	var LoadeditEvents =function(){
		_btnUpdate.on("click", function () {
            var IsValid = $("#dataform").valid();
            if (IsValid) {
               var id = _txtid.val();
               var name = _txtname.val();
               var email = _txtemail.val();
                 $.ajax({
                      url: "https://gorest.co.in/public-api/users/"+id,
                     type: "PUT",					 
					 headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								"Authorization": "Bearer ACCESS-TOKEN"
								},
                     data: {name: name, email: email, gender: "Male", status: "Active"},
                     contentType: "application/json; charset=UTF-8",                                       
                     beforeSend: function (xhr) {
                         xhr.setRequestHeader('Authorization', 'Bearer 78a1dd9c998bba6667e12b5550a517e089f30ff24bc9603e34a684a5aec7a2b4');
                     },
                     success: function (resdata) {
						 var res=resdata.data;
						 if(!res.message){
							alert("data is updated....");
							$("#divRequestAction").hide();							
						 }else{
							 alert("error whihle updating data");
						 }                        
                     },
                     error: function (err) {
                         alert(err.statusText);
                     },
                    complete: function (data) {
						$("#tbldata > tbody").empty();
                        LoadData();
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
                //txtid: "required",
                txtname: "required",
            },
            // Specify validation error messages
            messages: {
                //txtid: "id is Required",
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

