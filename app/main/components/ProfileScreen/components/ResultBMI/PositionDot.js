export function Position (bmi) {
    let per = '0%';
    // let bmi = 31
    if (bmi < 18.5) {
      per = bmi * 0.9 + '%';
    } 
    // 18.5 - 22.9
    else if (bmi <= 19 && bmi >= 18.5) {
      per = bmi * 0.6 + 8 + '%';
    } else if (bmi <= 20 && bmi > 19) {
      per = bmi * 0.8 + 12 + '%';
    } else if (bmi <= 21 && bmi > 20) {
      per = bmi * 0.8 + 16 + '%';
    } else if (bmi <= 22 && bmi > 21) {
      per = bmi * 0.8 + 18 + '%';
    } else if (bmi <= 22.9 && bmi > 22) {
      per = bmi * 0.8 + 20 + '%';
    } 
    // 22.9 - 24.9
    else if (bmi <= 23.2 && bmi >= 23) {
      per = bmi * 0.8 + 21 + '%';
    } else if (bmi <= 23.7 && bmi > 23.2) {
      per = bmi * 0.8 + 26 + '%';
    } else if (bmi <= 24.2 && bmi > 23.7) {
      per = bmi * 0.8 + 32 + '%';
    } else if (bmi <= 24.7 && bmi > 24.2) {
      per = bmi * 0.8 + 36 + '%';
    }  else if (bmi <= 24.9 && bmi > 24.7) {
      per = bmi * 0.8 + 38 + '%';
    }  
    // 24.9 - 29.9
    else if (bmi <= 25.5 && bmi >= 25) {
      per = bmi * 0.8 + 40 + '%';
    } else if (bmi <= 26 && bmi > 25.5) {
      per = bmi * 0.8 + 43 + '%';
    }  else if (bmi <= 27 && bmi > 26) {
      per = bmi * 0.8 + 45 + '%';
    }  else if (bmi <= 28 && bmi > 27) {
      per = bmi * 0.8 + 48 + '%';
    }  else if (bmi <= 28.5 && bmi > 28) {
      per = bmi * 0.8 + 49 + '%';
    }  else if (bmi <= 29 && bmi > 28.5) {
      per = bmi * 0.8 + 51 + '%';
    }  else if (bmi <= 29.5 && bmi > 29) {
      per = bmi * 0.8 + 53 + '%';
    }  else if (bmi <= 29.9 && bmi > 29.5) {
      per = bmi * 0.8 + 54 + '%';
    } 
     
    else if (bmi >= 30 && bmi <= 31) {
      per = bmi * 0.8 + 54 + '%';
    }  else if (bmi > 31 && bmi <= 32) {
      per = bmi * 0.8 + 58 + '%';
    }  else if (bmi > 32 && bmi <= 33) {
      per = bmi * 0.8 + 63 + '%';
    }  else if (bmi > 33 && bmi <= 34) {
      per = bmi * 0.8 + 66 + '%';
    }  else if (bmi > 34 && bmi <= 34.9) {
      per = bmi*0.8 + 68 + '%';
    }
    else if (bmi >= 35) {
      per = '98%';
    }
    return per;
}