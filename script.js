'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// // Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/////////////////////////////////////////////
/////////////Movement //////////////////
//////////////////////////////////////////////
const displayMovement = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // movs.forEach(function (mov, i) {
  //   const type = mov > 0 ? 'deposit' : 'withdrawal';
  //   const html = `<div class="movements__row">
  //   <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  //   <div class="movements__value">$${mov.toFixed(2)}</div>
  // </div>`;

  //   containerMovements.insertAdjacentHTML('afterbegin', html);
  // });
};
/////////////////////////////////////////////
/////////////Display balance //////////////////
//////////////////////////////////////////////
const calDisplayBlanace = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `$${acc.balance.toFixed(2)}`;
};
/////////////////////////////////////////////
/////////////Display Summary //////////////////
//////////////////////////////////////////////
const calDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `$${income.toFixed(2)}`;

  const withdraw = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc - cur, 0);
  labelSumOut.textContent = `$${Math.abs(withdraw).toFixed(2)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * currentAccount.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `$${interest.toFixed(2)}`;
};
//calDisplaySummary(account1.movements);
/////////////////////////////////////////////
/////////////Create User Name //////////////////
//////////////////////////////////////////////
const createUserName = function (accs) {
  accs.forEach(function (el) {
    el.username = el.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovement(acc.movements);
  //display balance
  calDisplayBlanace(acc);
  //Display summary
  calDisplaySummary(acc);
};
/////////////////////event handler ////////////////////////////
let currentAccount;

//Fake login
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

const now = new Date();
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const day = `${now.getDate()}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${month}/${day}/${year}`;

//Month/day/year
//1)/////////////////////////////////////////////
/////////////Login botton //////////////////
//////////////////////////////////////////////
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.vale = inputLoginPin.value = '';
    updateUI(currentAccount);
    inputLoginPin.blur();
    //update UI
  }
});

//2)//////////////////////////////////////////////////////////
/////////////Transfer money to another account ///////////////
//////////////////////////////////////////////////////////////
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
});

//3)/////////////////////////////////////////////
/////////////Close the account //////////////////
////////////////////////////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete the account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
  }
});
console.log(accounts);
//4)/////////////////////////////////////////////
/////////////Loan/////////////////////////////
//////////////////////////////////////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
//4)/////////////////////////////////////////////
/////////////Sorting/////////////////////////////
//////////////////////////////////////////////
let sorting = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorting);
  sorting = !sorting;
});
//console.log(calTotalBlanace(movements));
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// for (const [i, moves] of movements.entries()) {
//   if (moves > 0) {
//     console.log(`Movement: ${i + 1} you have deposit ${moves}`);
//   } else {
//     console.log(`Movement: ${i + 1} you have withdrew ${moves}`);
//   }
// }

// movements.forEach(function (moves, i) {
//   if (moves > 0) {
//     console.log(`Movement: ${i + 1} you have deposit ${moves}`);
//   } else {
//     console.log(`Movement: ${i + 1} you have withdrew ${moves}`);
//   }
// });
/////////////////////////////////
// for (const [i, moves] of movements.entries()) {
//   if (moves > 0) {
//     console.log(`Movement:${i + 1} you have deposit ${moves}`);
//   } else {
//     console.log(`Movement:${i + 1} you have withdrew ${moves}`);
//   }
// }
// //map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, mp) {
//   console.log(`${key} key: ${value} `);
// });
// //Set

// const currenciesNew = new Set(['USD', 'EU', 'USD', 'EEM']);

// currenciesNew.forEach(function (value, key, map) {
//   console.log(`${key} ${value}`);
// });
//////////////////////////

//Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, 
and stored the data into an array (one array for each). For now, they are just interested 
in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old,
 and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), 
and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs!
 So create a shallow copy of Julia's array, and remove the cat ages from that copied array
  (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, 
and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// 1) create function 'checkDogs' that take two pram 'dogsJulia' and 'dogsKate'
//2) Create an array for both Julia and Kate data
//3)in julia array remove the first and last value from the array
//4)console whether:
// it's an adult ("Dog number 1 is an adult, and is 5 years old")
// a puppy ("Dog number 2 is still a puppy 🐶")

// let julia = [3, 5, 2, 12, 7];
// const kate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   dogsJulia.splice(3, 2);
//   dogsJulia.splice(0, 1);
//   console.log(dogsJulia);
//   //Merging two arrays together
//   const dogs = dogsJulia.concat(dogsKate);
//   console.log(dogs);
//   const age = dogs > 3 ? 'an adult' : 'a puppy';
//   dogs.forEach(function (el, i) {
//     if (el > 3) {
//       console.log(`Dog number ${i + 1} is ${age}, and is ${el}`);
//     } else {
//       console.log(`Dog number ${i + 1} is still ${age} 🐶`);
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// const euToUSD = 1.1;

// const movementsUSD = movements.map(mov => mov * euToUSD);
// console.log(movementsUSD);

// const arr2 = [];
// for (const mov of movements) arr2.push(mov * euToUSD);
// console.log(arr2);

// const movesss = movements.map(
//   (moves, i) =>
//     `Movement:${i + 1} you have ${moves > 0 ? 'deposit' : 'withrewal'} ${moves}`
// );
// console.log(movesss);

////////////////////////////////////

//Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages
//to human ages and calculate the average age of the dogs in their study.

// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'),
//and does the following things in order:

// 1. Calculate the dog age in human years using the following formula:
//if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
//humanAge = 16 + dogAge * 4.
// 2. Exclude all dogs that are less than 18 human years old
//(which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already
// know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets

const DATA1 = [5, 2, 4, 1, 15, 8, 3];
const DATA2 = [16, 6, 10, 5, 6, 1, 4];

//what we have to do:

//1)convert dog ages to human ages
//2)calculate the average age of the dogs in their study.

//3) create function 'calcAverageHumanAge' which accepts an arrays of dog's ages ('ages')
//1: Calculate the dog age in human years / if the dog is <= 2 years old,
//humanAge = 2 * dogAge.
//If the dog is > 2 years old,
//humanAge = 16 + dogAge * 4.
//note: Exclude all dogs that are less than 18 human years old
// 4) Calculate the average human age of all adult dogs

//sub
//1) create funtion
// 1: if dog <= 2 years old  return humanAge = 2 * dogAge.
// 2: if dog is > 2 years old return humanAge = 16 + dogAge * 4.

//map
//fitler
// reduce

// const calcAverageHumanAge = ages =>
//   ages
//     .map(cur => (cur <= 2 ? 2 * cur : 16 + cur * 4))
//     .filter(age => age > 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// console.log(calcAverageHumanAge(DATA1));
// console.log(calcAverageHumanAge(DATA2));

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(accounts);
// console.log(account);

// const obj = [];

// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     obj.push(acc);
//   }
// }
// console.log(obj);

const arr = [1, 2, 3, 4, 5, 6, 7];

console.log(arr.flat(2));

const accountMovement = accounts
  .flatMap(allofmov => allofmov.movements)
  .reduce((acc, cur) => cur + acc, 0);
console.log(accountMovement);

movements.sort((a, b) => a - b);
console.log(movements);

movements.sort((a, b) => b - a);
console.log(movements);
///////////////////////////////////////

// const x = new Array(6);
// console.log(x);
// x.fill(6, 3, 5);
// console.log(x);

// arr.fill(23, 3, 5);
// console.log(arr);

// const dicRoll = Array.from({ length: 100 }, (_, i) => i + 1);
// console.log(dicRoll);

// console.log(8 % 5);
// console.log(8 / 5);

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'red';
//   });
// });

// const num = 230_404_054_05;
// console.log(num);

const num = 456456564555;

console.log('US:', new Intl.NumberFormat('en-US').format(num));

console.log('Great Britin:', new Intl.NumberFormat('de-DE').format(num));

console.log('sdfs', new Intl.NumberFormat(navigator.language).format(num));
