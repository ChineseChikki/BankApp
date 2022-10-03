// let customers = [
//   {
//     owner: 'Chinese Chikki',
//     movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//     interestRate: 1.2, // %
//     pin: 2022,
//   },
//   {
//     owner: 'Dike Lucy',
//     movements: [100_000, 60_000, 2_000, 15_000, 700, -1_000, -50_000, -25_000],
//     interestRate: 1.5, // %
//     pin: 2021,
//   },
// ];

('use strict');
//USER DATA INFORMATION FOR PERFORMANCE OF OPERATION
const account1 = {
  owner: 'Chinese Chikki',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 2022,
};

const account2 = {
  owner: 'Dike Lucy',
  movements: [100_000, 60_000, 2_000, 15_000, 700, -1_000, -50_000, -25_000],
  interestRate: 1.5, // %
  pin: 2021,
};

const account3 = {
  owner: 'Ozor Jikki',
  movements: [33_000, 9_000, 4_000, 150_000, 200, -70_000, -10_000, -5_000],
  interestRate: 0.7, // %
  pin: 2020,
};

const account4 = {
  owner: 'Ike Hakki',
  movements: [70_000, 5_000, 2_500, 12_000, 500, -10_000, -15_000, -3_000],
  interestRate: 1, // %
  pin: 2019,
};

const account5 = {
  owner: 'Lagos Master',
  movements: [15_000, 11_000, 4_500, 2_000, 300, -10_000, -5_000, -300],
  interestRate: 0.5, // %
  pin: 2018,
};

const accounts = [account1, account2, account3, account4, account5];
//ELEMENTS SUCH AS CLASSES AND ID FROM OUR HTML ARE BEING POINTED AT USING QUERY-SELECTORS

// TRANSACTIONS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance_value');
const labelSumIn = document.querySelector('.summary_value--in');
const labelSumOut = document.querySelector('.summary_value--out');
const labelSumInterest = document.querySelector('.summary_value--interest');
const labelTimer = document.querySelector('.timer');

//  MOVING IN TO GET STARTED WITH THE APP
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

//ALL ABOUT BUTTONS
const btnLogin = document.querySelector('.login_btn');
const btnTransfer = document.querySelector('.form_btn--transfer');
const btnLoan = document.querySelector('.form_btn--loan');
const btnClose = document.querySelector('.form_btn--close');
const btnSort = document.querySelector('.btn--sort');

// LOG-IN ACTIONS
const inputLoginUsername = document.querySelector('.login_input--user');
const inputLoginPin = document.querySelector('.login_input--pin');
const inputTransferTo = document.querySelector('.form_input--to');
const inputTransferAmount = document.querySelector('.form_input--amount');
const inputLoanAmount = document.querySelector('.form_input--loan-amount');
const inputCloseUsername = document.querySelector('.form_input--user');
const inputClosePin = document.querySelector('.form_input--pin');

//FUNCTIONS THAT PERFORMS ALL THE WORKS

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  let moves = sort ? movements.slice().sort((a, b) => a - b) : movements;

  moves.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements_row">
    <div class= "movements_type movements_type--${type}">${i + 1}${type}</div>
    <div class="movements_value">₦${new Intl.NumberFormat().format(move)}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // containerMovements.append(html);
  });
  // console.log(containerMovements);
};

// acc => accumulator
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `₦${new Intl.NumberFormat().format(acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `₦${new Intl.NumberFormat().format(incomes)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `₦${new Intl.NumberFormat().format(Math.abs(out))}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `₦${new Intl.NumberFormat().format(interest)}`;
};

// accs = accounts
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
console.log(accounts);

const updateUI = function (acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc.movements);
  //DISPLAY BALANCE
  calcDisplayBalance(acc);
  //DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

//EVENT HANDLERS
let currentAccount;
// LOGIN FNX
btnLogin.addEventListener('click', function (e) {
  //PREVENT FORM FROM SUBMITTING
  e.preventDefault();
  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value ||
      acc.owner === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    //DISPLAY UI AND  WELCOME  MESSAGE
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    //CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //UPDATE UI
    updateUI(currentAccount);
  }
});

// FNX FOR TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc.username !== currentAccount.username
  ) {
    //  DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    //UPDATE UI
    updateUI(currentAccount);
  }
});

// THIS IS BTN FOR GETTING LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //DELETE ACCOUNT
    accounts.splice(index, 1);

    //HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
