document.getElementById("djcode").innerHTML = localStorage.getItem("textvalue");

const select = document.getElementById('dropDown');

select.addEventListener('change', () => {
  const selectedOption = select.options[select.selectedIndex].value;
  
  // Filter pages based on the selected option
  switch(selectedOption)
  {
  case "0":
  $("#showAll").show();
  $("#showAcc").show();
  $("#showReq").show();
  $("#showRej").show();
  $("#showPlayed").show();  
  break;
  case "1":
  $("#showAll").hide();
  $("#showAcc").hide();
  $("#showRej").hide();
  $("#showPlayed").hide();
  $("#showReq").show();
  break;
  case "2":
  $("#showAll").hide();
  $("#showReq").hide();
  $("#showRej").hide();
  $("#showPlayed").hide();
  $("#showAcc").show();
  break;
  case "3": 
  $("#showAll").hide();
  $("#showAcc").hide();
  $("#showReq").hide();
  $("#showPlayed").hide();
  $("#showRej").show();
  break;
  case "4": 
  $("#showAll").hide();
  $("#showAcc").hide();
  $("#showReq").hide();
  $("#showRej").hide();
  $("#showPlayed").show();
  break;
  default:
  break;
  }
});
