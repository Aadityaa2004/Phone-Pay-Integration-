export async function AddLocalStorage(data : string[]){
    localStorage.setItem("cart", JSON.stringify(data))
}

export async function UpdateLocalStorage(data : string[]){
    localStorage.setItem("cart", JSON.stringify(data))
}

export async function RemoveLocalStorage(){
    localStorage.removeItem("cart")
}

export async function GetLocalStorage(){
    localStorage.getItem("cart")
}