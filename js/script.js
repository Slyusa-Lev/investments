const nameMonths = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];


const form = document.forms.invest;
const button = form.elements.submit;
const outputInvestResult = document.querySelector('.output-invest-result');
const table = document.createElement('table');
const tableHeader = document.createElement('th');
const tableRow = document.createElement('tr');
const tableData = document.createElement('td');

button.addEventListener("click", function(event) {
  outputInvestResult.innerHTML = '';
  event.preventDefault();
	  
  let investValue = {};
  investValue.startSum = +form.elements.sum.value;
	investValue.sumOfMonth = +form.elements.month.value;
	investValue.procent = +form.elements.procent.value;
	investValue.months = +form.elements.months.value;
  
  const nowDate = getNowDate();
  const lastYear = getLastYear(nowDate, investValue.months);
  
  const investYears = getInvestYears(nowDate.nowYear, lastYear);
  const investMonths = getInvestMonths(nowDate, investYears, investValue.months);
  const investSumOfMonths = getInvestSumOfMonths(nowDate, investYears, investValue.months, investValue);
  
  console.log(investMonths);
  console.log(investSumOfMonths);
  
  renderInvestTable(nowDate, investYears, investMonths, nameMonths, investSumOfMonths);
  editInvestGraph(investValue, investSumOfMonths);
});

//новый код
getNowDate = () => {
	const nowDate = new Date();
	const objDate = {
		nowYear: nowDate.getFullYear(),
		nowMonth: nowDate.getMonth()
	}
	return objDate;
}

rounded = (number) => {
    return +number.toFixed(1);
}

getLastYear = (nowDate, numberOfMonth) => {
  return Math.ceil(nowDate.nowYear + ((nowDate.nowMonth + numberOfMonth) / 12));
}

getInvestYears = (nowYear, lastYear) => {
	const investYears = [];
	for (let currentYear = nowYear; currentYear < lastYear; currentYear++) {
		investYears.push(currentYear);
    }
	return investYears;
}

getInvestMonths = (nowDate, investYears, limitMonth) => {
  let investMonths = [];
  let monthsCounter = 1;
  
  for (let currentYear = 1; currentYear <= investYears.length; currentYear++) {
    let startMonth = 0;
    let monthsOfTheYear = [];
    
    if (monthsCounter === 1) {
      startMonth = nowDate.nowMonth;
    }
    
    for (let currentMonth = startMonth + 1; currentMonth < 12; currentMonth++) { //startMonth + 1
      monthsOfTheYear.push(currentMonth);
      monthsCounter++;
      if (monthsCounter > limitMonth) {
        break
      }
    }
    
    investMonths.push(monthsOfTheYear);
  }
  
  return investMonths;
}

getInvestSumOfMonths = (nowDate, investYears, limitMonth, investValue) => {
  let monthsCounter = 1;
  const procentOfMonth = investValue.procent / 100 / 12;
  let accomulatorOfSum = 0;
  let investSumOfMonths = [];
  
  for (let currentYear = 1; currentYear <= investYears.length; currentYear++) {
    let startMonth = 0;
    let monthsOfTheYear = [];
    
    if (monthsCounter === 1) {
      startMonth = nowDate.nowMonth;
    }
    
    for (let currentMonth = startMonth + 1; currentMonth < 12; currentMonth++) { //startMonth + 1
      if (monthsCounter === 1) {
        accomulatorOfSum = Math.round(investValue.startSum + investValue.startSum * procentOfMonth);
      } else {
        const procentSumOfMonth = (accomulatorOfSum + investValue.sumOfMonth) * procentOfMonth;
        accomulatorOfSum = Math.round(accomulatorOfSum + investValue.sumOfMonth + procentSumOfMonth);
      }
      monthsOfTheYear.push(accomulatorOfSum);
      monthsCounter++;
      if (monthsCounter > limitMonth) {
        break
      }
    }
    
    investSumOfMonths.push(monthsOfTheYear);
  }
  
  return investSumOfMonths;
}

renderInvestTable = (nowDate, investYears, investMonths, nameMonths, investSumOfMonths) => {
  for (let i = 0; i < investYears.length; i++) {
    let newTable = table.cloneNode(true);
    newTable.id = 'table-' + investYears[i];
    
    let yearTableHeader = tableHeader.cloneNode(true);
    yearTableHeader.textContent = investYears[i];
    newTable.appendChild(yearTableHeader);
    
    let valueTableHeader = tableHeader.cloneNode(true);
    valueTableHeader.textContent = investSumOfMonths[i][investSumOfMonths[i].length - 1];
    newTable.appendChild(valueTableHeader);
    
    for (let j = 0; j <= investMonths[i][investMonths[i].length - 1]; j++) {
      let newTableRow = tableRow.cloneNode(true);
      
      let monthTableData = tableData.cloneNode(true);
      monthTableData.textContent = nameMonths[investMonths[i][j]]; //
      newTableRow.appendChild(monthTableData);
      
      let valueTableData = tableData.cloneNode(true);
      valueTableData.textContent = investSumOfMonths[i][j];
      newTableRow.appendChild(valueTableData);
      
      newTable.appendChild(newTableRow);
    }
    
    outputInvestResult.appendChild(newTable);
  }
}

editInvestGraph = (investValue, investSumOfMonths) => {
  const wrapperOutput = document.querySelector('.wrapper-output');
  const finalSum = document.querySelector('#final-sum');
  const investMonthsOutput = document.querySelector('#invest-months-output');
  const sumsOfLastYear = investSumOfMonths[investSumOfMonths.length - 1];
  const sumsOfLastMonth = sumsOfLastYear[sumsOfLastYear.length - 1];
  
  const allSumInvestGraph = document.querySelector('#all-sum-invest');
  const procentsInvestGraph = document.querySelector('#procents-invest');
  
  const allSumInvestValueOutput = document.querySelector('#all-sum-invest-value');
  const procentsInvestOutput = document.querySelector('#procents-invest-value');//эта строка
  
  const propertyStartSum = document.querySelector('#start-sum');
  const propertySumOfMonth = document.querySelector('#sum-of-month');
  const propertyProcent = document.querySelector('#procent');
  const propertyMonths = document.querySelector('#months');
  
  const allSumInvestValue = investValue.startSum + (investValue.months - 1) * investValue.sumOfMonth;
  const procentsInvestValue = sumsOfLastMonth - allSumInvestValue;
  const procentsInvestProcents = rounded(procentsInvestValue / sumsOfLastMonth * 100);
  const procentsAllSumInvest = 100 - procentsInvestProcents;
  
  wrapperOutput.style.display = "block";
  finalSum.textContent = sumsOfLastMonth;
  investMonthsOutput.textContent = investValue.months;
  
  allSumInvestGraph.title = `${procentsAllSumInvest}%, ${allSumInvestValue} руб.`;
  allSumInvestGraph.style.width = `${procentsAllSumInvest}%`;
  procentsInvestGraph.title = `${procentsInvestProcents}%, ${procentsInvestValue} руб.`;
  procentsInvestGraph.style.width = `${procentsInvestProcents}%`;
  
  allSumInvestValueOutput.textContent = allSumInvestValue;
  procentsInvestOutput.textContent = `${procentsAllSumInvest}%`;
  
  propertyStartSum.textContent = investValue.startSum;
  propertySumOfMonth.textContent = investValue.sumOfMonth;
  propertyProcent.textContent = investValue.procent;
  propertyMonths.textContent = investValue.months;
}