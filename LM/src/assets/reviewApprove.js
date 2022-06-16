function confirmApproveModal(){
  $('#approveModal').modal();
  $('#title').html('<h6 class="modal-title" >Approve</h6>');

  $('#approveRejectButton').html('<a class="btn btn-primary" onclick="approve()">Approve</a>');
}
function confirmRejectModal(){
  $('#approveModal').modal();
  $('#title').html('<h6 class="modal-title" >Reject</h6>');

  $('#approveRejectButton').html('<a class="btn btn-primary" onclick="reject()">Reject</a>');
}
