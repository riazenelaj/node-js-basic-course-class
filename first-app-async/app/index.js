const mathUtils = require("./math-utils");

console.log("Program will be blocked :(");

const response1 = request1(200000);
console.log("**prime numbers**", response1);


console.log("Now, I'm able to do other works");
otherRequests();

function otherRequests() {
    setInterval(() => {
        console.log("other requests...");
    }, 50);
}

function request1(n) {
    console.log("**calc prime numbers...**");
    const start = new Date();

    const primes = mathUtils.getPrimeNumbersWithinRange(2, n);

    const end = new Date();
    console.log("**end calc prime numbers**. Elapsed ms: ", end.getTime() - start.getTime());

    return primes;
}

