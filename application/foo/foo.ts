const numbers: number[] = [1,2,3,4,5,6,7,8];

const myfunc = (num1: number, num2: number) : number => {
    return num1 + num2;
}

console.log(numbers);

console.log(myfunc(3,4));


module.exports = {
    numbers,
    myfunc
}