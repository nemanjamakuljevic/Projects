var parameters = {
    distanceStep: 0.762,
    calBurned: 0.05,
    stepTime: 0.5
};
var callJSONArray = new Array();
var callJSON = {
				timestamp : 0,
				steps : 0,
				distance : 0,
				calories : 0,
				time : 0
			}


var months = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];

var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];



var allSteps = 0;

var totalParams = {
    totalSteps: 0,
    totalDistance: 0,
    totalCalories: 0,
    totalTime: 0
};
	

var stringDOMS = {
    weekTime : "#weekTotalTime",
    weekSteps : "#weekTotalSteps",
    weekCal : "#weekTotalCal"
}


   var  totalParams = {
        totalSteps: 0,
        totalDistance: 0,
        totalCalories: 0,
        totalTime: 0
    };

    allSteps = 0;
	

getData('alldays');

function getData(date) {
	var url = "https://api.myjson.com/bins/1gwnal";
	totalParams = {
        totalSteps: 0,
        totalDistance: 0,
        totalCalories: 0,
        totalTime: 0
    };
	
    if (date === 'alldays') {
       
        $.getJSON(url, function (element) {
			
            $.each(element, function (key, value) {
				
                allSteps += value.steps;
                callJSON.distance = value.steps * parameters.distanceStep;
				callJSON.calories = value.steps * parameters.calBurned;
				callJSON.steps = value.steps;
				callJSON.time = value.steps * parameters.stepTime;
				callJSON.timestamp = convertTimestamp(value.timestamp);
				callJSONArray.push(callJSON);
				
				callJSON = {
					timestamp : 0,
					steps : 0,
					distance : 0,
					calories : 0
				}
            })
            
            dispayWeek();
			
				var calculateTotalSteps = 0;
				var calculateTotalDistance = 0
				var calculateTotalCalories = 0;
				var calculateTotalTime = 0;
			 $.each(callJSONArray, function (key, value) {
			
				calculateTotalSteps+= value.steps;
				calculateTotalDistance+= value.distance;
				calculateTotalCalories+= value.calories;
				calculateTotalTime += value.time;
				
				
			});
			totalParams.totalSteps = calculateTotalSteps;
			totalParams.totalDistance = calculateTotalDistance;
			totalParams.totalCalories = calculateTotalCalories;
			totalParams.totalTime = calculateTotalTime / 3600;
			
			console.log(totalParams)
			dispayWeek()
			
        });
		
    } else {
		//resset array whenever day is clicked
		callJSONArray = new Array();
		console.log("here i am")
		$.getJSON(url, function (element) {
			
            $.each(element, function (key, value) {
				
                allSteps += value.steps;
                callJSON.distance = value.steps * parameters.distanceStep;
				callJSON.calories = value.steps * parameters.calBurned;
				callJSON.steps = value.steps;
				callJSON.time = value.steps * parameters.stepTime;
				callJSON.timestamp = convertTimestamp(value.timestamp);
				callJSONArray.push(callJSON);
				
				callJSON = {
					timestamp : 0,
					steps : 0,
					distance : 0,
					calories : 0
				}
            })
            
            dispayWeek();
			
				var calculateDailySteps = 0;
				var calculateDailyDistance = 0
				var calculateDailyCalories = 0;
				var calculateDailyTime = 0;
			 $.each(callJSONArray, function (key, value) {
			
			var dateToParse = value.timestamp.date.split(',');
			if(date == dateToParse[1])
			{
				calculateDailySteps+= value.steps;
				calculateDailyDistance+= value.distance;
				calculateDailyCalories+= value.calories;
				calculateDailyTime += value.time;
			}
				
				
				
			});
			totalParams.totalSteps = calculateDailySteps;
			totalParams.totalDistance = calculateDailyDistance;
			totalParams.totalCalories = calculateDailyCalories;
			totalParams.totalTime = calculateDailyTime / 3600;
			
			console.log(totalParams)
			dispayWeek()
	
        });
    }
};

function clickedDateChange(day)
{
	 getData(day);
}
function convertTimestamp(timestamp)
{
	
    let date = new Date((timestamp));
    let convertedDateTime = {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        day: days[date.getDay() - 1],
        date: (date.getMonth()+ 1 ) +  "," + date.getDate() + "," + date.getFullYear()
    };
    return convertedDateTime;
}

function dispayWeek() 
{
    $(stringDOMS.weekTime).text(totalParams.totalTime);
    $(stringDOMS.weekSteps).text(totalParams.totalSteps);
    $(stringDOMS.weekCal).text(totalParams.totalCalories);
}



