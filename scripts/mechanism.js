var practiceType = "sino";
var answerMode = "number";
var waiting = false;

var answer = "";

function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function isNumberKoreanChecked() {
  return $("#number-korean").is(":checked");
}
function getSigfig() {
  return parseInt($("#sigfig").val());
}
function animateElement(element, opacity, callback) {
  $(element).animate({ opacity: opacity }, 200, callback);
}
function readQuestion() {
  readAloud($("#question").text());
}

function checkState() {
  practiceType = $("#practice-type-select")[0].value;
  $("#rangeSliderDiv,#sigFigDiv").css("display", (practiceType == 'sino') ? "flex" : "none");

  if (isNumberKoreanChecked()) {
    answerMode = "korean";
    $("#ans")[0].type = "text";
  } else {
    answerMode = "number";
    $("#ans")[0].type = "number";
  }
  genQuestion();
}

function genQuestion() {
  var hangul = "";
  var number = "";
  if (practiceType == "native") {
    number = randInt(0, 99);
    hangul = number_to_native(number);
    number = number.toString();
  } else if (practiceType == "sino") {
    var [lowBound, upperBound] = $("#rangeSlider").slider("getValue");
    var mag = randInt(lowBound, upperBound); // 1 - 11
    var sigfig = Math.min(parseInt(getSigfig()), mag); // 1 - 11
    number = (randInt(Math.pow(10, sigfig - 1), Math.pow(10, sigfig) - 1) * (Math.pow(10, mag - sigfig))).toString(); // 1 - 1e11
    hangul = number_to_sino(number);
  }
  hangul = hangul.trim();
  var questionText = "";
  if (answerMode == "number") {
    questionText = hangul;
    answer = number;
  } else {
    questionText = number;
    answer = hangul;
  }
  $("#question").text(questionText);
  $("#ans").val("").attr("disabled", false);

  if (!isNumberKoreanChecked()) {
    readQuestion();
  }

  $("#ans").focus();
}

function checkAns() {
  var correct = false;
  if ($("#ans").val().replace(" ", "") == answer.replace(" ", "")) {
    $("#correct-ans").removeClass("text-danger").addClass("text-success")
    $("#correct-ans").text("Correct!")
    correct = true;
  } else {
    $("#correct-ans").removeClass("text-success").addClass("text-danger")
    if (answerMode == "number") {
      $("#correct-ans").text(parseInt(answer).toLocaleString());
    } else {
      $("#correct-ans").text(answer);
    }
  }
  if (correct) {
    waiting = true;
    animateElement("#correct-ans", 1, () => {
      animateElement("#main", 0, () => {
        genQuestion();
        animateElement("#main", 1, () => {
          waiting = false;
        });
      });
      animateElement("#correct-ans", 0);
    });
  } else {
    animateElement("#correct-ans", 1, () => {
      $("#correct-ans").focus();
    });
    if (isNumberKoreanChecked()) {
      readAloud(answer);
    }
  }
}

$(() => {
  $("#rangeSlider").slider().on('slideStop', genQuestion);

  $("#tempoSlider").slider().on('slideStop', readQuestion);

  $("#sigfig").val("11");
  $("#sigfig").on("input", () => {
    $("#sigFigDisplay").text(getSigfig());
  });
  $("#sigfig").change(checkState);

  $("#ans").keydown((e) => {
    if (waiting) return false;

    // Submit Handler
    if (e.key == "Enter") {
      if ($("#correct-ans").hasClass("text-danger") && $("#correct-ans").css("opacity") != "0") {
        waiting = true;
        animateElement("#main", 0, () => {
          genQuestion();
          animateElement("#main", 1, () => {
            waiting = false;
          });
        });
        animateElement("#correct-ans", 0);
      } else {
        checkAns();
      }
      return false;
    }

    if ($("#correct-ans").css("opacity") != "0") {
      return false;
    }

    // Validate Numbers Only
    if (answerMode == "korean") return true;
    valid = false;
    validKeys = ["Backspace", "ArrowLeft", "ArrowRight"]
    validKeys.forEach(key => {
      if (key == e.key) valid = true
    });
    if (!valid) {
      valid = (e.key.search(/[0-9]/) == 0);
    }
    if (!valid) {
      return false;
    }
  });

  checkState()

  $("#practice-type-select").change(checkState);
  $("#number-korean").change(checkState);

  $("#ans").focus();
  
  startLoadingVoices();
  $('#tts-select').on("change", () => {
    const index = $('#tts-select')[0].value;
    selectVoice(index);
    readQuestion();
  });

  $("#question").click(() => {
    readQuestion();
  })
});
