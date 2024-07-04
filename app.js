document.addEventListener('DOMContentLoaded', () => {
    const arrayContainer = document.getElementById('arrayContainer');
    const sortButton = document.getElementById('sortButton');
    const newArrayButton = document.getElementById('newArrayButton');
    const algorithmSelect = document.getElementById('algorithm');
    const arraySizeSlider = document.getElementById('arraySize');
    const timeContainer = document.getElementById('timeContainer');

    let array = generateRandomArray(arraySizeSlider.value);
    renderArray(array, arrayContainer);

    sortButton.addEventListener('click', () => {
        const algorithm = algorithmSelect.value;
        const startTime = performance.now();
        sortArray([...array], algorithm, startTime);
    });

    newArrayButton.addEventListener('click', () => {
        array = generateRandomArray(arraySizeSlider.value);
        renderArray(array, arrayContainer);
    });

    arraySizeSlider.addEventListener('input', () => {
        array = generateRandomArray(arraySizeSlider.value);
        renderArray(array, arrayContainer);
    });

    function generateRandomArray(size) {
        const array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
        }
        return array;
    }

    function renderArray(array, container) {
        container.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${value * 3}px`;
            bar.style.width = `${600 / array.length}px`;

            const label = document.createElement('div');
            label.className = 'bar-label';
            label.innerText = value;
            bar.appendChild(label);

            container.appendChild(bar);
        });
    }

    async function sortArray(array, algorithm, startTime) {
        switch (algorithm) {
            case 'bubbleSort':
                await bubbleSort(array);
                break;
            case 'selectionSort':
                await selectionSort(array);
                break;
            case 'insertionSort':
                await insertionSort(array);
                break;
            case 'mergeSort':
                array = await mergeSort(array);
                break;
            case 'quickSort':
                await quickSort(array, 0, array.length - 1);
                break;
        }
        renderArray(array, arrayContainer);
        const endTime = performance.now();
        const timeTaken = (endTime - startTime).toFixed(2);
        timeContainer.innerText = `Time taken: ${timeTaken} ms`;
    }

    async function bubbleSort(array) {
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                highlightBars(j, j + 1);
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    swapBars(j, j + 1);
                    renderArray(array, arrayContainer);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                unhighlightBars(j, j + 1);
            }
        }
    }

    async function selectionSort(array) {
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                highlightBars(minIndex, j);
                if (array[j] < array[minIndex]) {
                    unhighlightBars(minIndex);
                    minIndex = j;
                    highlightBars(minIndex);
                }
                unhighlightBars(j);
            }
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            renderArray(array, arrayContainer);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async function insertionSort(array) {
        const n = array.length;
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                highlightBars(j, j + 1);
                array[j + 1] = array[j];
                j = j - 1;
                renderArray(array, arrayContainer);
                await new Promise(resolve => setTimeout(resolve, 50));
                unhighlightBars(j + 1);
            }
            array[j + 1] = key;
            renderArray(array, arrayContainer);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async function mergeSort(array) {
        if (array.length < 2) return array;
        const middle = Math.floor(array.length / 2);
        const left = await mergeSort(array.slice(0, middle));
        const right = await mergeSort(array.slice(middle));

        return merge(left, right);
    }

    async function merge(left, right) {
        let result = [], leftIndex = 0, rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            highlightBars(leftIndex, rightIndex);
            if (left[leftIndex] < right[rightIndex]) {
                result.push(left[leftIndex++]);
            } else {
                result.push(right[rightIndex++]);
            }
            renderArray([...result, ...left.slice(leftIndex), ...right.slice(rightIndex)], arrayContainer);
            await new Promise(resolve => setTimeout(resolve, 50));
            unhighlightBars(leftIndex - 1, rightIndex - 1);
        }

        while (leftIndex < left.length) {
            result.push(left[leftIndex++]);
            renderArray([...result, ...left.slice(leftIndex), ...right.slice(rightIndex)], arrayContainer);
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        while (rightIndex < right.length) {
            result.push(right[rightIndex++]);
            renderArray([...result, ...left.slice(leftIndex), ...right.slice(rightIndex)], arrayContainer);
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        return result;
    }

    async function quickSort(array, low, high) {
        if (low < high) {
            let pi = await partition(array, low, high);
            await quickSort(array, low, pi - 1);
            await quickSort(array, pi + 1, high);
        }
    }

    async function partition(array, low, high) {
        let pivot = array[high];
        let i = (low - 1);
        for (let j = low; j < high; j++) {
            highlightBars(j, high);
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                swapBars(i, j);
                renderArray(array, arrayContainer);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            unhighlightBars(j);
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        swapBars(i + 1, high);
        renderArray(array, arrayContainer);
        await new Promise(resolve => setTimeout(resolve, 50));
        return (i + 1);
    }

    function highlightBars(...indices) {
        indices.forEach(index => {
            const bar = arrayContainer.children[index];
            if (bar) bar.classList.add('bar-highlight');
        });
    }

    function unhighlightBars(...indices) {
        indices.forEach(index => {
            const bar = arrayContainer.children[index];
            if (bar) bar.classList.remove('bar-highlight');
        });
    }

    function swapBars(index1, index2) {
        const bar1 = arrayContainer.children[index1];
        const bar2 = arrayContainer.children[index2];
        if (bar1) bar1.classList.add('bar-swap');
        if (bar2) bar2.classList.add('bar-swap');
        setTimeout(() => {
            if (bar1) bar1.classList.remove('bar-swap');
            if (bar2) bar2.classList.remove('bar-swap');
        }, 100);
    }
});
