

$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyAEAhuma-PNQ3wUSvYBFxYNWAy3MagOpRQ",
    authDomain: "train-schedule-2b175.firebaseapp.com",
    databaseURL: "https://train-schedule-2b175.firebaseio.com",
    storageBucket: "train-schedule-2b175.appspot.com",
    messagingSenderId: "667939350162"
  };
	firebase.initializeApp(config);

	var database = firebase.database();

//Train object constructor
  function Train(name, dest, freq) {
    this.trainName = name;
    this.destination = dest;
    this.frequency = freq;
    this.firstTrainTime = "03:30";
    this.nextArrival = nextArrivalTime(this);
    this.minutesAway = minutesAway(this);
  }
  //calculate next arrival time
  function nextArrivalTime(train) {
    let timeTillTrain = minutesAway(train);
    var nextArrival = moment().add(timeTillTrain, 'minutes').format('hh:mm');
    return nextArrival;
  }

  function minutesAway(train) {
    var frequency = train.frequency;
    var firstTime = train.firstTrainTime;
    //convert firstTime to something
    var firstTimeConverted = moment(firstTime, 'hh:mm');
    //calculate differnce between arrival time and now
    var difference = moment().diff(moment(firstTimeConverted), 'minutes');
    //find the time until the next train
    var timeRemainder = difference % frequency;
    var timeTillTrain = frequency - timeRemainder;
    return timeTillTrain;
  }
  //create trains 
  var trentonExpress = new Train("Trenton Express", "Trenton", 25);
  var oregonTrail = new Train("Oregon Trail", "Salem, Oregon", 3600);
  var midnightCarraige = new Train("Midnight Carriage", "Philadelphia", 15);
  var singSingCaravan = new Train("Sing Sing Caravan", "Atlanta", 45);
  var bostonBus = new Train("Boston Bus", "Boston", 65);
  var californiaCaravan = new Train("California Caravan", "San Francisco", 6000);
  var analBensTrain = new Train("Analben's Train", "Florida", 25);
  //array for trains to iterate over
  var trainList = [trentonExpress, oregonTrail, midnightCarraige, singSingCaravan, 
  bostonBus, californiaCaravan, analBensTrain];

  //set database with train information
  function setStuff() {
    database.ref("/originalTrains").set({
    trentonExpress: trentonExpress,
    oregonTrail: oregonTrail, 
    midnightCarraige: midnightCarraige, 
    singSingCaravan: singSingCaravan, 
    bostonBus: bostonBus, 
    californiaCaravan: californiaCaravan,
    analBensTrain: analBensTrain
    //trainList: trainList
    });
  }
  setStuff();
  function addInfo() {
    //grab info from database
    database.ref("/originalTrains").on("value", function(train){
      //empty trainInfo div
      $("#trainInfo").empty();
      //create table header for div
      $("#trainInfo").append("<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr> ");
      //for each train
      for (i = 0; i < trainList.length; i++){
        train = trainList[i];
        //create a new table row and insert relevant info
        $("#trainInfo").append("<tr><td>" + 
        train.trainName + "</td><td>" + train.destination + 
        "</td><td>" + train.frequency + "</td><td>" + train.nextArrival + 
        "</td><td>" + train.minutesAway + "</td></tr>")
      }
      database.ref("/userAddedTrains").orderByKey().on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot){
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          //console.log(childData.nextTrain);
          $("#trainInfo").append("<tr><td>" + 
          childData.nextTrain.trainName + "</td><td>" + childData.nextTrain.destination + 
          "</td><td>" + childData.nextTrain.frequency + "</td><td>" + childData.nextTrain.nextArrival + 
          "</td><td>" + childData.nextTrain.minutesAway + "</td></tr>")
        });
      });
    });
  }

  addInfo();

  $(".btn").on("click", function() {
    //when the add button is clicked, trim entry values
    var name = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = $("#frequency").val().trim();
    //use the train constructor to create a new train with the values
    var nextTrain = new Train(name, destination, frequency);
    //add to train array
    //trainList.push(nextTrain);
    //add to database
    database.ref("/userAddedTrains").push({
      nextTrain: nextTrain
    });
    //re-render the trainInfo div with new train's info
    addInfo();
    return false;
  });
});