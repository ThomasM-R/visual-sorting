/**********************************************************
* Project: Sorting Algorithms (with visualizations)
*
* Author: Thomas Moraine-Radenac (made visualization, and did some algorithms)
* Collaborators: Eyal Ben-Dov (made most of the sorting algorithms in JS)
*
* Description: A neat visualization of what the selection and insertsion sorting algorithms do to a list.
*
* Academic Integrity: I pledge that this program represents
* my own work. I received help from [] in designing and debugging my program.
**********************************************************/

// generates random order array
//Made by Thomas™
function createRandomSequence(size) {
	var arr = new Array();
	let orderedArr = new Array();
	for (let i = 0; i < size; i++) {
		orderedArr.push(i);
	}
	for (let i = 0; i < size; i++) {
		let index = Math.floor(Math.random() * orderedArr.length);
		arr.push(orderedArr[index]);
		orderedArr.splice(index, 1);
	}
	return arr;
}

const canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var displayIteration = 0;
var delay;
var frameskip = 0;
var time;
var renderTime = 0;
var startRenderTime;

/** Thomas made this */
async function displayArray(arr, markers = [], paused = false) {
	startRenderTime = new Date() / 1000;
	if (delay == 0 && !paused) {
		return true;
	}
	if (window.displayIteration != 0 && !paused) {
		window.displayIteration--;
		return true;
	}
	window.displayIteration = frameskip;
	
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	for (let x = 0; x < canvas.width; x++) {
		// get item of array at x
		let index = Math.floor(x * (arr.length / canvas.width))
		let value = arr[index];

		// coloration
		ctx.fillStyle = `HSL(${(value / arr.length) * 360}deg, 100%, 85%)`;
		//ctx.fillStyle = "white";

		// draw line
		ctx.fillRect(x, canvas.height, 1, -(value / arr.length) * canvas.height);
	}
	// markers
	for (let marker of markers) {
		ctx.fillStyle = marker.color;
		if (marker.y) {
			ctx.fillRect(0, canvas.height - (marker.y / arr.length) * canvas.height, canvas.width, Math.ceil(canvas.height / arr.length));
		} else if (marker.x) {
			ctx.fillRect(marker.x * (canvas.width / arr.length), 0, Math.ceil(canvas.width / arr.length), canvas.height);
		}
	}
	
	if (!paused) {
		showMessages([{
			text: `sorting... real time - render time = sorting time: ${Math.floor((new Date() / 1000 - time - renderTime) * 1000) / 1000}s`,
			color: "#ffffff"
		}, {
			text: "markers: " + JSON.stringify(markers),
			color: "#ffffff"
		}]);
	}
	if (delay == 0) {
		return true;
	} else {
		return new Promise(resolve => setTimeout(() => {
			renderTime += (new Date() / 1000) - startRenderTime;
			resolve();
		}, delay));
	}
}

function showMessages(messages) {
	for (let i = 0; i < messages.length; i++) {
		let message = messages[i];
		ctx.font = "12px monospace";
		ctx.fillStyle = message.color;
		ctx.fillText(message.text, 195, 20 + 16 * (i));
	}
}

/* ALGORITHMS */

// credit to Eyal
async function eyalSort(array) {
	let edditedList = array.map((x) => x);
	let newList = [];
	for (let i = 0; i < array.length; i++) {
		let min = edditedList[0];
		for (item of edditedList) {
			if (item < min) {
				min = item;
			}
			await displayArray(newList.concat(edditedList), [
				{ y: min, color: "cyan" },
				{ x: i, color: "red" }
			]);
		}
		newList.push(min);
		let index = edditedList.indexOf(min)
		edditedList.splice(index, 1);
	}
	return newList;
}

// credit to Eyal (again)
async function selectionSort(array) {
	for (let i = 0; i < array.length; i++) {
		let mIndex = i;
		for (let j = i + 1; j < array.length; j++) {
			if (array[j] <= array[mIndex]) {
				mIndex = j
			}
			await displayArray(array, [
				{ x: i, color: "cyan" },
				{ x: j, color: "green" },
				{ x: mIndex, color: "red" },
				{ y: array[mIndex], color: "red" },
			]);
		}
		let temp = array[mIndex];
		array[mIndex] = array[i];
		array[i] = temp;
	}
	return array;
}

// credit to Eyal (episode 3)
async function insertionSort(array) {
	for (let i = 1; i < array.length; i++) {
		let swappedCount = 0;
		while (array[i - swappedCount] < array[i - 1 - swappedCount] && i - 1 - swappedCount >= 0) {
			let temp = array[i - swappedCount - 1];
			array[i - swappedCount - 1] = array[i - swappedCount];
			array[i - swappedCount] = temp;
			swappedCount += 1;
			await displayArray(array, [
				{ x: i - swappedCount, color: "red"},
				{ y: array[i - swappedCount], color: "red" },
				{ x: i, color: "cyan" }
			]);
		}
	}
	return array;
}

// credit to Thomas™
async function bubbleSort(array) {
	for (let i = 0; i < array.length - 1; i++) {
		for (let j = 0; j < array.length - i - 1; j++) {
			if (array[j] > array[j + 1]) {
				let temp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = temp;
			}
			await displayArray(array, [
				{ x: array.length - i, color: "cyan" },
				{ x: j, color: "red" },
				{ y: array[j + 1], color: "red"}
			]);
		}
	}
	return array;
}

// credit to Thomas™
async function bogoSort(array) {
	let sorted = [];
	for (let i = 0; i < array.length; i++) {
		sorted.push(i);
	}
	while (sorted.toString() != array.toString()) {
		array = createRandomSequence(array.length);
		await displayArray(array); 
	}
	return array;
}

// credit to Thomas™
async function gnomeSort(array) {
	let index = 0;
	while (index < array.length) {
		if (index == 0) {index++;}
		if (array[index - 1] <= array[index]) {
			index++;
		} else {
			let temp = array[index - 1];
			array[index - 1] = array[index];
			array[index] = temp;
			index--;
		}
		await displayArray(array, [
			{x: index, color: "red"},
		]);
	}
	return array;
}

// credit to Thomas
async function stoogeSort(array, last, first) {
	if (last >= first)
		return array;
	if (array[last] > array[first]) {
		let temp = array[last];
		array[last] = array[first];
		array[first] = temp;
		await displayArray(array, [
			{x: last, color: "red"},
			{x: first, color: "cyan"}
		]);
	}
	if (first - last + 1 > 2) {
		let temp = Math.floor((first - last + 1) / 3);
		array = await stoogeSort(array, last, first - temp);
		array = await stoogeSort(array, last + temp, first);
		array = await stoogeSort(array, last, first - temp);
	}
	return array;
}

// credit to Eyal
async function mergeSort(array) {
	//No clue if it works, also no display code
	if (array.length == 1)
		return array;
	let left = await mergeSort(array.slice(0, array.length/2));
	let right = await mergeSort(array.slice(array.length/2, array.length));

	// fixed issue below
	let newArr = [];
	while (left.length != 0 && right.length != 0) {
		await displayArray(newArr);
		if (left[0] < right[0]) {
			newArr.push(left.shift());
		} else {
			newArr.push(right.shift());
		}
	}
	while (left.length != 0) {
		newArr.push(left.shift());
	}
	while (right.length != 0) {
		newArr.push(right.shift());
	}
	return newArr;
}

// credit to Thomas
async function quickSort(array, low, high) {
	if (low < high) {

		// partition
		let pivot = array[high];
		let i = low - 1;
		for (let j = low; j < high; j++) {
			if (array[j] <= pivot) {
				i++;
				let temp = array[i]
				array[i] = array[j];
				array[j] = temp;
				await displayArray(array, [
					{x: i, color: "cyan"},
					{x: j, color: "cyan"},
					{x: pivot, color: "red"},
					{x: high, color: "red"},
					{x: low, color: "cyan"},
				]);
			}
		}
		let temp = array[i + 1];
		array[i + 1] = array[high];
		array[high] = temp;
		let pi = i + 1;

		array = await quickSort(array, low, pi - 1);
		array = await quickSort(array, pi + 1, high);
	}
	return array;
}

// credit to Thomas
async function smartDumbSort(array) {
	// essentially bogosort but it iterates through all possible shuffling orders of the original array instead of randomly shuffling it
	let factorial = n => (n <= 1) ? 1 : n * factorial(n-1);
	
	let getPermutation = (array, index) => {
		// based on this: https://www.geeksforgeeks.org/write-a-c-program-to-print-all-permutations-of-a-given-string/
		let originArr = array.slice(); // copy array
		let fixedArr = [];
		while (originArr.length > 0) {
			fixedArr.push(originArr[index % originArr.length]);
			originArr.splice(index % originArr.length, 1);
			index = Math.floor(index / (originArr.length + 1));
		}
		return fixedArr;
	}

	for (let i = 0; true; i++) {
		let candidate = getPermutation(array, i);
		await displayArray(candidate);
		let j = 0;
		while (j < candidate.length - 1) {
			if (candidate[j] >= candidate[j + 1]) break;
			else j++;
		}
		if (j == candidate.length - 1)
			return candidate;
	}
}

/* MAIN™ */

// Thomas made this™
(async () => {
	// you can get it up to 10000-ish™
	var numElements = +window.prompt('Choose number of items (100 - 1000 recommended)');
	if (numElements <= 0 || numElements == NaN) {
		showMessages([{
			text: "error: bad number of items (" + numElements + "), reload to try again",
			color: "#ff0000"
		}]);
		return;
	}
	
	var array = createRandomSequence(numElements);
	await displayArray(array, [], true);

	delay = +window.prompt('Choose the delay in milliseconds (10 - 50 recommended, or 0 to sort instantly)');
	if (delay < 0 || delay == NaN) {
		showMessages([{
			text: "error: bad delay (" + delay + "), reload to try again",
			color: "#ff0000"
		}]);
		return;
	}
	if (delay != 0) {
		frameskip = +window.prompt('Choose how much frames should be skipped (useful for large arrays)');
		if (frameskip < 0 || frameskip == NaN) {
			showMessages([{
				text: "error: bad frameskip (" + delay + "), reload to try again",
				color: "#ff0000"
			}]);
			return;
		}
	} else {
		frameskip = 0;
	}
	
	console.log(array);
	let algorithm = window.prompt('Choose Algorithm:\n0 - Javascript Sort (does not animate)\n1 - EyalSort™\n2 - Selection Sort\n3 - Insertion Sort\n4 - Bubble Sort\n5 - Gnome Sort\n6 - Stooge Sort\n7 - Quick Sort\n8 - Merge Sort\n9 - Bogo Sort')
	time = new Date() / 1000;
	let promise;
	switch (algorithm) {
		case "0": promise = (async () => {return await array.toSorted((a, b) => {return a - b;})})(); break;
		case "1": promise = eyalSort(array.map((x) => x)); break;
		case "2": promise = selectionSort(array.map((x) => x)); break;
		case "3": promise = insertionSort(array.map((x) => x)); break;
		case "4": promise = bubbleSort(array.map((x) => x)); break;
		case "5": promise = gnomeSort(array.map((x) => x)); break;
		case "6": promise = stoogeSort(array.map((x) => x), 0, array.length - 1); break;
		case "7": promise = quickSort(array.map((x) => x), 0, array.length - 1); break;
		case "8": promise = mergeSort(array.map((x) => x)); break;
		case "9": promise = bogoSort(array.map((x) => x)); break;
		case "10": promise = smartDumbSort(array.map((x) => x)); break;
		default:
			showMessages([{
				text: "error: sort algorithm '" + algorithm + "' does not exist, reload to try again",
				color: "#ff0000"
			}]);
	}
	
	// this runs after sorting animation
	promise.then((array) => {
		displayArray(array, [], true);
		showMessages([{
			text: "sorting complete. took " + Math.floor((new Date() / 1000 - time - renderTime) * 1000) / 1000 + " seconds.",
			color: "#ffffff"
		}]);
		console.log(array);
	});
})();

/*
insertionSort(array).then((array) => {
	displayArray(array);
	console.log(array);
});
*/


//window.alert([5, 3, 8, 1, 23, 5, -1, 6]);
// this code alerts async returns
//insertionSort([5, 3, 8, 1, 23, 5, -1, 6]).then((arr) => {window.alert(arr);});
