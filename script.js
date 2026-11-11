const percentageForm = document.querySelector("#percentage-form");

if (percentageForm) {
  const numberInput = document.querySelector("#number");
  const percentageInput = document.querySelector("#percentage");
  const result = document.querySelector("#percentage-result");

  function showResult(message, isError = false) {
    result.textContent = message;
    result.hidden = false;
    result.classList.toggle("error", isError);
  }

  percentageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const numberText = numberInput.value.trim();
    const percentageText = percentageInput.value.trim();

    if (!numberText || !percentageText) {
      showResult("Please enter both a number and a percentage.", true);
      return;
    }

    const number = Number(numberText);
    const percentage = Number(percentageText);

    if (!Number.isFinite(number) || !Number.isFinite(percentage)) {
      showResult("Please enter valid numbers in both fields.", true);
      return;
    }

    const calculation = (number * percentage) / 100;

    if (!Number.isFinite(calculation)) {
      showResult("Those values are too large to calculate. Please try smaller numbers.", true);
      return;
    }

    const formattedResult = calculation.toLocaleString(undefined, {
      maximumFractionDigits: 10,
    });
    showResult(`${percentageText}% of ${numberText} is ${formattedResult}.`);
  });

  percentageForm.addEventListener("reset", () => {
    result.hidden = true;
    result.textContent = "";
    result.classList.remove("error");
  });
}

const ageForm = document.querySelector("#age-form");

if (ageForm) {
  const dateOfBirthInput = document.querySelector("#date-of-birth");
  const ageResult = document.querySelector("#age-result");

  function showAgeResult(message, isError = false) {
    ageResult.textContent = message;
    ageResult.hidden = false;
    ageResult.classList.toggle("error", isError);
  }

  function parseLocalDate(dateText) {
    const dateParts = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!dateParts) {
      return null;
    }

    const year = Number(dateParts[1]);
    const month = Number(dateParts[2]) - 1;
    const day = Number(dateParts[3]);
    const date = new Date(0);

    date.setFullYear(year, month, day);
    date.setHours(0, 0, 0, 0);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  function getDaysInMonth(year, month) {
    const date = new Date(0);

    date.setFullYear(year, month + 1, 0);
    return date.getDate();
  }

  function addCalendarMonths(date, monthsToAdd) {
    const totalMonths = date.getFullYear() * 12 + date.getMonth() + monthsToAdd;
    const year = Math.floor(totalMonths / 12);
    const month = totalMonths % 12;
    const day = Math.min(date.getDate(), getDaysInMonth(year, month));
    const result = new Date(0);

    result.setFullYear(year, month, day);
    result.setHours(0, 0, 0, 0);

    return result;
  }

  function getUtcCalendarTimestamp(date) {
    const utcDate = new Date(0);

    utcDate.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    utcDate.setUTCHours(0, 0, 0, 0);

    return utcDate.getTime();
  }

  ageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const dateText = dateOfBirthInput.value;

    if (!dateText) {
      showAgeResult("Please enter your date of birth.", true);
      return;
    }

    const birthDate = parseLocalDate(dateText);

    if (!birthDate) {
      showAgeResult("Please enter a valid date of birth.", true);
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (birthDate > today) {
      showAgeResult("Your date of birth cannot be in the future.", true);
      return;
    }

    let completedMonths =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      today.getMonth() -
      birthDate.getMonth();
    let lastCompletedMonthDate = addCalendarMonths(birthDate, completedMonths);

    if (lastCompletedMonthDate > today) {
      completedMonths -= 1;
      lastCompletedMonthDate = addCalendarMonths(birthDate, completedMonths);
    }

    const years = Math.floor(completedMonths / 12);
    const months = completedMonths % 12;
    const days =
      (getUtcCalendarTimestamp(today) - getUtcCalendarTimestamp(lastCompletedMonthDate)) /
      (24 * 60 * 60 * 1000);

    showAgeResult(`You are ${years} years, ${months} months, and ${days} days old.`);
  });

  ageForm.addEventListener("reset", () => {
    ageResult.hidden = true;
    ageResult.textContent = "";
    ageResult.classList.remove("error");
  });
}

const discountForm = document.querySelector("#discount-form");

if (discountForm) {
  const originalPriceInput = document.querySelector("#original-price");
  const discountPercentageInput = document.querySelector("#discount-percentage");
  const discountResult = document.querySelector("#discount-result");

  function showDiscountResult(message, isError = false) {
    discountResult.textContent = message;
    discountResult.hidden = false;
    discountResult.classList.toggle("error", isError);
  }

  function formatNumber(value) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 10 });
  }

  discountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const originalPriceText = originalPriceInput.value.trim();
    const discountPercentageText = discountPercentageInput.value.trim();

    if (!originalPriceText || !discountPercentageText) {
      showDiscountResult("Please enter both the original price and the discount percentage.", true);
      return;
    }

    const originalPrice = Number(originalPriceText);
    const discountPercentage = Number(discountPercentageText);

    if (!Number.isFinite(originalPrice) || !Number.isFinite(discountPercentage)) {
      showDiscountResult("Please enter valid numbers in both fields.", true);
      return;
    }

    if (originalPrice < 0) {
      showDiscountResult("The original price cannot be negative.", true);
      return;
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      showDiscountResult("The discount percentage must be between 0% and 100%.", true);
      return;
    }

    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;

    if (!Number.isFinite(discountAmount) || !Number.isFinite(finalPrice)) {
      showDiscountResult("Those values are too large to calculate. Please try smaller numbers.", true);
      return;
    }

    showDiscountResult(
      `Discount amount: ${formatNumber(discountAmount)}\nFinal price: ${formatNumber(finalPrice)}`
    );
  });

  discountForm.addEventListener("reset", () => {
    discountResult.hidden = true;
    discountResult.textContent = "";
    discountResult.classList.remove("error");
  });
}

const profitMarginForm = document.querySelector("#profit-margin-form");

if (profitMarginForm) {
  const costPriceInput = document.querySelector("#cost-price");
  const sellingPriceInput = document.querySelector("#selling-price");
  const profitMarginResult = document.querySelector("#profit-margin-result");

  function showProfitMarginResult(message, isError = false) {
    profitMarginResult.textContent = message;
    profitMarginResult.hidden = false;
    profitMarginResult.classList.toggle("error", isError);
  }

  function formatProfitNumber(value) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 10 });
  }

  profitMarginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const costPriceText = costPriceInput.value.trim();
    const sellingPriceText = sellingPriceInput.value.trim();

    if (!costPriceText || !sellingPriceText) {
      showProfitMarginResult("Please enter both the cost price and the selling price.", true);
      return;
    }

    const costPrice = Number(costPriceText);
    const sellingPrice = Number(sellingPriceText);

    if (!Number.isFinite(costPrice) || !Number.isFinite(sellingPrice)) {
      showProfitMarginResult("Please enter valid prices in both fields.", true);
      return;
    }

    if (costPrice < 0 || sellingPrice < 0) {
      showProfitMarginResult("Cost price and selling price cannot be negative.", true);
      return;
    }

    const profitOrLoss = sellingPrice - costPrice;

    if (!Number.isFinite(profitOrLoss)) {
      showProfitMarginResult("Those values are too large to calculate. Please try smaller prices.", true);
      return;
    }

    let profitOrLossText = "";

    if (profitOrLoss > 0) {
      profitOrLossText = `Profit: ${formatProfitNumber(profitOrLoss)}`;
    } else if (profitOrLoss < 0) {
      profitOrLossText = `Loss: ${formatProfitNumber(Math.abs(profitOrLoss))}`;
    } else {
      profitOrLossText = "No profit or loss: 0";
    }

    if (sellingPrice === 0) {
      showProfitMarginResult(`${profitOrLossText}\nMargin: Not defined`);
      return;
    }

    const profitMargin = (profitOrLoss / sellingPrice) * 100;

    if (!Number.isFinite(profitMargin)) {
      showProfitMarginResult("Those values are too large to calculate. Please try smaller prices.", true);
      return;
    }

    showProfitMarginResult(
      `${profitOrLossText}\nProfit margin: ${formatProfitNumber(profitMargin)}%`
    );
  });

  profitMarginForm.addEventListener("reset", () => {
    profitMarginResult.hidden = true;
    profitMarginResult.textContent = "";
    profitMarginResult.classList.remove("error");
  });
}

const dateDifferenceForm = document.querySelector("#date-difference-form");

if (dateDifferenceForm) {
  const startDateInput = document.querySelector("#start-date");
  const endDateInput = document.querySelector("#end-date");
  const dateDifferenceResult = document.querySelector("#date-difference-result");
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  function showDateDifferenceResult(message, isError = false) {
    dateDifferenceResult.textContent = message;
    dateDifferenceResult.hidden = false;
    dateDifferenceResult.classList.toggle("error", isError);
  }

  function parseUtcCalendarDate(dateText) {
    const dateParts = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!dateParts) {
      return null;
    }

    const year = Number(dateParts[1]);
    const month = Number(dateParts[2]) - 1;
    const day = Number(dateParts[3]);
    const date = new Date(0);

    date.setUTCFullYear(year, month, day);
    date.setUTCHours(0, 0, 0, 0);

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month ||
      date.getUTCDate() !== day
    ) {
      return null;
    }

    return date;
  }

  dateDifferenceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const startDateText = startDateInput.value;
    const endDateText = endDateInput.value;

    if (!startDateText || !endDateText) {
      showDateDifferenceResult("Please enter both a start date and an end date.", true);
      return;
    }

    const startDate = parseUtcCalendarDate(startDateText);
    const endDate = parseUtcCalendarDate(endDateText);

    if (!startDate || !endDate) {
      showDateDifferenceResult("Please enter valid dates in both fields.", true);
      return;
    }

    const differenceInDays = (endDate.getTime() - startDate.getTime()) / millisecondsPerDay;

    if (differenceInDays < 0) {
      showDateDifferenceResult("The end date must be the same as or later than the start date.", true);
      return;
    }

    if (!Number.isFinite(differenceInDays)) {
      showDateDifferenceResult("Those dates cannot be calculated. Please try different dates.", true);
      return;
    }

    const dayLabel = differenceInDays === 1 ? "day" : "days";
    showDateDifferenceResult(`The difference is ${differenceInDays} ${dayLabel}.`);
  });

  dateDifferenceForm.addEventListener("reset", () => {
    dateDifferenceResult.hidden = true;
    dateDifferenceResult.textContent = "";
    dateDifferenceResult.classList.remove("error");
  });
}
