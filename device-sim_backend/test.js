const double_arr = [[], [], []];
var arr = [];

var arr1 = [
    '75.01', '79.01', '76.7',
    '73.59', '69.02', '66.72',
    '66.32', '61.53', '58.95',
    '25.34', '24.7', '25.5',
    '25.79', '25.41', '26.03',
    '25.1', '24.51', '24.01'
];

var temp = arr1.pop();
console.log(temp)

var arr2 = [
    '2022-08-10T04:37:07.9627249Z',
    '2022-08-10T04:37:12.9622791Z',
    '2022-08-10T04:37:17.970433Z',
    '2022-08-10T04:37:22.9823893Z',
    '2022-08-10T04:37:27.9895125Z',
    '2022-08-10T04:37:32.9999292Z',
    '2022-08-10T04:37:38.0000341Z',
    '2022-08-10T04:37:43.0149462Z',
    '2022-08-10T04:37:48.020379Z',
    '2022-08-10T04:37:07.9627249Z',
    '2022-08-10T04:37:12.9622791Z',
    '2022-08-10T04:37:17.970433Z',
    '2022-08-10T04:37:22.9823893Z',
    '2022-08-10T04:37:27.9895125Z',
    '2022-08-10T04:37:32.9999292Z',
    '2022-08-10T04:37:38.0000341Z',
    '2022-08-10T04:37:43.0149462Z',
    '2022-08-10T04:37:48.020379Z'
];

double_arr.length = 0;
double_arr.push(arr1);
double_arr.push(arr1);
double_arr.push(arr1);

const data = {};

arr2.forEach((element, index) => {
    data[element] = arr1[index];
});

// console.log(obj);

// arr.push(obj);
// arr.push(obj);

// console.log(arr);

const arr3 = new Array();
arr3.push({ name: 'dummy-temp-1', result: data });
arr3.push({ name: 'dummy-temp-2', result: data });
arr3.push({ name: 'dummy-temp-3', result: data });

// console.log(arr3);

// data = [
//     {name: 'Workout', data: {'2017-01-01 00:00:00 -0800': 3, '2017-01-02 00:00:00 -0800': 4}},
//     {name: 'Call parents', data: {'2017-01-01 00:00:00 -0800': 5, '2017-01-02 00:00:00 -0800': 3}}
//   ];
// const time = '2017-01-03 00:00:00 -0800'
// data[0].data[time] = 5;
// console.log(data);

// dataN = {
//     "humidity": [
//         [
//             "73.65",
//             "70.62",
//             "69.28",
//         ],
//     ],
//     "timestamp": [
//         [
//             "8/12/2022, 9:12:06 AM",
//             "8/12/2022, 9:12:11 AM",
//             "8/12/2022, 9:12:16 AM",
//         ],
//     ]
// }

// dataN.humidity[0].push(23.0);
// console.log(dataN);

[
    {
        name: 'dummy-temp-1',
        result: {
            '2022-08-10T04:37:07.9627249Z': '25.34',
        }
    },
]

// const person = {
//     firstName: 'John',
//     lastName: 'Doe'
// };

// console.log("Original Object")
// console.log(person)

// const entries = Object.entries(person);

// console.log("Object to Array")
// console.log(entries)

// function deleteFirstRow(arr){
//     arr = arr.slice(0);
//     arr.splice(0, 1);
//     return arr;
// }

// console.log("Deleting first row of the double array..")
// const newEntries = deleteFirstRow(entries);
// console.log(newEntries);

// const fromEntries = new Map(newEntries);

// const objConverted = Object.fromEntries(fromEntries);
// console.log("Array to Object")
// console.log(objConverted);

// objConverted['newName'] = "G"
// console.log(objConverted);

const ary = [8, 7, 6, 5, 4, 3, 2, 1];

console.log("Before: " + ary);

ary.reverse();

console.log("After: " + ary);
