const searchForm = document.querySelector("form");
const loader = document.querySelector(".loading");
const error = document.querySelector(".error");
const searchbox = document.querySelector("#search-box");
const results = document.querySelector(".results");

let loading = false;

searchForm.onsubmit = async function(e) {
    e.preventDefault();
    console.log(e)
    if(loading) return;

    loader.classList.add("visible");
    error.classList.remove("visible");
    results.classList.remove("visible");

    results.innerHTML = "";

    window.scrollTo({
        behavior:"smooth",
        top:document.body.scrollHeight
    })

    try {
        await loadResults(searchbox.value);
        loader.classList.remove("visible");
        loading = false;
        results.classList.add("visible");

    } catch(err) {
        loader.classList.remove("visible");
        loading = false;
    }
    
}

async function loadResults(value) {
    if(value.length === 0) {
        alert("Enter the search term.!");
    } else {
        let result = await fetch("http://127.0.0.1:9000/scrape?s="+value);
        let res = await result.json();
        if(res?.error) {
            throw Error(res.error);
        } else {
            let data = res.sort((a,b) => !!a.result - !!b.result);
            for(let store of data) {
                let storediv = document.createElement("div");
                storediv.classList.add("store");
                storediv.innerHTML += `<h3>${store.name}</h3>`;
                if(store.result) {

                    let resultcontainer = document.createElement("div");
                    resultcontainer.classList.add("results-container");

                    for(let product of store.result) {
                        let productdiv = document.createElement("a");
                        productdiv.classList.add("product");
                        productdiv.href = product.link;
                        productdiv.target = "_blank";
                        productdiv.innerHTML = `
                            <img src="${product.product_image}" />
                            <span class='product_name'>${product.product_name}</span>
                            <span class='product_price'>${product.product_price}</span>
                        `;
                        resultcontainer.appendChild(productdiv);
                    }
                    storediv.appendChild(resultcontainer);
                } else {
                    storediv.innerHTML += "<div class='empty'>Search not found.</div>";
                }
                results.appendChild(storediv);
            }
            
            
        }
    }
}