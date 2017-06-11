

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
    
    function Train(name, dest, freq) {
      this.trainName = name;
      this.destination = dest;
      this.frequency = freq;
      this.firstTrainTime = "03:30";

      function nextArrivalTime(train) {
        var frequency = train.frequency;
        var firstTime = train.firstTrainTime;
        var firstTimeConverted = moment(firstTime, 'hh:mm');
        var currentTime = moment();
        var difference = moment().diff(moment(firstTimeConverted), 'minutes');
        var timeRemainder = difference % frequency;
        var timeTillTrain = frequency - timeRemainder;
        var nextArrival = moment().add(timeTillTrain, 'minutes').format('hh:mm');
        return nextArrival;
      }
      function minutesAway(train) {
        var frequency = train.frequency;
        var firstTime = train.firstTrainTime;
        var firstTimeConverted = moment(firstTime, 'hh:mm');
        var currentTime = moment();
        var difference = moment().diff(moment(firstTimeConverted), 'minutes');
        var timeRemainder = difference % frequency;
        var timeTillTrain = frequency - timeRemainder;
        return timeTillTrain;
      }
      this.nextArrival = nextArrivalTime(this);
      this.minutesAway = minutesAway(this);
    }
    var trentonExpress = new Train("Trenton Express", "Trenton", 25);
    var oregonTrail = new Train("Oregon Trail", "Salem, Oregon", 3600);
    var midnightCarraige = new Train("Midnight Carriage", "Philadelphia", 15);
    var singSingCaravan = new Train("Sing Sing Caravan", "Atlanta", 45);
    var bostonBus = new Train("Boston Bus", "Boston", 65);
    var californiaCaravan = new Train("California Caravan", "San Francisco", 6000);
    var analBensTrain = new Train("Analben's Train", "Florida", 25);
    
    var trainList = [trentonExpress, oregonTrail, midnightCarraige, singSingCaravan, 
    bostonBus, californiaCaravan, analBensTrain];

    console.log(trentonExpress.nextArrival);
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
    database.ref("/originalTrains").on("value", function(train){
      $("#trainInfo").empty();
      $("#trainInfo").append("<tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr> ");
      for (i = 0; i < trainList.length; i++){
        train = trainList[i];
        $("#trainInfo").append("<tr><td>" + 
          train.trainName + "</td><td>" + train.destination + 
          "</td><td>" + train.frequency + "</td><td>" + train.nextArrival + "</td><td>" + 
          train.minutesAway + "</td></tr>")
      }
    });
  }

  addInfo();

  $(".btn").on("click", function() {
    var name = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = $("#frequency").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim()

    var nextTrain = new Train(name, destination, frequency);
    trainList.push(nextTrain);

    $("#trainInfo").empty();

    addInfo();

    database.ref("/userAddedTrains").push({
      nextTrain: nextTrain
    });
    return false;
  })

  database.ref("/userAddedTrains").on("value", function(snap) {
    if (snap.child("-KYzjrAeHTK5TjOfgI2_").exists()) {
      console.log("you got this");
    }
  })

})

//function to calculate the next arrival time
  //