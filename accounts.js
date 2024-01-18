const account1 = {
  owner: 'Biruk Amanuel',
  movements: JSON.parse(localStorage.getItem('usersMoney')) || [],
  interestRate: 1.3,
  pin: 1245,
  accountNo: 1234,
  movementsDates: JSON.parse(localStorage.getItem('usersDate')) || [],
  currency: 'USD',
  locale: 'en-US',
  loan: JSON.parse(localStorage.getItem('usersLoans')) || [0],
};

const account2 = {
  owner: 'Fasil Alelegn',
  movements: JSON.parse(localStorage.getItem('usersMoney')) || [],
  interestRate: 1.5,
  pin: 2222,
  accountNo: 4321,
  movementsDates: JSON.parse(localStorage.getItem('usersDate')) || [],
  currency: 'ETH',
  locale: 'am-ET',
  loan: JSON.parse(localStorage.getItem('usersLoans')) || [0],
};
export const accounts = [account1, account2];
