import { accounts } from './accounts.js';
const admin1 = {
  owner: 'Abel Redwan',
  pin: 1122,
  movements: JSON.parse(localStorage.getItem('adminsMoneyy')) || [],
  movementsDates: JSON.parse(localStorage.getItem('adminDate')) || [],
  currency: 'ETH',
  locale: 'am-ET',
};
const admins = [admin1];
// Selecting Elements
///////////////////////////////////////
// Selecting The Text Show Up Elements
const message = document.querySelector('.welcome');

// Selecting The Button Elements
const btnAdminLogin = document.querySelector('.login__admin-btn');
const btnAdminTransfer = document.querySelector('.form__btn--admin-transfer');
// Selecting The Input Elements
const inputLoginAdminName = document.querySelector('.login__input--admin');
const inputLoginAdminPin = document.querySelector('.login__input--admin-pin');
const inputAdminTransferTo = document.querySelector('.form__input--admin-to');
const inputAdminTransferAmount = document.querySelector(
  '.form__input--admin-amount'
);
// Selecting Some Main Functionalities
const containerApp = document.querySelector('.app');
const balanceContainer = document.querySelector('.balance-row');
const summaryContainer = document.querySelector('.footer');
const containerMovements = document.querySelector('.movements');
// Creating User-Name For The Admin
const createAdminUsernames = ads => {
  ads[0].adminUserName = ads[0].owner
    .toLowerCase()
    .split(' ')
    .map(add => add[0])
    .join('');
};
createAdminUsernames(admins);

btnAdminLogin.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputLoginAdminName.value === admin1.adminUserName &&
    +inputLoginAdminPin.value === admin1.pin
  ) {
    containerApp.style.opacity = '1';
    summaryContainer.style.opacity = '1';
    balanceContainer.style.opacity = '1';
    message.innerHTML = 'Welcome Sir, ABEL';
  }
  inputLoginAdminName.value = inputLoginAdminPin.value = '';
  displayMovements(admin1);
});
btnAdminTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferAmount = +inputAdminTransferAmount.value;
  const accountNo = +inputAdminTransferTo.value;
  const accountOwner = accounts.find(acc => acc.accountNo === accountNo);
  if (accountOwner) {
    accountOwner.movements.push(transferAmount);
    admin1.movements.push(transferAmount);
    admin1.movementsDates.push(new Date());
    accountOwner.movementsDates.push(new Date());
    localStorage.setItem('usersMoney', JSON.stringify(accountOwner.movements));
    localStorage.setItem('adminsMoneyy', JSON.stringify(admin1.movements));
    localStorage.setItem('adminsDate', JSON.stringify(admin1.movementsDates));
    localStorage.setItem(
      'usersDate',
      JSON.stringify(accountOwner.movementsDates)
    );
  } else {
    console.log('The account Nunber doesnt exist');
  }

  inputAdminTransferAmount.value = inputAdminTransferTo.value = '';
  inputAdminTransferAmount.blur();

  displayMovements(admin1);
});

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
const displayMovements = function (acc) {
  containerMovements.innerHTML = '';

  const movs = acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // we're getting the date from the data from the accounts
    const date = new Date(acc.movementsDates[i]);

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
// 68, 90, 95, 83
