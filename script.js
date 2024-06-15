//Locomotive Scroll
function locomotiveScroll(){
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
      el: document.querySelector("#main"), 
      smooth: true
    });
    
    locoScroll.on("scroll", ScrollTrigger.update);
    
    ScrollTrigger.scrollerProxy("#main", {
      scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
      }, 
      getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
      },
      pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    
    ScrollTrigger.refresh();
}locomotiveScroll()
//........................................................................

let body = document.querySelector('body'); //body
let iconCart = document.querySelector('.icon-cart'); //carrinho
let closeCart = document.querySelector('.close'); //close btn do carrinho
let iconCartSpan = document.querySelector('.cart span') //span num de itens
let listCartHTML = document.querySelector('.listCart') //lista de prod. do carrinho
let listProductsHTML = document.querySelector('.listProduct'); //cartão do produto
let listProduct = [];
let carts = [];


//CART EVENTS
function setupCartEvents() {
    const toggleCart = () => body.classList.toggle('showCart');
    
    iconCart.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
}setupCartEvents();


//products cards
const addDataToHTML = () => {
    listProductsHTML.innerHTML = '';
    if(listProduct.length > 0){
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;

            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">
                    Add to Cart
                </button>
            `;
            listProductsHTML.appendChild(newProduct);
        })
    }
}

//add ao carrinho
listProductsHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id)
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity +1;
    }
    addCartToHTML()
    addCartToMemory()
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

//ENCONTRAR AS INFS DO PRODUTO
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    
    if (carts.length > 0){
        carts.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            
            
            let positionProduct = listProduct.findIndex((value) => value.id == item.product_id);
            let info = listProduct[positionProduct];
            listCartHTML.appendChild(newItem);

            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}" alt="">
                </div>

                <div class="name">
                ${info.name}
                </div>

                <div class="quantity" data-id="${item.product_id}">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>

                <div class="totalPrice">
                    $${info.price * item.quantity}
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

//+ and -, cart buttons
listCartHTML.addEventListener('click', (event) =>{
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})

//excluir e add itens
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type){
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;

            default:
                let valueChange = carts[positionItemInCart].quantity -1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

//catch products in .json file
const initApp = () =>{
    fetch('products.json')
    .then (response => response.json())
    .then(data => {
        listProduct = data;
        addDataToHTML(); 

        //get cart from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML(); 
        }
    })
}
initApp();
