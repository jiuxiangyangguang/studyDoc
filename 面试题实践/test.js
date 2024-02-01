var arr = [1,2,3,4,5,6,7,8,9,10]
for(let i = arr.length; i > 0; i--) {
    let index = Math.floor(Math.random() * i)
   [arr[i-1], arr[index]] = [arr[index], arr[i-1]]

}
    console.log(arr);
