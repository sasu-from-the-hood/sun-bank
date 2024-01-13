'use strict';
import { accounts } from './accounts.js';
// Selecting Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const lableDept = document.querySelector('.summary__value--debt');
const labelTimer = document.querySelector('.timer');
const labaleWithdrwalCode = document.querySelector('.js-withdrwal-code');
const lableTransfer = document.querySelector('.js-transfer');
const lableLoan = document.querySelector('.js-loan');
const lableWithdrwal = document.querySelector('.js-withdrwal');

const containerApp = document.querySelector('.app');
const balanceContainer = document.querySelector('.balance-row');
const summaryContainer = document.querySelector('.footer');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const payLoanBtn = document.querySelector('.form__btn--pay-loan');
const withdrawBtn = document.querySelector('.form__btn--Withdraw');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputPayLoan = document.querySelector('.form__input--pay-loan');
const inputWithdraw = document.querySelector('.form__input--Withdraw');
////The mini mobile banking system
// Functions

const formatMovmentDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDaysPassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // we're getting the date from the data from the accounts
    const date = new Date();

    const dispayDate = formatMovmentDate(date, acc.locale);

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movments__date">${dispayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance =
    acc.movements.reduce((acc, mov) => acc + mov, 0) + currentAccount.loan[0];
  const formattedMov = formatCurr(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
  lableDept.textContent = acc.loan[0];
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //IN each call, print the remaining time to UI
    labelTimer.innerHTML = `${min}:${sec}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = ` Log In Into Your Account `;
      containerApp.style.opacity = 0;
      balanceContainer.style.opacity = 0;
      summaryContainer.style.opacity = 0;
    }
    time--;
  };
  // set time to 5 minutes
  let time = 300;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;
// Fake Always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    balanceContainer.style.opacity = 1;
    summaryContainer.style.opacity = 1;
    // current date and time

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    labelDate.innerHTML = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (!receiverAcc) {
    lableTransfer.textContent = "The username you entered doesn't exist";
  }
  if (currentAccount.balance < amount) {
    lableTransfer.textContent =
      "My nigga you're broke to send that kinda money";
  }
  clearText(lableTransfer);
  // setTimeout(() => {
  //   lableTransfer.textContent = '';
  // }, 4000);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    localStorage.setItem(
      'usersMoney',
      JSON.stringify(currentAccount.movements)
    );
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    localStorage.setItem(
      'usersDate',
      JSON.stringify(currentAccount.movementsDates)
    );
    // Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
withdrawBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputWithdraw.value;

  inputWithdraw.value = '';
  if (currentAccount.balance < amount) {
    lableWithdrwal.textContent =
      "My nigga you're broke to withdraw that kinda money";
  }
  clearText(lableWithdrwal);
  if (amount > 0 && currentAccount.balance >= amount) {
    // Doing the transfer
    currentAccount.movements.push(-amount);

    localStorage.setItem(
      'usersMoney',
      JSON.stringify(currentAccount.movements)
    );
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    localStorage.setItem(
      'usersDate',
      JSON.stringify(currentAccount.movementsDates)
    );
    const min = 100000;
    const max = 999999;
    setTimeout(() => {
      labaleWithdrwalCode.innerHTML = `Take this code ${
        Math.floor(Math.random() * (max - min + 1)) + min
      } and go to your nearest Sun bank ATM`;
    }, 1000);
    setTimeout(() => {
      labaleWithdrwalCode.innerHTML = ``;
    }, 10000);
    // Update UI
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (!currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    lableLoan.textContent = `In order to get loan atleast one of your deposit must be greater than 10% of what you asked`;
  }
  clearText(lableLoan);
  if (currentAccount.loan[0] > 0) {
    console.log('you need to pay the last money you took');
  }
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1) &&
    currentAccount.loan[0] === 0
  ) {
    setTimeout(function () {
      // Adding to Loan
      currentAccount.loan.unshift(amount);
      // Add movement
      currentAccount.movements.push(amount);
      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      localStorage.setItem('usersLoans', JSON.stringify(currentAccount.loan));
      updateUI(currentAccount);
      localStorage.setItem(
        'usersMoney',
        JSON.stringify(currentAccount.movements)
      );
      localStorage.setItem(
        'usersDate',
        JSON.stringify(currentAccount.movementsDates)
      );

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});
payLoanBtn.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(+inputPayLoan.value);
  if (amount > 0 && amount === currentAccount.loan[0]) {
    currentAccount.loan.splice(0, 1);
    localStorage.setItem('usersLoans', JSON.stringify(currentAccount.loan));
    currentAccount.balance -= amount;
    currentAccount.movements.push(-amount);
    localStorage.setItem(
      'usersMoney',
      JSON.stringify(currentAccount.movements)
    );
  }
  inputPayLoan.value = '';
  inputPayLoan.blur();
  updateUI(currentAccount);
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

function clearText(text) {
  setTimeout(() => {
    text.textContent = '';
  }, 4000);
}
// Admins Section

// Things I needed to check
/**script.js:46 Uncaught RangeError: Invalid time value
    at formatMovmentDate (script.js:46:42)
    at script.js:66:24
    at Array.forEach (<anonymous>)
    at displayMovements (script.js:61:8)
    at updateUI (script.js:124:3)
    at HTMLButtonElement.<anonymous> (script.js:202:5) */
