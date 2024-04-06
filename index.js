const form = document.getElementById("form");
let totalValue = 0;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const price = e.target.price.value;
    const product = e.target.product.value;
    const order = { price: price, product: product };

    try {
        const response = await axios.post("https://crudcrud.com/api/1ea2491c24e745bc92a80c245d704922/orders", order);
        addToList(response.data);
        e.target.reset();
    } catch (err) {
        console.log(err);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get("https://crudcrud.com/api/1ea2491c24e745bc92a80c245d704922/orders");
        for (let i = 0; i < response.data.length; i++) {
            await showOrders(response.data[i]);
            await updateTotalValue(parseFloat(response.data[i].price));
        }
    } catch (err) {
        console.log(err);
    }
});

async function addToList(order) {
    await showOrders(order);
    await updateTotalValue(parseFloat(order.price));
}

async function showOrders(order) {
    const list = document.getElementById("list");
    const listItem = document.createElement("li");
    listItem.textContent = `Product: ${order.product}, Price: ${order.price}`;
    listItem.id = order._id;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn-del");
    deleteButton.addEventListener("click", () => handleDelete(order._id, parseFloat(order.price)));

    listItem.appendChild(deleteButton);
    list.appendChild(listItem);
}

async function handleDelete(id, price) {
    try {
        await axios.delete(`https://crudcrud.com/api/1ea2491c24e745bc92a80c245d704922/orders/${id}`);
        const listItem = document.getElementById(id);
        listItem.remove();
        await updateTotalValue(-price);
    } catch (err) {
        console.log(err);
    }
}

function updateTotalValue(priceDifference) {
    totalValue += priceDifference;
    const totalValueElement = document.getElementById('total-value');
    totalValueElement.textContent = `Total Value Worth of Product: ${totalValue.toFixed(2)}`;
}
