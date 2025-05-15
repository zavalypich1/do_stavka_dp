
const products = [
    { category: "Курятина", items: [
        { name: "Ціла курка", price: 110 },
        { name: "Філе", price: 160 },
        { name: "Гомілка", price: 145 },
        { name: "Стегно", price: 145 },
        { name: "Крила", price: 120 },
        { name: "Шия, спинка (на суп)", price: 60 }
    ]},
    { category: "Свинина", items: [
        { name: "Напівтуша", price: 125 },
        { name: "Шия (без кістки)", price: 240 },
        { name: "Лопатка", price: 165 },
        { name: "Ошийок (на гуляш)", price: 170 },
        { name: "Грудинка (з кісткою)", price: 140 },
        { name: "Корейка (на ребрі)", price: 180 },
        { name: "Філе (вирізка)", price: 264 },
        { name: "Підчеревина (бекон)", price: 160 },
        { name: "Сало", price: 110 },
        { name: "Кістка, обрізки (на суп)", price: 60 }
    ]},
    { category: "Риба", items: [
        { name: "Сом від 5+ кг", price: 150 },
        { name: "Короп 5–10 кг", price: 130 },
        { name: "Короп 10+ кг", price: 160 },
        { name: "Товстолоб 5–10 кг", price: 75 },
        { name: "Товстолоб 10+ кг", price: 100 },
        { name: "Карась 0.5–1 кг", price: 60 },
        { name: "Лящ від 1.5+ кг", price: 55 },
        { name: "Судак", price: 170 },
        { name: "Щука", price: 170 }
    ]}
];

const priceList = document.getElementById('price-list');
const productSelection = document.getElementById('productSelection');
let totalElement = document.getElementById('total');

products.forEach(group => {
    let category = document.createElement('h3');
    category.textContent = group.category;
    priceList.appendChild(category);

    group.items.forEach(item => {
        let p = document.createElement('p');
        p.textContent = `${item.name} — ${item.price} грн/кг`;
        priceList.appendChild(p);

        let label = document.createElement('label');
        label.innerHTML = `${item.name} (${item.price} грн/кг): <input type='number' min='0' step='0.1' name='${item.name}' data-price='${item.price}'>`;
        productSelection.appendChild(label);
    });
});

document.getElementById('orderForm').addEventListener('input', () => {
    let inputs = document.querySelectorAll('#productSelection input');
    let total = 0;
    inputs.forEach(input => {
        let price = parseFloat(input.getAttribute('data-price'));
        let qty = parseFloat(input.value) || 0;
        total += price * qty;
    });
    totalElement.textContent = total.toFixed(2);
});

document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll('#productSelection input');
    let orderText = 'Замовлення:
';
    let total = 0;

    inputs.forEach(input => {
        let qty = parseFloat(input.value) || 0;
        if (qty > 0) {
            let price = parseFloat(input.getAttribute('data-price'));
            let name = input.name;
            total += price * qty;
            orderText += `${name}: ${qty} кг x ${price} грн = ${qty * price} грн
`;
        }
    });

    orderText += `Всього: ${total.toFixed(2)} грн
`;
    orderText += `Оплата: ${document.querySelector('select[name="payment"]').value}`;

    const telegramToken = '7808202237:AAEH5EiXU6o13f0zsmqBJZrCFQn18NFIRk4';
    const chatId = '41920817';

    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: orderText
        })
    });

    const status = document.getElementById('orderStatus');
    if (response.ok) {
        status.textContent = 'Замовлення надіслано!';
    } else {
        status.textContent = 'Помилка при надсиланні.';
    }
});
