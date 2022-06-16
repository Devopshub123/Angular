function confirmApproveModal(){
  $('#approveModal').modal();
  $('#title').html('<h6 class="modal-title" >Approve</h6>');

  $('#approveRejectButton').html('<button type="button" class="btn btn-primary" onclick="approve()">Approve</button>');
}
function confirmRejectModal(){
  $('#approveModal').modal();
  $('#title').html('<h6 class="modal-title" >Reject</h6>');

  $('#approveRejectButton').html('<button type="button" class="btn btn-primary" onclick="reject()">Reject</button>');
}
