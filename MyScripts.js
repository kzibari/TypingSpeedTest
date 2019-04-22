//global ariables used in the script
var startTime;
var finishTime;
var elapsedTime;
var sampleText;
var inputText;
var underlinedText;
var speeed;
var errors;
var textSamples=["As they rounded a bend in the path that ran beside the river, Lara recognised the silhouette of a fig tree atop a nearby hill. Then the brown fox jumped over the lazy dog.",
				 "It is a far, far better thing that I do, than I have ever done; it is a far, far better rest that I go to, than I have ever known.",
				 "Have a heart that never hardens, and a temper that never tires, and a touch that never hurts.",
				 "Reflect upon your present blessings -- of which every man has many -- not on your past misfortunes, of which all men have some.",
				 "It was one of those March days when the sun shines hot and the wind blows cold: when it is summer in the light, and winter in the shade"
				];

$(document).ready(function () {

	//Initialize all variables on page load
	$("#sampleText").text(textSamples[getRndInteger(0,4)]);
						  
	sampleText = $("#sampleText").text();
	inputText = "";
	underlinedText = "";
	errors = 0;

	$("#finish").attr("disabled", true);
	$("#theText").attr("disabled", true);
	$("#tryAgain").hide();
	$("#underlinedText").hide();

	$("#resultSpeed").hide();
	$("#resultSpeed").hide();
	$("#chartContainer").hide();

	$("#start").click(function () {
	
		setStartTime();
		$("#finish").attr("disabled", false);
		$("#start").attr("disabled", true);
		$("#theText").attr("disabled", false);
		$("#theText").val("");
		clearResultSection();

	});
	$("#finish").click(function () {
		setFinishTime();

		//hide the buttons and textarea so that the user does not have to scroll to see results
		$("#theText").css("display", "none");
		$("#finish").css("display", "none");
		$("#start").css("display", "none");

		inputText = $("#theText").val();
		speed = calculateTypingSpeed(inputText);
		var inputWords = inputText.trim().split(/\s+/);

		if (inputWords.length < 5) {
			$("#resultSpeed").text("You did not type enough words.");
			$("#chartContainer").hide();
			$("#resultSpeed").show();
			$("#tryAgain").show();
			return;
		}
		errors = checkText(inputText);

		$("#resultSpeed").show();

		var resultText = "Your speed is: ~" + Math.round(speed) + " words/minute. You made: " + errors + " error(s)!";

		if (inputWords.length < (sampleText.trim().split(/\s+/)).length)
			resultText += " You did not type all the words!";

		$("#resultSpeed").text(resultText);
		if (errors != 0) {
			$("#underlinedText").show();
			$("#underlinedText").html(underlinedText);
		}
		$("#chartContainer").show();
		displayChart();
		$("#tryAgain").css("display", "inherit");
	});

	//Prevent user from pasting into the textarea
	$("#theText").onpaste = function (e) {
		e.preventDefault();
	}
	$("#tryAgain").click(function () {
		clearResultSection();
		location.reload();
	});
});

function setStartTime() {
	startTime = new Date();
}

function setFinishTime() {
	finishTime = new Date();
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function elapsedTime() {
	return (finishTime - startTime);
}

function calculateTypingSpeed(text) {

	var seconds = (new Date(elapsedTime())).getSeconds();
	return (inputText.trim().split(/\s+/).length) * 60 / seconds;
}

function checkText(text) {
	var originalWords = sampleText.trim().split(" ");
	var typedWords = text.trim().split(/\s+/);
	underlinedText = "";

	errors = 0;
	for (i = 0; i < typedWords.length; i++) {
		//check if typed word is equal to the correct word or its ajacent words
		if (typedWords[i].trim() != originalWords[i] && typedWords[i].trim() != originalWords[i + 1] && typedWords[i].trim() != originalWords[i - 1]) {
			errors += 1;
			underlinedText += " " + "<u>" + typedWords[i] + "</u>";
		} else {
			underlinedText += " " + typedWords[i];
		}
	}
	return errors;
}

function clearResultSection() {
	errors = 0;
	$("#resultSpeed").hide();
	$("#underlinedText").hide();
	$("#chartContainer").hide();
}

//function to display a canvasjs chart about typing speeds
function displayChart() {
	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		theme: "light2", // "light1", "light2", "dark1", "dark2"
		title: {
			text: "Typing Speeds"
		},
		axisY: {
			title: "Percentage of Population",
			suffix: "%",
			includeZero: false
		},
		axisX: {
			title: "Typing Speeds (Words Per Minute)"
		},
		data: [{
			type: "column",
			dataPoints: [
				{
					label: "0-10",
					y: 9
				},
				{
					label: "10-20",
					y: 11
				},
				{
					label: "20-30",
					y: 12
				},
				{
					label: "30-40",
					y: 15
				},
				{
					label: "40-50",
					y: 12
				},
				{
					label: "50-60",
					y: 11
				},
				{
					label: "60-70",
					y: 10
				},
				{
					label: "70+",
					y: 5
				}
		]
	}]
	});
	chart.render();
}
