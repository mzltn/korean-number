function number_to_native(number) {
  const tens = Math.floor(number / 10);
  const ones = number % 10;

  const tens_hangul = ["", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"];
  const ones_hangul = ["영", "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉"];
  if (ones == 0) {
    if (tens == 0) {
      return "영";
    } else {
      return tens_hangul[tens];
    }
  }
  return tens_hangul[tens] + ones_hangul[ones];
}

function number_to_sino(number) {
  var hangul = "";
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  if (number.length >= 9) {
    // 억
    ok_before = number.slice(0, -8);
    if (ok_before.length >= 3 && ok_before.slice(0, -2) != 0) {
      if (ok_before.slice(0, -2) == "1") {
        hangul += "백";
      } else if (ok_before.slice(0, -2) != "0") {
        hangul += digits[ok_before.slice(0, -2)] + "백";
      }
    }
    if (ok_before.length >= 2 && ok_before.slice(-2, -1) != 0) {
      if (ok_before.slice(-2, -1) == "1") {
        hangul += "십";
      } else if (ok_before.slice(-2, -1) != "0") {
        hangul += digits[ok_before.slice(-2, -1)] + "십";
      }
    }
    if (ok_before.slice(-1) == "1" & ok_before.length == 1) {
      hangul += "억 ";
    } else {
      hangul += digits[ok_before.slice(-1)] + "억 ";
    }
  }
  if (number.length >= 5) {
    // 만
    man_before = number.slice(-8, -4);
    if (man_before.length >= 4 && man_before.slice(0, -3) != 0) {
      if (man_before.slice(0, -3) == "1") {
        hangul += "천";
      } else if (man_before.slice(0, -3) != "0") {
        hangul += digits[man_before.slice(0, -3)] + "천";
      }
    }
    if (man_before.length >= 3 && man_before.slice(0, -2) != 0) {
      if (man_before.slice(-3, -2) == "1") {
        hangul += "백";
      } else if (man_before.slice(-3, -2) != "0") {
        hangul += digits[man_before.slice(-3, -2)] + "백";
      }
    }
    if (man_before.length >= 2 && man_before.slice(-2, -1) != 0) {
      if (man_before.slice(-2, -1) == "1") {
        hangul += "십";
      } else if (man_before.slice(-2, -1) != "0") {
        hangul += digits[man_before.slice(-2, -1)] + "십";
      }
    }
    if (man_before.slice(-1) == "1" && man_before.length == 1) {
      hangul += "만 ";
    } else {
      hangul += digits[man_before.slice(-1)] + "만 ";
    }
  }
  if (number.length >= 4 && number.slice(-4, -3) != 0) {
    // 천
    chon_before = number.slice(-4, -3);
    if (chon_before == "1") {
      hangul += "천";
    } else {
      hangul += digits[chon_before] + "천";
    }
  }
  if (number.length >= 3 && number.slice(-3, -2) != 0) {
    // 백
    baek_before = number.slice(-3, -2);
    if (baek_before == "1") {
      hangul += "백";
    } else {
      hangul += digits[baek_before] + "백";
    }
  }
  if (number.length >= 2 && number.slice(-2, -1) != 0) {
    // 십
    sip_before = number.slice(-2, -1);
    if (sip_before == 1) {
      hangul += "십"
    } else {
      hangul += digits[sip_before] + "십"
    }
  }
  ones = number.slice(-1);
    hangul += digits[ones];

  return hangul;
}


