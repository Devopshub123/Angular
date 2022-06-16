$("#header").load("header.html");
$("#footer").load("footer.html");

function confirmDeleteModal(id){
  $('#deleteModal').modal();
  $('#deleteButton').html('<a class="btn btn-danger" onclick="deleteData('+id+')">Delete</a>');
}
function deleteData(id){
  // do your stuffs with id
  $("#successMessage").html("Record With id "+id+" Deleted successfully!");
  $('#deleteModal').modal('hide'); // now close modal
}
var $calendar;
/*$(document).ready(function () {
  let container = $("#container").simpleCalendar({
    fixedStartDay: 0, // begin weeks by sunday
    disableEmptyDetails: true,
    events: [
      // generate new event after tomorrow for one hour
      {
        startDate: new Date(new Date().setHours(new Date().getHours() + 24)).toDateString(),
        endDate: new Date(new Date().setHours(new Date().getHours() + 25)).toISOString(),
        summary: 'Visit of the Eiffel Tower'
      },
      // generate new event for yesterday at noon
      {
        startDate: new Date(new Date().setHours(new Date().getHours() - new Date().getHours() - 12, 0)).toISOString(),
        endDate: new Date(new Date().setHours(new Date().getHours() - new Date().getHours() - 11)).getTime(),
        summary: 'Restaurant'
      },
      // generate new event for the last two days
      {
        startDate: new Date(new Date().setHours(new Date().getHours() - 48)).toISOString(),
        endDate: new Date(new Date().setHours(new Date().getHours() - 24)).getTime(),
        summary: 'Visit of the Louvre'
      }
    ],

  });
  $calendar = container.data('plugin_simpleCalendar')
});*/

/*pieChart = document.getElementById('pieChart').getContext('2d')

var myPieChart = new Chart(pieChart, {
  type: 'pie',
  data: {
    labels: ["Casual Leaves","Sick Leaves","Earned Leaves","Advance Leaves"],
    datasets: [{
      data: [30, 35, 15, 20],
      backgroundColor :["#ffbf02","#4375c8","#a6a6a6","#eb7f35"],
      borderWidth: 0
    }]
    //                    labels: ['Casual Leaves', 'Sick Leaves', 'Earned Leaves', 'Advance Leaves']
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend : {
      position: 'right'
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    }
  }
})*/
