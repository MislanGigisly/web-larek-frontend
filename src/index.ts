import './scss/styles.scss';

import {UserData} from "./components/DataModels/UserData";
import {BasketData} from "./components/DataModels/BasketData";
import {CardsData} from "./components/DataModels/CardsData";
import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {PageUI} from "./components/PageUI";
import {CardUI} from "./components/CardUI";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {ModalUI} from "./components/common/ModalUI";
import {BasketUI} from "./components/common/BasketUI";
import {IOrderForm, ICardsData, CardItem} from "./types";
import {ContactsUI} from "./components/ContactsUI";
import {PurchaseUI} from "./components/PurchaseUI";
import {CompliteOrderUI} from "./components/common/CompliteOrderUI";

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const userModel = new UserData({}, events);
const basketModel = new BasketData({}, events);
const cardsModel = new CardsData({}, events);

// Глобальные контейнеры
const page = new PageUI(document.body, events);
const modal = new ModalUI(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new BasketUI(cloneTemplate(basketTemplate), events);
const order = new PurchaseUI(cloneTemplate(orderTemplate), events);
const contacts = new ContactsUI (cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<ICardsData>('items:changed', () => {
    page.catalog = cardsModel.getCardList().map(item => {
        const card = new CardUI('card', cloneTemplate(cardCatalogTemplate),{
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: item.price,
        });
    });
});

// Открыть выбранную карточку
events.on('card:select', (item: CardItem) => {
    const showItem = (item: CardItem) => {
        const card = new CardUI('card', cloneTemplate(cardPreviewTemplate),{
            onClick: () => {
                events.emit('item:added', item);
                card.button = (!basketModel.getBasketList().includes(item.id))
                }
            })
        card.button = (!basketModel.getBasketList().includes(item.id));
        if (item.price == null) {
            card.button = (basketModel.getBasketList().includes(item.id))
        }
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                description: item.description.split("\n"),
                category: item.category,
                price: item.price
            })
        });
    };

    if (item) {
        api.getLotItem(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

// Открыть корзину
events.on('basket:open', () => {
    basket.selected = basketModel.getBasketList();
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});

//прерисовка корзины при изменении
events.on('basket:changed',()=>{
    const basketContents = basketModel.getBasketList();
    page.counter = basketContents.length;
    basket.selected = basketContents;
    basket.total = basketModel.getTotal();
    basket.items = cardsModel.getCard(basketContents).map((item: CardItem,index)=>{
        const good = new CardUI('card', cloneTemplate(cardBasketTemplate),{
            onClick:()=> {
                events.emit('items:removed', item);
            }
        });
        return good.render({
            title: item.title,
            price: item.price,
            priority: index +1
        })      
    })
})

// Добавление товара в корзину
events.on('item:added',(item: CardItem) => {
    basketModel.toggleOrderedLot(item.id, true, item.price)
    basket.total = basketModel.getTotal()
})

//удаление товара из корзины
events.on('items:removed', (item: CardItem)=>{
    basketModel.toggleOrderedLot(item.id, !basketModel.getCheckGoods(), item.price);
    basket.total = basketModel.getTotal()
})

// Открыть форму заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: []
        })
    });
});

// переход от формы заказа к контактам
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',    
            email: '',
            valid: false,
            errors: []
        })
    });

});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    const userData = userModel.getAllUserData()
    const orderData = Object.assign(userData,{
        total: basketModel.getTotal(),
        items: basketModel.getBasketList(),
        })
        console.log(orderData)
    api.orderLots(orderData)
        .then((result) => {
            const success = new CompliteOrderUI(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    basketModel.clearBasket();
                    userModel.clearForm();
                    order.unpushButtons();
                }
            });
            modal.render({
                content: success.render({
                    total: basketModel.getTotal()
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone, address, payment } = errors;
    order.valid = !payment && !address;
    contacts.valid = !email && !phone;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей в модальном окне заказа
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    userModel.setOrderField(data.field, data.value);
});
// Изменилось одно из полей в модальном окне контактов
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    userModel.setContactsField(data.field, data.value);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем карточки с сервера
api.getLotList()
    .then(cardsModel.setcards.bind(cardsModel))
    .catch(err => {
        console.error(err);
    });
