export function Position(bmi, widthView) {
  let per = 0
  if (bmi >= 0 && bmi <= 18.5) {
    per = (bmi / 18.5) * widthView
  } else if (bmi > 18.5 && bmi <= 22.9) {
    per = ((bmi - 18.5) / (22.9 - 18.5)) * widthView + widthView - 6
  } else if (bmi > 22.9 && bmi <= 24.9) {
    per = ((bmi - 22.9) / (24.9 - 22.9)) * widthView + widthView * 2 - 6
  } else if (bmi > 24.9 && bmi <= 29.9) {
    per = ((bmi - 24.9) / (29.9 - 24.9)) * widthView + widthView * 3 - 6
  } else {
    per = ((bmi - 29.9) / (32 - 29.9)) * widthView + widthView * 4 - 6
    if (per > 5 * widthView) {
      per = widthView * 5 - 10
    }
  }
  return per;
}